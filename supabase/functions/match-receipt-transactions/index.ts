// supabase/functions/match-receipt-transactions/index.ts
// Use OpenAI to find top 5 matching transactions for a receipt

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchRequest {
  receipt_id: string;
}

interface AIMatchResult {
  transaction_id: string;
  confidence: number;
  reason: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT token and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { receipt_id }: MatchRequest = await req.json();

    if (!receipt_id) {
      return new Response(
        JSON.stringify({ error: 'Missing receipt_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch receipt data
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .select('id, user_id, merchant, receipt_date, amount, tax, ocr_data')
      .eq('id', receipt_id)
      .single();

    if (receiptError || !receipt) {
      return new Response(
        JSON.stringify({ error: 'Receipt not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user owns this receipt
    if (receipt.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: User does not own this receipt' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch unreconciled transactions (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, transaction_date, description, amount, balance, bank_account_id')
      .eq('user_id', user.id)
      .eq('status', 'unreconciled')
      .gte('transaction_date', ninetyDaysAgo.toISOString().split('T')[0])
      .order('transaction_date', { ascending: false })
      .limit(100);

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch transactions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!transactions || transactions.length === 0) {
      console.log('No unreconciled transactions found for matching');
      return new Response(
        JSON.stringify({
          success: true,
          matches: [],
          message: 'No unreconciled transactions available for matching',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI matching service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build OpenAI prompt
    const receiptInfo = `
Receipt:
- Merchant: ${receipt.merchant}
- Date: ${receipt.receipt_date}
- Amount: $${(receipt.amount / 100).toFixed(2)} AUD
- Tax (GST): $${(receipt.tax / 100).toFixed(2)} AUD
`;

    const transactionsList = transactions.map((t, i) =>
      `${i + 1}. ID: ${t.id}, Date: ${t.transaction_date}, Description: "${t.description}", Amount: $${Math.abs(t.amount / 100).toFixed(2)} AUD`
    ).join('\n');

    const prompt = `You are a financial reconciliation assistant for an Australian household finance app.

Given the following receipt and list of bank transactions, identify the top 5 most likely matching transactions.

${receiptInfo}

Transactions:
${transactionsList}

For each match, provide:
1. transaction_id (exact ID from the list)
2. confidence (0.0 to 1.0, where 1.0 is perfect match)
3. reason (brief explanation of why it matches)

Matching criteria:
- Date proximity (transactions usually occur on same day or within 2-3 days of receipt)
- Amount similarity (exact match preferred, but amounts may differ slightly due to fees/rounding)
- Merchant name similarity (fuzzy matching on transaction description)
- Consider negative amounts in transactions represent debits (money spent)

Return ONLY valid JSON array (no markdown, no code blocks), maximum 5 matches:
[
  { "transaction_id": "uuid", "confidence": 0.95, "reason": "Same merchant and exact amount on same date" },
  ...
]

If no good matches found (all confidence <0.3), return empty array: []
`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using mini for cost efficiency
        messages: [
          { role: 'system', content: 'You are a financial reconciliation assistant. Return only valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3, // Low temperature for consistent results
        max_tokens: 1000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI matching service failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiResponseText = openaiData.choices[0]?.message?.content || '[]';

    // Parse AI response
    let aiMatches: AIMatchResult[];
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      aiMatches = JSON.parse(cleanedResponse);

      // Validate structure
      if (!Array.isArray(aiMatches)) {
        throw new Error('AI response is not an array');
      }

      // Validate each match
      aiMatches = aiMatches.filter(match =>
        match.transaction_id &&
        typeof match.confidence === 'number' &&
        match.confidence >= 0 &&
        match.confidence <= 1 &&
        match.reason
      );

      // Limit to top 5 and sort by confidence
      aiMatches = aiMatches
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('AI response was:', aiResponseText);
      aiMatches = [];
    }

    // Store AI match suggestions in database
    const insertPromises = aiMatches.map(match =>
      supabase
        .from('ai_match_suggestions')
        .insert({
          user_id: user.id,
          receipt_id: receipt.id,
          transaction_id: match.transaction_id,
          confidence_score: match.confidence,
          match_reason: match.reason,
        })
        .select()
    );

    const insertResults = await Promise.allSettled(insertPromises);

    const successfulInserts = insertResults.filter(r => r.status === 'fulfilled').length;
    const failedInserts = insertResults.filter(r => r.status === 'rejected');

    if (failedInserts.length > 0) {
      console.error('Some AI match suggestions failed to insert:', failedInserts);
    }

    console.log(`AI matching completed: ${successfulInserts}/${aiMatches.length} suggestions stored for receipt_id: ${receipt_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        receipt_id,
        matches_found: successfulInserts,
        matches: aiMatches,
        message: `Found ${successfulInserts} AI-suggested matches`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in match-receipt-transactions function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
