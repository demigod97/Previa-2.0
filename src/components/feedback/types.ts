/**
 * Feedback Component Types
 * Story: 8.1 Public Feedback Portal
 */

/** Feedback submission types */
export type FeedbackType = 'bug' | 'feature' | 'error' | 'improvement' | 'other'

/** Severity levels for bugs and errors */
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

/** Priority levels for features and improvements */
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent'

/** Feedback status (backend) */
export type FeedbackStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'wont_fix'

/** Feedback type option for selection cards */
export interface FeedbackTypeOption {
  value: FeedbackType
  label: string
  description: string
  icon: string
  color: string
}

/** Browser information captured automatically */
export interface BrowserInfo {
  userAgent?: string
  screenWidth?: number
  screenHeight?: number
  viewportWidth?: number
  viewportHeight?: number
  language?: string
  timezone?: string
  platform?: string
  cookieEnabled?: boolean
}

/** Form data structure used during wizard */
export interface FeedbackFormData {
  // Step 1
  feedback_type?: FeedbackType
  // Step 2
  title?: string
  description?: string
  severity?: SeverityLevel
  priority?: PriorityLevel
  steps_to_reproduce?: string
  expected_behavior?: string
  actual_behavior?: string
  use_case?: string
  screenshot?: File // File object before upload
  // Step 3
  user_name?: string
  user_email?: string
  wants_updates?: boolean
}

/** Complete feedback submission payload */
export interface FeedbackSubmission {
  feedback_type: FeedbackType
  title: string
  description: string
  severity?: SeverityLevel
  priority?: PriorityLevel
  steps_to_reproduce?: string
  expected_behavior?: string
  actual_behavior?: string
  use_case?: string
  user_name?: string
  user_email?: string
  wants_updates?: boolean
  screenshot_url?: string
  browser_info?: BrowserInfo
}

/** Feedback submission response */
export interface FeedbackSubmissionResponse {
  success: boolean
  referenceId: string
  message: string
  feedback?: {
    id: string
    type: FeedbackType
    title: string
    status: FeedbackStatus
    created_at: string
  }
}

/** Error response from submission */
export interface FeedbackErrorResponse {
  error: string
  message: string
  retryAfter?: number
}
