// Chakra UI Form components
export {
  FormControl as Form,
  FormControl,
  FormLabel,
  FormErrorMessage as FormMessage,
  FormHelperText,
} from '@chakra-ui/react';

import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

// React Hook Form compatibility
export const FormField = ({ children }: { children: ReactNode }) => <>{children}</>;
export const FormItem = ({ children, ...props }: { children: ReactNode }) => (
  <Box mb={4} {...props}>
    {children}
  </Box>
);
export const FormDescription = ({ children }: { children: ReactNode }) => <>{children}</>;
