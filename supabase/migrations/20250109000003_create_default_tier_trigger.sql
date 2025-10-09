-- ============================================================================
-- DEFAULT USER TIER TRIGGER
-- Automatically creates a free tier entry when a new user signs up
-- ============================================================================

-- Function to create default user tier on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default 'user' (free) tier with limits
  INSERT INTO public.user_tiers (
    user_id, 
    tier, 
    accounts_limit, 
    transactions_monthly_limit, 
    receipts_monthly_limit
  )
  VALUES (
    NEW.id, 
    'user', -- Free tier by default
    3,      -- 3 bank accounts max
    50,     -- 50 transactions/month
    10      -- 10 receipts/month
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User tier already exists, skip
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists (for re-running migration)
DROP TRIGGER IF EXISTS on_auth_user_created_tier ON auth.users;

-- Trigger on auth.users table to create tier on signup
CREATE TRIGGER on_auth_user_created_tier
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_tier();

-- Create updated_at trigger function for user_tiers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to user_tiers
DROP TRIGGER IF EXISTS set_user_tiers_updated_at ON public.user_tiers;
CREATE TRIGGER set_user_tiers_updated_at
  BEFORE UPDATE ON public.user_tiers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply updated_at trigger to bank_accounts
DROP TRIGGER IF EXISTS set_bank_accounts_updated_at ON public.bank_accounts;
CREATE TRIGGER set_bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

