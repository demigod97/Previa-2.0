/**
 * Financial Domain Types - Previa Financial Intelligence Platform
 *
 * Type definitions for user tiers, financial transactions, and limits.
 */

/**
 * User tier types - defines freemium tiers
 */
export type UserTier = 'user' | 'premium_user';

/**
 * User tier data from database
 */
export interface UserTierData {
  id: string;
  user_id: string;
  tier: UserTier;
  accounts_limit: number;
  transactions_monthly_limit: number;
  receipts_monthly_limit: number;
  upgraded_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Tier limits interface for UI components
 */
export interface TierLimits {
  accounts: number;
  transactionsMonthly: number;
  receiptsMonthly: number;
}

/**
 * Tier limit type for validation functions
 */
export type TierLimitType = 'accounts' | 'transactions' | 'receipts';

/**
 * Financial transaction status
 */
export type ReconciliationStatus = 'unreconciled' | 'matched' | 'approved' | 'rejected';

/**
 * Processing status for documents
 */
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Currency amount in cents (e.g., 1050 = $10.50)
 */
export type CurrencyAmount = number;

/**
 * Currency string for display (e.g., "$10.50")
 */
export type CurrencyString = string;

/**
 * Transaction type based on amount sign
 */
export type TransactionType = 'income' | 'expense';

/**
 * Transaction interface for widgets and charts
 * Extended from database Row type with computed type field
 */
export interface Transaction {
  id: string;
  user_id: string | null;
  bank_statement_id: string | null;
  transaction_date: string;
  description: string | null;
  amount: number;
  category: string | null;
  status: string | null;
  created_at: string | null;
  // Computed field
  type: TransactionType;
  date: string; // Alias for transaction_date for widget compatibility
}

/**
 * Receipt interface for document management
 */
export interface Receipt {
  id: string;
  user_id: string | null;
  file_path: string;
  receipt_date: string | null;
  merchant: string | null;
  amount: number | null;
  tax: number | null;
  ocr_data: any | null;
  confidence_score: number | null;
  processing_status: string | null;
  file_size: number | null;
  created_at: string | null;
}