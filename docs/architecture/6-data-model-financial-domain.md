# 6) Data Model (Financial Domain)

**Core Tables:**

```sql
-- User tier management (freemium model)
CREATE TABLE user_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('user', 'premium_user')),
  upgraded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Bank accounts created from uploaded statements
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number_masked TEXT, -- Last 4 digits only
  balance DECIMAL(15,2),
  currency TEXT DEFAULT 'AUD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded bank statements (PDF/CSV sources)
CREATE TABLE bank_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size BIGINT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual transactions extracted from statements
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_statement_id UUID REFERENCES bank_statements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'unreconciled' CHECK (status IN ('unreconciled', 'matched', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded receipts/bills (PDF/image sources)
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant TEXT,
  receipt_date DATE,
  amount DECIMAL(15,2),
  tax DECIMAL(15,2),
  file_path TEXT NOT NULL,
  file_size BIGINT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  ocr_data JSONB, -- Raw OCR output
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-suggested matches between transactions and receipts
CREATE TABLE reconciliation_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,
  confidence DECIMAL(3,2) NOT NULL, -- AI confidence score
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transaction_id, receipt_id)
);
```

**Indexes for Performance:**
```sql
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_receipts_user_date ON receipts(user_id, receipt_date DESC);
CREATE INDEX idx_matches_status ON reconciliation_matches(user_id, status);
CREATE INDEX idx_bank_accounts_user ON bank_accounts(user_id);
```

**Note:** The old PolicyAi `sources` and `notebooks` tables are NOT reused. File uploads are tracked within domain-specific tables (`bank_statements`, `receipts`).
