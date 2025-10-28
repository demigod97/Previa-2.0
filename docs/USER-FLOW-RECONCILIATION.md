# Previa User Flow: Reconciliation Workflow

**Version:** 1.0
**Date:** 2025-10-28
**Purpose:** Define how users interact with Transactions, Receipts, and Reconciliation features

---

## Overview

Previa's reconciliation system helps users match transactions from bank statements to receipts for expense tracking and tax preparation. The workflow is designed to be intuitive and AI-assisted while giving users full control.

## Core Concept

```
User uploads → AI processes → AI suggests matches → User approves/rejects → Data reconciled
```

**Key Insight**: Reconciliation is **not a separate data entry task** - it's reviewing AI suggestions and confirming they're correct.

---

## User Journey (Step-by-Step)

### 1. Upload Documents (`/upload`)

**Entry Points:**
- Welcome screen "Get Started" button
- Dashboard "Upload" button
- Sidebar "Upload" 📤 menu item

**User Actions:**
- Upload bank statements (PDF/CSV) - extracts transactions
- Upload receipts (PDF/image) - extracts merchant, amount, date, tax

**What Happens Behind the Scenes:**
- Documents uploaded to Supabase Storage
- Edge Function `process-document` triggered
- n8n workflow extracts data via OCR
- Callback updates database with extracted data
- **AI automatically runs matching algorithm** → creates suggestions in `reconciliation_matches` table

**User Feedback:**
- Processing status indicator
- "X transactions extracted" notification
- "Y receipts processed" notification
- "Z matches found" notification (automated)

---

### 2. View Receipts Library (`/receipts`)

**Purpose:** Browse, filter, and manage all receipts independently of matching

**Entry Points:**
- Sidebar "Receipts" 🧾 menu item
- Dashboard "X Unmatched Receipts" widget (quick access)

**User Actions:**
- Browse all receipts in grid or list view
- Filter by:
  - Status (pending, processing, completed, failed)
  - Category (Groceries, Dining, Fuel, etc.)
  - Date range (last 7/30/90 days)
  - Amount range ($0-$1000+)
- Search by merchant name
- Sort by date, amount, or confidence score
- Click receipt → View details (`/receipts/:receiptId`)

**Receipt Card Shows:**
- Merchant name
- Receipt date
- Total amount
- Category badge
- Processing status badge
- Confidence indicator (High/Medium/Low)

**Details Page (`/receipts/:receiptId`):**
- Full OCR data (merchant info, line items, payment summary)
- AI match suggestions for this specific receipt
- Approve/reject individual suggestions
- Retry processing if failed
- Delete receipt

**Use Cases:**
- "Did I upload that Woolworths receipt from last week?" → Search receipts
- "How much did I spend on fuel this month?" → Filter by category
- "I need to review all receipts from my trip" → Filter by date range
- "Which receipts haven't been matched yet?" → Sort by status

---

### 3. Reconciliation Engine (`/reconciliation`)

**Purpose:** Review AI-suggested matches and approve/reject them

**Entry Points:**
- Sidebar "Reconciliation" 🔄 menu item
- Dashboard "X Suggested Matches" widget (prompts action)
- Email notification "New matches found" (if enabled)

**What's Displayed:**
- List of AI-suggested matches sorted by confidence (high to low)
- Each match shows side-by-side comparison:
  - **Left panel**: Transaction (from bank statement)
    - Date, description, amount, balance
  - **Right panel**: Receipt (from OCR)
    - Merchant, date, amount, tax, line items
  - **Match indicators**:
    - Green ✓ = fields match exactly
    - Yellow ⚠️ = close match (within tolerance)
    - Red ✗ = mismatch (review carefully)

**User Actions:**

1. **Review AI Suggestion**
   - See confidence badge (High ≥80%, Medium 50-79%, Low <50%)
   - Compare fields side-by-side
   - Expand receipt to see line items

2. **Approve Match** (if correct)
   - Click "Approve Match" button (or press 'A')
   - Updates both transaction AND receipt status to "reconciled"
   - Removes from suggested matches list
   - Awards gamification points (3 points per match)

3. **Reject Match** (if incorrect)
   - Click "Reject Match" button (or press 'R')
   - Marks suggestion as rejected (hidden from list)
   - Transaction and receipt remain "unmatched"
   - AI won't suggest this pairing again

4. **Skip for Now**
   - Click "Next" button (or press 'N')
   - Keeps suggestion in list
   - Review later when more confident

5. **Manual Match** (for unmatched transactions)
   - Click "Manual Match" button on transaction card
   - Search receipts by merchant, date, amount
   - Select correct receipt
   - Creates match with confidence=100%, status=approved

6. **Bulk Actions**
   - "Approve All High Confidence" button
   - Approves all matches with confidence ≥80%
   - Confirmation dialog shows count before executing

7. **Undo Recent Approvals**
   - "Recent Approvals" collapsible section
   - Shows last 5 approved matches
   - "Undo" button reverts match to suggested
   - Resets transaction/receipt status to unreconciled

**Keyboard Shortcuts:**
- `A` = Approve match
- `R` = Reject match
- `N` = Next match
- `M` = Manual match dialog
- `Escape` = Close dialog

**Statistics Panel (Top of Page):**
- Total suggested matches
- Approved matches today/this week
- Rejected matches
- Reconciliation rate % (with progress bar)
- Average confidence score

---

### 4. Transactions View (`/transactions`)

**Purpose:** View all transactions with reconciliation status

**Entry Points:**
- Sidebar "Transactions" 📊 menu item
- Dashboard "X Unreconciled Transactions" widget

**User Actions:**
- Browse all transactions in AG-Grid table
- Filter by:
  - Status (unreconciled, matched, approved, rejected)
  - Date range
  - Amount range
  - Category
  - Bank account
- Search by description
- Click transaction → View details
- Export filtered data to CSV

**Transaction Row Shows:**
- Date, description, amount
- **Status badge**:
  - 📝 Unreconciled (gray) - no receipt matched yet
  - ⚠️ Matched (yellow) - AI suggested a receipt, awaiting approval
  - ✅ Approved (green) - user confirmed match
  - ❌ Rejected (red) - user rejected AI suggestion
- Bank account
- Category (if assigned)

**Quick Actions:**
- Click status badge → Jump to reconciliation for that transaction
- "Find Receipt" → Opens manual match dialog
- "Edit" → Modify transaction details (date, description, category)

---

### 5. Dashboard Overview (`/`)

**Purpose:** High-level summary with quick actions

**Widgets:**

1. **Financial Overview Cards**
   - Total income this month
   - Total expenses this month
   - Current balance across accounts

2. **Reconciliation Progress Card**
   - X transactions reconciled / Y total (Z%)
   - Progress bar with color coding
   - "X unreconciled" badge in coral (urgent)
   - "Review Matches" button → `/reconciliation`

3. **Recent Activity Timeline**
   - Last 5 transactions
   - Last 5 receipts uploaded
   - Last 5 matches approved
   - Status badges for each

4. **Gamification Card**
   - Points earned this week
   - Active challenges progress
   - Next badge to unlock
   - "View Progress" → `/gamification`

5. **Quick Actions**
   - "Upload Receipt" → `/upload`
   - "Review Matches" → `/reconciliation` (badge shows count)
   - "View Receipts" → `/receipts`

---

## Navigation Map

```
┌─────────────────────────────────────────────────────────────┐
│                         SIDEBAR                             │
├─────────────────────────────────────────────────────────────┤
│ 🏠 Home              → /                (Dashboard)         │
│ 📤 Upload            → /upload          (Upload hub)        │
│ 🔄 Reconciliation    → /reconciliation  (AI matching)       │
│ 🧾 Receipts          → /receipts        (Receipt library)   │
│ 📊 Transactions      → /transactions    (All transactions)  │
│ 🏆 My Progress       → /gamification    (Badges/points)     │
│ 💬 Chat              → /chat            (AI assistant)      │
│ 📈 Reports           → /reports         (Future: Analytics) │
│ 🔗 Integrations      → /integrations    (Future: Xero API)  │
│ ⚙️ Settings          → /settings        (Account settings)  │
└─────────────────────────────────────────────────────────────┘
```

---

## How Features Connect

### Receipts Library vs Reconciliation Engine

**Common Confusion**: "What's the difference?"

| **Receipts Library** (`/receipts`) | **Reconciliation Engine** (`/reconciliation`) |
|-----------------------------------|---------------------------------------------|
| Browse ALL receipts | Review AI-SUGGESTED MATCHES |
| Search, filter, sort receipts | Approve/reject match suggestions |
| View individual receipt details | Compare transaction vs receipt side-by-side |
| Manage receipt lifecycle | Manage matching lifecycle |
| Independent of transactions | Requires both transaction AND receipt |

**Analogy**:
- **Receipts Library** = Your physical receipt folder (organized, searchable)
- **Reconciliation Engine** = Your accountant's desk (comparing receipts to bank statement)

### When to Use Each View

**Use `/receipts` when:**
- "I need to find that Bunnings receipt from last month"
- "How many receipts did I upload in March?"
- "Which receipts failed OCR processing?"
- "I want to delete a duplicate receipt"

**Use `/reconciliation` when:**
- "I need to approve matches suggested by AI"
- "Is this receipt for the Coles transaction on 15/10?"
- "I want to manually match a transaction to a receipt"
- "How many transactions are still unreconciled?"

---

## Data Model Relationships

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  bank_accounts  │         │  bank_statements │         │  transactions   │
│  (User links)   │◄────────│  (Uploaded PDFs) │◄────────│  (Extracted)    │
└─────────────────┘         └──────────────────┘         └────────┬────────┘
                                                                   │
                                                                   │
                            ┌──────────────────────────────────────┼────┐
                            │                                      │    │
                            ▼                                      │    │
                 ┌────────────────────┐                           │    │
                 │ reconciliation_    │                           │    │
                 │    matches         │◄──────────────────────────┘    │
                 │ (AI suggestions)   │                                │
                 └──────────┬─────────┘                                │
                            │                                          │
                            │                                          │
                            ▼                                          ▼
                 ┌────────────────────┐                    ┌────────────────────┐
                 │     receipts       │                    │  transactions      │
                 │  (Uploaded PDFs)   │                    │  .status = ...     │
                 └────────────────────┘                    └────────────────────┘

Match Statuses:
- suggested: AI created match, awaiting review
- approved: User confirmed match is correct
- rejected: User said match is wrong

Transaction/Receipt Statuses:
- unreconciled: No receipt matched
- matched: AI suggestion exists (pending review)
- approved: User confirmed reconciliation
- rejected: User rejected match (back to unreconciled)
```

---

## Best Practices

### For Users

1. **Upload regularly** (weekly recommended)
   - Upload bank statements monthly
   - Upload receipts as you receive them
   - More frequent = better AI accuracy

2. **Review matches within 7 days**
   - Memory is fresh
   - Easier to verify accuracy
   - Gamification streaks reward consistency

3. **Start with high-confidence matches**
   - Approve "easy wins" first (green badges)
   - Build momentum
   - Review medium/low confidence carefully

4. **Use filters effectively**
   - Filter by date range for tax quarters
   - Filter by category for budget review
   - Sort by amount to find large expenses

5. **Don't over-reject**
   - If match looks close but not perfect, check original documents
   - AI learns from approvals/rejections
   - False rejections hurt future accuracy

### For Developers

1. **Confidence thresholds** (from `match-receipt-transactions` Edge Function):
   - High ≥0.80 - Safe for bulk approve
   - Medium 0.50-0.79 - Review individually
   - Low <0.50 - Likely incorrect, but show for manual matching

2. **Match criteria** (stored in JSONB):
   ```json
   {
     "date_difference_days": 0-3,
     "amount_difference": "$0-$5",
     "merchant_similarity": "60-100%",
     "reason": "Exact amount + date match + merchant 'Woolworths' similar to 'WOOLWORTHS PTY LTD'"
   }
   ```

3. **Status transitions** (enforce with database triggers):
   ```
   Transaction Status Flow:
   unreconciled → matched → approved
                         ↘ rejected → unreconciled

   Receipt Status Flow:
   pending → processing → completed → matched → approved
                                              ↘ rejected → completed
   ```

---

## Future Enhancements (Post-MVP)

1. **Bulk Receipt Upload**
   - Upload folder of receipts
   - Process multiple PDFs in batch
   - Progress indicator with queue

2. **Smart Receipt Scanning**
   - Mobile app camera integration
   - Real-time OCR preview
   - Auto-crop and enhance image

3. **Advanced Matching Rules**
   - User-defined merchant mappings ("WLWTHS" → "Woolworths")
   - Recurring expense templates
   - Split transactions (one receipt → multiple line items)

4. **Receipt Sharing**
   - Export receipt + transaction as PDF
   - Share with accountant
   - Attach to Xero/QuickBooks invoice

5. **Analytics Dashboard**
   - Spending trends by category
   - Monthly comparison charts
   - Tax deduction estimator
   - Budget vs actual variance

---

## Troubleshooting

### "I can't find my receipt"
1. Check `/receipts` page with filters
2. Search by merchant name
3. Check processing status (might be pending/failed)
4. View "Recent Uploads" in dashboard

### "AI suggested wrong match"
1. Click "Reject Match" - won't suggest again
2. Use "Manual Match" to find correct receipt
3. Provide feedback (future: thumbs down icon)

### "Transaction has no suggestions"
1. Upload receipt if missing
2. Wait 2-3 minutes for AI processing
3. Click "Manual Match" to search receipts
4. Create manual match (confidence=100%)

### "Approved match by mistake"
1. Go to "Recent Approvals" section
2. Click "Undo" (available for last 5 matches)
3. Re-review suggestion
4. Approve or reject correctly

---

## Accessibility

All reconciliation features follow WCAG AA standards:

- **Keyboard Navigation**: Tab through matches, Enter to approve/reject
- **Screen Reader Support**: Confidence badges have descriptive labels
- **Color + Text**: Status not conveyed by color alone (emojis + text)
- **Focus Indicators**: Clear outlines on interactive elements
- **Skip Links**: "Skip to matches" link at top of page

---

## Performance

**Target Metrics:**
- Match suggestion generation: <30 seconds per batch (10 receipts)
- Page load time: <2 seconds (`/reconciliation`)
- Filter/sort operations: <500ms (client-side)
- Approve/reject action: <1 second (database update)

**Optimization:**
- AI matching runs async (doesn't block UI)
- Pagination for large datasets (50 items per page)
- Lazy loading for receipt images
- Debounced search inputs (300ms delay)

---

## Summary

**Previa's reconciliation workflow is designed to be:**

1. ✅ **AI-Assisted** - Automation reduces manual work by 70%+
2. ✅ **User-Controlled** - You approve/reject every match
3. ✅ **Intuitive** - Side-by-side comparison makes verification easy
4. ✅ **Forgiving** - Undo recent mistakes, retry failed processing
5. ✅ **Rewarding** - Gamification makes reconciliation engaging

**The user journey in one sentence:**
> Upload documents → AI finds matches → You approve them → Done!

**Golden Rule:**
> If you're unsure about a match, reject it. Manual matching is always available, and accuracy > speed.

---

**Document Version:** 1.0
**Last Updated:** 2025-10-28
**Maintained By:** Previa Development Team
