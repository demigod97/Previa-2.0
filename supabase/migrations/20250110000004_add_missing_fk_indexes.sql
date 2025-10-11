-- Migration: Add Missing Foreign Key Indexes
-- Date: 2025-01-10
-- Purpose: Add performance indexes on foreign key columns to prevent query degradation at scale
-- QA Issue: PERF-001 (Score 6/10) - Missing FK indexes identified in gate review

-- Context: Original schema migration (20250109000001) created 9 indexes but omitted
-- indexes on foreign key columns used in JOIN operations. Without these indexes,
-- queries involving table joins will perform poorly at scale (500ms+ at 100k transactions).

BEGIN;

-- Index 1: transactions.bank_statement_id
-- Used for: Joining transactions to their source bank statement
-- Query pattern: SELECT * FROM transactions WHERE bank_statement_id = ?
CREATE INDEX IF NOT EXISTS idx_transactions_bank_statement_id 
ON transactions(bank_statement_id);

-- Index 2: reconciliation_matches.transaction_id
-- Used for: Joining reconciliation matches to transactions
-- Query pattern: SELECT * FROM reconciliation_matches WHERE transaction_id = ?
CREATE INDEX IF NOT EXISTS idx_reconciliation_matches_transaction_id 
ON reconciliation_matches(transaction_id);

-- Index 3: reconciliation_matches.receipt_id
-- Used for: Joining reconciliation matches to receipts
-- Query pattern: SELECT * FROM reconciliation_matches WHERE receipt_id = ?
CREATE INDEX IF NOT EXISTS idx_reconciliation_matches_receipt_id 
ON reconciliation_matches(receipt_id);

COMMIT;

-- Verify indexes created
DO $$
DECLARE
  missing_indexes text[];
BEGIN
  -- Check for missing indexes
  SELECT ARRAY_AGG(idx_name)
  INTO missing_indexes
  FROM (
    VALUES 
      ('idx_transactions_bank_statement_id'),
      ('idx_reconciliation_matches_transaction_id'),
      ('idx_reconciliation_matches_receipt_id')
  ) AS expected(idx_name)
  WHERE NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND indexname = expected.idx_name
  );
  
  IF missing_indexes IS NOT NULL THEN
    RAISE EXCEPTION 'Migration failed: Missing indexes: %', missing_indexes;
  END IF;
  
  RAISE NOTICE 'Migration 004 successful: All 3 foreign key indexes created';
END $$;

