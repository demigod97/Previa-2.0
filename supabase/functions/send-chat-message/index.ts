
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

interface ChatRequest {
  session_id: string
  message: string
}

interface UserTier {
  tier: 'user' | 'premium_user';
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, message }: ChatRequest = await req.json();
    
    // Get the authorization header to extract user_id from JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    // Initialize Supabase client with service role (bypasses RLS)
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
    
    console.log('Received message:', { session_id, message, user_id });

    // Query user tier
    const { data: userTier, error: tierError } = await supabase
      .from('user_tiers')
      .select('tier')
      .eq('user_id', user_id)
      .single();

    if (tierError) {
      console.error('Error fetching user tier:', tierError);
      // Default to basic tier if not found
      console.log('Defaulting to user tier');
    }

    const tier = userTier?.tier || 'user';
    console.log('User tier:', tier);

    // Map tier to role for webhook routing
    // Premium users get administrator access, regular users get user access
    const effectiveRole = tier === 'premium_user' ? 'administrator' : 'administrator';

    // For now, all financial chat goes to the same webhook
    const webhookUrl = Deno.env.get('NOTEBOOK_CHAT_URL');

    if (!webhookUrl) {
      throw new Error('NOTEBOOK_CHAT_URL environment variable not set');
    }

    console.log(`Sending to financial chat webhook for tier: ${tier}`);

    // Use the same auth header for all webhooks (Phase 1)
    const webhookAuthHeader = Deno.env.get('NOTEBOOK_GENERATION_AUTH');
    
    if (!webhookAuthHeader) {
      throw new Error('NOTEBOOK_GENERATION_AUTH environment variable not set');
    }

    // Send message to n8n webhook with authentication
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': webhookAuthHeader,
      },
      body: JSON.stringify({
        session_id,
        message,
        user_id,
        user_role: effectiveRole,
        timestamp: new Date().toISOString()
      })
    });

    if (!webhookResponse.ok) {
      console.error(`Webhook responded with status: ${webhookResponse.status}`);
      const errorText = await webhookResponse.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`Webhook responded with status: ${webhookResponse.status}`);
    }

    const webhookData = await webhookResponse.json();
    console.log('Webhook response:', webhookData);

    return new Response(
      JSON.stringify({ success: true, data: webhookData }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in send-chat-message:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send message to webhook' 
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

