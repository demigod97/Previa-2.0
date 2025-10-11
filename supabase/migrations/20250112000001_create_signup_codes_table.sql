-- Create signup_codes table for code-based user registration
CREATE TABLE IF NOT EXISTS public.signup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  use_limit INTEGER, -- NULL = unlimited
  used_count INTEGER DEFAULT 0,
  expiry_date TIMESTAMPTZ, -- NULL = no expiry
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  notes TEXT -- Admin notes about the code
);

-- Index for fast code lookups
CREATE INDEX idx_signup_codes_code ON public.signup_codes(code) WHERE is_active = true;
CREATE INDEX idx_signup_codes_active ON public.signup_codes(is_active, expiry_date);

-- RLS Policies (staff only can read/write - will be enforced in Story 1.10)
ALTER TABLE public.signup_codes ENABLE ROW LEVEL SECURITY;

-- Temporary policy: Allow authenticated users to SELECT for verification
CREATE POLICY "Allow authenticated to verify codes" ON public.signup_codes
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Seed initial global code for testing
INSERT INTO public.signup_codes (code, is_active, notes)
VALUES ('PREVIA2025', true, 'Global signup code for early access');
