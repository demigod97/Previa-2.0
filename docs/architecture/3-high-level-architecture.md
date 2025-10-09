# 3) High-Level Architecture

```mermaid
flowchart LR
  subgraph Client [React SPA]
    UI[Auth, ProtectedRoute, Chat UI, Uploads]
  end

  subgraph Supabase
    Auth[Auth]
    DB[(Postgres + RLS)]
    Storage[(Storage: sources/)]
    EF1[send-chat-message]
    EF2[process-document]
    EF3[process-document-callback]
    EF4[process-additional-sources]
    EF5[generate-notebook-content]
    EF6[webhook-handler]
    EF7[assign-user-role]
  end

  subgraph n8n [n8n Workflows]
    W1[Chat pipeline]
    W2[Document processing]
  end

  UI <---> Auth
  UI -->|upload| Storage
  UI -->|invoke| EF2 & EF5 & EF6
  EF2 -->|POST| W2
  W2 -->|callback| EF3 --> DB
  UI -->|invoke chat| EF1 -->|POST| W1
  W1 -->|JSON| EF1 --> UI
  EF7 --> DB
  DB <--> Storage
```

Rationale:
- Client never calls n8n directly; all calls go via Edge Functions for auth/validation/secrets.
- Service role usage is constrained to internal updates; RLS protects data for client reads.
