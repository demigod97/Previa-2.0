# Coding Standards - Previa Financial Intelligence Platform

**Last Updated:** 2025-01-09
**Purpose:** Define consistent code patterns, naming conventions, and best practices for Previa development and AI agent implementation

---

## Code Quality Principles

### Core Principles
1. **Financial Accuracy First**: All monetary calculations must use precise decimal arithmetic
2. **Type Safety**: Leverage TypeScript to prevent runtime errors in financial logic
3. **Security by Design**: Never log financial data, always validate inputs
4. **AI Agent Clarity**: Code should be self-documenting for AI implementation
5. **Accessibility**: All UI components must meet WCAG AA standards

---

## TypeScript Standards

### Type Definitions

**Financial Types:**
```typescript
// Always use precise decimal types for financial amounts
type CurrencyAmount = number;  // Represents cents (e.g., 1050 = $10.50)
type CurrencyString = string;  // Display format (e.g., "$10.50")

// Financial status types
type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
type ReconciliationStatus = 'unreconciled' | 'matched' | 'approved' | 'rejected';
type UserTier = 'user' | 'premium_user';

// Database entity types
interface Transaction {
  id: string;
  user_id: string;
  bank_statement_id: string;
  transaction_date: string; // ISO date string
  amount: CurrencyAmount;   // Always in cents
  description: string;
  category?: string;
  status: ReconciliationStatus;
  created_at: string;
}
```

**React Component Props:**
```typescript
// Use explicit prop interfaces
interface TransactionCardProps {
  transaction: Transaction;
  onReconcile?: (transactionId: string) => void;
  showActions?: boolean;
  className?: string;
}

// Export props interfaces for testing
export type { TransactionCardProps };
```

**API Response Types:**
```typescript
// Match Supabase generated types exactly
import type { Database } from '@/integrations/supabase/types';

type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];
```

### Import Organization

**Import Order:**
```typescript
// 1. React and core libraries
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

// 2. Third-party UI libraries
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// 3. Internal utilities and hooks
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, parseCurrencyAmount } from '@/lib/currency';

// 4. Types (always at the end)
import type { Transaction, TransactionCardProps } from '@/types/financial';
```

**Path Aliases:**
```typescript
// Use @ alias for src/ imports
import { supabase } from '@/integrations/supabase/client';
import { TransactionCard } from '@/components/financial/TransactionCard';
import { TIER_LIMITS } from '@/config/constants';

// Relative imports only for same directory
import './TransactionCard.styles.css';
```

---

## Component Standards

### React Component Structure

**Functional Component Template:**
```typescript
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import type { Transaction } from '@/types/financial';

interface TransactionCardProps {
  transaction: Transaction;
  onSelect?: (id: string) => void;
  className?: string;
}

/**
 * TransactionCard - Displays individual transaction with financial formatting
 *
 * @param transaction - Transaction data from database
 * @param onSelect - Optional callback when transaction is selected
 * @param className - Additional CSS classes
 */
export function TransactionCard({
  transaction,
  onSelect,
  className
}: TransactionCardProps) {
  const handleClick = () => {
    onSelect?.(transaction.id);
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{transaction.description}</span>
          <span className="font-mono text-sm">
            {formatCurrency(transaction.amount)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {new Date(transaction.transaction_date).toLocaleDateString('en-AU')}
        </p>
      </CardContent>
    </Card>
  );
}

// Export props type for testing
export type { TransactionCardProps };
```

### Custom Hooks Pattern

**Financial Data Hooks:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Transaction } from '@/types/financial';

interface UseTransactionsOptions {
  status?: ReconciliationStatus;
  limit?: number;
}

/**
 * useTransactions - Fetch user's transactions with automatic RLS filtering
 */
export function useTransactions(options: UseTransactionsOptions = {}) {
  const { user } = useAuth();
  const { status, limit = 50 } = options;

  return useQuery({
    queryKey: ['transactions', user?.id, status, limit],
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 30_000, // 30 seconds
  });
}
```

---

## Financial Data Handling

### Currency Calculations

**Always Use Precise Arithmetic:**
```typescript
// ✅ CORRECT: Store amounts in cents
const amount = 1050; // Represents $10.50
const tax = Math.round(amount * 0.1); // $1.05 in cents

// ❌ INCORRECT: Floating point arithmetic
const amount = 10.50;
const tax = amount * 0.10; // May result in 1.0499999999999998
```

**Currency Utility Functions:**
```typescript
// lib/currency.ts
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100);
}

export function parseCurrencyAmount(currencyString: string): number {
  // Remove currency symbols and convert to cents
  const cleanString = currencyString.replace(/[^0-9.-]/g, '');
  const dollars = parseFloat(cleanString);
  return Math.round(dollars * 100);
}

export function addCurrencyAmounts(...amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

export function calculatePercentage(amount: number, percentage: number): number {
  return Math.round(amount * (percentage / 100));
}
```

### Date Handling

**Financial Date Standards:**
```typescript
// Use date-fns for consistent date handling
import { format, parseISO, isValid } from 'date-fns';

export function formatTransactionDate(isoString: string): string {
  const date = parseISO(isoString);
  if (!isValid(date)) {
    throw new Error(`Invalid date string: ${isoString}`);
  }
  return format(date, 'dd/MM/yyyy'); // Australian format
}

export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd'); // ISO format for database
}
```

---

## File Organization Standards

### Component File Structure

**Financial Components:**
```
src/components/financial/
├── TransactionCard/
│   ├── TransactionCard.tsx
│   ├── TransactionCard.test.tsx
│   ├── TransactionCard.stories.tsx (if using Storybook)
│   └── index.ts
├── ReconciliationMatch/
│   ├── ReconciliationMatch.tsx
│   ├── ReconciliationMatch.test.tsx
│   └── index.ts
└── index.ts (barrel exports)
```

**Index File Pattern:**
```typescript
// src/components/financial/index.ts
export { TransactionCard } from './TransactionCard';
export { ReconciliationMatch } from './ReconciliationMatch';
export { ReceiptCard } from './ReceiptCard';

export type {
  TransactionCardProps,
  ReconciliationMatchProps,
  ReceiptCardProps
} from './types';
```

### Hook Organization

**Custom Hooks Structure:**
```
src/hooks/
├── financial/
│   ├── useTransactions.ts
│   ├── useReconciliation.ts
│   ├── useUserTier.ts
│   └── index.ts
├── auth/
│   ├── useAuth.ts
│   ├── useProtectedRoute.ts
│   └── index.ts
└── index.ts
```

---

## Naming Conventions

### Variables and Functions

**Financial Domain Naming:**
```typescript
// ✅ GOOD: Clear financial context
const unreconciledTransactions = [];
const monthlySpendingTotal = 0;
const receiptConfidenceScore = 0.95;

function calculateReconciliationMatch(transaction: Transaction, receipt: Receipt): number {
  // Implementation
}

function validateBankStatementFormat(file: File): boolean {
  // Implementation
}

// ❌ AVOID: Generic or unclear names
const items = [];
const total = 0;
const score = 0.95;
```

**React Component Naming:**
```typescript
// ✅ Component names use PascalCase
export function TransactionCard() { }
export function ReconciliationMatchDialog() { }
export function BankAccountForm() { }

// ✅ Hook names start with 'use'
export function useTransactions() { }
export function useReconciliationEngine() { }
export function useBankAccounts() { }

// ✅ Event handler names use 'handle' prefix
const handleTransactionSelect = () => { };
const handleReconciliationApprove = () => { };
const handleFileUpload = () => { };
```

### File Naming

**File Naming Patterns:**
```
// Components: PascalCase
TransactionCard.tsx
ReconciliationEngine.tsx
BankAccountForm.tsx

// Hooks: camelCase starting with 'use'
useTransactions.ts
useReconciliation.ts
useBankAccounts.ts

// Utilities: camelCase
currencyHelpers.ts
dateHelpers.ts
fileValidation.ts

// Types: camelCase ending with 'Types'
financialTypes.ts
apiTypes.ts
componentTypes.ts

// Constants: SCREAMING_SNAKE_CASE or camelCase
constants.ts
financialConstants.ts
```

---

## Error Handling Standards

### Error Boundaries

**Financial Error Handling:**
```typescript
interface FinancialErrorInfo {
  operation: string;
  userId?: string;
  amount?: number;
  timestamp: string;
}

export class FinancialError extends Error {
  public readonly info: FinancialErrorInfo;

  constructor(message: string, info: FinancialErrorInfo) {
    super(message);
    this.name = 'FinancialError';
    this.info = info;
  }
}

// Usage in components
try {
  const result = await reconcileTransaction(transaction, receipt);
} catch (error) {
  if (error instanceof FinancialError) {
    // Handle financial-specific error
    toast.error(`Reconciliation failed: ${error.message}`);
  } else {
    // Handle generic error
    toast.error('An unexpected error occurred');
  }
}
```

### API Error Handling

**Supabase Error Patterns:**
```typescript
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    // Log error without exposing financial data
    console.error('Transaction fetch failed:', {
      code: error.code,
      message: error.message,
      userId: userId.substring(0, 8) + '...', // Partial ID for debugging
    });

    throw new FinancialError('Failed to fetch transactions', {
      operation: 'fetchTransactions',
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  return data || [];
}
```

---

## Testing Standards

### Unit Test Patterns

**Component Testing:**
```typescript
// TransactionCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TransactionCard } from './TransactionCard';
import { mockTransaction } from '@/test/fixtures/financial-data';

describe('TransactionCard', () => {
  it('displays transaction amount in correct currency format', () => {
    render(<TransactionCard transaction={mockTransaction} />);

    // Check that amount is displayed in AUD format
    expect(screen.getByText('$10.50')).toBeInTheDocument();
  });

  it('calls onSelect with transaction ID when clicked', () => {
    const mockOnSelect = vi.fn();
    render(
      <TransactionCard
        transaction={mockTransaction}
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockTransaction.id);
  });

  it('handles missing optional props gracefully', () => {
    expect(() => {
      render(<TransactionCard transaction={mockTransaction} />);
    }).not.toThrow();
  });
});
```

**Hook Testing:**
```typescript
// useTransactions.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactions } from './useTransactions';
import { mockUser } from '@/test/fixtures/auth-data';

// Mock Supabase
vi.mock('@/integrations/supabase/client');

describe('useTransactions', () => {
  it('fetches transactions for authenticated user', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(3);
  });
});
```

---

## Security Standards

### Input Validation

**Financial Input Validation:**
```typescript
import { z } from 'zod';

// Zod schemas for financial data
export const TransactionSchema = z.object({
  amount: z.number().int().min(1).max(999999999), // Cents, max ~$10M
  description: z.string().min(1).max(255).trim(),
  transaction_date: z.string().datetime(),
  category: z.string().optional(),
});

export const BankAccountSchema = z.object({
  institution: z.string().min(1).max(100).trim(),
  account_name: z.string().min(1).max(100).trim(),
  account_number_masked: z.string().regex(/^\d{4}$/, 'Must be exactly 4 digits'),
});

// Usage in forms
function TransactionForm() {
  const form = useForm<z.infer<typeof TransactionSchema>>({
    resolver: zodResolver(TransactionSchema),
  });

  const onSubmit = (data: z.infer<typeof TransactionSchema>) => {
    // Data is automatically validated
    createTransaction(data);
  };
}
```

### Data Sanitization

**Financial Data Security:**
```typescript
// Never log full financial amounts or account details
export function sanitizeForLogging(data: any): any {
  const sanitized = { ...data };

  // Mask sensitive financial data
  if (sanitized.amount) {
    sanitized.amount = '[AMOUNT_REDACTED]';
  }

  if (sanitized.account_number) {
    sanitized.account_number = sanitized.account_number.replace(/\d/g, '*');
  }

  if (sanitized.user_id) {
    sanitized.user_id = sanitized.user_id.substring(0, 8) + '...';
  }

  return sanitized;
}

// Usage
console.log('Transaction created:', sanitizeForLogging(transaction));
```

---

## Performance Standards

### React Performance

**Optimization Patterns:**
```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive financial calculations
export const TransactionSummary = memo(function TransactionSummary({
  transactions
}: { transactions: Transaction[] }) {
  const summary = useMemo(() => {
    return {
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
      count: transactions.length,
      categories: [...new Set(transactions.map(t => t.category))],
    };
  }, [transactions]);

  return (
    <div>
      <p>Total: {formatCurrency(summary.total)}</p>
      <p>Count: {summary.count}</p>
    </div>
  );
});

// Memoize event handlers
function TransactionList({ transactions, onSelect }: TransactionListProps) {
  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <div>
      {transactions.map(transaction => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
```

---

## AI Agent Implementation Guidelines

### Code Structure for AI Agents

**Clear Component Boundaries:**
```typescript
// ✅ GOOD: Single responsibility, clear inputs/outputs
interface ReconciliationEngineProps {
  transactions: Transaction[];
  receipts: Receipt[];
  onMatchFound: (match: ReconciliationMatch) => void;
  onMatchRejected: (transactionId: string, receiptId: string) => void;
}

export function ReconciliationEngine(props: ReconciliationEngineProps) {
  // Implementation is focused on one concern
}

// ❌ AVOID: Mixed responsibilities
export function DashboardWithEverything() {
  // Handles transactions, receipts, auth, navigation, etc.
}
```

**Explicit Error Handling:**
```typescript
// ✅ GOOD: Clear error states and recovery
export function useReconciliation() {
  const [state, setState] = useState<{
    status: 'idle' | 'processing' | 'success' | 'error';
    error?: string;
    results?: ReconciliationMatch[];
  }>({ status: 'idle' });

  const reconcile = async (transactionId: string, receiptId: string) => {
    setState({ status: 'processing' });

    try {
      const result = await reconcileTransactionWithReceipt(transactionId, receiptId);
      setState({ status: 'success', results: [result] });
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return { ...state, reconcile };
}
```

### Documentation for AI Agents

**Component Documentation:**
```typescript
/**
 * TransactionCard - Displays financial transaction data
 *
 * This component renders a single transaction with proper financial formatting.
 * It handles currency display, date formatting, and user interactions.
 *
 * @example
 * ```tsx
 * <TransactionCard
 *   transaction={transaction}
 *   onSelect={(id) => console.log('Selected:', id)}
 * />
 * ```
 *
 * @param transaction - Transaction object from database (required)
 * @param onSelect - Callback when transaction is selected (optional)
 * @param className - Additional CSS classes (optional)
 *
 * @returns JSX element representing the transaction card
 */
export function TransactionCard({ transaction, onSelect, className }: TransactionCardProps) {
  // Implementation
}
```

---

## Accessibility Standards

### WCAG AA Compliance

**Accessible Financial Components:**
```typescript
export function TransactionCard({ transaction, onSelect }: TransactionCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Transaction: ${transaction.description}, ${formatCurrency(transaction.amount)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(transaction.id);
        }
      }}
      onClick={() => onSelect?.(transaction.id)}
    >
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-foreground">{transaction.description}</span>
          <span
            className="font-mono text-foreground"
            aria-label={`Amount: ${formatCurrency(transaction.amount)}`}
          >
            {formatCurrency(transaction.amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Color Contrast Requirements:**
```css
/* Ensure all Previa colors meet WCAG AA contrast ratios */
.text-primary {
  color: #403B31; /* Charcoal - 7.2:1 contrast ratio on cream background */
}

.text-secondary {
  color: #595347; /* Dark Stone - 5.1:1 contrast ratio */
}

/* Never use stone gray (#8C877D) for important text - only 3.2:1 contrast */
.text-muted {
  color: #8C877D; /* Only for non-essential text */
}
```

---

This coding standards document ensures consistent, secure, and maintainable code across the Previa platform while optimizing for AI agent implementation and financial data accuracy.