import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpForm } from './SignUpForm';
import { useOAuth } from '@/hooks/auth/useOAuth';

// Mock the useOAuth hook
const mockSignInWithProvider = vi.fn();
vi.mock('@/hooks/auth/useOAuth', () => ({
  useOAuth: () => ({
    signInWithProvider: mockSignInWithProvider,
    loading: false,
  }),
}));

describe('SignUpForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders OAuth-only sign-up form', () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred sign-up method to create your Previa account')).toBeInTheDocument();
    
    // Should show OAuth providers
    expect(screen.getByText('Sign up with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign up with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Sign up with Discord')).toBeInTheDocument();
  });

  it('calls onSuccess when OAuth provider is clicked', async () => {
    mockSignInWithProvider.mockResolvedValue({ success: true });
    
    render(<SignUpForm onSuccess={mockOnSuccess} />);

    await fireEvent.click(screen.getByText('Sign up with Google'));
    
    expect(mockSignInWithProvider).toHaveBeenCalledWith('google');
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('handles OAuth provider clicks for all providers', () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByText('Sign up with Google'));
    expect(mockSignInWithProvider).toHaveBeenCalledWith('google');

    fireEvent.click(screen.getByText('Sign up with GitHub'));
    expect(mockSignInWithProvider).toHaveBeenCalledWith('github');

    fireEvent.click(screen.getByText('Sign up with Discord'));
    expect(mockSignInWithProvider).toHaveBeenCalledWith('discord');
  });

  it('does not show email/password fields', () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);

    // Should not have email/password fields
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/verification/i)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SignUpForm className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});