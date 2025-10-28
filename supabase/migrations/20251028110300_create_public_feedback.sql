-- Migration: Create Public Feedback System
-- Story: 8.1 Public Feedback Portal
-- Date: 2025-10-28

-- Enum types
CREATE TYPE feedback_type AS ENUM ('bug', 'feature', 'error', 'improvement', 'other');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE feedback_status AS ENUM ('new', 'acknowledged', 'in_progress', 'resolved', 'wont_fix');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Main table
CREATE TABLE public_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_type feedback_type NOT NULL,
  severity severity_level,
  priority priority_level,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 2000),
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  use_case TEXT,
  user_name TEXT CHECK (char_length(user_name) <= 50),
  user_email TEXT,
  wants_updates BOOLEAN DEFAULT false,
  browser_info JSONB,
  screenshot_url TEXT,
  status feedback_status DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_feedback_type ON public_feedback(feedback_type);
CREATE INDEX idx_feedback_status ON public_feedback(status);
CREATE INDEX idx_feedback_created_at ON public_feedback(created_at DESC);

-- RLS Policies
ALTER TABLE public_feedback ENABLE ROW LEVEL SECURITY;

-- Public can insert
CREATE POLICY "Anyone can submit feedback"
  ON public_feedback FOR INSERT
  WITH CHECK (true);

-- Only admins can view/update
CREATE POLICY "Admins can view all feedback"
  ON public_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_tiers
      WHERE user_tiers.user_id = auth.uid()
      AND user_tiers.tier = 'admin'
    )
  );

CREATE POLICY "Admins can update feedback"
  ON public_feedback FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_tiers
      WHERE user_tiers.user_id = auth.uid()
      AND user_tiers.tier = 'admin'
    )
  );

-- Storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-screenshots', 'feedback-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public upload, admin read
CREATE POLICY "Anyone can upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'feedback-screenshots');

CREATE POLICY "Admins can view screenshots"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'feedback-screenshots' AND
    EXISTS (
      SELECT 1 FROM user_tiers
      WHERE user_tiers.user_id = auth.uid()
      AND user_tiers.tier = 'admin'
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_feedback_timestamp
  BEFORE UPDATE ON public_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at();

-- Comment on table
COMMENT ON TABLE public_feedback IS 'Public feedback submissions for bugs, features, errors, and improvements';
