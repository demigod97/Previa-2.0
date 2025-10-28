import React, { useState } from 'react';
import { HStack, PinInput, PinInputField } from '@chakra-ui/react';

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
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onCodeChange?.(newValue);

    // Call onComplete if all 6 digits are filled
    if (newValue.length === 6) {
      onComplete(newValue);
    }
  };

  return (
    <HStack spacing={2} justify="center" className={className}>
      <PinInput
        value={value}
        onChange={handleChange}
        otp
        autoFocus={autoFocus}
        isDisabled={disabled}
        size="lg"
      >
        <PinInputField
          bg="previa.cream"
          borderColor="previa.sand"
          color="previa.charcoal"
          _focus={{
            borderColor: 'previa.stone',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-stone)',
          }}
          _filled={{
            bg: 'green.50',
            borderColor: 'green.500',
            color: 'green.700',
          }}
          width="12"
          height="12"
          fontSize="lg"
          fontFamily="mono"
          textAlign="center"
        />
        <PinInputField
          bg="previa.cream"
          borderColor="previa.sand"
          color="previa.charcoal"
          _focus={{
            borderColor: 'previa.stone',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-stone)',
          }}
          _filled={{
            bg: 'green.50',
            borderColor: 'green.500',
            color: 'green.700',
          }}
          width="12"
          height="12"
          fontSize="lg"
          fontFamily="mono"
          textAlign="center"
        />
        <PinInputField
          bg="previa.cream"
          borderColor="previa.sand"
          color="previa.charcoal"
          _focus={{
            borderColor: 'previa.stone',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-stone)',
          }}
          _filled={{
            bg: 'green.50',
            borderColor: 'green.500',
            color: 'green.700',
          }}
          width="12"
          height="12"
          fontSize="lg"
          fontFamily="mono"
          textAlign="center"
        />
        <PinInputField
          bg="previa.cream"
          borderColor="previa.sand"
          color="previa.charcoal"
          _focus={{
            borderColor: 'previa.stone',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-stone)',
          }}
          _filled={{
            bg: 'green.50',
            borderColor: 'green.500',
            color: 'green.700',
          }}
          width="12"
          height="12"
          fontSize="lg"
          fontFamily="mono"
          textAlign="center"
        />
        <PinInputField
          bg="previa.cream"
          borderColor="previa.sand"
          color="previa.charcoal"
          _focus={{
            borderColor: 'previa.stone',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-stone)',
          }}
          _filled={{
            bg: 'green.50',
            borderColor: 'green.500',
            color: 'green.700',
          }}
          width="12"
          height="12"
          fontSize="lg"
          fontFamily="mono"
          textAlign="center"
        />
        <PinInputField
          bg="previa.cream"
          borderColor="previa.sand"
          color="previa.charcoal"
          _focus={{
            borderColor: 'previa.stone',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-stone)',
          }}
          _filled={{
            bg: 'green.50',
            borderColor: 'green.500',
            color: 'green.700',
          }}
          width="12"
          height="12"
          fontSize="lg"
          fontFamily="mono"
          textAlign="center"
        />
      </PinInput>
    </HStack>
  );
}

export default CodeVerificationInput;
