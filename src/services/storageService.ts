import { supabase } from '@/integrations/supabase/client';

/**
 * Upload bank statement to Supabase Storage
 *
 * @param file - File to upload (PDF or CSV)
 * @param userId - User ID for file path organization
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise<string> - File path in storage bucket
 */
export async function uploadBankStatement(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  const filePath = `${userId}/${filename}`;

  const { data, error } = await supabase.storage
    .from('bank-statements')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Simulate progress since Supabase Storage doesn't provide real-time progress
  // For small files this happens instantly
  if (onProgress) {
    onProgress(100);
  }

  return data.path;
}

/**
 * Upload receipt to Supabase Storage
 *
 * @param file - File to upload (image or PDF)
 * @param userId - User ID for file path organization
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise<string> - File path in storage bucket
 */
export async function uploadReceipt(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  const filePath = `${userId}/${filename}`;

  const { data, error } = await supabase.storage
    .from('receipts')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  if (onProgress) {
    onProgress(100);
  }

  return data.path;
}

/**
 * Get signed URL for a file in storage
 *
 * @param bucket - Storage bucket name
 * @param filePath - Path to file in bucket
 * @param expiresIn - URL expiry in seconds (default 3600 = 1 hour)
 * @returns Promise<string> - Signed URL
 */
export async function getSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete a file from storage
 *
 * @param bucket - Storage bucket name
 * @param filePath - Path to file in bucket
 * @returns Promise<void>
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
