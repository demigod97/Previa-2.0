import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeleteMockData } from '@/hooks/useDeleteMockData';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useDeleteMockData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useDeleteMockData());
    
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.deleteMockData).toBe('function');
  });

  it('should handle authentication errors', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockGetSession = vi.mocked(supabase.auth.getSession);
    
    // Mock no session
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useDeleteMockData());
    
    await act(async () => {
      await result.current.deleteMockData();
    });

    // Should not call the Edge Function without authentication
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });

  it('should call Edge Function with valid session', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockGetSession = vi.mocked(supabase.auth.getSession);
    const mockInvoke = vi.mocked(supabase.functions.invoke);
    
    // Mock valid session
    mockGetSession.mockResolvedValue({
      data: { 
        session: { 
          access_token: 'valid-token',
          user: { id: 'user-123' }
        } 
      },
      error: null,
    });

    // Mock successful Edge Function response
    mockInvoke.mockResolvedValue({
      data: {
        success: true,
        message: 'Data deleted successfully',
        deletedCounts: {
          bankAccounts: 2,
          transactions: 30,
          receipts: 0,
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useDeleteMockData());
    
    await act(async () => {
      await result.current.deleteMockData();
    });

    expect(mockInvoke).toHaveBeenCalledWith('delete-mock-data', {
      body: {},
    });
  });

  it('should handle rate limiting errors', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockGetSession = vi.mocked(supabase.auth.getSession);
    const mockInvoke = vi.mocked(supabase.functions.invoke);
    
    // Mock valid session
    mockGetSession.mockResolvedValue({
      data: { 
        session: { 
          access_token: 'valid-token',
          user: { id: 'user-123' }
        } 
      },
      error: null,
    });

    // Mock rate limit error
    mockInvoke.mockResolvedValue({
      data: null,
      error: {
        message: 'Rate limit exceeded',
      },
    });

    const { result } = renderHook(() => useDeleteMockData());
    
    await act(async () => {
      await result.current.deleteMockData();
    });

    expect(mockInvoke).toHaveBeenCalledWith('delete-mock-data', {
      body: {},
    });
  });
});
