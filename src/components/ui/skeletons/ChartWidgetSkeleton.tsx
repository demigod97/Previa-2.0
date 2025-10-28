import React from 'react';
import { Box, Flex, VStack, HStack, Skeleton } from '@chakra-ui/react';

interface ChartWidgetSkeletonProps {
  height?: string;
  showLegend?: boolean;
  type?: 'bar' | 'line' | 'pie';
}

/**
 * Content-aware skeleton for chart widgets
 * Matches the structure of chart cards:
 * - Header with title (top)
 * - Chart area with visual representation (middle)
 * - Optional legend (bottom)
 */
export const ChartWidgetSkeleton: React.FC<ChartWidgetSkeletonProps> = ({
  height = '400px',
  showLegend = true,
  type = 'bar'
}) => {
  return (
    <Box
      w="full"
      h={height}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="previa.sand"
      p={6}
    >
      <VStack spacing={4} align="stretch" h="full">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Skeleton h={5} w="40%" borderRadius="md" />
          <Skeleton h={4} w={20} borderRadius="md" />
        </Flex>

        {/* Chart Area */}
        <Box flex={1} position="relative">
          {type === 'bar' && (
            <HStack spacing={2} h="full" align="flex-end" justify="space-evenly">
              {[0.6, 0.8, 0.5, 0.9, 0.7, 0.4, 0.85, 0.6, 0.75, 0.55].map((height, i) => (
                <Skeleton
                  key={i}
                  flex={1}
                  h={`${height * 100}%`}
                  borderRadius="md"
                />
              ))}
            </HStack>
          )}

          {type === 'line' && (
            <Box position="relative" h="full">
              <Skeleton h="full" w="full" borderRadius="md" opacity={0.1} />
              <Skeleton
                position="absolute"
                top="20%"
                left="0"
                h="2px"
                w="full"
                borderRadius="full"
              />
              <Skeleton
                position="absolute"
                top="40%"
                left="0"
                h="2px"
                w="full"
                borderRadius="full"
              />
              <Skeleton
                position="absolute"
                top="60%"
                left="0"
                h="2px"
                w="full"
                borderRadius="full"
              />
            </Box>
          )}

          {type === 'pie' && (
            <Flex justify="center" align="center" h="full">
              <Skeleton h="200px" w="200px" borderRadius="full" />
            </Flex>
          )}
        </Box>

        {/* Legend */}
        {showLegend && (
          <HStack spacing={4} justify="center">
            {[0, 1, 2].map((i) => (
              <HStack key={i} spacing={2}>
                <Skeleton h={3} w={3} borderRadius="sm" />
                <Skeleton h={3} w={16} borderRadius="md" />
              </HStack>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};
