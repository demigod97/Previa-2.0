# Previa Testing Guide

**Last Updated:** 2025-01-10
**Purpose:** Comprehensive guide for testing financial features in Previa

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Infrastructure Setup](#test-infrastructure-setup)
3. [Test Types](#test-types)
4. [Financial Testing Patterns](#financial-testing-patterns)
5. [Using Mock Data](#using-mock-data)
6. [Supabase Mocking](#supabase-mocking)
7. [RLS Policy Testing](#rls-policy-testing)
8. [Running Tests](#running-tests)
9. [Troubleshooting](#troubleshooting)

---

## Testing Philosophy

Previa's testing strategy follows these core principles:

1. **Financial Accuracy First**: All monetary calculations use integer cents to prevent floating-point errors
2. **Security Through Testing**: RLS policies MUST be tested with real database, not mocks
3. **Fast Feedback**: Unit tests should run in milliseconds, integration tests in seconds
4. **Deterministic**: Tests must be repeatable and never flaky
5. **Type Safety**: All test code is TypeScript for compile-time safety

---

## Test Infrastructure Setup

### Installation

Testing infrastructure is pre-configured with:
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing
- **jsdom**: DOM environment for tests

### Test Scripts

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests in watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Configuration

Test configuration is in `vitest.config.ts`:
- Environment: jsdom (for DOM testing)
- Setup file: `src/test-setup.ts` (global test setup)
- Coverage: text, json, and HTML reporters
- Path aliases: `@/` points to `src/`

---

## Test Types

### Unit Tests

**Purpose**: Test individual functions and utilities in isolation

**Location**: `src/test/samples/financial-calculations.test.ts` (example)

**When to use**:
- Financial calculation logic
- Utility functions
- Data transformations
- Validation logic

**Example**:
```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, addCurrencyAmounts } from '@/lib/currency';

describe('Currency Utilities', () => {
  it('formats cents as AUD currency', () => {
    expect(formatCurrency(1050)).toBe('$10.50');
  });

  it('adds amounts without floating-point errors', () => {
    const total = addCurrencyAmounts(1050, 2400, 6800);
    expect(total).toBe(10250); // $102.50 in cents
  });
});
```

### Component Tests

**Purpose**: Test React components in isolation with mocked dependencies

**Location**: `src/test/samples/transaction-component.test.tsx` (example)

**When to use**:
- React component rendering
- User interactions
- Component state management
- Props handling

**Example**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/test-utils';
import { TransactionCard } from '@/components/financial/TransactionCard';
import { mockTransactions } from '@/test/fixtures/financial-data';

describe('TransactionCard', () => {
  it('displays transaction amount in AUD format', () => {
    renderWithProviders(<TransactionCard transaction={mockTransactions[0]} />);
    
    expect(screen.getByText('-$45.50')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const mockOnSelect = vi.fn();
    renderWithProviders(
      <TransactionCard 
        transaction={mockTransactions[0]} 
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockTransactions[0].id);
  });
});
```

### Integration Tests (RLS)

**Purpose**: Test database operations with real Supabase and RLS enforcement

**Location**: `src/test/samples/rls-policy-integration.test.ts` (example)

**When to use**:
- Row Level Security policy validation
- Multi-user data isolation
- Authentication flows
- Database CRUD operations

**Critical**: RLS tests MUST use real Supabase dev branch, not mocks!

**Example**:
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { 
  createTestSupabaseClient, 
  signInTestUser,
  cleanupTestData 
} from '@/test/utils';

describe('RLS Policy Tests', () => {
  beforeAll(async () => {
    await cleanupTestData(['transactions']);
  });

  it('users can only access their own transactions', async () => {
    const client = createTestSupabaseClient();
    await signInTestUser(client, 'freeUser');

    const { data, error } = await client
      .from('transactions')
      .select('*');

    expect(error).toBeNull();
    // RLS ensures only user's own data is returned
    data?.forEach(tx => {
      expect(tx.user_id).toBe('test-user-001');
    });
  });
});
```

---

## Financial Testing Patterns

### Integer Cents Requirement

**CRITICAL**: All financial amounts MUST be stored as integer cents.

```typescript
// ✅ CORRECT: Integer cents
const amount = 1050; // $10.50
const tax = Math.round(amount * 0.1); // $1.05 in cents

// ❌ INCORRECT: Floating point
const amount = 10.50;
const tax = amount * 0.10; // May produce 1.0499999999998
```

### Testing Currency Calculations

```typescript
describe('Financial Calculations', () => {
  it('maintains precision in complex calculations', () => {
    const subtotal = 4550; // $45.50
    const gst = Math.round(subtotal * 0.1); // $4.55
    const total = subtotal + gst; // $50.05
    
    expect(total).toBe(5005);
    expect(formatCurrency(total)).toBe('$50.05');
  });

  it('handles reconciliation tolerance', () => {
    const receiptAmount = 4550; // $45.50
    const transactionAmount = 4551; // $45.51 (1 cent difference)
    
    const difference = Math.abs(receiptAmount - transactionAmount);
    const withinTolerance = difference <= 2; // Allow 2 cents
    
    expect(withinTolerance).toBe(true);
  });
});
```

### Testing Currency Formatting

```typescript
it('formats negative amounts (expenses) correctly', () => {
  expect(formatCurrency(-4550)).toBe('-$45.50');
});

it('always shows two decimal places', () => {
  expect(formatCurrency(5000)).toBe('$50.00'); // Not $50
});

it('handles thousand separators', () => {
  expect(formatCurrency(1250000)).toBe('$12,500.00');
});
```

---

## Using Mock Data

### Mock Data Fixtures

All mock data is in `src/test/fixtures/financial-data.ts`:

```typescript
import { 
  mockTransactions, 
  mockReceipts,
  mockBankAccounts,
  mockUserTiers,
  getEdgeCaseFixtures 
} from '@/test/fixtures/financial-data';

describe('Transaction Processing', () => {
  it('processes successful transaction', () => {
    const transaction = mockTransactions[0]; // Woolworths
    expect(transaction.amount).toBe(-4550); // -$45.50 in cents
  });

  it('handles failed OCR', () => {
    const { receipts } = getEdgeCaseFixtures();
    const failedReceipt = receipts.failedOCR;
    
    expect(failedReceipt.processing_status).toBe('failed');
    expect(failedReceipt.confidence_score).toBeLessThan(0.9);
  });
});
```

### Available Mock Data

**Standard Fixtures**:
- `mockUserTiers`: Free and premium tier examples
- `mockBankAccounts`: 3 Australian banks (CBA, ANZ, Westpac)
- `mockBankStatements`: PDF and CSV statement examples
- `mockTransactions`: 10 varied transactions (groceries, transport, income)
- `mockReceipts`: 5 receipts with OCR data
- `mockReconciliationMatches`: 4 confidence levels

**Edge Case Fixtures**:
- `mockFailedOCRReceipt`: OCR confidence below threshold
- `mockTimeoutReceipt`: Processing timeout scenario
- `mockInvalidFormatReceipt`: Unsupported file type
- `mockLowConfidenceReceipt`: Partial OCR success
- `mockCorruptedBankStatement`: Corrupted file
- `mockNetworkFailureUpload`: Network interruption
- `mockPerfectMatch`: 100% reconciliation confidence
- `mockPoorMatch`: Low confidence match

### Helper Functions

```typescript
// Get specific transaction types
const groceryTransactions = getTransactionsByCategory('Groceries');

// Get pending receipts
const pendingReceipts = getPendingReceipts();

// Get unreconciled transactions
const unreconciled = getUnreconciledTransactions();

// Get statistics
const stats = getMockStatistics();
```

---

## Supabase Mocking

### For Unit Tests (Mock Client)

Use mock Supabase client for unit tests:

```typescript
import { createMockSupabaseClient } from '@/test/utils/mock-supabase';
import { mockTransactions } from '@/test/fixtures/financial-data';

const mockClient = createMockSupabaseClient({
  transactions: mockTransactions,
  receipts: mockReceipts
});

// Mock client simulates Supabase API
const { data, error } = await mockClient
  .from('transactions')
  .select('*')
  .eq('user_id', 'test-user-001');
```

### Mock Authentication

```typescript
import { mockAuth } from '@/test/utils/mock-supabase';

const mockUser = mockAuth.createMockUser({
  email: 'custom@example.com'
});

const mockSession = mockAuth.createMockSession(mockUser);
```

### Mock File Uploads

```typescript
import { mockFileUpload } from '@/test/utils/mock-supabase';

const pdfFile = mockFileUpload.createMockPDF('statement.pdf', 245680);
const imageFile = mockFileUpload.createMockImage('receipt.jpg', 156789);
const invalidFile = mockFileUpload.createMockInvalidFile('doc.docx', 50000);
```

---

## RLS Policy Testing

### Setup Test Database

**CRITICAL**: RLS tests require a real Supabase development branch.

```bash
# 1. Create development branch
supabase branches create dev-testing

# 2. Get branch credentials
supabase branches list

# 3. Create .env.test.local (NEVER commit this file)
VITE_SUPABASE_TEST_URL=your-dev-branch-url
VITE_SUPABASE_TEST_ANON_KEY=your-dev-branch-anon-key
VITE_SUPABASE_TEST_SERVICE_ROLE_KEY=your-dev-branch-service-role-key
```

### Writing RLS Tests

```typescript
import { 
  createTestSupabaseClient,
  signInTestUser,
  seedTestData,
  cleanupTestData 
} from '@/test/utils';

describe('RLS Tests', () => {
  beforeAll(async () => {
    // Seed test data using service role (bypasses RLS)
    await seedTestData('transactions', mockTransactions);
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(['transactions']);
  });

  it('enforces user data isolation', async () => {
    // Create client with RLS enforcement
    const client = createTestSupabaseClient();
    
    // Sign in as specific user
    await signInTestUser(client, 'freeUser');
    
    // Query should only return this user's data
    const { data } = await client.from('transactions').select('*');
    
    data?.forEach(tx => {
      expect(tx.user_id).toBe('test-user-001');
    });
  });
});
```

### RLS Test Best Practices

1. **Always clean up**: Use `cleanupTestData` in `afterAll` hooks
2. **Test both positive and negative cases**: Verify access AND denial
3. **Test concurrent users**: Multiple users shouldn't see each other's data
4. **Test unauthorized access**: Unauthenticated users should be blocked
5. **Test tier enforcement**: Free vs premium limits

---

## Running Tests

### Development Workflow

```bash
# Start watch mode
npm run test:watch

# Filter by test name
npm test -- --grep "currency"

# Run specific test file
npm test -- src/test/samples/financial-calculations.test.ts

# Run only RLS tests (requires dev branch)
npm test -- src/test/samples/rls-policy-integration.test.ts
```

### CI/CD Pipeline

```bash
# Run all tests once
npm run test:run

# Generate coverage report
npm run test:coverage

# Fail if coverage below threshold
npm run test:coverage -- --coverage.thresholds.lines=80
```

### Skip RLS Tests

If test database is not configured:

```bash
# Skip RLS integration tests
SKIP_RLS_TESTS=true npm test
```

---

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module '@/...'"

**Solution**: Path alias not configured. Check `vitest.config.ts` has:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

**Issue**: Financial calculation tests fail with precision errors

**Solution**: Ensure ALL amounts are integer cents, never floating-point:
```typescript
// ✅ CORRECT
const amount = 1050; // $10.50 in cents

// ❌ INCORRECT
const amount = 10.50;
```

---

**Issue**: RLS tests are skipped

**Solution**: Set up test database and environment variables:
1. Create Supabase dev branch
2. Add credentials to `.env.test.local`
3. Run tests normally (SKIP_RLS_TESTS should be false/unset)

---

**Issue**: Mock data types don't match database schema

**Solution**: Regenerate Supabase types:
```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

---

**Issue**: Tests hang or timeout

**Solution**: Check for:
1. Unresolved promises
2. Missing `await` keywords
3. Infinite loops in components
4. Network requests without mocks

---

**Issue**: Coverage report missing files

**Solution**: Check `vitest.config.ts` coverage.exclude doesn't exclude too much:
```typescript
coverage: {
  exclude: [
    'node_modules/',
    'src/test/',      // Exclude test files
    'dist/',          // Exclude build
    '**/*.d.ts',      // Exclude type definitions
    '**/*.config.*',  // Exclude configs
    '**/test-setup.ts'
  ]
}
```

---

## Additional Resources

- **Vitest Documentation**: https://vitest.dev/
- **React Testing Library**: https://testing-library.com/react
- **Supabase Testing Guide**: https://supabase.com/docs/guides/testing
- **Previa Coding Standards**: `docs/architecture/coding-standards.md`
- **Previa Architecture**: `docs/architecture/`

---

## Testing Checklist

Before merging code, ensure:

- [ ] All unit tests pass
- [ ] New features have corresponding tests
- [ ] Financial calculations use integer cents
- [ ] Currency formatting is tested
- [ ] Component tests cover user interactions
- [ ] RLS policies tested with real database
- [ ] Edge cases are covered
- [ ] Test coverage meets threshold (80%+ for financial code)
- [ ] Tests are deterministic (no random failures)
- [ ] Tests clean up after themselves

---

**Remember**: In financial software, untested code is a liability. Write tests first!

