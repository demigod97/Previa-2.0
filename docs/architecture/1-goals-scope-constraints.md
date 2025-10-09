# 1) Goals, Scope, Constraints

- Goals (from PRD/Project Brief)
  - Deliver manual-first financial ingestion and AI-assisted reconciliation MVP.
  - Clear, trustworthy UX where AI is a partner, not a black box.
  - Security-first with RLS and role-based access; responsive UI.
- In Scope (this document)
  - Auth via Supabase and session lifecycle in client.
  - Custom roles beyond default auth: administrator, executive, board; super_admin for admin ops.
  - Chat experience that routes messages to role-aware n8n workflows.
  - Document uploads (PDF/CSV/text/audio) → processing pipeline via Edge + n8n.
  - Edge Functions as controlled backend ingress to n8n; secrets managed server-side.
- Out of Scope (here)
  - Open Banking (CDR) integration; direct accounting integrations (post-MVP per PRD).
  - Non-critical screens not tied to auth/chat/uploads.
- Constraints
  - Serverless-first (Supabase + Edge Functions + n8n). React + Tailwind/shadcn for UI.
  - Least-privilege: client only uses anon key; Edge uses service role as needed.
  - All webhook URLs/tokens and LLM selections stored as environment secrets.
