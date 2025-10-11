import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  bank_statement_id: string | null;
  user_id: string;
  transaction_date: string;
  amount: number;
  description: string | null;
  category: string | null;
  status: string | null;
  created_at: string;
}

export function useTransactions(userId?: string, limit = 10) {
  return useQuery({
    queryKey: ['transactions', userId, limit],
    queryFn: async (): Promise<Transaction[]> => {
      if (!userId) {
        throw new Error('User ID is required to fetch transactions');
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch transactions:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
