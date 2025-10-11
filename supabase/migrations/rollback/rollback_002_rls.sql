-- Rollback for 20250109000002_create_financial_rls_policies.sql
-- Drops all RLS policies and disables RLS on financial tables

-- CRITICAL: This rollback will DISABLE data security on financial tables
-- Only run this if RLS policies are misconfigured and need to be recreated

BEGIN;

-- Drop RLS policies for user_tiers
DROP POLICY IF EXISTS "Users can view their own tier" ON user_tiers;
DROP POLICY IF EXISTS "Users can insert their own tier" ON user_tiers;
DROP POLICY IF EXISTS "Users can update their own tier" ON user_tiers;
DROP POLICY IF EXISTS "Users can delete their own tier" ON user_tiers;

-- Drop RLS policies for bank_accounts
DROP POLICY IF EXISTS "Users can view their own bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Users can insert their own bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Users can update their own bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Users can delete their own bank accounts" ON bank_accounts;

-- Drop RLS policies for bank_statements
DROP POLICY IF EXISTS "Users can view their own bank statements" ON bank_statements;
DROP POLICY IF EXISTS "Users can insert their own bank statements" ON bank_statements;
DROP POLICY IF EXISTS "Users can update their own bank statements" ON bank_statements;
DROP POLICY IF EXISTS "Users can delete their own bank statements" ON bank_statements;

-- Drop RLS policies for transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;

-- Drop RLS policies for receipts
DROP POLICY IF EXISTS "Users can view their own receipts" ON receipts;
DROP POLICY IF EXISTS "Users can insert their own receipts" ON receipts;
DROP POLICY IF EXISTS "Users can update their own receipts" ON receipts;
DROP POLICY IF EXISTS "Users can delete their own receipts" ON receipts;

-- Drop RLS policies for reconciliation_matches
DROP POLICY IF EXISTS "Users can view their own reconciliation matches" ON reconciliation_matches;
DROP POLICY IF EXISTS "Users can insert their own reconciliation matches" ON reconciliation_matches;
DROP POLICY IF EXISTS "Users can update their own reconciliation matches" ON reconciliation_matches;
DROP POLICY IF EXISTS "Users can delete their own reconciliation matches" ON reconciliation_matches;

-- Disable RLS on all financial tables
ALTER TABLE user_tiers DISABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE bank_statements DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_matches DISABLE ROW LEVEL SECURITY;

COMMIT;

-- Verify rollback
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('user_tiers', 'bank_accounts', 'bank_statements', 'transactions', 'receipts', 'reconciliation_matches')
  ) THEN
    RAISE EXCEPTION 'Rollback failed: RLS policies still exist';
  END IF;
  
  RAISE NOTICE 'Rollback 002 successful: All RLS policies dropped and RLS disabled';
END $$;

