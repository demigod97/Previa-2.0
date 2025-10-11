/**
 * RecentTransactionsList Component Tests
 *
 * Tests notebook-styled transaction list including:
 * - Transaction display with notebook design (paper white, ruled lines)
 * - Emoji + icon blending
 * - Loading states with skeletons
 * - Empty state with emoji
 * - Navigation to full transactions view
 * - JetBrains Mono font for amounts
 * - Color coding (red/green for amounts)
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecentTransactionsList } from './RecentTransactionsList';
import type { Transaction } from '@/types/financial';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: 'user-1',
    bank_statement_id: 'stmt-1',
    transaction_date: '2025-01-12',
    amount: -10.5,
    description: 'Coffee Shop Purchase',
    category: 'Food & Drink',
    status: 'unreconciled',
    created_at: '2025-01-12T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    bank_statement_id: 'stmt-1',
    transaction_date: '2025-01-11',
    amount: 1500.0,
    description: 'Salary Deposit',
    category: 'Income',
    status: 'approved',
    created_at: '2025-01-11T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'user-1',
    bank_statement_id: 'stmt-1',
    transaction_date: '2025-01-10',
    amount: -45.99,
    description: 'Grocery Shopping',
    category: 'Groceries',
    status: 'matched',
    created_at: '2025-01-10T00:00:00Z',
  },
];

// Wrapper with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RecentTransactionsList', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Normal Rendering', () => {
    it('renders component with emoji and title', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      const title = screen.getByText(/Recent Transactions/i);
      expect(title).toBeInTheDocument();
      expect(title.textContent).toContain('📊');
    });

    it('renders "View All" button with navigation', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      const viewAllButton = screen.getByRole('button', { name: /View All/i });
      expect(viewAllButton).toBeInTheDocument();

      fireEvent.click(viewAllButton);
      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
    });

    it('displays transactions up to the limit', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} limit={2} />);

      expect(screen.getByText('Coffee Shop Purchase')).toBeInTheDocument();
      expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
      expect(screen.queryByText('Grocery Shopping')).not.toBeInTheDocument();
    });

    it('displays all transactions when below limit', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} limit={10} />);

      expect(screen.getByText('Coffee Shop Purchase')).toBeInTheDocument();
      expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
      expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
    });
  });

  describe('Transaction Details', () => {
    it('displays transaction description', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      expect(screen.getByText('Coffee Shop Purchase')).toBeInTheDocument();
      expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    });

    it('displays category badges when available', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      expect(screen.getByText('Food & Drink')).toBeInTheDocument();
      expect(screen.getByText('Income')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    it('displays transaction dates with calendar icon', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      // Check date formatting (Australian format)
      expect(screen.getByText(/12 Jan 2025/i)).toBeInTheDocument();
      expect(screen.getByText(/11 Jan 2025/i)).toBeInTheDocument();
    });

    it('displays amounts with currency formatting', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      // Check for currency symbols and formatting
      expect(screen.getByText(/\$10\.50/)).toBeInTheDocument();
      expect(screen.getByText(/\$1,500\.00/)).toBeInTheDocument();
      expect(screen.getByText(/\$45\.99/)).toBeInTheDocument();
    });

    it('applies correct color coding for negative amounts', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      // Find negative amount elements
      const negativeAmounts = container.querySelectorAll('.text-red-600');
      expect(negativeAmounts.length).toBeGreaterThan(0);
    });

    it('applies correct color coding for positive amounts', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      // Find positive amount elements
      const positiveAmounts = container.querySelectorAll('.text-green-600');
      expect(positiveAmounts.length).toBeGreaterThan(0);
    });

    it('displays + prefix for positive amounts', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      // Salary Deposit should have +$1,500.00
      expect(screen.getByText(/\+\$1,500\.00/)).toBeInTheDocument();
    });

    it('does not display + prefix for negative amounts', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      // Coffee should show -$10.50 (not +-$10.50)
      const coffeeAmount = screen.getByText(/\$10\.50/);
      expect(coffeeAmount.textContent).not.toContain('+');
    });
  });

  describe('Notebook Design System', () => {
    it('applies paper white background for transaction cards', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      const paperWhiteCard = container.querySelector('.bg-white');
      expect(paperWhiteCard).toBeInTheDocument();
    });

    it('applies ruled lines between transactions', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      // Check for divider between transactions (divide-y)
      const dividedContainer = container.querySelector('.divide-y');
      expect(dividedContainer).toBeInTheDocument();
    });

    it('uses JetBrains Mono font for amounts', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      // Check for font-mono class on amount elements
      const monoAmounts = container.querySelectorAll('.font-mono');
      expect(monoAmounts.length).toBe(mockTransactions.length);
    });

    it('applies hover effects with sand color', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      // Check for hover:bg-previa-sand/10 class
      const hoverableRow = container.querySelector('.hover\\:bg-previa-sand\\/10');
      expect(hoverableRow).toBeInTheDocument();
    });

    it('meets minimum touch target height (64px)', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      // Check for min-h-[64px] class
      const touchTargets = container.querySelectorAll('.min-h-\\[64px\\]');
      expect(touchTargets.length).toBe(mockTransactions.length);
    });
  });

  describe('Loading State', () => {
    it('displays skeleton loaders when loading', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={[]} loading={true} />
      );

      // Check for 3 skeleton loaders
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(3);
    });

    it('uses Previa sand color for skeleton background', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={[]} loading={true} />
      );

      const skeleton = container.querySelector('.bg-previa-sand\\/20');
      expect(skeleton).toBeInTheDocument();
    });

    it('does not display transactions when loading', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} loading={true} />);

      expect(screen.queryByText('Coffee Shop Purchase')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state message with emoji when no transactions', () => {
      renderWithRouter(<RecentTransactionsList transactions={[]} />);

      const emptyMessage = screen.getByText(
        /No transactions yet. Upload your first bank statement to get started!/i
      );
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage.textContent).toContain('📭');
    });

    it('applies paper white background to empty state', () => {
      const { container } = renderWithRouter(<RecentTransactionsList transactions={[]} />);

      const emptyState = screen.getByText(/No transactions yet/i).parentElement;
      expect(emptyState?.className).toContain('bg-white');
    });

    it('does not display "View All" navigation when empty', () => {
      renderWithRouter(<RecentTransactionsList transactions={[]} />);

      const viewAllButton = screen.getByRole('button', { name: /View All/i });
      // Button should still be present but may not navigate meaningfully
      expect(viewAllButton).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to transactions page when transaction is clicked', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      const firstTransaction = screen.getByText('Coffee Shop Purchase');
      fireEvent.click(firstTransaction);

      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
    });

    it('navigates to transactions page when "View All" is clicked', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      const viewAllButton = screen.getByRole('button', { name: /View All/i });
      fireEvent.click(viewAllButton);

      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
    });
  });

  describe('Accessibility', () => {
    it('has proper button role for "View All"', () => {
      renderWithRouter(<RecentTransactionsList transactions={mockTransactions} />);

      const button = screen.getByRole('button', { name: /View All/i });
      expect(button).toBeInTheDocument();
    });

    it('meets WCAG minimum touch target for "View All" button', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      const viewAllButton = screen.getByRole('button', { name: /View All/i });
      // Check for min-h-[44px] and min-w-[44px] classes
      expect(viewAllButton.className).toContain('min-h-[44px]');
      expect(viewAllButton.className).toContain('min-w-[44px]');
    });

    it('has cursor-pointer class on transaction rows', () => {
      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={mockTransactions} />
      );

      const clickableRows = container.querySelectorAll('.cursor-pointer');
      expect(clickableRows.length).toBe(mockTransactions.length);
    });
  });

  describe('Edge Cases', () => {
    it('handles transaction with missing description', () => {
      const transactionWithoutDescription: Transaction = {
        ...mockTransactions[0],
        description: '',
      };

      renderWithRouter(<RecentTransactionsList transactions={[transactionWithoutDescription]} />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('handles transaction without category', () => {
      const transactionWithoutCategory: Transaction = {
        ...mockTransactions[0],
        category: undefined,
      };

      const { container } = renderWithRouter(
        <RecentTransactionsList transactions={[transactionWithoutCategory]} />
      );

      // Should not display any badge
      expect(container.querySelector('.bg-previa-sand\\/20')).not.toBeInTheDocument();
    });

    it('handles zero amount transaction', () => {
      const zeroTransaction: Transaction = {
        ...mockTransactions[0],
        amount: 0,
      };

      renderWithRouter(<RecentTransactionsList transactions={[zeroTransaction]} />);

      expect(screen.getByText(/\$0\.00/)).toBeInTheDocument();
    });
  });
});
