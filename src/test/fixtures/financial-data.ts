/**
 * Test Fixtures for Previa Financial Platform
 * 
 * Mock data for testing financial features during development.
 * These fixtures follow the financial schema defined in:
 * supabase/migrations/20250109000001_create_financial_schema.sql
 */

// ============================================================================
// USER TIERS
// ============================================================================

export const mockUserTiers = {
  freeTier: {
    id: 'test-tier-free-001',
    user_id: 'test-user-001',
    tier: 'user',
    accounts_limit: 3,
    transactions_monthly_limit: 50,
    receipts_monthly_limit: 10,
    upgraded_at: null,
    expires_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  premiumTier: {
    id: 'test-tier-premium-001',
    user_id: 'test-user-premium-001',
    tier: 'premium_user',
    accounts_limit: 999999, // Effectively unlimited
    transactions_monthly_limit: 999999,
    receipts_monthly_limit: 999999,
    upgraded_at: '2024-01-15T10:30:00Z',
    expires_at: '2025-01-15T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  }
};

// ============================================================================
// BANK ACCOUNTS
// ============================================================================

export const mockBankAccounts = [
  {
    id: 'test-account-001',
    user_id: 'test-user-001',
    institution: 'Commonwealth Bank',
    account_name: 'Everyday Account',
    account_number_masked: '1234',
    balance: 5430.50,
    currency: 'AUD',
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-31T18:00:00Z'
  },
  {
    id: 'test-account-002',
    user_id: 'test-user-001',
    institution: 'ANZ',
    account_name: 'Savings Account',
    account_number_masked: '5678',
    balance: 12500.00,
    currency: 'AUD',
    created_at: '2024-01-05T08:15:00Z',
    updated_at: '2024-01-31T18:00:00Z'
  },
  {
    id: 'test-account-003',
    user_id: 'test-user-001',
    institution: 'Westpac',
    account_name: 'Credit Card',
    account_number_masked: '9012',
    balance: -845.30,
    currency: 'AUD',
    created_at: '2024-01-05T08:30:00Z',
    updated_at: '2024-01-31T18:00:00Z'
  }
];

// ============================================================================
// BANK STATEMENTS
// ============================================================================

export const mockBankStatements = [
  {
    id: 'test-statement-001',
    bank_account_id: 'test-account-001',
    user_id: 'test-user-001',
    period_start: '2024-01-01',
    period_end: '2024-01-31',
    file_path: 'test/fixtures/commbank-statement-jan-2024.pdf',
    file_size: 245680,
    processing_status: 'completed',
    extraction_confidence: 0.94,
    extracted_at: '2024-02-01T09:00:00Z',
    created_at: '2024-02-01T08:45:00Z'
  },
  {
    id: 'test-statement-002',
    bank_account_id: 'test-account-002',
    user_id: 'test-user-001',
    period_start: '2024-01-01',
    period_end: '2024-01-31',
    file_path: 'test/fixtures/anz-statement-jan-2024.pdf',
    file_size: 189420,
    processing_status: 'completed',
    extraction_confidence: 0.91,
    extracted_at: '2024-02-01T09:15:00Z',
    created_at: '2024-02-01T09:00:00Z'
  }
];

// ============================================================================
// TRANSACTIONS
// ============================================================================

export const mockTransactions = [
  // Grocery transactions
  {
    id: 'test-tx-001',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-15',
    amount: -45.50,
    description: 'Woolworths Sydney CBD',
    category: 'Groceries',
    status: 'matched',
    created_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 'test-tx-002',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-18',
    amount: -58.30,
    description: 'Coles Bondi Junction',
    category: 'Groceries',
    status: 'unreconciled',
    created_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 'test-tx-003',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-22',
    amount: -24.00,
    description: 'Aldi Surry Hills',
    category: 'Groceries',
    status: 'approved',
    created_at: '2024-02-01T09:00:00Z'
  },
  
  // Transport transactions
  {
    id: 'test-tx-004',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-16',
    amount: -68.00,
    description: 'Shell Coles Express',
    category: 'Transport',
    status: 'matched',
    created_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 'test-tx-005',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-23',
    amount: -50.00,
    description: 'Opal Card Top Up',
    category: 'Transport',
    status: 'unreconciled',
    created_at: '2024-02-01T09:00:00Z'
  },

  // Dining out
  {
    id: 'test-tx-006',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-19',
    amount: -35.80,
    description: 'Thai Pothong Restaurant',
    category: 'Dining',
    status: 'unreconciled',
    created_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 'test-tx-007',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-20',
    amount: -12.50,
    description: 'McDonald\'s Circular Quay',
    category: 'Dining',
    status: 'matched',
    created_at: '2024-02-01T09:00:00Z'
  },

  // Subscriptions
  {
    id: 'test-tx-008',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-10',
    amount: -14.99,
    description: 'Netflix.com',
    category: 'Entertainment',
    status: 'approved',
    created_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 'test-tx-009',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-10',
    amount: -9.99,
    description: 'Spotify Premium',
    category: 'Entertainment',
    status: 'approved',
    created_at: '2024-02-01T09:00:00Z'
  },

  // Income
  {
    id: 'test-tx-010',
    bank_statement_id: 'test-statement-001',
    user_id: 'test-user-001',
    transaction_date: '2024-01-25',
    amount: 3500.00,
    description: 'Salary - Acme Corp',
    category: 'Income',
    status: 'approved',
    created_at: '2024-02-01T09:00:00Z'
  }
];

// ============================================================================
// RECEIPTS
// ============================================================================

export const mockReceipts = [
  {
    id: 'test-receipt-001',
    user_id: 'test-user-001',
    merchant: 'Woolworths',
    receipt_date: '2024-01-15',
    amount: 45.50,
    tax: 4.14,
    file_path: 'test/fixtures/woolworths-receipt-20240115.jpg',
    file_size: 156789,
    processing_status: 'completed',
    confidence_score: 0.95,
    ocr_data: {
      raw_text: 'WOOLWORTHS\nSYDNEY CBD\nDate: 15/01/2024\nTotal: $45.50\nGST: $4.14',
      line_items: [
        { description: 'Bread', amount: 4.50 },
        { description: 'Milk 2L', amount: 5.00 },
        { description: 'Fresh Produce', amount: 36.00 }
      ]
    },
    created_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'test-receipt-002',
    user_id: 'test-user-001',
    merchant: 'Shell Coles Express',
    receipt_date: '2024-01-16',
    amount: 68.00,
    tax: 6.18,
    file_path: 'test/fixtures/shell-receipt-20240116.jpg',
    file_size: 123456,
    processing_status: 'completed',
    confidence_score: 0.92,
    ocr_data: {
      raw_text: 'Shell\nColes Express\nDate: 16/01/2024\nUnleaded: 50L @ $1.36/L\nTotal: $68.00',
      line_items: [
        { description: 'Unleaded 91', amount: 68.00 }
      ]
    },
    created_at: '2024-01-16T10:15:00Z'
  },
  {
    id: 'test-receipt-003',
    user_id: 'test-user-001',
    merchant: 'Aldi',
    receipt_date: '2024-01-22',
    amount: 24.00,
    tax: 2.18,
    file_path: 'test/fixtures/aldi-receipt-20240122.jpg',
    file_size: 98765,
    processing_status: 'completed',
    confidence_score: 0.89,
    ocr_data: {
      raw_text: 'ALDI\nSurry Hills\nDate: 22/01/2024\nTotal: $24.00',
      line_items: []
    },
    created_at: '2024-01-22T16:45:00Z'
  },
  {
    id: 'test-receipt-004',
    user_id: 'test-user-001',
    merchant: 'McDonald\'s',
    receipt_date: '2024-01-20',
    amount: 12.50,
    tax: 1.14,
    file_path: 'test/fixtures/mcdonalds-receipt-20240120.jpg',
    file_size: 87654,
    processing_status: 'completed',
    confidence_score: 0.93,
    ocr_data: {
      raw_text: 'McDonald\'s\nCircular Quay\nDate: 20/01/2024\nTotal: $12.50',
      line_items: [
        { description: 'Big Mac Meal', amount: 12.50 }
      ]
    },
    created_at: '2024-01-20T13:00:00Z'
  },
  {
    id: 'test-receipt-005',
    user_id: 'test-user-001',
    merchant: 'Coles',
    receipt_date: '2024-01-18',
    amount: 58.30,
    tax: 5.30,
    file_path: 'test/fixtures/coles-receipt-20240118.pdf',
    file_size: 234567,
    processing_status: 'pending',
    confidence_score: null,
    ocr_data: null,
    created_at: '2024-01-18T11:00:00Z'
  }
];

// ============================================================================
// RECONCILIATION MATCHES
// ============================================================================

export const mockReconciliationMatches = [
  {
    id: 'test-match-001',
    user_id: 'test-user-001',
    transaction_id: 'test-tx-001',
    receipt_id: 'test-receipt-001',
    confidence: 0.97,
    status: 'approved',
    reviewer_id: 'test-user-001',
    reviewed_at: '2024-02-01T10:00:00Z',
    created_at: '2024-02-01T09:30:00Z'
  },
  {
    id: 'test-match-002',
    user_id: 'test-user-001',
    transaction_id: 'test-tx-004',
    receipt_id: 'test-receipt-002',
    confidence: 0.96,
    status: 'approved',
    reviewer_id: 'test-user-001',
    reviewed_at: '2024-02-01T10:05:00Z',
    created_at: '2024-02-01T09:35:00Z'
  },
  {
    id: 'test-match-003',
    user_id: 'test-user-001',
    transaction_id: 'test-tx-007',
    receipt_id: 'test-receipt-004',
    confidence: 0.98,
    status: 'suggested',
    reviewer_id: null,
    reviewed_at: null,
    created_at: '2024-02-01T09:40:00Z'
  },
  {
    id: 'test-match-004',
    user_id: 'test-user-001',
    transaction_id: 'test-tx-003',
    receipt_id: 'test-receipt-003',
    confidence: 0.92,
    status: 'rejected',
    reviewer_id: 'test-user-001',
    reviewed_at: '2024-02-01T10:10:00Z',
    created_at: '2024-02-01T09:45:00Z'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all unreconciled transactions
 */
export const getUnreconciledTransactions = () => {
  return mockTransactions.filter(tx => tx.status === 'unreconciled');
};

/**
 * Get all pending receipts
 */
export const getPendingReceipts = () => {
  return mockReceipts.filter(receipt => receipt.processing_status === 'pending');
};

/**
 * Get transactions by category
 */
export const getTransactionsByCategory = (category: string) => {
  return mockTransactions.filter(tx => tx.category === category);
};

/**
 * Calculate total spending by category
 */
export const getTotalSpendingByCategory = () => {
  const spending: Record<string, number> = {};
  mockTransactions.forEach(tx => {
    if (tx.amount < 0 && tx.category) {
      spending[tx.category] = (spending[tx.category] || 0) + Math.abs(tx.amount);
    }
  });
  return spending;
};

/**
 * Get summary statistics
 */
export const getMockStatistics = () => {
  const totalTransactions = mockTransactions.length;
  const totalReceipts = mockReceipts.length;
  const totalMatches = mockReconciliationMatches.length;
  const unreconciledCount = getUnreconciledTransactions().length;
  const automationRate = totalMatches / totalTransactions;

  return {
    totalTransactions,
    totalReceipts,
    totalMatches,
    unreconciledCount,
    automationRate: Math.round(automationRate * 100)
  };
};

