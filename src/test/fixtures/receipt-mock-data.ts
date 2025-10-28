/**
 * Mock data generators for receipt OCR testing
 * Provides realistic Australian merchant receipts for component testing
 */

import { v4 as uuidv4 } from 'uuid';

export interface MockReceipt {
  id: string;
  user_id: string;
  file_path: string;
  bucket: string;
  merchant: string | null;
  receipt_date: string | null;
  amount: number | null;
  tax: number | null;
  confidence_score: number | null;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_started_at: string | null;
  extracted_at: string | null;
  error_message: string | null;
  category: string | null;
  ocr_data: ReceiptOCRData | null;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface ReceiptOCRData {
  merchant: {
    name: string;
    address?: string;
    phone?: string;
    abn?: string;
    confidence_score: number;
  };
  transaction: {
    date: string;
    time?: string;
    receipt_number?: string;
    confidence_score: number;
  };
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number; // cents
    subtotal: number; // cents
    confidence_score: number;
  }>;
  payment: {
    method?: 'CARD' | 'CASH';
    subtotal: number; // cents
    tax: number; // cents
    total: number; // cents
    confidence_score: number;
  };
  tax: {
    gst: number; // cents
    gst_inclusive: boolean;
    confidence_score: number;
  };
  overall_confidence: number;
  metadata: {
    pages: number;
    extracted_at: string;
  };
}

export interface AIMatchSuggestion {
  id: string;
  user_id: string;
  receipt_id: string;
  transaction_id: string;
  confidence_score: number;
  match_reason: string;
  status: 'suggested' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

/**
 * Australian merchant templates for realistic mock data
 */
const AUSTRALIAN_MERCHANTS = [
  {
    name: 'Woolworths Metro',
    category: 'Groceries',
    abn: '88 000 014 675',
    address: '123 George St, Sydney NSW 2000',
    phone: '02 9876 5432',
    items: [
      { name: 'Milk 2L Full Cream', price: 395 },
      { name: 'Bread White Sandwich', price: 280 },
      { name: 'Bananas per kg', price: 349 },
      { name: 'Chicken Breast 500g', price: 650 },
      { name: 'Tomatoes 1kg', price: 420 },
    ],
  },
  {
    name: 'Coles Supermarket',
    category: 'Groceries',
    abn: '11 004 089 936',
    address: '456 Pitt St, Melbourne VIC 3000',
    phone: '03 8765 4321',
    items: [
      { name: 'Eggs Free Range 12pk', price: 580 },
      { name: 'Avocado each', price: 280 },
      { name: 'Orange Juice 2L', price: 450 },
      { name: 'Pasta 500g', price: 190 },
      { name: 'Cheese Block 500g', price: 890 },
    ],
  },
  {
    name: 'Aldi Stores',
    category: 'Groceries',
    abn: '77 061 148 142',
    address: '789 Chapel St, Brisbane QLD 4000',
    phone: '07 7654 3210',
    items: [
      { name: 'Butter 500g', price: 520 },
      { name: 'Yoghurt 1kg', price: 480 },
      { name: 'Carrots 1kg', price: 290 },
      { name: 'Apples Pink Lady 1kg', price: 380 },
      { name: 'Cereal Muesli 750g', price: 550 },
    ],
  },
  {
    name: 'Bunnings Warehouse',
    category: 'Hardware',
    abn: '27 004 776 538',
    address: '321 Victoria Rd, Perth WA 6000',
    phone: '08 6543 2109',
    items: [
      { name: 'Paint 4L White', price: 4500 },
      { name: 'Screws Pack 100', price: 890 },
      { name: 'Hammer', price: 2450 },
      { name: 'Garden Hose 20m', price: 3200 },
      { name: 'Plant Pot Large', price: 1580 },
    ],
  },
  {
    name: 'BP Service Station',
    category: 'Fuel',
    abn: '53 004 085 616',
    address: '654 Pacific Hwy, Adelaide SA 5000',
    phone: '08 5432 1098',
    items: [
      { name: 'Unleaded Petrol 45L', price: 7200 },
      { name: 'Coffee Large', price: 550 },
      { name: 'Water Bottle 600ml', price: 380 },
    ],
  },
  {
    name: 'Chemist Warehouse',
    category: 'Pharmacy',
    abn: '48 124 684 967',
    address: '987 Bourke St, Hobart TAS 7000',
    phone: '03 4321 0987',
    items: [
      { name: 'Paracetamol 24pk', price: 495 },
      { name: 'Vitamins Daily Pack', price: 1890 },
      { name: 'Shampoo 400ml', price: 795 },
      { name: 'Toothpaste 110g', price: 385 },
    ],
  },
  {
    name: 'Kmart',
    category: 'Retail',
    abn: '56 004 286 037',
    address: '159 Elizabeth St, Darwin NT 0800',
    phone: '08 3210 9876',
    items: [
      { name: 'T-Shirt Cotton', price: 1200 },
      { name: 'Jeans Denim', price: 2800 },
      { name: 'Towel Bath', price: 1500 },
      { name: 'Kitchen Utensils Set', price: 1995 },
    ],
  },
  {
    name: 'Cafe Della Vita',
    category: 'Dining',
    abn: '12 345 678 901',
    address: '45 Lygon St, Carlton VIC 3053',
    phone: '03 9876 5432',
    items: [
      { name: 'Flat White', price: 480 },
      { name: 'Avocado Toast', price: 1850 },
      { name: 'Eggs Benedict', price: 2200 },
      { name: 'Fresh Juice', price: 680 },
    ],
  },
];

/**
 * Generate a random Australian receipt with OCR data
 */
export function generateMockReceipt(
  userId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed' = 'completed',
  daysAgo: number = 0
): MockReceipt {
  const receiptId = uuidv4();
  const merchant = AUSTRALIAN_MERCHANTS[Math.floor(Math.random() * AUSTRALIAN_MERCHANTS.length)];

  // Generate 2-5 random items
  const numItems = Math.floor(Math.random() * 4) + 2;
  const items = [];
  for (let i = 0; i < numItems; i++) {
    const item = merchant.items[Math.floor(Math.random() * merchant.items.length)];
    const quantity = Math.random() > 0.7 ? Math.round(Math.random() * 2 + 1) : 1;
    items.push({
      description: item.name,
      quantity,
      unit_price: item.price,
      subtotal: item.price * quantity,
      confidence_score: 0.9 + Math.random() * 0.09, // 0.90-0.99
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const gst = Math.round(subtotal * 0.1); // 10% GST
  const total = subtotal;

  const receiptDate = new Date();
  receiptDate.setDate(receiptDate.getDate() - daysAgo);
  const dateStr = receiptDate.toISOString().split('T')[0];
  const timeStr = `${String(receiptDate.getHours()).padStart(2, '0')}:${String(receiptDate.getMinutes()).padStart(2, '0')}`;

  const uploadedAt = new Date(receiptDate);
  uploadedAt.setMinutes(uploadedAt.getMinutes() + 5);

  const ocrData: ReceiptOCRData = {
    merchant: {
      name: merchant.name,
      address: merchant.address,
      phone: merchant.phone,
      abn: merchant.abn,
      confidence_score: 0.96 + Math.random() * 0.03, // 0.96-0.99
    },
    transaction: {
      date: dateStr,
      time: timeStr,
      receipt_number: `RCP-${dateStr.replace(/-/g, '')}${Math.floor(Math.random() * 1000)}`,
      confidence_score: 0.95 + Math.random() * 0.04, // 0.95-0.99
    },
    line_items: items,
    payment: {
      method: Math.random() > 0.3 ? 'CARD' : 'CASH',
      subtotal,
      tax: gst,
      total,
      confidence_score: 0.97 + Math.random() * 0.02, // 0.97-0.99
    },
    tax: {
      gst,
      gst_inclusive: true,
      confidence_score: 0.96 + Math.random() * 0.03, // 0.96-0.99
    },
    overall_confidence: 0.93 + Math.random() * 0.06, // 0.93-0.99
    metadata: {
      pages: 1,
      extracted_at: uploadedAt.toISOString(),
    },
  };

  const now = new Date().toISOString();
  const processingStarted = status !== 'pending' ? uploadedAt.toISOString() : null;
  const extractedAt = status === 'completed' ? new Date(uploadedAt.getTime() + 30000).toISOString() : null; // 30 seconds later

  return {
    id: receiptId,
    user_id: userId,
    file_path: `${userId}/${dateStr.replace(/-/g, '')}_${merchant.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    bucket: 'receipts',
    merchant: status === 'completed' ? merchant.name : null,
    receipt_date: status === 'completed' ? dateStr : null,
    amount: status === 'completed' ? total : null,
    tax: status === 'completed' ? gst : null,
    confidence_score: status === 'completed' ? ocrData.overall_confidence : null,
    processing_status: status,
    processing_started_at: processingStarted,
    extracted_at: extractedAt,
    error_message: status === 'failed' ? 'OCR extraction failed: Unable to read receipt text' : null,
    category: status === 'completed' ? merchant.category : null,
    ocr_data: status === 'completed' ? ocrData : null,
    uploaded_at: uploadedAt.toISOString(),
    created_at: uploadedAt.toISOString(),
    updated_at: now,
  };
}

/**
 * Generate AI match suggestion for a receipt
 */
export function generateMockAIMatchSuggestion(
  userId: string,
  receiptId: string,
  transactionId: string,
  confidence: number,
  reason: string
): AIMatchSuggestion {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    user_id: userId,
    receipt_id: receiptId,
    transaction_id: transactionId,
    confidence_score: confidence,
    match_reason: reason,
    status: 'suggested',
    created_at: now,
    updated_at: now,
  };
}

/**
 * Generate match reasons based on confidence levels
 */
export function generateMatchReason(confidence: number, merchant: string): string {
  if (confidence >= 0.95) {
    return `Exact match: Same merchant "${merchant}" and exact amount on same date`;
  } else if (confidence >= 0.85) {
    return `High confidence: Merchant "${merchant}" matches and amount within $2 on same date`;
  } else if (confidence >= 0.75) {
    return `Good match: Similar merchant name and amount within $5 on same week`;
  } else if (confidence >= 0.60) {
    return `Possible match: Similar transaction amount within 3-day window`;
  } else {
    return `Low confidence: Date proximity match only`;
  }
}

/**
 * Generate a batch of receipts with various statuses
 */
export function generateMockReceiptBatch(userId: string, count: number = 10): MockReceipt[] {
  const receipts: MockReceipt[] = [];
  const statusDistribution: Array<'pending' | 'processing' | 'completed' | 'failed'> = [
    'completed', 'completed', 'completed', 'completed', 'completed', // 50% completed
    'completed', 'completed', // 20% more completed
    'processing', 'processing', // 20% processing
    'pending', // 10% pending
  ];

  for (let i = 0; i < count; i++) {
    const status = statusDistribution[i % statusDistribution.length];
    const daysAgo = Math.floor(Math.random() * 60); // 0-60 days ago
    receipts.push(generateMockReceipt(userId, status, daysAgo));
  }

  return receipts.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
}

/**
 * Generate mock AI match suggestions for a receipt
 */
export function generateMockMatchSuggestions(
  userId: string,
  receipt: MockReceipt,
  transactionIds: string[],
  count: number = 5
): AIMatchSuggestion[] {
  if (!receipt.merchant || transactionIds.length === 0) {
    return [];
  }

  const suggestions: AIMatchSuggestion[] = [];
  const availableIds = [...transactionIds];
  const numSuggestions = Math.min(count, availableIds.length);

  // Generate suggestions with decreasing confidence
  for (let i = 0; i < numSuggestions; i++) {
    const confidence = 0.95 - (i * 0.12); // 0.95, 0.83, 0.71, 0.59, 0.47
    const actualConfidence = Math.max(0.3, confidence + (Math.random() * 0.08 - 0.04)); // Add slight randomness

    // Remove random transaction ID from available pool
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    const transactionId = availableIds.splice(randomIndex, 1)[0];

    const reason = generateMatchReason(actualConfidence, receipt.merchant);

    suggestions.push(
      generateMockAIMatchSuggestion(userId, receipt.id, transactionId, actualConfidence, reason)
    );
  }

  return suggestions.sort((a, b) => b.confidence_score - a.confidence_score);
}

/**
 * Export commonly used mock data sets
 */
export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export const MOCK_RECEIPTS = {
  pending: generateMockReceipt(MOCK_USER_ID, 'pending', 0),
  processing: generateMockReceipt(MOCK_USER_ID, 'processing', 1),
  completed: generateMockReceipt(MOCK_USER_ID, 'completed', 2),
  failed: generateMockReceipt(MOCK_USER_ID, 'failed', 3),
};

export const MOCK_RECEIPT_BATCH = generateMockReceiptBatch(MOCK_USER_ID, 20);
