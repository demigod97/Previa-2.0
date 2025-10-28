// Logo component using actual Previa SVG logo
import { Box, BoxProps, Image } from '@chakra-ui/react';

export interface LogoProps extends Omit<BoxProps, 'size'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: '24px',
  md: '32px',
  lg: '48px',
  xl: '64px',
};

const Logo = ({ size = 'md', ...props }: LogoProps) => {
  return (
    <Box display="inline-flex" alignItems="center" {...props}>
      <Image
        src="/previa-logo.svg"
        alt="Previa Logo"
        height={sizeMap[size]}
        width="auto"
        objectFit="contain"
      />
    </Box>
  );
};

export default Logo;
