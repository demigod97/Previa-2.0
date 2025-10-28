// Chakra UI Card components - simple wrappers
import { Box, Heading, Text, BoxProps, HeadingProps, TextProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface CardProps extends BoxProps {
  children: ReactNode;
}

export interface CardHeaderProps extends BoxProps {
  children: ReactNode;
}

export interface CardTitleProps extends HeadingProps {
  children: ReactNode;
}

export interface CardDescriptionProps extends TextProps {
  children: ReactNode;
}

export interface CardContentProps extends BoxProps {
  children: ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => (
  <Box
    bg="previa.paperWhite"
    borderWidth="1px"
    borderColor="previa.stone"
    borderRadius="md"
    boxShadow="sm"
    overflow="hidden"
    {...props}
  >
    {children}
  </Box>
);

export const CardHeader = ({ children, ...props }: CardHeaderProps) => (
  <Box p={4} borderBottomWidth="1px" borderBottomColor="previa.stone" {...props}>
    {children}
  </Box>
);

export const CardTitle = ({ children, ...props }: CardTitleProps) => (
  <Heading as="h3" size="md" color="previa.charcoal" {...props}>
    {children}
  </Heading>
);

export const CardDescription = ({ children, ...props }: CardDescriptionProps) => (
  <Text color="previa.stone" fontSize="sm" {...props}>
    {children}
  </Text>
);

export const CardContent = ({ children, ...props }: CardContentProps) => (
  <Box p={4} {...props}>
    {children}
  </Box>
);
