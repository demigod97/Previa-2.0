/**
 * FeedbackTypeCard Component
 * Story: 8.1 Public Feedback Portal - Task 3
 *
 * Custom radio card for feedback type selection.
 * Features hover scale animation and selected state styling.
 */

import { Box, Flex, Text, useRadio, UseRadioProps } from '@chakra-ui/react'
import { LucideIcon } from 'lucide-react'

interface FeedbackTypeCardProps extends UseRadioProps {
  icon: LucideIcon
  label: string
  description: string
  iconColor: string
  isSelected?: boolean
}

/**
 * FeedbackTypeCard - Custom radio card with icon and hover effects
 *
 * Features:
 * - Hover scale animation (1.02x)
 * - Selected state with border highlight
 * - Icon with custom color
 * - Accessible radio input
 *
 * @example
 * ```tsx
 * <FeedbackTypeCard
 *   icon={Bug}
 *   label="Bug Report"
 *   description="Something isn't working"
 *   iconColor="red.500"
 *   isSelected={selected}
 *   {...radioProps}
 * />
 * ```
 */
export const FeedbackTypeCard: React.FC<FeedbackTypeCardProps> = ({
  icon: Icon,
  label,
  description,
  iconColor,
  isSelected,
  ...radioProps
}) => {
  const { getInputProps, getRadioProps } = useRadio(radioProps)
  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as="label" cursor="pointer">
      <input {...input} />
      <Box
        {...checkbox}
        bg="white"
        border="2px solid"
        borderColor={isSelected ? 'purple.500' : 'previa.stone'}
        borderRadius="lg"
        p={4}
        transition="all 0.2s"
        _hover={{
          transform: 'scale(1.02)',
          borderColor: isSelected ? 'purple.600' : 'previa.darkStone',
          shadow: 'md',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        boxShadow={isSelected ? 'lg' : 'sm'}
      >
        <Flex gap={3} align="start">
          {/* Icon */}
          <Box
            p={2}
            bg={isSelected ? `${iconColor.split('.')[0]}.50` : 'gray.50'}
            borderRadius="md"
            transition="all 0.2s"
          >
            <Icon
              size={24}
              color={isSelected ? iconColor : 'currentColor'}
              strokeWidth={2}
            />
          </Box>

          {/* Label and Description */}
          <Box flex="1">
            <Text
              fontSize="md"
              fontWeight={isSelected ? 'semibold' : 'medium'}
              color="previa.charcoal"
              mb={1}
            >
              {label}
            </Text>
            <Text fontSize="sm" color="previa.stone">
              {description}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
