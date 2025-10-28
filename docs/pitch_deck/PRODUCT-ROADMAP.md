# Previa Product Roadmap

**Version:** 1.0
**Last Updated:** October 28, 2025
**Status:** MVP Development (80% Complete)

---

## Executive Summary

This roadmap details Previa's feature development from MVP (Q4 2025) through long-term vision (2026+). We've implemented 80% of MVP scope (24/30 stories) with core AI reconciliation, OCR processing, and gamification fully functional. The roadmap prioritizes completing the interactive matching interface, then expanding to Open Banking, mobile apps, and accountant portal features.

---

## Table of Contents

1. [MVP Core Features (Implemented)](#1-mvp-core-features-implemented)
2. [MVP Optional Features (Implemented)](#2-mvp-optional-features-implemented)
3. [In-Progress Features (Q4 2025)](#3-in-progress-features-q4-2025)
4. [Future Enhancements - Phase 2 (Q1-Q2 2026)](#4-future-enhancements---phase-2-q1-q2-2026)
5. [Long-Term Vision - Phase 3 (Q3 2026+)](#5-long-term-vision---phase-3-q3-2026)
6. [Technical Debt & Improvements](#6-technical-debt--improvements)
7. [Version History](#7-version-history)

---

## 1. MVP Core Features (Implemented)

### 1.1 User Onboarding & Account Creation ✅ (100%)

**Epic 2, Stories 2.1-2.4 - Completed October 2025**

**Implemented:**
- 7-step onboarding flow (Welcome → Auth → Upload → Processing → Confirm → Preview → Complete)
- Email/password authentication with 6-digit code verification
- Google OAuth integration (signup/login)
- Bank statement upload (PDF/CSV, drag-and-drop)
- Real-time OCR processing status tracker
- AI account confirmation (user can edit extracted details)
- Transaction preview with auto-categorization
- First badge award: "First Steps Badge" (+10 points)

**User Impact:**
- Average onboarding time: 3.2 minutes (tested with 20 beta users)
- 100% task success rate (all 20 users completed onboarding)
- Confidence scores displayed for extracted fields (98% merchant, 95% date, 100% amount)

**Technical Implementation:**
- React components: Welcome, Auth, BankStatementUpload, ProcessingStatus, ConfirmAccount, TransactionPreview
- Supabase Edge Functions: `process-document`, `process-document-callback`
- n8n workflow: Extract Text (Gemini/GPT-4o OCR)
- Database: `bank_statements`, `bank_accounts`, `transactions` tables

---

### 1.2 Manual Data Ingestion ✅ (100%)

**Epic 3, Stories 3.1-3.4 - Completed October 2025**

**Implemented:**

**Bank Statements:**
- PDF/CSV upload via web portal
- Supported formats: Commonwealth, ANZ, Westpac, NAB
- File validation (<10MB, PDF/CSV only)
- OCR extraction (Gemini/GPT-4o via n8n)
- Confidence scoring (merchant, date, amount, line items)
- Manual edit capability for low-confidence fields

**Receipts:**
- Image upload via web portal (JPEG, PNG, PDF)
- Mobile camera capture (responsive web)
- OCR extraction: merchant, date, line items, totals, GST
- 80+ Australian merchant pattern recognition (Woolworths, Coles, BP, etc.)
- Auto-categorization (groceries, fuel, dining, etc.)
- Thumbnail generation (200x200px)

**Universal Upload Hub:**
- Multi-file upload (drag-and-drop)
- Upload queue management
- Status tracking per file (pending/processing/completed/failed)
- Error handling with retry
- Real-time progress notifications

**User Impact:**
- Upload time: 30 seconds per receipt (includes OCR)
- 95% OCR success rate (19/20 beta receipts processed correctly)
- 70%+ automation rate for categorization

**Technical Implementation:**
- Pages: Upload.tsx, Receipts.tsx, ReceiptDetails.tsx
- Edge Functions: `process-receipt`, `process-receipt-callback`
- Database: `receipts` table with OCR fields (merchant_name, date, total_amount, gst_amount, line_items, confidence_scores)
- Storage: Supabase Storage buckets (`bank-statements`, `receipts`)
- Utilities: `categoryInference.ts` (430 lines, 80+ patterns)

---

### 1.3 AI-Powered Reconciliation ✅ (100% Backend, 90% Frontend)

**Epic 4, Stories 4.1-4.2 - Completed October 2025 (Backend), Story 4.3 In Progress (Frontend)**

**Implemented:**

**AI Transaction Matching (Backend):**
- OpenAI GPT-4o-mini integration
- Fuzzy matching algorithm (amount, date proximity, merchant similarity)
- Top 5 match suggestions per receipt
- Confidence scoring: High (≥0.80), Medium (0.50-0.79), Low (<0.50)
- Match reasoning: "Exact amount + date within 1 day + merchant match"
- Cost: ~$0.0001 per receipt
- Latency: <2 seconds average

**Transaction & Receipt Library:**
- Transaction table (AG-Grid Enterprise)
- Receipt grid/list view with thumbnails
- Filter by date, merchant, category, status
- Sort by amount, date, confidence
- Mobile-responsive card views

**Manual Reconciliation:**
- Drag-and-drop interface (3-panel layout)
- Manual match creation
- Match approval/rejection
- Status management (pending/approved/rejected)

**User Impact:**
- 70%+ automation rate (AI finds correct match in top 5 suggestions)
- 95% user approval rate for high-confidence matches
- Time savings: 5 minutes → 30 seconds per 10 matches

**Technical Implementation:**
- Edge Function: `match-receipt-transactions/index.ts` (OpenAI integration)
- Database: `ai_match_suggestions` table (9 columns, 5 indexes, 4 RLS policies)
- Hooks: `useReconciliation.ts` (fetch matches, approve/reject, create manual match)
- Components: AIMatchCard, MatchingPreview, ReconciliationView

**In Progress (Story 4.3):**
- Side-by-side comparison UI (transaction left, receipt right)
- Field-level confidence indicators (GREEN ✓, YELLOW ⚠️, RED ✗)
- Keyboard shortcuts (A/R/N for approve/reject/next)
- Statistics panel (match counts, reconciliation rate %)
- Quick actions toolbar (Approve All High Confidence, Manual Match, Refresh)
- **Target Completion:** 3-4 days

---

### 1.4 Financial Dashboard ✅ (100%)

**Epic 5, Stories 5.1-5.4 - Completed October 2025**

**Implemented:**

**Dashboard Layout:**
- Sidebar navigation (8 menu items)
- TopBar (user profile, notifications, search, countdown banner)
- Responsive design (mobile/tablet/desktop breakpoints)
- Collapsible sidebar for mobile
- Bottom tab bar (mobile)

**Home View Widgets:**
- Financial overview cards (4 metrics):
  - Total Balance (sum of all accounts)
  - Monthly Income (current month)
  - Monthly Expenses (current month)
  - Unreconciled Items (count with alert badge)
- Charts (Recharts):
  - Monthly Spending (line chart, 6 months)
  - Income vs. Expenses (bar chart, current month)
  - Category Breakdown (donut chart, top 5 categories)
- Recent activity (last 5 transactions)
- Quick actions (Upload Receipt, View Unreconciled, Download Report)

**Transaction Table:**
- AG-Grid Enterprise data grid
- 50 rows per page with pagination
- Sortable columns (date, amount, merchant, category)
- Filterable columns (date range, category, status)
- Editable cells (category, description)
- Context menu (right-click actions)
- Export to CSV/Excel
- Mobile-responsive (card view)

**User Impact:**
- Dashboard load time: <500ms (P95)
- Real-time updates via Supabase Realtime subscriptions
- 4.5/5.0 user satisfaction (beta testing)

**Technical Implementation:**
- Pages: Dashboard.tsx, TransactionsView.tsx
- Components: FinancialOverviewCards, MonthlySpendingChart, IncomeVsExpensesChart, RecentTransactionsList
- AG-Grid Enterprise 31.3.4
- Recharts for charts

---

### 1.5 Gamified Financial Tasks ✅ (85%)

**Epic 5, Story 5.6 - Completed October 2025 (85%, Minor Polish Needed)**

**Implemented:**

**Badges (18 Australian-Specific):**
- First Steps Badge (complete onboarding)
- Reconciliation Rookie (10 matches)
- Reconciliation Pro (50 matches)
- Reconciliation Expert (100 matches)
- Receipt Collector (10 receipts)
- GST Guardian (identify GST-registered merchants)
- Tax Time Ready (12 months of records)
- Budget Builder (set monthly budget)
- Superannuation Saver (track super contributions)
- Emergency Fund Hero (save 3 months expenses)
- +8 more (ATO/ASIC-aligned)

**Challenges (12 Active):**
- "Upload 5 receipts this week" (15 points)
- "Reconcile 10 transactions" (20 points)
- "Review all unreconciled items" (10 points)
- "Complete financial health quiz" (25 points)
- "Set monthly budget" (20 points)
- +7 more

**Educational Tips (50+):**
- ATO tax deduction rules
- GST calculation for businesses
- Superannuation contribution strategies
- Emergency fund recommendations
- ASIC consumer rights
- Budgeting best practices

**Points & Levels:**
- 3 points per match approved
- 5 points per receipt uploaded
- 10 points per challenge completed
- Levels: Bronze (0-99), Silver (100-249), Gold (250-499), Platinum (500+)

**User Impact:**
- 15/20 beta users reported "gamification makes finance fun"
- 85% challenge completion rate
- 12/20 users requested leaderboards (planned for Q1 2026)

**Technical Implementation:**
- Page: Gamification.tsx
- Components: AustralianBadgeShowcase, ActiveChallenges, AustralianTipOfTheDay, PointsLevelCard
- Database: `badges`, `user_badges`, `challenges`, `educational_tips` tables
- YAML data: `docs/gamification/badges.yaml`, `tips.yaml`

**Remaining Tasks (15%):**
- Fix "View All" points history link (404 at `/gamification/points-history`)
- Wire contextual tips to reconciliation events
- E2E tests for notification system
- **Target Completion:** 1-2 days

---

### 1.6 Data Export ⏳ (0% - Post-MVP)

**Epic 6, Story 6.1 - Not Started**

**Planned Features:**
- CSV/JSON export for matched data
- Xero/QuickBooks format compatibility
- Date range selection
- Category filtering
- Export history tracking
- Preview before export

**User Impact:**
- Tax-ready data for accountants
- Import to accounting software
- Backup for personal records

**Technical Implementation:**
- Page: DataExport.tsx
- Edge Function: `export-data` (CSV/JSON generation)
- Database: `export_history` table

**Target Completion:** Q1 2026 (after MVP launch)

---

## 2. MVP Optional Features (Implemented)

### 2.1 Setup Wizard ✅

**Implemented October 2025**

**Features:**
- 5-step modal wizard (Welcome → Upload Guide → Processing Guide → Review → Confirm)
- Dismissible (user can skip)
- Reopen anytime (help menu)
- Video tutorial integration (user-provided screen recordings)
- Per-page help buttons (how to manage that page)

**User Impact:**
- Reduces support requests by 40% (beta testing)
- 18/20 users completed wizard (90% completion rate)

**Technical Implementation:**
- Component: SetupWizardModal.tsx
- Hook: useSetupWizard.ts
- Video player: React Player (mp4 support)

---

### 2.2 Mobile-Responsive Design ✅

**Implemented October 2025**

**Features:**
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Mobile: Bottom tab bar, card views, touch-friendly buttons
- Tablet: Collapsible sidebar
- Desktop: Full sidebar, multi-column layouts
- Camera access for receipt upload (web API)

**User Impact:**
- 60% of beta users accessed via mobile
- 4.2/5.0 mobile usability score

**Technical Implementation:**
- Chakra UI responsive props (`base`, `sm`, `md`, `lg`, `xl`)
- CSS Grid/Flexbox layouts

---

### 2.3 Mock Data Seeding ✅

**Implemented October 2025**

**Features:**
- Edge Function: `seed-mock-data` (3 accounts, 100 transactions, 50 receipts)
- Edge Function: `delete-mock-data` (cleanup)
- Test fixtures: `financial-data.ts`, `receipt-mock-data.ts`
- 8 Australian merchants (Woolworths, Coles, BP, Chemist Warehouse, etc.)

**User Impact:**
- Enables quick demo/testing
- Reduces onboarding friction for beta users

**Technical Implementation:**
- Edge Functions: `seed-mock-data`, `delete-mock-data`
- Fixtures: `src/test/fixtures/`

---

## 3. In-Progress Features (Q4 2025)

### 3.1 Interactive Matching Interface 🔄 (90% Complete)

**Story 4.3 - In Progress (3-4 Days to Completion)**

**Current State:**
- ✅ Backend complete (AI matching algorithm, database schema)
- ✅ Basic reconciliation view exists (3-panel drag-and-drop)
- ❌ Side-by-side comparison UI not implemented
- ❌ Field-level confidence indicators not implemented
- ❌ Approve/reject workflow needs enhancement

**Remaining Tasks:**
- Build side-by-side comparison view (transaction left, receipt right)
- Add field-level indicators (GREEN ✓ exact match, YELLOW ⚠️ close, RED ✗ different)
- Implement keyboard shortcuts (A/R/N for approve/reject/next)
- Add statistics panel (match counts, reconciliation rate %, avg confidence)
- Create quick actions toolbar (Approve All High Confidence, Manual Match, Refresh)
- Add recent approvals section with Undo capability

**User Impact:**
- Improved UX for manual review
- Faster approval workflow (keyboard shortcuts)
- Clear confidence transparency

**Target Completion:** November 1-5, 2025

---

### 3.2 Reconciliation Engine View Enhancement 🔄 (80% Complete)

**Story 5.3 - In Progress (1-2 Days to Completion)**

**Current State:**
- ✅ Basic view in dashboard
- ✅ Shows AI match suggestions
- ❌ Filter controls missing
- ❌ Gamification progress display missing

**Remaining Tasks:**
- Embed enhanced MatchCard components from Story 4.3
- Add filter controls (All / High / Medium / Low confidence)
- Display gamification progress (points earned, challenge progress)
- Show "X more matches to unlock badge" text
- Improve mobile responsiveness

**User Impact:**
- Easier filtering of matches
- Motivational gamification display

**Target Completion:** November 6-8, 2025

**Dependencies:** Story 4.3 completion

---

### 3.3 AI Chat Assistant (Copilot Kit) 🔄 (70% Complete)

**Story 5.5 - In Progress (2-3 Days to Completion)**

**Current State:**
- ✅ Basic chat working (send/receive messages)
- ✅ Edge Function `send-chat-message` deployed
- ✅ Chat components (ChatInput, ChatMessage, FinancialChatPanel)
- ❌ CopilotKit provider setup incomplete
- ❌ Citation support missing
- ❌ Starter prompts missing

**Remaining Tasks:**
- Set up CopilotKit provider in App.tsx
- Implement citation support (link to transactions/receipts)
- Add starter prompts ("How much did I spend on groceries this month?")
- Configure chat labels, placeholder text
- Test message threading, typing indicators
- Add context: User has X transactions, Y receipts, Z unreconciled items

**User Impact:**
- Instant financial insights without manual filtering
- Natural language queries
- Reduces time to answer questions (2 minutes → 10 seconds)

**Technical Implementation:**
- @copilotkit/react-core 0.10.0
- @copilotkit/react-ui 2.0.0
- Edge Function: `send-chat-message` (Gemini/GPT-4o)

**Target Completion:** November 10-13, 2025

---

### 3.4 Gamification Polish 🔄 (85% Complete)

**Story 5.6 - In Progress (1-2 Days to Completion)**

**Remaining Tasks:**
- Fix "View All" points history link (404 at `/gamification/points-history`)
- Wire contextual tips to reconciliation events (first receipt upload, first match approved)
- E2E tests for notification system
- Add badge unlock animations (confetti, toast)

**User Impact:**
- Improved user engagement
- Smoother gamification experience

**Target Completion:** November 8-10, 2025

---

### 3.5 Integration: Reconciliation → Gamification 🔄 (0%)

**Planned November 2025 (0.5 Days)**

**Tasks:**
- Wire reconciliation events to gamification system
- Award 3 points per match approved
- Award badges: Reconciliation Rookie (10 matches), Pro (50), Expert (100)
- Trigger contextual tips on first receipt upload, first reconciliation
- Update challenge progress in real-time

**User Impact:**
- Immediate feedback on financial actions
- Motivates continued engagement

**Target Completion:** November 11, 2025

**Dependencies:** Story 4.3, 5.6 completion

---

## 4. Future Enhancements - Phase 2 (Q1-Q2 2026)

### 4.1 Match Status Management ⏳

**Story 4.4 - Planned Q1 2026**

**Features:**
- Bulk status updates (approve/reject multiple matches)
- Status change history tracking
- Undo/redo capability for match decisions
- Export matched data (CSV/JSON)
- Audit log for compliance

**User Impact:**
- Faster bulk reconciliation (approve 50 matches → 10 seconds)
- Undo mistakes without manual reversion

**Technical Implementation:**
- Database: `match_status_history` table
- Edge Function: `bulk-update-matches`
- UI: Checkbox selection, toolbar actions

**Estimated Effort:** 2-3 days

---

### 4.2 Data Export (CSV/JSON/Xero/QuickBooks) ⏳

**Epic 6, Story 6.1 - Planned Q1 2026**

**Features:**
- CSV export (reconciled transactions)
- JSON export (API-friendly format)
- Xero import format (Xero bank statement import)
- QuickBooks import format (IIF file)
- Date range selection
- Category filtering
- Export history tracking

**User Impact:**
- Tax-ready data for accountants
- Seamless import to accounting software
- Backup for personal records

**Technical Implementation:**
- Page: DataExport.tsx
- Edge Function: `export-data` (CSV/JSON generation)
- Database: `export_history` table
- Libraries: papaparse (CSV), xlsx (Excel)

**Estimated Effort:** 4-5 days

---

### 4.3 Mobile App (React Native) ⏳

**Epic 7 - Planned Q1 2026**

**Features:**
- Native camera integration (higher quality photos)
- Push notifications (receipt processing complete, challenges unlocked)
- Biometric auth (Face ID, Touch ID)
- Offline mode (sync when back online)
- Native gestures (swipe actions, pull-to-refresh)

**User Impact:**
- 12/20 beta users requested mobile app
- Easier receipt capture (instant camera access)
- Engagement boost (push notifications)

**Technical Implementation:**
- Framework: React Native 0.73+
- Navigation: React Navigation
- State: TanStack Query (same as web)
- Camera: react-native-camera
- Auth: Supabase Auth (native SDK)

**Estimated Effort:** 30-40 days (2 developers)

**Target Release:** March 2026

---

### 4.4 Open Banking (CDR) Integration ⏳

**Epic 8 - Planned Q2 2026**

**Features:**
- Consumer Data Right (CDR) accreditation (required for Open Banking in Australia)
- Bank account linking (Commonwealth, ANZ, Westpac, NAB, etc.)
- Automatic transaction import (no manual upload)
- Real-time balance updates
- Transaction categorization (same AI models)

**User Impact:**
- Zero manual data entry
- Real-time financial visibility
- Automatic reconciliation

**Technical Implementation:**
- CDR API integration (OAuth 2.0)
- Edge Functions: `cdr-auth`, `cdr-fetch-transactions`
- Database: `cdr_connections` table
- Compliance: ACCC accreditation process (~$50K cost)

**Estimated Effort:** 60-90 days (after accreditation)

**Target Release:** June 2026

**Dependencies:** Seed funding ($500K for accreditation costs)

---

### 4.5 Advanced Analytics Dashboard ⏳

**Epic 9 - Planned Q2 2026**

**Features:**
- Budget vs. Actual (bar chart, by category)
- Cash flow forecasting (30/60/90 day projections)
- Tax estimation calculator (income tax, GST, super)
- Spending trends (year-over-year, month-over-month)
- Category deep-dives (subcategories, merchant breakdowns)
- Custom date ranges (compare any two periods)

**User Impact:**
- Better financial planning
- Tax preparation insights
- Identify spending patterns

**Technical Implementation:**
- Pages: AdvancedAnalytics.tsx
- Edge Function: `calculate-tax-estimate` (ATO tax brackets)
- Charts: Recharts (existing library)

**Estimated Effort:** 10-15 days

---

### 4.6 Bulk Receipt Upload ⏳

**Epic 10 - Planned Q1 2026**

**Features:**
- Multi-file upload (up to 50 receipts at once)
- Folder upload (desktop only)
- Batch OCR processing (queue management)
- Progress tracking (X of Y processed)
- Error handling (retry failed receipts)

**User Impact:**
- 8/20 beta users requested this feature
- Faster onboarding (upload year of receipts)

**Technical Implementation:**
- UI: Drag-and-drop folder
- Edge Function: `process-receipts-batch` (parallel processing)
- Database: `batch_upload_jobs` table

**Estimated Effort:** 5-7 days

---

## 5. Long-Term Vision - Phase 3 (Q3 2026+)

### 5.1 Accountant Portal ⏳

**Epic 11 - Planned Q3 2026**

**Features:**
- Share access interface (invite accountant via email)
- Data permission controls (read-only, export, edit)
- Report generation (P&L, balance sheet, tax summary)
- Annotation capability (accountant can add notes)
- Activity logs (track accountant actions)

**User Impact:**
- Collaborate with tax professional
- Reduce accountant billable hours (organized data)

**Technical Implementation:**
- Database: `shared_access` table (user_id, accountant_email, permissions)
- RLS policies: Allow accountant read access
- Pages: AccountantPortal.tsx

**Estimated Effort:** 20-30 days

---

### 5.2 API Access (Third-Party Integrations) ⏳

**Epic 12 - Planned Q3 2026**

**Features:**
- REST API endpoints (`/api/transactions`, `/api/receipts`, `/api/matches`)
- OAuth 2.0 authentication for third-party apps
- Rate limiting (1000 requests/hour)
- API documentation (OpenAPI/Swagger)
- Webhook support (notify on new transaction, match approved)

**User Impact:**
- Integration with custom tools
- Developer ecosystem

**Technical Implementation:**
- Supabase PostgREST (automatic API generation)
- Edge Functions: API authentication, rate limiting
- Documentation: Swagger UI

**Estimated Effort:** 15-20 days

---

### 5.3 Advanced AI Features ⏳

**Epic 13 - Planned Q4 2026**

**Features:**

**Recurring Transaction Detection:**
- Identify patterns (Netflix $15.99/month, rent $2000/month)
- Auto-categorize future occurrences
- Alert on missing recurring charges (forgot to pay rent?)

**Anomaly Detection:**
- Flag unusual transactions (large amount, new merchant, foreign currency)
- Alert user: "You spent $500 at UNKNOWN MERCHANT - verify?"

**Predictive Budgeting:**
- Forecast spending: "Based on trends, you'll spend $800 on groceries next month"
- Suggest budget adjustments

**User Impact:**
- Proactive financial management
- Reduce surprises (missed payments, fraud)

**Technical Implementation:**
- AI Model: Time-series analysis (ARIMA, LSTM)
- Edge Function: `detect-anomalies`, `detect-recurring`
- Database: `recurring_transactions`, `anomaly_alerts` tables

**Estimated Effort:** 30-40 days

---

### 5.4 Multi-User Accounts (Household Members) ⏳

**Epic 14 - Planned Q1 2027**

**Features:**
- Add household members (email invite)
- Role-based permissions (admin, member, viewer)
- Separate user tiers (one Premium plan covers 4 users)
- Activity logs (who uploaded receipt, who approved match)
- Private transactions (hide from other users)

**User Impact:**
- Household financial collaboration
- Shared budget tracking

**Technical Implementation:**
- Database: `household_members` table
- RLS policies: Allow household members to see shared data
- UI: User management page

**Estimated Effort:** 20-30 days

---

### 5.5 White-Label Solution (Banks/Fintechs) ⏳

**Epic 15 - Planned Q2 2027**

**Features:**
- Custom branding (logo, colors, domain)
- Embedded widget (iframe for bank websites)
- SSO integration (SAML, OAuth)
- Custom tier limits (banks set transaction caps)
- Revenue share model (Previa takes 20% of subscription fees)

**User Impact:**
- Bank customers get Previa features in-app
- Previa scales via B2B partnerships

**Technical Implementation:**
- Multi-tenant database architecture
- Custom domain routing (previa.bankname.com)
- Whitelabel admin portal

**Estimated Effort:** 60-90 days

---

## 6. Technical Debt & Improvements

### 6.1 Performance Optimization

**Issues:**
- Main bundle size >500KB (needs code splitting)
- Dashboard load time P95: 500ms (target <300ms)
- Large transaction datasets (500+) slow pagination

**Improvements:**
- Code splitting (React.lazy, dynamic imports)
- CDN for static assets (Cloudflare)
- Postgres query optimization (EXPLAIN ANALYZE)
- Redis caching for dashboard widgets

**Estimated Effort:** 10-15 days

**Target:** Q1 2026

---

### 6.2 Testing Expansion

**Current Coverage:**
- Unit tests: 85% code coverage (545 tests)
- E2E tests: Limited (critical paths only)

**Improvements:**
- Expand E2E tests (Playwright)
- Visual regression tests (Percy)
- Load testing (k6, 1000 concurrent users)
- Security testing (OWASP ZAP)

**Estimated Effort:** 15-20 days

**Target:** Q1 2026

---

### 6.3 Documentation Updates

**Current State:**
- Code comments: 60% coverage
- API docs: None (no public API yet)
- User guide: Basic (setup wizard only)

**Improvements:**
- API documentation (Swagger/OpenAPI)
- User guide (comprehensive, searchable)
- Developer onboarding guide (contribution docs)
- Video tutorials (screen recordings)

**Estimated Effort:** 10-15 days

**Target:** Q1 2026

---

### 6.4 Accessibility Improvements

**Current State:**
- WCAG AA compliance: 90% (some contrast issues, keyboard nav gaps)

**Improvements:**
- Audit with axe DevTools
- Fix contrast issues (text on backgrounds)
- Keyboard navigation (all interactive elements)
- Screen reader testing (NVDA, JAWS)

**Estimated Effort:** 5-10 days

**Target:** Q1 2026

---

## 7. Version History

### Version 0.1.0-MVP (October 2025) - Current

**Released:** October 28, 2025
**Status:** 80% Complete (24/30 stories)

**Features:**
- ✅ User onboarding (7-step flow)
- ✅ Manual data ingestion (bank statements + receipts)
- ✅ AI-powered OCR (Gemini/GPT-4o)
- ✅ AI transaction matching (GPT-4o-mini, 70%+ automation rate)
- ✅ Financial dashboard (overview cards + charts)
- ✅ Gamified financial literacy (18 badges, 12 challenges, 50+ tips)
- 🔄 Interactive reconciliation UI (in progress)

**Bug Fixes:**
- Fixed: Receipts page 404 error (navigation issue)
- Fixed: Setup wizard modal not dismissible
- Fixed: Dashboard chart loading state

**Known Issues:**
- Minor: "View All" points history link 404 (gamification)
- Medium: Manual match UI confusing (Story 4.3 addresses)

---

### Version 0.2.0-MVP (November 2025) - Planned

**Target Release:** November 15, 2025

**Features:**
- ✅ Interactive matching interface (Story 4.3)
- ✅ Reconciliation engine view enhancement (Story 5.3)
- ✅ Gamification polish (Story 5.6)
- ✅ Reconciliation → Gamification integration

**Bug Fixes:**
- Fix: "View All" points history link
- Fix: Manual match UI confusion
- Fix: Mobile keyboard overlap on input fields

**Performance:**
- Bundle size reduction (500KB → 350KB via code splitting)
- Dashboard load time improvement (500ms → 300ms P95)

---

### Version 1.0.0 (January 2026) - Public Launch

**Target Release:** January 15, 2026

**Features:**
- ✅ All MVP stories complete (30/30)
- ✅ Match status management (Story 4.4)
- ✅ AI chat assistant (Story 5.5)
- ✅ Data export (CSV/JSON) (Story 6.1)
- ✅ Beta testing complete (500 users)
- ✅ Performance optimized
- ✅ E2E tests expanded

**Bug Fixes:**
- All known issues resolved

**Marketing:**
- Public launch announcement
- Content marketing campaign
- Reddit/Whirlpool outreach
- Google Ads (long-tail keywords)

---

### Version 1.1.0 (March 2026)

**Target Release:** March 1, 2026

**Features:**
- ✅ Mobile app (React Native, iOS + Android)
- ✅ Bulk receipt upload
- ✅ Advanced analytics dashboard

**Improvements:**
- Push notifications (mobile)
- Biometric auth (mobile)
- Offline mode (mobile)

---

### Version 1.2.0 (June 2026)

**Target Release:** June 1, 2026

**Features:**
- ✅ Open Banking (CDR) integration
- ✅ Direct Xero API integration
- ✅ Direct QuickBooks API integration

**User Impact:**
- Automatic transaction import (no manual upload)
- Real-time balance updates

---

### Version 2.0.0 (Q4 2026)

**Target Release:** October 1, 2026

**Features:**
- ✅ Accountant portal
- ✅ API access for third-party integrations
- ✅ Advanced AI (recurring detection, anomaly detection)
- ✅ Multi-user accounts (household members)

**User Impact:**
- Collaborative financial management
- Developer ecosystem

---

## Roadmap Summary Timeline

```
Q4 2025 (October-December):
├── Complete Story 4.3 (Interactive Matching UI)
├── Complete Story 5.3 (Reconciliation Engine View)
├── Complete Story 5.6 (Gamification Polish)
├── Complete Story 4.4 (Match Status Management)
├── Complete Story 5.5 (AI Chat Assistant)
├── Beta testing (50 → 500 users)
└── MVP Release (v0.2.0) - November 15

Q1 2026 (January-March):
├── Public launch (v1.0.0) - January 15
├── Data export (CSV/JSON/Xero/QuickBooks)
├── Bulk receipt upload
├── Mobile app development (React Native)
├── Performance optimization
├── E2E testing expansion
├── Seed funding ($500K target)
└── Mobile app release (v1.1.0) - March 1

Q2 2026 (April-June):
├── Open Banking (CDR) accreditation
├── CDR integration development
├── Advanced analytics dashboard
├── Direct Xero/QuickBooks API
└── Open Banking release (v1.2.0) - June 1

Q3 2026 (July-September):
├── Accountant portal
├── API access (third-party integrations)
└── Advanced AI features (recurring, anomaly detection)

Q4 2026 (October-December):
├── Multi-user accounts
├── White-label solution (banks/fintechs)
└── Version 2.0.0 release - October 1
```

---

## Success Metrics (Roadmap KPIs)

### User Growth
- **MVP Launch (Jan 2026):** 500 users
- **Q1 2026:** 1,000 users (100% growth)
- **Q2 2026:** 3,000 users (200% growth)
- **Q3 2026:** 7,000 users (133% growth)
- **Q4 2026:** 10,000 users (43% growth)

### Engagement
- **Month-over-Month Retention:** ≥20%
- **Day 7 Retention:** ≥40%
- **Day 30 Retention:** ≥25%
- **Transactions Reconciled/User/Month:** ≥20
- **Receipts Uploaded/User/Month:** ≥10

### Revenue
- **Freemium Conversion Rate:** ≥10% (free → premium)
- **Premium Tier:** $9.99/month
- **Q1 2026 ARR:** $6,000 (50 premium users)
- **Q2 2026 ARR:** $36,000 (300 premium users)
- **Q4 2026 ARR:** $120,000 (1,000 premium users)

### Product
- **AI Automation Rate:** ≥70% (receipts auto-matched)
- **OCR Accuracy:** ≥95% (merchant, date, amount)
- **User Satisfaction (NPS):** ≥40
- **System Uptime:** ≥99.5%

---

## Prioritization Framework

**RICE Scoring:**

| Feature | Reach | Impact | Confidence | Effort | RICE | Priority |
|---------|-------|--------|------------|--------|------|----------|
| Story 4.3 (Interactive Matching UI) | 100% | 3 | 90% | 3 days | 90.0 | 🔴 P0 |
| Story 5.3 (Reconciliation View) | 100% | 2 | 95% | 1 day | 190.0 | 🔴 P0 |
| Story 5.6 (Gamification Polish) | 80% | 1 | 80% | 1 day | 64.0 | 🟡 P1 |
| Data Export (CSV/JSON) | 60% | 3 | 70% | 4 days | 31.5 | 🟡 P1 |
| Mobile App | 90% | 3 | 60% | 30 days | 5.4 | 🟢 P2 |
| Open Banking | 70% | 3 | 40% | 60 days | 1.4 | 🟢 P2 |
| Accountant Portal | 40% | 2 | 50% | 20 days | 2.0 | 🟢 P3 |

**Priority Levels:**
- 🔴 **P0 (Critical):** Complete before MVP launch
- 🟡 **P1 (High):** Complete within 3 months of launch
- 🟢 **P2 (Medium):** Complete within 6 months of launch
- ⚪ **P3 (Low):** Complete within 12 months of launch

---

## Change Log

**October 28, 2025:**
- Initial roadmap created (v1.0)
- MVP progress: 80% complete (24/30 stories)
- Added Phase 2 (Q1-Q2 2026) features
- Added Phase 3 (Q3 2026+) long-term vision

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Next Review:** November 15, 2025 (after MVP release v0.2.0)
**Authors:** [Your Team Names]
**Course:** FIT3195 - Software Engineering: AI and ML

---

**End of Product Roadmap**
