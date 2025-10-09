# n8n Workflow Requirements for Previa

**Last Updated:** 2025-01-09  
**Purpose:** Define required n8n workflows for AI-powered financial processing

---

## Overview

Previa uses n8n workflows to handle compute-intensive AI operations:
1. **Document Processing:** OCR extraction from bank statements and receipts
2. **Reconciliation Matching:** AI-powered transaction-to-receipt matching
3. **Financial Chat:** AI assistant with context-aware responses

All workflows are triggered by Supabase Edge Functions via webhooks, ensuring:
- Server-side secrets never exposed to client
- Validated authentication via `WEBHOOK_SECRET_TOKEN`
- Async processing with callbacks for long-running operations

---

## Required Workflows

### 1. Document Processing Workflow

**Webhook URL:** `DOCUMENT_PROCESSING_WEBHOOK_URL`  
**Purpose:** Extract data from uploaded bank statements and receipts using OCR  
**Trigger:** Edge Function `process-document`

#### Input (POST from Edge Function)

```json
{
  "source_id": "uuid",
  "file_path": "sources/user-uuid/statement.pdf",
  "source_type": "bank_statement" | "receipt",
  "callback_url": "https://project.supabase.co/functions/v1/process-document-callback",
  "auth_token": "secret-token-for-callback"
}
```

#### Processing Steps

1. **Authenticate Request**
   - Verify `WEBHOOK_SECRET_TOKEN` in request header
   - Reject unauthorized requests

2. **Download File**
   - Fetch file from Supabase Storage using service role key
   - Handle PDF, CSV, PNG, JPG formats

3. **OCR Extraction (Gemini Vision API)**
   
   **For bank_statement:**
   - Institution name
   - Account name
   - Account number (last 4 digits only)
   - Statement period (start/end dates)
   - Transactions array (date, description, amount)
   - Currency (default AUD)
   
   **For receipt:**
   - Merchant name
   - Receipt date
   - Total amount
   - Tax/GST amount
   - Line items (optional for MVP)

4. **Calculate Confidence Score**
   - Overall confidence: 0.00 to 1.00
   - **Target: ≥ 0.90 (90%) for production**
   - Per-field confidence for critical data (account number, amounts)

5. **Error Handling**
   - Catch OCR failures
   - Return error status with descriptive message
   - Log errors for debugging

#### Output (POST to callback_url)

```json
{
  "source_id": "uuid",
  "content": "extracted text content",
  "summary": "AI-generated summary: Commonwealth Bank statement for Jan 2024 with 47 transactions",
  "title": "Commonwealth Bank - Everyday Account",
  "display_name": "CommBank Statement Jan 2024",
  "status": "completed" | "failed",
  "confidence": 0.92,
  "extracted_data": {
    "institution": "Commonwealth Bank",
    "account_name": "Everyday Account",
    "account_number_last4": "1234",
    "period_start": "2024-01-01",
    "period_end": "2024-01-31",
    "currency": "AUD",
    "transactions": [
      {
        "date": "2024-01-15",
        "description": "Woolworths Sydney",
        "amount": -45.50
      }
    ]
  },
  "error": "Error message if status=failed"
}
```

**Success Criteria:**
- OCR accuracy ≥ 90% for account numbers and amounts
- Processing time < 30 seconds for typical bank statement
- Graceful degradation for low-quality scans

---

### 2. Reconciliation Matching Workflow

**Webhook URL:** `RECONCILIATION_WEBHOOK_URL`  
**Purpose:** Match transactions to receipts using AI algorithms  
**Trigger:** Edge Function `reconcile-transactions` (or user action in UI)

#### Input

```json
{
  "user_id": "uuid",
  "transaction_ids": ["uuid1", "uuid2", "uuid3"],
  "receipt_ids": ["uuid4", "uuid5"],
  "context": {
    "date_range": ["2024-01-01", "2024-01-31"],
    "account_id": "uuid"
  }
}
```

#### Processing Steps

1. **Fetch Data**
   - Query Supabase for transaction and receipt details
   - Use service role key for database access

2. **AI Matching Algorithm**
   
   **Matching Criteria (weighted):**
   - Date proximity (±3 days): 40%
   - Amount similarity (exact or ±$0.50): 40%
   - Merchant name match (fuzzy): 20%
   
   **LLM Prompt:**
   ```
   Match these transactions to receipts based on date, amount, and merchant.
   
   Transactions:
   - 2024-01-15: Woolworths, -$45.50
   - 2024-01-16: Shell, -$68.00
   
   Receipts:
   - 2024-01-15: Woolworths Sydney, $45.50
   - 2024-01-16: Shell Coles Express, $68.00
   
   Return JSON with matches and confidence scores.
   ```

3. **Generate Confidence Scores**
   - Calculate per-match confidence: 0.00 to 1.00
   - **Target: ≥ 0.95 for auto-approval**
   - Explain matching reasoning for transparency

4. **Return Suggested Matches**
   - Sort by confidence (highest first)
   - Include explanation for each match

#### Output

```json
{
  "matches": [
    {
      "transaction_id": "uuid1",
      "receipt_id": "uuid4",
      "confidence": 0.97,
      "explanation": "Matched by exact date (2024-01-15) and amount ($45.50). Merchant 'Woolworths' matches 'Woolworths Sydney'.",
      "match_factors": {
        "date_match": true,
        "amount_match": true,
        "merchant_similarity": 0.95
      }
    },
    {
      "transaction_id": "uuid2",
      "receipt_id": "uuid5",
      "confidence": 0.89,
      "explanation": "Matched by date (±1 day) and exact amount. Merchant name partially matches.",
      "match_factors": {
        "date_match": false,
        "amount_match": true,
        "merchant_similarity": 0.75
      }
    }
  ],
  "unmatched_transactions": ["uuid3"],
  "unmatched_receipts": []
}
```

**Success Criteria:**
- 70% automation rate (matches with confidence ≥ 0.95)
- No false positives (incorrect matches with high confidence)
- Processing time < 5 seconds for 50 transactions + 20 receipts

---

### 3. Chat Workflow (Financial Assistant)

**Webhook URL:** `CHAT_WEBHOOK_URL`  
**Purpose:** AI-powered financial Q&A with context and citations  
**Trigger:** Edge Function `send-chat-message`

#### Input

```json
{
  "session_id": "uuid",
  "message": "What did I spend on groceries this month?",
  "user_id": "uuid",
  "context": {
    "recent_transactions": [
      {"date": "2024-01-15", "merchant": "Woolworths", "amount": -45.50, "category": "Groceries"}
    ],
    "account_balances": [
      {"account_name": "Everyday Account", "balance": 5430.50}
    ],
    "date_range": ["2024-01-01", "2024-01-31"]
  }
}
```

#### Processing Steps

1. **Fetch User Financial Data**
   - Query transactions, receipts, accounts
   - Build context window for LLM

2. **Generate AI Response (Gemini/GPT-4o)**
   
   **System Prompt:**
   ```
   You are a financial assistant for Previa. Answer user questions about their financial data.
   
   - Be concise and helpful
   - Cite specific transactions when relevant
   - Suggest actionable insights
   - Format amounts as AUD currency
   - Use friendly, non-technical language
   ```

3. **Extract Citations**
   - Identify which transactions/receipts informed the answer
   - Return source references for transparency

4. **Format Response**
   - Markdown formatting supported
   - Tables for transaction lists
   - Charts/visualizations (optional)

#### Output

```json
{
  "response": "You spent **$127.80** on groceries this month across 3 transactions:\n\n- Jan 15: Woolworths, $45.50\n- Jan 18: Coles, $58.30\n- Jan 22: Aldi, $24.00\n\nThis is 12% less than last month!",
  "citations": [
    {
      "source_id": "transaction-uuid-1",
      "source_type": "transaction",
      "reference": "Woolworths transaction on 2024-01-15"
    },
    {
      "source_id": "transaction-uuid-2",
      "source_type": "transaction",
      "reference": "Coles transaction on 2024-01-18"
    }
  ],
  "suggested_actions": [
    "Set a grocery budget of $150/month",
    "Review Woolworths rewards card"
  ]
}
```

**Success Criteria:**
- Response time < 3 seconds
- Accurate financial calculations
- Relevant citations for all data-based answers
- Helpful insights and suggestions

---

## Setup Instructions

### Prerequisites

1. **n8n Instance**
   - Self-hosted or n8n Cloud
   - Accessible via HTTPS
   - Webhook endpoints enabled

2. **API Keys**
   - Google Gemini API key
   - OpenAI API key (optional)
   - Supabase service role key

### Workflow Creation

1. **Import Templates**
   - Create workflows based on specs above
   - Configure webhook triggers
   - Set authentication header: `X-Webhook-Secret`

2. **Configure Credentials**
   - Add Gemini API key to n8n credentials
   - Add Supabase connection (service role)
   - Add OpenAI key for fallback (optional)

3. **Test Workflows**
   - Use sample data for each workflow
   - Verify callback responses
   - Check error handling

4. **Get Webhook URLs**
   - Copy webhook URLs from each workflow
   - Format: `https://your-n8n.com/webhook/process-document`

5. **Update Supabase Secrets**
   ```bash
   supabase secrets set DOCUMENT_PROCESSING_WEBHOOK_URL=https://...
   supabase secrets set RECONCILIATION_WEBHOOK_URL=https://...
   supabase secrets set CHAT_WEBHOOK_URL=https://...
   supabase secrets set WEBHOOK_SECRET_TOKEN=your-secret-here
   ```

---

## Security Considerations

1. **Webhook Authentication**
   - Verify `X-Webhook-Secret` header in every request
   - Reject unauthorized requests immediately

2. **Rate Limiting**
   - Limit requests per user (e.g., 100/hour for OCR)
   - Prevent abuse of expensive LLM calls

3. **Data Privacy**
   - Never log sensitive financial data
   - Encrypt data in transit (HTTPS only)
   - Comply with Australian data security standards

4. **Error Handling**
   - Don't expose internal error details to client
   - Return generic error messages
   - Log detailed errors server-side only

---

## Monitoring & Logging

**Key Metrics to Track:**

1. **Processing Times**
   - OCR extraction time (target < 30s)
   - Reconciliation time (target < 5s)
   - Chat response time (target < 3s)

2. **Success Rates**
   - OCR confidence scores (target ≥ 90%)
   - Reconciliation automation rate (target ≥ 70%)
   - Chat response quality (user feedback)

3. **Error Rates**
   - OCR failures per document type
   - Webhook timeouts or failures
   - LLM API errors or rate limits

**Alerting:**
- Alert if success rate < 80%
- Alert if average processing time > 60s
- Alert on LLM API quota exhaustion

---

## Troubleshooting

### OCR Extraction Failing

**Common Issues:**
- Low-quality scans (blurry, rotated)
- Unsupported formats (encrypted PDFs)
- API rate limits exceeded

**Solutions:**
- Implement image pre-processing (rotation, contrast)
- Fallback to manual entry for low-confidence extractions
- Queue and retry failed extractions

### Reconciliation Not Matching

**Common Issues:**
- Date format inconsistencies
- Amount precision mismatches ($45.5 vs $45.50)
- Merchant name variations

**Solutions:**
- Normalize dates to ISO 8601
- Standardize amount precision (2 decimals)
- Use fuzzy string matching for merchants

### Chat Not Responding

**Common Issues:**
- Context window too large (LLM token limits)
- Database query timeouts
- LLM API downtime

**Solutions:**
- Limit context to last 90 days of transactions
- Optimize database queries with indexes
- Implement fallback to simpler responses

---

## Next Steps

1. Create workflow templates in n8n
2. Test each workflow with sample data
3. Deploy to production n8n instance
4. Update Supabase Edge Function secrets
5. Monitor metrics and iterate on accuracy

**Note:** These workflows are designed for MVP. Future enhancements may include:
- Real-time streaming responses for chat
- Batch processing for bulk reconciliation
- Advanced analytics and insights generation

