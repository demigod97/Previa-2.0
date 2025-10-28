/**
 * DetailsForm Component
 * Story: 8.1 Public Feedback Portal - Task 4
 *
 * Step 2 of feedback wizard - Detailed feedback form.
 * Features conditional fields based on feedback type.
 */

import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  VStack,
  Image,
  Text,
  SimpleGrid,
  HStack,
  useRadioGroup,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FeedbackType, SeverityLevel, PriorityLevel } from '../types'
import { ScreenshotUpload } from '../ScreenshotUpload'
import { SeverityCard } from './SeverityCard'

const MotionBox = motion(Box)

interface DetailsFormProps {
  feedbackType: FeedbackType
  data: {
    title?: string
    description?: string
    severity?: SeverityLevel
    priority?: PriorityLevel
    steps_to_reproduce?: string
    expected_behavior?: string
    actual_behavior?: string
    use_case?: string
    screenshot?: File
  }
  onChange: (data: any) => void
}

const severityOptions: { value: SeverityLevel; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'green.500' },
  { value: 'medium', label: 'Medium', color: 'yellow.500' },
  { value: 'high', label: 'High', color: 'orange.500' },
  { value: 'critical', label: 'Critical', color: 'red.500' },
]

const priorityOptions: { value: PriorityLevel; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'gray.500' },
  { value: 'medium', label: 'Medium', color: 'blue.500' },
  { value: 'high', label: 'High', color: 'purple.500' },
  { value: 'urgent', label: 'Urgent', color: 'red.500' },
]

/**
 * DetailsForm - Step 2 of feedback wizard
 *
 * Conditional fields based on feedback type:
 * - All types: Title, Description, Screenshot
 * - Bug/Error: Steps to reproduce, Expected/Actual behavior, Severity
 * - Feature: Use case, Priority
 * - Improvement: Priority
 *
 * Features:
 * - Real-time character counters
 * - Validation error messages
 * - Contextual illustration (docs/2.png)
 * - Screenshot upload with drag-drop
 */
export const DetailsForm: React.FC<DetailsFormProps> = ({
  feedbackType,
  data,
  onChange,
}) => {
  const [titleLength, setTitleLength] = useState(data.title?.length || 0)
  const [descLength, setDescLength] = useState(data.description?.length || 0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isBugOrError = feedbackType === 'bug' || feedbackType === 'error'
  const showPriority = feedbackType === 'feature' || feedbackType === 'improvement'

  useEffect(() => {
    // Validate on data change
    const newErrors: Record<string, string> = {}

    if (data.title && data.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less'
    }

    if (data.description && data.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less'
    }

    setErrors(newErrors)
  }, [data])

  const handleFieldChange = (field: string, value: any) => {
    onChange({ [field]: value })

    // Update character counters
    if (field === 'title') setTitleLength(value.length)
    if (field === 'description') setDescLength(value.length)
  }

  const { getRootProps: getSeverityRootProps, getRadioProps: getSeverityRadioProps } =
    useRadioGroup({
      name: 'severity',
      value: data.severity,
      onChange: (value) => handleFieldChange('severity', value),
    })

  const { getRootProps: getPriorityRootProps, getRadioProps: getPriorityRadioProps } =
    useRadioGroup({
      name: 'priority',
      value: data.priority,
      onChange: (value) => handleFieldChange('priority', value),
    })

  const severityGroup = getSeverityRootProps()
  const priorityGroup = getPriorityRootProps()

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
          src="/illustrations/2.png"
          alt="Stressed user with problems"
          maxH="180px"
          mx="auto"
          borderRadius="lg"
          objectFit="contain"
        />
      </MotionBox>

      {/* Heading */}
      <Box textAlign="center">
        <Text fontSize="xl" fontWeight="semibold" color="previa.charcoal" mb={2}>
          Tell us more about your {feedbackType}
        </Text>
        <Text fontSize="sm" color="previa.stone">
          Provide details to help us understand and address your feedback
        </Text>
      </Box>

      {/* Title Input */}
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel color="previa.charcoal">Title</FormLabel>
        <Input
          value={data.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Brief summary of your feedback"
          maxLength={100}
          bg="white"
          borderColor="previa.stone"
          _hover={{ borderColor: 'previa.darkStone' }}
          _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
        />
        <HStack justify="space-between" mt={1}>
          <FormErrorMessage>{errors.title}</FormErrorMessage>
          <FormHelperText fontSize="xs" color={titleLength > 90 ? 'orange.500' : 'gray.500'}>
            {titleLength}/100
          </FormHelperText>
        </HStack>
      </FormControl>

      {/* Description Textarea */}
      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel color="previa.charcoal">Description</FormLabel>
        <Textarea
          value={data.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Detailed explanation of your feedback"
          rows={5}
          maxLength={2000}
          bg="white"
          borderColor="previa.stone"
          _hover={{ borderColor: 'previa.darkStone' }}
          _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
        />
        <HStack justify="space-between" mt={1}>
          <FormErrorMessage>{errors.description}</FormErrorMessage>
          <FormHelperText fontSize="xs" color={descLength > 1900 ? 'orange.500' : 'gray.500'}>
            {descLength}/2000
          </FormHelperText>
        </HStack>
      </FormControl>

      {/* Conditional: Bug/Error Fields */}
      {isBugOrError && (
        <>
          <FormControl>
            <FormLabel color="previa.charcoal">Steps to Reproduce</FormLabel>
            <Textarea
              value={data.steps_to_reproduce || ''}
              onChange={(e) => handleFieldChange('steps_to_reproduce', e.target.value)}
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
              rows={4}
              bg="white"
              borderColor="previa.stone"
              _hover={{ borderColor: 'previa.darkStone' }}
              _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
            />
            <FormHelperText>Help us reproduce the issue</FormHelperText>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel color="previa.charcoal">Expected Behavior</FormLabel>
              <Textarea
                value={data.expected_behavior || ''}
                onChange={(e) => handleFieldChange('expected_behavior', e.target.value)}
                placeholder="What should have happened?"
                rows={3}
                bg="white"
                borderColor="previa.stone"
                _hover={{ borderColor: 'previa.darkStone' }}
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="previa.charcoal">Actual Behavior</FormLabel>
              <Textarea
                value={data.actual_behavior || ''}
                onChange={(e) => handleFieldChange('actual_behavior', e.target.value)}
                placeholder="What actually happened?"
                rows={3}
                bg="white"
                borderColor="previa.stone"
                _hover={{ borderColor: 'previa.darkStone' }}
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
              />
            </FormControl>
          </SimpleGrid>

          {/* Severity Selector */}
          <FormControl>
            <FormLabel color="previa.charcoal">Severity</FormLabel>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} {...severityGroup}>
              {severityOptions.map((option) => {
                const radio = getSeverityRadioProps({ value: option.value })
                return (
                  <SeverityCard
                    key={option.value}
                    {...radio}
                    label={option.label}
                    color={option.color}
                    isSelected={data.severity === option.value}
                  />
                )
              })}
            </SimpleGrid>
            <FormHelperText>How critical is this issue?</FormHelperText>
          </FormControl>
        </>
      )}

      {/* Conditional: Feature Use Case */}
      {feedbackType === 'feature' && (
        <FormControl>
          <FormLabel color="previa.charcoal">Use Case</FormLabel>
          <Textarea
            value={data.use_case || ''}
            onChange={(e) => handleFieldChange('use_case', e.target.value)}
            placeholder="Describe how you would use this feature"
            rows={4}
            bg="white"
            borderColor="previa.stone"
            _hover={{ borderColor: 'previa.darkStone' }}
            _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
          />
          <FormHelperText>What problem would this solve?</FormHelperText>
        </FormControl>
      )}

      {/* Conditional: Priority Selector */}
      {showPriority && (
        <FormControl>
          <FormLabel color="previa.charcoal">Priority</FormLabel>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} {...priorityGroup}>
            {priorityOptions.map((option) => {
              const radio = getPriorityRadioProps({ value: option.value })
              return (
                <SeverityCard
                  key={option.value}
                  {...radio}
                  label={option.label}
                  color={option.color}
                  isSelected={data.priority === option.value}
                />
              )
            })}
          </SimpleGrid>
          <FormHelperText>How important is this to you?</FormHelperText>
        </FormControl>
      )}

      {/* Screenshot Upload */}
      <FormControl>
        <FormLabel color="previa.charcoal">Screenshot (Optional)</FormLabel>
        <ScreenshotUpload
          value={data.screenshot}
          onChange={(file) => handleFieldChange('screenshot', file)}
        />
        <FormHelperText>Upload an image to help illustrate your feedback (max 5MB)</FormHelperText>
      </FormControl>
    </VStack>
  )
}
