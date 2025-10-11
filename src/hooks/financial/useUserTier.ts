/**
 * useUserTier Hook - Fetch and manage user tier data
 *
 * Provides user tier information including limits and upgrade status.
 * Uses React Query for caching and automatic refresh.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserTierData } from '@/types/financial';

interface UseUserTierOptions {
  enabled?: boolean;
  userId?: string | null;
}

/**
 * Custom hook to fetch user tier data
 *
 * @param options - Configuration options
 * @param options.enabled - Whether to enable the query (default: true when userId exists)
 * @param options.userId - User ID to fetch tier for
 * @returns React Query result with tier data
 */
export function useUserTier(options: UseUserTierOptions = {}) {
  const { enabled = true, userId } = options;

  return useQuery({
    queryKey: ['user-tier', userId],
    queryFn: async (): Promise<UserTierData> => {
      if (!userId) {
        throw new Error('User ID is required to fetch tier data');
      }

      const { data, error } = await supabase
        .from('user_tiers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Failed to fetch user tier:', {
          code: error.code,
          message: error.message,
          userId: userId.substring(0, 8) + '...',
        });
        throw error;
      }

      if (!data) {
        throw new Error('User tier not found');
      }

      // Transform database row to UserTierData
      return {
        id: data.id,
        user_id: data.user_id || userId,
        tier: data.tier as 'user' | 'premium_user',
        accounts_limit: data.accounts_limit || 3,
        transactions_monthly_limit: data.transactions_monthly_limit || 50,
        receipts_monthly_limit: data.receipts_monthly_limit || 10,
        upgraded_at: data.upgraded_at,
        expires_at: data.expires_at,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      };
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
}
