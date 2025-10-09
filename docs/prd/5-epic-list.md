# 5. Epic List

## 1. Epic 1: Foundation & Core Services
* **Goal**: Establish the technical foundation with monorepo setup, database schema (bank accounts, statements, receipts, transactions, reconciliation_matches), user authentication, and user/premium_user tier implementation. Apply Previa branding (color palette, logo) and configure shadcn/ui with design tokens.

## 2. Epic 2: User Onboarding & Bank Account Setup
* **Goal**: Build the interactive onboarding flow (5-7 steps) that guides users to upload their first bank statement, extract account details via OCR/AI, and create their first bank account with user confirmation. Introduce gamification elements.

## 3. Epic 3: Document Upload & OCR Processing
* **Goal**: Implement document upload hub (drag/drop, validation) for bank statements and receipts. Build the OCR → AI extraction pipeline via n8n, with processing status tracking and confidence scoring.

## 4. Epic 4: AI Reconciliation Engine & Matching UI
* **Goal**: Deliver the core value proposition with the AI reconciliation engine that matches transactions to receipts. Build the matching interface (side-by-side comparison, confidence indicators, approve/reject workflows) inspired by Monarch and Expensify patterns.

## 5. Epic 5: Multi-View Dashboard & Financial Insights
* **Goal**: Build the primary user-facing dashboard with 4 views: Home (widgets for spending/income/trends), Reconciliation Engine, Transaction Table (filterable/sortable), and AI Chat Assistant. Include gamified financial literacy elements.

## 6. Epic 6: Data Export & Integrations
* **Goal**: Allow users to export reconciled data in standardized formats (CSV/JSON) compatible with Xero and QuickBooks. Prepare architecture for future direct API integrations.

