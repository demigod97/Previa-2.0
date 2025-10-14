import { supabase } from '@/integrations/supabase/client';

/**
 * Trigger bank statement processing via Edge Function
 *
 * @param documentId - Bank statement ID (UUID)
 * @param userId - User ID
 * @param filePath - Path to file in Supabase Storage
 * @param storageBucket - Storage bucket name (default: 'bank-statements')
 * @returns Promise<void>
 */
export async function triggerBankStatementProcessing(
  documentId: string,
  userId: string,
  filePath: string,
  storageBucket: string = 'bank-statements'
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('process-document', {
    body: {
      document_id: documentId,
      user_id: userId,
      document_type: 'bank_statement',
      file_path: filePath,
      storage_bucket: storageBucket,
    },
  });

  if (error) {
    throw new Error(`Failed to start processing: ${error.message}`);
  }

  // Edge function returns 202 Accepted
  console.log('Processing started:', data);
}

/**
 * Trigger receipt processing via Edge Function
 *
 * @param documentId - Receipt ID (UUID)
 * @param userId - User ID
 * @param filePath - Path to file in Supabase Storage
 * @param storageBucket - Storage bucket name (default: 'receipts')
 * @returns Promise<void>
 */
export async function triggerReceiptProcessing(
  documentId: string,
  userId: string,
  filePath: string,
  storageBucket: string = 'receipts'
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('process-document', {
    body: {
      document_id: documentId,
      user_id: userId,
      document_type: 'receipt',
      file_path: filePath,
      storage_bucket: storageBucket,
    },
  });

  if (error) {
    throw new Error(`Failed to start processing: ${error.message}`);
  }

  console.log('Processing started:', data);
}

/**
 * Trigger additional document source processing
 *
 * @param documentId - Document ID (UUID)
 * @param userId - User ID
 * @param filePath - Path to file in Supabase Storage
 * @param documentType - Type of document ('bank_statement' | 'receipt' | 'invoice')
 * @param storageBucket - Storage bucket name
 * @returns Promise<void>
 */
export async function triggerDocumentProcessing(
  documentId: string,
  userId: string,
  filePath: string,
  documentType: 'bank_statement' | 'receipt' | 'invoice',
  storageBucket: string
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('process-document', {
    body: {
      document_id: documentId,
      user_id: userId,
      document_type: documentType,
      file_path: filePath,
      storage_bucket: storageBucket,
    },
  });

  if (error) {
    throw new Error(`Failed to start processing: ${error.message}`);
  }

  console.log('Processing started:', data);
}
