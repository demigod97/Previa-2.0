import React, { useRef, useState, useEffect, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CodeVerificationInputProps {
  onComplete: (code: string) => void;
  onCodeChange?: (code: string) => void;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * CodeVerificationInput - 6-field code entry component for signup verification
 * 
 * Features:
 * - Auto-focus navigation between fields
 * - Backspace moves to previous field
 * - Paste functionality distributes digits across fields
 * - Numeric input validation
 * - Visual feedback for filled/empty states
 * 
 * @param onComplete - Callback when all 6 digits are entered
 * @param onCodeChange - Optional callback for code changes
 * @param className - Additional CSS classes
 * @param disabled - Disable all inputs
 * @param autoFocus - Auto-focus first field on mount
 */
export function CodeVerificationInput({
  onComplete,
  onCodeChange,
  className,
  disabled = false,
  autoFocus = true
}: CodeVerificationInputProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first field on mount
  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  // Handle digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Call onCodeChange callback
    const code = newDigits.join('');
    onCodeChange?.(code);

    // Auto-focus next field if digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all digits filled
    if (newDigits.every(digit => digit !== '') && newDigits.join('').length === 6) {
      onComplete(newDigits.join(''));
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous field if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Only process if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const pastedDigits = pastedData.split('');
      setDigits(pastedDigits);
      onCodeChange?.(pastedData);
      onComplete(pastedData);
    }
  };

  // Handle focus to select all text
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-mono",
            "border-2 transition-all duration-200",
            digit 
              ? "border-green-500 bg-green-50 text-green-700" 
              : "border-gray-300 bg-white text-gray-700",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            backgroundColor: digit ? '#F0FDF4' : '#F2E9D8',
            borderColor: digit ? '#22C55E' : '#D9C8B4',
            color: digit ? '#15803D' : '#403B31'
          }}
        />
      ))}
    </div>
  );
}

export default CodeVerificationInput;
