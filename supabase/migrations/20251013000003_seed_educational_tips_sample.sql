-- ============================================
-- SEED DATA: EDUCATIONAL TIPS (SAMPLE)
-- Migration: Insert sample Australian financial tips
-- Version: 1.0
-- Date: 2025-10-13
-- Note: This is a representative sample. Full 205 tips in docs/gamification/tips.yaml
-- ============================================

-- Tax & Deductions Tips (Sample: 10 of 40)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('tax_001', 'Work-related expenses must pass the 3-part test: you spent it, it''s work-related, and you have records.',
 'tax', 'deductions', 'work_expense_tagged', 'all', 'beginner',
 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-expenses',
 true, 'ATO - Work-related expenses'),

('tax_002', 'Home office running costs: 67¢/hour for 2024-25 covers electricity, cleaning, heating, and more.',
 'tax', 'deductions', NULL, 'all', 'intermediate',
 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses',
 true, 'ATO - Working from home expenses'),

('tax_003', 'Keep receipts for work expenses over $300. Under $300, records can be simpler (bank statements OK).',
 'tax', 'record_keeping', 'receipt_upload', 'all', 'beginner',
 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/records-you-need-to-keep',
 true, 'ATO - Record keeping'),

('tax_006', 'Tax brackets for 2024-25: 0% up to $18,200 | 16% $18,201-$45,000 | 30% $45,001-$135,000 | 37% $135,001-$190,000 | 45% over $190,000.',
 'tax', 'rates', NULL, 'all', 'beginner',
 'https://www.ato.gov.au/rates-and-codes/tax-rates-australian-residents',
 true, 'ATO - Tax rates'),

('tax_010', 'Tax return deadline: October 31 if lodging yourself, May 15 if using a registered tax agent.',
 'tax', 'compliance', NULL, 'all', 'beginner',
 'https://www.ato.gov.au/individuals-and-families/your-tax-return/in-detail/when-to-lodge-your-tax-return',
 true, 'ATO - Lodgment dates'),

('tax_016', 'Capital gains tax: 50% discount if asset held over 12 months (applies to shares, property, crypto).',
 'tax', 'capital_gains', NULL, '25-35', 'advanced',
 'https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax',
 true, 'ATO - Capital gains tax'),

('tax_019', 'HECS/HELP repayment threshold for 2024-25: $54,435. Repayment rates start at 1%.',
 'tax', 'hecs_help', NULL, '18-25', 'beginner',
 'https://www.ato.gov.au/individuals-and-families/education-and-study/help-hecs-and-other-study-loans',
 true, 'ATO - HELP repayment'),

('tax_024', 'Crypto tax: Capital gains apply. Track every trade - crypto-to-crypto counts as disposal.',
 'tax', 'crypto', NULL, '18-25', 'advanced',
 'https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments',
 true, 'ATO - Crypto assets'),

('tax_026', 'Tax file number (TFN): Keep it private. ATO will never ask for it via email or phone.',
 'tax', 'compliance', NULL, 'all', 'beginner', NULL, true, 'ATO - TFN security'),

('tax_037', 'myDeductions app: ATO''s free app to track expenses throughout the year for easy tax time.',
 'tax', 'tools', NULL, 'all', 'beginner',
 'https://www.ato.gov.au/calculators-and-tools/mydeductions',
 true, 'ATO - myDeductions');

-- Superannuation Tips (Sample: 10 of 30)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('super_001', 'Superannuation Guarantee (SG) rate: 11.5% for 2024-25, rising to 12% on July 1, 2025.',
 'super', 'basics', NULL, 'all', 'beginner',
 'https://www.ato.gov.au/rates-and-codes/key-superannuation-rates-and-thresholds',
 true, 'ATO - SG rate'),

('super_002', 'Concessional contribution cap: $30,000/year (includes employer + salary sacrifice). Taxed at 15%.',
 'super', 'contributions', NULL, 'all', 'intermediate',
 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions',
 true, 'ATO - Contribution caps'),

('super_004', 'Salary sacrifice: Reduce taxable income by directing pre-tax salary to super. Saves tax if on 30%+ bracket.',
 'super', 'contributions', NULL, '25-35', 'intermediate', NULL, true, 'ATO - Salary sacrifice'),

('super_005', 'Check your super fund fees: Industry funds average 0.8%, retail funds 1.2%. Even 0.5% matters over 30 years.',
 'super', 'fees', NULL, 'all', 'beginner',
 'https://moneysmart.gov.au/how-super-works/super-fees',
 true, 'ASIC MoneySmart - Super fees'),

('super_006', 'Consolidate super accounts: Multiple accounts = multiple fees. Use ATO''s online service to find lost super.',
 'super', 'consolidation', NULL, 'all', 'beginner',
 'https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/keeping-track-of-your-super/finding-your-lost-super',
 true, 'ATO - Find lost super'),

('super_007', 'Preservation age: Born after 1964 = age 60. Can''t access super before this (except hardship/compassionate grounds).',
 'super', 'access', NULL, 'all', 'beginner', NULL, true, 'ATO - Preservation age'),

('super_009', 'Age Pension: Assets test and income test apply. Max couple payment ~$44k/year (2024-25, indexed).',
 'super', 'retirement', NULL, '30-50', 'advanced',
 'https://www.servicesaustralia.gov.au/age-pension',
 true, 'Services Australia - Age Pension'),

('super_011', 'Government co-contribution: Earn under $59k, make after-tax contribution, govt adds up to $500.',
 'super', 'contributions', NULL, '18-25', 'intermediate', NULL, true, 'ATO - Co-contribution'),

('super_023', 'Estimate retirement income: Use ASIC''s super calculator to see if you''re on track for desired lifestyle.',
 'super', 'planning', NULL, 'all', 'beginner',
 'https://moneysmart.gov.au/how-super-works/super-calculator',
 true, 'ASIC - Super calculator'),

('super_030', 'Super early access (compassionate grounds): Terminal illness, severe financial hardship. Strict criteria apply.',
 'super', 'access', NULL, 'all', 'intermediate', NULL, true, 'ATO - Early access');

-- Banking & Fees Tips (Sample: 5 of 25)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('bank_001', 'Big Four banks (CBA, ANZ, Westpac, NAB) vs online banks: Compare account-keeping fees - many online banks charge $0.',
 'banking', 'fees', NULL, 'all', 'beginner',
 'https://moneysmart.gov.au/banking/bank-fees',
 true, 'ASIC - Bank fees'),

('bank_002', 'Offset account: Savings linked to mortgage reduces interest. Every dollar in offset = dollar less interest charged.',
 'banking', 'home_loans', NULL, '30-50', 'intermediate', NULL, true, 'ASIC - Offset accounts'),

('bank_003', 'Credit score (300-850): Check for free with Equifax, Experian, illion. Impacts loan approvals and rates.',
 'banking', 'credit', NULL, 'all', 'beginner', NULL, true, 'ASIC - Credit reporting'),

('bank_004', 'International transfer fees: Compare Wise vs bank transfers (can save 5-8x on exchange rates).',
 'banking', 'fees', NULL, 'all', 'intermediate', NULL, true, NULL),

('bank_005', 'High-interest savings accounts: Compare rates (currently 4-5.5%). Set up automatic transfers from transaction account.',
 'banking', 'savings', NULL, 'all', 'beginner', NULL, true, NULL);

-- GST & Business Tips (Sample: 5 of 20)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('gst_001', 'GST is 10% on most goods and services. Register for ABN if business turnover exceeds $75,000.',
 'gst', 'registration', NULL, 'all', 'beginner',
 'https://www.ato.gov.au/business/gst',
 true, 'ATO - GST registration'),

('gst_002', 'GST-free items: Fresh food, education, health services, exports. GST doesn''t apply to these.',
 'gst', 'exemptions', NULL, 'all', 'beginner', NULL, true, 'ATO - GST-free sales'),

('gst_003', 'Claim GST credits on business purchases when registered for GST. Keep tax invoices for purchases over $82.50.',
 'gst', 'credits', NULL, 'all', 'intermediate', NULL, true, 'ATO - GST credits'),

('gst_004', 'BAS (Business Activity Statement) due quarterly: Jan 28, Apr 28, Jul 28, Oct 28 (or monthly if large).',
 'gst', 'compliance', NULL, 'all', 'intermediate', NULL, true, 'ATO - BAS lodgment'),

('gst_005', 'GST on imports: Goods valued over $1,000 have GST applied at border. Under $1,000, supplier collects GST.',
 'gst', 'imports', NULL, 'all', 'advanced', NULL, true, NULL);

-- Consumer Rights Tips (Sample: 5 of 25)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('consumer_001', 'Consumer guarantees: Goods must be acceptable quality, fit for purpose. Retailers can''t exclude these rights.',
 'consumer', 'acl', NULL, 'all', 'beginner',
 'https://www.accc.gov.au/consumers/consumer-rights-guarantees',
 true, 'ACCC - Consumer guarantees'),

('consumer_002', 'AFCA (Australian Financial Complaints Authority): Free dispute resolution for banks, insurance, super, credit.',
 'consumer', 'afca', NULL, 'all', 'beginner',
 'https://www.afca.org.au',
 true, 'AFCA'),

('consumer_003', 'Cooling-off periods: 10 business days for door-to-door sales over $100, 14 days for life insurance/super.',
 'consumer', 'cooling_off', NULL, 'all', 'intermediate', NULL, true, 'ACCC - Cooling-off'),

('consumer_004', 'Chargebacks: Available for unauthorized transactions and non-delivery. Contact bank within 120 days.',
 'consumer', 'chargebacks', NULL, 'all', 'beginner', NULL, true, NULL),

('consumer_005', 'Product Disclosure Statement (PDS): Read before buying financial products. Contains fees, risks, features.',
 'consumer', 'disclosure', NULL, 'all', 'intermediate', NULL, true, 'ASIC - PDS');

-- Budgeting & Saving Tips (Sample: 5 of 30)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('budget_001', '50/30/20 rule: 50% needs, 30% wants, 20% savings/debt repayment. Adjust for Australian cost of living.',
 'budget', 'basics', NULL, 'all', 'beginner',
 'https://moneysmart.gov.au/budgeting',
 true, 'ASIC - Budgeting'),

('budget_002', 'Emergency fund target: 3-6 months of expenses in high-interest savings account (compare rates on RateCity).',
 'budget', 'emergency_fund', NULL, 'all', 'beginner',
 'https://moneysmart.gov.au/saving/emergency-fund',
 true, 'ASIC - Emergency funds'),

('budget_003', 'Automate savings: Direct debit to separate account on payday. Pay yourself first before discretionary spending.',
 'budget', 'automation', NULL, 'all', 'beginner', NULL, true, NULL),

('budget_004', 'Track subscriptions: Average Australian has 5+ recurring charges ($200+/month). Review quarterly and cancel unused.',
 'budget', 'subscriptions', 'duplicate_detected', 'all', 'beginner', NULL, true, NULL),

('budget_005', 'Meal planning saves $100+/week: Plan meals, shop with list, batch cook. Reduces impulse buys and food waste.',
 'budget', 'groceries', NULL, 'all', 'beginner', NULL, true, NULL);

-- Scam Prevention Tips (Sample: 5 of 20)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('scam_001', 'ATO scams: ATO never demands immediate payment via iTunes cards, gift cards, or cryptocurrency.',
 'scam', 'ato_scams', NULL, 'all', 'beginner',
 'https://www.scamwatch.gov.au',
 true, 'Scamwatch'),

('scam_002', 'Verify sender email: Real ATO emails end in @ato.gov.au. Check for spelling errors and suspicious links.',
 'scam', 'phishing', NULL, 'all', 'beginner', NULL, true, 'ATO - Scam alerts'),

('scam_003', 'Banks never ask for full passwords, PINs, or one-time codes via SMS/call. Hang up and call bank directly.',
 'scam', 'bank_scams', NULL, 'all', 'beginner', NULL, true, NULL),

('scam_004', 'Verify ASIC licensee status at asic.gov.au before investing. Check ABN and professional credentials.',
 'scam', 'investment_scams', NULL, '25-35', 'intermediate', NULL, true, 'ASIC - Licensee check'),

('scam_005', 'Scamwatch.gov.au: Report scams to help others. Check latest scam trends before making financial decisions.',
 'scam', 'reporting', NULL, 'all', 'beginner',
 'https://www.scamwatch.gov.au',
 true, 'Scamwatch');

-- Debt Management Tips (Sample: 5 of 15)
INSERT INTO educational_tips (
  tip_id, tip_text, tip_category, tip_subcategory, context_trigger,
  age_group, difficulty_level, external_link, is_australian_specific, regulatory_reference
) VALUES
('debt_001', 'HECS/HELP indexation: Debt indexed June 1 based on CPI. Make voluntary repayments before indexation to save.',
 'debt', 'hecs', NULL, '18-25', 'intermediate', NULL, true, 'ATO - HELP repayment'),

('debt_002', 'Credit card interest: Average 19-22% p.a. Pay in full monthly or consolidate with personal loan (7-15%).',
 'debt', 'credit_cards', NULL, 'all', 'beginner', NULL, true, 'ASIC - Credit cards'),

('debt_003', 'Debt avalanche vs snowball: Avalanche = highest interest first (saves money). Snowball = smallest first (motivation).',
 'debt', 'strategy', NULL, 'all', 'intermediate', NULL, true, NULL),

('debt_004', 'Hardship provisions: Banks must offer assistance if facing financial difficulty. Contact them early.',
 'debt', 'hardship', NULL, 'all', 'beginner', NULL, true, 'Banking Code - Hardship'),

('debt_005', 'Balance transfer offers: 0% for 6-24 months on credit cards. Watch for balance transfer fee (1-3%) and revert rate.',
 'debt', 'consolidation', NULL, 'all', 'intermediate', NULL, true, NULL);

-- Add comment
COMMENT ON TABLE educational_tips IS 'Sample Australian financial tips seeded (60 of 205) - Full set in docs/gamification/tips.yaml';
