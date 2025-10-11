-- Force create user_tiers table for Story 1.7
-- This table was missing despite previous migration marked as applied

DROP TABLE IF EXISTS public.user_tiers CASCADE;

CREATE TABLE public.user_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('user', 'premium_user')),
  accounts_limit INTEGER DEFAULT 3,
  transactions_monthly_limit INTEGER DEFAULT 50,
  receipts_monthly_limit INTEGER DEFAULT 10,
  upgraded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for user tier lookups
CREATE INDEX idx_user_tiers_user ON public.user_tiers(user_id);

-- Enable RLS
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own tier data
CREATE POLICY "Users can view own tier" ON public.user_tiers
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Service role can manage all tier data
CREATE POLICY "Service role can manage tiers" ON public.user_tiers
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
