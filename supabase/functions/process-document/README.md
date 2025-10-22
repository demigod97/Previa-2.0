# process-document Edge Function

## Overview

This Edge Function handles document processing for bank statements and receipts. It generates signed URLs, triggers n8n workflows, and manages processing status with automatic retry logic.

## Features

- **JWT Authentication**: Validates user authentication via Supabase Auth
- **Payload Validation**: Comprehensive field validation with specific error messages
- **Signed URL Generation**: Creates 1-hour expiry signed URLs for secure file access
- **Retry Logic**: 3 attempts with exponential backoff (1s, 2s, 4s)
- **Status Tracking**: Updates database with processing status and timestamps

## Environment Variables

### Required (Production)

Set these in Supabase Dashboard → Project Settings → Edge Functions → Secrets:

```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/document-processing
N8N_API_KEY=your_n8n_api_key
```

### Auto-Configured

These are automatically provided by Supabase:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Legacy Support (Optional)

For backward compatibility with existing deployments:

- `DOCUMENT_PROCESSING_WEBHOOK_URL` (fallback for N8N_WEBHOOK_URL)
- `NOTEBOOK_GENERATION_AUTH` (fallback for N8N_API_KEY)

## Local Development

### 1. Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your values
# Set N8N_WEBHOOK_URL and N8N_API_KEY
```

### 2. Run Locally

```bash
# Start Supabase local development
supabase start

# Serve the Edge Function
supabase functions serve process-document --env-file supabase/functions/process-document/.env.local

# The function will be available at:
# http://localhost:54321/functions/v1/process-document
```

### 3. Test Locally

```bash
# Example test request
curl -X POST http://localhost:54321/functions/v1/process-document \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "user-uuid-here",
    "document_type": "bank_statement",
    "file_path": "user_id/timestamp_filename.pdf",
    "storage_bucket": "bank-statements"
  }'
```

## Deployment

### 1. Set Production Secrets

```bash
# Set n8n webhook URL
supabase secrets set N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/document-processing

# Set n8n API key
supabase secrets set N8N_API_KEY=your_production_api_key
```

### 2. Deploy Function

```bash
# Deploy to Supabase
supabase functions deploy process-document

# Verify deployment
supabase functions list
```

## API Reference

### Request

**Endpoint:** `POST /functions/v1/process-document`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>` (required if user_id provided)
- `Content-Type: application/json`

**Body:**
```typescript
{
  document_id: string;        // UUID from bank_statements or receipts table
  user_id: string;            // UUID from auth.users
  document_type: 'bank_statement' | 'receipt';
  file_path: string;          // Storage path (e.g., "user_id/timestamp_filename.pdf")
  storage_bucket: 'bank-statements' | 'receipts';
}
```

### Response

**Success (202 Accepted):**
```json
{
  "success": true,
  "job_id": "document-uuid",
  "message": "Processing started",
  "result": { /* n8n response */ }
}
```

**Error (400/401/500):**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Additional error information"
}
```

### Error Codes

- `400` - Validation error (missing/invalid fields)
- `401` - Authentication failed (invalid JWT)
- `403` - User ID mismatch (JWT user ≠ payload user)
- `500` - Server error (config missing, file not found, n8n failure)

## Testing

### Unit Tests

Create test file at `supabase/functions/process-document/index.test.ts`:

```typescript
// Test retry logic
// Test signed URL generation
// Test validation errors
// Test JWT authentication
```

### Integration Tests

1. **Upload Test File**
   - Upload a test PDF to Supabase Storage
   - Note the file path

2. **Call Edge Function**
   - Use curl or Postman
   - Verify 202 response
   - Check database status updated to 'processing'

3. **Verify n8n Webhook**
   - Check n8n workflow received webhook
   - Verify signed URL is accessible
   - Confirm signed URL expires after 1 hour

### Manual Test Checklist

- [ ] JWT validation works (401 on invalid token)
- [ ] Payload validation catches missing fields (400 errors)
- [ ] Signed URL generation succeeds for valid files
- [ ] Retry logic activates on n8n failures
- [ ] Database status updates correctly (processing/failed)
- [ ] n8n receives correct payload
- [ ] Error responses include helpful messages

## Architecture

```
Client
  ↓ POST /process-document
Edge Function
  ↓ Verify JWT
  ↓ Validate payload
  ↓ Generate signed URL (1h expiry)
  ↓ Call n8n webhook (3 retries, exp. backoff)
  ↓ Update DB status
n8n Workflow
  ↓ Download file from signed URL
  ↓ Process (OCR, extraction)
  ↓ POST to /process-document-callback
  ↓ Update DB with results
```

## Troubleshooting

### "Missing N8N_WEBHOOK_URL environment variable"
- Set the secret in Supabase Dashboard or .env.local

### "Failed to generate signed URL"
- Verify file exists in storage bucket
- Check file_path format
- Ensure storage_bucket matches actual bucket name

### "Failed to trigger n8n workflow after 3 attempts"
- Check n8n webhook URL is accessible
- Verify N8N_API_KEY is correct
- Review n8n logs for errors
- Check network connectivity

### "JWT verification failed"
- Ensure Authorization header format: `Bearer <token>`
- Verify token is not expired
- Check user_id matches JWT claims

## Security

- **JWT Required**: All requests must include valid JWT (when user_id provided)
- **Signed URLs**: Temporary (1h), read-only access to files
- **Service Role Key**: Never exposed to client, only in Edge Function
- **API Key**: n8n API key stored in Supabase secrets
- **RLS Bypass**: Service role key used for admin operations only

## Development Notes

### Story 3.2 Implementation

This Edge Function implements Story 3.2: Edge Function for Document Processing

**Key Features:**
- TypeScript interfaces for request/response types
- Backward compatibility with legacy field names
- Comprehensive logging for debugging
- Field-specific validation errors
- Exponential backoff retry logic (1s, 2s, 4s)
- Database status tracking with timestamps

### Legacy Support

The function maintains backward compatibility:
- Supports both `document_id` and `sourceId`
- Supports both `file_path` and `filePath`
- Supports both `document_type` and `sourceType`
- Fallback environment variables for old deployments
