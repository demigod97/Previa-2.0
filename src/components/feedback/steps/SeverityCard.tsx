/**
 * SeverityCard Component
 * Story: 8.1 Public Feedback Portal - Task 4
 *
 * Radio card for severity/priority selection.
 */

import { Box, Text, useRadio, UseRadioProps } from '@chakra-ui/react'

interface SeverityCardProps extends UseRadioProps {
  label: string
  color: string
  isSelected?: boolean
}

/**
 * SeverityCard - Compact radio card for severity/priority levels
 *
 * Features:
 * - Color-coded by level
 * - Selected state styling
 * - Accessible radio input
 */
export const SeverityCard: React.FC<SeverityCardProps> = ({
  label,
  color,
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
        bg={isSelected ? `${color.split('.')[0]}.50` : 'white'}
        border="2px solid"
        borderColor={isSelected ? color : 'previa.stone'}
        borderRadius="md"
        py={2}
        px={3}
        textAlign="center"
        transition="all 0.2s"
        _hover={{
          transform: 'scale(1.05)',
          borderColor: isSelected ? color : 'previa.darkStone',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
      >
        <Text
          fontSize="sm"
          fontWeight={isSelected ? 'semibold' : 'medium'}
          color={isSelected ? color : 'previa.charcoal'}
        >
          {label}
        </Text>
      </Box>
    </Box>
  )
}
