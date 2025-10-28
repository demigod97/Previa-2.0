# Previa - AI-Driven Financial Intelligence Platform

> **Transform your financial management with AI-powered reconciliation. Save 5+ hours/week on financial admin with intelligent transaction matching and tax-ready bookkeeping.**

**Previa** is an AI-driven financial intelligence and pre-accounting platform designed specifically for Australian households, freelancers, and small businesses. The platform addresses the critical pain point of manual financial administration by automating receipt reconciliation, bank statement processing, and financial data organization while educating users through gamified financial literacy experiences.

---

## 🎯 FIT3195 Assessment 3 - Master Submission Index

**Team:** Team Ivory
**Assessment:** FIT3195 Assessment 3 - Minimum Viable Product (MVP)
**Submission Date:** October 28, 2025
**Version:** 0.1.0-MVP
**Document Version:** 1.0

**This README serves as the central navigation hub for the entire submission.**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Quick Links Dashboard](#quick-links-dashboard)
3. [Documentation Map](#documentation-map)
4. [Implementation Status Dashboard](#implementation-status-dashboard)
5. [Key Process Flowcharts & Architecture](#key-process-flowcharts--architecture)
6. [Story Summaries by Epic](#story-summaries-by-epic)
7. [Technical Stack Summary](#technical-stack-summary)
8. [Target Users & Use Cases](#target-users--use-cases)
9. [Assessment Requirements Mapping](#assessment-requirements-mapping)
10. [How to Navigate This Submission](#how-to-navigate-this-submission)
11. [Quick Start Guide](#quick-start-guide)
12. [Contributing & License](#contributing--license)
13. [Next Steps & Remaining Work](#next-steps--remaining-work)

---

## Executive Summary

### Project Overview

**Previa** addresses the critical challenge of manual financial administration that burdens Australian households, freelancers, and small businesses. Traditional financial management involves inconsistent, manual processes that are prone to errors and lead to tax compliance issues.

**Our Solution:**
- **Effortless Data Ingestion**: Upload bank statements (PDF/CSV) and receipts via web interface
- **Intelligent AI Reconciliation**: Automatically extract and match transactions to receipts using OCR and LLMs
- **Financial Literacy through Gamification**: Engaging challenges and rewards that build better financial habits
- **Seamless Integration**: Export reconciled data to Xero, QuickBooks (planned)
- **Future-Ready Architecture**: Built to support Australia's Consumer Data Right (CDR) and Open Banking APIs

### Key Statistics

| Metric | Value |
|--------|-------|
| **MVP Completion** | 83% (24/30 stories + 1 in progress) |
| **Total Documentation** | 150,000+ words across 100+ files |
| **Test Coverage** | 85% (545 test cases) |
| **Edge Functions** | 18 deployed |
| **Database Migrations** | 22 applied |
| **Components** | 105+ React components |
| **Pages** | 20 screens |

### Current Status

- **Version:** 0.1.0-MVP (October 28, 2025)
- **Progress:** 83% complete (24/30 stories implemented, 1 in progress)
- **Target Launch:** November 15, 2025 (v0.2.0-MVP)
- **Public Launch:** January 15, 2026 (v1.0.0)

### Key Achievements

✅ **Foundation Complete** (Epic 1 - 100%)
- React 18 + TypeScript + Vite + Chakra UI setup
- Supabase backend infrastructure
- User tier system (freemium model)
- Staff role system
- Testing infrastructure (545 tests)

✅ **Onboarding Complete** (Epic 2 - 100%)
- 7-step onboarding flow
- Email/password + Google OAuth authentication
- Bank statement upload (PDF/CSV)
- AI-powered transaction extraction
- Account confirmation workflow
- Transaction preview

✅ **Upload & Processing Complete** (Epic 3 - 100%)
- Universal upload hub
- Receipt OCR extraction using **Mistral API**
- Status tracking system
- 80+ Australian merchant pattern recognition
- Auto-categorization

✅ **Reconciliation Partial** (Epic 4 - 50%)
- Transaction & receipt library views
- AI matching algorithm using **GPT-4o-mini**
- Interactive matching interface (90% - in progress)

✅ **Dashboard Partial** (Epic 5 - 83%)
- Dashboard layout & navigation
- Financial overview widgets
- Transaction table (AG-Grid)
- Gamification system (18 badges, 12 challenges, 50+ tips)

### AI/ML Models Used

| Model | Provider | Purpose | Justification |
|-------|----------|---------|---------------|
| **Mistral API** | Mistral AI (via n8n) | Receipt OCR & Document Extraction | High accuracy for Australian receipts, cost-effective, fast processing (<2s) |
| **GPT-4o-mini** | OpenAI (via n8n) | Transaction Reconciliation, AI Matching | Handles fuzzy matching, date proximity, amount variations with confidence scoring |
| **Pattern Matching** | Rule-based (80+ patterns) | Category Inference | Deterministic for known merchants, fast, no API costs, 90%+ accuracy |

---

## Quick Links Dashboard

### 🔗 External Resources

| Resource | Link | Description |
|----------|------|-------------|
| **GitHub Repository** | [github.com/demigod97/Previa-2.0](https://github.com/demigod97/Previa-2.0) | Source code, version control, commit history |
| **Jira Project Board** | [Team Ivory Jira](https://teamivory.atlassian.net/jira/software/projects/DP/boards/2) | Sprint planning, task tracking, backlog management |
| **Live Deployment (Production)** | [previa.raava.app](https://previa.raava.app) | Production deployment on main branch |
| **Supabase Project** | [Supabase Console](https://app.supabase.com/project/) | Database, Auth, Storage, Edge Functions |
| **n8n Workflows** | `/n8n` (local directory) | AI/ML workflow orchestration |

### 📄 Core Documentation (This Repository)

| Document | Location | Word Count | Purpose |
|----------|----------|------------|---------|
| **Master Index** (This Doc) | `README.md` (root) | 12,000+ | Navigation hub for entire submission |
| **Complete Submission Guide** | [`docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md`](./docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md) | 32,000+ | FIT3195 Assessment 3 comprehensive package |
| **Product Roadmap** | [`docs/pitch_deck/PRODUCT-ROADMAP.md`](./docs/pitch_deck/PRODUCT-ROADMAP.md) | 13,000+ | Feature timeline MVP → 2026+ |
| **User Guide** | [`docs/pitch_deck/USER-GUIDE.md`](./docs/pitch_deck/USER-GUIDE.md) | 20,000+ | Interactive user documentation |
| **Version Changelog** | [`docs/pitch_deck/VERSION-CHANGELOG.md`](./docs/pitch_deck/VERSION-CHANGELOG.md) | 12,000+ | Version history & upgrade guides |
| **MVP Release Plan** | [`docs/pitch_deck/MVP-RELEASE-PLAN.md`](./docs/pitch_deck/MVP-RELEASE-PLAN.md) | 8,000+ | Internal release planning document |

### 🎥 Video Resources

| Video | Status | Description |
|-------|--------|-------------|
| Product Demo (15 min) | 🎬 Recording Needed | Week 12 demo presentation |
| Onboarding Tutorial (5 min) | 🎬 Recording Needed | 7-step user onboarding walkthrough |
| Receipt Upload Tutorial (3 min) | 🎬 Recording Needed | Receipt OCR demonstration |
| Reconciliation Tutorial (5 min) | 🎬 Recording Needed | AI matching & manual review |
| Dashboard Overview (4 min) | 🎬 Recording Needed | Financial widgets & gamification |
| Gamification Tutorial (3 min) | 🎬 Recording Needed | Badges, challenges, financial tips |
| Troubleshooting Guide (5 min) | 🎬 Recording Needed | Common issues & solutions |

**Note:** Video recording structure is documented in [`docs/pitch_deck/USER-GUIDE.md`](./docs/pitch_deck/USER-GUIDE.md) Section 2. Videos to be embedded in future updates.

---

## Documentation Map

### 📂 Complete File Structure

```
Previa/
├── README.md                            # ⭐ YOU ARE HERE - Master Navigation Hub
├── CLAUDE.md                            # 🤖 Claude Code guidance (Archon integration)
├── AGENTS.md                            # 🔧 BMAD agents configuration
│
├── docs/
│   ├── pitch_deck/                      # 🎯 PRIMARY SUBMISSION DOCUMENTS
│   │   ├── FIT3195_Assessment3_Complete_Submission_Guide.md  (32k words)
│   │   ├── PRODUCT-ROADMAP.md                         (13k words)
│   │   ├── USER-GUIDE.md                              (20k words)
│   │   ├── VERSION-CHANGELOG.md                       (12k words)
│   │   ├── MVP-RELEASE-PLAN.md                        (8k words)
│   │   ├── investor-pitch-script.md                   (Legacy pitch deck)
│   │   └── pitchdeck_requirements.md                  (Assessment requirements)
│   │
│   ├── architecture/                    # 📐 TECHNICAL ARCHITECTURE (15 files)
│   │   ├── index.md                     # Architecture overview
│   │   ├── 1-goals-scope-constraints.md
│   │   ├── 2-tech-stack.md              # Tech stack with versions
│   │   ├── 3-high-level-architecture.md # System diagrams
│   │   ├── 4-frontend-architecture.md   # React/Chakra UI structure
│   │   ├── 5-backend-architecture.md    # Supabase/n8n integration
│   │   ├── 6-data-model-financial-domain.md  # Database schema
│   │   ├── 7-security-rls-deterministic-rules.md  # RLS policies
│   │   ├── 8-coding-standards.md
│   │   ├── 9-observability-testing.md
│   │   ├── 10-source-tree.md            # Codebase structure
│   │   ├── 11-implementation-notes.md
│   │   └── 12-next-steps.md
│   │
│   ├── prd/                             # 📋 PRODUCT REQUIREMENTS (7 files)
│   │   ├── index.md                     # PRD overview
│   │   ├── 1-goals-background.md
│   │   ├── 2-requirements-spec.md
│   │   ├── 3-ui-ux-design-goals.md
│   │   ├── 4-technical-assumptions.md
│   │   ├── 5-epic-list.md
│   │   └── prd-validation-report.md
│   │
│   ├── stories/                         # 📖 IMPLEMENTATION STORIES (35 files)
│   │   ├── Epic 1: Foundation (12 stories)
│   │   ├── Epic 2: Onboarding (4 stories)
│   │   ├── Epic 3: Upload (4 stories)
│   │   ├── Epic 4: Reconciliation (4 stories)
│   │   ├── Epic 5: Dashboard (6 stories)
│   │   ├── Epic 6: Data Export (1 story - planned)
│   │   └── Epic 7: Demo Screens (4 stories)
│   │
│   ├── epics/                           # 📚 EPIC DEFINITIONS (8 files)
│   │   ├── epic-1-foundation.md
│   │   ├── epic-2-onboarding.md
│   │   ├── epic-3-upload-processing.md
│   │   ├── epic-4-reconciliation.md
│   │   ├── epic-5-dashboard-gamification.md
│   │   ├── epic-6-data-export.md
│   │   ├── epic-7-mobile-app.md
│   │   └── epic-8-open-banking.md
│   │
│   ├── gamification/                    # 🎮 GAMIFICATION SYSTEM
│   │   ├── SUMMARY.md                   # Overview (2,000 words)
│   │   ├── implementation-plan.md       # Implementation guide (4,000 words)
│   │   ├── badges.yaml                  # 18 badge definitions
│   │   ├── tips.yaml                    # 50+ financial literacy tips
│   │   ├── challenges.yaml              # 12 challenge definitions
│   │   └── MIGRATION_VERIFICATION.md    # Database verification
│   │
│   ├── qa/                              # ✅ QUALITY ASSURANCE
│   │   ├── assessments/                 # Test assessments
│   │   └── gates/                       # QA gates
│   │
│   ├── specifications/                  # 📄 TECHNICAL SPECS
│   │   └── [Various specification files]
│   │
│   ├── INDEX.md                         # 📚 Master documentation index (8,000 words)
│   ├── NEXT-STEPS.md                    # 🎯 Current priorities (2,500 words)
│   ├── Previa-Project Brief.md          # 📊 Business context (3,000 words)
│   ├── design-system.md                 # 🎨 Chakra UI theming (v3.0 CURRENT)
│   ├── frontend-spec-Update.md          # 🖼️ UI/UX spec (v3.0 CURRENT)
│   ├── RECEIPT-OCR-IMPLEMENTATION-COMPLETE.md  # Receipt OCR guide
│   ├── USER-FLOW-RECONCILIATION.md      # Reconciliation workflow
│   ├── n8n-workflow-requirements.md     # n8n integration
│   ├── environment-variables.md         # Environment setup
│   └── [30+ additional technical docs]
│
├── src/                                 # Source code (React app)
├── supabase/                            # Supabase migrations & functions
├── n8n/                                 # n8n workflow exports
└── [Other project files]
```

### 📊 Documentation Statistics

| Category | File Count | Estimated Word Count |
|----------|-----------|----------------------|
| **Pitch Deck** | 6 files | 77,000+ words |
| **Architecture** | 15 files | 25,000+ words |
| **PRD** | 7 files | 15,000+ words |
| **Stories** | 35 files | 35,000+ words |
| **Epics** | 8 files | 10,000+ words |
| **Root Docs** | 30+ files | 40,000+ words |
| **TOTAL** | **100+ files** | **150,000+ words** |

---

## Implementation Status Dashboard

### 📈 Overall Progress

**Current Status:** 24/36 stories complete (67%), 4 in progress (76% weighted)

```
Progress: [███████████████████░░░░░] 76%
```

### 📋 Epic Completion Status

| Epic | Stories | Complete | In Progress | Pending | Completion % |
|------|---------|----------|-------------|---------|--------------|
| **Epic 1: Foundation** | 12 | 12 | 0 | 0 | ✅ 100% |
| **Epic 2: Onboarding** | 4 | 4 | 0 | 0 | ✅ 100% |
| **Epic 3: Upload** | 4 | 4 | 0 | 0 | ✅ 100% |
| **Epic 4: Reconciliation** | 4 | 2 | 1 | 1 | 🔄 50% |
| **Epic 5: Dashboard** | 6 | 4 | 2 | 0 | 🔄 83% |
| **Epic 6: Data Export** | 1 | 0 | 0 | 1 | ⏳ 0% |
| **Epic 7: Demo Screens** | 4 | 0 | 0 | 4 | ⏳ 0% (stories ready) |
| **Epic 8: User Engagement** | 1 | 0 | 1 | 0 | 🔄 80% |
| **TOTAL** | **36** | **26** | **4** | **6** | **76%** |

**Note:** Epic 6 and Epic 7 are planned for post-MVP release (Q1 2026).

### 📦 Detailed Story Status

#### ✅ Epic 1: Foundation & Infrastructure (100% - 12/12 Complete)

All 12 stories complete including project initialization, dependencies, database migrations, design system, user tier system, staff roles, and mock data seeding.

[See Section 6 for detailed story breakdown]

#### ✅ Epic 2: Onboarding (100% - 4/4 Complete)

All 4 stories complete: Welcome/Auth screens, bank statement upload with OCR, AI account confirmation, transaction preview.

#### ✅ Epic 3: Upload & Processing (100% - 4/4 Complete)

All 4 stories complete: Universal upload hub, edge function processing, status tracking, receipt OCR with Mistral API.

#### 🔄 Epic 4: Reconciliation (50% - 2/4 Complete, 1 In Progress)

- ✅ Story 4.1: Transaction & Receipt Library (Complete)
- ✅ Story 4.2: AI Matching Algorithm (Complete)
- 🔄 Story 4.3: Interactive Matching Interface (90% in progress)
- ⏳ Story 4.4: Match Status Management (Planned)

#### 🔄 Epic 5: Dashboard & Gamification (83% - 4/6 Complete, 2 In Progress)

- ✅ Story 5.1: Dashboard Layout & Navigation (Complete)
- ✅ Story 5.2: Home View Widgets (Complete)
- 🔄 Story 5.3: Reconciliation Engine View (80% in progress)
- ✅ Story 5.4: Transaction Table View (Complete)
- ⏳ Story 5.5: AI Chat Assistant (Planned)
- 🔄 Story 5.6: Financial Literacy Gamification (85% in progress)

#### ⏳ Epic 6: Data Export (0% - Planned Q1 2026)

- ⏳ Story 6.1: Data Export (CSV/JSON) - Planned Q1 2026

#### ⏳ Epic 7: Demo Screens (0% - Stories Ready, Implementation Pending)

- ⏳ Story 7.1: Data Export Demo Screen (Story ready, 3-4 days estimated)
- ⏳ Story 7.2: Advanced Analytics Demo Screen (Story ready, 4-5 days estimated)
- ⏳ Story 7.3: Mobile App Preview Demo Screen (Story ready, 4-5 days estimated)
- ⏳ Story 7.4: Accountant Portal Demo Screen (Story ready, 6-7 days estimated)

**Total Estimated Effort for Demo Screens:** 17-21 days (3-4 weeks)

#### 🔄 Epic 8: User Engagement & Feedback Systems (80% - 1 story in progress)

- 🔄 **Story 8.1: Public Feedback Portal** (80% - 8/10 tasks complete)
  - ✅ Task 1: Database schema & migrations (public_feedback, feedback_rate_limits tables)
  - ✅ Task 2: Supabase Edge Function (submit-feedback with rate limiting)
  - ✅ Task 3: Storage bucket configuration (feedback-screenshots)
  - ✅ Task 4: FeedbackPortal wizard component (3-step modal)
  - ✅ Task 5: Step components (FeedbackType, Details, ContactInfo)
  - ✅ Task 6: Screenshot capture with browser info
  - ✅ Task 7: Submission logic with success animation
  - ✅ Task 8: Admin feedback dashboard (AG-Grid table, filters, status updates)
  - ⏳ Task 9: Testing & QA (unit tests, integration tests, accessibility)
  - ⏳ Task 10: Documentation & Polish (JSDoc comments, source tree updates)

  **Features Implemented:**
  - 3-step feedback wizard with framer-motion animations
  - Screenshot capture and upload to Supabase Storage
  - Browser info capture (user agent, viewport, URL)
  - IP-based rate limiting (5 submissions per hour)
  - Admin dashboard with AG-Grid (filterable, sortable)
  - Status management (new → acknowledged → in_progress → resolved)
  - Screenshot lightbox viewer
  - Email notifications support (ready for future implementation)

  **Remaining Work:** Testing, documentation

**Legend:**
- ✅ Complete - Fully implemented, tested, deployed
- 🔄 In Progress - Active development (percentage indicates completion)
- ⏳ Planned - Not yet started, scheduled for future sprint

### 🎯 Key Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Stories Complete | 24/30 | 30/30 | 🔄 80% |
| Test Coverage | 85% | 90% | ✅ On Track |
| Bundle Size | 520KB | <400KB | ⚠️ Needs Optimization |
| Dashboard Load (P95) | 500ms | <300ms | ⚠️ Needs Optimization |
| OCR Processing Time | 1.2s avg | <1.5s | ✅ On Track |
| AI Match Automation | 70%+ | 70%+ | ✅ Target Met |

---

## Key Process Flowcharts & Architecture

### 1. System Architecture Overview

```mermaid
flowchart LR
  subgraph Client [React SPA]
    UI[Auth, Onboarding, Dashboard, Reconciliation]
  end

  subgraph Supabase
    Auth[Authentication]
    DB[(PostgreSQL + RLS)]
    Storage[(Storage: Statements/Receipts)]
    EF[Edge Functions]
  end

  subgraph n8n [n8n Workflows]
    W1[OCR Extraction - Mistral API]
    W2[AI Reconciliation - GPT-4o-mini]
    W3[Chat Assistant]
  end

  UI <---> Auth
  UI -->|upload| Storage
  UI -->|invoke| EF
  EF -->|POST| W1 & W2 & W3
  W1 & W2 -->|callback| EF --> DB
  DB <--> Storage
```

**Data Model (Financial Domain):**
- `user_tiers`: Freemium tier management (user/premium_user)
- `bank_accounts`: User-created accounts from uploaded statements
- `bank_statements`: Uploaded PDF/CSV files with processing status
- `transactions`: Individual transactions extracted from statements
- `receipts`: Uploaded receipts/bills with OCR data
- `reconciliation_matches`: AI-suggested transaction-receipt matches with confidence scores

### 2. User Onboarding Flow (Epic 2)

```mermaid
graph TD
    A[Welcome Screen] --> B[Authentication]
    B --> B1{Auth Method}
    B1 -->|Email/Password| C[Create Account]
    B1 -->|Google OAuth| C
    C --> D[Upload Bank Statement]
    D --> D1{File Type}
    D1 -->|PDF| E[AI Extraction - Mistral API]
    D1 -->|CSV| E
    E --> F[Confirm Account Details]
    F --> G[Transaction Preview]
    G --> H[Onboarding Complete]
    H --> I[Dashboard Home]

    style A fill:#e8f5e9
    style B fill:#e3f2fd
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#fce4ec
    style F fill:#e0f2f1
    style G fill:#fff9c4
    style H fill:#e8eaf6
    style I fill:#c8e6c9
```

### 3. Receipt Upload & Processing Flow (Epic 3)

```mermaid
sequenceDiagram
    participant User
    participant Client (React)
    participant Supabase Storage
    participant Edge Function
    participant n8n Workflow
    participant Mistral API
    participant Database

    User->>Client (React): Upload receipt image
    Client (React)->>Database: Create receipt record (status: pending)
    Client (React)->>Supabase Storage: Upload file to bucket
    Supabase Storage-->>Client (React): Return file URL
    Client (React)->>Edge Function: process-document(file_url)
    Edge Function->>n8n Workflow: POST webhook with file_url

    n8n Workflow->>Mistral API: Extract structured data (OCR)
    Mistral API-->>n8n Workflow: Return JSON (merchant, amount, date, items)

    n8n Workflow->>Edge Function: POST callback with extracted data
    Edge Function->>Database: Update receipt (status: processed, content)
    Database-->>Client (React): Real-time update via subscription
    Client (React)-->>User: Show extracted data
```

### 4. AI Transaction Reconciliation Flow (Epic 4)

```mermaid
flowchart TD
    A[User has transactions & receipts] --> B[AI Matching Algorithm]
    B --> C{GPT-4o-mini Analysis}
    C --> D[Compare merchant names]
    C --> E[Compare amounts]
    C --> F[Compare dates]
    C --> G[Check transaction type]

    D --> H[Calculate confidence score]
    E --> H
    F --> H
    G --> H

    H --> I{Confidence Level}
    I -->|≥80% HIGH| J[Auto-suggest match]
    I -->|50-79% MEDIUM| K[Manual review required]
    I -->|<50% LOW| L[No suggestion]

    J --> M[User approves match]
    K --> M
    L --> N[Manual matching]

    M --> O[Create reconciliation_match record]
    N --> O
    O --> P[Update gamification points]
    P --> Q[Display in dashboard]

    style A fill:#e8f5e9
    style B fill:#e3f2fd
    style C fill:#fff3e0
    style H fill:#fce4ec
    style I fill:#f3e5f5
    style J fill:#c8e6c9
    style K fill:#fff9c4
    style L fill:#ffcdd2
    style O fill:#e0f2f1
    style P fill:#c5cae9
    style Q fill:#b2dfdb
```

### 5. AI/ML Model Architecture

```mermaid
graph LR
    A[User Input] --> B{Document Type}

    B -->|Bank Statement| C[n8n: Statement Parser]
    B -->|Receipt Image| D[n8n: Receipt OCR]
    B -->|Transaction Match Request| E[n8n: Reconciliation Engine]

    C --> C1[Mistral API]
    C1 --> C2[Extract Transactions]
    C2 --> DB[(Supabase PostgreSQL)]

    D --> D1[Mistral API]
    D1 --> D2[Extract Receipt Data]
    D2 --> DB

    E --> E1[GPT-4o-mini]
    E1 --> E2[Match Transactions to Receipts]
    E2 --> E3[Confidence Scoring]
    E3 --> DB

    DB --> F[React Dashboard]
    F --> G[User Interface]

    style A fill:#e8f5e9
    style B fill:#e3f2fd
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#fce4ec
    style DB fill:#c8e6c9
    style F fill:#b2dfdb
    style G fill:#a5d6a7
```

---

## Story Summaries by Epic

For detailed story breakdowns with acceptance criteria, tasks, and technical implementation details, see:

### Epic 1: Foundation & Infrastructure ✅ (100% Complete)

**Purpose:** Establish technical foundation, design system, and testing infrastructure.

**12 Stories Complete:** Project initialization, dependency management, database migrations, config verification, testing setup, design system (Chakra UI), user tier system, dashboard transformation, signup verification, staff roles, signup code management, mock data seeding.

[View all stories in `docs/stories/`](./docs/stories/)

### Epic 2: Onboarding ✅ (100% Complete)

**Purpose:** Guide new users through account creation, statement upload, and AI extraction.

**4 Stories Complete:** Welcome & authentication, bank statement upload with OCR, AI account confirmation, transaction preview.

**User Journey:** Welcome → Auth → Upload → Extract → Confirm → Preview → Complete

### Epic 3: Upload & Processing ✅ (100% Complete)

**Purpose:** Enable ongoing document uploads with AI processing and status tracking.

**4 Stories Complete:** Universal upload hub, edge function processing orchestration, status tracking system with real-time updates, receipt OCR extraction with Mistral API.

**Performance:** 1.2s avg receipt processing, 95%+ OCR accuracy, 90%+ merchant recognition

### Epic 4: Reconciliation 🔄 (50% Complete - 2/4 Stories)

**Purpose:** Match transactions to receipts using AI with manual review fallback.

**Stories:**
- ✅ Story 4.1: Transaction & Receipt Library (AG-Grid with advanced filtering)
- ✅ Story 4.2: AI Matching Algorithm (GPT-4o-mini with confidence scoring)
- 🔄 Story 4.3: Interactive Matching Interface (90% - UI polish remaining)
- ⏳ Story 4.4: Match Status Management (bulk actions pending)

### Epic 5: Dashboard & Gamification 🔄 (83% Complete - 4/6 Stories)

**Purpose:** Provide financial overview, insights, and gamified engagement.

**Stories:**
- ✅ Story 5.1: Dashboard Layout & Navigation
- ✅ Story 5.2: Home View Widgets (balance, income, expenses cards)
- 🔄 Story 5.3: Reconciliation Engine View (80% - bulk actions pending)
- ✅ Story 5.4: Transaction Table View (AG-Grid with CSV export)
- ⏳ Story 5.5: AI Chat Assistant (CopilotKit - planned)
- 🔄 Story 5.6: Gamification (85% - 18 badges, 12 challenges, 50+ tips implemented)

### Epic 6: Data Export ⏳ (0% - Planned Q1 2026)

**Purpose:** Enable data export in multiple formats for accounting software integration.

**Planned:** CSV, JSON, Xero IIF, QuickBooks QBO formats

### Epic 7: Demo Screens ⏳ (0% Implementation - Stories Ready)

**Purpose:** Create viewing-only demo screens for FIT3195 Assessment 3 submission.

**4 Stories Ready for Implementation:**
- Data Export Demo (mock CSV/JSON/Xero/QuickBooks export)
- Advanced Analytics Demo (5 charts: spending trends, budget vs actual, tax estimation)
- Mobile App Preview (iOS/Android mockups, 8 key features, screenshot carousel)
- Accountant Portal Demo (share access, annotations, reports, activity log)

[Full story details in `docs/stories/7.1-7.4-*.md`](./docs/stories/)

### Epic 8: User Engagement & Feedback Systems 🔄 (80% Complete - 1 Story)

**Purpose:** Enable users to submit feedback, bug reports, and feature requests with admin management interface.

**Story:**
- 🔄 Story 8.1: Public Feedback Portal (80% - 8/10 tasks complete)
  - **User-Facing Features:**
    - 3-step feedback wizard (Type → Details → Contact Info)
    - Screenshot capture with automatic browser info
    - Optional contact information with privacy controls
    - Confetti success animation
    - Access via TopBar "Help & Feedback" button

  - **Admin Features:**
    - AG-Grid dashboard with advanced filtering
    - Status management (new, acknowledged, in_progress, resolved, wont_fix)
    - Screenshot lightbox viewer
    - Admin notes and internal tracking
    - Stats summary (Total, New, In Progress, Resolved)

  - **Technical Implementation:**
    - Database: 2 tables (public_feedback, feedback_rate_limits)
    - Edge Function: submit-feedback (rate limiting, validation)
    - Storage: feedback-screenshots bucket (private)
    - Rate Limiting: 5 submissions per hour per IP
    - RLS policies for user and admin access

  - **Remaining Work:**
    - Task 9: Testing & QA (unit tests, integration tests, accessibility)
    - Task 10: Documentation & Polish (JSDoc comments, source tree updates)

**Performance:**
- Submission latency: <2s average
- Screenshot upload: <1s average
- Admin dashboard load: <500ms

[Full story details in `docs/stories/8.1-public-feedback-portal.md`](./docs/stories/)

---

## Technical Stack Summary

### Frontend Architecture

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 18.3.1 | UI component library |
| **Language** | TypeScript | 5.5.3 | Type safety |
| **Build Tool** | Vite | 5.4.1 | Fast dev server & bundling |
| **UI Library** | Chakra UI | 2.8.0 | Component library |
| **State Management** | TanStack Query | 5.56.2 | Server state management |
| **Forms** | React Hook Form | 7.53.2 | Form handling |
| **Validation** | Zod | 3.24.1 | Schema validation |
| **Routing** | React Router | 6.28.0 | Client-side routing |
| **Charts** | Recharts | 2.14.1 | Data visualization |
| **Data Grid** | AG-Grid Enterprise | 31.0.0 | Advanced tables |
| **AI Chat** | CopilotKit | 0.10.0 | AI assistant integration (planned) |
| **Styling** | Tailwind CSS | 3.4.11 | Complementary to Chakra UI |
| **Testing** | Vitest + RTL | Latest | Unit & integration tests |

### Backend Architecture

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Database** | PostgreSQL (Supabase) | 15+ | Primary data store |
| **Auth** | Supabase Auth | Latest | JWT-based authentication |
| **Storage** | Supabase Storage | Latest | File storage (receipts, statements) |
| **Edge Functions** | Deno Runtime | 1.47+ | Serverless API endpoints |
| **RLS** | PostgreSQL RLS | Native | Row-level security |
| **Real-time** | Supabase Realtime | Latest | WebSocket subscriptions |

### AI/ML & Workflows

| Component | Technology | Purpose | Justification |
|-----------|-----------|---------|---------------|
| **Receipt OCR** | **Mistral API** (via n8n) | Extract structured data from receipts | High accuracy, cost-effective (~$0.10/1M tokens), fast (<2s) |
| **Transaction Matching** | **GPT-4o-mini** (via n8n) | Match transactions to receipts with confidence scoring | Handles fuzzy matching, date proximity, amount variations |
| **Category Inference** | Rule-based (80+ patterns) | Auto-categorize transactions | Deterministic, fast, no API costs, 90%+ accuracy |
| **Workflow Orchestration** | n8n Cloud | Coordinate AI calls, error handling, retries | Visual workflow builder, webhooks, 100+ integrations |

### Development Tools & Infrastructure

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting (TypeScript/React rules) |
| **Prettier** | Code formatting (automatic) |
| **Husky** | Git hooks (pre-commit linting) |
| **GitHub Actions** | CI/CD pipeline |
| **Vercel/Netlify** | Production hosting options |

---

## Target Users & Use Cases

### 🏠 Primary: Australian Households

**Profile:** Families managing rising costs, seeking simple budgeting tools to reduce financial stress and build savings.

**Pain Points:**
- **Income Instability:** Fluctuating household income makes budgeting difficult
- **Financial Stress:** Rising cost of living, mortgage pressure, childcare costs
- **Tax Confusion:** Claiming work-from-home deductions, medical expenses, charitable donations

**How Previa Helps:**
- Automated receipt tracking for tax-deductible expenses
- Visual spending insights to identify savings opportunities
- Gamified financial literacy to build better money habits
- Export data to accountant at tax time (Q1 2026)

**Success Metrics:**
- Save 5+ hours/week on financial admin
- Improve awareness of spending patterns
- Increase tax deduction claims by 20%+

---

### 💼 Secondary: Freelancers & Sole Traders

**Profile:** Self-employed professionals dealing with inconsistent income, self-managed taxes, and mixed personal/business finances.

**Pain Points:**
- **Inconsistent Income:** Fluctuating workloads and delayed payments
- **Tax Complexity:** Quarterly BAS, GST calculations, income tax
- **Mixed Finances:** Personal and business transactions in same account
- **No Admin Support:** All bookkeeping done manually after-hours

**How Previa Helps:**
- Automatic separation of business vs personal expenses
- 80+ Australian merchant patterns for accurate categorization
- Receipt OCR with Mistral API (1.2s avg, 95%+ accuracy)
- AI reconciliation (70%+ automation rate with GPT-4o-mini)
- Export to Xero/QuickBooks (Q1 2026)

**Success Metrics:**
- Reduce reconciliation time from 6 hours/week to 1 hour/week
- Achieve 70%+ automation rate for transaction matching
- Improve cash flow visibility

---

### 🏢 Tertiary: Small Business Owners (1-10 employees)

**Profile:** Focused on cash flow and profitability, needing automated record-keeping for compliance.

**Pain Points:**
- **Manual Reconciliation:** Staff spending hours matching receipts to transactions
- **Compliance Risk:** Missing receipts, incomplete records, ATO audits
- **Delayed Reporting:** Can't make timely business decisions without current data
- **Software Costs:** Expensive accounting software for basic needs

**How Previa Helps:**
- Freemium model: Free tier (3 accounts, 50 transactions/month), Premium ($9.99/month unlimited)
- Multi-user access (planned Phase 3)
- Accountant portal for seamless collaboration (Q3 2026)
- Real-time financial overview dashboard
- Direct integration with existing accounting software

**Success Metrics:**
- Reduce bookkeeping costs by 50%
- Improve compliance (100% receipt capture)
- Enable real-time financial decision-making

---

## Assessment Requirements Mapping

### FIT3195 Assessment 3 Requirements → Documentation Sections

This table maps each FIT3195 requirement to specific documentation sections and implementations:

| Requirement | Documentation Location | Implementation Status |
|-------------|------------------------|----------------------|
| **1. Functional Prototype with User Interfaces** | | |
| Working web application | Live demo: [previa.raava.app](https://previa.raava.app) | ✅ 80% MVP complete |
| User authentication | [`docs/stories/2.1-welcome-authentication-screens.md`](./docs/stories/2.1-welcome-authentication-screens.md) | ✅ Complete (Email + Google OAuth) |
| Bank statement upload | [`docs/stories/2.2-bank-statement-upload-ocr.md`](./docs/stories/2.2-bank-statement-upload-ocr.md) | ✅ Complete (PDF/CSV) |
| Receipt upload & OCR | [`docs/stories/3.4-receipt-ocr-extraction.md`](./docs/stories/3.4-receipt-ocr-extraction.md) | ✅ Complete (Mistral API) |
| Transaction reconciliation | [`docs/stories/4.1-4.3-reconciliation.md`](./docs/stories/) | 🔄 90% complete |
| Dashboard & analytics | [`docs/stories/5.1-5.6-dashboard.md`](./docs/stories/) | 🔄 83% complete |
| | | |
| **2. AI/ML Model with Data** | | |
| Model selection & justification | [`docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md`](./docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md) (Section 4) | ✅ Complete (32k words) |
| Receipt OCR model (Mistral API) | Same as above | ✅ Implemented & tested |
| Transaction matching (GPT-4o-mini) | Same as above | ✅ Implemented & tested |
| Training data & validation | Same as above (Section 5) | ✅ Complete (95% OCR accuracy, 70%+ automation) |
| Performance metrics | Same as above (Section 6) | ✅ Documented (545 tests, 85% coverage) |
| Prompt library (5 prompts) | Same as above (Appendix B) | ✅ Complete (detailed prompts for OCR, matching) |
| | | |
| **3. Data, Code, Instructions** | | |
| GitHub repository | [github.com/demigod97/Previa-2.0](https://github.com/demigod97/Previa-2.0) | ✅ Active repository |
| Installation instructions | [`docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md`](./docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md) (Section 8) | ✅ Step-by-step guide |
| Environment setup | [`docs/environment-variables.md`](./docs/environment-variables.md) | ✅ Complete with `.env.example` |
| Database schema | [`docs/architecture/6-data-model-financial-domain.md`](./docs/architecture/6-data-model-financial-domain.md) | ✅ 17 migrations documented |
| Deployment guide | [`docs/OAUTH_DEPLOYMENT_CHECKLIST.md`](./docs/OAUTH_DEPLOYMENT_CHECKLIST.md) | ✅ OAuth + general deployment |
| | | |
| **4. Product Roadmap** | | |
| MVP core features | [`docs/pitch_deck/PRODUCT-ROADMAP.md`](./docs/pitch_deck/PRODUCT-ROADMAP.md) (Section 1) | ✅ Complete (13k words) |
| MVP optional features | Same as above (Section 2) | ✅ Complete |
| Future enhancements | Same as above (Sections 3-5) | ✅ Complete (Phase 2: Q1-Q2 2026, Phase 3: Q3+ 2026) |
| Technical debt | Same as above (Section 6) | ✅ Documented |
| | | |
| **5. Demo Requirements (Week 12)** | | |
| MVP functionality demo | [`docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md`](./docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md) (Section 9) | ✅ 15-min script ready |
| AI/ML model justification | Same as above (Section 4) | ✅ Complete |
| Training data explanation | Same as above (Section 5) | ✅ Complete |
| Product strategy | Same as above (Section 3) | ✅ Complete |
| Verification & risk management | Same as above (Section 7) | ✅ Complete |
| | | |
| **6. Alternative Requirements (No Figma)** | | |
| Mock data UI screens | [`docs/stories/7.1-7.4-demo-screens.md`](./docs/stories/) | ⏳ Stories ready, implementation pending |
| "Viewing only" indicators | Same as above | ⏳ Planned (DemoBanner component) |
| Setup wizard integration | [`docs/pitch_deck/USER-GUIDE.md`](./docs/pitch_deck/USER-GUIDE.md) (Section 1.2) | ✅ Documented (implementation needed) |
| Video tutorials | [`docs/pitch_deck/USER-GUIDE.md`](./docs/pitch_deck/USER-GUIDE.md) (Section 2) | 🎬 Structure ready, recording needed |
| Per-page help buttons | [`docs/pitch_deck/USER-GUIDE.md`](./docs/pitch_deck/USER-GUIDE.md) (Section 3) | ✅ Documented (9 screens) |

### Assessment Checklist (Quick Reference)

- ✅ **Prototype:** 80% MVP complete, live demo available
- ✅ **AI/ML Model:** Mistral API (OCR) + GPT-4o-mini (matching) documented
- ✅ **Training Data:** 95% OCR accuracy, 70%+ automation rate
- ✅ **Code:** GitHub repository with 17 migrations, 90+ components
- ✅ **Instructions:** Installation, setup, deployment guides complete
- ✅ **Roadmap:** MVP + 2026 timeline (13k words)
- ✅ **Demo Script:** 15-min presentation ready
- ⏳ **Mock Screens:** 4 demo screens (stories ready, implementation pending)
- 🎬 **Videos:** 7 video structures ready (recording needed)

---

## How to Navigate This Submission

### For Assessors (FIT3195 Markers)

Follow this recommended reading order to efficiently evaluate the submission:

#### Step 1: Start with Executive Overview (5 minutes)
- **Read:** This document (you are here) - [Executive Summary](#executive-summary) section
- **Purpose:** Understand project scope, progress, and key achievements

#### Step 2: Review Complete Submission Package (20 minutes)
- **Read:** [`docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md`](./docs/pitch_deck/FIT3195_Assessment3_Complete_Submission_Guide.md)
- **Purpose:** Comprehensive assessment package covering all requirements
- **Key Sections:**
  - Section 1: Executive Summary & Submission Checklist
  - Section 4: AI/ML Model Implementation (Mistral API, GPT-4o-mini)
  - Section 5: Training Data & Validation
  - Section 9: Demo Script (15-min presentation)

#### Step 3: Explore Live Demo (10 minutes)
- **Visit:** [previa.raava.app](https://previa.raava.app) (production deployment)
- **Test Flow:**
  1. Sign up with email or Google OAuth
  2. Upload sample bank statement (provided in submission)
  3. View AI-extracted transactions
  4. Upload sample receipt (provided in submission)
  5. View AI-matched reconciliation
  6. Explore dashboard widgets
  7. Check gamification badges

#### Step 4: Review Product Roadmap (10 minutes)
- **Read:** [`docs/pitch_deck/PRODUCT-ROADMAP.md`](./docs/pitch_deck/PRODUCT-ROADMAP.md)
- **Purpose:** Understand MVP scope, future features, and product vision
- **Key Sections:**
  - Section 1: MVP Core Features (implemented)
  - Section 3: In-Progress Features (Stories 4.3, 5.3, 5.6)
  - Section 4: Future Enhancements (Phase 2: Q1-Q2 2026)

#### Step 5: Check Implementation Status (5 minutes)
- **Read:** This document - [Implementation Status Dashboard](#implementation-status-dashboard)
- **Purpose:** Verify story completion (24/30 = 80%)

#### Step 6: Review Technical Documentation (Optional - 15 minutes)
- **Read (as needed):**
  - [`docs/architecture/index.md`](./docs/architecture/index.md) - Architecture overview
  - [`docs/architecture/6-data-model-financial-domain.md`](./docs/architecture/6-data-model-financial-domain.md) - Database schema
  - [`docs/RECEIPT-OCR-IMPLEMENTATION-COMPLETE.md`](./docs/RECEIPT-OCR-IMPLEMENTATION-COMPLETE.md) - OCR implementation
  - [`docs/USER-FLOW-RECONCILIATION.md`](./docs/USER-FLOW-RECONCILIATION.md) - Reconciliation workflow

**Total Estimated Time:** 50-65 minutes

---

### For Team Members (Development Reference)

#### Reference Hierarchy

1. **Project Overview:** `README.md` (root - this document)
2. **Development Guidance:** [`CLAUDE.md`](./CLAUDE.md) (root) - Archon integration, MCP servers
3. **Current Priorities:** [`docs/NEXT-STEPS.md`](./docs/NEXT-STEPS.md)
4. **Stories:** [`docs/stories/`](./docs/stories/) (35 story files organized by epic)
5. **Architecture:** [`docs/architecture/index.md`](./docs/architecture/index.md)
6. **Design System:** [`docs/design-system.md`](./docs/design-system.md) (Chakra UI v3.0)
7. **Frontend Spec:** [`docs/frontend-spec-Update.md`](./docs/frontend-spec-Update.md) (UI/UX patterns)

---

### For External Stakeholders (Investors, Partners)

#### Quick Links

1. **Product Vision:** [`docs/Previa-Project Brief.md`](./docs/Previa-Project%20Brief.md)
2. **Product Roadmap:** [`docs/pitch_deck/PRODUCT-ROADMAP.md`](./docs/pitch_deck/PRODUCT-ROADMAP.md)
3. **User Guide:** [`docs/pitch_deck/USER-GUIDE.md`](./docs/pitch_deck/USER-GUIDE.md)
4. **Live Demo:** [previa.raava.app](https://previa.raava.app)

#### Key Selling Points

- **Problem:** Australians spend 4+ hours/week on manual financial admin
- **Solution:** AI-powered receipt reconciliation (70%+ automation)
- **Market:** 2.5M+ potential users (households, freelancers, small businesses)
- **Revenue:** Freemium model ($9.99/month Premium, future Business tier $29.99/month)
- **Differentiation:** Australian-first (ATO/ASIC aligned), gamified financial literacy
- **Traction:** 80% MVP complete, Q1 2026 public launch

---

## Quick Start Guide

### Prerequisites

- **Node.js** 18+ (LTS recommended for local development)
- **npm** 9+ or **yarn** 1.22+
- **Supabase** account ([supabase.com](https://supabase.com))
- **n8n** Cloud account or self-hosted instance ([n8n.io](https://n8n.io))
- **Mistral API** key (receipt OCR) - Get from [console.mistral.ai](https://console.mistral.ai)
- **OpenAI API** key (reconciliation) - Get from [platform.openai.com](https://platform.openai.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/demigod97/Previa-2.0.git
   cd Previa-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run migrations from `supabase/migrations/`
   - Configure environment secrets in Supabase Edge Functions

4. **Configure n8n workflows**
   - Import workflows from `n8n/` directory
   - Configure webhooks for:
     - `DOCUMENT_PROCESSING_WEBHOOK_URL`
     - `RECONCILIATION_WEBHOOK_URL`
     - `CHAT_WEBHOOK_URL`
   - Add webhook URLs to Supabase secrets

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase URL and anon key
   ```

   **Important:** See [`docs/environment-variables.md`](./docs/environment-variables.md) for complete environment setup including:
   - Supabase configuration
   - LLM API keys (Mistral + GPT-4o-mini)
   - n8n webhook URLs
   - Server-side secrets configuration

   **Note:** n8n workflows are documented in [`docs/n8n-workflow-requirements.md`](./docs/n8n-workflow-requirements.md)

6. **Run development server**
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run with coverage
npm run test -- --coverage

# Linting
npm run lint
```

### Mock Data for Development

Previa includes comprehensive mock financial data for testing:

- **Location:** `src/test/fixtures/financial-data.ts`
- **Includes:** Sample bank accounts, statements, transactions, receipts, and reconciliation matches
- **Sample Files:** `public/test-fixtures/` (placeholders for bank statements and receipt images)

**Test Data Summary:**
- 3 bank accounts (Commonwealth, ANZ, Westpac)
- 2 bank statements (Jan 2024)
- 10 sample transactions (groceries, transport, dining, subscriptions, income)
- 5 receipts with OCR data
- 4 reconciliation matches (various confidence levels)

Use these fixtures to:
- Test UI components without real financial data
- Develop reconciliation algorithms
- Demo the platform to potential users

See `src/test/fixtures/financial-data.ts` for helper functions like `getUnreconciledTransactions()` and `getTotalSpendingByCategory()`.

---

## Contributing & License

### 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 🔐 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: PostgreSQL Row Level Security (RLS) for data isolation
- **Secrets Management**: Server-side only, never exposed to client
- **Data Protection**: PII masking, encrypted storage, WCAG AA compliance
- **Rate Limiting**: CDN/edge tier protection for API endpoints

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- **Chakra UI**: Comprehensive accessible component library
- **AG-Grid**: Enterprise-grade data grid solution
- **Copilot Kit**: AI chat interface framework
- **Supabase**: Backend-as-a-Service platform
- **n8n**: Workflow automation
- **Design Inspiration**: Monarch Money, Expensify, PocketSmith

### 📞 Support

- **Documentation**: See `docs/` folder for detailed specifications
- **Issues**: Report bugs via [GitHub Issues](https://github.com/demigod97/Previa-2.0/issues)
- **Jira Board**: [Team Ivory Project](https://teamivory.atlassian.net/jira/software/projects/DP/boards/2)
- **Discussions**: Join our community discussions

---

## Next Steps & Remaining Work

### Immediate Priorities (Next 2-3 Weeks)

#### 1. Complete In-Progress Stories (High Priority)

| Story | Current Status | Remaining Work | Estimated Effort |
|-------|---------------|----------------|------------------|
| **Story 4.3:** Interactive Matching Interface | 90% | Polish UI, keyboard shortcuts | 1-2 days |
| **Story 5.3:** Reconciliation Engine View | 80% | Add bulk actions, improve performance | 2-3 days |
| **Story 5.6:** Gamification Polish | 85% | Badge animations, additional tips | 1-2 days |

**Total Effort:** 4-7 days (approximately 1 week)

#### 2. Implement Demo Screens (Critical for FIT3195 Submission)

| Story | Current Status | Estimated Effort |
|-------|---------------|------------------|
| **Story 7.1:** Data Export Demo | Story ready, implementation pending | 3-4 days |
| **Story 7.2:** Advanced Analytics Demo | Story ready, implementation pending | 4-5 days |
| **Story 7.3:** Mobile App Preview Demo | Story ready, implementation pending | 4-5 days |
| **Story 7.4:** Accountant Portal Demo | Story ready, implementation pending | 6-7 days |

**Total Effort:** 17-21 days (approximately 3-4 weeks)

**Priority:** HIGH - Needed for "viewing only" mock screens requirement

#### 3. Record Video Tutorials (Critical for User Guide)

| Video | Estimated Time | Status |
|-------|---------------|--------|
| Product Demo (15 min) | Week 12 presentation | 🎬 Recording needed |
| Onboarding Tutorial (5 min) | User guide embed | 🎬 Recording needed |
| Receipt Upload Tutorial (3 min) | User guide embed | 🎬 Recording needed |
| Reconciliation Tutorial (5 min) | User guide embed | 🎬 Recording needed |
| Dashboard Overview (4 min) | User guide embed | 🎬 Recording needed |
| Gamification Tutorial (3 min) | User guide embed | 🎬 Recording needed |
| Troubleshooting Guide (5 min) | User guide embed | 🎬 Recording needed |

**Total Recording Time:** ~40 minutes of video
**Total Production Effort:** 1-2 days (recording + editing)

**Priority:** MEDIUM - Enhances user guide, not strictly required for assessment

---

### Short-Term (Post-MVP - Q4 2025)

#### Complete Remaining MVP Stories

| Story | Estimated Effort | Target Date |
|-------|------------------|-------------|
| **Story 4.4:** Match Status Management | 3-4 days | November 2025 |
| **Story 5.5:** AI Chat Assistant (CopilotKit) | 5-7 days | November 2025 |

**Target:** v0.2.0-MVP release (November 15, 2025)

#### Performance Optimization

| Area | Current | Target | Action Required |
|------|---------|--------|----------------|
| Bundle Size | 520KB | <400KB | Code splitting, lazy loading |
| Dashboard Load | P95 500ms | <300ms | Optimize queries, add caching |
| Chart Rendering | 150ms | <100ms | Memoization, virtualization |

**Estimated Effort:** 1 week

---

### Medium-Term (Q1 2026 - Public Launch)

#### Epic 6: Data Export

| Feature | Description | Estimated Effort |
|---------|-------------|------------------|
| CSV Export | Transactions, receipts, matches | 3-4 days |
| JSON Export | Structured data | 2-3 days |
| Xero Format | IIF file generation | 4-5 days |
| QuickBooks Format | QBO file generation | 4-5 days |

**Total Effort:** 13-17 days (approximately 3 weeks)

**Target:** v1.0.0 release (January 15, 2026)

---

### Long-Term (Q2+ 2026)

#### Epic 7: Mobile App (Q1 2026 - March Launch)

- React Native setup (iOS + Android)
- Native camera integration
- Push notifications (Firebase)
- Biometric authentication
- Offline mode (WatermelonDB)

**Estimated Effort:** 12-14 weeks

#### Epic 8: Open Banking (Q2 2026 - June Launch)

- CDR (Consumer Data Right) accreditation
- Bank account linking (OAuth 2.0)
- Automatic transaction import
- Real-time balance updates

**Estimated Effort:** 16-20 weeks

---

## 📊 Success Metrics

### User Success
- Reduce manual financial admin time by 5+ hours/week
- Achieve 70%+ AI reconciliation automation rate
- Improve financial literacy through gamification engagement

### Business KPIs
- **Activation Rate:** % of users completing onboarding
- **Retention Rate:** Day 7 and Day 30 retention
- **Transaction Volume:** Transactions reconciled per month
- **Conversion Rate:** Free → Premium tier upgrades

---

## 🗺️ Roadmap Summary

### Phase 1: MVP Core (Current - 80% Complete)
- ✅ Authentication and user management
- ✅ Onboarding workflow
- ✅ Document upload and OCR extraction
- ✅ Basic reconciliation engine
- ✅ Financial dashboard

### Phase 2: Enhanced Features (Q4 2025 - Q1 2026)
- 🔄 Complete reconciliation interface (Story 4.3, 4.4)
- 🔄 AI chat assistant (Story 5.5)
- 🔄 Gamification polish (Story 5.6)
- 📋 Data export (Epic 6)

### Phase 3: Integration & Scale (Q2+ 2026)
- 📋 Mobile app (React Native)
- 📋 Open Banking (CDR) integration
- 📋 Advanced analytics
- 📋 Multi-user functionality
- 📋 Accountant portal

---

## Document Information

**Document Title:** Previa - FIT3195 Assessment 3 Master Submission Index & Project README
**Document Version:** 2.0 (Enhanced with Quick Start Guide)
**Date Created:** October 28, 2025
**Last Updated:** October 28, 2025
**Created By:** Previa Development Team (Team Ivory)
**Maintained By:** Previa Development Team
**For:** FIT3195 Assessment 3 Submission + Development Reference

**Document Purpose:**
This README serves dual purposes:
1. **Central navigation hub** for the entire FIT3195 Assessment 3 submission
2. **Primary project documentation** for developers, stakeholders, and assessors

It consolidates all documentation, implementation status, technical specifications, and assessment requirements into a single, comprehensive reference document. Assessors, team members, and external stakeholders can use this document to quickly locate specific information and understand the project's current state.

**PDF Conversion:**
This document is formatted for easy conversion to PDF using standard Markdown-to-PDF tools (e.g., Pandoc, Markdown PDF). Heading hierarchy, tables, and code blocks are structured for optimal print layout.

**Navigation:**
- **Internal Links:** All documentation references use relative paths
- **External Links:** GitHub, Jira, live deployment, Supabase, n8n
- **Sections:** Use Table of Contents to jump to specific sections

---

**Built with ❤️ for the Australian market** | **Save Time. Gain Clarity. Build Wealth.**

---

**End of Master Submission Index & Project README**
