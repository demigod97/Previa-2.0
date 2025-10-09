# 4) Frontend Architecture (Auth, Roles, Chat, Uploads)

- Auth & Session
  - Supabase client created with anon key; `AuthContext` maintains `user` + `session` and handles refresh/clear on errors (e.g., session_not_found).
  - `ProtectedRoute` gates sensitive pages; show loading and explicit sign-in prompts.
- Role Awareness
  - UI reads effective role from a server-derived source (do not trust client role claims).
  - Role-gated controls (e.g., admin actions) hidden and also enforced server-side (Edge + RLS).
- Chat UI
  - Stateless chat composer + messages list, with message send to `send-chat-message` Edge Function.
  - Show request/response states and surface citations/references when available from n8n.
  - Resilience: on 429/5xx, backoff and display retry affordance.
- Uploads
  - Drag/drop + picker with validation (type/size). Supported: PDF, CSV, text/markdown, audio.
  - Flow: create source row → upload to Storage → `process-document` → status transitions (uploading → processing → completed/failed).
  - Additional inputs (multiple websites, copied text) use `process-additional-sources` with source IDs.
