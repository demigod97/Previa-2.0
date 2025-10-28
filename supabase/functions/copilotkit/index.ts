// deno-lint-ignore-file no-window
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

// Type declarations for Supabase Edge Runtime
declare global {
  const Deno: {
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
    env: {
      get: (key: string) => string | undefined;
    };
  };
}

interface CopilotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CopilotRequest {
  messages: CopilotMessage[];
  model?: string;
  stream?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests for chat
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST for chat messages.' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Get the authorization header to extract user_id from JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      throw new Error('Invalid authentication token');
    }

    const user_id = user.id;

    // Parse CopilotKit request
    const copilotRequest: CopilotRequest = await req.json();
    console.log('Received CopilotKit request:', {
      user_id,
      messageCount: copilotRequest.messages?.length,
      model: copilotRequest.model
    });

    // Extract the last user message
    const userMessages = copilotRequest.messages.filter(m => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';

    if (!lastUserMessage) {
      throw new Error('No user message found in request');
    }

    // Query user tier
    const { data: userTier } = await supabase
      .from('user_tiers')
      .select('tier')
      .eq('user_id', user_id)
      .single();

    const tier = userTier?.tier || 'user';
    console.log('User tier:', tier);

    // Use the existing n8n webhook for chat processing
    const webhookUrl = Deno.env.get('NOTEBOOK_CHAT_URL');
    const webhookAuthHeader = Deno.env.get('NOTEBOOK_GENERATION_AUTH');

    if (!webhookUrl || !webhookAuthHeader) {
      throw new Error('Webhook configuration missing');
    }

    console.log('Sending to n8n webhook for AI processing');

    // Create a unique session ID for this conversation
    // In production, you might want to maintain session state
    const session_id = `copilot-${user_id}-${Date.now()}`;

    // Send message to n8n webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': webhookAuthHeader,
      },
      body: JSON.stringify({
        session_id,
        message: lastUserMessage,
        user_id,
        user_role: tier === 'premium_user' ? 'administrator' : 'user',
        timestamp: new Date().toISOString(),
        conversation_history: copilotRequest.messages.slice(-5) // Include last 5 messages for context
      })
    });

    if (!webhookResponse.ok) {
      console.error(`Webhook responded with status: ${webhookResponse.status}`);
      const errorText = await webhookResponse.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`Webhook failed: ${webhookResponse.status}`);
    }

    const webhookData = await webhookResponse.json();
    console.log('Webhook response received');

    // Transform webhook response to CopilotKit format
    // CopilotKit expects a simple text response or streaming response
    const aiResponse = webhookData.response || webhookData.message || 'No response from AI';

    // Return response in CopilotKit-compatible format
    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            role: 'assistant',
            content: aiResponse
          },
          finish_reason: 'stop'
        }],
        model: copilotRequest.model || 'gemini-pro',
        created: Math.floor(Date.now() / 1000)
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in copilotkit Edge Function:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to process chat request',
        type: 'server_error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
