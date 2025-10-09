# 10) Implementation Notes (Next Steps)

- Introduce financial-domain tables and RLS policies via migrations (guarded and additive).
- Add safe views for effective role and per-user summaries used by UI.
- Ensure environment secrets are set in Supabase and not exposed to client.
- Keep chat/document routes behind Edge; never call n8n from client.
