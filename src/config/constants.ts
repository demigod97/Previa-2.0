/**
 * Previa Application Constants
 * 
 * Central configuration for business rules, thresholds, and limits.
 * These are NOT environment variables - they are application-level constants
 * that define the behavior of the financial intelligence platform.
 * 
 * Last Updated: 2025-01-09
 */

// ============================================================================
// OCR CONFIDENCE THRESHOLDS
// ============================================================================

/**
 * Minimum confidence required for OCR extraction of bank account numbers
 * 
 * Decision: 90% threshold balances automation with accuracy
 * Below this threshold: Flag for manual review or re-upload
 * 
 * @see docs/architecture/TECHNICAL-DECISIONS.md - Decision #2
 */
export const OCR_ACCOUNT_NUMBER_THRESHOLD = 0.90;

/**
 * Minimum confidence required for OCR extraction of receipt data
 * (merchant name, amount, date, tax)
 * 
 * Decision: 90% threshold ensures financial data accuracy
 * Below this threshold: Require user confirmation before use
 * 
 * @see docs/architecture/TECHNICAL-DECISIONS.md - Decision #2
 */
export const OCR_RECEIPT_DATA_THRESHOLD = 0.90;

// ============================================================================
// RECONCILIATION THRESHOLDS
// ============================================================================

/**
 * Minimum confidence required for automatic approval of transaction-receipt matches
 * 
 * Decision: 95% threshold prevents false positives in automated matching
 * Between 70-95%: Show as suggested match requiring user approval
 * Below 70%: Don't suggest as a match
 * 
 * @see docs/architecture/TECHNICAL-DECISIONS.md - Decision #2
 */
export const RECONCILIATION_AUTO_APPROVE_THRESHOLD = 0.95;

/**
 * Minimum confidence to suggest a match (show in UI for user review)
 */
export const RECONCILIATION_SUGGEST_THRESHOLD = 0.70;

// ============================================================================
// TIER LIMITS (FREEMIUM MODEL)
// ============================================================================

/**
 * Usage limits for free and premium tiers
 * 
 * Decision: Conservative free tier limits encourage premium conversions
 * while providing sufficient value for basic users
 * 
 * @see docs/architecture/TECHNICAL-DECISIONS.md - Decision #3
 * @see supabase/migrations/20250109000001_create_financial_schema.sql
 */
export const TIER_LIMITS = {
  FREE: {
    /** Maximum bank accounts for free users */
    accounts: 3,
    /** Maximum transactions per month for free users */
    transactionsPerMonth: 50,
    /** Maximum receipts per month for free users */
    receiptsPerMonth: 10,
  },
  PREMIUM: {
    /** Unlimited bank accounts for premium users */
    accounts: 999999, // Effectively unlimited
    /** Unlimited transactions per month for premium users */
    transactionsPerMonth: 999999,
    /** Unlimited receipts per month for premium users */
    receiptsPerMonth: 999999,
  },
} as const;

// ============================================================================
// PROCESSING CONFIGURATION
// ============================================================================

/**
 * Maximum file size for document uploads (in bytes)
 * 50MB limit for bank statements and receipts
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Supported file formats for bank statement uploads
 */
export const SUPPORTED_STATEMENT_FORMATS = ['pdf', 'csv'] as const;

/**
 * Supported file formats for receipt uploads
 */
export const SUPPORTED_RECEIPT_FORMATS = ['pdf', 'jpg', 'jpeg', 'png'] as const;

/**
 * Maximum time to wait for document processing (in seconds)
 * After this, show "processing" status and poll for completion
 */
export const PROCESSING_TIMEOUT = 30;

// ============================================================================
// RECONCILIATION MATCHING RULES
// ============================================================================

/**
 * Maximum days difference for date-based transaction matching
 * Example: Receipt date 2024-01-15 can match transaction from 2024-01-12 to 2024-01-18
 */
export const MAX_DATE_DIFFERENCE_DAYS = 3;

/**
 * Maximum amount difference for transaction matching (in currency units)
 * Example: Receipt for $45.50 can match transaction of $45.00 to $46.00
 */
export const MAX_AMOUNT_DIFFERENCE = 0.50;

/**
 * Weight factors for reconciliation matching algorithm
 * These determine how much each factor contributes to the confidence score
 */
export const RECONCILIATION_WEIGHTS = {
  dateMatch: 0.40,    // 40% weight for date proximity
  amountMatch: 0.40,  // 40% weight for amount similarity
  merchantMatch: 0.20, // 20% weight for merchant name fuzzy matching
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

/**
 * Number of transactions to display per page in transaction table
 */
export const TRANSACTIONS_PER_PAGE = 25;

/**
 * Number of receipts to display per page in document library
 */
export const RECEIPTS_PER_PAGE = 20;

/**
 * Number of reconciliation matches to display per page
 */
export const MATCHES_PER_PAGE = 15;

/**
 * Default date range for dashboard queries (in days)
 * Dashboard shows last 30 days by default
 */
export const DEFAULT_DATE_RANGE_DAYS = 30;

// ============================================================================
// GAMIFICATION CONFIGURATION
// ============================================================================

/**
 * Points awarded for completing financial literacy tasks
 */
export const GAMIFICATION_POINTS = {
  uploadFirstStatement: 100,
  uploadFirstReceipt: 50,
  approveFirstMatch: 50,
  reconcileAllTransactions: 200,
  exportData: 100,
  completeOnboarding: 150,
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * User-facing error messages for common scenarios
 */
export const ERROR_MESSAGES = {
  // Upload errors
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit. Please compress or split the file.`,
  UNSUPPORTED_FORMAT: 'Unsupported file format. Please use PDF, CSV, JPG, or PNG.',
  
  // OCR errors
  LOW_CONFIDENCE: 'Unable to extract data with sufficient confidence. Please try a clearer image or enter manually.',
  PROCESSING_TIMEOUT: 'Document processing is taking longer than expected. You\'ll be notified when it\'s ready.',
  
  // Tier limit errors
  ACCOUNT_LIMIT_REACHED: `You've reached the maximum of ${TIER_LIMITS.FREE.accounts} bank accounts for free tier. Upgrade to Premium for unlimited accounts.`,
  TRANSACTION_LIMIT_REACHED: `You've reached the monthly limit of ${TIER_LIMITS.FREE.transactionsPerMonth} transactions. Upgrade to Premium for unlimited transactions.`,
  RECEIPT_LIMIT_REACHED: `You've reached the monthly limit of ${TIER_LIMITS.FREE.receiptsPerMonth} receipts. Upgrade to Premium for unlimited receipts.`,
  
  // Reconciliation errors
  NO_MATCHES_FOUND: 'No matching receipts found for this transaction. Try uploading the receipt or matching manually.',
  ALREADY_MATCHED: 'This transaction is already matched to a receipt.',
  
  // General errors
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  SERVER_ERROR: 'An unexpected error occurred. Our team has been notified.',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Type-safe tier name
 */
export type TierName = 'FREE' | 'PREMIUM';

/**
 * Type-safe processing status
 */
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Type-safe reconciliation status
 */
export type ReconciliationStatus = 'unreconciled' | 'matched' | 'approved' | 'rejected';

/**
 * Type-safe match status
 */
export type MatchStatus = 'suggested' | 'approved' | 'rejected';

