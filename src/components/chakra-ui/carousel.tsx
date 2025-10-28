// Carousel component placeholder
// TODO: Integrate with a carousel library compatible with Chakra UI
import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Carousel = ({ children }: { children: ReactNode }) => (
  <Box>{children}</Box>
);

export const CarouselContent = ({ children }: { children: ReactNode }) => (
  <Flex>{children}</Flex>
);

export const CarouselItem = ({ children }: { children: ReactNode }) => (
  <Box>{children}</Box>
);

export const CarouselPrevious = () => <button>Previous</button>;
export const CarouselNext = () => <button>Next</button>;
