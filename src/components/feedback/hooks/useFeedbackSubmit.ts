/**
 * useFeedbackSubmit Hook
 * Story: 8.1 Public Feedback Portal - Task 6
 *
 * Handles feedback submission with screenshot upload and browser info capture.
 */

import { useMutation } from '@tanstack/react-query'
import { useToast } from '@chakra-ui/react'
import { supabase } from '@/integrations/supabase/client'
import type { FeedbackFormData } from '../types'

interface SubmitFeedbackParams {
  formData: FeedbackFormData
  onSuccess?: (referenceId: string) => void
  onError?: (error: Error) => void
}

interface FeedbackSubmissionResponse {
  success: boolean
  referenceId: string
  data: any
}

/**
 * Capture browser information for debugging and context
 */
const captureBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
  }
}

/**
 * Upload screenshot to Supabase Storage
 * Returns the public URL of the uploaded file
 */
const uploadScreenshot = async (file: File): Promise<string> => {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const fileExt = file.name.split('.').pop()
  const fileName = `${timestamp}-${randomStr}.${fileExt}`
  const filePath = `screenshots/${fileName}`

  const { data, error } = await supabase.storage
    .from('feedback-screenshots')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Screenshot upload error:', error)
    throw new Error(`Failed to upload screenshot: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('feedback-screenshots')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Submit feedback to Edge Function
 */
const submitToEdgeFunction = async (
  payload: any
): Promise<FeedbackSubmissionResponse> => {
  const { data, error } = await supabase.functions.invoke('submit-feedback', {
    body: payload,
  })

  if (error) {
    console.error('Edge Function error:', error)
    throw new Error(error.message || 'Failed to submit feedback')
  }

  return data
}

/**
 * useFeedbackSubmit - Hook for submitting feedback with file upload
 *
 * Features:
 * - Uploads screenshot to Supabase Storage (if provided)
 * - Captures browser info automatically
 * - Submits to Edge Function with rate limiting
 * - Handles success/error states with toast notifications
 * - Automatic retry on network failures (3 attempts)
 *
 * @example
 * ```tsx
 * const { submitFeedback, isSubmitting } = useFeedbackSubmit()
 *
 * const handleSubmit = () => {
 *   submitFeedback({
 *     formData,
 *     onSuccess: (refId) => console.log('Success!', refId),
 *     onError: (error) => console.error('Error:', error)
 *   })
 * }
 * ```
 */
export const useFeedbackSubmit = () => {
  const toast = useToast()

  const mutation = useMutation({
    mutationFn: async ({ formData }: SubmitFeedbackParams) => {
      // Step 1: Upload screenshot if provided
      let screenshotUrl: string | undefined

      if (formData.screenshot) {
        try {
          screenshotUrl = await uploadScreenshot(formData.screenshot)
        } catch (error) {
          console.error('Screenshot upload failed:', error)
          throw new Error(
            error instanceof Error
              ? error.message
              : 'Failed to upload screenshot. Please try again.'
          )
        }
      }

      // Step 2: Capture browser info
      const browserInfo = captureBrowserInfo()

      // Step 3: Prepare payload (exclude File object, use URL instead)
      const payload = {
        feedback_type: formData.feedback_type,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        priority: formData.priority,
        steps_to_reproduce: formData.steps_to_reproduce,
        expected_behavior: formData.expected_behavior,
        actual_behavior: formData.actual_behavior,
        use_case: formData.use_case,
        user_name: formData.user_name,
        user_email: formData.user_email,
        wants_updates: formData.wants_updates || false,
        browser_info: browserInfo,
        screenshot_url: screenshotUrl,
      }

      // Step 4: Submit to Edge Function
      return await submitToEdgeFunction(payload)
    },
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onSuccess: (data, variables) => {
      // Show success toast with reference ID
      toast({
        title: 'Feedback submitted successfully!',
        description: `Thank you for your feedback. Reference ID: ${data.referenceId}`,
        status: 'success',
        duration: 8000,
        isClosable: true,
        position: 'top',
      })

      // Call optional success callback
      variables.onSuccess?.(data.referenceId)
    },
    onError: (error, variables) => {
      console.error('Feedback submission error:', error)

      // Determine error message based on error type
      let errorMessage = 'An unexpected error occurred. Please try again.'

      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          errorMessage =
            'Too many submissions. Please wait a few minutes and try again.'
        } else if (error.message.includes('screenshot')) {
          errorMessage = 'Failed to upload screenshot. Please try a smaller file.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error.message
        }
      }

      // Show error toast
      toast({
        title: 'Submission failed',
        description: errorMessage,
        status: 'error',
        duration: 8000,
        isClosable: true,
        position: 'top',
      })

      // Call optional error callback
      variables.onError?.(error instanceof Error ? error : new Error(String(error)))
    },
  })

  return {
    submitFeedback: mutation.mutate,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    referenceId: mutation.data?.referenceId,
  }
}
