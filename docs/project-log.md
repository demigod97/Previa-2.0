# Previa Project Log

## 2025-01-08: Brownfield Pivot - Specifications Complete

### Sprint Change Proposal APPROVED

**Context:**  
Acquired existing PolicyAi application (policy document management) and pivoted to build Previa, an AI-driven financial intelligence platform for Australian households, freelancers, and small businesses.

**Change Type:** Brownfield-to-greenfield pivot - Reusing infrastructure patterns but building entirely new product.

**Specification Work Completed:**

1. **PRD Updated (v1.0 → v1.1)**
   - Expanded from 4 → 6 epics (split Epic 2 into Onboarding, Upload/OCR, Reconciliation)
   - Added FR8: Interactive onboarding workflow
   - Expanded Core Screens from 5 → 12 screens
   - Added Branding & Visual Identity section (Previa color palette, logo, design influences)
   - Added shadcn/ui MCP strategy
   - **File:** `docs/prd.md`

2. **Architecture Updated**
   - Complete data model rewrite: Replaced PolicyAi tables with financial schema
   - New tables: `user_tiers`, `bank_accounts`, `bank_statements`, `transactions`, `receipts`, `reconciliation_matches`
   - Updated RLS policies: Corporate roles → `user`/`premium_user` tiers
   - Added premium feature gates (account limits, transaction limits)
   - Updated secrets for financial workflows
   - **File:** `docs/architecture.md`

3. **Frontend Specification Created (v2.0)**
   - Complete rewrite with shadcn/ui + Previa design system
   - 12 screens documented across 4 flows (onboarding, dashboard, document management, library)
   - Multi-view dashboard: Home, Reconciliation Engine, Transaction Table, AI Chat
   - shadcn MCP component generation prompts
   - Previa color palette implementation
   - Reference patterns from Monarch Money, Expensify, PocketSmith
   - Mobile-first responsive design
   - WCAG AA accessibility specs
   - **File:** `docs/frontend-spec-new.md`

4. **Sprint Change Proposal**
   - Comprehensive documentation of brownfield pivot
   - Epic impact analysis (4 → 6 epics justified)
   - All artifact changes documented
   - Agent handoff plan defined
   - Timeline estimates: ~2 weeks pre-development, 12-16 weeks MVP development
   - **File:** `docs/sprint-change-proposal.md`

**Key Decisions:**

- **User Roles:** `user` | `premium_user` (freemium tier-based, aligned with business model)
- **Epic Structure:** 6 epics to properly scope UI complexity
  1. Foundation & Core Services
  2. User Onboarding & Bank Account Setup (NEW)
  3. Document Upload & OCR Processing (NEW)
  4. AI Reconciliation Engine & Matching UI (NEW)
  5. Multi-View Dashboard & Financial Insights
  6. Data Export & Integrations
- **UI-First Approach:** Complete Frontend Spec before epic/story creation
- **Design System:** Previa color palette + shadcn/ui components + MCP generation

**Reusable from PolicyAi:**
- ✅ Supabase Auth patterns
- ✅ Edge Function architecture
- ✅ n8n webhook integration
- ✅ File upload mechanics
- ✅ Storage patterns

**New for Previa:**
- Financial data models (bank accounts, statements, receipts, transactions, matches)
- User tier management (freemium)
- Onboarding workflow (7 screens)
- Reconciliation engine UI (matching interface)
- Multi-view dashboard (4 views)
- Previa branding (colors, logo, typography)
- OCR → extraction → matching pipeline

**Next Steps:**

1. **UX Expert (Sally):**
   - Review `docs/frontend-spec-new.md`
   - Validate Previa design system
   - Generate shadcn component examples using MCP
   - Approve Frontend Spec

2. **Architect (Winston):**
   - Review `docs/architecture.md`
   - Create database migration scripts for financial schema
   - Define Edge Function contracts (detailed)
   - Document n8n workflow specifications
   - Approve Architecture

3. **Scrum Master (Bob):**
   - Create 6 epics from PRD Epic List
   - Break down into user stories
   - Ensure stories reference correct specs
   - Prioritize and sequence

4. **Developer (James):**
   - Implement stories according to specifications
   - Follow Previa design system
   - Build reconciliation engine

**Timeline:**
- Specification work: ✅ COMPLETE (14-21 hours)
- Pre-development (UX/Architect review): ~2 weeks
- MVP Development: 12-16 weeks (6 epics)

**Status:** All planning-stage documentation complete. Ready for specialist review and epic/story creation.

---

## Future Entries

(Log major milestones, decisions, and changes here)

