import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthForm from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      insert: vi.fn(() => ({
        eq: vi.fn()
      })),
      update: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false
  })
}));

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Sign-up Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full sign-up flow with valid code', async () => {
    // Mock successful code verification
    const mockCodeData = {
      id: '1',
      code: 'PREVIA2025',
      is_active: true,
      use_limit: null,
      used_count: 0,
      expiry_date: null
    };

    (supabase.from as jest.MockedFunction<typeof supabase.from>).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockCodeData,
              error: null
            }))
          }))
        }))
      })),
      insert: vi.fn(() => ({
        data: {},
        error: null
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: {},
          error: null
        }))
      }))
    });

    // Mock successful auth sign-up
    (supabase.auth.signUp as jest.MockedFunction<typeof supabase.auth.signUp>).mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'test@example.com' }
      },
      error: null
    });

    render(<AuthForm />, { wrapper: createTestWrapper() });

    // Switch to sign-up mode
    fireEvent.click(screen.getByText('Sign up'));

    // Fill sign-up form
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { 
      target: { value: 'password123' } 
    });

    // Submit credentials
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));

    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });

    // Enter verification code
    // Wait for code input fields to be rendered
    await waitFor(() => {
      const codeInputs = screen.getAllByRole('textbox');
      expect(codeInputs).toHaveLength(6);
    });

    const codeInputs = screen.getAllByRole('textbox');
    const code = '123456'; // Use 6-digit code
    
    // Simulate typing each character
    for (let i = 0; i < code.length; i++) {
      fireEvent.change(codeInputs[i], { target: { value: code[i] } });
    }

    // Wait for button to be enabled and click it
    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /create account/i });
      expect(createButton).not.toBeDisabled();
    });
    
    const createButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('handles invalid verification code', async () => {
    // Mock code not found
    (supabase.from as jest.MockedFunction<typeof supabase.from>).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: 'No rows found' }
            }))
          }))
        }))
      }))
    });

    render(<AuthForm />, { wrapper: createTestWrapper() });

    // Switch to sign-up mode
    fireEvent.click(screen.getByText('Sign up'));

    // Fill and submit credentials
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));

    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });

    // Enter invalid code
    // Wait for code input fields to be rendered
    await waitFor(() => {
      const codeInputs = screen.getAllByRole('textbox');
      expect(codeInputs).toHaveLength(6);
    });

    const codeInputs = screen.getAllByRole('textbox');
    const invalidCode = '999999'; // Use 6-digit invalid code
    
    for (let i = 0; i < invalidCode.length; i++) {
      fireEvent.change(codeInputs[i], { target: { value: invalidCode[i] } });
    }

    // Wait for button to be enabled and click it
    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /create account/i });
      expect(createButton).not.toBeDisabled();
    });
    
    const createButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid Code')).toBeInTheDocument();
    });
  });

  it('handles expired verification code', async () => {
    // Mock expired code
    const expiredCodeData = {
      id: '1',
      code: 'EXPIRED',
      is_active: true,
      use_limit: null,
      used_count: 0,
      expiry_date: '2020-01-01T00:00:00Z' // Past date
    };

    (supabase.from as jest.MockedFunction<typeof supabase.from>).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: expiredCodeData,
              error: null
            }))
          }))
        }))
      }))
    });

    render(<AuthForm />, { wrapper: createTestWrapper() });

    // Switch to sign-up mode and fill form
    fireEvent.click(screen.getByText('Sign up'));
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));

    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });

    // Enter expired code
    // Wait for code input fields to be rendered
    await waitFor(() => {
      const codeInputs = screen.getAllByRole('textbox');
      expect(codeInputs).toHaveLength(6);
    });

    const codeInputs = screen.getAllByRole('textbox');
    const expiredCode = '888888'; // Use 6-digit expired code
    
    for (let i = 0; i < expiredCode.length; i++) {
      fireEvent.change(codeInputs[i], { target: { value: expiredCode[i] } });
    }

    // Wait for the button to be available and click it
    const createAccountButton = await waitFor(() => 
      screen.getByRole('button', { name: /create account/i })
    );
    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid Code')).toBeInTheDocument();
    });
  });

  it('handles email already exists error', async () => {
    // Mock valid code
    const mockCodeData = {
      id: '1',
      code: 'PREVIA2025',
      is_active: true,
      use_limit: null,
      used_count: 0,
      expiry_date: null
    };

    (supabase.from as jest.MockedFunction<typeof supabase.from>).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockCodeData,
              error: null
            }))
          }))
        }))
      }))
    });

    // Mock email already exists error
    (supabase.auth.signUp as jest.MockedFunction<typeof supabase.auth.signUp>).mockResolvedValue({
      data: null,
      error: { message: 'User already registered' }
    });

    render(<AuthForm />, { wrapper: createTestWrapper() });

    // Complete sign-up flow
    fireEvent.click(screen.getByText('Sign up'));
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'existing@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));

    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });

    // Enter code and submit
    // Wait for code input fields to be rendered
    await waitFor(() => {
      const codeInputs = screen.getAllByRole('textbox');
      expect(codeInputs).toHaveLength(6);
    });

    const codeInputs = screen.getAllByRole('textbox');
    const code = '123456'; // Use 6-digit code
    
    for (let i = 0; i < code.length; i++) {
      fireEvent.change(codeInputs[i], { target: { value: code[i] } });
    }

    // Wait for the button to be available and click it
    const createAccountButton = await waitFor(() => 
      screen.getByRole('button', { name: /create account/i })
    );
    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(screen.getByText('Account Creation Failed')).toBeInTheDocument();
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
