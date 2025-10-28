-- Migration: Create Feedback Rate Limiting Table
-- Story: 8.1 Public Feedback Portal
-- Date: 2025-10-28

-- Rate limiting table to track submissions by IP
CREATE TABLE feedback_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  feedback_id UUID REFERENCES public_feedback(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for efficient rate limit queries
CREATE INDEX idx_rate_limits_ip_created ON feedback_rate_limits(ip_address, created_at DESC);

-- RLS: No direct access needed (managed by Edge Function with service role)
ALTER TABLE feedback_rate_limits ENABLE ROW LEVEL SECURITY;

-- Cleanup old entries (older than 24 hours) periodically
-- This function can be called by a cron job or pg_cron extension
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM feedback_rate_limits
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Comment
COMMENT ON TABLE feedback_rate_limits IS 'Tracks feedback submissions by IP address for rate limiting (5 per hour)';
