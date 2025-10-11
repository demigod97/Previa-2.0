/**
 * Tier Validation Unit Tests
 *
 * Tests for tier limit validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  canCreateBankAccount,
  canUploadTransaction,
  canUploadReceipt,
  getTierLimitMessage,
  getUpgradeMessage,
  isNearLimit,
  calculateUsagePercentage,
  getTierDisplayName,
} from '@/lib/tierValidation';
import type { UserTierData } from '@/types/financial';

describe('tierValidation', () => {
  const mockFreeTier: UserTierData = {
    id: 'tier-1',
    user_id: 'user-1',
    tier: 'user',
    accounts_limit: 3,
    transactions_monthly_limit: 50,
    receipts_monthly_limit: 10,
    upgraded_at: null,
    expires_at: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };

  const mockPremiumTier: UserTierData = {
    id: 'tier-2',
    user_id: 'user-2',
    tier: 'premium_user',
    accounts_limit: 999999,
    transactions_monthly_limit: 999999,
    receipts_monthly_limit: 999999,
    upgraded_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };

  describe('canCreateBankAccount', () => {
    it('should return true when under limit', () => {
      expect(canCreateBankAccount(mockFreeTier, 2)).toBe(true);
    });

    it('should return false when at limit', () => {
      expect(canCreateBankAccount(mockFreeTier, 3)).toBe(false);
    });

    it('should return false when over limit', () => {
      expect(canCreateBankAccount(mockFreeTier, 4)).toBe(false);
    });

    it('should return true for premium user with many accounts', () => {
      expect(canCreateBankAccount(mockPremiumTier, 100)).toBe(true);
    });
  });

  describe('canUploadTransaction', () => {
    it('should return true when under limit', () => {
      expect(canUploadTransaction(mockFreeTier, 25)).toBe(true);
    });

    it('should return false when at limit', () => {
      expect(canUploadTransaction(mockFreeTier, 50)).toBe(false);
    });

    it('should return false when over limit', () => {
      expect(canUploadTransaction(mockFreeTier, 51)).toBe(false);
    });

    it('should return true for premium user', () => {
      expect(canUploadTransaction(mockPremiumTier, 1000)).toBe(true);
    });
  });

  describe('canUploadReceipt', () => {
    it('should return true when under limit', () => {
      expect(canUploadReceipt(mockFreeTier, 5)).toBe(true);
    });

    it('should return false when at limit', () => {
      expect(canUploadReceipt(mockFreeTier, 10)).toBe(false);
    });

    it('should return false when over limit', () => {
      expect(canUploadReceipt(mockFreeTier, 11)).toBe(false);
    });

    it('should return true for premium user', () => {
      expect(canUploadReceipt(mockPremiumTier, 100)).toBe(true);
    });
  });

  describe('getTierLimitMessage', () => {
    it('should return correct message for free tier accounts', () => {
      expect(getTierLimitMessage(mockFreeTier, 'accounts')).toBe('3 accounts');
    });

    it('should return correct message for free tier transactions', () => {
      expect(getTierLimitMessage(mockFreeTier, 'transactions')).toBe('50 transactions/month');
    });

    it('should return correct message for free tier receipts', () => {
      expect(getTierLimitMessage(mockFreeTier, 'receipts')).toBe('10 receipts/month');
    });

    it('should return "Unlimited" for premium tier', () => {
      expect(getTierLimitMessage(mockPremiumTier, 'accounts')).toBe('Unlimited');
      expect(getTierLimitMessage(mockPremiumTier, 'transactions')).toBe('Unlimited');
      expect(getTierLimitMessage(mockPremiumTier, 'receipts')).toBe('Unlimited');
    });
  });

  describe('getUpgradeMessage', () => {
    it('should return correct message for accounts limit', () => {
      const message = getUpgradeMessage('accounts');
      expect(message).toContain('bank account limit');
      expect(message).toContain('Premium');
    });

    it('should return correct message for transactions limit', () => {
      const message = getUpgradeMessage('transactions');
      expect(message).toContain('transaction limit');
      expect(message).toContain('Premium');
    });

    it('should return correct message for receipts limit', () => {
      const message = getUpgradeMessage('receipts');
      expect(message).toContain('receipt limit');
      expect(message).toContain('Premium');
    });
  });

  describe('isNearLimit', () => {
    it('should return false when under 90% of limit', () => {
      expect(isNearLimit(2, 10)).toBe(false);
      expect(isNearLimit(8, 10)).toBe(false);
    });

    it('should return true when at 90% of limit', () => {
      expect(isNearLimit(9, 10)).toBe(true);
    });

    it('should return true when over 90% of limit', () => {
      expect(isNearLimit(10, 10)).toBe(true);
    });

    it('should return false for unlimited (premium)', () => {
      expect(isNearLimit(1000, 999999)).toBe(false);
    });
  });

  describe('calculateUsagePercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculateUsagePercentage(5, 10)).toBe(50);
      expect(calculateUsagePercentage(7, 10)).toBe(70);
      expect(calculateUsagePercentage(10, 10)).toBe(100);
    });

    it('should cap at 100%', () => {
      expect(calculateUsagePercentage(15, 10)).toBe(100);
    });

    it('should return 0 for unlimited', () => {
      expect(calculateUsagePercentage(1000, 999999)).toBe(0);
    });

    it('should return 0 when limit is 0', () => {
      expect(calculateUsagePercentage(5, 0)).toBe(0);
    });
  });

  describe('getTierDisplayName', () => {
    it('should return "Free" for user tier', () => {
      expect(getTierDisplayName('user')).toBe('Free');
    });

    it('should return "Premium" for premium_user tier', () => {
      expect(getTierDisplayName('premium_user')).toBe('Premium');
    });
  });
});
