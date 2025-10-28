/**
 * ContactInfo Component
 * Story: 8.1 Public Feedback Portal - Task 5
 *
 * Step 3 of feedback wizard - Optional contact information.
 */

import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Checkbox,
  VStack,
  Image,
  Text,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const MotionBox = motion(Box)

interface ContactInfoProps {
  data: {
    user_name?: string
    user_email?: string
    wants_updates?: boolean
  }
  onChange: (data: any) => void
}

/**
 * ContactInfo - Step 3 of feedback wizard
 *
 * Optional contact information collection:
 * - Name (optional, max 50 chars)
 * - Email (optional, validated format)
 * - Consent checkbox for updates
 * - Auto-fill for authenticated users
 *
 * Features:
 * - Email format validation
 * - Pre-fill email for logged-in users
 * - Contextual illustration (docs/3.png)
 * - All fields optional
 */
export const ContactInfo: React.FC<ContactInfoProps> = ({ data, onChange }) => {
  const { session, user } = useAuth()
  const [emailError, setEmailError] = useState<string>()
  const [isRegisteredUser, setIsRegisteredUser] = useState(false)

  useEffect(() => {
    // Auto-fill email if user is logged in
    if (session?.user && !data.user_email) {
      onChange({
        user_email: session.user.email,
        user_name: user?.user_metadata?.full_name || '',
      })
      setIsRegisteredUser(true)
    }
  }, [session, user])

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError(undefined)
      return true
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)

    if (!isValid) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError(undefined)
    }

    return isValid
  }

  const handleFieldChange = (field: string, value: any) => {
    onChange({ [field]: value })

    if (field === 'user_email') {
      validateEmail(value)
    }
  }

  const handleRegisteredUserToggle = (checked: boolean) => {
    setIsRegisteredUser(checked)

    if (checked && session?.user) {
      onChange({
        user_email: session.user.email,
        user_name: user?.user_metadata?.full_name || data.user_name || '',
      })
    } else if (!checked) {
      onChange({
        user_email: '',
        user_name: data.user_name || '',
      })
    }
  }

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
          src="/illustrations/3.png"
          alt="Confident user with financial tools"
          maxH="180px"
          mx="auto"
          borderRadius="lg"
          objectFit="contain"
        />
      </MotionBox>

      {/* Heading */}
      <Box textAlign="center">
        <Text fontSize="xl" fontWeight="semibold" color="previa.charcoal" mb={2}>
          How can we reach you? (Optional)
        </Text>
        <Text fontSize="sm" color="previa.stone">
          Provide your contact details if you'd like updates on your feedback
        </Text>
      </Box>

      {/* Registered User Checkbox (only show if logged in) */}
      {session?.user && (
        <Checkbox
          isChecked={isRegisteredUser}
          onChange={(e) => handleRegisteredUserToggle(e.target.checked)}
          colorScheme="purple"
        >
          <Text fontSize="sm">I'm a registered Previa user</Text>
        </Checkbox>
      )}

      {/* Name Input */}
      <FormControl>
        <FormLabel color="previa.charcoal">Name</FormLabel>
        <Input
          value={data.user_name || ''}
          onChange={(e) => handleFieldChange('user_name', e.target.value)}
          placeholder="Your name"
          maxLength={50}
          bg="white"
          borderColor="previa.stone"
          _hover={{ borderColor: 'previa.darkStone' }}
          _focus={{
            borderColor: 'purple.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
          }}
        />
        <FormHelperText>Optional</FormHelperText>
      </FormControl>

      {/* Email Input */}
      <FormControl isInvalid={!!emailError}>
        <FormLabel color="previa.charcoal">Email</FormLabel>
        <Input
          type="email"
          value={data.user_email || ''}
          onChange={(e) => handleFieldChange('user_email', e.target.value)}
          placeholder="your.email@example.com"
          isReadOnly={isRegisteredUser && !!session?.user}
          bg={isRegisteredUser && !!session?.user ? 'gray.100' : 'white'}
          borderColor="previa.stone"
          _hover={{ borderColor: 'previa.darkStone' }}
          _focus={{
            borderColor: 'purple.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
          }}
        />
        {emailError ? (
          <FormErrorMessage>{emailError}</FormErrorMessage>
        ) : (
          <FormHelperText>
            We'll use this to send you updates about your feedback
          </FormHelperText>
        )}
      </FormControl>

      {/* Updates Consent Checkbox */}
      {data.user_email && (
        <Checkbox
          isChecked={data.wants_updates || false}
          onChange={(e) => handleFieldChange('wants_updates', e.target.checked)}
          colorScheme="purple"
        >
          <Text fontSize="sm">
            I'd like to receive updates on this report
          </Text>
        </Checkbox>
      )}

      {/* Privacy Note */}
      <Box
        bg="purple.50"
        borderLeft="3px solid"
        borderColor="purple.500"
        p={3}
        borderRadius="md"
      >
        <Text fontSize="xs" color="previa.charcoal">
          <strong>Privacy:</strong> Your contact information is optional and will only be
          used to follow up on your feedback. We will never share your information with
          third parties.
        </Text>
      </Box>
    </VStack>
  )
}
