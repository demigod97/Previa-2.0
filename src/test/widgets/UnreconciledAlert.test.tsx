import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { UnreconciledAlert } from '@/components/widgets/UnreconciledAlert';
import type { Transaction } from '@/types/financial';

// Wrapper component to provide Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('UnreconciledAlert', () => {
  const unreconciledTransactions: Transaction[] = [
    {
      id: '1',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: '2024-10-05',
      date: '2024-10-05',
      description: 'Unmatched Transaction 1',
      amount: -50.0,
      category: 'Groceries',
      status: 'unreconciled',
      created_at: '2024-10-05',
      type: 'expense',
    },
    {
      id: '2',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: '2024-10-10',
      date: '2024-10-10',
      description: 'Unmatched Transaction 2',
      amount: -75.0,
      category: 'Dining',
      status: 'unreconciled',
      created_at: '2024-10-10',
      type: 'expense',
    },
    {
      id: '3',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: '2024-10-11',
      date: '2024-10-11',
      description: 'Matched Transaction',
      amount: -100.0,
      category: 'Shopping',
      status: 'matched',
      created_at: '2024-10-11',
      type: 'expense',
    },
  ];

  it('displays unreconciled count', () => {
    render(
      <RouterWrapper>
        <UnreconciledAlert transactions={unreconciledTransactions} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('Unreconciled Items')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 unreconciled
  });

  it('calculates unreconciled amount correctly', () => {
    render(
      <RouterWrapper>
        <UnreconciledAlert transactions={unreconciledTransactions} />
      </RouterWrapper>
    );
    
    // Sum of unreconciled amounts: 50 + 75 = 125
    expect(screen.getByText('$125.00')).toBeInTheDocument();
  });

  it('displays "Review Now" button', () => {
    render(
      <RouterWrapper>
        <UnreconciledAlert transactions={unreconciledTransactions} />
      </RouterWrapper>
    );
    
    const reviewButton = screen.getByRole('button', { name: /review now/i });
    expect(reviewButton).toBeInTheDocument();
  });

  it('shows success state when all transactions are reconciled', () => {
    const reconciledTransactions: Transaction[] = [
      {
        id: '1',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: '2024-10-05',
        date: '2024-10-05',
        description: 'Matched Transaction',
        amount: -50.0,
        category: 'Groceries',
        status: 'matched',
        created_at: '2024-10-05',
        type: 'expense',
      },
    ];

    render(
      <RouterWrapper>
        <UnreconciledAlert transactions={reconciledTransactions} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('All Reconciled')).toBeInTheDocument();
    expect(screen.getByText('Great job! All your transactions are reconciled.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /review now/i })).not.toBeInTheDocument();
  });

  it('handles empty transactions array', () => {
    render(
      <RouterWrapper>
        <UnreconciledAlert transactions={[]} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('All Reconciled')).toBeInTheDocument();
  });

  it('only counts unreconciled status transactions', () => {
    const mixedTransactions: Transaction[] = [
      {
        id: '1',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: '2024-10-05',
        date: '2024-10-05',
        description: 'Unreconciled',
        amount: -50.0,
        category: 'Groceries',
        status: 'unreconciled',
        created_at: '2024-10-05',
        type: 'expense',
      },
      {
        id: '2',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: '2024-10-06',
        date: '2024-10-06',
        description: 'Matched',
        amount: -75.0,
        category: 'Dining',
        status: 'matched',
        created_at: '2024-10-06',
        type: 'expense',
      },
      {
        id: '3',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: '2024-10-07',
        date: '2024-10-07',
        description: 'Approved',
        amount: -100.0,
        category: 'Shopping',
        status: 'approved',
        created_at: '2024-10-07',
        type: 'expense',
      },
    ];

    render(
      <RouterWrapper>
        <UnreconciledAlert transactions={mixedTransactions} />
      </RouterWrapper>
    );
    
    // Only 1 unreconciled transaction
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('uses absolute value for amount calculation', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: '2024-10-05',
        date: '2024-10-05',
        description: 'Expense',
        amount: -50.0, // Negative
        category: 'Groceries',
        status: 'unreconciled',
        created_at: '2024-10-05',
        type: 'expense',
      },
      {
        id: '2',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: '2024-10-06',
        date: '2024-10-06',
        description: 'Income',
        amount: 100.0, // Positive
        category: 'Salary',
        status: 'unreconciled',
        created_at: '2024-10-06',
        type: 'income',
      },
    ];

    render(
      <RouterWrapper>
        <UnreconciledAlert transactions={transactions} />
      </RouterWrapper>
    );
    
    // Should sum absolute values: |−50| + |100| = 150
    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });
});

