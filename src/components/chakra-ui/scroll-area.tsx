// Chakra UI ScrollArea (Box with overflow) component
import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ScrollAreaProps extends BoxProps {
  children: ReactNode;
}

export const ScrollArea = ({ children, ...props }: ScrollAreaProps) => (
  <Box overflowY="auto" {...props}>
    {children}
  </Box>
);
