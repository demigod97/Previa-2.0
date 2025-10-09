# 2) PRD Alignment (Functional + UX)

- Functional requirements covered here
  - FR1/FR2: Upload bank statements (PDF/CSV) and receipts/bills → Upload UI + Storage → Edge → n8n.
  - FR3/FR4: OCR/AI extraction + transaction matching → n8n pipelines, callback updates content/summary/status.
  - FR5: Review/approve flows in dashboard; chat can surface guidance/citations.
  - FR6: Gamification out-of-scope for this doc; architecture keeps it pluggable.
  - FR7: Export out-of-scope for this doc; data models prepared for future export.
- UX requirements (from Project Brief)
  - Effortless onboarding; simple upload with validation, progress, and clear statuses.
  - AI as partner: show what AI did and allow corrections; keep humans in control.
  - WCAG AA baseline; responsive web app.
