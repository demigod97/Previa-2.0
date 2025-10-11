/**
 * useReconciliation Hook - Reconciliation data and actions
 * 
 * Manages fetching unmatched transactions/receipts and creating matches
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Transaction, Receipt } from '@/types/financial';
import type { ReconciliationMatch, MatchSuggestion } from '@/types/reconciliation';

/**
 * Fetch unmatched transactions (status = 'unreconciled')
 */
export function useUnmatchedTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', 'unmatched', user?.id],
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'unreconciled')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      
      // Transform to include type and date fields
      return (data || []).map(tx => ({
        ...tx,
        type: (tx.amount < 0 ? 'expense' : 'income') as 'income' | 'expense',
        date: tx.transaction_date,
      }));
    },
    enabled: !!user,
    staleTime: 10_000, // 10 seconds
  });
}

/**
 * Fetch unmatched receipts (not in reconciliation_matches)
 */
export function useUnmatchedReceipts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['receipts', 'unmatched', user?.id],
    queryFn: async (): Promise<Receipt[]> => {
      if (!user) throw new Error('User not authenticated');

      // Get all receipt IDs that are already matched
      const { data: matches, error: matchError } = await supabase
        .from('reconciliation_matches')
        .select('receipt_id')
        .eq('user_id', user.id);

      if (matchError) throw matchError;

      const matchedReceiptIds = matches?.map(m => m.receipt_id) || [];

      // Get receipts that are not matched
      let query = supabase
        .from('receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('receipt_date', { ascending: false });

      if (matchedReceiptIds.length > 0) {
        query = query.not('id', 'in', `(${matchedReceiptIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 10_000, // 10 seconds
  });
}

/**
 * Fetch AI match suggestions for a transaction
 */
export function useMatchSuggestions(transactionId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['match-suggestions', transactionId, user?.id],
    queryFn: async (): Promise<MatchSuggestion[]> => {
      if (!user || !transactionId) throw new Error('Missing required parameters');

      // TODO: Call Edge Function that uses AI to suggest matches
      // For now, return empty array (will be implemented in backend story)
      return [];
    },
    enabled: !!user && !!transactionId,
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Create a reconciliation match
 */
export function useCreateMatch() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      receiptId,
      confidenceScore,
    }: {
      transactionId: string;
      receiptId: string;
      confidenceScore: number;
    }): Promise<ReconciliationMatch> => {
      if (!user) throw new Error('User not authenticated');

      // Create match record
      const { data, error } = await supabase
        .from('reconciliation_matches')
        .insert({
          user_id: user.id,
          transaction_id: transactionId,
          receipt_id: receiptId,
          confidence: confidenceScore,
          status: 'approved',
        })
        .select()
        .single();

      if (error) throw error;

      // Update transaction status to 'matched'
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'matched' })
        .eq('id', transactionId);

      if (updateError) throw updateError;

      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['transactions', 'unmatched'] });
      queryClient.invalidateQueries({ queryKey: ['receipts', 'unmatched'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Match approved! Transaction reconciled.');
    },
    onError: (error) => {
      console.error('Failed to create match:', error);
      toast.error('Failed to create match. Please try again.');
    },
  });
}

/**
 * Delete a reconciliation match (undo)
 */
export function useDeleteMatch() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');

      // Get the match to find transaction ID
      const { data: match, error: fetchError } = await supabase
        .from('reconciliation_matches')
        .select('transaction_id')
        .eq('id', matchId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the match
      const { error: deleteError } = await supabase
        .from('reconciliation_matches')
        .delete()
        .eq('id', matchId);

      if (deleteError) throw deleteError;

      // Update transaction status back to 'unreconciled'
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'unreconciled' })
        .eq('id', match.transaction_id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', 'unmatched'] });
      queryClient.invalidateQueries({ queryKey: ['receipts', 'unmatched'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Match deleted. Transaction marked as unreconciled.');
    },
    onError: (error) => {
      console.error('Failed to delete match:', error);
      toast.error('Failed to delete match. Please try again.');
    },
  });
}

