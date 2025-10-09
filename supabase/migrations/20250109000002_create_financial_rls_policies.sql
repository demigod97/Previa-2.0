-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR FINANCIAL TABLES
-- Ensures users can only access their own financial data
-- ============================================================================

-- Enable RLS on all financial tables
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_matches ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER_TIERS POLICIES
-- ============================================================================

-- Users can only read their own tier
CREATE POLICY "Users can view own tier"
  ON public.user_tiers FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert tiers (via trigger)
CREATE POLICY "System can insert user tiers"
  ON public.user_tiers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can upgrade their tier (premium conversion)
CREATE POLICY "Users can update own tier"
  ON public.user_tiers FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BANK_ACCOUNTS POLICIES
-- ============================================================================

-- Users own their bank accounts (full CRUD)
CREATE POLICY "Users own their bank accounts"
  ON public.bank_accounts FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- BANK_STATEMENTS POLICIES
-- ============================================================================

-- Users own their bank statements (full CRUD)
CREATE POLICY "Users own their bank statements"
  ON public.bank_statements FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRANSACTIONS POLICIES
-- ============================================================================

-- Users own their transactions (full CRUD)
CREATE POLICY "Users own their transactions"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- RECEIPTS POLICIES
-- ============================================================================

-- Users own their receipts (full CRUD)
CREATE POLICY "Users own their receipts"
  ON public.receipts FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- RECONCILIATION_MATCHES POLICIES
-- ============================================================================

-- Users own their reconciliation matches (full CRUD)
CREATE POLICY "Users own their reconciliation matches"
  ON public.reconciliation_matches FOR ALL
  USING (auth.uid() = user_id);

