# Previa - Next Steps Guide

**Date:** 2025-01-08  
**Status:** Planning Phase Complete ✅  
**Next Phase:** Specialist Review & Epic Creation

---

## What Just Happened

You completed a comprehensive **brownfield pivot** from PolicyAi (policy document management) to **Previa** (AI-driven financial intelligence platform).

**Specification work completed:**
- ✅ PRD updated (v1.0 → v1.1): 6 epics, Previa branding, FR8 onboarding
- ✅ Architecture updated: Financial schema, user/premium_user tiers, RLS policies
- ✅ Frontend Specification created (v2.0): Complete UI design with shadcn/ui + Previa colors
- ✅ Sprint Change Proposal documented and approved

---

## Current State

### Documents Ready for Use

| Document | Version | Purpose | Status |
|----------|---------|---------|--------|
| `docs/prd.md` | 1.1 | Product requirements, 6 epics | ✅ Ready |
| `docs/architecture.md` | Updated | Financial data models, RLS, Edge Functions | ✅ Ready |
| `docs/frontend-spec-new.md` | 2.0 | Complete UI/UX specification | ✅ Ready |
| `docs/sprint-change-proposal.md` | 1.0 | Change documentation | ✅ Complete |
| `docs/project-log.md` | Current | Project history | ✅ Active |

### What's Reusable from PolicyAi

- ✅ Supabase Auth patterns
- ✅ Edge Function architecture
- ✅ n8n webhook integration
- ✅ File upload mechanics
- ✅ React + Vite + Tailwind setup

### What's New for Previa

- Financial data models (bank accounts, statements, receipts, transactions, reconciliation)
- User tier management (`user` vs `premium_user`)
- Onboarding workflow (7 interactive screens)
- Reconciliation engine UI (transaction-receipt matching)
- Multi-view dashboard (Home, Reconciliation, Transactions, Chat)
- Previa brand (colors, logo, typography)
- shadcn/ui component system with MCP

---

## Your Next Actions

### Option 1: Continue with BMad Workflow (Recommended)

Follow the standard BMad agent workflow:

**Step 1: UX Expert Review**
```bash
# Activate UX Expert agent
@bmad/ux-expert.mdc

# Ask Sally to review the Frontend Specification
"Review docs/frontend-spec-new.md and validate the Previa design system"
```

**What Sally will do:**
- Review all screen specifications
- Validate shadcn/ui component choices
- Generate example components using shadcn MCP
- Confirm Previa color palette implementation
- Approve or suggest refinements

---

**Step 2: Architect Review**
```bash
# Activate Architect agent
@bmad/architect.mdc

# Ask Winston to review the Architecture
"Review docs/architecture.md and create database migrations for the financial schema"
```

**What Winston will do:**
- Review financial data models
- Create Supabase migration scripts
- Define Edge Function contracts in detail
- Document n8n workflow requirements
- Validate technical feasibility
- Approve or suggest refinements

---

**Step 3: Create Epics & Stories**
```bash
# Activate Scrum Master agent
@bmad/sm.mdc

# Ask Bob to create epics and stories
"Create 6 epics from docs/prd.md Epic List and break down Epic 1 into stories"
```

**What Bob will do:**
- Create 6 epic files from PRD Section 5
- Break down each epic into user stories
- Ensure stories reference Architecture and Frontend Spec
- Prioritize and sequence stories
- Apply story template correctly

---

**Step 4: Begin Development**
```bash
# Activate Developer agent
@bmad/dev.mdc

# Ask James to implement first story
"Implement story 1.1 following docs/architecture.md and docs/frontend-spec-new.md"
```

**What James will do:**
- Implement stories according to specifications
- Follow Previa design system
- Adhere to financial data models
- Create database migrations
- Build UI components with shadcn/ui

---

### Option 2: Manual Implementation (Not Recommended)

If you prefer to work outside the BMad workflow:

1. **Review Specifications Yourself**
   - Read `docs/prd.md` (6 epics)
   - Read `docs/architecture.md` (financial schema)
   - Read `docs/frontend-spec-new.md` (UI design)

2. **Create Database Schema**
   - Use SQL from Architecture Section 6
   - Create Supabase migrations
   - Set up RLS policies from Section 7

3. **Build UI Components**
   - Use shadcn MCP prompts from Frontend Spec Section 6
   - Apply Previa color palette (Section 1)
   - Build screens in order (Section 2)

4. **Implement Features**
   - Follow epic sequence from PRD Section 5
   - Reference Architecture and Frontend Spec as needed

---

## Key Reference Points

### Previa Brand Colors

```css
cream: #F2E9D8      /* Primary background */
stone: #8C877D      /* Secondary text */
sand: #D9C8B4       /* Accents */
charcoal: #403B31   /* Primary text */
darkStone: #595347  /* Icons */
```

### Epic Sequence

1. **Epic 1:** Foundation & Core Services (database, auth, branding, shadcn setup)
2. **Epic 2:** User Onboarding & Bank Account Setup (7-screen flow)
3. **Epic 3:** Document Upload & OCR Processing (drag/drop, extraction pipeline)
4. **Epic 4:** AI Reconciliation Engine & Matching UI (transaction-receipt matching)
5. **Epic 5:** Multi-View Dashboard & Financial Insights (4 views + gamification)
6. **Epic 6:** Data Export & Integrations (CSV/JSON export)

### Screen Count

- **Onboarding:** 7 screens
- **Dashboard:** 4 views (Home, Reconciliation, Transactions, Chat)
- **Document Management:** 2 screens (Upload Hub, Library)
- **Total:** 12 primary screens + auth + settings

### shadcn/ui Components Used

Button, Card, Input, Table, Dialog, Popover, Progress, Badge, Tabs, Sheet, ScrollArea, Calendar, HoverCard, Form, Textarea, Select, Checkbox, Separator, Skeleton, Toast

---

## Timeline Estimates

### Pre-Development (Recommended BMad Flow)
- UX Expert review: 4-6 hours (Week 1)
- Architect review: 4-6 hours (Week 1)
- Epic/Story creation: 8-12 hours (Week 2)
- **Total:** ~2 weeks

### MVP Development
- Epic 1: 2-3 weeks
- Epic 2: 2 weeks
- Epic 3: 2-3 weeks
- Epic 4: 3-4 weeks (most complex)
- Epic 5: 2-3 weeks
- Epic 6: 1 week
- **Total:** 12-16 weeks

---

## Success Criteria

### Documentation Phase (COMPLETE ✅)
- [x] PRD updated with 6 epics
- [x] Architecture updated with financial schema
- [x] Frontend Spec created with shadcn/ui
- [x] Sprint Change Proposal approved

### Specialist Review Phase (NEXT)
- [ ] UX Expert approves Frontend Spec
- [ ] Architect approves Architecture
- [ ] Migration scripts created
- [ ] shadcn components validated

### Story Creation Phase (UPCOMING)
- [ ] 6 epics created
- [ ] Stories prioritized and sequenced
- [ ] Each story references correct specs
- [ ] Development ready to begin

### MVP Delivery (FUTURE)
- [ ] All 6 epics completed
- [ ] 70% automation rate achieved
- [ ] User retention targets met
- [ ] Product-market fit validated

---

## Troubleshooting

### "I'm confused about what to do next"
→ **Follow Option 1 above** - Activate UX Expert (@bmad/ux-expert.mdc) and ask for Frontend Spec review

### "Should I start coding now?"
→ **Not yet** - Get UX/Architect review first to validate designs and catch issues early

### "Do I need to create stories manually?"
→ **No** - Use Scrum Master agent (@bmad/sm.mdc) to generate stories from the PRD

### "Can I skip the BMad workflow?"
→ **You can, but not recommended** - The workflow ensures quality and catches issues before development

### "What if I want to change something in the specs?"
→ **Activate PM agent** (@bmad/pm.mdc) and request *correct-course to make guided changes

---

## Quick Commands

```bash
# Review current project state
cat docs/project-log.md

# See all changes made
cat docs/sprint-change-proposal.md

# Check PRD epics
cat docs/prd.md | grep "Epic"

# View color palette
cat docs/frontend-spec-new.md | grep -A 10 "Color Palette"

# Activate UX Expert (next step)
@bmad/ux-expert.mdc
```

---

## Questions?

If you're unsure about anything:

1. **Read the Sprint Change Proposal:** `docs/sprint-change-proposal.md` (comprehensive overview)
2. **Check the Project Log:** `docs/project-log.md` (what happened and why)
3. **Review PRD Section 5:** `docs/prd.md` (epic sequence and goals)
4. **Ask PM Agent:** Activate `@bmad/pm.mdc` and ask questions

---

**You're ready to proceed!** 🎉

**Recommended next action:** Activate UX Expert to review Frontend Specification.

```bash
@bmad/ux-expert.mdc
```

Then ask: "Review docs/frontend-spec-new.md and validate the Previa design system for implementation."

