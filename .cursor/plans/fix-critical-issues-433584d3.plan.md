<!-- 433584d3-627e-4c7f-9062-240c5963399e f71a5fc9-29ac-4e11-926e-e9896124aa72 -->
# Fix Critical Issues & Configuration

## Overview

This plan addresses all critical issues identified in the PO Master Checklist validation, resolves configuration mismatches, shards PRD and Architecture documents, and establishes the foundation for Previa development.

## Phase 1: Configuration & Document Structure

### 1.1 Create Stories Directory

Create `docs/stories/` directory required by core-config.yaml for story file storage.

### 1.2 Shard PRD Document

Use markdown-tree-parser to split `docs/prd.md` into separate files by level 2 sections:

```bash
md-tree explode docs/prd.md docs/prd
```

Creates: `docs/prd/index.md` + separate files for each PRD section (Goals, Requirements, UI Design, Technical Assumptions, Epic List, Validation Report)

### 1.3 Shard Architecture Document

Use markdown-tree-parser to split `docs/architecture.md` into separate files:

```bash
md-tree explode docs/architecture.md docs/architecture
```

Creates: `docs/architecture/index.md` + separate files (Goals, PRD Alignment, High-Level Architecture, Frontend, Backend, Data Models, Security, Edge Cases, Observability, Implementation Notes)

### 1.4 Verify Configuration Alignment

Confirm `.bmad-core/core-config.yaml` settings match new structure:

- `prdSharded: true` ✓
- `architectureSharded: true` ✓
- `devStoryLocation: docs/stories` ✓ (after 1.1)

## Phase 2: Database Foundation

### 2.1 Create Financial Schema Migration

Create `supabase/migrations/20250109000001_create_financial_schema.sql` with tables from Architecture Section 6:

```sql
-- User tier management (freemium model)
CREATE TABLE user_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('user', 'premium_user')),
  -- Tier limits for 'user': 3 accounts, 50 trans/month, 10 receipts/month
  accounts_limit INTEGER DEFAULT 3,
  transactions_monthly_limit INTEGER DEFAULT 50,
  receipts_monthly_limit INTEGER DEFAULT 10,
  upgraded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

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

CREATE TABLE bank_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  extraction_confidence DECIMAL(3,2), -- OCR confidence (0.00 to 1.00, target 0.90+)
  extracted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  confidence_score DECIMAL(3,2), -- OCR confidence (target 0.90+ for amount/date)
  ocr_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reconciliation_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,
  confidence DECIMAL(3,2) NOT NULL,
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transaction_id, receipt_id)
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_receipts_user_date ON receipts(user_id, receipt_date DESC);
CREATE INDEX idx_matches_status ON reconciliation_matches(user_id, status);
CREATE INDEX idx_bank_accounts_user ON bank_accounts(user_id);
CREATE INDEX idx_bank_statements_account ON bank_statements(bank_account_id);
```

### 2.2 Create RLS Policies Migration

Create `supabase/migrations/20250109000002_create_financial_rls_policies.sql`:

```sql
-- Enable RLS on all financial tables
ALTER TABLE user_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_matches ENABLE ROW LEVEL SECURITY;

-- user_tiers: Users can only read their own tier
CREATE POLICY "Users can view own tier"
  ON user_tiers FOR SELECT
  USING (auth.uid() = user_id);

-- bank_accounts: Users own their accounts
CREATE POLICY "Users own their bank accounts"
  ON bank_accounts FOR ALL
  USING (auth.uid() = user_id);

-- bank_statements: Users own their statements
CREATE POLICY "Users own their bank statements"
  ON bank_statements FOR ALL
  USING (auth.uid() = user_id);

-- transactions: Users own their transactions
CREATE POLICY "Users own their transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id);

-- receipts: Users own their receipts
CREATE POLICY "Users own their receipts"
  ON receipts FOR ALL
  USING (auth.uid() = user_id);

-- reconciliation_matches: Users own their matches
CREATE POLICY "Users own their reconciliation matches"
  ON reconciliation_matches FOR ALL
  USING (auth.uid() = user_id);
```

### 2.3 Create Default User Tier Trigger

Create `supabase/migrations/20250109000003_create_default_tier_trigger.sql`:

```sql
-- Function to create default user tier on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_tiers (user_id, tier, accounts_limit, transactions_monthly_limit, receipts_monthly_limit)
  VALUES (NEW.id, 'user', 3, 50, 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
CREATE TRIGGER on_auth_user_created_tier
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_tier();
```

## Phase 3: Dependencies & Environment

### 3.1 Update package.json Dependencies

Audit and update `package.json`:

- Keep: React, Supabase, shadcn/ui components, Vite, Tailwind
- Add: Financial utilities (e.g., `currency.js` for amount formatting)
- Add: Chart library (recharts already present ✓)
- Add: Date handling (date-fns already present ✓)
- Remove/flag: PolicyAi-specific dependencies (if any identified)

Note: JetBrains Mono font for financial numbers (specify in tailwind.config.ts)

### 3.2 Document Required Environment Variables

Create `docs/environment-variables.md`:

```markdown
# Previa Environment Variables

## Supabase Configuration (Automatic)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key

## Edge Function Secrets (Server-side only, set in Supabase Dashboard)

### LLM Configuration
- `GEMINI_API_KEY` - Google Gemini API key (primary LLM)
- `OPENAI_API_KEY` - OpenAI GPT-4o API key (optional fallback)

### n8n Webhook URLs
- `CHAT_WEBHOOK_URL` - General financial chat endpoint
- `DOCUMENT_PROCESSING_WEBHOOK_URL` - OCR extraction for statements/receipts
- `RECONCILIATION_WEBHOOK_URL` - Transaction-receipt matching engine
- `ADDITIONAL_SOURCES_WEBHOOK_URL` - Website/text ingestion
- `GENERATE_NOTEBOOK_WEBHOOK_URL` - Notebook metadata enrichment

### Webhook Authentication
- `WEBHOOK_SECRET_TOKEN` - Shared secret for n8n webhook authentication

## Accuracy Thresholds (Application Constants)
- `OCR_ACCOUNT_NUMBER_THRESHOLD` - 0.90 (90% confidence required)
- `OCR_RECEIPT_DATA_THRESHOLD` - 0.90 (90% confidence for amount/date)
- `RECONCILIATION_AUTO_APPROVE_THRESHOLD` - 0.95 (auto-approve matches above this)

## Tier Limits (Enforced in Database)
Free tier (`user`):
- 3 bank accounts
- 50 transactions/month
- 10 receipts/month

Premium tier (`premium_user`):
- Unlimited
```

### 3.3 Document n8n Workflow Requirements

Create `docs/n8n-workflow-requirements.md`:

````markdown
# n8n Workflow Requirements for Previa

## Required Workflows

### 1. Document Processing Workflow
**Webhook URL:** `DOCUMENT_PROCESSING_WEBHOOK_URL`

**Input (POST from Edge Function):**
```json
{
  "source_id": "uuid",
  "file_path": "storage/path/to/file.pdf",
  "source_type": "bank_statement" | "receipt",
  "callback_url": "https://.../process-document-callback"
}
````

**Processing:**

1. Download file from Supabase Storage
2. OCR extraction (Gemini Vision API)
3. For bank_statement: Extract institution, account_name, account_number (last 4), transactions[]
4. For receipt: Extract merchant, amount, date, tax
5. Calculate confidence score

**Output (POST to callback_url):**

```json
{
  "source_id": "uuid",
  "content": "extracted text",
  "summary": "AI summary",
  "title": "extracted title/name",
  "status": "completed" | "failed",
  "confidence": 0.90,
  "extracted_data": {
    "account_number_last4": "1234",
    "transactions": [...]
  },
  "error": "error message if failed"
}
```

**Target Accuracy:** 90% confidence for account numbers and receipt data

### 2. Reconciliation Matching Workflow

**Webhook URL:** `RECONCILIATION_WEBHOOK_URL`

**Input:**

```json
{
  "user_id": "uuid",
  "transaction_ids": ["uuid1", "uuid2"],
  "receipt_ids": ["uuid3", "uuid4"]
}
```

**Processing:**

1. Fetch transaction and receipt data
2. AI matching algorithm (date proximity, amount similarity, merchant name)
3. Generate confidence scores
4. Return suggested matches

**Output:**

```json
{
  "matches": [
    {
      "transaction_id": "uuid1",
      "receipt_id": "uuid3",
      "confidence": 0.95,
      "explanation": "Matched by exact date and amount"
    }
  ]
}
```

### 3. Chat Workflow (Financial Assistant)

**Webhook URL:** `CHAT_WEBHOOK_URL`

**Input:**

```json
{
  "session_id": "uuid",
  "message": "user message",
  "user_id": "uuid",
  "context": {
    "recent_transactions": [...],
    "account_balances": [...]
  }
}
```

**Processing:**

1. Query user's financial data
2. Generate AI response with citations
3. Return response with source references

**Output:**

```json
{
  "response": "AI response text",
  "citations": [
    {
      "source_id": "uuid",
      "source_type": "transaction",
      "reference": "Transaction on 2024-01-05"
    }
  ]
}
```

## Setup Instructions

1. Import workflow templates to n8n
2. Configure webhook URLs
3. Set authentication tokens
4. Test each workflow with sample data
5. Add webhook URLs to Supabase Edge Function secrets
````

## Phase 4: Testing Infrastructure

### 4.1 Create Test Database Fixtures
Create `src/test/fixtures/financial-data.ts`:

```typescript
export const mockBankAccount = {
  id: 'test-account-001',
  user_id: 'test-user-001',
  institution: 'Commonwealth Bank',
  account_name: 'Everyday Account',
  account_number_masked: '1234',
  balance: 5430.50,
  currency: 'AUD'
};

export const mockBankStatement = {
  id: 'test-statement-001',
  bank_account_id: 'test-account-001',
  user_id: 'test-user-001',
  period_start: '2024-01-01',
  period_end: '2024-01-31',
  file_path: 'test/fixtures/sample-statement.pdf',
  processing_status: 'completed',
  extraction_confidence: 0.92
};

export const mockTransactions = [
  {
    id: 'test-tx-001',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-15',
    amount: -45.50,
    description: 'Woolworths',
    category: 'Groceries',
    status: 'unreconciled'
  },
  // Add 10+ sample transactions
];

export const mockReceipts = [
  {
    id: 'test-receipt-001',
    user_id: 'test-user-001',
    merchant: 'Woolworths',
    receipt_date: '2024-01-15',
    amount: 45.50,
    tax: 4.14,
    file_path: 'test/fixtures/sample-receipt.pdf',
    processing_status: 'completed',
    confidence_score: 0.91
  },
  // Add 5+ sample receipts
];

export const mockReconciliationMatch = {
  id: 'test-match-001',
  user_id: 'test-user-001',
  transaction_id: 'test-tx-001',
  receipt_id: 'test-receipt-001',
  confidence: 0.95,
  status: 'suggested'
};
````


### 4.2 Create Sample Test Files

Create directory `public/test-fixtures/`:

- `sample-statement.pdf` - Mock bank statement (can be generated or placeholder)
- `sample-receipt-001.pdf` - Mock receipt
- `sample-receipt-002.jpg` - Mock receipt image

Document location in `docs/testing-strategy.md` section on test data.

### 4.3 Update Vitest Configuration

Verify `vitest.config.ts` includes:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
});
```

## Phase 5: Documentation Updates

### 5.1 Update README.md

Add Previa-specific sections:

- Project description (Previa, not PolicyAi)
- Required Node.js version (18+)
- Setup instructions for financial platform
- Environment variables setup
- Link to `docs/environment-variables.md`
- LLM provider configuration (Gemini + optional GPT-4o)
- Testing instructions with mock data

### 5.2 Create Architecture Reference

Create `docs/architecture/TECHNICAL-DECISIONS.md`:

Document key decisions:

- LLM: Gemini (primary), GPT-4o (optional)
- OCR Accuracy: 90% threshold
- Tier Limits: Free (3/50/10), Premium (unlimited)
- Testing: Mock financial data fixtures
- n8n: Workflow-based processing

### 5.3 Update Project Log

Add entry to `docs/project-log.md`:

```markdown
## 2025-01-09 - Critical Issues Fixed & Configuration Resolved

### Actions Taken
- Created stories directory for BMad workflow
- Sharded PRD and Architecture into separate files
- Created database migrations for financial schema (7 tables + RLS)
- Updated dependencies for Previa financial platform
- Documented environment variables and n8n workflows
- Created test fixtures for financial data
- Resolved all critical issues from PO validation

### Technical Decisions
- LLM: Google Gemini (primary), OpenAI GPT-4o (optional fallback)
- Tier Limits: Free tier (3 accounts, 50 trans/month, 10 receipts/month), Premium (unlimited)
- OCR Thresholds: 90% accuracy for account numbers and receipt data
- Testing: Mock data fixtures approach

### Status
All critical blockers resolved. Ready for:
1. Architect review and migration validation
2. Epic and story creation by Scrum Master
3. Development kickoff
```

## Completion Checklist

- [ ] docs/stories/ directory created
- [ ] PRD sharded to docs/prd/
- [ ] Architecture sharded to docs/architecture/
- [ ] 3 database migration files created
- [ ] Environment variables documented
- [ ] n8n workflow requirements documented
- [ ] Test fixtures created
- [ ] package.json reviewed/updated
- [ ] README.md updated for Previa
- [ ] TECHNICAL-DECISIONS.md created
- [ ] project-log.md updated

## Next Steps After Plan Execution

1. Run migrations in Supabase (or test locally)
2. Activate Architect agent to validate migrations
3. Activate Scrum Master to create 6 epics + Epic 1 stories (1.1-1.6)
4. Begin development with solid foundation

### To-dos

- [ ] Create stories directory and shard PRD/Architecture documents
- [ ] Create 3 database migration files for financial schema + RLS + triggers
- [ ] Document environment variables and n8n workflow requirements
- [ ] Create test fixtures and sample financial data
- [ ] Update package.json dependencies and project documentation