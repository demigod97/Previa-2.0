-- ============================================================================
-- SEED SAMPLE FINANCIAL DATA FOR USER: 273fb674-b87b-4604-89d5-41ab0b46d356
-- ============================================================================

-- Create user tier record (Free tier)
INSERT INTO public.user_tiers (user_id, tier, accounts_limit, transactions_monthly_limit, receipts_monthly_limit)
VALUES (
  '273fb674-b87b-4604-89d5-41ab0b46d356',
  'user',
  3,
  50,
  10
)
ON CONFLICT (user_id) DO NOTHING;

-- Create sample bank accounts
INSERT INTO public.bank_accounts (id, user_id, institution, account_name, account_number_masked, balance, currency) VALUES
('550e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', 'Commonwealth Bank', 'Personal Transaction Account', '****1234', 15420.50, 'AUD'),
('550e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', 'Westpac', 'Business Account', '****5678', 48750.25, 'AUD')
ON CONFLICT (id) DO NOTHING;

-- Create sample bank statements
INSERT INTO public.bank_statements (id, bank_account_id, user_id, period_start, period_end, file_path, file_size, processing_status, extraction_confidence) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-01', '2025-09-30', 'statements/2025-09-cba.pdf', 245680, 'completed', 0.95),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-01', '2025-09-30', 'statements/2025-09-westpac.pdf', 189234, 'completed', 0.92)
ON CONFLICT (id) DO NOTHING;

-- Create sample transactions (mix of income and expenses)
INSERT INTO public.transactions (id, bank_statement_id, user_id, transaction_date, amount, description, category, status) VALUES
-- Commonwealth Bank transactions
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-02', 3500.00, 'Salary - Acme Corp', 'Income', 'approved'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-05', -89.50, 'Woolworths Supermarket', 'Groceries', 'matched'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-07', -45.00, 'Shell Petrol Station', 'Transport', 'matched'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-10', -125.00, 'Telstra Monthly Bill', 'Utilities', 'approved'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-15', -67.80, 'Netflix Subscription', 'Entertainment', 'approved'),
-- Westpac business transactions
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-03', 8500.00, 'Client Invoice #1234', 'Business Income', 'approved'),
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-08', -450.00, 'Office Supplies - Officeworks', 'Business Expense', 'matched'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-12', -1200.00, 'Software Licenses - Adobe', 'Business Expense', 'approved'),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-18', -89.00, 'Domain Renewal - GoDaddy', 'Business Expense', 'matched'),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', '2025-09-25', 5200.00, 'Client Invoice #1235', 'Business Income', 'approved')
ON CONFLICT (id) DO NOTHING;

-- Create sample receipts
INSERT INTO public.receipts (id, user_id, merchant, receipt_date, amount, tax, file_path, file_size, processing_status, confidence_score, ocr_data) VALUES
('850e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', 'Woolworths', '2025-09-05', 89.50, 8.14, 'receipts/woolworths-2025-09-05.jpg', 125680, 'completed', 0.96, '{"merchant":"Woolworths","total":89.50,"items":["Groceries"]}'::jsonb),
('850e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', 'Shell', '2025-09-07', 45.00, 4.09, 'receipts/shell-2025-09-07.jpg', 98234, 'completed', 0.94, '{"merchant":"Shell","total":45.00,"items":["Fuel"]}'::jsonb),
('850e8400-e29b-41d4-a716-446655440003', '273fb674-b87b-4604-89d5-41ab0b46d356', 'Officeworks', '2025-09-08', 450.00, 40.91, 'receipts/officeworks-2025-09-08.pdf', 156789, 'completed', 0.98, '{"merchant":"Officeworks","total":450.00,"items":["Office Supplies"]}'::jsonb),
('850e8400-e29b-41d4-a716-446655440004', '273fb674-b87b-4604-89d5-41ab0b46d356', 'GoDaddy', '2025-09-18', 89.00, 8.09, 'receipts/godaddy-2025-09-18.pdf', 78456, 'completed', 0.92, '{"merchant":"GoDaddy","total":89.00,"items":["Domain Renewal"]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create sample reconciliation matches
INSERT INTO public.reconciliation_matches (id, user_id, transaction_id, receipt_id, confidence, status) VALUES
('950e8400-e29b-41d4-a716-446655440001', '273fb674-b87b-4604-89d5-41ab0b46d356', '750e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 0.98, 'approved'),
('950e8400-e29b-41d4-a716-446655440002', '273fb674-b87b-4604-89d5-41ab0b46d356', '750e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002', 0.96, 'approved'),
('950e8400-e29b-41d4-a716-446655440003', '273fb674-b87b-4604-89d5-41ab0b46d356', '750e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440003', 0.99, 'approved'),
('950e8400-e29b-41d4-a716-446655440004', '273fb674-b87b-4604-89d5-41ab0b46d356', '750e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440004', 0.95, 'approved')
ON CONFLICT (id) DO NOTHING;
