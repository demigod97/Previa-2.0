-- ============================================================================
-- FINANCIAL SCHEMA MIGRATION FOR PREVIA
-- Creates all tables for the financial intelligence platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER TIER MANAGEMENT (FREEMIUM MODEL)
-- ============================================================================

-- User tier table with limits for free and premium users
CREATE TABLE IF NOT EXISTS public.user_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('user', 'premium_user')),
  -- Tier limits for 'user' (free tier): 3 accounts, 50 trans/month, 10 receipts/month
  -- Premium tier ('premium_user'): Unlimited
  accounts_limit INTEGER DEFAULT 3,
  transactions_monthly_limit INTEGER DEFAULT 50,
  receipts_monthly_limit INTEGER DEFAULT 10,
  upgraded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- BANK ACCOUNTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number_masked TEXT, -- Last 4 digits only for security
  balance DECIMAL(15,2),
  currency TEXT DEFAULT 'AUD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BANK STATEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.bank_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size BIGINT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  extraction_confidence DECIMAL(3,2), -- OCR confidence (0.00 to 1.00, target 0.90+)
  extracted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_statement_id UUID REFERENCES public.bank_statements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'unreconciled' CHECK (status IN ('unreconciled', 'matched', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RECEIPTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant TEXT,
  receipt_date DATE,
  amount DECIMAL(15,2),
  tax DECIMAL(15,2),
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size BIGINT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  confidence_score DECIMAL(3,2), -- OCR confidence (target 0.90+ for amount/date)
  ocr_data JSONB, -- Raw OCR output
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RECONCILIATION MATCHES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reconciliation_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  receipt_id UUID REFERENCES public.receipts(id) ON DELETE CASCADE,
  confidence DECIMAL(3,2) NOT NULL, -- AI confidence score
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transaction_id, receipt_id)
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- User tier lookups
CREATE INDEX IF NOT EXISTS idx_user_tiers_user ON public.user_tiers(user_id);

-- Transaction queries by user and date
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);

-- Receipt queries by user and date
CREATE INDEX IF NOT EXISTS idx_receipts_user_date ON public.receipts(user_id, receipt_date DESC);

-- Reconciliation matches by user and status
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.reconciliation_matches(user_id, status);

-- Bank account lookups
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user ON public.bank_accounts(user_id);

-- Bank statement lookups
CREATE INDEX IF NOT EXISTS idx_bank_statements_account ON public.bank_statements(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_statements_user ON public.bank_statements(user_id);

-- Processing status lookups for UI
CREATE INDEX IF NOT EXISTS idx_receipts_processing ON public.receipts(user_id, processing_status);
CREATE INDEX IF NOT EXISTS idx_statements_processing ON public.bank_statements(user_id, processing_status);

