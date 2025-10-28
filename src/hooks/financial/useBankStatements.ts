import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BankStatement {
  id: string;
  user_id: string;
  file_path: string;
  processing_status: string | null;
  created_at: string;
  extracted_at: string | null;
  error_message: string | null;
}

export function useBankStatements(userId?: string, limit = 10) {
  return useQuery({
    queryKey: ['bank_statements', userId, limit],
    queryFn: async (): Promise<BankStatement[]> => {
      if (!userId) {
        throw new Error('User ID is required to fetch bank statements');
      }

      const { data, error } = await supabase
        .from('bank_statements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch bank statements:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
