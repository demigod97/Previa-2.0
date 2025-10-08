# Sprint Change Proposal: Brownfield Pivot to Previa Financial Platform

**Date:** 2025-01-08  
**Prepared by:** John (Product Manager)  
**Status:** APPROVED  
**Version:** 1.0

---

## Executive Summary

**Change Trigger:**  
Acquired existing PolicyAi application (policy document management system) and pivoting to build Previa, an AI-driven financial intelligence platform for Australian households, freelancers, and small businesses.

**Change Type:**  
Brownfield-to-greenfield pivot - Reusing infrastructure patterns (Supabase Auth, Edge Functions, n8n webhooks, file uploads) but building entirely new product with different domain model, user roles, and UI/UX.

**Impact Level:** 🔴 **HIGH** - Requires comprehensive specification updates before epic/story creation

**Approval Status:** ✅ **APPROVED**

---

## 1. Issue Identification

### Triggering Situation
- **Context:** Planning-stage foundational work for financial platform
- **Asset:** Existing PolicyAi codebase with working auth, uploads, chat, roles
- **Challenge:** Need to adapt for completely different domain (policies → financial reconciliation)

### Core Problems Identified

**Problem A: Domain Model Mismatch**
- **Current:** `policies`, `policy_revisions`, `sources`, `notebooks` (document management)
- **Needed:** `bank_accounts`, `bank_statements`, `receipts`, `transactions`, `reconciliation_matches` (financial data)
- **Resolution:** Complete data model rewrite in Architecture document

**Problem B: Role Semantics Mismatch**
- **Current:** `administrator`, `executive`, `board` (corporate hierarchy)
- **Needed:** `user`, `premium_user` (freemium tier-based)
- **Resolution:** Updated role structure aligned with business model

**Problem C: UI/UX Complete Redesign Needed**
- **Current:** Generic policy dashboard with chat/notebooks
- **Needed:** 
  - Interactive onboarding for bank account setup
  - OCR extraction UI with confidence indicators
  - Transaction-receipt matching interface (reconciliation engine)
  - Multi-view dashboard (home/reconciliation/transactions/chat)
  - Previa brand identity (colors, logo)
  - shadcn/ui component system with MCP
- **Resolution:** Complete Frontend Specification rewrite

**Problem D: Workflow Logic Differences**
- **Current:** RAG pipeline for policy Q&A
- **Needed:** OCR → extraction → transaction matching → reconciliation approval
- **Resolution:** Can reuse n8n/Edge Function patterns but with different business logic

---

## 2. Epic Impact Assessment

### Original Epic Structure (PRD v1.0)

| Epic | Original Goal | Status |
|------|---------------|--------|
| Epic 1 | Foundation & Core Services | ⚠️ Needs modification |
| Epic 2 | Manual Data Ingestion & Reconciliation | 🔴 Too broad, needs splitting |
| Epic 3 | User Dashboard & Financial Insights | 🔴 Missing multi-view details |
| Epic 4 | Data Export & Integrations | ✅ Can proceed as-is |

### Updated Epic Structure (PRD v1.1)

| Epic | Updated Goal | Changes |
|------|--------------|---------|
| **Epic 1** | Foundation & Core Services | **Modified:** Add financial schema, user/premium_user roles, Previa branding, shadcn/ui setup |
| **Epic 2** | User Onboarding & Bank Account Setup | **NEW:** Split from Epic 2 - Interactive 5-7 step onboarding flow |
| **Epic 3** | Document Upload & OCR Processing | **NEW:** Split from Epic 2 - Upload hub, OCR pipeline, status tracking |
| **Epic 4** | AI Reconciliation Engine & Matching UI | **NEW:** Split from Epic 2 - Core matching interface inspired by Monarch/Expensify |
| **Epic 5** | Multi-View Dashboard & Financial Insights | **Modified:** Expand to 4 dashboard views + gamification |
| **Epic 6** | Data Export & Integrations | **Keep:** No changes needed |

**Rationale for 4 → 6 Epics:**  
Original Epic 2 contained 3 major UI-intensive features that each deserve dedicated focus:
1. Onboarding (first impression, bank setup)
2. Upload/OCR (document processing pipeline)
3. Reconciliation (core differentiator, complex UX)

Splitting ensures proper story scoping and reduces epic bloat.

---

## 3. Artifact Impact Analysis

### 3.1 PRD (docs/prd.md)

**Impact Level:** 🟡 **MEDIUM** - Incremental updates needed

**Changes Applied:**

| Edit # | Section | Change Type | Description |
|--------|---------|-------------|-------------|
| 1 | Section 2 (Requirements) | Addition | Added **FR8:** Interactive onboarding workflow for bank account setup |
| 2 | Section 3 (UI Design Goals) | Expansion | Expanded Core Screens from 5 → 12 screens, organized into 4 flows |
| 3 | Section 3 | Addition | Added **Branding & Visual Identity** section with Previa color palette, logo, design influences (Monarch/Expensify/PocketSmith) |
| 4 | Section 4 (Technical Assumptions) | Addition | Added **UI Component Strategy:** shadcn/ui with MCP |
| 5 | Section 5 (Epic List) | Restructure | Updated from 4 → 6 epics with detailed UI-focused goals |
| 6 | Change Log | Update | Added v1.1 entry documenting brownfield pivot changes |

**Status:** ✅ **COMPLETE** (All edits applied)

---

### 3.2 Architecture (docs/architecture.md)

**Impact Level:** 🔴 **HIGH** - Major data model rewrite

**Changes Applied:**

| Edit # | Section | Change Type | Description |
|--------|---------|-------------|-------------|
| 1 | Section 6 (Data Models) | Complete Rewrite | Replaced PolicyAi tables with financial schema: `user_tiers`, `bank_accounts`, `bank_statements`, `transactions`, `receipts`, `reconciliation_matches` |
| 2 | Section 6 | Addition | Added performance indexes for financial queries |
| 3 | Section 7 (Security & RLS) | Major Update | Replaced corporate role policies with user/premium_user tier-based RLS policies |
| 4 | Section 7 | Update | Updated secrets list for financial workflows (RECONCILIATION_WEBHOOK_URL, etc.) |
| 5 | Section 7 | Addition | Added premium feature gates (account limits, transaction limits) |

**Status:** ✅ **COMPLETE** (All edits applied)

**Note:** Old PolicyAi tables (`sources`, `notebooks`, `user_roles` with corporate roles) are explicitly NOT reused.

---

### 3.3 Frontend Specification (docs/frontend-spec-new.md)

**Impact Level:** 🔴 **CRITICAL** - Complete rewrite

**Changes Applied:**

| Section | Content | Status |
|---------|---------|--------|
| 1. Design System | Previa color palette, typography, shadcn/ui setup | ✅ Complete |
| 2. Screen Specs | All 12 screens documented (onboarding, dashboard views, upload, library) | ✅ Complete |
| 2.1 Onboarding | 7-screen flow with detailed component specs | ✅ Complete |
| 2.2 Dashboard Layout | Sidebar nav, multi-view structure, responsive design | ✅ Complete |
| 2.3 Home View | 4 dashboard widgets with chart specs | ✅ Complete |
| 2.4 Reconciliation Engine | Split-panel matching interface with confidence indicators | ✅ Complete |
| 2.5 Transaction Table | Filterable Data Table with batch actions | ✅ Complete |
| 2.6 Chat Assistant | AI chat interface with citations and starter prompts | ✅ Complete |
| 2.7 Upload Hub | Drag/drop with status tracking | ✅ Complete |
| 2.8 Document Library | Grid/list views with filters | ✅ Complete |
| 3. Component Inventory | Full shadcn/ui component mapping with Previa customizations | ✅ Complete |
| 4. Responsive Design | Mobile/tablet/desktop breakpoint strategies | ✅ Complete |
| 5. Accessibility | WCAG AA compliance specs | ✅ Complete |
| 6. shadcn MCP Examples | 4 detailed component generation prompts | ✅ Complete |
| 7. Animations | Micro-interactions and transitions | ✅ Complete |
| 8. Reference Patterns | Monarch/Expensify/PocketSmith UI patterns to adopt | ✅ Complete |

**Status:** ✅ **COMPLETE** (New document created: `docs/frontend-spec-new.md`)

**Note:** Old `docs/frontend-spec.md` remains for reference but is superseded by `frontend-spec-new.md`.

---

## 4. Recommended Path Forward

### Selected Approach: Option 1 - Direct Adjustment / Integration

**Rationale:**
- ✅ We're in planning stage - no code to throw away
- ✅ PRD foundation is solid - just needs enhancement
- ✅ Architecture needs targeted updates, not complete rewrite
- ✅ Frontend Spec needs complete rebuild (expected for domain pivot)
- ✅ All work is directly actionable and feeds into story creation

### Three-Phase Sequential Approach

**Phase 1: Update PRD** (PM Agent - John)
- ✅ Expand to 6 epics with clear UI-focused goals
- ✅ Add branding section (Previa colors, logo)
- ✅ Enhance UI Design Goals with competitor references
- ✅ Add FR8 for onboarding workflow
- **Status:** COMPLETE

**Phase 2: Update Architecture** (Architect Agent - Winston)
- ✅ Rewrite Section 6 (Data Models) with financial schema
- ✅ Update Section 7 (RLS) for user/premium_user roles
- ✅ Refine Section 5 (Edge Functions) for reconciliation endpoints
- ✅ Update n8n workflow descriptions for OCR → extraction → matching
- **Status:** COMPLETE

**Phase 3: Create New Frontend Spec** (UX Expert Agent - Sally)
- ✅ Complete rewrite using shadcn MCP approach
- ✅ Design onboarding flow (7 steps)
- ✅ Specify 4 dashboard views (home/reconciliation/tables/chat)
- ✅ Detail all components with Previa color palette
- ✅ Reference Monarch/Expensify/PocketSmith patterns
- ✅ Mobile-first responsive design
- **Status:** COMPLETE

---

## 5. MVP Scope Impact Assessment

### Original MVP Scope (from Project Brief)
- User onboarding ✅ Still in scope, now detailed
- Manual upload (statements/receipts) ✅ Still in scope
- AI reconciliation ✅ Still in scope, UI designed
- Financial dashboard ✅ Still in scope, multi-view
- Gamification ✅ Still in scope, refined
- Data export ✅ Still in scope

### MVP Goals Still Valid?
✅ **YES** - All original goals remain:
- 70% automation target
- User retention goals
- Time-saving value prop (5+ hours/week)
- Product-market fit validation
- Freemium business model

### Re-scoping Needed?
❌ **NO** - Scope is unchanged; we've added specification detail, not features

### Risk Assessment
- 🟢 **Low risk of scope creep** - We're adding specification detail, not features
- 🟡 **Medium risk of timeline extension** - UI-first approach adds ~2 weeks upfront work but reduces dev rework
- 🟢 **Low risk of MVP viability** - All core features remain achievable

---

## 6. High-Level Action Plan

### Immediate Next Steps (Post-Approval)

**Step 1: Document Finalization** ✅ COMPLETE
- [x] PRD v1.1 updated and saved
- [x] Architecture updated and saved
- [x] Frontend Spec v2.0 created and saved
- [x] Sprint Change Proposal documented

**Step 2: Handoff to UX Expert (Sally)** - NEXT
- [ ] UX Expert reviews `frontend-spec-new.md`
- [ ] Creates detailed mockups/wireframes (optional)
- [ ] Generates shadcn components using MCP prompts
- [ ] Validates Previa design system implementation

**Step 3: Handoff to Architect (Winston)** - NEXT
- [ ] Architect reviews updated `architecture.md`
- [ ] Creates database migration scripts for financial schema
- [ ] Updates Edge Function contracts for reconciliation
- [ ] Documents n8n workflow requirements

**Step 4: Epic & Story Creation (Scrum Master - Bob)** - UPCOMING
- [ ] Use updated PRD, Architecture, and Frontend Spec
- [ ] Create 6 epics with detailed goals
- [ ] Break down into implementable stories
- [ ] Ensure each story references correct design/architecture specs

**Step 5: Development Kickoff (Dev Agent - James)** - FUTURE
- [ ] Stories ready for implementation
- [ ] Architecture and design approved
- [ ] Development can begin with clear specifications

---

## 7. Timeline & Effort Estimates

### Specification Work (COMPLETE)

| Phase | Agent | Effort | Status |
|-------|-------|--------|--------|
| Phase 1: PRD Updates | PM (John) | 2-3 hours | ✅ Complete |
| Phase 2: Architecture Updates | PM (John) | 4-6 hours | ✅ Complete |
| Phase 3: Frontend Spec | PM (John) | 8-12 hours | ✅ Complete |
| **Total Specification** | | **14-21 hours** | ✅ **Complete** |

### Upcoming Work

| Phase | Agent | Effort (Est.) | Timeline |
|-------|-------|---------------|----------|
| Design Review | UX Expert (Sally) | 4-6 hours | Week 1 |
| Architecture Review | Architect (Winston) | 4-6 hours | Week 1 |
| Epic/Story Creation | Scrum Master (Bob) | 8-12 hours | Week 2 |
| **Total Pre-Development** | | **~30-40 hours** | **2 weeks** |

### Development Timeline (Estimated)

| Epic | Estimated Duration | Dependencies |
|------|-------------------|--------------|
| Epic 1: Foundation | 2-3 weeks | None |
| Epic 2: Onboarding | 2 weeks | Epic 1 complete |
| Epic 3: Upload/OCR | 2-3 weeks | Epic 1 complete |
| Epic 4: Reconciliation | 3-4 weeks | Epics 1, 3 complete |
| Epic 5: Dashboard | 2-3 weeks | Epics 1, 3 complete |
| Epic 6: Export | 1 week | Epics 1-5 complete |
| **Total MVP Development** | **12-16 weeks** | Sequential with some parallel work |

---

## 8. Agent Handoff Plan

### Document Ownership

| Document | Owner | Editors | Current Status |
|----------|-------|---------|----------------|
| `docs/prd.md` | PM (John) | PO (Sarah) | ✅ v1.1 Ready |
| `docs/architecture.md` | Architect (Winston) | Dev (James) | ✅ Updated, needs Architect review |
| `docs/frontend-spec-new.md` | UX Expert (Sally) | Dev (James) | ✅ v2.0 Ready |
| `docs/sprint-change-proposal.md` | PM (John) | All | ✅ Complete |

### Handoff Sequence

**Current Status:** Specifications complete, ready for specialist review

**Next Actions:**

1. **UX Expert (Sally)** 
   - **Input:** `docs/frontend-spec-new.md`
   - **Tasks:**
     - Review and validate all screen specifications
     - Generate shadcn component examples using MCP
     - Create any additional design artifacts (mockups, prototypes)
     - Confirm Previa design system is implementable
   - **Output:** Approved Frontend Spec, component library foundation

2. **Architect (Winston)**
   - **Input:** `docs/architecture.md`, `docs/prd.md`
   - **Tasks:**
     - Review financial data model
     - Create database migration scripts
     - Define Edge Function contracts (detailed)
     - Document n8n workflow specifications
     - Validate technical feasibility
   - **Output:** Approved Architecture, migration scripts, API contracts

3. **Scrum Master (Bob)**
   - **Input:** All approved specs (PRD, Architecture, Frontend Spec)
   - **Tasks:**
     - Create 6 epics from PRD Epic List
     - Break down into user stories (following story template)
     - Ensure stories reference correct design/architecture sections
     - Prioritize and sequence stories
   - **Output:** Ready backlog with implementable stories

4. **Developer (James)**
   - **Input:** Approved stories, Architecture, Frontend Spec
   - **Tasks:**
     - Implement stories according to specifications
     - Follow Previa design system
     - Adhere to financial data model
     - Build reconciliation engine
   - **Output:** Working MVP

---

## 9. Success Criteria

### Documentation Complete
- [x] PRD updated with 6 epics, branding, FR8
- [x] Architecture updated with financial schema, user/premium_user roles
- [x] Frontend Spec created with shadcn/ui + Previa design system
- [x] All changes documented in Sprint Change Proposal

### Design Validation
- [ ] UX Expert approves Frontend Spec
- [ ] Previa design system confirmed implementable
- [ ] shadcn MCP component generation tested

### Technical Validation
- [ ] Architect approves data model
- [ ] Migration scripts created and tested
- [ ] Edge Function contracts defined
- [ ] n8n workflows documented

### Story Readiness
- [ ] 6 epics created with clear goals
- [ ] Stories broken down and prioritized
- [ ] Each story references correct specs
- [ ] Development can begin

### MVP Delivery
- [ ] All 6 epics completed
- [ ] 70% automation rate achieved
- [ ] User retention targets met
- [ ] Product-market fit validated

---

## 10. Risks & Mitigations

### Risk 1: UI Complexity Underestimated
**Probability:** Medium  
**Impact:** High (timeline slip)  
**Mitigation:** 
- UI-first approach with detailed Frontend Spec
- shadcn MCP for rapid component generation
- Reference existing patterns (Monarch/Expensify)
- Budget extra time for reconciliation engine UI

### Risk 2: Data Model Changes During Development
**Probability:** Low-Medium  
**Impact:** Medium (rework required)  
**Mitigation:**
- Comprehensive upfront schema design
- Migration-based approach (additive changes only)
- RLS policies designed for future expansion
- Architect review before development starts

### Risk 3: n8n Workflow Complexity
**Probability:** Medium  
**Impact:** Medium (automation accuracy)  
**Mitigation:**
- Reuse existing n8n/Edge Function patterns
- Start with simple OCR/extraction workflow
- Iterate on reconciliation matching algorithm
- Plan for confidence scoring and manual overrides

### Risk 4: Scope Creep
**Probability:** Medium  
**Impact:** High (MVP delay)  
**Mitigation:**
- Strict adherence to 6 epics
- "Nice-to-have" features documented for post-MVP
- Regular scope reviews with PM
- Feature flags for optional enhancements

---

## 11. Final Review & Approval

### Checklist

- [x] All proposed changes documented
- [x] Epic impact assessed (4 → 6 epics justified)
- [x] Artifact updates specified and applied
- [x] Path forward selected (Option 1: Direct Adjustment)
- [x] Timeline and effort estimated
- [x] Agent handoff plan defined
- [x] Risks identified with mitigations
- [x] Success criteria established

### Approval

**User Approval:** ✅ **APPROVED** (2025-01-08)

**Status:** All specification work **COMPLETE**. Ready for handoff to UX Expert and Architect for review and implementation planning.

---

## 12. Appendix: Change Summary

### What Changed
- Acquired existing PolicyAi codebase
- Pivoting to Previa financial platform
- Reusing infrastructure, rebuilding domain and UI

### Why It Changed
- Different product domain (policies → financial reconciliation)
- Different user base (organizations → Australian households/freelancers)
- Different business model (unknown → freemium)
- Different UX requirements (document Q&A → interactive reconciliation)

### What We're Doing
- Updated PRD: 6 epics, Previa branding, FR8 onboarding
- Updated Architecture: Financial schema, user/premium_user roles
- Created Frontend Spec: Complete UI design with shadcn/ui + Previa design

### Who Needs to Do What
- **UX Expert:** Review and validate Frontend Spec, generate components
- **Architect:** Review Architecture, create migrations, define API contracts
- **Scrum Master:** Create epics and stories from specifications
- **Developer:** Implement stories following specifications

### When We'll Know It Worked
- Specifications approved by specialists
- Stories ready for development
- MVP delivered with 70% automation
- User retention targets met
- Product-market fit validated

---

**End of Sprint Change Proposal**

