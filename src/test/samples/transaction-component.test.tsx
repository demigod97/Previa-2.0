/**
 * Sample Component Test: Transaction Display
 * 
 * Demonstrates testing patterns for React components that display
 * financial data. Focus on proper currency formatting and user interactions.
 * 
 * Pattern: Component testing with React Testing Library
 */

import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import { mockTransactions } from '../fixtures/financial-data';

/**
 * Sample TransactionCard component (to be implemented)
 * This is a placeholder for demonstration purposes
 */
interface Transaction {
  id: string;
  amount: number;
  description: string;
  transaction_date: string;
  category?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onSelect?: (id: string) => void;
  className?: string;
}

function TransactionCard({ transaction, onSelect, className }: TransactionCardProps) {
  // Placeholder implementation for testing
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  return (
    <div 
      className={`transaction-card ${className || ''}`}
      onClick={() => onSelect?.(transaction.id)}
      role="button"
      tabIndex={0}
    >
      <div className="transaction-description">
        {transaction.description}
      </div>
      <div className="transaction-amount" data-testid="transaction-amount">
        {formatCurrency(transaction.amount)}
      </div>
      <div className="transaction-date">
        {formatDate(transaction.transaction_date)}
      </div>
      {transaction.category && (
        <div className="transaction-category">{transaction.category}</div>
      )}
    </div>
  );
}

describe('TransactionCard Component', () => {
  const mockTransaction = mockTransactions[0]; // Woolworths transaction

  describe('Rendering', () => {
    it('displays transaction description', () => {
      renderWithProviders(<TransactionCard transaction={mockTransaction} />);
      
      expect(screen.getByText('Woolworths Sydney CBD')).toBeInTheDocument();
    });

    it('displays amount in AUD currency format', () => {
      renderWithProviders(<TransactionCard transaction={mockTransaction} />);
      
      const amountElement = screen.getByTestId('transaction-amount');
      expect(amountElement).toHaveTextContent('-$45.50');
    });

    it('displays transaction date in Australian format', () => {
      renderWithProviders(<TransactionCard transaction={mockTransaction} />);
      
      // 2024-01-15 should be displayed as 15/01/2024 in Australian format
      expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    });

    it('displays category when provided', () => {
      renderWithProviders(<TransactionCard transaction={mockTransaction} />);
      
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    it('handles missing optional category gracefully', () => {
      const transactionWithoutCategory = { ...mockTransaction, category: undefined };
      
      expect(() => {
        renderWithProviders(<TransactionCard transaction={transactionWithoutCategory} />);
      }).not.toThrow();
      
      expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    });
  });

  describe('Financial Formatting', () => {
    it('formats positive amounts (income) correctly', () => {
      const incomeTransaction = mockTransactions[9]; // Salary transaction
      renderWithProviders(<TransactionCard transaction={incomeTransaction} />);
      
      const amountElement = screen.getByTestId('transaction-amount');
      expect(amountElement).toHaveTextContent('$3,500.00');
    });

    it('formats negative amounts (expenses) with minus sign', () => {
      renderWithProviders(<TransactionCard transaction={mockTransaction} />);
      
      const amountElement = screen.getByTestId('transaction-amount');
      expect(amountElement).toHaveTextContent('-$45.50');
    });

    it('formats amounts with proper thousand separators', () => {
      const largeTransaction = {
        ...mockTransaction,
        amount: 125000 // $1,250.00
      };
      
      renderWithProviders(<TransactionCard transaction={largeTransaction} />);
      
      const amountElement = screen.getByTestId('transaction-amount');
      expect(amountElement).toHaveTextContent('$1,250.00');
    });

    it('always shows two decimal places', () => {
      const roundAmountTransaction = {
        ...mockTransaction,
        amount: 5000 // $50.00 (not $50)
      };
      
      renderWithProviders(<TransactionCard transaction={roundAmountTransaction} />);
      
      const amountElement = screen.getByTestId('transaction-amount');
      expect(amountElement).toHaveTextContent('$50.00');
    });
  });

  describe('User Interactions', () => {
    it('calls onSelect with transaction ID when clicked', () => {
      const mockOnSelect = vi.fn();
      
      renderWithProviders(
        <TransactionCard 
          transaction={mockTransaction} 
          onSelect={mockOnSelect}
        />
      );
      
      const card = screen.getByRole('button');
      fireEvent.click(card);
      
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(mockTransaction.id);
    });

    it('does not error when onSelect is not provided', () => {
      renderWithProviders(<TransactionCard transaction={mockTransaction} />);
      
      const card = screen.getByRole('button');
      
      expect(() => {
        fireEvent.click(card);
      }).not.toThrow();
    });

    it('is keyboard accessible', () => {
      const mockOnSelect = vi.fn();
      
      renderWithProviders(
        <TransactionCard 
          transaction={mockTransaction} 
          onSelect={mockOnSelect}
        />
      );
      
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Styling', () => {
    it('applies custom className when provided', () => {
      const customClass = 'custom-transaction-style';
      
      renderWithProviders(
        <TransactionCard 
          transaction={mockTransaction} 
          className={customClass}
        />
      );
      
      const card = screen.getByRole('button');
      expect(card).toHaveClass(customClass);
    });

    it('has default transaction-card class', () => {
      renderWithProviders(<TransactionCard transaction={mockTransaction} />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveClass('transaction-card');
    });
  });

  describe('Edge Cases', () => {
    it('handles very small amounts', () => {
      const smallTransaction = {
        ...mockTransaction,
        amount: -1 // -$0.01
      };
      
      renderWithProviders(<TransactionCard transaction={smallTransaction} />);
      
      const amountElement = screen.getByTestId('transaction-amount');
      expect(amountElement).toHaveTextContent('-$0.01');
    });

    it('handles zero amount', () => {
      const zeroTransaction = {
        ...mockTransaction,
        amount: 0
      };
      
      renderWithProviders(<TransactionCard transaction={zeroTransaction} />);
      
      const amountElement = screen.getByTestId('transaction-amount');
      expect(amountElement).toHaveTextContent('$0.00');
    });

    it('handles very long descriptions gracefully', () => {
      const longDescTransaction = {
        ...mockTransaction,
        description: 'A'.repeat(200) // Very long description
      };
      
      expect(() => {
        renderWithProviders(<TransactionCard transaction={longDescTransaction} />);
      }).not.toThrow();
    });

    it('handles missing date gracefully', () => {
      const noDateTransaction = {
        ...mockTransaction,
        transaction_date: ''
      };
      
      expect(() => {
        renderWithProviders(<TransactionCard transaction={noDateTransaction} />);
      }).not.toThrow();
    });
  });
});

