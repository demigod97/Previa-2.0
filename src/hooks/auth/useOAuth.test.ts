import { renderHook, act } from '@testing-library/react';
import { useOAuth } from './useOAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
    })),
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useOAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading false', () => {
    const { result } = renderHook(() => useOAuth());
    
    expect(result.current.loading).toBe(false);
  });

  it('should call signInWithOAuth for Google provider', async () => {
    const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
    mockSignInWithOAuth.mockResolvedValue({
      data: { provider: 'google', url: 'https://example.com' },
      error: null,
    });

    const { result } = renderHook(() => useOAuth());

    await act(async () => {
      const response = await result.current.signInWithProvider('google');
      expect(response.success).toBe(true);
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('should call signInWithOAuth for GitHub provider', async () => {
    const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
    mockSignInWithOAuth.mockResolvedValue({
      data: { provider: 'github', url: 'https://example.com' },
      error: null,
    });

    const { result } = renderHook(() => useOAuth());

    await act(async () => {
      const response = await result.current.signInWithProvider('github');
      expect(response.success).toBe(true);
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('should call signInWithOAuth for Discord provider', async () => {
    const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
    mockSignInWithOAuth.mockResolvedValue({
      data: { provider: 'discord', url: 'https://example.com' },
      error: null,
    });

    const { result } = renderHook(() => useOAuth());

    await act(async () => {
      const response = await result.current.signInWithProvider('discord');
      expect(response.success).toBe(true);
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'discord',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('should handle OAuth errors', async () => {
    const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
    mockSignInWithOAuth.mockResolvedValue({
      data: { provider: 'google', url: null },
      error: { message: 'OAuth error' },
    });

    const { result } = renderHook(() => useOAuth());

    await act(async () => {
      const response = await result.current.signInWithProvider('google');
      expect(response.success).toBe(false);
      expect(response.error).toBe('OAuth error');
    });
  });

  it('should handle OAuth callback successfully', async () => {
    const mockGetSession = vi.mocked(supabase.auth.getSession);
    const mockFrom = vi.mocked(supabase.from);
    const mockSelect = vi.fn();
    const mockEq = vi.fn();
    const mockSingle = vi.fn();
    const mockInsert = vi.fn();

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
              full_name: 'Test User',
              avatar_url: 'https://example.com/avatar.jpg',
            },
          },
        },
      },
      error: null,
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    });

    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      single: mockSingle,
    });

    mockSingle.mockResolvedValue({
      data: null, // No existing profile
      error: null,
    });

    mockInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useOAuth());

    await act(async () => {
      const response = await result.current.handleOAuthCallback();
      expect(response.success).toBe(true);
    });

    expect(mockGetSession).toHaveBeenCalled();
    expect(mockInsert).toHaveBeenCalledTimes(2); // Profile and user_tiers
  });
});
