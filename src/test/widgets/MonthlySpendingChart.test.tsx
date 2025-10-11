import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MonthlySpendingChart } from '@/components/widgets/MonthlySpendingChart';
import type { Transaction } from '@/types/financial';

describe('MonthlySpendingChart', () => {
  // Use current dates to ensure transactions are in the current month
  const now = new Date();
  const currentDate1 = new Date(now.getFullYear(), now.getMonth(), 5).toISOString().split('T')[0];
  const currentDate2 = new Date(now.getFullYear(), now.getMonth(), 10).toISOString().split('T')[0];
  const currentDate3 = new Date(now.getFullYear(), now.getMonth(), 11).toISOString().split('T')[0];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: currentDate1,
      date: currentDate1,
      description: 'Grocery Store',
      amount: -50.0,
      category: 'Groceries',
      status: 'approved',
      created_at: currentDate1,
      type: 'expense',
    },
    {
      id: '2',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: currentDate2,
      date: currentDate2,
      description: 'Salary',
      amount: 3000.0,
      category: 'Income',
      status: 'approved',
      created_at: currentDate2,
      type: 'income',
    },
    {
      id: '3',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: currentDate3,
      date: currentDate3,
      description: 'Restaurant',
      amount: -75.0,
      category: 'Dining',
      status: 'approved',
      created_at: currentDate3,
      type: 'expense',
    },
  ];

  it('renders the chart title', () => {
    render(<MonthlySpendingChart transactions={mockTransactions} />);
    expect(screen.getByText('Monthly Spending')).toBeInTheDocument();
  });

  it('displays total spending amount', () => {
    render(<MonthlySpendingChart transactions={mockTransactions} />);
    expect(screen.getByText('Total Spending')).toBeInTheDocument();
    // Should show sum of expenses only: 50 + 75 = 125
    expect(screen.getByText((content, element) => {
      return element?.textContent === '$125.00';
    })).toBeInTheDocument();
  });

  it('renders period selector', () => {
    render(<MonthlySpendingChart transactions={mockTransactions} />);
    // Check if select trigger is present (would show current selection)
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });

  it('handles empty transactions array', () => {
    render(<MonthlySpendingChart transactions={[]} />);
    expect(screen.getByText('Monthly Spending')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('only calculates expenses for total spending', () => {
    // Transaction with income should not be included
    const now = new Date();
    const date1 = new Date(now.getFullYear(), now.getMonth(), 5).toISOString().split('T')[0];
    const date2 = new Date(now.getFullYear(), now.getMonth(), 6).toISOString().split('T')[0];
    
    const mixedTransactions: Transaction[] = [
      {
        id: '1',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: date1,
        date: date1,
        description: 'Expense',
        amount: -100.0,
        category: 'Shopping',
        status: 'approved',
        created_at: date1,
        type: 'expense',
      },
      {
        id: '2',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: date2,
        date: date2,
        description: 'Income',
        amount: 500.0,
        category: 'Salary',
        status: 'approved',
        created_at: date2,
        type: 'income',
      },
    ];

    render(<MonthlySpendingChart transactions={mixedTransactions} />);
    // Should only show expense total
    expect(screen.getByText((content, element) => {
      return element?.textContent === '$100.00';
    })).toBeInTheDocument();
  });
});

