-- ============================================
-- SEED DATA: CHALLENGE DEFINITIONS
-- Migration: Insert challenge templates
-- Version: 1.0
-- Date: 2025-10-13
-- ============================================

-- Daily Challenges
INSERT INTO challenge_definitions (
  challenge_id, challenge_name, challenge_description, challenge_type,
  challenge_category, target_count, reward_points, difficulty, australian_context
) VALUES
('daily_receipt_upload', 'Receipt Run', 'Upload 1 receipt today',
 'daily', 'documentation', 1, 10, 'easy',
 'Build GST-compliant record keeping habits'),

('daily_reconcile_3', 'Quick Match', 'Reconcile 3 transactions today',
 'daily', 'reconciliation', 3, 15, 'easy',
 'Daily reconciliation for accurate cash flow tracking'),

('daily_category_check', 'Category Check', 'Review uncategorized transactions',
 'daily', 'organization', 1, 10, 'easy',
 'Categorize for better tax deduction tracking'),

('daily_tip_read', 'Learn Something', 'Read 1 financial literacy tip',
 'daily', 'education', 1, 5, 'easy',
 'Daily financial education builds long-term habits');

-- Weekly Challenges
INSERT INTO challenge_definitions (
  challenge_id, challenge_name, challenge_description, challenge_type,
  challenge_category, target_count, reward_points, difficulty, australian_context
) VALUES
('weekly_banking_review', 'Banking Fee Check', 'Compare your account fees to market rates',
 'weekly', 'optimization', 1, 50, 'medium',
 'Big Four vs online banks - identify savings opportunities'),

('weekly_spending_insights', 'Spending Insights', 'Analyze weekly spending vs budget',
 'weekly', 'analysis', 1, 75, 'medium',
 'Weekly budget review improves financial awareness'),

('weekly_tag_work_expenses', 'Tax Prep Week', 'Tag 10 work-related expenses',
 'weekly', 'tax_prep', 10, 100, 'medium',
 'Prepare for EOFY by tagging deductible expenses'),

('weekly_receipt_batch', 'Receipt Marathon', 'Upload 5 receipts this week',
 'weekly', 'documentation', 5, 40, 'easy',
 'Build comprehensive expense documentation'),

('weekly_duplicate_check', 'Subscription Audit', 'Review subscriptions for duplicates',
 'weekly', 'optimization', 1, 60, 'medium',
 'Find duplicate subscriptions costing $200+/month');

-- Monthly Challenges
INSERT INTO challenge_definitions (
  challenge_id, challenge_name, challenge_description, challenge_type,
  challenge_category, target_count, reward_points, difficulty, australian_context
) VALUES
('monthly_budget_90', 'Budget Champion', 'Achieve 90% reconciliation rate this month',
 'monthly', 'reconciliation', 90, 200, 'hard',
 'Professional-grade bookkeeping for accurate reporting'),

('monthly_budget_adherence', 'Budget Master', 'Stay under budget in 3+ categories',
 'monthly', 'budgeting', 3, 300, 'hard',
 '50/30/20 rule application with Australian cost of living'),

('monthly_trend_review', 'Trend Watcher', 'Review all spending categories this month',
 'monthly', 'analysis', 1, 150, 'medium',
 'Monthly spending pattern analysis'),

('monthly_tax_ready', 'Tax Ready', 'Tag 20 tax-deductible expenses this month',
 'monthly', 'tax_prep', 20, 250, 'hard',
 'Build tax-ready records throughout the year'),

('monthly_savings_streak', 'Savings Streak', 'Achieve positive cash flow 4 weeks',
 'monthly', 'savings', 4, 200, 'hard',
 'Emergency fund building through consistent saving');

-- Educational Challenges (One-time completions)
INSERT INTO challenge_definitions (
  challenge_id, challenge_name, challenge_description, challenge_type,
  challenge_category, target_count, reward_points, difficulty, australian_context
) VALUES
('edu_super_basics', 'Super Foundations', 'Complete Australian Superannuation module',
 'educational', 'superannuation', 1, 250, 'medium',
 'Master SG rates, concessional caps, and fund selection'),

('edu_tax_101', 'Tax 101', 'Complete Australian Taxation Essentials module',
 'educational', 'taxation', 1, 250, 'medium',
 'Navigate PAYG, tax brackets, and deductions'),

('edu_banking_mastery', 'Banking Mastery', 'Complete Australian Banking Navigation module',
 'educational', 'banking', 1, 200, 'medium',
 'Big Four comparison and fee optimization strategies'),

('edu_consumer_rights', 'Consumer Rights', 'Complete Consumer Rights & Protection module',
 'educational', 'consumer_protection', 1, 200, 'medium',
 'Know your rights under ACL and AFCA processes'),

('edu_scam_prevention', 'Scam School', 'Complete Scam Prevention & Security module',
 'educational', 'security', 1, 150, 'easy',
 'Identify ATO scams, phishing, and protect identity');

-- Add comment
COMMENT ON TABLE challenge_definitions IS 'Challenge templates seeded (19 total) - Daily, Weekly, Monthly, and Educational';
