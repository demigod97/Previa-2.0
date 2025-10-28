/**
 * ConfettiSuccess Component
 * Story: 8.1 Public Feedback Portal - Task 7
 *
 * Success screen with confetti animation and reference ID.
 */

import { useEffect } from 'react'
import { Box, Button, ButtonGroup, Text, VStack, Icon, Code } from '@chakra-ui/react'
import { CheckCircle, RefreshCw, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionText = motion(Text)

interface ConfettiSuccessProps {
  referenceId: string
  onSubmitAnother: () => void
  onClose: () => void
}

/**
 * ConfettiSuccess - Success state with confetti animation
 *
 * Features:
 * - Confetti burst animation on mount (canvas-confetti)
 * - Prominent reference ID display with copy-friendly code block
 * - "Submit Another" and "Close" action buttons
 * - Fade-in animations for smooth UX
 * - Previa brand colors (purple + green)
 *
 * @example
 * ```tsx
 * <ConfettiSuccess
 *   referenceId="FB-20250128-ABC123"
 *   onSubmitAnother={() => resetForm()}
 *   onClose={() => closeModal()}
 * />
 * ```
 */
export const ConfettiSuccess: React.FC<ConfettiSuccessProps> = ({
  referenceId,
  onSubmitAnother,
  onClose,
}) => {
  useEffect(() => {
    // Trigger confetti animation on mount
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      // Burst from two positions for better effect
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#805AD5', '#38A169', '#F6AD55', '#FC8181', '#4299E1'], // Previa colors
      })

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#805AD5', '#38A169', '#F6AD55', '#FC8181', '#4299E1'],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <VStack spacing={8} py={12} textAlign="center">
      {/* Success Icon */}
      <MotionBox
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Box
          p={4}
          bg="green.50"
          borderRadius="full"
          border="4px solid"
          borderColor="green.500"
        >
          <Icon as={CheckCircle} boxSize={16} color="green.500" />
        </Box>
      </MotionBox>

      {/* Success Message */}
      <VStack spacing={3}>
        <MotionText
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          color="previa.charcoal"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Thank you for your feedback!
        </MotionText>

        <MotionText
          fontSize={{ base: 'md', md: 'lg' }}
          color="previa.stone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We've received your submission and will review it shortly.
        </MotionText>
      </VStack>

      {/* Reference ID - Prominent Display */}
      <MotionBox
        bg="purple.50"
        border="2px solid"
        borderColor="purple.500"
        borderRadius="lg"
        p={6}
        w="full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <VStack spacing={2}>
          <Text fontSize="sm" fontWeight="medium" color="purple.700" textTransform="uppercase">
            Reference ID
          </Text>
          <Code
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="bold"
            color="purple.700"
            bg="white"
            px={4}
            py={2}
            borderRadius="md"
            userSelect="all"
          >
            {referenceId}
          </Code>
          <Text fontSize="xs" color="purple.600">
            Save this ID for tracking your feedback
          </Text>
        </VStack>
      </MotionBox>

      {/* Information Box */}
      <MotionBox
        bg="gray.50"
        borderLeft="3px solid"
        borderColor="gray.400"
        p={4}
        borderRadius="md"
        w="full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Text fontSize="sm" color="previa.charcoal">
          <strong>What happens next?</strong>
          <br />
          Our team will review your feedback within 2-3 business days. If you provided an email
          address, we'll send you updates on the status of your report.
        </Text>
      </MotionBox>

      {/* Action Buttons */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        w="full"
      >
        <ButtonGroup
          w="full"
          justifyContent="center"
          spacing={4}
          flexDirection={{ base: 'column', sm: 'row' }}
        >
          <Button
            leftIcon={<RefreshCw size={18} />}
            onClick={onSubmitAnother}
            variant="outline"
            colorScheme="purple"
            size="lg"
            w={{ base: 'full', sm: 'auto' }}
          >
            Submit Another Report
          </Button>

          <Button
            leftIcon={<X size={18} />}
            onClick={onClose}
            colorScheme="purple"
            size="lg"
            w={{ base: 'full', sm: 'auto' }}
          >
            Close
          </Button>
        </ButtonGroup>
      </MotionBox>
    </VStack>
  )
}
