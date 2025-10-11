/**
 * Tier Validation Utilities - Previa Financial Intelligence Platform
 *
 * Functions for validating user tier limits and generating user-friendly messages.
 */

import type { UserTierData, TierLimitType } from '@/types/financial';

/**
 * Check if user can create a new bank account
 *
 * @param tier - User tier data
 * @param currentCount - Current number of bank accounts
 * @returns true if user can create another account
 */
export function canCreateBankAccount(
  tier: UserTierData,
  currentCount: number
): boolean {
  return currentCount < tier.accounts_limit;
}

/**
 * Check if user can upload a transaction
 *
 * @param tier - User tier data
 * @param monthlyCount - Current transaction count this month
 * @returns true if user can upload another transaction
 */
export function canUploadTransaction(
  tier: UserTierData,
  monthlyCount: number
): boolean {
  return monthlyCount < tier.transactions_monthly_limit;
}

/**
 * Check if user can upload a receipt
 *
 * @param tier - User tier data
 * @param monthlyCount - Current receipt count this month
 * @returns true if user can upload another receipt
 */
export function canUploadReceipt(
  tier: UserTierData,
  monthlyCount: number
): boolean {
  return monthlyCount < tier.receipts_monthly_limit;
}

/**
 * Get user-friendly tier limit message
 *
 * @param tier - User tier data
 * @param limitType - Type of limit to describe
 * @returns User-friendly limit message
 */
export function getTierLimitMessage(
  tier: UserTierData,
  limitType: TierLimitType
): string {
  const isPremium = tier.tier === 'premium_user';

  if (isPremium) {
    return 'Unlimited';
  }

  const limits: Record<TierLimitType, string> = {
    accounts: `${tier.accounts_limit} accounts`,
    transactions: `${tier.transactions_monthly_limit} transactions/month`,
    receipts: `${tier.receipts_monthly_limit} receipts/month`,
  };

  return limits[limitType];
}

/**
 * Get upgrade prompt message when limit is reached
 *
 * @param limitType - Type of limit that was reached
 * @returns User-friendly upgrade message
 */
export function getUpgradeMessage(limitType: TierLimitType): string {
  const messages: Record<TierLimitType, string> = {
    accounts: 'You\'ve reached your bank account limit. Upgrade to Premium for unlimited accounts.',
    transactions: 'You\'ve reached your monthly transaction limit. Upgrade to Premium for unlimited transactions.',
    receipts: 'You\'ve reached your monthly receipt limit. Upgrade to Premium for unlimited receipts.',
  };

  return messages[limitType];
}

/**
 * Check if user is at or near limit (90% threshold)
 *
 * @param current - Current usage count
 * @param limit - Tier limit
 * @returns true if user is at 90% or more of limit
 */
export function isNearLimit(current: number, limit: number): boolean {
  if (limit >= 999999) return false; // Unlimited
  return current >= limit * 0.9;
}

/**
 * Calculate usage percentage
 *
 * @param current - Current usage count
 * @param limit - Tier limit
 * @returns Usage percentage (0-100)
 */
export function calculateUsagePercentage(current: number, limit: number): number {
  if (limit >= 999999) return 0; // Unlimited
  if (limit === 0) return 0;
  return Math.min(Math.round((current / limit) * 100), 100);
}

/**
 * Get tier display name
 *
 * @param tier - User tier type
 * @returns Display name for tier
 */
export function getTierDisplayName(tier: 'user' | 'premium_user'): string {
  return tier === 'premium_user' ? 'Premium' : 'Free';
}
