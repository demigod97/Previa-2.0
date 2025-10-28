// Chakra UI Select components - simple wrappers
import { Select as ChakraSelect, SelectProps as ChakraSelectProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface SelectProps extends Omit<ChakraSelectProps, 'children'> {
  children: ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
}

// Main Select component that wraps Chakra UI Select
export const Select = ({ children, onValueChange, ...props }: SelectProps) => (
  <ChakraSelect
    onChange={(e) => onValueChange?.(e.target.value)}
    {...props}
  >
    {children}
  </ChakraSelect>
);

// SelectTrigger not needed in Chakra UI - Select handles this
export const SelectTrigger = Select;

// SelectValue not needed in Chakra UI - Select handles this
export const SelectValue = () => null;

// SelectContent not needed in Chakra UI - Select handles this
export const SelectContent = ({ children }: { children: ReactNode }) => <>{children}</>;

// SelectItem maps to Chakra UI option element
export const SelectItem = ({ value, children }: { value: string; children: ReactNode }) => (
  <option value={value}>{children}</option>
);
