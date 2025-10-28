-- Verification script for receipt OCR database migrations
-- Run this to verify migrations were applied successfully

-- ========================================
-- 1. Verify receipts table extensions
-- ========================================
\echo 'Checking receipts table new columns...'
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'receipts'
  AND column_name IN (
    'category',
    'processing_status',
    'processing_started_at',
    'extracted_at',
    'error_message'
  )
ORDER BY column_name;

\echo ''
\echo 'Expected: 5 rows with columns (category, processing_status, processing_started_at, extracted_at, error_message)'
\echo ''

-- Check processing_status constraint
\echo 'Checking processing_status constraint...'
SELECT
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
  AND constraint_name = 'receipts_processing_status_check';

\echo ''
\echo 'Expected: CHECK constraint with values (pending, processing, completed, failed)'
\echo ''

-- Check indexes on receipts table
\echo 'Checking receipts table indexes...'
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'receipts'
  AND indexname IN ('idx_receipts_processing_status', 'idx_receipts_category');

\echo ''
\echo 'Expected: 2 indexes (idx_receipts_processing_status, idx_receipts_category)'
\echo ''

-- ========================================
-- 2. Verify ai_match_suggestions table
-- ========================================
\echo 'Checking ai_match_suggestions table exists...'
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'ai_match_suggestions';

\echo ''
\echo 'Expected: 1 row with table_name = ai_match_suggestions'
\echo ''

-- Check ai_match_suggestions columns
\echo 'Checking ai_match_suggestions columns...'
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'ai_match_suggestions'
ORDER BY ordinal_position;

\echo ''
\echo 'Expected: 9 columns (id, user_id, receipt_id, transaction_id, confidence_score, match_reason, status, created_at, updated_at)'
\echo ''

-- Check unique constraint
\echo 'Checking unique constraint on (receipt_id, transaction_id)...'
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name = 'ai_match_suggestions'
  AND constraint_type = 'UNIQUE';

\echo ''
\echo 'Expected: 1 UNIQUE constraint'
\echo ''

-- Check indexes on ai_match_suggestions
\echo 'Checking ai_match_suggestions indexes...'
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'ai_match_suggestions'
ORDER BY indexname;

\echo ''
\echo 'Expected: 5 indexes (receipt, transaction, user, confidence, status)'
\echo ''

-- ========================================
-- 3. Verify RLS policies
-- ========================================
\echo 'Checking RLS is enabled on ai_match_suggestions...'
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'ai_match_suggestions';

\echo ''
\echo 'Expected: rowsecurity = true'
\echo ''

-- Check RLS policies
\echo 'Checking RLS policies on ai_match_suggestions...'
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'ai_match_suggestions'
ORDER BY policyname;

\echo ''
\echo 'Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE) all checking auth.uid() = user_id'
\echo ''

-- ========================================
-- 4. Verify trigger function
-- ========================================
\echo 'Checking update_ai_suggestions_updated_at trigger function...'
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'update_ai_suggestions_updated_at';

\echo ''
\echo 'Expected: 1 function (FUNCTION type)'
\echo ''

-- Check trigger
\echo 'Checking trigger on ai_match_suggestions...'
SELECT
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'ai_match_suggestions'
  AND trigger_name = 'update_ai_suggestions_timestamp';

\echo ''
\echo 'Expected: 1 trigger (BEFORE UPDATE, calls update_ai_suggestions_updated_at)'
\echo ''

-- ========================================
-- 5. Sample data check
-- ========================================
\echo 'Checking sample receipt data (if any)...'
SELECT
  id,
  processing_status,
  category,
  merchant,
  amount,
  confidence_score
FROM public.receipts
LIMIT 5;

\echo ''
\echo 'Checking sample AI match suggestions (if any)...'
SELECT
  id,
  receipt_id,
  transaction_id,
  confidence_score,
  status,
  LEFT(match_reason, 50) AS match_reason_preview
FROM public.ai_match_suggestions
LIMIT 5;

\echo ''
\echo '========================================'
\echo 'Migration verification complete!'
\echo '========================================'
