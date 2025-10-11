import {
  OCR_ACCOUNT_NUMBER_THRESHOLD,
  OCR_RECEIPT_DATA_THRESHOLD,
  RECONCILIATION_AUTO_APPROVE_THRESHOLD,
  RECONCILIATION_SUGGEST_THRESHOLD,
  RECONCILIATION_WEIGHTS,
  TIER_LIMITS,
  MAX_FILE_SIZE,
  SUPPORTED_STATEMENT_FORMATS,
  SUPPORTED_RECEIPT_FORMATS,
  PROCESSING_TIMEOUT,
  MAX_DATE_DIFFERENCE_DAYS,
  MAX_AMOUNT_DIFFERENCE,
  ERROR_MESSAGES,
} from '@/config/constants';

describe('Constants Exports & Structure', () => {
  it('exports OCR thresholds', () => {
    expect(OCR_ACCOUNT_NUMBER_THRESHOLD).toBeDefined();
    expect(OCR_RECEIPT_DATA_THRESHOLD).toBeDefined();
  });

  it('exports reconciliation thresholds and weights', () => {
    expect(RECONCILIATION_AUTO_APPROVE_THRESHOLD).toBeDefined();
    expect(RECONCILIATION_SUGGEST_THRESHOLD).toBeDefined();
    expect(RECONCILIATION_WEIGHTS).toBeDefined();
  });

  it('exports tier limits', () => {
    expect(TIER_LIMITS.FREE).toBeDefined();
    expect(TIER_LIMITS.PREMIUM).toBeDefined();
  });

  it('exports file processing configuration', () => {
    expect(MAX_FILE_SIZE).toBeDefined();
    expect(SUPPORTED_STATEMENT_FORMATS).toBeDefined();
    expect(SUPPORTED_RECEIPT_FORMATS).toBeDefined();
    expect(PROCESSING_TIMEOUT).toBeDefined();
  });
});

describe('OCR Thresholds', () => {
  it('use 0.90 thresholds', () => {
    expect(OCR_ACCOUNT_NUMBER_THRESHOLD).toBe(0.90);
    expect(OCR_RECEIPT_DATA_THRESHOLD).toBe(0.90);
  });

  it('are within 0..1', () => {
    expect(OCR_ACCOUNT_NUMBER_THRESHOLD).toBeGreaterThanOrEqual(0);
    expect(OCR_ACCOUNT_NUMBER_THRESHOLD).toBeLessThanOrEqual(1);
    expect(OCR_RECEIPT_DATA_THRESHOLD).toBeGreaterThanOrEqual(0);
    expect(OCR_RECEIPT_DATA_THRESHOLD).toBeLessThanOrEqual(1);
  });
});

describe('Reconciliation Thresholds & Weights', () => {
  it('auto-approve 0.95 and suggest 0.70', () => {
    expect(RECONCILIATION_AUTO_APPROVE_THRESHOLD).toBe(0.95);
    expect(RECONCILIATION_SUGGEST_THRESHOLD).toBe(0.70);
    expect(RECONCILIATION_AUTO_APPROVE_THRESHOLD).toBeGreaterThan(RECONCILIATION_SUGGEST_THRESHOLD);
  });

  it('define distinct ranges', () => {
    const ranges = {
      noMatch: RECONCILIATION_SUGGEST_THRESHOLD,
      suggested: RECONCILIATION_AUTO_APPROVE_THRESHOLD - RECONCILIATION_SUGGEST_THRESHOLD,
      autoApprove: 1.0 - RECONCILIATION_AUTO_APPROVE_THRESHOLD,
    };
    expect(ranges.noMatch).toBe(0.70);
    expect(ranges.suggested).toBe(0.25);
    expect(ranges.autoApprove).toBeCloseTo(0.05, 6);
  });

  it('weights sum to 1.0 and have expected distribution', () => {
    const sum = RECONCILIATION_WEIGHTS.dateMatch + RECONCILIATION_WEIGHTS.amountMatch + RECONCILIATION_WEIGHTS.merchantMatch;
    expect(sum).toBe(1.0);
    expect(RECONCILIATION_WEIGHTS.dateMatch).toBe(0.40);
    expect(RECONCILIATION_WEIGHTS.amountMatch).toBe(0.40);
    expect(RECONCILIATION_WEIGHTS.merchantMatch).toBe(0.20);
  });
});

describe('Matching Rules', () => {
  it('date and amount difference are reasonable', () => {
    expect(MAX_DATE_DIFFERENCE_DAYS).toBe(3);
    expect(MAX_AMOUNT_DIFFERENCE).toBe(0.50);
    expect(MAX_DATE_DIFFERENCE_DAYS).toBeGreaterThanOrEqual(1);
    expect(MAX_DATE_DIFFERENCE_DAYS).toBeLessThanOrEqual(7);
    expect(MAX_AMOUNT_DIFFERENCE).toBeGreaterThan(0);
    expect(MAX_AMOUNT_DIFFERENCE).toBeLessThanOrEqual(5.0);
  });
});

describe('Tier Limits', () => {
  it('FREE tier matches schema defaults', () => {
    expect(TIER_LIMITS.FREE.accounts).toBe(3);
    expect(TIER_LIMITS.FREE.transactionsPerMonth).toBe(50);
    expect(TIER_LIMITS.FREE.receiptsPerMonth).toBe(10);
  });

  it('PREMIUM tier is effectively unlimited', () => {
    expect(TIER_LIMITS.PREMIUM.accounts).toBe(999999);
    expect(TIER_LIMITS.PREMIUM.transactionsPerMonth).toBe(999999);
    expect(TIER_LIMITS.PREMIUM.receiptsPerMonth).toBe(999999);
    expect(TIER_LIMITS.PREMIUM.accounts).toBeGreaterThan(TIER_LIMITS.FREE.accounts * 100);
  });
});

describe('File Processing Configuration', () => {
  it('has 50MB max and supported formats', () => {
    expect(MAX_FILE_SIZE).toBe(50 * 1024 * 1024);
    expect(SUPPORTED_STATEMENT_FORMATS).toEqual(['pdf', 'csv']);
    expect(SUPPORTED_RECEIPT_FORMATS).toEqual(['pdf', 'jpg', 'jpeg', 'png']);
    const maxSizeMB = MAX_FILE_SIZE / 1024 / 1024;
    expect(maxSizeMB).toBeGreaterThanOrEqual(10);
    expect(maxSizeMB).toBeLessThanOrEqual(100);
  });
});

describe('Error Messages', () => {
  it('reference constants dynamically', () => {
    const expectedMB = MAX_FILE_SIZE / 1024 / 1024;
    expect(ERROR_MESSAGES.FILE_TOO_LARGE).toContain(`${expectedMB}MB`);
    expect(ERROR_MESSAGES.ACCOUNT_LIMIT_REACHED).toContain(`${TIER_LIMITS.FREE.accounts}`);
    expect(ERROR_MESSAGES.TRANSACTION_LIMIT_REACHED).toContain(`${TIER_LIMITS.FREE.transactionsPerMonth}`);
    expect(ERROR_MESSAGES.RECEIPT_LIMIT_REACHED).toContain(`${TIER_LIMITS.FREE.receiptsPerMonth}`);
  });
});


