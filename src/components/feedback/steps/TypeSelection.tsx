/**
 * TypeSelection Component
 * Story: 8.1 Public Feedback Portal - Task 3
 *
 * Step 1 of feedback wizard - Select feedback type.
 * Features: Radio cards with icons, hover animations, stagger entrance.
 */

import { Box, SimpleGrid, Text, VStack, Image, useRadioGroup } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Bug, Sparkles, AlertTriangle, Lightbulb, FileText } from 'lucide-react'
import { FeedbackType, FeedbackTypeOption } from '../types'
import { FeedbackTypeCard } from './FeedbackTypeCard'

const MotionBox = motion(Box)

interface TypeSelectionProps {
  value?: FeedbackType
  onChange: (type: FeedbackType) => void
}

const feedbackTypeOptions: FeedbackTypeOption[] = [
  {
    value: 'bug',
    label: 'Bug Report',
    description: 'Something isn\'t working as expected',
    icon: 'bug',
    color: 'red.500',
  },
  {
    value: 'feature',
    label: 'Feature Request',
    description: 'Suggest a new feature or improvement',
    icon: 'sparkles',
    color: 'purple.500',
  },
  {
    value: 'error',
    label: 'Error Report',
    description: 'Application crashed or showed an error',
    icon: 'alert',
    color: 'orange.500',
  },
  {
    value: 'improvement',
    label: 'Improvement Suggestion',
    description: 'How we can make things better',
    icon: 'lightbulb',
    color: 'blue.500',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'General feedback or questions',
    icon: 'file',
    color: 'gray.500',
  },
]

const iconMap = {
  bug: Bug,
  sparkles: Sparkles,
  alert: AlertTriangle,
  lightbulb: Lightbulb,
  file: FileText,
}

/**
 * TypeSelection - Step 1 of feedback wizard
 *
 * Displays 5 feedback type options as selectable cards with:
 * - Icons and descriptions
 * - Hover scale animations
 * - Stagger entrance animations (150ms delay)
 * - Contextual illustration (docs/1.png)
 *
 * @example
 * ```tsx
 * <TypeSelection
 *   value={feedbackType}
 *   onChange={(type) => setFeedbackType(type)}
 * />
 * ```
 */
export const TypeSelection: React.FC<TypeSelectionProps> = ({ value, onChange }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'feedback-type',
    value,
    onChange,
  })

  const group = getRootProps()

  return (
    <VStack spacing={6} align="stretch">
      {/* Contextual Illustration */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        textAlign="center"
      >
        <Image
          src="/illustrations/1.png"
          alt="User analyzing at computer"
          maxH="200px"
          mx="auto"
          borderRadius="lg"
          objectFit="contain"
        />
      </MotionBox>

      {/* Heading */}
      <Box textAlign="center">
        <Text fontSize="xl" fontWeight="semibold" color="previa.charcoal" mb={2}>
          What type of feedback do you have?
        </Text>
        <Text fontSize="sm" color="previa.stone">
          Select the category that best describes your feedback
        </Text>
      </Box>

      {/* Feedback Type Cards */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} {...group}>
        {feedbackTypeOptions.map((option, index) => {
          const radio = getRadioProps({ value: option.value })
          const IconComponent = iconMap[option.icon as keyof typeof iconMap]

          return (
            <MotionBox
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.15, // Stagger by 150ms
              }}
            >
              <FeedbackTypeCard
                {...radio}
                icon={IconComponent}
                label={option.label}
                description={option.description}
                iconColor={option.color}
                isSelected={value === option.value}
              />
            </MotionBox>
          )
        })}
      </SimpleGrid>
    </VStack>
  )
}
