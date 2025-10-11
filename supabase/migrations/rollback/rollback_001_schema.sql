-- Rollback for 20250109000001_create_financial_schema.sql
-- Drops all financial tables and indexes in reverse dependency order

-- CRITICAL: This rollback script is DESTRUCTIVE and will delete all financial data
-- Only run this if the migration failed or needs to be completely reverted

BEGIN;

-- Drop tables in reverse dependency order (dependent tables first)
DROP TABLE IF EXISTS reconciliation_matches CASCADE;
DROP TABLE IF EXISTS receipts CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS bank_statements CASCADE;
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP TABLE IF EXISTS user_tiers CASCADE;

-- Drop indexes (if tables are dropped, indexes are auto-dropped, but being explicit)
DROP INDEX IF EXISTS idx_user_tiers_user_id;
DROP INDEX IF EXISTS idx_bank_accounts_user_id;
DROP INDEX IF EXISTS idx_bank_statements_user_id;
DROP INDEX IF EXISTS idx_bank_statements_account_id;
DROP INDEX IF EXISTS idx_transactions_user_id;
DROP INDEX IF EXISTS idx_transactions_account_id;
DROP INDEX IF EXISTS idx_transactions_date;
DROP INDEX IF EXISTS idx_receipts_user_id;
DROP INDEX IF EXISTS idx_receipts_date;

COMMIT;

-- Verify rollback
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_tiers', 'bank_accounts', 'bank_statements', 'transactions', 'receipts', 'reconciliation_matches')
  ) THEN
    RAISE EXCEPTION 'Rollback failed: Financial tables still exist';
  END IF;
  
  RAISE NOTICE 'Rollback 001 successful: All financial tables dropped';
END $$;

