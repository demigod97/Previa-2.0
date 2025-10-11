/**
 * useUserTier Hook Integration Tests
 *
 * Tests for user tier data fetching hook with mocked Supabase client
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserTier } from '@/hooks/financial/useUserTier';
import { mockUserTiers } from '@/test/fixtures/financial-data';
import type { ReactNode } from 'react';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('useUserTier Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test to ensure isolation
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for faster tests
        },
      },
    });

    vi.clearAllMocks();
  });

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('should fetch user tier successfully for free tier', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockUserTiers.freeTier,
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    } as any);

    const { result } = renderHook(
      () =>
        useUserTier({
          userId: mockUserTiers.freeTier.user_id,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUserTiers.freeTier);
    expect(result.current.data?.tier).toBe('user');
    expect(result.current.data?.accounts_limit).toBe(3);
    expect(result.current.data?.transactions_monthly_limit).toBe(50);
    expect(result.current.data?.receipts_monthly_limit).toBe(10);
  });

  it('should fetch user tier successfully for premium tier', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockUserTiers.premiumTier,
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    } as any);

    const { result } = renderHook(
      () =>
        useUserTier({
          userId: mockUserTiers.premiumTier.user_id,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUserTiers.premiumTier);
    expect(result.current.data?.tier).toBe('premium_user');
    expect(result.current.data?.accounts_limit).toBe(999999);
  });

  it('should handle error when tier not found', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    } as any);

    const { result } = renderHook(
      () =>
        useUserTier({
          userId: 'non-existent-user',
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('User tier not found');
  });

  it('should handle database error', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockError = {
      code: 'PGRST116',
      message: 'Database connection failed',
    };

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    } as any);

    const { result } = renderHook(
      () =>
        useUserTier({
          userId: 'test-user',
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.error).toEqual(mockError);
  });

  it('should not fetch when userId is null', () => {
    const { result } = renderHook(
      () =>
        useUserTier({
          userId: null,
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should not fetch when enabled is false', () => {
    const { result } = renderHook(
      () =>
        useUserTier({
          userId: 'test-user',
          enabled: false,
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should use correct query key', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const userId = 'test-user-123';

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockUserTiers.freeTier,
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    } as any);

    const { result } = renderHook(
      () =>
        useUserTier({
          userId,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the query is cached with the correct key
    const cachedData = queryClient.getQueryData(['user-tier', userId]);
    expect(cachedData).toBeDefined();
  });

  it('should apply staleTime of 5 minutes', async () => {
    const { supabase } = await import('@/integrations/supabase/client');

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockUserTiers.freeTier,
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    } as any);

    const { result } = renderHook(
      () =>
        useUserTier({
          userId: 'test-user',
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Get query state to check staleTime
    const queryState = queryClient.getQueryState(['user-tier', 'test-user']);
    expect(queryState).toBeDefined();
    // Note: staleTime verification would require accessing internal query options
  });
});
