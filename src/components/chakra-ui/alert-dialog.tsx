// Chakra UI AlertDialog component
export {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

// Additional exports for compatibility
import { Button, Heading, Text, ButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const AlertDialogTrigger = ({ children }: { children: ReactNode }) => <>{children}</>;

export const AlertDialogTitle = ({ children }: { children: ReactNode }) => (
  <Heading as="h2" size="md">
    {children}
  </Heading>
);

export const AlertDialogDescription = ({ children }: { children: ReactNode }) => (
  <Text>{children}</Text>
);

export const AlertDialogAction = ({ children, ...props }: ButtonProps & { children: ReactNode }) => (
  <Button colorScheme="red" {...props}>
    {children}
  </Button>
);

export const AlertDialogCancel = ({ children, ...props }: ButtonProps & { children: ReactNode }) => (
  <Button variant="ghost" {...props}>
    {children}
  </Button>
);
