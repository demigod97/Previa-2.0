import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { SignUpForm } from './SignUpForm';
import { useSignUp } from '@/hooks/auth/useSignUp';

// Mock the useSignUp hook
vi.mock('@/hooks/auth/useSignUp');
const mockUseSignUp = vi.mocked(useSignUp);

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('SignUpForm', () => {
  const mockOnSuccess = vi.fn();
  const mockVerifySignUpCode = vi.fn();
  const mockCreateAccount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSignUp.mockReturnValue({
      loading: false,
      verifySignUpCode: mockVerifySignUpCode,
      createAccount: mockCreateAccount
    });
  });

  it('renders credentials phase initially', () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('validates password confirmation', async () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /continue to verification/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password Mismatch')).toBeInTheDocument();
    });
  });

  it('validates minimum password length', async () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /continue to verification/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password Too Short')).toBeInTheDocument();
    });
  });

  it('transitions to verification phase on valid credentials', async () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /continue to verification/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('shows password strength indicator', () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    expect(screen.getByText('Password Strength:')).toBeInTheDocument();
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('handles code verification success', async () => {
    mockVerifySignUpCode.mockResolvedValue({ valid: true });
    mockCreateAccount.mockResolvedValue({ success: true, user: { id: '123' } });
    
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    // Fill credentials and submit
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });
    
    // Enter verification code
    const codeInputs = screen.getAllByRole('textbox');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    await waitFor(() => {
      expect(mockVerifySignUpCode).toHaveBeenCalledWith('123456');
      expect(mockCreateAccount).toHaveBeenCalledWith('test@example.com', 'password123', '123456');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles code verification failure', async () => {
    mockVerifySignUpCode.mockResolvedValue({ valid: false, reason: 'Invalid code' });
    
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    // Fill credentials and submit
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });
    
    // Enter verification code
    const codeInputs = screen.getAllByRole('textbox');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Invalid Code')).toBeInTheDocument();
    });
  });

  it('handles account creation failure', async () => {
    mockVerifySignUpCode.mockResolvedValue({ valid: true });
    mockCreateAccount.mockResolvedValue({ success: false, error: 'Email already exists' });
    
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    // Fill credentials and submit
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });
    
    // Enter verification code
    const codeInputs = screen.getAllByRole('textbox');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Account Creation Failed')).toBeInTheDocument();
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('allows going back to credentials phase', async () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    // Fill credentials and submit
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });
    
    // Click back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('disables create account button until code is complete', async () => {
    render(<SignUpForm onSuccess={mockOnSuccess} />);
    
    // Fill credentials and submit
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /continue to verification/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Verify Code')).toBeInTheDocument();
    });
    
    const createButton = screen.getByRole('button', { name: /create account/i });
    expect(createButton).toBeDisabled();
    
    // Enter partial code
    const codeInputs = screen.getAllByRole('textbox');
    fireEvent.change(codeInputs[0], { target: { value: '1' } });
    fireEvent.change(codeInputs[1], { target: { value: '2' } });
    
    expect(createButton).toBeDisabled();
    
    // Complete the code
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    // Wait for the component to process the code change
    await waitFor(() => {
      expect(createButton).not.toBeDisabled();
    });
  });
});
