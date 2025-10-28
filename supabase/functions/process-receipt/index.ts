// supabase/functions/process-receipt/index.ts
// Trigger n8n OCR extraction workflow when receipt is uploaded

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessReceiptRequest {
  receipt_id: string;
  user_id: string;
  file_path: string;
  bucket: string;
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

    // Initialize Supabase client with service role for admin operations
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
    const { receipt_id, user_id, file_path, bucket }: ProcessReceiptRequest = await req.json();

    // Verify user owns this receipt
    if (user.id !== user_id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: User ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update receipt status to 'processing'
    const { error: updateError } = await supabase
      .from('receipts')
      .update({
        processing_status: 'processing',
      })
      .eq('id', receipt_id)
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Error updating receipt status:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update receipt status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed URL for receipt file (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(file_path, 3600);

    if (signedUrlError || !signedUrlData) {
      console.error('Error generating signed URL:', signedUrlError);

      // Update receipt status to 'failed'
      await supabase
        .from('receipts')
        .update({
          processing_status: 'failed',
          error_message: 'Failed to generate signed URL for receipt file',
        })
        .eq('id', receipt_id);

      return new Response(
        JSON.stringify({ error: 'Failed to generate signed URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get n8n webhook URL from environment
    const n8nWebhookUrl = Deno.env.get('OCR_EXTRACT');
    if (!n8nWebhookUrl) {
      console.error('OCR_EXTRACT webhook URL not configured');

      await supabase
        .from('receipts')
        .update({
          processing_status: 'failed',
          error_message: 'OCR service not configured',
        })
        .eq('id', receipt_id);

      return new Response(
        JSON.stringify({ error: 'OCR service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call n8n OCR extraction workflow
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receipt_id,
        user_id,
        file_url: signedUrlData.signedUrl,
        file_path,
        bucket,
      }),
    });

    if (!n8nResponse.ok) {
      console.error('n8n webhook call failed:', await n8nResponse.text());

      await supabase
        .from('receipts')
        .update({
          processing_status: 'failed',
          error_message: 'OCR extraction workflow failed to start',
        })
        .eq('id', receipt_id);

      return new Response(
        JSON.stringify({ error: 'Failed to trigger OCR extraction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Receipt processing started for receipt_id: ${receipt_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        receipt_id,
        message: 'Receipt processing started successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-receipt function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
