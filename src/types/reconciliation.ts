/**
 * Reconciliation Types - Previa Financial Intelligence Platform
 * 
 * Type definitions for reconciliation matching between transactions and receipts
 */

import type { Transaction, Receipt } from './financial';

/**
 * Match confidence levels based on AI scoring
 */
export type MatchConfidence = 'high' | 'medium' | 'low';

/**
 * Reconciliation match status
 */
export type MatchStatus = 'suggested' | 'approved' | 'rejected';

/**
 * AI-generated match suggestion between transaction and receipt
 */
export interface MatchSuggestion {
  id: string;
  transaction_id: string;
  receipt_id: string;
  confidence_score: number; // 0-100
  confidence_level: MatchConfidence;
  match_reasons: string[];
  user_id: string;
  created_at: string;
}

/**
 * Reconciliation match record (approved match)
 */
export interface ReconciliationMatch {
  id: string;
  user_id: string | null;
  transaction_id: string | null;
  receipt_id: string | null;
  confidence: number;
  status: string | null;
  reviewed_at: string | null;
  reviewer_id: string | null;
  created_at: string | null;
}

/**
 * Extended match with full transaction and receipt data
 */
export interface MatchWithDetails extends ReconciliationMatch {
  transaction: Transaction;
  receipt: Receipt;
}

/**
 * Filters for reconciliation view
 */
export interface ReconciliationFilters {
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  category?: string;
  confidenceLevel?: MatchConfidence;
}

