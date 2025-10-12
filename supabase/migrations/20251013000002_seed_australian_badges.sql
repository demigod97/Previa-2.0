-- ============================================
-- SEED DATA: AUSTRALIAN BADGES
-- Migration: Insert 30 Australian-specific badges
-- Version: 1.0
-- Date: 2025-10-13
-- ============================================

-- Onboarding & Foundation Badges (4 badges - Green Theme)
INSERT INTO australian_badges (
  badge_id, badge_name, badge_description, badge_category, badge_theme,
  badge_icon, badge_color, unlock_criteria, unlock_logic, reward_points,
  rarity, australian_context, asic_reference, ato_reference, sort_order
) VALUES
('first_steps', 'First Steps', 'Welcome to Previa! You''ve taken the first step towards better financial management.',
 'onboarding', 'green', 'Trophy', '#10B981', 'Sign up and complete profile',
 '{"trigger": "user_signup_complete", "conditions": {"profile_complete": true}}'::jsonb,
 10, 'common', 'Start your Australian financial literacy journey with Previa', NULL, NULL, 1),

('account_creator', 'Account Creator', 'You''ve connected your first Australian bank account. Time to get reconciling!',
 'onboarding', 'green', 'Building', '#10B981', 'Connect first bank account',
 '{"trigger": "bank_account_created", "conditions": {"account_count": 1}}'::jsonb,
 25, 'common', 'Whether it''s Big Four or a regional bank, you''re connected and ready', NULL, NULL, 2),

('onboarding_complete', 'Onboarding Complete', 'You''ve completed the Previa onboarding process. Ready to tackle your finances!',
 'onboarding', 'green', 'CheckCircle', '#10B981', 'Finish onboarding flow',
 '{"trigger": "onboarding_completed", "conditions": {"all_steps_complete": true}}'::jsonb,
 50, 'common', 'Onboarding complete - now let''s build those financial habits', NULL, NULL, 3),

('receipt_rookie', 'Receipt Rookie', 'First receipt uploaded! Keep those GST-compliant records coming.',
 'onboarding', 'green', 'Camera', '#10B981', 'Upload first receipt',
 '{"trigger": "receipt_uploaded", "conditions": {"receipt_count": 1}}'::jsonb,
 15, 'common', 'Record-keeping is essential for ATO compliance and tax deductions',
 NULL, 'https://www.ato.gov.au/business/records-for-business', 4);

-- Transaction Management Badges (7 badges - Blue Theme)
INSERT INTO australian_badges (
  badge_id, badge_name, badge_description, badge_category, badge_theme,
  badge_icon, badge_color, unlock_criteria, unlock_logic, reward_points,
  rarity, australian_context, asic_reference, ato_reference, sort_order
) VALUES
('reconciliation_starter', 'Reconciliation Starter', '10 transactions reconciled! You''re building good bookkeeping habits.',
 'transaction', 'blue', 'RefreshCw', '#3B82F6', 'Reconcile 10 transactions',
 '{"trigger": "transaction_reconciled", "conditions": {"total_reconciled": 10}}'::jsonb,
 30, 'common', 'ATO record-keeping basics - maintain records for 5 years',
 NULL, 'https://www.ato.gov.au/business/records-for-business/keeping-your-records', 5),

('reconciliation_pro', 'Reconciliation Pro', '50 transactions reconciled! Your books are looking professional.',
 'transaction', 'blue', 'Medal', '#3B82F6', 'Reconcile 50 transactions',
 '{"trigger": "transaction_reconciled", "conditions": {"total_reconciled": 50}}'::jsonb,
 100, 'rare', 'Tax-ready bookkeeping - you''re prepared for EOFY', NULL, NULL, 6),

('reconciliation_expert', 'Reconciliation Expert', '100 transactions reconciled! You''re a reconciliation master.',
 'transaction', 'blue', 'Award', '#3B82F6', 'Reconcile 100 transactions',
 '{"trigger": "transaction_reconciled", "conditions": {"total_reconciled": 100}}'::jsonb,
 250, 'epic', 'Professional-grade records that would make any accountant proud', NULL, NULL, 7),

('category_master', 'Category Master', '100 transactions categorized! Tax deduction optimization unlocked.',
 'transaction', 'blue', 'PieChart', '#3B82F6', 'Categorize 100 transactions',
 '{"trigger": "transaction_categorized", "conditions": {"total_categorized": 100}}'::jsonb,
 150, 'rare', 'Proper categorization helps maximize tax deductions',
 NULL, 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim', 8),

('receipt_hunter_bronze', 'Receipt Hunter (Bronze)', '10 receipts uploaded! Keep building that paper trail.',
 'transaction', 'blue', 'Camera', '#CD7F32', 'Upload 10 receipts',
 '{"trigger": "receipt_uploaded", "conditions": {"receipt_count": 10}}'::jsonb,
 40, 'common', 'GST-compliant record keeping in progress', NULL, NULL, 22),

('receipt_hunter_silver', 'Receipt Hunter (Silver)', '50 receipts uploaded! Professional record keeping.',
 'transaction', 'blue', 'Camera', '#C0C0C0', 'Upload 50 receipts',
 '{"trigger": "receipt_uploaded", "conditions": {"receipt_count": 50}}'::jsonb,
 120, 'rare', 'Comprehensive expense documentation', NULL, NULL, 23),

('receipt_hunter_gold', 'Receipt Hunter (Gold)', '100 receipts uploaded! Master record keeper.',
 'transaction', 'blue', 'Camera', '#FFD700', 'Upload 100 receipts',
 '{"trigger": "receipt_uploaded", "conditions": {"receipt_count": 100}}'::jsonb,
 300, 'epic', 'ATO-compliant record keeping champion', NULL, NULL, 24);

-- Australian Financial Literacy Badges (6 badges - Gold Theme)
INSERT INTO australian_badges (
  badge_id, badge_name, badge_description, badge_category, badge_theme,
  badge_icon, badge_color, unlock_criteria, unlock_logic, reward_points,
  rarity, australian_context, asic_reference, ato_reference, sort_order
) VALUES
('aussie_super_star', '🇦🇺 Aussie Super Star', 'Completed the Australian Superannuation module! You understand SG rates, concessional caps, and fund types.',
 'education', 'gold', 'Star', '#FFD700', 'Complete superannuation education module',
 '{"trigger": "educational_module_completed", "conditions": {"module_id": "australian_superannuation", "quiz_score_min": 80}}'::jsonb,
 200, 'epic', 'Master the 11.5% SG rate, $30k concessional caps, and fund comparison',
 'https://moneysmart.gov.au/how-super-works', 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families', 9),

('tax_ninja', '🧾 Tax Ninja', 'Completed the Australian Taxation module! PAYG, GST, and deductions mastered.',
 'education', 'gold', 'FileText', '#FFD700', 'Complete tax basics education module',
 '{"trigger": "educational_module_completed", "conditions": {"module_id": "australian_taxation", "quiz_score_min": 80}}'::jsonb,
 200, 'epic', 'Navigate tax brackets (0%, 16%, 30%, 37%, 45%) and maximize deductions',
 NULL, 'https://www.ato.gov.au/rates-and-codes/tax-rates-australian-residents', 10),

('banking_pro', '🏦 Banking Pro', 'Completed the Australian Banking module! Big Four comparison and fee reduction expertise.',
 'education', 'gold', 'Landmark', '#FFD700', 'Complete banking education module',
 '{"trigger": "educational_module_completed", "conditions": {"module_id": "australian_banking", "quiz_score_min": 80}}'::jsonb,
 150, 'rare', 'Master CBA, ANZ, Westpac, NAB comparison and fee optimization',
 'https://moneysmart.gov.au/banking', NULL, 11),

('consumer_champion', '🛡️ Consumer Champion', 'Completed the Consumer Rights module! ACL and AFCA expert.',
 'education', 'gold', 'Shield', '#FFD700', 'Complete consumer rights education module',
 '{"trigger": "educational_module_completed", "conditions": {"module_id": "consumer_rights", "quiz_score_min": 80}}'::jsonb,
 150, 'rare', 'Know your rights under Australian Consumer Law and AFCA processes',
 'https://moneysmart.gov.au/consumer-protection', NULL, 12),

('scam_spotter', '🚨 Scam Spotter', 'Completed the Scam Prevention module! ATO scam and phishing detection master.',
 'education', 'gold', 'AlertTriangle', '#FFD700', 'Complete scam prevention education module',
 '{"trigger": "educational_module_completed", "conditions": {"module_id": "scam_prevention", "quiz_score_min": 80}}'::jsonb,
 100, 'rare', 'Identify ATO scams, phishing, and protect your identity',
 'https://moneysmart.gov.au/scams', 'https://www.ato.gov.au/about-ato/managing-the-tax-and-super-system/how-we-fight-fraud', 13),

('gst_guru', '🧮 GST Guru', 'Correctly identified 20 GST-applicable transactions!',
 'education', 'gold', 'Calculator', '#FFD700', 'Tag 20 GST transactions',
 '{"trigger": "gst_transaction_tagged", "conditions": {"gst_count": 20}}'::jsonb,
 110, 'rare', 'Master 10% GST identification for business claims', NULL, NULL, 29);

-- Data-Driven Achievement Badges (6 badges - Purple Theme)
INSERT INTO australian_badges (
  badge_id, badge_name, badge_description, badge_category, badge_theme,
  badge_icon, badge_color, unlock_criteria, unlock_logic, reward_points,
  rarity, australian_context, asic_reference, ato_reference, sort_order
) VALUES
('duplicate_detective', '🔍 Duplicate Detective', 'Identified subscription duplicates! Potential savings unlocked.',
 'data_driven', 'purple', 'Search', '#9333EA', 'Identify 2+ duplicate subscriptions',
 '{"trigger": "transaction_analysis", "conditions": {"duplicate_subscriptions_found": 2, "analysis_type": "subscription_duplicate_detection"}}'::jsonb,
 75, 'rare', 'Average Australian has duplicate subscriptions costing $200+/month', NULL, NULL, 14),

('budget_master', '💰 Budget Master', 'Stayed under budget in 3+ categories for a month! Financial discipline achieved.',
 'data_driven', 'purple', 'DollarSign', '#9333EA', 'Stay under budget in 3+ categories for 1 month',
 '{"trigger": "monthly_budget_analysis", "conditions": {"categories_under_budget": 3, "consecutive_months": 1}}'::jsonb,
 300, 'epic', 'Category-level spending mastery - 50/30/20 rule in action',
 'https://moneysmart.gov.au/budgeting', NULL, 15),

('tax_time_hero', '📈 Tax Time Hero', 'Tagged 50+ work-related expenses! EOFY ready status achieved.',
 'data_driven', 'purple', 'TrendingUp', '#9333EA', 'Tag 50+ work-related expenses',
 '{"trigger": "transaction_analysis", "conditions": {"work_expenses_tagged": 50, "analysis_type": "tax_readiness"}}'::jsonb,
 200, 'epic', 'EOFY readiness - maximize deductions within ATO guidelines',
 NULL, 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-expenses', 16),

('savings_streak', '🎯 Savings Streak', '4 consecutive weeks of positive cash flow! Building that emergency fund.',
 'data_driven', 'purple', 'Target', '#9333EA', 'Achieve 4 weeks of positive cash flow',
 '{"trigger": "weekly_cash_flow_analysis", "conditions": {"consecutive_positive_weeks": 4, "analysis_type": "cash_flow_tracking"}}'::jsonb,
 150, 'rare', 'Emergency fund target: 3-6 months of expenses in high-interest savings',
 'https://moneysmart.gov.au/saving/emergency-fund', NULL, 17),

('spending_analyzer', '🧮 Spending Analyzer', 'Reviewed 90 days of spending trends! Pattern recognition unlocked.',
 'data_driven', 'purple', 'Calculator', '#9333EA', 'Review 90 days of transaction trends',
 '{"trigger": "transaction_analysis", "conditions": {"days_analyzed": 90, "analysis_type": "spending_pattern_review"}}'::jsonb,
 100, 'rare', 'Identify spending patterns and optimize across categories',
 'https://moneysmart.gov.au/managing-your-money/tracking-your-spending', NULL, 18),

('trend_watcher', '📊 Trend Watcher', 'Reviewed spending trends 5 times! Data-driven decisions.',
 'data_driven', 'purple', 'TrendingUp', '#9333EA', 'Review spending trends 5 times',
 '{"trigger": "trend_review", "conditions": {"review_count": 5}}'::jsonb,
 90, 'rare', 'Identify Australian cost of living trends', NULL, NULL, 28);

-- Milestone Achievement Badges (7 badges - Platinum Theme)
INSERT INTO australian_badges (
  badge_id, badge_name, badge_description, badge_category, badge_theme,
  badge_icon, badge_color, unlock_criteria, unlock_logic, reward_points,
  rarity, australian_context, asic_reference, ato_reference, sort_order
) VALUES
('six_month_veteran', '🌟 6-Month Veteran', 'Active for 6 months! Financial habit formation achieved.',
 'milestone', 'platinum', 'Sparkles', '#E5E4E2', 'Active for 6 months',
 '{"trigger": "account_age_check", "conditions": {"months_active": 6, "min_activity_per_month": 5}}'::jsonb,
 500, 'legendary', '6 months of consistent financial management - habit formed!', NULL, NULL, 19),

('year_in_review', '💎 Year in Review', 'Complete annual financial summary! Full financial year tracked.',
 'milestone', 'platinum', 'Gem', '#E5E4E2', 'Complete annual summary',
 '{"trigger": "annual_summary_completed", "conditions": {"financial_year_complete": true, "reconciliation_rate_min": 80}}'::jsonb,
 1000, 'legendary', 'Full FY tracked from July 1 to June 30 - accountant ready!', NULL, NULL, 20),

('tax_ready', '🎊 Tax Ready', 'Exported EOFY data for your accountant! Tax time preparation complete.',
 'milestone', 'platinum', 'PartyPopper', '#E5E4E2', 'Export EOFY data package',
 '{"trigger": "eofy_export_completed", "conditions": {"export_format": "tax_package", "data_completeness_min": 90}}'::jsonb,
 750, 'legendary', 'Accountant-ready documentation with all deductions tracked',
 NULL, 'https://www.ato.gov.au/individuals-and-families/your-tax-return', 21),

('weekly_warrior', '📅 Weekly Warrior', 'Used app 7 days in a row! Consistency is key.',
 'milestone', 'platinum', 'Calendar', '#3B82F6', '7-day login streak',
 '{"trigger": "login_streak", "conditions": {"consecutive_days": 7}}'::jsonb,
 80, 'rare', 'Weekly financial habits lead to long-term success', NULL, NULL, 25),

('monthly_champion', '🔥 Monthly Champion', 'Completed all monthly tasks! Financial discipline master.',
 'milestone', 'platinum', 'Flame', '#FF6B6B', 'Complete all monthly tasks',
 '{"trigger": "monthly_tasks_completed", "conditions": {"all_complete": true}}'::jsonb,
 400, 'epic', 'Monthly financial review completed', NULL, NULL, 26),

('goal_setter', '🎯 Goal Setter', 'Created your first financial goal! Vision established.',
 'education', 'gold', 'Target', '#FFD700', 'Create first financial goal',
 '{"trigger": "goal_created", "conditions": {"goal_count": 1}}'::jsonb,
 60, 'common', 'SMART financial goals for Australian context', NULL, NULL, 27),

('first_financial_year', '📅 First Financial Year', 'Completed your first July-June financial year with Previa!',
 'milestone', 'platinum', 'Calendar', '#E5E4E2', 'Complete first FY (July-June)',
 '{"trigger": "financial_year_completed", "conditions": {"fy_count": 1, "start_month": 7, "end_month": 6}}'::jsonb,
 800, 'legendary', 'First Australian financial year (July 1 - June 30) complete', NULL, NULL, 30);

-- Add comment
COMMENT ON TABLE australian_badges IS '30 Australian-specific badges seeded - ready for gamification';
