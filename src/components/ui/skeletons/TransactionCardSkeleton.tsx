import React from 'react';
import { Flex, Box, HStack, VStack, Skeleton } from '@chakra-ui/react';

interface TransactionCardSkeletonProps {
  count?: number;
}

/**
 * Content-aware skeleton for transaction cards
 * Matches the structure of actual transaction items:
 * - Description text (left, primary line)
 * - Category badge (left, inline with description)
 * - Date with icon (left, secondary line)
 * - Amount (right, large mono font)
 */
export const TransactionCardSkeleton: React.FC<TransactionCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <VStack spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Flex
          key={i}
          justify="space-between"
          align="center"
          p={3}
          w="full"
          minH="64px"
          bg="white"
          borderRadius="md"
          borderWidth="1px"
          borderColor="previa.sand"
        >
          {/* Left side - Description, badge, and date */}
          <Box flex={1} minW={0}>
            {/* Description + Badge row */}
            <HStack spacing={2} mb={1}>
              <Skeleton h={4} w="60%" borderRadius="md" />
              <Skeleton h={5} w={16} borderRadius="full" />
            </HStack>

            {/* Date row with icon */}
            <HStack spacing={1}>
              <Skeleton h={3} w={3} borderRadius="sm" />
              <Skeleton h={3} w={20} borderRadius="md" />
            </HStack>
          </Box>

          {/* Right side - Amount */}
          <Skeleton h={6} w={24} ml={4} borderRadius="md" />
        </Flex>
      ))}
    </VStack>
  );
};
