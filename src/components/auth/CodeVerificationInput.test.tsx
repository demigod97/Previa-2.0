import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CodeVerificationInput } from './CodeVerificationInput';

describe('CodeVerificationInput', () => {
  const mockOnComplete = vi.fn();
  const mockOnCodeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 6 input fields', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('auto-focuses first field on mount', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} autoFocus />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    expect(firstInput).toHaveFocus();
  });

  it('only accepts numeric input', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: 'a' } });
    
    expect(firstInput).toHaveValue('');
  });

  it('moves to next field on digit entry', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    
    expect(inputs[1]).toHaveFocus();
  });

  it('moves to previous field on backspace when current is empty', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const inputs = screen.getAllByRole('textbox');
    // Focus second input
    inputs[1].focus();
    // Press backspace
    fireEvent.keyDown(inputs[1], { key: 'Backspace' });
    
    expect(inputs[0]).toHaveFocus();
  });

  it('calls onCodeChange when digits change', () => {
    render(
      <CodeVerificationInput 
        onComplete={mockOnComplete} 
        onCodeChange={mockOnCodeChange} 
      />
    );
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '1' } });
    
    expect(mockOnCodeChange).toHaveBeenCalledWith('1');
  });

  it('calls onComplete when all 6 digits are entered', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // Enter all 6 digits
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    expect(mockOnComplete).toHaveBeenCalledWith('123456');
  });

  it('handles paste functionality with 6-digit code', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    
    // Simulate paste event
    fireEvent.paste(firstInput, {
      clipboardData: {
        getData: () => '123456'
      }
    });
    
    expect(mockOnComplete).toHaveBeenCalledWith('123456');
  });

  it('ignores paste with invalid data', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    
    // Simulate paste with invalid data
    fireEvent.paste(firstInput, {
      clipboardData: {
        getData: () => 'abc123'
      }
    });
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('shows visual feedback for filled fields', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '1' } });
    
    // Check that the input has the filled styling
    expect(firstInput).toHaveClass('border-green-500');
  });

  it('disables all inputs when disabled prop is true', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} disabled />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('handles focus events correctly', () => {
    render(<CodeVerificationInput onComplete={mockOnComplete} />);
    
    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '1' } });
    
    // After changing value, focus should move to next field
    const secondInput = screen.getAllByRole('textbox')[1];
    expect(secondInput).toHaveFocus();
  });
});
