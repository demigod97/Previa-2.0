/**
 * Category Inference Utility
 * Maps Australian merchant names to expense categories
 */

export type ExpenseCategory =
  | 'Groceries'
  | 'Dining'
  | 'Fuel'
  | 'Transport'
  | 'Shopping'
  | 'Hardware'
  | 'Pharmacy'
  | 'Medical'
  | 'Entertainment'
  | 'Utilities'
  | 'Education'
  | 'Professional Services'
  | 'Other';

export interface MerchantPattern {
  keywords: string[];
  category: ExpenseCategory;
  priority: number; // Higher priority = checked first
}

/**
 * Australian merchant patterns for category inference
 * Ordered by priority (most specific first)
 */
const MERCHANT_PATTERNS: MerchantPattern[] = [
  // Groceries - Major supermarkets
  {
    keywords: ['woolworths', 'woolies', 'wws'],
    category: 'Groceries',
    priority: 100,
  },
  {
    keywords: ['coles', 'coles express'],
    category: 'Groceries',
    priority: 100,
  },
  {
    keywords: ['aldi'],
    category: 'Groceries',
    priority: 100,
  },
  {
    keywords: ['iga', 'independent grocers'],
    category: 'Groceries',
    priority: 100,
  },
  {
    keywords: ['foodland', 'food land'],
    category: 'Groceries',
    priority: 100,
  },
  {
    keywords: ['harris farm', 'harris farm markets'],
    category: 'Groceries',
    priority: 100,
  },

  // Fuel stations
  {
    keywords: ['bp', 'bp service station', 'bp connect'],
    category: 'Fuel',
    priority: 95,
  },
  {
    keywords: ['shell', 'shell coles express'],
    category: 'Fuel',
    priority: 95,
  },
  {
    keywords: ['caltex', 'ampol'],
    category: 'Fuel',
    priority: 95,
  },
  {
    keywords: ['7-eleven', '7 eleven', '7/11'],
    category: 'Fuel',
    priority: 95,
  },
  {
    keywords: ['united petroleum', 'united'],
    category: 'Fuel',
    priority: 95,
  },

  // Hardware
  {
    keywords: ['bunnings', 'bunnings warehouse'],
    category: 'Hardware',
    priority: 100,
  },
  {
    keywords: ['mitre 10', 'mitre10'],
    category: 'Hardware',
    priority: 100,
  },
  {
    keywords: ['masters'],
    category: 'Hardware',
    priority: 100,
  },

  // Pharmacy
  {
    keywords: ['chemist warehouse', 'chemist'],
    category: 'Pharmacy',
    priority: 100,
  },
  {
    keywords: ['priceline', 'priceline pharmacy'],
    category: 'Pharmacy',
    priority: 100,
  },
  {
    keywords: ['terry white', 'terry white chemmart'],
    category: 'Pharmacy',
    priority: 100,
  },
  {
    keywords: ['amcal'],
    category: 'Pharmacy',
    priority: 100,
  },

  // Dining - Fast food
  {
    keywords: ['mcdonalds', 'mcdonald\'s', 'maccas', 'macca\'s'],
    category: 'Dining',
    priority: 90,
  },
  {
    keywords: ['kfc', 'kentucky fried chicken'],
    category: 'Dining',
    priority: 90,
  },
  {
    keywords: ['subway'],
    category: 'Dining',
    priority: 90,
  },
  {
    keywords: ['hungry jacks', 'hungry jack\'s'],
    category: 'Dining',
    priority: 90,
  },
  {
    keywords: ['dominos', 'domino\'s pizza'],
    category: 'Dining',
    priority: 90,
  },
  {
    keywords: ['pizza hut'],
    category: 'Dining',
    priority: 90,
  },

  // Dining - Coffee shops
  {
    keywords: ['starbucks'],
    category: 'Dining',
    priority: 85,
  },
  {
    keywords: ['gloria jeans', 'gloria jean\'s'],
    category: 'Dining',
    priority: 85,
  },
  {
    keywords: ['cafe', 'coffee', 'espresso'],
    category: 'Dining',
    priority: 70,
  },

  // Shopping - Department stores
  {
    keywords: ['target'],
    category: 'Shopping',
    priority: 95,
  },
  {
    keywords: ['kmart', 'k-mart'],
    category: 'Shopping',
    priority: 95,
  },
  {
    keywords: ['big w', 'bigw'],
    category: 'Shopping',
    priority: 95,
  },
  {
    keywords: ['myer'],
    category: 'Shopping',
    priority: 95,
  },
  {
    keywords: ['david jones', 'dj'],
    category: 'Shopping',
    priority: 95,
  },

  // Shopping - Clothing
  {
    keywords: ['uniqlo'],
    category: 'Shopping',
    priority: 90,
  },
  {
    keywords: ['h&m', 'h & m'],
    category: 'Shopping',
    priority: 90,
  },
  {
    keywords: ['zara'],
    category: 'Shopping',
    priority: 90,
  },
  {
    keywords: ['cotton on'],
    category: 'Shopping',
    priority: 90,
  },

  // Shopping - Electronics
  {
    keywords: ['jb hi-fi', 'jb hifi', 'jbhifi'],
    category: 'Shopping',
    priority: 95,
  },
  {
    keywords: ['harvey norman'],
    category: 'Shopping',
    priority: 95,
  },
  {
    keywords: ['officeworks'],
    category: 'Shopping',
    priority: 95,
  },
  {
    keywords: ['apple store'],
    category: 'Shopping',
    priority: 95,
  },

  // Transport
  {
    keywords: ['uber', 'uber eats'],
    category: 'Transport',
    priority: 90,
  },
  {
    keywords: ['opal', 'opal card', 'transport nsw'],
    category: 'Transport',
    priority: 95,
  },
  {
    keywords: ['myki', 'ptv', 'public transport victoria'],
    category: 'Transport',
    priority: 95,
  },
  {
    keywords: ['translink', 'go card'],
    category: 'Transport',
    priority: 95,
  },
  {
    keywords: ['didi', 'ola'],
    category: 'Transport',
    priority: 90,
  },
  {
    keywords: ['taxi'],
    category: 'Transport',
    priority: 85,
  },

  // Entertainment
  {
    keywords: ['event cinemas', 'village cinemas', 'hoyts'],
    category: 'Entertainment',
    priority: 95,
  },
  {
    keywords: ['spotify', 'netflix', 'stan', 'disney+', 'binge'],
    category: 'Entertainment',
    priority: 95,
  },

  // Medical
  {
    keywords: ['medical centre', 'medical center', 'gp', 'doctor', 'clinic'],
    category: 'Medical',
    priority: 95,
  },
  {
    keywords: ['pathology', 'radiology', 'x-ray'],
    category: 'Medical',
    priority: 95,
  },
  {
    keywords: ['dentist', 'dental'],
    category: 'Medical',
    priority: 95,
  },
  {
    keywords: ['optometrist', 'optical', 'specsavers', 'opsm'],
    category: 'Medical',
    priority: 95,
  },

  // Utilities
  {
    keywords: ['origin energy', 'agl', 'energy australia'],
    category: 'Utilities',
    priority: 95,
  },
  {
    keywords: ['telstra', 'optus', 'vodafone'],
    category: 'Utilities',
    priority: 95,
  },

  // Professional Services
  {
    keywords: ['australia post', 'auspost'],
    category: 'Professional Services',
    priority: 95,
  },

  // Generic fallbacks (low priority)
  {
    keywords: ['supermarket', 'grocery', 'market'],
    category: 'Groceries',
    priority: 50,
  },
  {
    keywords: ['restaurant', 'bistro', 'dining', 'eatery'],
    category: 'Dining',
    priority: 50,
  },
  {
    keywords: ['petrol', 'gas station', 'service station'],
    category: 'Fuel',
    priority: 50,
  },
  {
    keywords: ['store', 'shop', 'retail'],
    category: 'Shopping',
    priority: 40,
  },
];

/**
 * Infer expense category from merchant name
 */
export function inferCategory(merchantName: string | null | undefined): ExpenseCategory {
  if (!merchantName) {
    return 'Other';
  }

  const normalizedMerchant = merchantName.toLowerCase().trim();

  // Sort patterns by priority (descending)
  const sortedPatterns = [...MERCHANT_PATTERNS].sort((a, b) => b.priority - a.priority);

  for (const pattern of sortedPatterns) {
    for (const keyword of pattern.keywords) {
      if (normalizedMerchant.includes(keyword.toLowerCase())) {
        return pattern.category;
      }
    }
  }

  return 'Other';
}

/**
 * Get all available categories
 */
export function getAllCategories(): ExpenseCategory[] {
  return [
    'Groceries',
    'Dining',
    'Fuel',
    'Transport',
    'Shopping',
    'Hardware',
    'Pharmacy',
    'Medical',
    'Entertainment',
    'Utilities',
    'Education',
    'Professional Services',
    'Other',
  ];
}

/**
 * Get color for category (for UI components)
 */
export function getCategoryColor(category: ExpenseCategory): string {
  const colorMap: Record<ExpenseCategory, string> = {
    'Groceries': 'green',
    'Dining': 'orange',
    'Fuel': 'yellow',
    'Transport': 'blue',
    'Shopping': 'purple',
    'Hardware': 'gray',
    'Pharmacy': 'pink',
    'Medical': 'red',
    'Entertainment': 'cyan',
    'Utilities': 'teal',
    'Education': 'indigo',
    'Professional Services': 'gray',
    'Other': 'gray',
  };

  return colorMap[category] || 'gray';
}

/**
 * Get emoji icon for category
 */
export function getCategoryIcon(category: ExpenseCategory): string {
  const iconMap: Record<ExpenseCategory, string> = {
    'Groceries': '🛒',
    'Dining': '🍽️',
    'Fuel': '⛽',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Hardware': '🔨',
    'Pharmacy': '💊',
    'Medical': '🏥',
    'Entertainment': '🎬',
    'Utilities': '💡',
    'Education': '📚',
    'Professional Services': '💼',
    'Other': '📋',
  };

  return iconMap[category] || '📋';
}

/**
 * Batch infer categories for multiple merchants
 */
export function batchInferCategories(
  merchants: Array<string | null | undefined>
): ExpenseCategory[] {
  return merchants.map(inferCategory);
}

/**
 * Get category statistics from receipts
 */
export interface CategoryStats {
  category: ExpenseCategory;
  count: number;
  totalAmount: number;
  percentage: number;
}

export function getCategoryStats(
  receipts: Array<{ merchant: string | null; amount: number | null; category?: string | null }>
): CategoryStats[] {
  const stats = new Map<ExpenseCategory, { count: number; totalAmount: number }>();

  receipts.forEach((receipt) => {
    const category = (receipt.category as ExpenseCategory) || inferCategory(receipt.merchant);
    const amount = receipt.amount || 0;

    const current = stats.get(category) || { count: 0, totalAmount: 0 };
    stats.set(category, {
      count: current.count + 1,
      totalAmount: current.totalAmount + amount,
    });
  });

  const total = Array.from(stats.values()).reduce((sum, s) => sum + s.totalAmount, 0);

  return Array.from(stats.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      totalAmount: data.totalAmount,
      percentage: total > 0 ? (data.totalAmount / total) * 100 : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

export default inferCategory;
