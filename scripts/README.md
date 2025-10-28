# Receipt OCR Edge Function Test Scripts

This directory contains test scripts to verify the receipt OCR processing system is working correctly.

## Prerequisites

1. **Edge Functions Deployed**:
   ```bash
   supabase functions deploy process-receipt
   supabase functions deploy process-receipt-callback
   supabase functions deploy match-receipt-transactions
   ```

2. **Database Migrations Applied**:
   ```bash
   supabase db push
   ```

3. **Secrets Configured**:
   ```bash
   supabase secrets list
   # Should show: OPENAI_API_KEY, NOTEBOOK_GENERATION_AUTH, OCR_EXTRACT
   ```

4. **Environment Variables**:
   ```bash
   export SUPABASE_URL="https://your-project.supabase.co"
   export JWT_TOKEN="your-jwt-token"  # Get from Supabase Auth
   export NOTEBOOK_GENERATION_AUTH="your-secret-key"  # Match Supabase secret
   ```

## Test Scripts

### 1. Test Process Receipt (`test-process-receipt.sh`)

Tests the initial receipt processing trigger that:
- Validates JWT authentication
- Updates receipt status to 'processing'
- Generates signed URL for receipt file
- Triggers n8n OCR workflow

**Usage**:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

bash scripts/test-process-receipt.sh
```

**Expected Output**:
- HTTP 200 with `{ "success": true, "message": "Receipt processing started successfully" }`
- Receipt status in DB should be 'processing'
- n8n workflow should be triggered

### 2. Test Receipt Callback (`test-receipt-callback.sh`)

Simulates n8n sending OCR extraction results with mock data (Woolworths receipt).

Tests:
- NOTEBOOK_GENERATION_AUTH authentication
- OCR data structure validation
- Receipt status update to 'completed'
- Automatic AI matching trigger

**Usage**:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export NOTEBOOK_GENERATION_AUTH="Bearer your-secret-key"

bash scripts/test-receipt-callback.sh
```

**Expected Output**:
- HTTP 200 with stored merchant, amount, confidence
- Receipt status in DB should be 'completed'
- AI match suggestions created in ai_match_suggestions table

### 3. Test AI Matching (`test-ai-matching.sh`)

Tests OpenAI-powered transaction matching.

Tests:
- Receipt data retrieval
- Unreconciled transaction fetching (last 90 days)
- OpenAI API integration
- AI match suggestions storage

**Usage**:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

bash scripts/test-ai-matching.sh
```

**Expected Output**:
- HTTP 200 with AI match suggestions (0-5 matches)
- Each match has: transaction_id, confidence (0.0-1.0), reason
- Suggestions stored in ai_match_suggestions table

### 4. Verify Migrations (`verify-migrations.sql`)

SQL script to verify database migrations were applied correctly.

**Usage**:
```bash
psql $DATABASE_URL -f scripts/verify-migrations.sql
```

**Checks**:
- ✅ receipts table has new columns (category, processing_status, etc.)
- ✅ ai_match_suggestions table exists
- ✅ RLS policies are enabled
- ✅ Indexes created
- ✅ Triggers functional

## End-to-End Test Flow

```bash
# 1. Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export JWT_TOKEN="your-jwt-token"
export NOTEBOOK_GENERATION_AUTH="Bearer your-secret-key"

# 2. Verify migrations
psql $DATABASE_URL -f scripts/verify-migrations.sql

# 3. Test receipt processing trigger
bash scripts/test-process-receipt.sh

# 4. Simulate OCR callback (after n8n processes)
bash scripts/test-receipt-callback.sh

# 5. Test AI matching
bash scripts/test-ai-matching.sh
```

## Getting a JWT Token

### Option 1: Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click on a user
3. Copy the Access Token (JWT)

### Option 2: Using Supabase CLI
```bash
supabase auth login
# Follow prompts to get JWT token
```

### Option 3: Programmatically
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'password123'
});

console.log(data.session.access_token); // This is your JWT_TOKEN
```

## Troubleshooting

### "OCR service not configured" Error
- **Cause**: `OCR_EXTRACT` secret not set
- **Fix**: `supabase secrets set OCR_EXTRACT=https://your-n8n-webhook-url`

### "Authentication error" in callback
- **Cause**: `NOTEBOOK_GENERATION_AUTH` mismatch
- **Fix**: Ensure env variable matches Supabase secret exactly

### "AI matching service not configured"
- **Cause**: `OPENAI_API_KEY` not set
- **Fix**: `supabase secrets set OPENAI_API_KEY=sk-proj-...`

### No matching transactions found
- **Expected**: If user has no unreconciled transactions in last 90 days
- **Check**: Query `SELECT * FROM transactions WHERE user_id='...' AND status='unreconciled'`

### HTTP 500 errors
- **Check Function Logs**: `supabase functions logs process-receipt`
- **Check Database Logs**: Look for RLS policy errors
- **Verify Secrets**: `supabase secrets list`

## Mock Data Setup

To create test data for comprehensive testing:

```sql
-- Insert mock receipt (status: pending)
INSERT INTO receipts (user_id, file_path, processing_status, uploaded_at)
VALUES ('your-user-id', 'test/receipt.pdf', 'pending', NOW())
RETURNING id;

-- Insert mock transactions (unreconciled)
INSERT INTO transactions (user_id, bank_account_id, transaction_date, description, amount, status)
VALUES
  ('your-user-id', 'your-bank-account-id', '2025-10-25', 'WOOLWORTHS METRO', -1499, 'unreconciled'),
  ('your-user-id', 'your-bank-account-id', '2025-10-24', 'COLES SUPERMARKET', -2350, 'unreconciled'),
  ('your-user-id', 'your-bank-account-id', '2025-10-23', 'ALDI STORES', -4290, 'unreconciled');
```

## Logs and Debugging

View Edge Function logs:
```bash
# All functions
supabase functions logs

# Specific function
supabase functions logs process-receipt
supabase functions logs process-receipt-callback
supabase functions logs match-receipt-transactions

# Follow logs in real-time
supabase functions logs --follow
```

## Cost Monitoring

OpenAI API usage for AI matching:
- Model: gpt-4o-mini
- Cost: ~$0.0001 per receipt
- Average tokens: 500 per request

Monitor usage:
- OpenAI Dashboard: https://platform.openai.com/usage
- Supabase Edge Functions: Project Dashboard → Edge Functions → Invocations

## Next Steps

After tests pass:
1. ✅ Deploy to production environment
2. ✅ Create n8n OCR workflow (see `docs/RECEIPT-OCR-DEPLOYMENT-GUIDE.md`)
3. ✅ Implement frontend components (`src/pages/ProcessingStatus.tsx`, etc.)
4. ✅ Set up monitoring and alerts
5. ✅ Create end-user documentation
