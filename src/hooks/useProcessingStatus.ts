import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ProcessingStatusData {
  id: string;
  processing_status: ProcessingStatus;
  extraction_confidence?: number | null;
  extracted_at?: string | null;
}

/**
 * Poll database for document processing status
 * 
 * @param documentId - Bank statement or receipt ID
 * @param documentType - 'bank_statement' or 'receipt'
 * @returns React Query result with status data
 */
export function useProcessingStatus(
  documentId: string | undefined,
  documentType: 'bank_statement' | 'receipt'
) {
  return useQuery({
    queryKey: ['processing-status', documentType, documentId],
    queryFn: async () => {
      if (!documentId) return null;

      const table = documentType === 'bank_statement' ? 'bank_statements' : 'receipts';
      
      // Using type assertion since gamification tables aren't in generated types yet
      const { data, error } = await supabase
        .from(table as 'bank_statements')
        .select('id, processing_status')
        .eq('id', documentId)
        .single();

      if (error) {
        console.error(`Error fetching ${documentType} status:`, error);
        throw error;
      }

      return data as unknown as ProcessingStatusData;
    },
    enabled: !!documentId,
    refetchInterval: (query) => {
      // Stop polling when status is terminal
      const data = query.state.data;
      if (!data || data.processing_status === 'completed' || data.processing_status === 'failed') {
        return false;
      }
      // Poll every 2 seconds while processing
      return 2000;
    },
    retry: 3,
    retryDelay: 1000,
  });
}
