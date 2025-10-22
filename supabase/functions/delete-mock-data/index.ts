import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface DeleteMockDataResponse {
  success: boolean;
  message: string;
  deletedCounts?: {
    bankAccounts: number;
    bankStatements: number;
    transactions: number;
    receipts: number;
    reconciliationMatches: number;
    badgeProgress: number;
    educationalProgress: number;
    transactionInsights: number;
    chatHistories: number;
  };
  error?: string;
}

// Rate limiting storage (in-memory, simple approach)
const rateLimitMap = new Map<string, number>();

function checkRateLimit(userId: string): boolean {
  const lastRequest = rateLimitMap.get(userId);
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  if (lastRequest && now - lastRequest < oneHour) {
    return false; // Rate limited
  }

  rateLimitMap.set(userId, now);
  return true; // Allowed
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-supabase-api-version',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Method not allowed',
        error: 'Only POST requests are allowed'
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    // Initialize Supabase client with anon key for auth verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authorization required',
          error: 'Missing or invalid authorization header'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Verify JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid authentication',
          error: 'Invalid or expired token'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Check rate limiting
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Rate limit exceeded',
          error: 'Too many delete requests. Please wait before trying again. Rate limit: 1 request per hour.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    console.log(`Starting mock data deletion for user: ${user.id}`);

    // Create service role client for database operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Track deletion counts
    const deletedCounts = {
      bankAccounts: 0,
      bankStatements: 0,
      transactions: 0,
      receipts: 0,
      reconciliationMatches: 0,
      badgeProgress: 0,
      educationalProgress: 0,
      transactionInsights: 0,
      chatHistories: 0,
    };

    // Delete in order to respect foreign key constraints
    // 1. Delete reconciliation matches first (references transactions and receipts)
    const { count: reconciliationCount, error: reconciliationError } = await supabaseAdmin
      .from('reconciliation_matches')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (reconciliationError) {
      console.error('Error deleting reconciliation matches:', reconciliationError);
    } else {
      deletedCounts.reconciliationMatches = reconciliationCount || 0;
    }

    // 2. Delete transactions
    const { count: transactionsCount, error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (transactionsError) {
      console.error('Error deleting transactions:', transactionsError);
    } else {
      deletedCounts.transactions = transactionsCount || 0;
    }

    // 3. Delete receipts
    const { count: receiptsCount, error: receiptsError } = await supabaseAdmin
      .from('receipts')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (receiptsError) {
      console.error('Error deleting receipts:', receiptsError);
    } else {
      deletedCounts.receipts = receiptsCount || 0;
    }

    // 4. Delete bank statements
    const { count: statementsCount, error: statementsError } = await supabaseAdmin
      .from('bank_statements')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (statementsError) {
      console.error('Error deleting bank statements:', statementsError);
    } else {
      deletedCounts.bankStatements = statementsCount || 0;
    }

    // 5. Delete bank accounts
    const { count: accountsCount, error: accountsError } = await supabaseAdmin
      .from('bank_accounts')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (accountsError) {
      console.error('Error deleting bank accounts:', accountsError);
    } else {
      deletedCounts.bankAccounts = accountsCount || 0;
    }

    // 6. Delete gamification data
    const { count: badgeProgressCount, error: badgeProgressError } = await supabaseAdmin
      .from('user_badge_progress')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (badgeProgressError) {
      console.error('Error deleting badge progress:', badgeProgressError);
    } else {
      deletedCounts.badgeProgress = badgeProgressCount || 0;
    }

    const { count: educationalProgressCount, error: educationalProgressError } = await supabaseAdmin
      .from('user_educational_progress')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (educationalProgressError) {
      console.error('Error deleting educational progress:', educationalProgressError);
    } else {
      deletedCounts.educationalProgress = educationalProgressCount || 0;
    }

    // 7. Delete transaction insights
    const { count: insightsCount, error: insightsError } = await supabaseAdmin
      .from('transaction_insights')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);
    
    if (insightsError) {
      console.error('Error deleting transaction insights:', insightsError);
    } else {
      deletedCounts.transactionInsights = insightsCount || 0;
    }

    // 8. Delete chat histories
    const { count: chatCount, error: chatError } = await supabaseAdmin
      .from('n8n_chat_histories')
      .delete({ count: 'exact' })
      .eq('session_id', user.id); // Assuming session_id maps to user_id
    
    if (chatError) {
      console.error('Error deleting chat histories:', chatError);
    } else {
      deletedCounts.chatHistories = chatCount || 0;
    }

    const totalDeleted = Object.values(deletedCounts).reduce((sum, count) => sum + count, 0);

    console.log(`Mock data deletion completed for user: ${user.id}. Total records deleted: ${totalDeleted}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully deleted all mock data. ${totalDeleted} records removed.`,
        deletedCounts,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Unexpected error during mock data deletion:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: 'An unexpected error occurred during data deletion',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
