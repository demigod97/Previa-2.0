# 9) Observability & Testing

- Logs: structured logs in Edge (inputs, downstream status codes, error bodies when safe).
- Metrics: processing success rate (target ≥70% automation), latency, error rate per EF/webhook.
- Tests:
  - Frontend Vitest/RTL for auth flows, role-gated UI, upload validation.
  - Edge Deno tests for schema validation and error paths (where feasible).
