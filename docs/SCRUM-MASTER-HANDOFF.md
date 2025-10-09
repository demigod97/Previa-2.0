# Scrum Master Handoff Document

**Date:** 2025-01-09  
**From:** Winston (Architect) & Sarah (Product Owner)  
**To:** Bob (Scrum Master)  
**Project:** Previa - AI-Driven Financial Intelligence Platform  
**Phase:** Foundation Complete → Epic & Story Creation

---

## 🎯 Executive Summary

The technical foundation for Previa is **COMPLETE and VALIDATED**. All critical implementation blockers have been resolved, database migrations are production-ready, and technical architecture is aligned.

**Your Mission:** Create 6 epics with detailed user stories to guide development through the MVP launch.

---

## ✅ What's Been Completed

### 1. Configuration & Document Structure ✅

**PRD Sharded:**
- ✅ `docs/prd/` - 6 files (Goals, Requirements, UI Design, Technical Assumptions, Epic List, Validation)
- ✅ `docs/prd/index.md` - Navigation index

**Architecture Sharded:**
- ✅ `docs/architecture/` - 11 files (Goals, PRD Alignment, High-Level Arch, Frontend, Backend, Data Models, Security, Edge Cases, Observability, Implementation Notes)
- ✅ `docs/architecture/index.md` - Navigation index

**Story Infrastructure:**
- ✅ `docs/stories/` - Directory created for story file storage
- ✅ `.bmad-core/core-config.yaml` - Configuration validated and aligned

### 2. Database Foundation ✅

**3 Production-Ready Migrations Created:**

1. **Financial Schema** (`20250109000001_create_financial_schema.sql`)
   - 6 tables: `user_tiers`, `bank_accounts`, `bank_statements`, `transactions`, `receipts`, `reconciliation_matches`
   - Comprehensive indexing for performance
   - All tables use UUID primary keys
   - CASCADE deletes configured

2. **RLS Policies** (`20250109000002_create_financial_rls_policies.sql`)
   - User data isolation (users can only access their own data)
   - Secure by default (defense in depth)
   - All financial tables protected

3. **User Tier Trigger** (`20250109000003_create_default_tier_trigger.sql`)
   - Auto-creates free tier on user signup
   - Default limits: 3 accounts, 50 transactions/month, 10 receipts/month
   - Updated_at triggers for timestamps

**Architect Review Status:** ✅ **APPROVED** (see architect review above)

### 3. Environment & Configuration ✅

**Documentation Created:**
- ✅ `docs/environment-variables.md` - Complete environment setup guide
- ✅ `docs/n8n-workflow-requirements.md` - n8n workflow specifications
- ✅ `docs/architecture/TECHNICAL-DECISIONS.md` - 10 key technical decisions documented
- ✅ `docs/env-example-template.md` - .env.example template

**Application Constants:**
- ✅ `src/config/constants.ts` - OCR thresholds, tier limits, reconciliation rules, UI config

### 4. Testing Infrastructure ✅

**Mock Data Created:**
- ✅ `src/test/fixtures/financial-data.ts` - Comprehensive test fixtures
  - 2 user tiers (free and premium)
  - 3 bank accounts (Commonwealth, ANZ, Westpac)
  - 2 bank statements
  - 10 transactions (various categories)
  - 5 receipts with OCR data
  - 4 reconciliation matches

**Sample Files:**
- ✅ `public/test-fixtures/` - Directory for sample PDFs/images
- ✅ `public/test-fixtures/README.md` - Usage guide

**Vitest Configuration:**
- ✅ `vitest.config.ts` - Updated for jsdom environment with coverage reporting

### 5. Documentation ✅

**Updated Files:**
- ✅ `README.md` - Previa-specific setup, LLM config, testing guide
- ✅ `docs/project-log.md` - 2025-01-09 entry with complete change log

---

## 🔑 Technical Decisions (Locked In)

| Decision | Choice | Impact on Stories |
|----------|--------|-------------------|
| **LLM Provider** | Gemini (primary), GPT-4o (optional) | Epic 3: OCR extraction, Epic 4: Reconciliation |
| **OCR Thresholds** | 90% accuracy for account numbers & receipts | Epic 3: Acceptance criteria for OCR features |
| **Tier Limits** | Free: 3/50/10, Premium: Unlimited | Epic 1: Tier management implementation |
| **Testing** | Mock data fixtures approach | All epics: Test data available for development |
| **Database** | PostgreSQL + RLS | Epic 1: Migration deployment story |
| **n8n Workflows** | 3 workflows (OCR, Reconciliation, Chat) | Epic 3-5: Workflow integration stories |

**Full details:** See `docs/architecture/TECHNICAL-DECISIONS.md`

---

## 📋 Epic Structure (From PRD)

Create these 6 epics with user stories:

### Epic 1: Foundation & Core Services
**Goal:** Establish technical foundation with monorepo setup, database schema, authentication, tier management, and Previa branding.

**Story Recommendations:**
1. **Story 1.1:** Initialize Previa project (clean PolicyAi UI, preserve infrastructure)
2. **Story 1.2:** Audit and update dependencies for Previa
3. **Story 1.3:** **Deploy database migrations** (schema, RLS, triggers) ← **CRITICAL: Run migrations here**
4. **Story 1.4:** Create config constants file & .env.example (src/config/constants.ts) ← **Already created, verify in story**
5. **Story 1.5:** Set up testing infrastructure (configure Vitest, create sample test)
6. **Story 1.6:** Build Previa design system (shadcn/ui with warm color palette)

**From PRD:** Section 5, Epic 1

### Epic 2: User Onboarding & Bank Account Setup
**Goal:** Build interactive onboarding flow (5-7 steps) to guide users through first statement upload, account creation with AI assistance, and gamification intro.

**Key Features:**
- Welcome screen with value proposition
- Account creation (Supabase Auth)
- Upload first bank statement
- AI extraction & account setup
- Transaction preview
- Onboarding complete with gamification

**From PRD:** Section 5, Epic 2

### Epic 3: Document Upload & OCR Processing
**Goal:** Implement document upload hub (drag/drop) for bank statements and receipts. Build OCR → AI extraction pipeline via n8n.

**Key Features:**
- Document upload hub with validation
- Processing status tracking
- Confidence scoring (90% threshold)
- n8n workflow integration (DOCUMENT_PROCESSING_WEBHOOK_URL)

**Technical Requirements:**
- See `docs/n8n-workflow-requirements.md` - Section 1: Document Processing Workflow
- OCR thresholds: `src/config/constants.ts` - OCR_ACCOUNT_NUMBER_THRESHOLD, OCR_RECEIPT_DATA_THRESHOLD

**From PRD:** Section 5, Epic 3

### Epic 4: AI Reconciliation Engine & Matching UI
**Goal:** Deliver core value proposition with AI reconciliation engine. Build matching interface (side-by-side comparison, confidence indicators, approve/reject workflows).

**Key Features:**
- AI-powered transaction-to-receipt matching
- Side-by-side comparison UI
- Confidence indicators (95% auto-approve threshold)
- Approve/reject workflows
- Inspiration: Monarch Money, Expensify patterns

**Technical Requirements:**
- See `docs/n8n-workflow-requirements.md` - Section 2: Reconciliation Matching Workflow
- Reconciliation thresholds: `src/config/constants.ts` - RECONCILIATION_AUTO_APPROVE_THRESHOLD
- Target: 70% automation rate

**From PRD:** Section 5, Epic 4

### Epic 5: Multi-View Dashboard & Financial Insights
**Goal:** Build primary user-facing dashboard with 4 views: Home (widgets), Reconciliation Engine, Transaction Table, AI Chat Assistant. Include gamified financial literacy.

**Key Views:**
1. **Home:** Widgets for spending/income/trends
2. **Reconciliation Engine:** Main matching interface
3. **Transaction Table:** Filterable/sortable with batch actions
4. **AI Chat Assistant:** Financial guidance with citations

**Technical Requirements:**
- See `docs/n8n-workflow-requirements.md` - Section 3: Chat Workflow
- See `docs/frontend-spec-new.md` - Sections 7-9 (Dashboard Views)

**From PRD:** Section 5, Epic 5

### Epic 6: Data Export & Integrations
**Goal:** Allow users to export reconciled data in standardized formats (CSV/JSON) compatible with Xero and QuickBooks. Prepare architecture for future API integrations.

**Key Features:**
- Export to CSV/JSON
- Xero/QuickBooks format compatibility
- Data validation before export
- Export history tracking

**From PRD:** Section 5, Epic 6

---

## 📝 Story Creation Guidelines

### Story Template Location
- **Template:** `.bmad-core/templates/story-tmpl.yaml`
- **Task to use:** `.bmad-core/tasks/create-next-story.md`
- **Save location:** `docs/stories/`

### Story Naming Convention
- **Format:** `{epic}.{story}.{slug}.md`
- **Example:** `1.1.initialize-previa-project.md`

### Required Story Sections (From Template)
1. **Story Title & Status**
2. **User Story** (As a... I want... So that...)
3. **Acceptance Criteria** (Testable, specific)
4. **Dev Notes** (Technical context, architecture references)
5. **Tasks / Subtasks** (Detailed, sequential)
6. **Testing** (Unit, integration, validation steps)
7. **Dev Agent Record** (For developer to fill during implementation)

### Epic 1 Story 1.1 - Special Instructions

**Story 1.1: Initialize Previa Project** is critical and should include:

**User Story:**
```
As a developer,
I want to clean PolicyAi references from the UI and preserve Supabase infrastructure,
So that the foundation is ready for Previa development.
```

**Key Tasks:**
- Remove PolicyAi UI components (src/pages/Notebook.tsx, policy-related components)
- Update routing to remove PolicyAi-specific routes
- Preserve authentication context (src/contexts/AuthContext.tsx)
- Preserve Supabase integration (src/integrations/supabase/)
- Update app branding (logo, colors, name)
- Verify Supabase connection still works

**Acceptance Criteria:**
- No PolicyAi references in UI components
- Authentication still functional
- Supabase connection verified
- Application runs without errors
- Previa branding visible

### Epic 1 Story 1.3 - Migration Deployment

**Story 1.3: Deploy Database Migrations** should include:

**Tasks:**
1. Verify Supabase CLI configured
2. Run migration 1: Financial schema
3. Run migration 2: RLS policies
4. Run migration 3: User tier trigger
5. Validate tables created
6. Validate RLS enabled
7. Test tier creation trigger
8. Update schema types for TypeScript

**Acceptance Criteria:**
- All 6 financial tables exist in database
- RLS enabled on all tables
- Tier creation trigger functional
- TypeScript types generated
- No migration errors

**Testing:**
- See architect review validation steps (in architect's message above)
- Use `supabase db push` to apply migrations
- Use SQL queries to verify table creation and RLS

---

## 🔍 Story Development References

### Architecture Documentation
- **Sharded Architecture:** `docs/architecture/` (11 files)
- **Data Models:** `docs/architecture/6-data-model-financial-domain.md`
- **Backend Architecture:** `docs/architecture/5-backend-architecture-rls-edge-functions-n8n.md`
- **Frontend Architecture:** `docs/architecture/4-frontend-architecture-auth-roles-chat-uploads.md`
- **Security (RLS):** `docs/architecture/7-security-rls-deterministic-rules.md`

### Frontend Specifications
- **Full Spec:** `docs/frontend-spec-new.md`
- **Design System:** Section 3 (Colors, Typography, Spacing)
- **Core Screens:** Section 4-11 (Onboarding, Dashboard, Documents)
- **shadcn/ui Components:** Section 12

### Technical Context
- **Environment Setup:** `docs/environment-variables.md`
- **n8n Workflows:** `docs/n8n-workflow-requirements.md`
- **Technical Decisions:** `docs/architecture/TECHNICAL-DECISIONS.md`
- **Application Constants:** `src/config/constants.ts`

### Testing Resources
- **Mock Data:** `src/test/fixtures/financial-data.ts`
- **Sample Files:** `public/test-fixtures/`
- **Vitest Config:** `vitest.config.ts`

---

## 🚦 Story Creation Workflow

### Step 1: Create Epic Files (Optional)
You may want to create epic overview files first:
- `docs/stories/epic-1-foundation.md`
- `docs/stories/epic-2-onboarding.md`
- etc.

**Or** jump directly to story creation.

### Step 2: Create Stories for Epic 1

**Recommended Order:**
1. Story 1.1 - Initialize Previa project (UI cleanup)
2. Story 1.2 - Audit dependencies
3. Story 1.3 - Deploy database migrations ← **CRITICAL**
4. Story 1.4 - Verify config constants ← **Already done by architect**
5. Story 1.5 - Setup testing infrastructure
6. Story 1.6 - Build design system

**Use Task:** `.bmad-core/tasks/create-next-story.md`

**Command:** 
```
*draft
```
(This will execute the create-next-story task)

### Step 3: Validate Stories

Use your story draft checklist:
```
*story-checklist
```

**Validation Points:**
- Acceptance criteria are testable
- Tasks are sequential and detailed
- Dev Notes include architecture references
- Testing steps are clear
- No template placeholders remain

### Step 4: PO Review (Optional)

Hand off stories to Sarah (PO) for validation:
```
*validate-story-draft {story}
```

### Step 5: Repeat for Remaining Epics

Create stories for Epics 2-6 following the same workflow.

---

## 🎯 Success Criteria

**Epic 1 Stories Ready When:**
- [ ] All 6 stories created in `docs/stories/`
- [ ] Each story has complete acceptance criteria
- [ ] Dev Notes include architecture references
- [ ] Tasks are detailed and sequential
- [ ] Testing steps are clear
- [ ] Story 1.3 includes migration deployment instructions
- [ ] No template placeholders remain

**Ready to Hand Off to Dev When:**
- [ ] Epic 1 stories validated
- [ ] Story 1.1 reviewed and approved
- [ ] Migration scripts validated by architect ✅ (Already done)
- [ ] All technical context accessible in docs

---

## ⚠️ Critical Notes

### Migration Deployment (Story 1.3)
**IMPORTANT:** Database migrations are production-ready but NOT YET DEPLOYED.

**Deployment Steps (for Story 1.3):**
```bash
# 1. Verify Supabase project configured
supabase status

# 2. Apply all migrations
supabase db push

# 3. Validate tables created
# See validation SQL queries in architect review above
```

**Validation Queries:** See "Validation Steps Post-Migration" in architect review message.

### Environment Variables
**Client-side (.env.local):**
- Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Server-side (Supabase Dashboard → Edge Functions → Secrets):**
- `GEMINI_API_KEY`, `OPENAI_API_KEY`, n8n webhook URLs, `WEBHOOK_SECRET_TOKEN`
- See `docs/environment-variables.md` for complete list

### Mock Data Available
Full financial test fixtures available in `src/test/fixtures/financial-data.ts`:
- Use for development without real data
- Use for unit/integration tests
- Use for demos

---

## 📊 Project Status Summary

**Phase:** Foundation Complete  
**Next Phase:** Epic & Story Creation → Development Kickoff  
**Blockers:** None  
**Ready for:** Story creation and developer handoff

**Team Alignment:**
- ✅ Product Owner (Sarah): Foundation validated, config fixed
- ✅ Architect (Winston): Migrations approved, technical architecture validated
- 🔄 Scrum Master (Bob): **Your turn - Create epics and stories**
- ⏸️ Developer (James): Awaiting Story 1.1 creation

---

## 🤝 Handoff Checklist

**Before You Start:**
- [x] Foundation complete (confirmed by PO and Architect)
- [x] Database migrations validated
- [x] Technical decisions documented
- [x] Testing infrastructure ready
- [ ] Review PRD Epic List (docs/prd/5-epic-list.md)
- [ ] Review Architecture (docs/architecture/)
- [ ] Review Frontend Spec (docs/frontend-spec-new.md)

**Your Deliverables:**
- [ ] 6 epics defined (or epic overview files created)
- [ ] Epic 1 stories (1.1 - 1.6) created in docs/stories/
- [ ] Stories validated with checklist
- [ ] Story 1.1 ready for developer handoff
- [ ] Migration deployment instructions clear in Story 1.3

---

## 📞 Contact Points

**Questions About:**
- **Technical Architecture:** Refer to `docs/architecture/`
- **Database Schema:** See `supabase/migrations/` and `docs/architecture/6-data-model-financial-domain.md`
- **Frontend Design:** See `docs/frontend-spec-new.md`
- **Environment Setup:** See `docs/environment-variables.md`
- **n8n Workflows:** See `docs/n8n-workflow-requirements.md`
- **Testing:** See `src/test/fixtures/financial-data.ts`

**Stuck?**
- Load relevant architecture docs
- Review technical decisions doc
- Check if similar story exists in template
- Ask for clarification (I can help as architect if needed)

---

## 🚀 Ready to Proceed?

**Your Mission:** Create Epic 1 stories (1.1 - 1.6) starting with Story 1.1: Initialize Previa Project.

**Commands to use:**
```
*help                    # Show available Scrum Master commands
*draft                   # Create next story (will be 1.1)
*story-checklist         # Validate story draft
*validate-story-draft    # PO validation (optional)
```

**Start with:** Story 1.1 - Initialize Previa Project

Good luck, Bob! The foundation is solid. Let's build Previa! 🏗️💰

---

**Handoff Complete**  
**From:** Winston (Architect)  
**Date:** 2025-01-09  
**Status:** ✅ Ready for Story Creation

