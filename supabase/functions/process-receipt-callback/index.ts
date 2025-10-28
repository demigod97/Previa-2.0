// supabase/functions/process-receipt-callback/index.ts
// Receive OCR results from n8n and store in database

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReceiptExtraction {
  merchant: {
    name: string;
    address?: string;
    phone?: string;
    abn?: string;
    confidence_score: number;
  };
  transaction: {
    date: string;
    time?: string;
    receipt_number?: string;
    confidence_score: number;
  };
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    confidence_score: number;
  }>;
  payment: {
    method?: string;
    subtotal: number;
    tax: number;
    total: number;
    confidence_score: number;
  };
  tax: {
    gst: number;
    gst_inclusive: boolean;
    confidence_score: number;
  };
  overall_confidence: number;
  metadata: {
    pages: number;
    extracted_at: string;
  };
}

interface CallbackRequest {
  receipt_id: string;
  ocr_data: ReceiptExtraction;
  status?: 'completed' | 'failed';
  error_message?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify Authorization header matches NOTEBOOK_GENERATION_AUTH secret
    const authHeader = req.headers.get('Authorization');
    const notebookAuthSecret = Deno.env.get('NOTEBOOK_GENERATION_AUTH');

    if (!authHeader || !notebookAuthSecret) {
      console.error('Missing authorization header or NOTEBOOK_GENERATION_AUTH secret');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (authHeader !== notebookAuthSecret) {
      console.error('Invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid credentials' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { receipt_id, ocr_data, status, error_message }: CallbackRequest = await req.json();

    if (!receipt_id) {
      return new Response(
        JSON.stringify({ error: 'Missing receipt_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle failed OCR extraction
    if (status === 'failed' || error_message) {
      const { error: updateError } = await supabase
        .from('receipts')
        .update({
          processing_status: 'failed',
          error_message: error_message || 'OCR extraction failed',
        })
        .eq('id', receipt_id);

      if (updateError) {
        console.error('Error updating receipt failure status:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update receipt status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Receipt marked as failed',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate OCR data structure
    if (!ocr_data || !ocr_data.merchant || !ocr_data.transaction || !ocr_data.payment) {
      console.error('Invalid OCR data structure:', ocr_data);

      await supabase
        .from('receipts')
        .update({
          processing_status: 'failed',
          error_message: 'Invalid OCR data structure received from n8n',
        })
        .eq('id', receipt_id);

      return new Response(
        JSON.stringify({ error: 'Invalid OCR data structure' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse receipt date (convert to YYYY-MM-DD format for PostgreSQL)
    let receiptDate: string;
    try {
      const parsedDate = new Date(ocr_data.transaction.date);
      receiptDate = parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (error) {
      console.error('Error parsing receipt date:', error);
      receiptDate = new Date().toISOString().split('T')[0]; // Fallback to today
    }

    // Update receipts table with OCR data
    const { error: updateError } = await supabase
      .from('receipts')
      .update({
        processing_status: 'completed',
        extracted_at: new Date().toISOString(),
        ocr_data: ocr_data,
        merchant: ocr_data.merchant.name || 'Unknown Merchant',
        receipt_date: receiptDate,
        amount: ocr_data.payment.total || 0,
        tax: ocr_data.payment.tax || 0,
        confidence_score: ocr_data.overall_confidence || 0,
      })
      .eq('id', receipt_id);

    if (updateError) {
      console.error('Error updating receipt with OCR data:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to store OCR data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Receipt OCR data stored successfully for receipt_id: ${receipt_id}`);

    // Trigger AI matching workflow asynchronously (don't block response)
    // Use EdgeRuntime.waitUntil if available, otherwise just fire and forget
    const matchRequest = supabase.functions.invoke('match-receipt-transactions', {
      body: { receipt_id },
    });

    // Fire and forget - don't await
    matchRequest.catch(error => {
      console.error('Error triggering AI matching:', error);
      // Not a critical failure - AI matching can be retried manually
    });

    return new Response(
      JSON.stringify({
        success: true,
        receipt_id,
        message: 'Receipt OCR data stored successfully',
        merchant: ocr_data.merchant.name,
        amount: ocr_data.payment.total,
        confidence: ocr_data.overall_confidence,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-receipt-callback function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
