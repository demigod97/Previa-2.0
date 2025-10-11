# .env.example Template

**Location:** Copy this content to `.env.example` in project root

**Purpose:** Template for local development environment variables

---

```bash
# ============================================================================
# PREVIA ENVIRONMENT VARIABLES - EXAMPLE TEMPLATE
# ============================================================================
#
# Copy this file to .env.local and fill in your actual values.
# NEVER commit .env.local to version control!
#
# For complete documentation, see: docs/environment-variables.md
#
# Last Updated: 2025-01-09
# ============================================================================
#,
#    "atlassian-mcp-server": {
#      "url": "https://mcp.atlassian.com/v1/sse"
#    },
#
#
# ============================================================================
# SUPABASE CONFIGURATION (Required for local development)
# ============================================================================

# Your Supabase project URL
# Get this from: Supabase Dashboard → Project Settings → API
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anonymous (public) key
# Get this from: Supabase Dashboard → Project Settings → API
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ============================================================================
# IMPORTANT: SERVER-SIDE SECRETS
# ============================================================================
#
# The following secrets are NOT set in .env.local!
# They must be configured in Supabase Dashboard → Edge Functions → Secrets
#
# DO NOT add them to this file or commit them to version control.
#
# Required server-side secrets:
# - GEMINI_API_KEY (Google Gemini API key - PRIMARY LLM)
# - OPENAI_API_KEY (OpenAI GPT-4o API key - OPTIONAL FALLBACK)
# - CHAT_WEBHOOK_URL (n8n webhook for AI chat)
# - DOCUMENT_PROCESSING_WEBHOOK_URL (n8n webhook for OCR extraction)
# - RECONCILIATION_WEBHOOK_URL (n8n webhook for transaction matching)
# - WEBHOOK_SECRET_TOKEN (shared secret for webhook authentication)
#
# See docs/environment-variables.md for complete setup instructions.
#
# ============================================================================

# ============================================================================
# OPTIONAL: DEVELOPMENT CONFIGURATION
# ============================================================================

# Enable debug mode (verbose logging in console)
# VITE_DEBUG_MODE=true

# Override API timeout (in seconds)
# VITE_API_TIMEOUT=30

# Enable mock data mode (use test fixtures instead of real API)
# VITE_MOCK_DATA_MODE=true

# ============================================================================
# NOTES
# ============================================================================
#
# 1. Client-side environment variables MUST start with VITE_ prefix
#    (This is a Vite requirement for exposing variables to the browser)
#
# 2. Server-side secrets (LLM keys, webhook URLs) are configured separately
#    in Supabase Dashboard and are NEVER exposed to the client
#
# 3. Application constants (OCR thresholds, tier limits) are defined in
#    src/config/constants.ts, NOT as environment variables
#
# 4. After updating .env.local, restart the development server:
#    npm run dev
#
# ============================================================================
```

---

## Setup Instructions

1. **Copy template to project root:**
   ```bash
   # Create .env.example in project root with content above
   cp docs/env-example-template.md .env.example
   ```

2. **Create local environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Fill in Supabase credentials:**
   - Go to Supabase Dashboard → Project Settings → API
   - Copy `URL` → paste into `VITE_SUPABASE_URL`
   - Copy `anon public` key → paste into `VITE_SUPABASE_ANON_KEY`

4. **Configure server-side secrets:**
   - See `docs/environment-variables.md` for complete instructions
   - Configure in Supabase Dashboard → Edge Functions → Secrets

