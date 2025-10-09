# Technical Decisions Log - Previa Financial Platform

**Last Updated:** 2025-01-09  
**Purpose:** Document key technical decisions made during Previa development

---

## Decision Summary

This document captures the technical decisions made during the brownfield pivot from PolicyAi to Previa and the subsequent foundation setup for MVP development.

---

## 1. LLM Provider Selection

### Decision
- **Primary LLM:** Google Gemini API
- **Optional Fallback:** OpenAI GPT-4o

### Rationale

**Why Gemini as Primary:**
- **Large context window** (up to 2M tokens) ideal for processing entire bank statements
- **Vision API** integrated for OCR extraction from receipts and statements
- **Cost-effective** for document processing workloads
- **Strong performance** on financial data extraction tasks

**Why GPT-4o as Optional Fallback:**
- **Redundancy** if Gemini experiences rate limits or downtime
- **Well-known and robust** model with proven capabilities
- **Flexibility** to switch providers based on performance or cost
- **Optional** to keep costs manageable during MVP

### Implementation
- Set `GEMINI_API_KEY` as required Edge Function secret
- Set `OPENAI_API_KEY` as optional Edge Function secret
- Implement fallback logic in Edge Functions: Try Gemini first, GPT-4o if Gemini fails

### Configuration
- **Environment:** `docs/environment-variables.md`
- **Edge Functions:** `supabase/functions/` (to be created in Epic 1)

---

## 2. OCR Accuracy Thresholds

### Decision
- **Account Number Extraction:** 90% confidence required
- **Receipt Data (Amount/Date):** 90% confidence required
- **Auto-Approval Threshold:** 95% confidence for reconciliation matches

### Rationale

**Why 90% Threshold:**
- **Balance** between automation and accuracy
- **User validation** available for low-confidence extractions
- **Real-world testing** needed to refine threshold
- **Industry standard** for OCR confidence in financial applications

**Why 95% for Auto-Approval:**
- **Higher bar** for automatic reconciliation to prevent false positives
- **User trust** requires high confidence in automated matches
- **Manual review** available for matches between 70-95% confidence

### Edge Cases
- **Below 90%:** Flag for manual review or re-upload with better quality
- **Between 90-95%:** Extract data but require user confirmation before use
- **Above 95%:** Proceed with automated processing

### Implementation
- Defined as constants in application code (not environment variables)
- Example: `src/config/constants.ts`

```typescript
export const OCR_ACCOUNT_NUMBER_THRESHOLD = 0.90;
export const OCR_RECEIPT_DATA_THRESHOLD = 0.90;
export const RECONCILIATION_AUTO_APPROVE_THRESHOLD = 0.95;
```

---

## 3. Tier Limits (Freemium Model)

### Decision

**Free Tier (`user`):**
- 3 bank accounts maximum
- 50 transactions per month
- 10 receipts per month

**Premium Tier (`premium_user`):**
- Unlimited bank accounts
- Unlimited transactions
- Unlimited receipts

### Rationale

**Why These Limits:**
- **Generous enough** for basic users to experience value
- **Conservative enough** to encourage premium upgrades
- **Processing costs** are significant for OCR and LLM operations
- **Market research** from competitors (Expensify, Monarch) informed limits

**Free Tier Justification:**
- 3 accounts: Most households have 1-2 bank accounts + 1 credit card
- 50 transactions/month: Covers typical household spending (~12 transactions/week)
- 10 receipts/month: Encourages selective receipt tracking for deductible expenses

**Premium Tier Value:**
- Unlimited usage for power users and small businesses
- Target price: $10-15 AUD/month (competitive with Xero, Expensify)
- Additional features: Advanced analytics, priority support, direct integrations

### Implementation
- Stored in `user_tiers` table (see `supabase/migrations/20250109000001_create_financial_schema.sql`)
- Enforced by Edge Functions before processing
- Default tier created automatically on user signup via trigger

### Monitoring
- Track usage metrics to refine limits based on real-world data
- Alert users approaching limits with upgrade prompts
- Consider "soft limits" (warnings at 80%, hard stop at 100%)

---

## 4. Testing Strategy: Mock Data Approach

### Decision
Use comprehensive mock financial data fixtures for development and testing, rather than real anonymized data or synthetic data generation.

### Rationale

**Why Mock Data:**
- **Privacy**: No risk of exposing real financial information
- **Deterministic**: Same test data across all environments
- **Fast**: No database seeding or external API calls needed
- **Portable**: Works offline and in CI/CD pipelines
- **Comprehensive**: 10 transactions, 5 receipts, 4 matches covering all scenarios

**Included Fixtures:**
- 3 bank accounts (Commonwealth, ANZ, Westpac)
- 2 bank statements for January 2024
- 10 transactions (groceries, transport, dining, subscriptions, income)
- 5 receipts with OCR data and confidence scores
- 4 reconciliation matches at various confidence levels

### Implementation
- **Location:** `src/test/fixtures/financial-data.ts`
- **Sample Files:** `public/test-fixtures/` (placeholders for actual PDFs/images)
- **Helper Functions:** `getUnreconciledTransactions()`, `getTotalSpendingByCategory()`, etc.

### Usage
- **Unit Tests:** Mock database responses with fixtures
- **Integration Tests:** Seed test database with fixtures
- **Development:** Display fixtures in UI for demos and testing
- **E2E Tests:** Upload sample files and verify processing

### Future Enhancement
- Generate synthetic bank statements and receipts for more realistic testing
- Use AI to create diverse transaction scenarios
- Add edge cases (duplicates, missing data, corrupted files)

---

## 5. Database Architecture: PostgreSQL + RLS

### Decision
Use Supabase PostgreSQL with Row Level Security (RLS) for all financial tables.

### Rationale

**Why PostgreSQL:**
- **Proven reliability** for financial applications
- **ACID compliance** for transaction integrity
- **Rich data types** (JSONB for OCR data, DECIMAL for amounts)
- **Supabase integration** provides instant REST API + realtime subscriptions

**Why RLS:**
- **Security by default** - users can only access their own data
- **Defense in depth** - even if API is compromised, data is isolated
- **Compliance** - meets Australian data security standards
- **Performance** - policies evaluated at database level

### Schema Design
- **7 core tables:** user_tiers, bank_accounts, bank_statements, transactions, receipts, reconciliation_matches
- **Indexes:** Optimized for common queries (user_id + date, status filtering)
- **Triggers:** Auto-create user tier on signup, auto-update timestamps

### Migration Strategy
- **Migrations:** `supabase/migrations/` directory (numbered sequentially)
- **RLS Policies:** Separate migration for security clarity
- **Triggers:** Separate migration for maintainability

---

## 6. n8n Workflow Processing

### Decision
Use n8n Cloud (or self-hosted) for compute-intensive AI operations rather than Edge Functions.

### Rationale

**Why n8n:**
- **Separation of concerns** - Edge Functions handle API routing, n8n handles heavy lifting
- **Long-running operations** - n8n better suited for OCR/LLM processing (can take 30+ seconds)
- **Visual workflow builder** - easier to debug and modify AI pipelines
- **Cost optimization** - pay for processing time, not per-request function invocations
- **Scalability** - n8n can queue and batch process documents

**Required Workflows:**
1. **Document Processing** - OCR extraction from statements and receipts
2. **Reconciliation Matching** - AI-powered transaction-to-receipt matching
3. **Financial Chat** - Context-aware AI assistant with citations

### Integration Pattern
- **Edge Function → n8n:** POST to webhook with document metadata
- **n8n → Callback:** POST results back to Edge Function callback URL
- **Authentication:** Shared secret token to validate requests

### Documentation
- Full workflow specs in `docs/n8n-workflow-requirements.md`
- Webhook URLs configured in Supabase Edge Function secrets

---

## 7. Monorepo Structure

### Decision
Single repository containing frontend (React), backend (Edge Functions), and infrastructure (Supabase migrations).

### Rationale

**Why Monorepo:**
- **Code sharing** - types, utilities, and business logic shared between frontend and backend
- **Atomic changes** - update API and UI in single PR
- **Simplified CI/CD** - single build pipeline for entire platform
- **Developer experience** - easier to navigate and understand system

**Structure:**
```
previa/
├── src/                    # React frontend
├── supabase/
│   ├── functions/          # Edge Functions (Deno)
│   └── migrations/         # Database schema
├── n8n/                    # Workflow exports
├── docs/                   # All documentation
└── tests/                  # E2E and integration tests
```

### Trade-offs
- **Pros:** Simplicity, code sharing, atomic updates
- **Cons:** Larger repo size, potential for circular dependencies
- **Mitigation:** Clear module boundaries, linting rules to prevent cycles

---

## 8. Brownfield Pivot: PolicyAi → Previa

### Decision
Reuse existing Supabase infrastructure (auth, storage, database) but replace domain model and UI completely.

### Rationale

**What Changed:**
- **Domain:** Policies/notebooks → Bank accounts/transactions/receipts
- **Roles:** Admin/contributor/viewer → User/premium_user
- **UI:** PolicyAi branding → Previa branding (warm color palette, shadcn/ui)
- **Features:** Document chat → Financial reconciliation + chat

**What Stayed:**
- **Infrastructure:** Supabase project, n8n instance, Vercel deployment
- **Tech stack:** React, TypeScript, Tailwind, Vite
- **Patterns:** Edge Functions for API, RLS for security, n8n for AI

### Migration Path
- **Phase 1:** Create new financial schema alongside PolicyAi schema
- **Phase 2:** Update UI to use new schema (remove PolicyAi references)
- **Phase 3:** Deprecate PolicyAi tables once migration complete
- **Phase 4:** Remove PolicyAi migrations and UI components

### Documentation
- Change tracked in `docs/sprint-change-proposal.md`
- Project history in `docs/project-log.md`

---

## 9. UI Component Strategy: shadcn/ui + MCP

### Decision
Use shadcn/ui components with Model Context Protocol (MCP) for rapid, consistent UI generation.

### Rationale

**Why shadcn/ui:**
- **Copy-paste components** - full control over component code
- **Radix UI primitives** - accessible, unstyled components
- **Tailwind styling** - consistent with project design system
- **TypeScript native** - strong typing for props and state

**Why MCP:**
- **AI-assisted generation** - describe UI in natural language, get complete component
- **Design token consistency** - MCP ensures Previa color palette and spacing
- **Speed** - generate complex forms, tables, and modals in minutes
- **Quality** - follows shadcn/ui best practices automatically

**Previa Design System:**
- Colors: Cream (#F2E9D8), Stone Gray (#8C877D), Sand (#D9C8B4), Charcoal (#403B31)
- Typography: Inter (body), JetBrains Mono (financial numbers)
- Spacing: 8px base unit
- Rounded corners: 8px default
- Shadows: Subtle elevation (4, 8, 16, 24px)

### Implementation
- **Component library:** `src/components/ui/` (shadcn/ui components)
- **Custom components:** `src/components/` (Previa-specific features)
- **MCP usage:** Documented in `docs/frontend-spec-new.md`

---

## 10. Deployment Strategy

### Decision
- **Frontend:** Vercel (primary) or Netlify (alternative)
- **Backend:** Supabase hosted services (database, auth, Edge Functions)
- **Workflows:** n8n Cloud (self-hosted alternative documented)

### Rationale

**Why Vercel:**
- **Zero-config deployment** from GitHub
- **Edge network** for fast global performance
- **Preview deployments** for every PR
- **Seamless integration** with Vite/React

**Why Supabase Hosting:**
- **Managed database** with automatic backups
- **Global edge functions** with Deno runtime
- **Integrated auth** and storage
- **Pay-per-use pricing** ideal for MVP

**Why n8n Cloud:**
- **Managed infrastructure** - no server maintenance
- **99.9% uptime SLA** for production workflows
- **Secure** - runs in isolated environment
- **Alternative:** Self-hosted n8n on DigitalOcean/AWS if cost becomes issue

---

## Decision Review Schedule

**Review Frequency:** Quarterly or after major milestones

**Next Review:** After MVP launch (Epic 6 complete)

**Review Criteria:**
- Are OCR thresholds achieving target accuracy?
- Are tier limits driving premium conversions?
- Is Gemini performing as expected vs GPT-4o?
- Are n8n workflows meeting performance targets?
- Is mock data sufficient for testing needs?

---

## References

- Product Requirements: `docs/prd.md`
- Architecture: `docs/architecture.md`
- Environment Setup: `docs/environment-variables.md`
- n8n Workflows: `docs/n8n-workflow-requirements.md`
- Frontend Spec: `docs/frontend-spec-new.md`
- Sprint Change Proposal: `docs/sprint-change-proposal.md`

