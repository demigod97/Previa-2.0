import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IncomeVsExpensesChart } from '@/components/widgets/IncomeVsExpensesChart';
import type { Transaction } from '@/types/financial';

describe('IncomeVsExpensesChart', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: new Date().toISOString().split('T')[0], // Today
      date: new Date().toISOString().split('T')[0],
      description: 'Salary',
      amount: 3000.0,
      category: 'Income',
      status: 'approved',
      created_at: new Date().toISOString(),
      type: 'income',
    },
    {
      id: '2',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: new Date().toISOString().split('T')[0], // Today
      date: new Date().toISOString().split('T')[0],
      description: 'Rent',
      amount: -1200.0,
      category: 'Housing',
      status: 'approved',
      created_at: new Date().toISOString(),
      type: 'expense',
    },
    {
      id: '3',
      user_id: 'user-1',
      bank_statement_id: null,
      transaction_date: new Date().toISOString().split('T')[0], // Today
      date: new Date().toISOString().split('T')[0],
      description: 'Groceries',
      amount: -300.0,
      category: 'Food',
      status: 'approved',
      created_at: new Date().toISOString(),
      type: 'expense',
    },
  ];

  it('renders the chart title', () => {
    render(<IncomeVsExpensesChart transactions={mockTransactions} />);
    expect(screen.getByText('Income vs Expenses')).toBeInTheDocument();
  });

  it('displays net income label', () => {
    render(<IncomeVsExpensesChart transactions={mockTransactions} />);
    expect(screen.getByText('Net Income (This Month)')).toBeInTheDocument();
  });

  it('calculates net income correctly (positive)', () => {
    render(<IncomeVsExpensesChart transactions={mockTransactions} />);
    // Net: 3000 - 1200 - 300 = 1500
    expect(screen.getByText('+$1500.00')).toBeInTheDocument();
  });

  it('displays negative net income with minus sign', () => {
    const negativeTransactions: Transaction[] = [
      {
        id: '1',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        description: 'Salary',
        amount: 1000.0,
        category: 'Income',
        status: 'approved',
        created_at: new Date().toISOString(),
        type: 'income',
      },
      {
        id: '2',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        description: 'Rent',
        amount: -1500.0,
        category: 'Housing',
        status: 'approved',
        created_at: new Date().toISOString(),
        type: 'expense',
      },
    ];

    render(<IncomeVsExpensesChart transactions={negativeTransactions} />);
    // Net: 1000 - 1500 = -500
    expect(screen.getByText((content, element) => {
      return element?.textContent === '$-500.00';
    })).toBeInTheDocument();
  });

  it('handles empty transactions array', () => {
    render(<IncomeVsExpensesChart transactions={[]} />);
    expect(screen.getByText('Income vs Expenses')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === '+$0.00';
    })).toBeInTheDocument();
  });

  it('separates income and expenses correctly', () => {
    // The chart should separate income (positive amounts) from expenses (negative amounts)
    const transactions: Transaction[] = [
      {
        id: '1',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        description: 'Income 1',
        amount: 1000.0,
        category: 'Income',
        status: 'approved',
        created_at: new Date().toISOString(),
        type: 'income',
      },
      {
        id: '2',
        user_id: 'user-1',
        bank_statement_id: null,
        transaction_date: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        description: 'Income 2',
        amount: 500.0,
        category: 'Income',
        status: 'approved',
        created_at: new Date().toISOString(),
        type: 'income',
      },
    ];

    render(<IncomeVsExpensesChart transactions={transactions} />);
    // Net should be positive sum: 1500
    expect(screen.getByText('+$1500.00')).toBeInTheDocument();
  });
});

