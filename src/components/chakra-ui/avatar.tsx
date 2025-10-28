// Chakra UI Avatar component
import { Avatar as ChakraAvatar, AvatarProps as ChakraAvatarProps, AvatarBadge, AvatarGroup } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface AvatarProps extends ChakraAvatarProps {
  children?: ReactNode;
  className?: string;
}

export interface AvatarFallbackProps {
  children: ReactNode;
  className?: string;
}

export const Avatar = ({ children, className, ...props }: AvatarProps) => (
  <ChakraAvatar
    {...props}
    className={className}
    fontSize="sm"
    fontWeight="medium"
  >
    {children}
  </ChakraAvatar>
);

// AvatarFallback renders the initials with proper sizing
export const AvatarFallback = ({ children, className }: AvatarFallbackProps) => <>{children}</>;

// Re-export other Avatar components for compatibility
export { AvatarBadge, AvatarGroup };
