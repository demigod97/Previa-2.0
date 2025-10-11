import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BankAccount {
  id: string;
  user_id: string;
  institution: string;
  account_name: string;
  account_number_masked: string | null;
  balance: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export function useBankAccounts(userId?: string) {
  return useQuery({
    queryKey: ['bank-accounts', userId],
    queryFn: async (): Promise<BankAccount[]> => {
      if (!userId) {
        throw new Error('User ID is required to fetch bank accounts');
      }

      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch bank accounts:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
