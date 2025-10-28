// Chakra UI Alert component
import { Alert as ChakraAlert, AlertIcon, AlertTitle, AlertDescription as ChakraAlertDescription, AlertProps as ChakraAlertProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface AlertProps extends ChakraAlertProps {
  children: ReactNode;
  variant?: 'subtle' | 'left-accent' | 'top-accent' | 'solid';
}

export const Alert = ({ children, ...props }: AlertProps) => (
  <ChakraAlert {...props}>
    <AlertIcon />
    {children}
  </ChakraAlert>
);

export const AlertDescription = ChakraAlertDescription;
export { AlertTitle };
