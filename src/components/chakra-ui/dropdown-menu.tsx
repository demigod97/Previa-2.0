// Chakra UI DropdownMenu (Menu) component
export {
  Menu as DropdownMenu,
  MenuButton as DropdownMenuTrigger,
  MenuList as DropdownMenuContent,
  MenuItem as DropdownMenuItem,
  MenuItemOption as DropdownMenuCheckboxItem,
  MenuGroup as DropdownMenuGroup,
  MenuDivider as DropdownMenuSeparator,
  MenuOptionGroup,
} from '@chakra-ui/react';

export { MenuCommand as DropdownMenuShortcut } from '@chakra-ui/react';
export { MenuIcon as DropdownMenuIcon } from '@chakra-ui/react';

import { ReactNode } from 'react';
export const DropdownMenuLabel = ({ children }: { children: ReactNode }) => <>{children}</>;
