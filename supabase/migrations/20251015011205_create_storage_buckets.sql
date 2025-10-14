-- Create storage buckets for bank statements and receipts
-- Story 2.2: Bank Statement Upload & OCR Trigger

-- Create bank-statements bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bank-statements',
  'bank-statements',
  false, -- not public (requires authentication)
  52428800, -- 50MB in bytes
  ARRAY['application/pdf', 'text/csv']
);

-- Create receipts bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts',
  'receipts',
  false, -- not public
  52428800, -- 50MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
);

-- RLS policies for bank-statements bucket
-- Users can only upload to their own folder
CREATE POLICY "Users can upload to their own folder in bank-statements"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bank-statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can only read their own files
CREATE POLICY "Users can read their own files in bank-statements"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'bank-statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own files
CREATE POLICY "Users can delete their own files in bank-statements"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'bank-statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policies for receipts bucket
CREATE POLICY "Users can upload to their own folder in receipts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own files in receipts"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files in receipts"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Grant service role access to generate signed URLs (for n8n integration)
CREATE POLICY "Service role can read all files for signed URLs"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id IN ('bank-statements', 'receipts'));
