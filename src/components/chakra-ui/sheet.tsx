// Chakra UI Sheet (Drawer) component
export {
  Drawer as Sheet,
  DrawerBody as SheetContent,
  DrawerHeader as SheetHeader,
  DrawerFooter as SheetFooter,
  DrawerOverlay as SheetOverlay,
  DrawerCloseButton as SheetClose,
  useDisclosure,
} from '@chakra-ui/react';

import { Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const SheetTrigger = ({ children }: { children: ReactNode }) => <>{children}</>;
export const SheetTitle = ({ children }: { children: ReactNode }) => (
  <Heading as="h2" size="lg">
    {children}
  </Heading>
);
export const SheetDescription = ({ children }: { children: ReactNode }) => <>{children}</>;
