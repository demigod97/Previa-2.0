import React from 'react';
import { Box, Flex, HStack, VStack, Skeleton } from '@chakra-ui/react';

interface BankAccountCardSkeletonProps {
  count?: number;
}

/**
 * Content-aware skeleton for bank account cards
 * Matches the structure of actual account items:
 * - Icon + Institution name (left, top row)
 * - Account name (left, second row)
 * - Balance (right, aligned top)
 * - Account number (bottom, full width)
 */
export const BankAccountCardSkeleton: React.FC<BankAccountCardSkeletonProps> = ({ count = 2 }) => {
  return (
    <VStack spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          w="full"
          p={4}
          minH="88px"
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="previa.sand"
        >
          {/* Top section - Institution + Balance */}
          <Flex align="start" justify="space-between" mb={2}>
            {/* Left - Icon + Institution + Account name */}
            <VStack align="start" spacing={1} flex={1} minW={0}>
              <HStack spacing={2}>
                <Skeleton h={4} w={4} borderRadius="sm" />
                <Skeleton h={4} w="50%" borderRadius="md" />
              </HStack>
              <Skeleton h={3} w="40%" ml={6} borderRadius="md" />
            </VStack>

            {/* Right - Balance */}
            <Skeleton h={6} w={24} ml={4} borderRadius="md" />
          </Flex>

          {/* Bottom - Account number */}
          <Skeleton h={2.5} w={32} borderRadius="md" />
        </Box>
      ))}
    </VStack>
  );
};
