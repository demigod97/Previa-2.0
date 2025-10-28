// Story 8.1: Public Feedback Portal - Submit Feedback Edge Function
// Handles public feedback submissions with rate limiting

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

const RATE_LIMIT = 5 // submissions per hour per IP
const RATE_LIMIT_WINDOW = 3600000 // 1 hour in ms

interface FeedbackSubmission {
  feedback_type: 'bug' | 'feature' | 'error' | 'improvement' | 'other'
  severity?: 'low' | 'medium' | 'high' | 'critical'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  description: string
  steps_to_reproduce?: string
  expected_behavior?: string
  actual_behavior?: string
  use_case?: string
  user_name?: string
  user_email?: string
  wants_updates?: boolean
  screenshot_url?: string
  browser_info?: {
    userAgent?: string
    screenWidth?: number
    screenHeight?: number
    viewportWidth?: number
    viewportHeight?: number
    language?: string
    timezone?: string
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract client IP (check various headers for proxy scenarios)
    const clientIP =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    // Check rate limit
    const rateLimitWindowStart = new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString()

    const { data: recentSubmissions, error: rateLimitError } = await supabaseClient
      .from('feedback_rate_limits')
      .select('id, created_at')
      .eq('ip_address', clientIP)
      .gte('created_at', rateLimitWindowStart)

    if (rateLimitError && rateLimitError.code !== 'PGRST116') {
      // Ignore "relation does not exist" error, but log others
      console.error('Rate limit check error:', rateLimitError)
    }

    if (recentSubmissions && recentSubmissions.length >= RATE_LIMIT) {
      const minutesRemaining = Math.ceil(
        (Date.parse((recentSubmissions[0] as any).created_at) + RATE_LIMIT_WINDOW - Date.now()) / 60000
      )

      return new Response(
        JSON.stringify({
          error: `Rate limit exceeded. You've submitted ${RATE_LIMIT} feedbacks in the last hour.`,
          message: `Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`,
          retryAfter: minutesRemaining * 60
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const body: FeedbackSubmission = await req.json()

    // Validate required fields
    if (!body.feedback_type || !body.title || !body.description) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          message: 'feedback_type, title, and description are required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate field lengths
    if (body.title.length > 100) {
      return new Response(
        JSON.stringify({
          error: 'Title too long',
          message: 'Title must be 100 characters or less'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (body.description.length > 2000) {
      return new Response(
        JSON.stringify({
          error: 'Description too long',
          message: 'Description must be 2000 characters or less'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Enrich browser info with server-side data
    const enrichedBrowserInfo = {
      ...body.browser_info,
      userAgent: req.headers.get('user-agent'),
      acceptLanguage: req.headers.get('accept-language'),
      referer: req.headers.get('referer')
    }

    // Insert feedback
    const { data: feedback, error: insertError } = await supabaseClient
      .from('public_feedback')
      .insert({
        feedback_type: body.feedback_type,
        severity: body.severity,
        priority: body.priority,
        title: body.title,
        description: body.description,
        steps_to_reproduce: body.steps_to_reproduce,
        expected_behavior: body.expected_behavior,
        actual_behavior: body.actual_behavior,
        use_case: body.use_case,
        user_name: body.user_name,
        user_email: body.user_email,
        wants_updates: body.wants_updates || false,
        screenshot_url: body.screenshot_url,
        browser_info: enrichedBrowserInfo,
        status: 'new'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({
          error: 'Failed to submit feedback',
          message: insertError.message
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Record rate limit entry
    await supabaseClient
      .from('feedback_rate_limits')
      .insert({
        ip_address: clientIP,
        feedback_id: feedback.id
      })

    // Generate reference ID
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const idPrefix = feedback.id.slice(0, 6).toUpperCase()
    const referenceId = `FB-${dateStr}-${idPrefix}`

    return new Response(
      JSON.stringify({
        success: true,
        referenceId,
        message: "Thank you for your feedback! We've received your submission.",
        feedback: {
          id: feedback.id,
          type: feedback.feedback_type,
          title: feedback.title,
          status: feedback.status,
          created_at: feedback.created_at
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
