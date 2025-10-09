# 5) Backend Architecture (RLS, Edge Functions, n8n)

- Data Access
  - Client reads/writes through RLS-protected tables.
  - Edge Functions use service role only to perform validated operations (role checks, status updates, webhook calls) and must never leak secrets.
- Edge Functions (contracts summary)
  - `send-chat-message`: POST { session_id, message } → resolve effective role via `user_roles` (board > executive > administrator) → call role-specific webhook with secret header → return response.
  - `process-document`: POST { sourceId, filePath, sourceType } → call DOCUMENT_PROCESSING_WEBHOOK_URL with callback_url → update `sources.processing_status` on failures.
  - `process-document-callback`: POST { source_id, content?, summary?, title?/display_name?, status?, error? } → update `sources` atomically.
  - `process-additional-sources`: batch website/text ingestion with sourceIds; posts to ADDITIONAL_SOURCES_WEBHOOK_URL.
  - `generate-notebook-content`: enrich notebook metadata (title/summary/icon/color/example_questions) after upload content processed.
  - `webhook-handler`: generic proxy for selected flows with server-side auth.
  - `assign-user-role`: super_admin-only to assign/revoke roles in `user_roles`.
- n8n Responsibilities
  - OCR/LLM extraction of documents; summarize, normalize, and post back via callback.
  - Chat orchestration per role; include citations where possible for transparency.
