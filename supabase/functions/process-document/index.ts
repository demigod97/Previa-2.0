import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// TypeScript interfaces for Story 3.2
interface ProcessDocumentRequest {
  document_id: string;
  user_id: string;
  document_type: 'bank_statement' | 'receipt';
  file_path: string;
  storage_bucket: 'bank-statements' | 'receipts';
  // Legacy support
  sourceId?: string;
  sourceType?: string;
  filePath?: string;
}

interface ProcessDocumentResponse {
  success: boolean;
  job_id?: string;
  message: string;
  error?: string;
  details?: string;
  result?: any;
}

interface N8NWebhookPayload {
  document_id: string;
  document_type: 'bank_statement' | 'receipt';
  file_url: string;
  user_id: string;
  callback_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse and normalize request body (support legacy field names)
    const body: ProcessDocumentRequest = await req.json()

    // Support both old format (sourceId) and new format (document_id)
    const documentId = body.document_id || body.sourceId
    const userId = body.user_id
    const documentType = body.document_type || body.sourceType
    const filePath = body.file_path || body.filePath
    const storageBucket = body.storage_bucket || 'bank-statements'

    // Comprehensive Payload Validation (Story 3.2 Task 3)
    const validationErrors: string[] = []

    if (!documentId) {
      validationErrors.push('document_id is required')
    }

    if (!documentType) {
      validationErrors.push('document_type is required')
    } else if (!['bank_statement', 'receipt'].includes(documentType)) {
      validationErrors.push('document_type must be either "bank_statement" or "receipt"')
    }

    if (!filePath) {
      validationErrors.push('file_path is required')
    }

    if (!storageBucket) {
      validationErrors.push('storage_bucket is required')
    } else if (!['bank-statements', 'receipts'].includes(storageBucket)) {
      validationErrors.push('storage_bucket must be either "bank-statements" or "receipts"')
    }

    // Return field-specific validation errors
    if (validationErrors.length > 0) {
      console.error('Payload validation failed:', validationErrors)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation failed',
          message: validationErrors.join('; '),
          details: validationErrors
        } as ProcessDocumentResponse),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing document:', {
      document_id: documentId,
      user_id: userId,
      file_path: filePath,
      document_type: documentType,
      storage_bucket: storageBucket
    });

    // JWT Authentication (Story 3.2 Task 2)
    // Initialize Supabase client for authentication
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error',
          message: 'Missing Supabase configuration'
        } as ProcessDocumentResponse),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Extract and verify JWT token
    const authHeader = req.headers.get('Authorization')

    // Make JWT optional for backward compatibility
    // If Authorization header is present, verify it
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

      if (authError || !user) {
        console.error('JWT verification failed:', authError)
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid token',
            message: 'Authentication failed'
          } as ProcessDocumentResponse),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Validate user_id matches JWT claims if provided
      if (userId && user.id !== userId) {
        console.error('User ID mismatch:', { jwt_user_id: user.id, payload_user_id: userId })
        return new Response(
          JSON.stringify({
            success: false,
            error: 'User ID mismatch',
            message: 'Authenticated user does not match payload user_id'
          } as ProcessDocumentResponse),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('JWT authentication successful for user:', user.id)
    } else if (userId) {
      // If user_id is provided but no JWT, log warning for monitoring
      console.warn('Processing document without JWT authentication for user:', userId)
    }

    // Get environment variables (support both old and new variable names)
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL') || Deno.env.get('DOCUMENT_PROCESSING_WEBHOOK_URL')
    const n8nApiKey = Deno.env.get('N8N_API_KEY') || Deno.env.get('NOTEBOOK_GENERATION_AUTH')

    if (!webhookUrl) {
      console.error('Missing N8N_WEBHOOK_URL environment variable')

      // Update document status to failed using existing supabaseClient

      // Update document status to failed (handle both bank_statements and sources tables)
      if (documentType === 'bank_statement') {
        await supabaseClient
          .from('bank_statements')
          .update({ processing_status: 'failed' })
          .eq('id', documentId)
      } else if (documentType === 'receipt') {
        await supabaseClient
          .from('receipts')
          .update({ processing_status: 'failed' })
          .eq('id', documentId)
      } else {
        await supabaseClient
          .from('sources')
          .update({ processing_status: 'failed' })
          .eq('id', documentId)
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Document processing webhook URL not configured',
          message: 'Server configuration error'
        } as ProcessDocumentResponse),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate Signed URL (Story 3.2 Task 4)
    console.log('Generating signed URL for file:', { bucket: storageBucket, path: filePath })

    const { data: signedUrlData, error: signedUrlError } = await supabaseClient.storage
      .from(storageBucket)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (signedUrlError || !signedUrlData) {
      console.error('Signed URL generation failed:', signedUrlError)

      // Update document status to failed
      if (documentType === 'bank_statement') {
        await supabaseClient
          .from('bank_statements')
          .update({ processing_status: 'failed', error_message: 'File not found or inaccessible' })
          .eq('id', documentId)
      } else if (documentType === 'receipt') {
        await supabaseClient
          .from('receipts')
          .update({ processing_status: 'failed', error_message: 'File not found or inaccessible' })
          .eq('id', documentId)
      } else {
        await supabaseClient
          .from('sources')
          .update({ processing_status: 'failed', error_message: 'File not found or inaccessible' })
          .eq('id', documentId)
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to generate signed URL',
          message: 'File not found or inaccessible in storage',
          details: signedUrlError?.message
        } as ProcessDocumentResponse),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const fileUrl = signedUrlData.signedUrl
    console.log('Signed URL generated successfully (expires in 1 hour)')
    console.log('Calling external webhook:', webhookUrl);

    // Prepare the payload for the webhook with correct variable names
    const payload = {
      document_id: documentId,
      user_id: userId,
      file_url: fileUrl,
      file_path: filePath,
      document_type: documentType,
      storage_bucket: storageBucket,
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-document-callback`
    }

    console.log('Webhook payload:', payload);

    // Trigger n8n workflow with retry logic (Story 3.2 Task 5)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (n8nApiKey) {
      headers['Authorization'] = `Bearer ${n8nApiKey}`
    }

    let n8nSuccess = false
    let lastError: Error | null = null
    let result: any = null

    // Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`n8n webhook attempt ${attempt}/3`)

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          result = await response.json()
          n8nSuccess = true
          console.log(`n8n triggered successfully on attempt ${attempt}`)
          break
        } else {
          const errorText = await response.text()
          throw new Error(`n8n returned ${response.status}: ${errorText}`)
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.error(`n8n trigger attempt ${attempt} failed:`, lastError.message)

        // Exponential backoff: wait before next retry (except on last attempt)
        if (attempt < 3) {
          const delayMs = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
          console.log(`Waiting ${delayMs}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }
      }
    }

    // Update database status based on n8n trigger result (Story 3.2 Task 5 & 6)
    const table = documentType === 'bank_statement' ? 'bank_statements' :
                 documentType === 'receipt' ? 'receipts' : 'sources'

    if (n8nSuccess) {
      // Update status to 'processing' with timestamp
      const { error: updateError } = await supabaseClient
        .from(table)
        .update({
          processing_status: 'processing',
          processing_started_at: new Date().toISOString(),
        })
        .eq('id', documentId)

      if (updateError) {
        console.error('Database update error:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: true,
          job_id: documentId,
          message: 'Processing started',
          result
        } as ProcessDocumentResponse),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Update status to 'failed' with error message
      const { error: updateError } = await supabaseClient
        .from(table)
        .update({
          processing_status: 'failed',
          error_message: lastError?.message || 'Failed to trigger n8n workflow',
        })
        .eq('id', documentId)

      if (updateError) {
        console.error('Database update error:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to trigger n8n workflow after 3 attempts',
          message: lastError?.message || 'Unknown error',
        } as ProcessDocumentResponse),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error in process-document function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      } as ProcessDocumentResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
