# OCR Test Data & Extraction Schema Specification

**Version:** 1.0  
**Date:** 2025-01-13  
**Purpose:** Define expected data structures and test cases for OCR/AI document extraction

---

## 1. Overview

This specification defines:

- Expected JSON schemas for extracted data
- Test data samples for validation
- Confidence scoring thresholds
- Edge case handling requirements

---

## 2. Bank Statement Extraction Schema

### 2.1 Expected Output Format

```typescript
interface BankStatementExtraction {
  document_type: 'bank_statement';
  confidence_score: number; // 0.00 to 1.00
  institution: {
    name: string;
    confidence: number;
  };
  account: {
    name: string;
    number_masked: string; // Last 4 digits only
    bsb?: string; // Australian BSB format: XXX-XXX
    confidence: number;
  };
  period: {
    start_date: string; // ISO 8601: YYYY-MM-DD
    end_date: string;
    confidence: number;
  };
  balance: {
    opening: number;
    closing: number;
    currency: string; // Default: 'AUD'
    confidence: number;
  };
  transactions: BankTransaction[];
  metadata: {
    page_count: number;
    extracted_at: string; // ISO 8601 timestamp
    processing_time_ms: number;
    file_format: 'pdf' | 'csv';
  };
}

interface BankTransaction {
  date: string; // ISO 8601: YYYY-MM-DD
  description: string;
  amount: number; // Negative for debits, positive for credits
  balance_after?: number;
  transaction_type?: 'debit' | 'credit' | 'fee' | 'interest';
  confidence: number;
}
```

### 2.2 Sample Test Cases

#### Test Case 1: Commonwealth Bank (PDF)

**Input:** `test-data/cba-statement-aug2024.pdf`

**Expected Output:**
```json
{
  "document_type": "bank_statement",
  "confidence_score": 0.95,
  "institution": {
    "name": "Commonwealth Bank",
    "confidence": 0.98
  },
  "account": {
    "name": "Smart Access Account",
    "number_masked": "1234",
    "bsb": "062-000",
    "confidence": 0.96
  },
  "period": {
    "start_date": "2024-08-01",
    "end_date": "2024-08-31",
    "confidence": 0.99
  },
  "balance": {
    "opening": 5420.50,
    "closing": 4835.75,
    "currency": "AUD",
    "confidence": 0.97
  },
  "transactions": [
    {
      "date": "2024-08-02",
      "description": "Woolworths Sydney CBD",
      "amount": -85.40,
      "balance_after": 5335.10,
      "transaction_type": "debit",
      "confidence": 0.94
    }
  ],
  "metadata": {
    "page_count": 3,
    "extracted_at": "2024-09-01T10:30:00Z",
    "processing_time_ms": 3500,
    "file_format": "pdf"
  }
}
```

#### Test Case 2: NAB (CSV)

**Input:** `test-data/nab-statement-sep2024.csv`

**CSV Format:**
```csv
Date,Description,Debit,Credit,Balance
01/09/2024,Opening Balance,,,3250.00
02/09/2024,EFTPOS Purchase Coles,45.60,,3204.40
03/09/2024,Salary Deposit,,2850.00,6054.40
```

**Expected Output:**
```json
{
  "document_type": "bank_statement",
  "confidence_score": 0.98,
  "institution": {
    "name": "National Australia Bank",
    "confidence": 0.85
  },
  "account": {
    "name": "Classic Banking Account",
    "number_masked": "5678",
    "bsb": "083-004",
    "confidence": 0.90
  },
  "transactions": [
    {
      "date": "2024-09-02",
      "description": "EFTPOS Purchase Coles",
      "amount": -45.60,
      "balance_after": 3204.40,
      "transaction_type": "debit",
      "confidence": 0.99
    },
    {
      "date": "2024-09-03",
      "description": "Salary Deposit",
      "amount": 2850.00,
      "balance_after": 6054.40,
      "transaction_type": "credit",
      "confidence": 0.99
    }
  ]
}
```

---

## 3. Receipt Extraction Schema

### 3.1 Expected Output Format

```typescript
interface ReceiptExtraction {
  document_type: 'receipt' | 'invoice' | 'bill';
  confidence_score: number; // 0.00 to 1.00
  merchant: {
    name: string;
    abn?: string; // Australian Business Number
    address?: string;
    phone?: string;
    confidence: number;
  };
  transaction: {
    date: string; // ISO 8601: YYYY-MM-DD
    time?: string; // HH:MM:SS
    total: number;
    subtotal?: number;
    tax: number; // GST in Australia (10%)
    currency: string; // Default: 'AUD'
    confidence: number;
  };
  payment: {
    method?: string; // 'card', 'cash', 'eftpos'
    card_last4?: string;
  };
  line_items?: ReceiptLineItem[];
  metadata: {
    extracted_at: string;
    processing_time_ms: number;
    file_format: 'pdf' | 'jpg' | 'png';
    image_quality?: 'high' | 'medium' | 'low';
  };
}

interface ReceiptLineItem {
  description: string;
  quantity?: number;
  unit_price?: number;
  total_price: number;
  confidence: number;
}
```

### 3.2 Sample Test Cases

#### Test Case 1: Woolworths Receipt (JPG)

**Input:** `test-data/woolworths-receipt-001.jpg`

**Expected Output:**
```json
{
  "document_type": "receipt",
  "confidence_score": 0.92,
  "merchant": {
    "name": "Woolworths",
    "abn": "88000014675",
    "address": "123 George St, Sydney NSW 2000",
    "confidence": 0.95
  },
  "transaction": {
    "date": "2024-08-15",
    "time": "14:32:45",
    "total": 87.65,
    "subtotal": 79.68,
    "tax": 7.97,
    "currency": "AUD",
    "confidence": 0.96
  },
  "payment": {
    "method": "card",
    "card_last4": "4532"
  },
  "line_items": [
    {
      "description": "Milk Full Cream 2L",
      "quantity": 1,
      "unit_price": 4.50,
      "total_price": 4.50,
      "confidence": 0.88
    },
    {
      "description": "Bread Wholemeal",
      "quantity": 2,
      "unit_price": 3.20,
      "total_price": 6.40,
      "confidence": 0.91
    }
  ],
  "metadata": {
    "extracted_at": "2024-08-15T15:00:00Z",
    "processing_time_ms": 2800,
    "file_format": "jpg",
    "image_quality": "high"
  }
}
```

#### Test Case 2: Fuel Receipt (PDF)

**Input:** `test-data/bp-fuel-receipt.pdf`

**Expected Output:**
```json
{
  "document_type": "receipt",
  "confidence_score": 0.88,
  "merchant": {
    "name": "BP Service Station",
    "address": "45 Pacific Hwy, North Sydney NSW",
    "confidence": 0.90
  },
  "transaction": {
    "date": "2024-08-20",
    "time": "08:15:00",
    "total": 65.00,
    "tax": 5.91,
    "currency": "AUD",
    "confidence": 0.93
  },
  "payment": {
    "method": "card",
    "card_last4": "8976"
  },
  "line_items": [
    {
      "description": "Unleaded 91 - 42.5L",
      "quantity": 42.5,
      "unit_price": 1.53,
      "total_price": 65.00,
      "confidence": 0.85
    }
  ]
}
```

#### Test Case 3: Restaurant Bill (Photo - Medium Quality)

**Input:** `test-data/restaurant-bill-blurry.jpg`

**Expected Output:**
```json
{
  "document_type": "bill",
  "confidence_score": 0.68,
  "merchant": {
    "name": "The Local Cafe",
    "confidence": 0.75
  },
  "transaction": {
    "date": "2024-08-22",
    "total": 42.50,
    "tax": 3.86,
    "currency": "AUD",
    "confidence": 0.70
  },
  "line_items": [
    {
      "description": "Flat White",
      "total_price": 4.50,
      "confidence": 0.60
    },
    {
      "description": "Avocado Toast",
      "total_price": 18.00,
      "confidence": 0.65
    }
  ],
  "metadata": {
    "image_quality": "medium"
  }
}
```

---

## 4. Confidence Score Thresholds

### 4.1 Overall Document Confidence

| Score Range | Classification | Action |
|-------------|---------------|--------|
| 0.90 - 1.00 | High | Auto-approve extraction |
| 0.70 - 0.89 | Medium | Flag for user review |
| 0.50 - 0.69 | Low | Require manual verification |
| 0.00 - 0.49 | Failed | Request re-upload or manual entry |

### 4.2 Field-Level Confidence

**Critical Fields** (must be >= 0.70):

- Institution name (bank statements)
- Transaction date
- Transaction amount
- Receipt total

**Optional Fields** (can be < 0.70):

- Line items
- Merchant address
- Payment method details

### 4.3 Auto-Approval Criteria

A document can be auto-approved if:

1. Overall confidence >= 0.85
2. All critical fields >= 0.70
3. Amount values are valid numbers
4. Dates are in valid format

---

## 5. Edge Cases & Error Handling

### 5.1 Common Issues

**Low Quality Images:**

```json
{
  "error": "low_image_quality",
  "confidence_score": 0.35,
  "message": "Image quality too low for reliable extraction",
  "suggestion": "Please retake photo in better lighting"
}
```

**Unsupported Format:**

```json
{
  "error": "unsupported_format",
  "message": "Bank statement format not recognized",
  "suggestion": "Supported formats: PDF, CSV. Please contact support if this is a valid statement."
}
```

**Partial Extraction:**

```json
{
  "document_type": "receipt",
  "confidence_score": 0.65,
  "partial_extraction": true,
  "extracted_fields": ["merchant", "total"],
  "missing_fields": ["date", "line_items"],
  "message": "Could not extract all fields. Please verify manually."
}
```

### 5.2 Duplicate Detection

**Check for duplicates based on:**

- Same merchant name
- Same date (±2 days tolerance)
- Same amount (±$0.50 tolerance)

**Response:**
```json
{
  "duplicate_warning": true,
  "possible_duplicates": [
    {
      "receipt_id": "uuid-123",
      "match_score": 0.95,
      "merchant": "Woolworths",
      "date": "2024-08-15",
      "amount": 87.65
    }
  ]
}
```

### 5.3 Handwritten Receipts

**Lower confidence expectations:**

- Overall confidence threshold: 0.50 (vs 0.70 for printed)
- Always flag for manual review
- Focus on critical fields only (merchant, date, total)

---

## 6. Test Data File Structure

### 6.1 Directory Organization

```
test-data/
├── bank-statements/
│   ├── cba/
│   │   ├── cba-statement-aug2024.pdf
│   │   └── cba-statement-aug2024-expected.json
│   ├── nab/
│   │   ├── nab-statement-sep2024.csv
│   │   └── nab-statement-sep2024-expected.json
│   ├── anz/
│   └── westpac/
├── receipts/
│   ├── retail/
│   │   ├── woolworths-receipt-001.jpg
│   │   └── woolworths-receipt-001-expected.json
│   ├── fuel/
│   ├── restaurant/
│   └── utility-bills/
└── edge-cases/
    ├── low-quality/
    ├── handwritten/
    └── damaged/
```

### 6.2 Expected JSON Convention

For each test file, create a matching `-expected.json` file with the expected extraction output.

**Naming:** `{original-filename}-expected.json`

---

## 7. Validation Rules

### 7.1 Bank Statement Validation

**Date Validation:**

- Start date <= end date
- Period typically 1 month (warn if > 3 months)
- Dates not in future

**Amount Validation:**

- Opening balance + sum(transactions) ≈ closing balance (±$1 tolerance)
- Transaction amounts != 0
- Balance fields are numeric

**Account Validation:**

- BSB format: XXX-XXX (6 digits with hyphen)
- Masked number: 4 digits only
- Institution name not empty

### 7.2 Receipt Validation

**Amount Validation:**

- Total > 0
- If line items exist: sum(line_items) ≈ subtotal (±$0.10 tolerance)
- If tax exists: subtotal + tax ≈ total (±$0.10 tolerance for rounding)
- GST typically 10% in Australia

**Date Validation:**

- Date not in future
- Date not older than 7 years (tax record keeping requirement)

**Merchant Validation:**

- Merchant name not empty
- ABN format: 11 digits (if present)

---

## 8. n8n Workflow Integration

### 8.1 Input to n8n

**POST /webhook/process-document**

```json
{
  "document_id": "uuid-123",
  "user_id": "uuid-456",
  "file_path": "statements/user-456/file.pdf",
  "document_type": "bank_statement",
  "storage_bucket": "document-uploads"
}
```

### 8.2 Expected Response

**Success:**

```json
{
  "status": "processing",
  "job_id": "n8n-job-789",
  "estimated_time_ms": 5000,
  "webhook_url": "https://api.previa.com/webhooks/ocr-complete"
}
```

**Webhook Callback (to Previa):**

```json
{
  "job_id": "n8n-job-789",
  "document_id": "uuid-123",
  "status": "completed",
  "extraction": { /* BankStatementExtraction or ReceiptExtraction */ },
  "processed_at": "2024-08-15T10:30:00Z"
}
```

---

## 9. Australian-Specific Considerations

### 9.1 Date Formats

**Common Australian Date Formats:**

- DD/MM/YYYY (most common)
- DD-MM-YYYY
- DD MMM YYYY (e.g., 15 Aug 2024)

**Parser must handle:**

- Ambiguous dates (01/02/2024 = 1 Feb, not 2 Jan)
- Month names (August, Aug)

### 9.2 Currency & Tax

**GST (Goods and Services Tax):**

- Standard rate: 10%
- Should appear as "GST" on receipts
- Some items GST-free (fresh food, medical)

**Currency:**

- Always AUD for MVP
- Format: $X,XXX.XX
- No cents sign (¢) in modern receipts

### 9.3 Banking Standards

**BSB (Bank State Branch):**

- Format: XXX-XXX
- First 2 digits = bank ID
- Used for all Australian domestic transfers

**Account Numbers:**

- Vary by bank (6-10 digits typical)
- Display only last 4 digits for security

---

## 10. Testing Requirements

### 10.1 Unit Tests

**Test Categories:**

- JSON schema validation (all fields present, correct types)
- Confidence score calculations
- Validation rules (date, amount, format)
- Edge case handling (missing fields, low quality)

### 10.2 Integration Tests

**Test Scenarios:**

- Upload PDF → extract → validate → save to DB
- Upload CSV → parse → validate → save to DB
- Upload low quality image → flag for review
- Upload duplicate receipt → detect and warn

### 10.3 Test Data Requirements

**Minimum Test Files:**

- 5 bank statements (PDF): CBA, NAB, ANZ, Westpac, other
- 5 bank statements (CSV): Various formats
- 10 receipts (images): Retail, fuel, restaurant, utilities
- 5 edge cases: Low quality, handwritten, damaged, partial

---

## 11. Performance Benchmarks

### 11.1 Processing Time Targets

| Document Type | Target Time | Max Time |
|--------------|-------------|----------|
| PDF (1-5 pages) | < 5s | < 10s |
| CSV | < 2s | < 5s |
| Receipt image | < 3s | < 8s |

### 11.2 Accuracy Targets (MVP)

| Metric | Target | Minimum Acceptable |
|--------|--------|--------------------|
| Overall confidence | 0.85 | 0.70 |
| Critical field accuracy | 95% | 85% |
| Date extraction | 98% | 90% |
| Amount extraction | 99% | 95% |

---

**End of Specification**
