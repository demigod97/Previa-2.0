/**
 * Analytics Mock Data for Story 7.2: Advanced Analytics Demo
 *
 * Mock data for advanced analytics charts and visualizations.
 * All monetary amounts in CENTS for precision (consistent with financial-data.ts).
 *
 * Data ranges:
 * - Spending trends: 12 months (Jan 2024 - Dec 2024)
 * - Category breakdown: Current month (October 2024)
 * - Budget vs. actual: Current month (October 2024)
 * - Cash flow forecast: 120 days (30 historical + 90 future)
 * - Tax estimation: Year to date (Jan - Oct 2024)
 * - AI insights: 5 sample insights
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MonthlySpending {
  month: string; // Format: "Jan 2024"
  monthIndex: number; // 0-11 for Date construction
  year: number;
  totalSpent: number; // in cents
  transactionCount: number;
  percentageChange?: number; // vs. previous month
}

export interface CategorySpending {
  category: string;
  amount: number; // in cents
  percentage: number;
  color: string; // Hex color for chart
  transactionCount: number;
}

export interface BudgetComparison {
  category: string;
  budgeted: number; // in cents
  actual: number; // in cents
  variance: number; // in cents (actual - budgeted)
  variancePercentage: number; // ((actual - budgeted) / budgeted) * 100
  status: 'under' | 'over' | 'on-track';
}

export interface CashFlowDataPoint {
  day: number; // Days from today (-30 to +90)
  date: string; // ISO date string
  balance: number; // in cents
  type: 'historical' | 'forecast';
  confidenceUpper?: number; // in cents (for forecast only)
  confidenceLower?: number; // in cents (for forecast only)
  event?: {
    type: 'rent' | 'salary' | 'bill';
    description: string;
  };
}

export interface TaxBracket {
  min: number; // in cents
  max: number | null; // in cents (null for top bracket)
  rate: number; // percentage (0-1)
  label: string;
  taxAmount: number; // in cents
}

export interface TaxEstimation {
  totalIncome: number; // in cents
  totalDeductions: number; // in cents
  taxableIncome: number; // in cents
  incomeTax: number; // in cents
  medicareLvy: number; // in cents (2% of taxable income)
  totalTax: number; // in cents
  brackets: TaxBracket[];
  deductionBreakdown: {
    category: string;
    amount: number; // in cents
  }[];
}

export interface AIInsight {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral' | 'tip';
  priority: number; // 1-5 (higher = more important)
}

// ============================================================================
// SPENDING TRENDS (12 MONTHS)
// ============================================================================

export const mockSpendingTrends: MonthlySpending[] = [
  { month: 'Jan 2024', monthIndex: 0, year: 2024, totalSpent: 245000, transactionCount: 42, percentageChange: undefined },
  { month: 'Feb 2024', monthIndex: 1, year: 2024, totalSpent: 289000, transactionCount: 38, percentageChange: 17.96 },
  { month: 'Mar 2024', monthIndex: 2, year: 2024, totalSpent: 356000, transactionCount: 51, percentageChange: 23.18 },
  { month: 'Apr 2024', monthIndex: 3, year: 2024, totalSpent: 298000, transactionCount: 44, percentageChange: -16.29 },
  { month: 'May 2024', monthIndex: 4, year: 2024, totalSpent: 412000, transactionCount: 56, percentageChange: 38.26 },
  { month: 'Jun 2024', monthIndex: 5, year: 2024, totalSpent: 445000, transactionCount: 62, percentageChange: 8.01 },
  { month: 'Jul 2024', monthIndex: 6, year: 2024, totalSpent: 378000, transactionCount: 49, percentageChange: -15.06 },
  { month: 'Aug 2024', monthIndex: 7, year: 2024, totalSpent: 334000, transactionCount: 47, percentageChange: -11.64 },
  { month: 'Sep 2024', monthIndex: 8, year: 2024, totalSpent: 382000, transactionCount: 52, percentageChange: 14.37 },
  { month: 'Oct 2024', monthIndex: 9, year: 2024, totalSpent: 325045, transactionCount: 48, percentageChange: -14.91 },
  { month: 'Nov 2024', monthIndex: 10, year: 2024, totalSpent: 291000, transactionCount: 41, percentageChange: -10.47 },
  { month: 'Dec 2024', monthIndex: 11, year: 2024, totalSpent: 456000, transactionCount: 59, percentageChange: 56.70 },
];

// ============================================================================
// CATEGORY BREAKDOWN (CURRENT MONTH - OCTOBER 2024)
// ============================================================================

export const mockCategoryBreakdown: CategorySpending[] = [
  { category: 'Groceries', amount: 104000, percentage: 32, color: '#10B981', transactionCount: 15 },
  { category: 'Dining', amount: 58500, percentage: 18, color: '#F59E0B', transactionCount: 8 },
  { category: 'Fuel', amount: 48800, percentage: 15, color: '#EF4444', transactionCount: 6 },
  { category: 'Shopping', amount: 39000, percentage: 12, color: '#8B5CF6', transactionCount: 9 },
  { category: 'Utilities', amount: 32500, percentage: 10, color: '#3B82F6', transactionCount: 4 },
  { category: 'Transport', amount: 26000, percentage: 8, color: '#EC4899', transactionCount: 4 },
  { category: 'Other', amount: 16245, percentage: 5, color: '#6B7280', transactionCount: 2 },
];

// Total should match October spending: $3,250.45 = 325045 cents
export const mockCategoryTotal = mockCategoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);

// ============================================================================
// BUDGET VS. ACTUAL (CURRENT MONTH - OCTOBER 2024)
// ============================================================================

export const mockBudgetComparison: BudgetComparison[] = [
  {
    category: 'Groceries',
    budgeted: 120000, // $1,200
    actual: 104000,   // $1,040
    variance: -16000, // Under budget by $160
    variancePercentage: -13.33,
    status: 'under',
  },
  {
    category: 'Dining',
    budgeted: 50000,  // $500
    actual: 58500,    // $585
    variance: 8500,   // Over budget by $85
    variancePercentage: 17.0,
    status: 'over',
  },
  {
    category: 'Fuel',
    budgeted: 40000,  // $400
    actual: 48800,    // $488
    variance: 8800,   // Over budget by $88
    variancePercentage: 22.0,
    status: 'over',
  },
  {
    category: 'Shopping',
    budgeted: 50000,  // $500
    actual: 39000,    // $390
    variance: -11000, // Under budget by $110
    variancePercentage: -22.0,
    status: 'under',
  },
  {
    category: 'Utilities',
    budgeted: 35000,  // $350
    actual: 32500,    // $325
    variance: -2500,  // Under budget by $25
    variancePercentage: -7.14,
    status: 'under',
  },
  {
    category: 'Transport',
    budgeted: 30000,  // $300
    actual: 26000,    // $260
    variance: -4000,  // Under budget by $40
    variancePercentage: -13.33,
    status: 'under',
  },
];

// ============================================================================
// CASH FLOW FORECAST (120 DAYS: 30 HISTORICAL + 90 FORECAST)
// ============================================================================

export const generateCashFlowForecast = (): CashFlowDataPoint[] => {
  const today = new Date('2024-10-28'); // Demo reference date
  const forecast: CashFlowDataPoint[] = [];

  let balance = 1000000; // Starting balance: $10,000

  // Historical data (last 30 days)
  for (let i = -30; i < 0; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Random daily spending between $50-$200
    const dailyChange = -Math.floor(Math.random() * 15000 + 5000);
    balance += dailyChange;

    // Add random income deposits every ~7 days
    if (i % 7 === 0) {
      balance += 150000; // $1,500 income
    }

    forecast.push({
      day: i,
      date: date.toISOString().split('T')[0],
      balance,
      type: 'historical',
    });
  }

  // Current day
  const currentBalance = balance;
  forecast.push({
    day: 0,
    date: today.toISOString().split('T')[0],
    balance: currentBalance,
    type: 'forecast',
    confidenceUpper: currentBalance,
    confidenceLower: currentBalance,
  });

  // Forecast (next 90 days)
  balance = currentBalance;

  for (let i = 1; i <= 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Projected daily spending with slight trend upward
    const dailyChange = -Math.floor(Math.random() * 15000 + 8000);
    balance += dailyChange;

    // Add known events
    let event: CashFlowDataPoint['event'] | undefined;

    // Rent on day 3 and day 33
    if (i === 3 || i === 33) {
      balance -= 180000; // $1,800 rent
      event = { type: 'rent', description: 'Rent payment' };
    }

    // Salary on day 14, 44, 74
    if (i === 14 || i === 44 || i === 74) {
      balance += 250000; // $2,500 salary
      event = { type: 'salary', description: 'Salary deposit' };
    }

    // Utility bill on day 20 and day 65
    if (i === 20 || i === 65) {
      balance -= 25000; // $250 utilities
      event = { type: 'bill', description: 'Utility bill' };
    }

    // Confidence band widens over time (uncertainty increases)
    const uncertaintyFactor = i / 90; // 0 to 1
    const baseUncertainty = 50000; // $500 base
    const maxUncertainty = 150000; // $1,500 max
    const uncertainty = baseUncertainty + (uncertaintyFactor * (maxUncertainty - baseUncertainty));

    forecast.push({
      day: i,
      date: date.toISOString().split('T')[0],
      balance,
      type: 'forecast',
      confidenceUpper: balance + uncertainty,
      confidenceLower: balance - uncertainty,
      event,
    });
  }

  return forecast;
};

export const mockCashFlowForecast = generateCashFlowForecast();

// ============================================================================
// TAX ESTIMATION (ATO 2024-25 TAX YEAR)
// ============================================================================

export const mockTaxEstimation: TaxEstimation = {
  totalIncome: 6500000,      // $65,000 YTD
  totalDeductions: 450000,    // $4,500
  taxableIncome: 6350000,     // $63,500 (after deductions)
  incomeTax: 1157600,         // $11,576 (calculated from brackets)
  medicareLvy: 127000,        // $1,270 (2% of taxable income)
  totalTax: 1284600,          // $12,846 total

  // ATO 2024-25 Tax Brackets (https://www.ato.gov.au/rates/individual-income-tax-rates/)
  brackets: [
    {
      min: 0,
      max: 1820000,      // $18,200
      rate: 0,
      label: '$0 - $18,200 (Tax-free threshold)',
      taxAmount: 0,
    },
    {
      min: 1820000,
      max: 4500000,      // $45,000
      rate: 0.19,
      label: '$18,201 - $45,000 (19%)',
      taxAmount: 509200, // $5,092
    },
    {
      min: 4500000,
      max: 13500000,     // $135,000
      rate: 0.325,
      label: '$45,001 - $135,000 (32.5%)',
      taxAmount: 601250, // $6,012.50 (on $63,500, only $18,500 in this bracket)
    },
    {
      min: 13500000,
      max: 19000000,     // $190,000
      rate: 0.37,
      label: '$135,001 - $190,000 (37%)',
      taxAmount: 0,      // Not in this bracket
    },
    {
      min: 19000000,
      max: null,         // $190,000+
      rate: 0.45,
      label: '$190,001+ (45%)',
      taxAmount: 0,      // Not in this bracket
    },
  ],

  deductionBreakdown: [
    { category: 'Home Office', amount: 250000 },        // $2,500
    { category: 'Work-related Travel', amount: 120000 }, // $1,200
    { category: 'Self-education', amount: 80000 },       // $800
  ],
};

// Recalculate tax brackets correctly
const recalculateTaxBrackets = (taxableIncome: number): TaxBracket[] => {
  const brackets: TaxBracket[] = [
    { min: 0, max: 1820000, rate: 0, label: '$0 - $18,200 (Tax-free threshold)', taxAmount: 0 },
    { min: 1820001, max: 4500000, rate: 0.19, label: '$18,201 - $45,000 (19%)', taxAmount: 0 },
    { min: 4500001, max: 13500000, rate: 0.325, label: '$45,001 - $135,000 (32.5%)', taxAmount: 0 },
    { min: 13500001, max: 19000000, rate: 0.37, label: '$135,001 - $190,000 (37%)', taxAmount: 0 },
    { min: 19000001, max: null, rate: 0.45, label: '$190,001+ (45%)', taxAmount: 0 },
  ];

  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketIncome = bracket.max
      ? Math.min(remainingIncome, bracket.max - bracket.min)
      : remainingIncome;

    bracket.taxAmount = Math.floor(bracketIncome * bracket.rate);
    remainingIncome -= bracketIncome;
  }

  return brackets;
};

mockTaxEstimation.brackets = recalculateTaxBrackets(mockTaxEstimation.taxableIncome);
mockTaxEstimation.incomeTax = mockTaxEstimation.brackets.reduce((sum, b) => sum + b.taxAmount, 0);
mockTaxEstimation.totalTax = mockTaxEstimation.incomeTax + mockTaxEstimation.medicareLvy;

// ============================================================================
// AI-GENERATED INSIGHTS (5 SAMPLE INSIGHTS)
// ============================================================================

export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-001',
    icon: '📊',
    title: 'Grocery Spending Above Average',
    description: 'Your grocery spending is 15% higher than average Australian households ($900/month). Consider meal planning to reduce costs.',
    type: 'neutral',
    priority: 3,
  },
  {
    id: 'insight-002',
    icon: '🔥',
    title: 'Fuel Costs Rising',
    description: "You've spent $488 on fuel this month. Consider public transport or carpooling to save $200/month.",
    type: 'tip',
    priority: 2,
  },
  {
    id: 'insight-003',
    icon: '💡',
    title: 'Dining Expenses Increasing',
    description: 'Dining expenses up 25% vs. last month. Meal prep could save $150/week.',
    type: 'warning',
    priority: 4,
  },
  {
    id: 'insight-004',
    icon: '✅',
    title: 'Excellent Budgeting!',
    description: "Great job! You're under budget in 4 out of 6 categories this month. Keep up the good work!",
    type: 'positive',
    priority: 5,
  },
  {
    id: 'insight-005',
    icon: '⚠️',
    title: 'Cash Flow Warning',
    description: 'Cash flow dip expected in 2 weeks due to rent payment. Consider postponing non-essential $500 purchase.',
    type: 'warning',
    priority: 5,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format cents to AUD currency string
 * @param cents Amount in cents
 * @returns Formatted string (e.g., "$1,234.56")
 */
export const formatCurrency = (cents: number): string => {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Get mock data for a specific time period
 * @param period Time period key
 * @returns Filtered spending trends
 */
export const getSpendingByPeriod = (
  period: 'this-month' | 'last-month' | 'last-3-months' | 'last-6-months' | 'last-12-months' | 'ytd'
): MonthlySpending[] => {
  const now = new Date('2024-10-28'); // Demo reference date
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  switch (period) {
    case 'this-month':
      return mockSpendingTrends.filter(
        (m) => m.monthIndex === currentMonth && m.year === currentYear
      );
    case 'last-month':
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return mockSpendingTrends.filter(
        (m) => m.monthIndex === lastMonth && m.year === lastMonthYear
      );
    case 'last-3-months':
      return mockSpendingTrends.slice(-3);
    case 'last-6-months':
      return mockSpendingTrends.slice(-6);
    case 'last-12-months':
      return mockSpendingTrends;
    case 'ytd':
      return mockSpendingTrends.filter((m) => m.year === currentYear);
    default:
      return mockSpendingTrends;
  }
};
