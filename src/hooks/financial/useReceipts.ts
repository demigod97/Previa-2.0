import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface Receipt {
  id: string;
  user_id: string;
  merchant: string | null;
  receipt_date: string | null;
  amount: number | null;
  tax: number | null;
  file_path: string;
  file_size: number | null;
  processing_status: string | null;
  confidence_score: number | null;
  ocr_data: Json | null;
  created_at: string;
}

export function useReceipts(userId?: string, limit = 10) {
  return useQuery({
    queryKey: ['receipts', userId, limit],
    queryFn: async (): Promise<Receipt[]> => {
      if (!userId) {
        throw new Error('User ID is required to fetch receipts');
      }

      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch receipts:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
