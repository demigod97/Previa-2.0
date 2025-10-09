# Frontend Specification (PRD-Aligned)

Scope: Update existing Auth, Uploads, Chat, and Dashboard UIs to align with PRD and Architecture.

## 1) Global UX Principles

- Mobile-responsive, WCAG AA baseline, clear status feedback, and undo-friendly edits.
- AI-as-partner: show what AI did; allow corrections; surface confidence/citations when available.
- Role-aware UI (administrator, executive, board) with server-enforced authorization.

## 2) Authentication

- Flows
  - Sign-in/sign-up with Supabase; persist session via `AuthContext`.
  - Sign-out clears local state immediately; handle `session_not_found` gracefully.
  - Protected routes: redirect to Auth; show loading skeletons for session checks.
- UI Changes
  - AuthForm: concise error messages; password-less options optional (config-driven).
  - Global user menu: shows email, role badge (derived from server, read-only), logout.
- Edge Cases
  - Expired tokens → auto-refresh; if fails, force re-auth.
  - Network failures → non-blocking toasts; retry affordances.

## 3) Uploads (Documents)

- Flows
  - Drag/drop or picker; validate type/size (PDF, CSV, txt/md, audio; ≤ 50MB).
  - Create source row → upload to Storage → invoke `process-document` → display status transitions:
    - uploading → processing → completed | failed
  - Additional sources:
    - Multiple websites (URLs list) → `process-additional-sources`
    - Copied text → `process-additional-sources`
- UI Changes
  - AddSourcesDialog: unify validation and show per-file errors inline.
  - Progress feedback per file; global banner for batch operations.
  - Retry failed processing with a single action; disable while busy.
- Edge Cases
  - Duplicate files: warn and allow continue or skip.
  - Missing env/config: show actionable error and log ID.

## 4) Chat (Role-Aware)

- Flows
  - Send message → `send-chat-message` (Bearer token) → role-based webhook → response.
  - Show response with optional citations; handle streaming (future) or chunked responses.
- UI Changes
  - Composer: send on Ctrl/Enter; disabled state while sending.
  - Messages list: timestamps, role badges, citation toggle.
  - Error states: 401 (re-auth), 429/5xx (retry with backoff and toast).
- Edge Cases
  - No role found: default to administrator UI but display limited actions.
  - Long messages: limit characters with counter; truncate preview.

## 5) Dashboard (Review/Approve)

- Flows
  - List processed sources with status and last updated time.
  - Detail view shows extracted content/summary; allow edits and save.
  - Approve/reject actions record reviewer and timestamp (future API hooks).
- UI Changes
  - Cards or table with filters (status: processing/completed/failed).
  - Inline edit for title/summary with optimistic UI and rollback on error.
- Edge Cases
  - Partial data from callback: render what exists, disable missing actions.

## 6) Role Awareness (Read-Only in UI)

- Effective role precedence: board > executive > administrator.
- UI reads role from a safe server endpoint/view; do not trust client claims.
- Hide controls when unauthorized; server still enforces via RLS/Edge.

## 7) Accessibility & Error Handling

- Keyboard navigation for dialogs and lists; focus traps and labelled controls.
- Toasts have ARIA live regions; forms have inline error descriptions.
- File input is accessible (descriptive labels, helper text).

## 8) Testing

- Unit/Component (Vitest/RTL): AuthContext transitions, ProtectedRoute, Upload validation, Chat send states, Dashboard edits.
- Integration: FE → Edge invocation stubs; success and failure paths.
- Visual/UX: key screens snapshot tests; dark/light modes if applicable.

## 9) Implementation Notes

- Config-driven toggles for optional auth methods.
- Centralized error helpers; consistent toasts/dialogs.
- Types for Edge contracts in a shared `types` module to avoid drift.
