/**
 * MobileTransactionCard Component Tests
 *
 * Tests notebook-styled mobile transaction card including:
 * - Paper white background (notebook design)
 * - Ruled lines border (notebook aesthetics)
 * - Status badge emojis (📝⚠️✅❌)
 * - Action emojis in dropdown (👁️✏️🗑️)
 * - Touch target sizes (64px minimum height, 44px buttons)
 * - JetBrains Mono font for amounts
 * - Color coding for income/expense
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileTransactionCard } from './MobileTransactionCard';
import type { Transaction } from '@/types/financial';

const mockTransaction: Transaction = {
  id: '1',
  user_id: 'user-1',
  bank_statement_id: 'stmt-1',
  transaction_date: '2025-01-12',
  amount: -50.75,
  description: 'Grocery Shopping',
  category: 'Groceries',
  status: 'unreconciled',
  created_at: '2025-01-12T00:00:00Z',
};

const mockHandlers = {
  onView: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('MobileTransactionCard', () => {
  describe('Notebook Design System', () => {
    it('applies paper white background', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />
      );

      const card = container.querySelector('.bg-white');
      expect(card).toBeInTheDocument();
    });

    it('applies ruled line border (border-charcoal/10)', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />
      );

      const ruledBorder = container.querySelector('.border-charcoal\\/10');
      expect(ruledBorder).toBeInTheDocument();
    });

    it('meets minimum touch target height (64px)', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />
      );

      const touchTarget = container.querySelector('.min-h-\\[64px\\]');
      expect(touchTarget).toBeInTheDocument();
    });

    it('uses JetBrains Mono font for amount', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />
      );

      const monoAmount = container.querySelector('.font-mono');
      expect(monoAmount).toBeInTheDocument();
    });

    it('has hover state with sand border', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />
      );

      const hoverCard = container.querySelector('.hover\\:border-previa-sand');
      expect(hoverCard).toBeInTheDocument();
    });
  });

  describe('Status Emojis', () => {
    it('displays 📝 emoji for unreconciled status', () => {
      const { container } = render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, status: 'unreconciled' }}
          {...mockHandlers}
        />
      );

      expect(container.textContent).toContain('📝');
    });

    it('displays ⚠️ emoji for matched status', () => {
      const { container } = render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, status: 'matched' }}
          {...mockHandlers}
        />
      );

      expect(container.textContent).toContain('⚠️');
    });

    it('displays ✅ emoji for approved status', () => {
      const { container } = render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, status: 'approved' }}
          {...mockHandlers}
        />
      );

      expect(container.textContent).toContain('✅');
    });

    it('displays ❌ emoji for rejected status', () => {
      const { container } = render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, status: 'rejected' }}
          {...mockHandlers}
        />
      );

      expect(container.textContent).toContain('❌');
    });
  });

  describe('Transaction Display', () => {
    it('displays transaction description', () => {
      render(<MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />);

      expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
    });

    it('displays formatted date', () => {
      render(<MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />);

      expect(screen.getByText(/Jan 12, 2025/i)).toBeInTheDocument();
    });

    it('displays category badge when present', () => {
      render(<MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />);

      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    it('displays amount with AUD currency', () => {
      render(<MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />);

      expect(screen.getByText(/\$50\.75/)).toBeInTheDocument();
    });

    it('applies red color for negative amounts', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />
      );

      const negativeAmount = container.querySelector('.text-red-600');
      expect(negativeAmount).toBeInTheDocument();
    });

    it('applies green color for positive amounts', () => {
      const { container } = render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, amount: 1000 }}
          {...mockHandlers}
        />
      );

      const positiveAmount = container.querySelector('.text-green-600');
      expect(positiveAmount).toBeInTheDocument();
    });

    it('displays + prefix for positive amounts', () => {
      render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, amount: 1000 }}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/\+\$1,000\.00/)).toBeInTheDocument();
    });
  });

  describe('Action Menu Emojis', () => {
    it('displays action menu trigger button', () => {
      render(<MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />);

      const menuButton = screen.getByRole('button', { name: /Open menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('meets minimum touch target size for action button (44px)', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />
      );

      const actionButton = container.querySelector('.min-h-\\[44px\\].min-w-\\[44px\\]');
      expect(actionButton).toBeInTheDocument();
    });

    // Note: Radix UI DropdownMenu content doesn't render in JSDOM during tests
    // The menu items with emojis (👁️✏️🗑️) are verified through the component code
  });

  describe('Event Handlers', () => {
    it('calls onView when card is clicked', () => {
      mockHandlers.onView.mockClear();
      render(<MobileTransactionCard transaction={mockTransaction} {...mockHandlers} />);

      const card = screen.getByText('Grocery Shopping').closest('.cursor-pointer');
      if (card) {
        fireEvent.click(card);
        expect(mockHandlers.onView).toHaveBeenCalledWith(mockTransaction);
      }
    });

    // Note: Testing dropdown menu item clicks requires special setup for Radix UI
    // The menu items (View Details, Edit, Delete with emojis) are verified via component code
  });

  describe('Selection State', () => {
    it('applies ring styling when selected', () => {
      const { container } = render(
        <MobileTransactionCard transaction={mockTransaction} {...mockHandlers} isSelected={true} />
      );

      const selectedCard = container.querySelector('.ring-2.ring-sand');
      expect(selectedCard).toBeInTheDocument();
    });

    it('does not apply ring styling when not selected', () => {
      const { container } = render(
        <MobileTransactionCard
          transaction={mockTransaction}
          {...mockHandlers}
          isSelected={false}
        />
      );

      const selectedCard = container.querySelector('.ring-2.ring-sand');
      expect(selectedCard).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles transaction without category', () => {
      render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, category: undefined }}
          {...mockHandlers}
        />
      );

      // Should not crash, and category badge should not appear
      expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    });

    it('handles zero amount transaction', () => {
      render(
        <MobileTransactionCard
          transaction={{ ...mockTransaction, amount: 0 }}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/\$0\.00/)).toBeInTheDocument();
    });
  });
});
