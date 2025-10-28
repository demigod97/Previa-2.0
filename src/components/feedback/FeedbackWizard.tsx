/**
 * FeedbackWizard Component
 * Story: 8.1 Public Feedback Portal
 *
 * Multi-step wizard orchestrator for feedback submission.
 * Manages step transitions, form state, and navigation.
 */

import { useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Progress,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeSelection } from './steps/TypeSelection'
import { DetailsForm } from './steps/DetailsForm'
import { ContactInfo } from './steps/ContactInfo'
import { ConfettiSuccess } from './ConfettiSuccess'
import { FeedbackType, FeedbackFormData } from './types'
import { useFeedbackSubmit } from './hooks/useFeedbackSubmit'

const MotionBox = motion(Box)

interface FeedbackWizardProps {
  /** Callback when wizard is complete */
  onComplete: () => void
}

/**
 * FeedbackWizard - Step orchestrator for feedback form
 *
 * Steps:
 * 1. Type Selection (bug, feature, error, improvement, other)
 * 2. Details Form (conditional fields based on type)
 * 3. Contact Info (optional name/email)
 *
 * Features:
 * - Step-by-step progression with validation
 * - Progress bar showing completion percentage
 * - Smooth animations between steps (Framer Motion)
 * - Form state persistence across steps
 * - Success confetti on submission
 */
export const FeedbackWizard: React.FC<FeedbackWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FeedbackFormData>({})
  const [referenceId, setReferenceId] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)

  const { submitFeedback, isSubmitting } = useFeedbackSubmit()

  const totalSteps = 3
  const progressValue = (currentStep / totalSteps) * 100

  // Check if current step can proceed
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.feedback_type
      case 2:
        return !!(
          formData.title &&
          formData.title.trim().length > 0 &&
          formData.description &&
          formData.description.trim().length > 0
        )
      case 3:
        return true // Step 3 is optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUpdateData = (data: Partial<FeedbackFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = () => {
    submitFeedback({
      formData,
      onSuccess: (refId) => {
        setReferenceId(refId)
        setShowSuccess(true)
      },
      onError: (error) => {
        console.error('Feedback submission error:', error)
        // Error toast is already handled by the hook
      },
    })
  }

  const handleSubmitAnother = () => {
    // Reset wizard
    setFormData({})
    setCurrentStep(1)
    setShowSuccess(false)
    setReferenceId('')
  }

  // Animation variants for step transitions
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  // Show success state
  if (showSuccess) {
    return (
      <ConfettiSuccess
        referenceId={referenceId}
        onSubmitAnother={handleSubmitAnother}
        onClose={onComplete}
      />
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Progress Bar */}
      <Box>
        <Progress
          value={progressValue}
          size="sm"
          colorScheme="green"
          bg="previa.sand"
          borderRadius="full"
          hasStripe
          isAnimated
        />
      </Box>

      {/* Step Content with Animations */}
      <Box position="relative" minH="400px">
        <AnimatePresence mode="wait" custom={currentStep}>
          <MotionBox
            key={currentStep}
            custom={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {currentStep === 1 && (
              <TypeSelection
                value={formData.feedback_type}
                onChange={(type) => handleUpdateData({ feedback_type: type })}
              />
            )}

            {currentStep === 2 && (
              <DetailsForm
                feedbackType={formData.feedback_type!}
                data={formData}
                onChange={handleUpdateData}
              />
            )}

            {currentStep === 3 && (
              <ContactInfo
                data={formData}
                onChange={handleUpdateData}
              />
            )}
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Navigation Buttons */}
      <ButtonGroup width="full" justifyContent="space-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          isDisabled={currentStep === 1}
          colorScheme="gray"
        >
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button
            colorScheme="purple"
            onClick={handleNext}
            isDisabled={!canProceed()}
          >
            Next
          </Button>
        ) : (
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit Feedback
          </Button>
        )}
      </ButtonGroup>
    </VStack>
  )
}
