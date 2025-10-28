/**
 * EmptyState - Reusable empty state component for list views
 *
 * Provides clear visual feedback when no data exists, with optional actionable CTAs.
 * Follows Previa design system with Physical Notebook Theme.
 *
 * @example
 * <EmptyState
 *   icon={<Receipt className="h-12 w-12" />}
 *   title="No Transactions Yet"
 *   description="Upload your bank statements to see your transactions here."
 *   action={
 *     <Button onClick={handleUpload}>Upload Statement</Button>
 *   }
 * />
 */

import React, { ReactNode } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  BoxProps,
} from '@chakra-ui/react';

export interface EmptyStateProps extends Omit<BoxProps, 'title'> {
  /** Icon or illustration to display (e.g., Lucide icon component) */
  icon?: ReactNode;
  /** Main heading text */
  title: string;
  /** Descriptive text explaining the empty state */
  description: string;
  /** Optional CTA button or action element */
  action?: ReactNode;
  /** Variant style - default has subtle border, outline has dashed border */
  variant?: 'default' | 'outline';
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
  ...props
}: EmptyStateProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="320px"
      py={12}
      px={6}
      bg="white"
      borderRadius="lg"
      border={variant === 'outline' ? '2px dashed' : '1px solid'}
      borderColor="previa.sand"
      {...props}
    >
      <VStack spacing={4} textAlign="center" maxW="md">
        {/* Icon/Illustration */}
        {icon && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={20}
            h={20}
            bg="previa.cream"
            borderRadius="full"
            color="previa.darkStone"
          >
            {icon}
          </Box>
        )}

        {/* Title */}
        <Heading
          as="h3"
          fontSize="xl"
          fontWeight="semibold"
          color="previa.charcoal"
        >
          {title}
        </Heading>

        {/* Description */}
        <Text
          fontSize="sm"
          color="previa.darkStone"
          lineHeight="tall"
          maxW="sm"
        >
          {description}
        </Text>

        {/* Action Button/CTA */}
        {action && (
          <Box mt={2}>
            {action}
          </Box>
        )}
      </VStack>
    </Box>
  );
};
