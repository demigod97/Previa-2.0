# 8) Edge Cases & Mitigations

- Auth/session expiration → client clears local state; gentle re-login prompt.
- Multiple roles → precedence (board > executive > administrator) applied server-side.
- Uploads: oversize/unsupported files; duplicates; partial failures → user-visible statuses + retry.
- Webhooks: missing env or 4xx/5xx → log + backoff; mark failed; user can reprocess.
- OCR ambiguity / low confidence → surface confidence + enable manual correction.
- PII handling: never log raw document content in server logs; scrub sensitive fields.
