# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Previa repository.

## Project Overview (Previa)

**Previa** is an AI-driven financial intelligence and pre‑accounting platform for Australian households, freelancers, and small businesses. It delivers manual data ingestion (PDF/CSV statements and receipts), AI extraction, reconciliation, a multi‑view dashboard, and gamified financial literacy.

Authoritative sources for this doc:

- `docs/Previa-Project Brief.md`
- `docs/prd/` (sharded PRD)
- `docs/architecture/` (sharded architecture)
- `docs/frontend-spec-new.md`
- `docs/gamification/` (badges, tips, implementation)
- `docs/epics/`, `docs/stories/`, `docs/qa/`, `docs/specifications/`

## Common Development Commands

- `npm run dev` → Vite dev server
- `npm run build` → Production build
- `npm run build:dev` → Dev build
- `npm run lint` → ESLint
- `npm run preview` → Preview production build
- BMAD utilities: `npm run bmad:refresh`, `npm run bmad:list`, `npm run bmad:validate`

## Technical Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI
- State/Data: TanStack Query (React Query), React Hook Form, Zod
- Charts: Recharts
- Backend: Supabase (Auth, Postgres with RLS, Storage, Edge Functions)
- Workflows/AI: n8n for OCR/LLM processing; Gemini primary, GPT‑4o optional

See `docs/architecture/tech-stack.md` for pinned versions and rationale.

## High-Level Architecture

- Client never calls n8n directly; all calls go through Supabase Edge Functions
- Postgres RLS protects all per‑user data; Edge uses service role only for validated ops
- Key Edge Functions (Deno): `send-chat-message`, `process-document`, `process-document-callback`, `process-additional-sources`, `assign-user-role`

Mermaid diagram and details: `docs/architecture/3-high-level-architecture.md`.

## Financial Domain Data Model (MVP)

Tables: `user_tiers`, `bank_accounts`, `bank_statements`, `transactions`, `receipts`, `reconciliation_matches` with indexes and RLS policies.
References:

- Schema: `docs/architecture/6-data-model-financial-domain.md`
- Security/RLS: `docs/architecture/7-security-rls-deterministic-rules.md`

## Frontend Specification & Screens

Comprehensive UI/UX spec with Previa design tokens, components, and 12 primary screens:

- Onboarding (Welcome → Auth → Upload → Extraction → Confirm → Preview → Complete)
- Dashboard (Home widgets, Reconciliation Engine, Transaction Table, AI Chat)
- Upload Hub & Document Library

Reference: `docs/frontend-spec-new.md`

Component/library usage (shadcn/ui) and patterns are defined in:

- `docs/architecture/source-tree.md`
- `docs/architecture/coding-standards.md`

## Gamification (Australian Financial Literacy)

Australian‑specific badges, tips, modules, insights, and challenges with ATO/ASIC alignment.

- Overview and plans: `docs/gamification/implementation-plan.md`, `docs/gamification/SUMMARY.md`
- Badge definitions: `docs/gamification/badges.yaml`
- Tips: `docs/gamification/tips.yaml`
- Migration status/verification: `docs/gamification/MIGRATION_VERIFICATION.md`

## Stories, Epics, QA

- Epics: `docs/epics/`
- Stories (implementation units): `docs/stories/` (e.g., `2.1-welcome-authentication-screens.md`)
- QA: `docs/qa/assessments/`, `docs/qa/gates/` (test design, traceability, risk, NFR)

BMAD agents/process are used; see `AGENTS.md` and `docs/SCRUM-MASTER-HANDOFF.md`.

## Key Development Patterns

### RLS‑Aware Data Access

```typescript
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', user.id)        // Enforced by RLS
  .order('transaction_date', { ascending: false });
```

### Upload → Process → Callback Flow

- Create DB row → upload to Supabase Storage
- Invoke `process-document` Edge Function → n8n webhook
- n8n posts results to `process-document-callback` → DB status/content update

### Error/Retry UX

- Backoff and retry on 429/5xx for chat and processing
- Toast notifications for user feedback; accessible error states (ARIA/live regions)

## Environment & Secrets

- Never commit secrets. Use `.env.local` for local dev and Supabase Edge Function secrets for server‑side.
- Reference (do not copy values): `docs/supabase-cloud-credentails.md`
- Required variables and setup: `docs/environment-variables.md`, `docs/env-example-template.md`

## Testing & QA Expectations

- Unit tests: financial logic, role‑gated UI, upload validation (Vitest/RTL)
- Integration: Edge schema validation and error paths where feasible
- E2E (as available): critical user journeys
- QA artifacts live under `docs/qa/assessments/` and gates in `docs/qa/gates/`
See: `docs/architecture/9-observability-testing.md`

## File/Directory Quick Map

- UI components: `src/components/` (financial, onboarding, upload, dashboard, chat, ui)
- Hooks: `src/hooks/`
- Pages: `src/pages/`
- Supabase integration: `src/integrations/supabase/`
- Services/Lib/Types: `src/services/`, `src/lib/`, `src/types/`
- Edge Functions: `supabase/functions/`
- DB migrations: `supabase/migrations/`

## Do/Don’t (for AI agent changes)

- Do follow `docs/architecture/coding-standards.md` and `docs/architecture/source-tree.md`
- Do keep financial amounts in cents and use precise arithmetic utilities (`src/lib/currency.ts`)
- Do respect RLS and never bypass server‑side constraints
- Don’t invent new libraries/patterns—align with PRD/Architecture
- Don’t expose secrets or raw financial data in logs

---

For deeper context, start at:

- PRD index: `docs/prd/index.md`
- Architecture index: `docs/architecture/index.md`
- Frontend spec: `docs/frontend-spec-new.md`
