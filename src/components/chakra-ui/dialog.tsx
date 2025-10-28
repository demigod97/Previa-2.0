// Chakra UI Dialog (Modal) component
export {
  Modal as Dialog,
  ModalOverlay,
  ModalContent as DialogContent,
  ModalHeader as DialogHeader,
  ModalFooter as DialogFooter,
  ModalBody as DialogBody,
  ModalCloseButton as DialogClose,
  useDisclosure,
} from '@chakra-ui/react';

// Additional exports for compatibility
import { Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const DialogTitle = ({ children }: { children: ReactNode }) => (
  <Heading as="h2" size="lg">
    {children}
  </Heading>
);

export const DialogDescription = ({ children }: { children: ReactNode }) => <>{children}</>;
export const DialogTrigger = ({ children }: { children: ReactNode }) => <>{children}</>;
