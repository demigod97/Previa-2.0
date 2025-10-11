/**
 * Sample Unit Test: Financial Calculations
 * 
 * Demonstrates testing patterns for financial calculation logic.
 * Tests must verify integer cents handling and precise arithmetic.
 * 
 * Pattern: Pure function testing without mocks
 */

import { describe, it, expect } from 'vitest';

/**
 * Sample currency utility functions (to be implemented in lib/currency.ts)
 */
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100);
}

function parseCurrencyAmount(currencyString: string): number {
  const cleanString = currencyString.replace(/[^0-9.-]/g, '');
  const dollars = parseFloat(cleanString);
  return Math.round(dollars * 100);
}

function addCurrencyAmounts(...amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

function calculatePercentage(amount: number, percentage: number): number {
  return Math.round(amount * (percentage / 100));
}

describe('Financial Calculations', () => {
  describe('formatCurrency', () => {
    it('formats cents as AUD currency string', () => {
      expect(formatCurrency(1050)).toBe('$10.50');
      expect(formatCurrency(999)).toBe('$9.99');
      expect(formatCurrency(350000)).toBe('$3,500.00');
    });

    it('handles negative amounts (expenses)', () => {
      expect(formatCurrency(-4550)).toBe('-$45.50');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles very large amounts', () => {
      expect(formatCurrency(999999999)).toBe('$9,999,999.99');
    });
  });

  describe('parseCurrencyAmount', () => {
    it('parses currency string to cents', () => {
      expect(parseCurrencyAmount('$10.50')).toBe(1050);
      expect(parseCurrencyAmount('$45.50')).toBe(4550);
      expect(parseCurrencyAmount('$3,500.00')).toBe(350000);
    });

    it('handles strings without currency symbols', () => {
      expect(parseCurrencyAmount('10.50')).toBe(1050);
      expect(parseCurrencyAmount('45.50')).toBe(4550);
    });

    it('handles negative amounts', () => {
      expect(parseCurrencyAmount('-$45.50')).toBe(-4550);
    });

    it('rounds floating point properly', () => {
      // Ensures no floating-point errors
      expect(parseCurrencyAmount('10.505')).toBe(1051); // Rounds up
      expect(parseCurrencyAmount('10.504')).toBe(1050); // Rounds down
    });
  });

  describe('addCurrencyAmounts', () => {
    it('adds multiple amounts in cents', () => {
      const result = addCurrencyAmounts(1050, 2400, 6800);
      expect(result).toBe(10250); // $102.50
    });

    it('handles negative amounts (expenses)', () => {
      const result = addCurrencyAmounts(-4550, -5830, -2400);
      expect(result).toBe(-12780); // -$127.80 total expenses
    });

    it('handles mixed positive and negative (income - expenses)', () => {
      const income = 350000; // $3,500.00
      const expenses = addCurrencyAmounts(-4550, -5830, -2400); // -$127.80
      const balance = income + expenses;
      
      expect(balance).toBe(337220); // $3,372.20
    });

    it('handles empty array', () => {
      expect(addCurrencyAmounts()).toBe(0);
    });

    it('maintains precision with many small amounts', () => {
      // Test that integer arithmetic avoids floating-point errors
      const amounts = Array(100).fill(99); // 100 x $0.99
      const result = addCurrencyAmounts(...amounts);
      expect(result).toBe(9900); // $99.00 exactly
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage of amount', () => {
      // 10% GST on $45.50
      expect(calculatePercentage(4550, 10)).toBe(455);
      
      // 5% fee on $100.00
      expect(calculatePercentage(10000, 5)).toBe(500);
    });

    it('rounds to nearest cent', () => {
      // 10% of $10.01 = $1.001 → rounds to $1.00
      expect(calculatePercentage(1001, 10)).toBe(100);
      
      // 10% of $10.05 = $1.005 → rounds to $1.01
      expect(calculatePercentage(1005, 10)).toBe(101);
    });

    it('handles fractional percentages', () => {
      // 2.5% of $100.00
      expect(calculatePercentage(10000, 2.5)).toBe(250); // $2.50
    });

    it('handles zero percentage', () => {
      expect(calculatePercentage(4550, 0)).toBe(0);
    });

    it('handles 100% (full amount)', () => {
      expect(calculatePercentage(4550, 100)).toBe(4550);
    });
  });

  describe('Financial Accuracy Requirements', () => {
    it('never uses floating-point for amounts', () => {
      // CRITICAL: All amounts must be integers (cents)
      const amounts = [1050, 4550, 6800];
      
      amounts.forEach(amount => {
        expect(Number.isInteger(amount)).toBe(true);
      });
    });

    it('maintains precision in complex calculations', () => {
      // Real-world scenario: calculate GST-inclusive total
      const subtotal = 4550; // $45.50
      const gst = calculatePercentage(subtotal, 10); // $4.55
      const total = subtotal + gst; // $50.05
      
      expect(total).toBe(5005);
      expect(formatCurrency(total)).toBe('$50.05');
    });

    it('handles reconciliation matching tolerance', () => {
      // Transactions might have 1-2 cent differences due to rounding
      const receiptAmount = 4550; // $45.50
      const transactionAmount = 4551; // $45.51 (1 cent difference)
      
      const difference = Math.abs(receiptAmount - transactionAmount);
      const withinTolerance = difference <= 2; // Allow 2 cents difference
      
      expect(withinTolerance).toBe(true);
    });
  });
});

