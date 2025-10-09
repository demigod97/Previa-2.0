# Previa Environment Variables

**Last Updated:** 2025-01-09  
**Purpose:** Document all required environment variables for Previa financial platform

---

## Supabase Configuration (Automatic)

These are automatically configured when you create a Supabase project:

- `VITE_SUPABASE_URL` - Supabase project URL (e.g., https://your-project.supabase.co)
- `VITE_SUPABASE_ANON_KEY` - Public anon key for client-side access

**Location:** Set in `.env` or `.env.local` for local development

---

## Edge Function Secrets (Server-side only)

**CRITICAL:** These secrets must ONLY be set in Supabase Dashboard → Edge Functions → Secrets.  
Never expose these in client-side code or commit to version control.

### LLM Configuration

- `GEMINI_API_KEY` - Google Gemini API key (**PRIMARY LLM**)
  - Purpose: OCR extraction from bank statements and receipts
  - Large context window ideal for processing entire documents
  - Required for Epic 3 (Document Upload & OCR Processing)

- `OPENAI_API_KEY` - OpenAI GPT-4o API key (**OPTIONAL FALLBACK**)
  - Purpose: Redundancy if Gemini fails or rate-limited
  - Used for chat assistant and reconciliation
  - Optional but recommended for production

### n8n Webhook URLs

- `CHAT_WEBHOOK_URL` - General financial chat endpoint
  - Purpose: AI chat assistant for financial guidance with citations
  - Required for Epic 5 (Dashboard - Chat View)

- `DOCUMENT_PROCESSING_WEBHOOK_URL` - OCR extraction for statements/receipts
  - Purpose: Processes uploaded documents → extracts data → stores in DB
  - Required for Epic 3 (Document Upload & OCR Processing)

- `RECONCILIATION_WEBHOOK_URL` - Transaction-receipt matching engine
  - Purpose: AI-powered matching of transactions to receipts
  - Required for Epic 4 (Reconciliation Engine)

- `ADDITIONAL_SOURCES_WEBHOOK_URL` - Website/text ingestion
  - Purpose: Process additional sources (copied text, website links)
  - Optional for MVP

- `GENERATE_NOTEBOOK_WEBHOOK_URL` - Notebook metadata enrichment
  - Purpose: Legacy PolicyAi feature (may not be needed for Previa MVP)
  - Optional

### Webhook Authentication

- `WEBHOOK_SECRET_TOKEN` - Shared secret for n8n webhook authentication
  - Purpose: Validates Edge Function → n8n webhook calls
  - Generate a strong random string (e.g., `openssl rand -hex 32`)

---

## Accuracy Thresholds (Application Constants)

These are NOT environment variables but constants in your code (e.g., `src/config/constants.ts`):

```typescript
// OCR Confidence Thresholds
export const OCR_ACCOUNT_NUMBER_THRESHOLD = 0.90; // 90% confidence required
export const OCR_RECEIPT_DATA_THRESHOLD = 0.90;   // 90% confidence for amount/date

// Reconciliation
export const RECONCILIATION_AUTO_APPROVE_THRESHOLD = 0.95; // Auto-approve matches above this
```

**Decision:** 90% accuracy threshold for OCR extraction (account numbers, receipt amounts/dates)

---

## Tier Limits (Enforced in Database)

These limits are stored in the `user_tiers` table and enforced by Edge Functions:

### Free Tier (`user`)
- **Bank Accounts:** 3 maximum
- **Transactions:** 50 per month
- **Receipts:** 10 per month

### Premium Tier (`premium_user`)
- **All Limits:** Unlimited

**Decision:** Conservative free tier limits to encourage premium conversions

---

## Setup Instructions

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add Supabase credentials from your Supabase project dashboard:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **DO NOT** add server-side secrets to `.env.local` (they won't work)

### Supabase Edge Function Secrets

1. Go to Supabase Dashboard → Edge Functions → Secrets

2. Add each secret individually:
   ```bash
   # Via Supabase CLI
   supabase secrets set GEMINI_API_KEY=your-gemini-key
   supabase secrets set CHAT_WEBHOOK_URL=https://your-n8n.com/webhook/chat
   supabase secrets set DOCUMENT_PROCESSING_WEBHOOK_URL=https://your-n8n.com/webhook/process
   supabase secrets set RECONCILIATION_WEBHOOK_URL=https://your-n8n.com/webhook/reconcile
   supabase secrets set WEBHOOK_SECRET_TOKEN=your-random-secret
   ```

3. Verify secrets are set:
   ```bash
   supabase secrets list
   ```

---

## Security Best Practices

1. **Never commit secrets** to version control
   - Add `.env.local` to `.gitignore` ✓
   - Use `.env.example` as template with placeholder values

2. **Rotate secrets regularly**
   - Change `WEBHOOK_SECRET_TOKEN` quarterly
   - Update API keys if compromised

3. **Use environment-specific secrets**
   - Separate secrets for development/staging/production
   - Different n8n webhooks per environment

4. **Client vs Server separation**
   - Client can access: `VITE_*` variables only
   - Edge Functions can access: All secrets
   - Never expose server secrets to client

---

## Troubleshooting

### Edge Function can't access secrets

**Problem:** Edge Function returns error about missing env variable  
**Solution:** 
- Verify secrets are set in Supabase Dashboard
- Redeploy Edge Function after adding secrets
- Check spelling of secret names (case-sensitive)

### n8n webhook not receiving data

**Problem:** Webhook returns 404 or timeout  
**Solution:**
- Test webhook URL in Postman/curl first
- Verify `WEBHOOK_SECRET_TOKEN` matches in both Edge Function and n8n
- Check n8n workflow is activated

### LLM API errors

**Problem:** "Invalid API key" or rate limit errors  
**Solution:**
- Verify `GEMINI_API_KEY` is valid and has credits
- Check API quotas in Google Cloud Console
- Implement fallback to `OPENAI_API_KEY` if configured

---

## Reference

- Supabase Environment Variables: https://supabase.com/docs/guides/functions/secrets
- n8n Webhook Security: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- Google Gemini API: https://ai.google.dev/docs

