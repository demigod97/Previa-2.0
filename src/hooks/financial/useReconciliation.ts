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
 * Fetch all AI match suggestions (sorted by confidence score)
 */
export function useAIMatchSuggestions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-match-suggestions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ai_match_suggestions')
        .select(`
          id,
          transaction_id,
          receipt_id,
          confidence_score,
          match_reason,
          status,
          created_at,
          transactions!inner (
            id,
            user_id,
            bank_statement_id,
            transaction_date,
            description,
            amount,
            category,
            status,
            created_at
          ),
          receipts!inner (
            id,
            user_id,
            merchant,
            receipt_date,
            amount,
            tax,
            file_path,
            file_size,
            processing_status,
            confidence_score,
            ocr_data,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'suggested')
        .order('confidence_score', { ascending: false });

      if (error) throw error;

      return (data || []).map(suggestion => ({
        ...suggestion,
        transaction: {
          ...suggestion.transactions,
          type: (suggestion.transactions.amount < 0 ? 'expense' : 'income') as 'income' | 'expense',
          date: suggestion.transactions.transaction_date,
        },
        receipt: suggestion.receipts,
      }));
    },
    enabled: !!user,
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Fetch AI match suggestions for a specific transaction
 */
export function useMatchSuggestions(transactionId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['match-suggestions', transactionId, user?.id],
    queryFn: async (): Promise<MatchSuggestion[]> => {
      if (!user || !transactionId) throw new Error('Missing required parameters');

      const { data, error } = await supabase
        .from('ai_match_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .eq('transaction_id', transactionId)
        .eq('status', 'suggested')
        .order('confidence_score', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
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

/**
 * Approve an AI match suggestion
 */
export function useApproveSuggestion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');

      // Get the suggestion details
      const { data: suggestion, error: fetchError } = await supabase
        .from('ai_match_suggestions')
        .select('transaction_id, receipt_id, confidence_score')
        .eq('id', suggestionId)
        .single();

      if (fetchError) throw fetchError;

      // Update suggestion status to 'approved'
      const { error: updateError } = await supabase
        .from('ai_match_suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestionId);

      if (updateError) throw updateError;

      // Create reconciliation match
      const { error: matchError } = await supabase
        .from('reconciliation_matches')
        .insert({
          user_id: user.id,
          transaction_id: suggestion.transaction_id,
          receipt_id: suggestion.receipt_id,
          confidence: suggestion.confidence_score * 100, // Convert 0-1 to 0-100
          status: 'approved',
        });

      if (matchError) throw matchError;

      // Update transaction status to 'matched'
      const { error: txUpdateError } = await supabase
        .from('transactions')
        .update({ status: 'matched' })
        .eq('id', suggestion.transaction_id);

      if (txUpdateError) throw txUpdateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-match-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success('Match approved successfully!');
    },
    onError: (error) => {
      console.error('Failed to approve suggestion:', error);
      toast.error('Failed to approve match. Please try again.');
    },
  });
}

/**
 * Reject an AI match suggestion
 */
export function useRejectSuggestion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ai_match_suggestions')
        .update({ status: 'rejected' })
        .eq('id', suggestionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-match-suggestions'] });
      toast.success('Match rejected.');
    },
    onError: (error) => {
      console.error('Failed to reject suggestion:', error);
      toast.error('Failed to reject match. Please try again.');
    },
  });
}

/**
 * Bulk approve high confidence AI match suggestions
 */
export function useBulkApproveSuggestions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionIds: string[]): Promise<number> => {
      if (!user) throw new Error('User not authenticated');

      let successCount = 0;

      for (const suggestionId of suggestionIds) {
        try {
          // Get suggestion details
          const { data: suggestion, error: fetchError } = await supabase
            .from('ai_match_suggestions')
            .select('transaction_id, receipt_id, confidence_score')
            .eq('id', suggestionId)
            .single();

          if (fetchError) throw fetchError;

          // Update suggestion status
          const { error: updateError } = await supabase
            .from('ai_match_suggestions')
            .update({ status: 'approved' })
            .eq('id', suggestionId);

          if (updateError) throw updateError;

          // Create reconciliation match
          const { error: matchError } = await supabase
            .from('reconciliation_matches')
            .insert({
              user_id: user.id,
              transaction_id: suggestion.transaction_id,
              receipt_id: suggestion.receipt_id,
              confidence: suggestion.confidence_score * 100,
              status: 'approved',
            });

          if (matchError) throw matchError;

          // Update transaction status
          const { error: txUpdateError } = await supabase
            .from('transactions')
            .update({ status: 'matched' })
            .eq('id', suggestion.transaction_id);

          if (txUpdateError) throw txUpdateError;

          successCount++;
        } catch (error) {
          console.error(`Failed to approve suggestion ${suggestionId}:`, error);
        }
      }

      return successCount;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['ai-match-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast.success(`${count} match${count !== 1 ? 'es' : ''} approved successfully!`);
    },
    onError: (error) => {
      console.error('Failed to bulk approve suggestions:', error);
      toast.error('Failed to approve matches. Please try again.');
    },
  });
}

