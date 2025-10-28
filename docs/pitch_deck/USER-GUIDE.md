# Previa User Guide

**Version:** 1.0
**Last Updated:** October 28, 2025
**Target Users:** Australian households, freelancers, small businesses

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Video Tutorials](#2-video-tutorials)
3. [Screen-by-Screen Help](#3-screen-by-screen-help)
4. [Common Workflows](#4-common-workflows)
5. [Troubleshooting](#5-troubleshooting)
6. [FAQ](#6-faq)
7. [Support](#7-support)

---

## 1. Getting Started

### 1.1 Welcome to Previa!

Previa is your AI-powered financial assistant that saves you 5+ hours per week on financial administration. We automate transaction reconciliation, receipt processing, and bookkeeping so you can focus on what matters.

**What Previa Does:**
- 📤 Upload bank statements and receipts (PDF, CSV, images)
- 🤖 Extract data automatically with AI (95% accuracy)
- 🔄 Match receipts to transactions (70%+ automation)
- 📊 Track spending with visual dashboard
- 🎮 Learn financial literacy through gamification

### 1.2 Setup Wizard (Interactive)

When you first log in, you'll see the **Setup Wizard** - a 5-step guide to get you started. You can dismiss it and reopen anytime from the Help menu.

**Setup Wizard Steps:**

**Step 1: Welcome**
- Learn about Previa's core features
- Understand the 7-step onboarding process
- Click "Next" to continue

**Step 2: Upload Guide**
- Learn how to upload bank statements (PDF or CSV)
- Tips for best results:
  - File size <10MB
  - Clear, high-resolution scans
  - Supported banks: Commonwealth, ANZ, Westpac, NAB
- Click "Next" to continue

**Step 3: Processing Guide**
- Understand AI OCR processing
- What to expect: 30-60 second processing time
- Confidence scores explained (98% = very reliable, <50% = review needed)
- Click "Next" to continue

**Step 4: Review Guide**
- Learn to review extracted data
- Edit fields if AI made mistakes
- Approve transactions for import
- Click "Next" to continue

**Step 5: Confirm**
- You're ready to start!
- Dismiss wizard or keep it open as reference
- Click "Finish" to close wizard

### 1.3 First-Time Onboarding (7 Steps)

**Step 1: Welcome Screen**
- Click "Get Started Free" button
- No credit card required

**Step 2: Sign Up**
- Enter email address
- Create password (min 8 characters)
- Or sign up with Google OAuth
- Receive 6-digit verification code via email
- Enter code to verify account

**Step 3: Upload Bank Statement**
- Drag-and-drop PDF or CSV file
- Or click "Choose File" to browse
- Supported formats:
  - PDF (bank statement from online banking)
  - CSV (exported from bank website)
- File uploads to secure Supabase Storage
- OCR processing begins automatically

**Step 4: Processing Status**
- Watch real-time processing progress
- AI extracts: Account details, transactions, amounts, dates
- Processing time: 30-60 seconds for typical statement
- Green checkmarks appear as extraction completes

**Step 5: Confirm Account**
- Review extracted account details:
  - Bank name (e.g., Commonwealth Bank)
  - BSB number (e.g., 063-123)
  - Account number (last 4 digits shown: ****5678)
- Edit if incorrect (click field to edit)
- Click "Confirm" to proceed

**Step 6: Transaction Preview**
- See all extracted transactions (table view)
- Each transaction shows:
  - Date (DD/MM/YYYY)
  - Description (merchant name)
  - Amount (AUD $, red for expenses, green for income)
  - Category (auto-assigned by AI)
- Review transactions (scroll through table)
- Click "Import Transactions" to add to dashboard

**Step 7: Onboarding Complete!**
- 🎉 Success! You've imported your first transactions
- Badge unlocked: "First Steps Badge" (+10 points)
- Redirected to dashboard
- Setup wizard appears (optional guide)

### 1.4 Quick Start Checklist

After onboarding, complete these tasks:

- [ ] Upload first receipt (Earn "Receipt Collector" badge)
- [ ] Approve first AI match (Earn 3 points)
- [ ] Explore dashboard (View financial overview widgets)
- [ ] Check gamification page (See available badges and challenges)
- [ ] Watch video tutorials (Learn advanced features)

---

## 2. Video Tutorials

### 2.1 How to Watch Tutorials

All video tutorials are available in the Help menu or directly on each page via the "?" button.

**To watch a tutorial:**
1. Click "?" button in top-right corner of any page
2. Select video from dropdown menu
3. Video opens in modal player
4. Playback controls: Play/Pause, Rewind 10s, Speed (1x, 1.5x, 2x)
5. Click "X" or press ESC to close

### 2.2 Available Tutorials

**Tutorial 1: Uploading Bank Statements** (2 minutes)
- How to export statements from your bank
- Uploading PDF or CSV files
- Understanding OCR processing
- Reviewing extracted data

**Tutorial 2: Receipt Upload & OCR** (3 minutes)
- Taking clear receipt photos (mobile camera)
- Uploading receipts via web
- Understanding OCR confidence scores
- Editing extracted fields

**Tutorial 3: AI Transaction Matching** (4 minutes)
- How AI matching works
- Confidence scores explained (High/Medium/Low)
- Approving high-confidence matches
- Creating manual matches
- Rejecting incorrect matches

**Tutorial 4: Dashboard Overview** (3 minutes)
- Financial overview cards
- Charts (spending trends, category breakdown)
- Recent transactions widget
- Quick actions

**Tutorial 5: Reconciliation Workflow** (5 minutes)
- Side-by-side comparison view
- Field-level confidence indicators
- Keyboard shortcuts (A/R/N)
- Bulk approvals
- Undo capability

**Tutorial 6: Gamification Features** (2 minutes)
- Earning points
- Unlocking badges
- Completing challenges
- Financial literacy tips

**Tutorial 7: Data Export** (2 minutes) [Coming Q1 2026]
- Selecting export format (CSV, JSON)
- Choosing date range
- Filtering by category
- Downloading export file

### 2.3 Video Embed Structure

Videos are hosted externally (YouTube, Vimeo, or S3) and embedded using React Player:

```typescript
// Example embed code
<ReactPlayer
  url="https://youtu.be/YOUR_VIDEO_ID"
  width="100%"
  height="500px"
  controls={true}
  config={{
    youtube: {
      playerVars: { modestbranding: 1 }
    }
  }}
/>
```

**User Action Required:** Record screen recordings of each workflow and provide video URLs to embed.

---

## 3. Screen-by-Screen Help

### 3.1 Dashboard (Home)

**Location:** `/dashboard`

**Purpose:** Overview of your financial health

**Key Elements:**
- **Financial Overview Cards** (top row):
  - Total Balance: Sum of all bank accounts
  - Monthly Income: Income this month
  - Monthly Expenses: Expenses this month
  - Unreconciled Items: Transactions without receipts
- **Charts** (middle section):
  - Monthly Spending: Line chart (last 6 months)
  - Income vs. Expenses: Bar chart (current month)
  - Category Breakdown: Donut chart (top 5 categories)
- **Recent Transactions** (bottom section):
  - Last 5 transactions
  - Click transaction to view details
- **Quick Actions** (sidebar):
  - Upload Receipt (opens upload modal)
  - View Unreconciled (navigate to reconciliation)
  - Download Report (coming Q1 2026)

**How to Use:**
1. View balance and spending at a glance
2. Click charts to see detailed breakdown
3. Use quick actions for common tasks

**Help Button:** Click "?" in top-right → Watch "Tutorial 4: Dashboard Overview"

---

### 3.2 Transactions

**Location:** `/dashboard/transactions`

**Purpose:** View and manage all transactions

**Key Elements:**
- **Transaction Table** (AG-Grid):
  - Columns: Date, Description, Category, Amount, Reconciled, Receipt
  - 50 rows per page with pagination
  - Sortable columns (click header)
  - Filterable columns (click filter icon)
- **Filter Controls** (top):
  - Date range picker (start date, end date)
  - Category filter (multi-select)
  - Status filter (All / Reconciled / Unreconciled)
- **Search Bar** (top-right):
  - Search by merchant name or description
- **Action Buttons**:
  - Edit transaction (click row, edit inline)
  - View receipt (click 🧾 icon)
  - Create match (click "Match" button)

**How to Use:**
1. Use filters to narrow down transactions
2. Sort by column (e.g., amount descending)
3. Click transaction to edit or view details
4. Export to CSV/Excel (click "Export" button, top-right)

**Help Button:** Click "?" → Watch "Tutorial: Transaction Table"

---

### 3.3 Receipts

**Location:** `/dashboard/receipts`

**Purpose:** Library of uploaded receipts

**Key Elements:**
- **View Modes**:
  - Grid view (default): Thumbnails with key info
  - List view: Detailed rows with all fields
- **Receipt Cards** (grid view):
  - Thumbnail image (200x200px)
  - Merchant name
  - Date
  - Total amount
  - Status badge (Pending/Processing/Completed/Failed)
  - Confidence indicator (High/Medium/Low)
- **Filter Controls**:
  - Date range
  - Merchant (search)
  - Category (multi-select)
  - Status (multi-select)
- **Sort Options**:
  - Date (newest first, oldest first)
  - Amount (high to low, low to high)
  - Merchant (A-Z, Z-A)

**How to Use:**
1. Click receipt to view full details
2. Use filters to find specific receipts
3. Toggle grid/list view for different layouts
4. Click "Upload Receipt" to add new receipt

**Help Button:** Click "?" → Watch "Tutorial 2: Receipt Upload & OCR"

---

### 3.4 Receipt Details

**Location:** `/dashboard/receipts/:id`

**Purpose:** View OCR data and AI matches for a receipt

**Key Elements:**
- **Receipt Image** (left panel):
  - Full-size receipt image
  - Zoom controls (+/- buttons)
  - Download original image
- **OCR Data** (right panel, top):
  - Merchant name (confidence score)
  - Date (confidence score)
  - Total amount (confidence score)
  - GST amount (confidence score)
  - Line items (expandable list)
  - Payment method
- **Edit Button**:
  - Click any field to edit
  - Changes save automatically
- **AI Match Suggestions** (right panel, bottom):
  - Top 5 matches ranked by confidence
  - Each match shows:
    - Transaction description, date, amount
    - Confidence badge (High/Medium/Low)
    - Match reasoning ("Exact amount + date within 1 day")
  - Action buttons: Approve / Reject
- **Manual Match Button**:
  - Click to search all transactions
  - Select transaction manually
  - Confirm match

**How to Use:**
1. Review OCR data for accuracy
2. Edit fields if incorrect (click to edit)
3. Review AI match suggestions
4. Approve best match (usually first one if High confidence)
5. Or create manual match if no suggestions fit

**Help Button:** Click "?" → Watch "Tutorial 3: AI Transaction Matching"

---

### 3.5 Reconciliation

**Location:** `/dashboard/reconciliation`

**Purpose:** Approve AI-suggested matches in bulk

**Key Elements:**
- **Statistics Panel** (top):
  - Total matches: 45
  - High confidence: 32
  - Medium confidence: 10
  - Low confidence: 3
  - Reconciliation rate: 71%
  - Average confidence: 85%
- **Quick Actions Toolbar**:
  - "Approve All High Confidence" (batch approve 32 matches)
  - "Manual Match" (create custom match)
  - "Refresh" (check for new matches)
- **Match Cards** (sorted by confidence):
  - **High confidence matches** (green border):
    - Transaction (left): Description, date, amount
    - Receipt (right): Merchant, date, amount
    - Match reasoning
    - Action buttons: Approve (A) / Reject (R) / Next (N)
  - **Medium confidence matches** (yellow border)
  - **Low confidence matches** (red border)
- **Keyboard Shortcuts**:
  - A = Approve current match
  - R = Reject current match
  - N = Move to next match
- **Recent Approvals** (bottom):
  - Last 5 approved matches
  - Undo button (revert approval)

**How to Use:**
1. Start with high-confidence matches (green)
2. Use keyboard shortcuts for speed (A/R/N)
3. Bulk approve if confident ("Approve All High Confidence")
4. Review medium/low confidence manually
5. Undo if you made a mistake

**Help Button:** Click "?" → Watch "Tutorial 5: Reconciliation Workflow"

---

### 3.6 Gamification

**Location:** `/dashboard/gamification`

**Purpose:** Track badges, points, challenges, and tips

**Key Elements:**
- **Points & Level Card**:
  - Total points (large font)
  - Current level (e.g., "Level 3 Financial Apprentice")
  - Progress bar to next level
  - Points history (last 10 transactions)
- **Badge Showcase**:
  - Earned badges (colored cards with icons)
  - Locked badges (greyed out with lock icon)
  - Click badge to view details (earned date, rarity)
- **Active Challenges**:
  - Daily/weekly/monthly challenges
  - Progress bars (e.g., "3/5 transactions reconciled")
  - Countdown timer to expiration
  - Reward display ("+20 points" on completion)
- **Financial Tip of the Day**:
  - Random Australian financial literacy tip
  - Source: ATO or ASIC guidance
  - "Learn More" link (opens full tip article)
- **Leaderboard** (optional, coming Q2 2026):
  - Compare with other users
  - Filter by time period
  - Opt-in feature (privacy-first)

**How to Use:**
1. Check points and level regularly
2. Work toward unlocking badges
3. Complete challenges for bonus points
4. Read daily tips to improve financial knowledge

**Help Button:** Click "?" → Watch "Tutorial 6: Gamification Features"

---

### 3.7 Upload Hub

**Location:** `/dashboard/upload`

**Purpose:** Universal upload for all document types

**Key Elements:**
- **Upload Area** (large dropzone):
  - Drag-and-drop files
  - Or click "Choose Files" to browse
  - Supported types: PDF, CSV, JPEG, PNG
  - Max size: 10MB per file
- **Upload Queue**:
  - List of files being processed
  - Each file shows:
    - Filename
    - File type icon
    - Status (Uploading / Processing / Complete / Failed)
    - Progress bar (percentage)
    - Error message (if failed)
- **Recent Uploads** (bottom):
  - Last 10 uploaded files
  - Click to view details

**How to Use:**
1. Drag-and-drop files into upload area
2. Or click "Choose Files" and select from computer
3. Wait for processing (30-60 seconds)
4. View results in Receipts or Transactions

**Help Button:** Click "?" → Watch "Tutorial 2: Receipt Upload & OCR"

---

### 3.8 Chat (AI Assistant)

**Location:** `/dashboard/chat`

**Purpose:** Ask questions about your finances

**Key Elements:**
- **Chat Input**:
  - Text box at bottom
  - Placeholder: "Ask about your finances..."
  - Send button (or press Enter)
- **Chat Messages**:
  - User messages (right side, blue background)
  - AI messages (left side, grey background)
  - Typing indicator (three dots) when AI is thinking
- **Starter Prompts** (empty chat state):
  - "How much did I spend on groceries this month?"
  - "Show me my top 3 spending categories"
  - "Am I under budget this month?"
  - "What's my average monthly spending?"
- **Citations** (AI messages):
  - Links to transactions or receipts
  - Click to view details

**How to Use:**
1. Type question in chat box
2. AI responds with answer and data
3. Click citations to view source transactions
4. Ask follow-up questions for more details

**Help Button:** Click "?" → Watch "Tutorial: AI Chat Assistant" [Coming Q1 2026]

---

### 3.9 Settings

**Location:** `/dashboard/settings`

**Purpose:** Manage account preferences

**Key Elements:**
- **Profile Settings**:
  - Name
  - Email (read-only, change via Auth provider)
  - Profile picture (optional)
- **Tier Settings**:
  - Current tier (Free or Premium)
  - Tier limits (accounts, transactions)
  - "Upgrade to Premium" button ($9.99/month)
- **Notification Settings**:
  - Email notifications (toggle):
    - Receipt processed
    - Challenge completed
    - Badge unlocked
    - Weekly summary
  - Push notifications (mobile app, coming Q1 2026)
- **Privacy Settings**:
  - Delete account (irreversible)
  - Download data (CSV export)
  - Opt out of leaderboard

**How to Use:**
1. Update profile information as needed
2. Manage notification preferences
3. Upgrade to Premium for unlimited accounts/transactions

**Help Button:** Click "?" → Watch "Tutorial: Account Settings"

---

## 4. Common Workflows

### 4.1 Workflow: Upload and Reconcile a Receipt

**Goal:** Match a receipt to a transaction

**Steps:**
1. **Upload Receipt**:
   - Navigate to Upload page (`/dashboard/upload`)
   - Drag-and-drop receipt image
   - Wait for OCR processing (30 seconds)
2. **Review OCR Data**:
   - Navigate to Receipts page (`/dashboard/receipts`)
   - Click new receipt card
   - Review extracted data (merchant, date, amount)
   - Edit fields if incorrect
3. **View AI Matches**:
   - Scroll to "AI Match Suggestions" section
   - Review top match (usually High confidence)
   - Check match reasoning ("Exact amount + date within 1 day")
4. **Approve Match**:
   - Click "Approve" button
   - Confirmation toast appears: "Match approved! +3 points"
   - Transaction now marked as reconciled
5. **Verify on Dashboard**:
   - Navigate to Dashboard
   - "Unreconciled Items" count decreases by 1
   - Check gamification progress (points earned)

**Time:** ~2 minutes (vs. 5 minutes manual)

---

### 4.2 Workflow: Bulk Reconcile Multiple Matches

**Goal:** Approve 20+ high-confidence matches quickly

**Steps:**
1. **Navigate to Reconciliation Page**:
   - Click "Reconciliation" in sidebar
   - View statistics panel (e.g., "32 high-confidence matches")
2. **Option A: Bulk Approve All**:
   - Click "Approve All High Confidence" button
   - Confirmation modal: "Approve 32 matches?"
   - Click "Confirm"
   - All high-confidence matches approved in 2 seconds
   - Points earned: 32 × 3 = 96 points
3. **Option B: Review One-by-One**:
   - Use keyboard shortcuts for speed:
     - A = Approve current match
     - R = Reject current match
     - N = Move to next match
   - Review each match in 5-10 seconds
   - Total time: 20 matches × 8 seconds = 2.7 minutes
4. **Verify Results**:
   - Check dashboard: Unreconciled items decreased
   - Check gamification: Points earned, badge progress

**Time:** 2 seconds (bulk) or 2.7 minutes (manual)

---

### 4.3 Workflow: Export Data for Accountant

**Goal:** Export reconciled transactions for tax return

**Steps:** [Coming Q1 2026]
1. **Navigate to Data Export**:
   - Click "Export" in sidebar
   - Or use demo: `/dashboard/demo/data-export`
2. **Select Export Options**:
   - Format: CSV (for Excel) or JSON (for APIs)
   - Date range: Financial Year (01/07/2024 - 30/06/2025)
   - Categories: All (default)
   - Settings:
     - ✅ Include GST breakdown
     - ✅ Include account details
     - ✅ Include reconciliation status
3. **Preview Export**:
   - View first 20 transactions in preview table
   - Check totals: "174 transactions, $12,345.67 total"
4. **Download**:
   - Click "Download Export" button
   - File downloads: `previa-export-2024-07-01_2025-06-30.csv`
5. **Send to Accountant**:
   - Email file to accountant
   - Or upload to accounting software (Xero, QuickBooks)

**Time:** 1 minute

---

### 4.4 Workflow: Track Monthly Budget

**Goal:** Monitor spending vs. budget

**Steps:** [Coming Q2 2026]
1. **Set Budget**:
   - Navigate to Settings → Budget
   - Enter monthly budget per category:
     - Groceries: $1,200
     - Dining: $500
     - Fuel: $400
     - Shopping: $300
     - Utilities: $250
   - Click "Save Budget"
2. **Monitor Dashboard**:
   - View Budget vs. Actual chart
   - Green border: Under budget
   - Red border: Over budget
3. **Receive Alerts**:
   - Toast notification: "Warning: Dining budget exceeded by $85 (17% over)"
   - Email alert (if enabled)
4. **Adjust Spending**:
   - Review transactions in over-budget categories
   - Identify areas to cut back

**Time:** 5 minutes (initial setup), ongoing monitoring

---

### 4.5 Workflow: Prepare for Tax Time

**Goal:** Generate tax-ready reports

**Steps:**
1. **Upload All Receipts**:
   - Throughout the year, upload receipts as you receive them
   - Auto-categorized by AI
2. **Reconcile Transactions**:
   - Monthly reconciliation (20 minutes/month)
   - Ensure all transactions have receipts
3. **Review Deductions**:
   - Filter transactions by category: "Home Office", "Work Travel", "Education"
   - Verify receipts are attached
4. **Generate Tax Summary**:
   - Navigate to Data Export (coming Q1 2026)
   - Select: Tax Summary report
   - Date range: Financial Year (01/07 to 30/06)
   - Format: PDF
   - Click "Generate Report"
5. **Send to Accountant**:
   - Download PDF report
   - Email to accountant
   - Or grant accountant portal access (coming Q3 2026)

**Time:** 15 minutes (vs. 5+ hours manual)

---

## 5. Troubleshooting

### 5.1 Upload Issues

**Problem:** "Upload failed: File too large"

**Solution:**
- Max file size is 10MB
- Compress PDF or resize image
- Split multi-page statements into separate files

---

**Problem:** "Upload failed: Unsupported file type"

**Solution:**
- Supported types: PDF, CSV, JPEG, PNG
- Convert other formats (e.g., DOCX, XLSX) to PDF or CSV first
- Take screenshot if needed

---

**Problem:** "Processing stuck at 'pending' for 5+ minutes"

**Solution:**
- Refresh page (F5)
- Check Supabase status page (https://status.supabase.io)
- If still stuck, contact support with receipt ID

---

### 5.2 OCR Errors

**Problem:** "OCR extracted wrong merchant name"

**Solution:**
- Click merchant name field to edit
- Type correct merchant name
- Changes save automatically
- AI learns from your corrections (future feature)

---

**Problem:** "OCR couldn't read faded thermal receipt"

**Solution:**
- Retake photo with better lighting
- Or manually enter data (click "Edit" → fill all fields)
- For future: Scan receipts immediately after purchase (thermal paper fades)

---

**Problem:** "Confidence score is 42% (Low) - should I trust it?"

**Solution:**
- Review extracted data carefully
- Low confidence = manual review needed
- Common errors: Date, line items
- Amounts are usually accurate (95%+ reliability)

---

### 5.3 Matching Issues

**Problem:** "AI suggested wrong match (different merchant)"

**Solution:**
- Click "Reject" button
- Create manual match:
  - Click "Manual Match" button
  - Search for correct transaction
  - Select transaction
  - Confirm match

---

**Problem:** "No AI matches suggested for my receipt"

**Solution:**
- Possible reasons:
  - Transaction date outside 90-day window (adjust date on receipt)
  - Transaction already reconciled (check Transactions page)
  - Amount mismatch (check receipt total vs. bank charge)
- Create manual match if needed

---

**Problem:** "I approved wrong match by accident"

**Solution:**
- Navigate to Reconciliation page
- Scroll to "Recent Approvals"
- Click "Undo" button next to wrong match
- Transaction becomes unreconciled again
- Create correct match

---

### 5.4 Dashboard Issues

**Problem:** "Dashboard shows $0 balance but I have $10,000"

**Solution:**
- Check bank account status:
  - Navigate to Settings → Bank Accounts
  - Ensure accounts are active (not archived)
  - Refresh transactions (click "Refresh" button)
- If still incorrect, contact support

---

**Problem:** "Charts not loading (spinning indicator)"

**Solution:**
- Refresh page (F5)
- Clear browser cache (Ctrl+Shift+Delete)
- Check internet connection
- Try different browser (Chrome, Firefox, Edge)

---

### 5.5 Gamification Issues

**Problem:** "I approved 10 matches but didn't unlock 'Reconciliation Rookie' badge"

**Solution:**
- Check badge requirements:
  - Navigate to Gamification page
  - Click locked "Reconciliation Rookie" badge
  - Requirement: 10 matches approved AND 1 week active
- Wait for all conditions to be met
- Badge unlocks automatically when criteria met

---

**Problem:** "Points not awarded after approving match"

**Solution:**
- Refresh Gamification page
- Points should appear within 5 seconds
- If still missing, contact support with transaction ID

---

### 5.6 Login Issues

**Problem:** "Forgot password"

**Solution:**
- Click "Forgot Password?" on login page
- Enter email address
- Receive password reset link via email (check spam folder)
- Click link and create new password

---

**Problem:** "Email verification code not received"

**Solution:**
- Check spam/junk folder
- Wait 5 minutes (email can be delayed)
- Click "Resend Code" button
- If still not received, contact support

---

**Problem:** "Google OAuth not working"

**Solution:**
- Clear browser cookies
- Try incognito/private window
- Ensure popup blocker is disabled
- Try different browser

---

## 6. FAQ

### 6.1 General

**Q: Is Previa free?**
A: Yes! Free tier includes 3 bank accounts and 50 transactions per month. Premium tier ($9.99/month) offers unlimited accounts and transactions.

**Q: Is my financial data secure?**
A: Yes. We use bank-level encryption (AES-256), Row Level Security (RLS) in PostgreSQL, and HTTPS/TLS for data transmission. Your data is never shared with third parties.

**Q: What banks are supported?**
A: Currently: Commonwealth, ANZ, Westpac, NAB. More banks coming in Q1 2026 with Open Banking (CDR) integration.

**Q: Can I use Previa for my business?**
A: Yes! Previa supports freelancers, sole traders, and small businesses. Track business expenses, categorize deductions, and export for BAS/tax filing.

---

### 6.2 Features

**Q: Can Previa automatically import my bank transactions?**
A: Not yet. MVP requires manual upload of bank statements (PDF/CSV). Open Banking (CDR) integration coming Q2 2026 for automatic import.

**Q: How accurate is the AI matching?**
A: 70%+ automation rate with 96% precision for high-confidence matches. You always review and approve matches before they're finalized.

**Q: Can I split a receipt across multiple transactions?**
A: Not yet. MVP supports 1:1 matching only. Split transaction support coming Q2 2026.

**Q: Can I export to Xero or QuickBooks?**
A: Not yet. MVP exports CSV/JSON. Direct Xero/QuickBooks API integration coming Q2 2026.

---

### 6.3 Pricing & Plans

**Q: How do I upgrade to Premium?**
A: Navigate to Settings → Tier Settings → Click "Upgrade to Premium" → Enter payment details → Confirm subscription ($9.99/month).

**Q: Can I cancel Premium anytime?**
A: Yes. Cancel anytime with no penalty. You'll retain Premium features until end of current billing period.

**Q: Is there a Business tier?**
A: Coming Q3 2026. Business tier ($29.99/month) includes accountant portal, advanced analytics, and API access.

---

### 6.4 Technical

**Q: Which browsers are supported?**
A: Chrome/Edge 100+, Firefox 100+, Safari 15+. We recommend Chrome for best performance.

**Q: Is there a mobile app?**
A: Not yet. Responsive web app works on mobile browsers. Native iOS/Android app coming Q1 2026.

**Q: Can I use Previa offline?**
A: Not yet. Previa requires internet connection for AI processing. Offline mode (mobile app) coming Q1 2026.

---

## 7. Support

### 7.1 Help Resources

**In-App Help:**
- Click "?" button in top-right corner of any page
- Watch video tutorials
- Read tooltips (hover over elements)
- Open Setup Wizard (Help menu → "Reopen Wizard")

**Documentation:**
- User Guide (this document)
- MVP Release Submission (technical details)
- Product Roadmap (upcoming features)

**Community:**
- Discord server (coming Q1 2026)
- Reddit: r/PreviaAI (coming Q1 2026)
- Whirlpool forum thread (coming Q1 2026)

### 7.2 Contact Support

**Email:** support@previa.app
**Response Time:** 24-48 hours (weekdays)

**When contacting support, include:**
- User ID (found in Settings → Profile)
- Screenshot of issue
- Steps to reproduce
- Browser and OS version

**Premium users:** Priority support (12-hour response time)

### 7.3 Feature Requests

**Submit feature requests:**
- GitHub Issues: https://github.com/yourusername/previa/issues
- Email: features@previa.app
- Vote on existing requests (coming Q1 2026)

### 7.4 Report Bugs

**Found a bug?**
- GitHub Issues: https://github.com/yourusername/previa/issues
- Email: bugs@previa.app
- Include: Steps to reproduce, expected behavior, actual behavior, screenshots

**Bug bounty program:** Coming Q2 2026 (rewards for security vulnerabilities)

---

## Appendix A: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open search |
| `g` then `d` | Go to Dashboard |
| `g` then `t` | Go to Transactions |
| `g` then `r` | Go to Receipts |
| `g` then `m` | Go to Reconciliation (Match) |
| `g` then `g` | Go to Gamification |
| `u` | Open Upload modal |
| `?` | Open help menu |
| `Esc` | Close modal/dropdown |
| **In Reconciliation view:** | |
| `a` | Approve current match |
| `r` | Reject current match |
| `n` | Next match |
| `p` | Previous match |

---

## Appendix B: Glossary

- **AI Match:** AI-suggested receipt-to-transaction match with confidence score
- **Confidence Score:** 0-100% score indicating AI certainty (High ≥80%, Medium 50-79%, Low <50%)
- **OCR:** Optical Character Recognition (extract text from images)
- **Reconciliation:** Matching receipts to transactions
- **RLS:** Row Level Security (database-level user data protection)
- **Unreconciled Transaction:** Transaction without a matched receipt
- **User Tier:** Freemium level (Free: 3 accounts, 50 txns/month; Premium: unlimited)
- **GST:** Goods and Services Tax (10% in Australia)
- **ATO:** Australian Taxation Office
- **BAS:** Business Activity Statement (GST reporting)
- **FY:** Financial Year (01 July - 30 June in Australia)

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Maintained By:** Previa Development Team
**For:** FIT3195 Assessment 3 Submission

---

**End of User Guide**
