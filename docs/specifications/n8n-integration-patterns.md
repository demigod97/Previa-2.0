# n8n Integration Patterns Specification

**Version:** 1.0  
**Date:** 2025-01-13  
**Purpose:** Define Edge Function ↔ n8n workflow integration patterns for Previa OCR processing

---

## 1. Overview

This specification defines:

- Communication patterns between Supabase Edge Functions and n8n workflows
- Status tracking and polling mechanisms
- Error handling and retry logic
- Webhook vs polling trade-offs

---

## 2. Existing n8n Workflows

Based on `/n8n` folder analysis:

### 2.1 Available Workflows

**Extract Text Workflow:** `InsightsLM___Extract_Text.json`

- Purpose: OCR extraction from documents
- Input: Document URL/path
- Output: Extracted text and metadata

**Process Additional Sources:** `InsightsLM___Process_Additional_Sources.json`

- Purpose: Handle supplementary document processing
- Input: Source IDs and document paths
- Output: Processed content

**Upsert to Vector Store:** `InsightsLM___Upsert_to_Vector_Store.json`

- Purpose: Store processed documents in vector DB
- Input: Processed document data
- Output: Vector store confirmation

### 2.2 Workflow Adaptation Strategy

**Reuse Pattern:**

1. Keep existing n8n workflow structure
2. Adapt input/output schemas for financial documents
3. Add Previa-specific nodes (bank statement parsing, receipt extraction)
4. Maintain webhook endpoints

---

## 3. Architecture Pattern

### 3.1 Communication Flow

```
┌──────────────┐         ┌───────────────┐         ┌──────────────┐
│   Frontend   │────────>│  Edge Function │────────>│ n8n Workflow │
│              │         │  (Supabase)    │         │              │
└──────────────┘         └───────────────┘         └──────────────┘
      │                         │                         │
      │                         │                         │
      │<────────────────────────┴─────────────────────────┘
      │            Webhook callback with results
```

### 3.2 Workflow Types

**Option A: Webhook + Callback (Recommended for MVP)**

- Edge function triggers n8n via webhook
- n8n processes asynchronously
- n8n calls back to Supabase Edge Function with results
- Frontend polls database for status updates

**Option B: Polling**

- Edge function triggers n8n via webhook
- Frontend polls edge function for status
- Edge function checks n8n job status
- Higher latency, more API calls

**MVP Choice:** Option A (Webhook + Callback)

---

## 4. Edge Function: process-document

### 4.1 Purpose

Orchestrate document processing by triggering n8n workflow and managing status.

### 4.2 Request Schema

```typescript
interface ProcessDocumentRequest {
  document_id: string; // UUID of bank_statement or receipt
  user_id: string;
  document_type: 'bank_statement' | 'receipt';
  file_path: string; // Supabase Storage path
  storage_bucket: string; // 'bank-statements' or 'receipts'
}
```

### 4.3 Implementation

**File:** `supabase/functions/process-document/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const {
      document_id,
      user_id,
      document_type,
      file_path,
      storage_bucket,
    } = await req.json();

    // 1. Generate signed URL for n8n to access file
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from(storage_bucket)
      .createSignedUrl(file_path, 3600); // 1 hour expiry

    if (urlError) throw urlError;

    // 2. Update status to 'processing'
    const table =
      document_type === 'bank_statement' ? 'bank_statements' : 'receipts';
    await supabase
      .from(table)
      .update({ processing_status: 'processing' })
      .eq('id', document_id);

    // 3. Trigger n8n workflow
    const n8nWebhookUrl = Deno.env.get('N8N_EXTRACT_TEXT_WEBHOOK_URL')!;
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': Deno.env.get('N8N_API_KEY')!,
      },
      body: JSON.stringify({
        document_id,
        user_id,
        document_type,
        file_url: signedUrlData.signedUrl,
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/ocr-callback`,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.statusText}`);
    }

    const n8nJob = await n8nResponse.json();

    return new Response(
      JSON.stringify({
        status: 'processing',
        document_id,
        job_id: n8nJob.job_id,
        estimated_time_ms: 5000,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 202, // Accepted
      }
    );
  } catch (error) {
    console.error('Error in process-document:', error);

    return new Response(
      JSON.stringify({
        error: error.message,
        status: 'failed',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
```

### 4.4 Environment Variables

```env
N8N_EXTRACT_TEXT_WEBHOOK_URL=https://n8n.previa.com/webhook/extract-text
N8N_API_KEY=secret_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 5. Edge Function: ocr-callback

### 5.1 Purpose

Receive results from n8n workflow and update database.

### 5.2 Request Schema (from n8n)

```typescript
interface OCRCallbackRequest {
  job_id: string;
  document_id: string;
  status: 'completed' | 'failed';
  extraction?: BankStatementExtraction | ReceiptExtraction; // From OCR schema
  error?: string;
  processed_at: string; // ISO 8601 timestamp
}
```

### 5.3 Implementation

**File:** `supabase/functions/ocr-callback/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { document_id, status, extraction, error, processed_at } =
      await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    if (status === 'completed' && extraction) {
      // Determine document type
      const documentType = extraction.document_type;

      if (documentType === 'bank_statement') {
        // Update bank_statement
        await supabase
          .from('bank_statements')
          .update({
            processing_status: 'completed',
            extracted_at: processed_at,
          })
          .eq('id', document_id);

        // Insert transactions
        const transactionInserts = extraction.transactions.map((t) => ({
          bank_statement_id: document_id,
          user_id: extraction.user_id, // Need to pass this
          transaction_date: t.date,
          amount: t.amount,
          description: t.description,
          status: 'unreconciled',
        }));

        await supabase.from('transactions').insert(transactionInserts);

        // Update or create bank_account if needed
        await upsertBankAccount(supabase, extraction);
      } else if (
        documentType === 'receipt' ||
        documentType === 'invoice' ||
        documentType === 'bill'
      ) {
        // Update receipt
        await supabase
          .from('receipts')
          .update({
            processing_status: 'completed',
            merchant: extraction.merchant.name,
            receipt_date: extraction.transaction.date,
            amount: extraction.transaction.total,
            tax: extraction.transaction.tax,
            confidence_score: extraction.confidence_score,
            ocr_data: extraction,
          })
          .eq('id', document_id);
      }
    } else {
      // Handle failure
      const table = extraction?.document_type === 'bank_statement'
        ? 'bank_statements'
        : 'receipts';

      await supabase
        .from(table)
        .update({
          processing_status: 'failed',
          error_message: error || 'Unknown error',
        })
        .eq('id', document_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in ocr-callback:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function upsertBankAccount(supabase, extraction) {
  // Check if account exists
  const { data: existingAccount } = await supabase
    .from('bank_accounts')
    .select('id')
    .eq('user_id', extraction.user_id)
    .eq('account_number_masked', extraction.account.number_masked)
    .single();

  if (!existingAccount) {
    // Create new bank account
    await supabase.from('bank_accounts').insert({
      user_id: extraction.user_id,
      institution: extraction.institution.name,
      account_name: extraction.account.name,
      account_number_masked: extraction.account.number_masked,
      balance: extraction.balance.closing,
      currency: extraction.balance.currency,
    });
  } else {
    // Update existing account balance
    await supabase
      .from('bank_accounts')
      .update({ balance: extraction.balance.closing })
      .eq('id', existingAccount.id);
  }
}
```

---

## 6. n8n Workflow Modifications

### 6.1 Extract Text Workflow Updates

**Add Nodes:**

1. **Webhook Trigger** (existing - keep)
2. **HTTP Request: Download File** (from signed URL)
3. **Switch: Document Type**
   - Branch A: Bank Statement → Bank statement parser
   - Branch B: Receipt → Receipt parser
4. **Bank Statement Parser Node** (new)
   - Parse PDF/CSV
   - Extract account details, transactions
   - Calculate confidence scores
5. **Receipt Parser Node** (new)
   - OCR image/PDF
   - Extract merchant, date, amount, line items
   - Calculate confidence scores
6. **HTTP Request: Callback to Supabase** (modified)
   - POST to `ocr-callback` edge function
   - Send extraction results

### 6.2 Workflow Configuration

**Input Schema (from process-document edge function):**

```json
{
  "document_id": "uuid",
  "user_id": "uuid",
  "document_type": "bank_statement|receipt",
  "file_url": "https://signed-url",
  "callback_url": "https://supabase-url/functions/v1/ocr-callback"
}
```

**Output Schema (to ocr-callback edge function):**

```json
{
  "job_id": "n8n-execution-id",
  "document_id": "uuid",
  "status": "completed|failed",
  "extraction": { /* BankStatementExtraction or ReceiptExtraction */ },
  "error": "error message if failed",
  "processed_at": "2024-08-15T10:30:00Z"
}
```

---

## 7. Status Tracking

### 7.1 Frontend Polling Strategy

**Implementation:**

```typescript
import { useQuery } from '@tanstack/react-query';

function useDocumentProcessingStatus(documentId: string, documentType: string) {
  return useQuery({
    queryKey: ['document-status', documentId],
    queryFn: async () => {
      const table = documentType === 'bank_statement'
        ? 'bank_statements'
        : 'receipts';

      const { data, error } = await supabase
        .from(table)
        .select('processing_status, error_message')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data;
    },
    refetchInterval: (data) => {
      // Stop polling if status is completed or failed
      if (
        data?.processing_status === 'completed' ||
        data?.processing_status === 'failed'
      ) {
        return false;
      }
      // Poll every 2 seconds while processing
      return 2000;
    },
    enabled: !!documentId,
  });
}

// Usage in component
function UploadProgress({ documentId, documentType }) {
  const { data: status, isLoading } = useDocumentProcessingStatus(
    documentId,
    documentType
  );

  if (isLoading) return <Skeleton className="h-4 w-full" />;

  return (
    <div>
      {status?.processing_status === 'processing' && (
        <Progress value={undefined} /> // Indeterminate
      )}
      {status?.processing_status === 'completed' && (
        <CheckCircle className="text-green-600" />
      )}
      {status?.processing_status === 'failed' && (
        <XCircle className="text-red-600" />
      )}
    </div>
  );
}
```

### 7.2 Real-Time Updates (Optional Enhancement)

**Using Supabase Realtime:**

```typescript
useEffect(() => {
  const channel = supabase
    .channel('document-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'bank_statements',
        filter: `id=eq.${documentId}`,
      },
      (payload) => {
        // Update UI immediately when status changes
        queryClient.invalidateQueries(['document-status', documentId]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [documentId]);
```

---

## 8. Error Handling

### 8.1 Error Types

**Upload Errors:**

- File too large (> 50MB)
- Unsupported file type
- Storage upload failed

**Processing Errors:**

- n8n webhook unreachable
- OCR extraction failed (low quality, unsupported format)
- Parsing errors (invalid data format)

**Timeout Errors:**

- Processing takes > 60 seconds

### 8.2 Retry Logic

**Edge Function Retries:**

```typescript
async function triggerN8nWithRetry(payload, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': Deno.env.get('N8N_API_KEY')!,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return await response.json();
      }

      // Retry on 5xx errors only
      if (response.status < 500) {
        throw new Error(`n8n webhook failed: ${response.statusText}`);
      }

      lastError = new Error(`Attempt ${attempt}: ${response.statusText}`);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
    }

    // Exponential backoff: 1s, 2s, 4s
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)));
    }
  }

  throw lastError;
}
```

### 8.3 User-Facing Error Messages

```typescript
const errorMessages = {
  upload_failed: 'Failed to upload document. Please try again.',
  file_too_large: 'File is too large. Maximum size is 50MB.',
  unsupported_format: 'Unsupported file format. Please upload PDF or CSV.',
  processing_timeout: 'Processing is taking longer than expected. Please check back later.',
  extraction_failed: 'Could not extract data from document. Please verify file quality.',
  network_error: 'Network error. Please check your connection and try again.',
};
```

---

## 9. Security Considerations

### 9.1 API Authentication

**n8n Webhook Security:**

- Use API key header: `X-API-Key`
- Validate signature (optional, for webhook callbacks)
- IP whitelist (if possible)

**Edge Function Security:**

- Verify user authentication (JWT token)
- Validate user owns document (RLS)
- Rate limiting (via Supabase)

### 9.2 Signed URLs

**Supabase Storage:**

- Generate signed URLs with short expiry (1 hour)
- One-time use URLs (optional)
- Validate file ownership before generating URL

---

## 10. Performance Optimization

### 10.1 Concurrent Processing

**Process multiple documents in parallel:**

```typescript
// In upload hub, process files concurrently
const uploadPromises = files.map(async (file) => {
  const filePath = await uploadToStorage(file);
  const documentId = await createDocumentRecord(filePath);
  await triggerProcessing(documentId);
});

await Promise.allSettled(uploadPromises);
```

### 10.2 n8n Scaling

**Considerations:**

- Queue-based processing for high volume
- Multiple n8n instances behind load balancer
- Separate workflows for bank statements vs receipts

---

## 11. Monitoring & Observability

### 11.1 Logging

**Edge Functions:**

```typescript
console.log('Processing document:', {
  document_id,
  user_id,
  document_type,
  timestamp: new Date().toISOString(),
});
```

**n8n:**

- Enable execution logging
- Track processing times
- Alert on failed executions

### 11.2 Metrics to Track

- Document upload rate
- Processing time (p50, p95, p99)
- Success/failure rate
- Confidence score distribution
- Error types frequency

---

## 12. Testing Strategy

### 12.1 Unit Tests

**Edge Functions:**

- Test request validation
- Test n8n webhook triggering
- Test callback data processing
- Test error handling paths

### 12.2 Integration Tests

**End-to-End Scenarios:**

- Upload file → trigger processing → receive callback → verify DB updates
- Test with various file formats (PDF, CSV, images)
- Test error scenarios (invalid file, n8n failure)
- Test timeout handling

### 12.3 Load Testing

**Simulate:**

- 100 concurrent uploads
- Processing time under load
- n8n throughput limits

---

## 13. Migration from PolicyAi Pattern

### 13.1 Key Differences

**PolicyAi (Old):**

- Documents stored in `sources` table
- n8n workflow for policy document processing
- Vector store for semantic search

**Previa (New):**

- Documents in domain-specific tables (`bank_statements`, `receipts`)
- n8n workflow for OCR/extraction (not vector store)
- Structured data extraction, not semantic search

### 13.2 Reusable Components

**Keep:**

- Supabase Storage upload pattern
- Edge function → n8n webhook pattern
- Status tracking approach

**Change:**

- Workflow logic (OCR extraction vs document processing)
- Data schema (financial domain vs policy domain)
- Callback handling (structured extraction vs vector embeddings)

---

**End of Specification**
