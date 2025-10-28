# Tech Stack - Previa Financial Intelligence Platform

**Last Updated:** 2025-01-09
**Purpose:** Define specific technology versions, rationale, and integration patterns for Previa development

---

## Stack Overview

Previa is built as a **serverless-first, full-stack financial platform** optimized for Australian households, freelancers, and small businesses. The technology choices prioritize developer experience, security, scalability, and cost-effectiveness.

---

## Frontend Stack

### Core Framework
- **React**: `18.3.1` - Latest stable with concurrent features for financial data rendering
- **TypeScript**: `5.5.3` - Strong typing for financial calculations and data integrity
- **Vite**: `5.4.1` - Fast development and optimized production builds

**Rationale:** React 18 provides concurrent features essential for responsive financial UIs. TypeScript prevents financial calculation errors through compile-time type checking.

### UI & Styling
- **shadcn/ui**: Latest - Accessible, customizable components for financial interfaces
- **Tailwind CSS**: `3.4.11` - Utility-first styling with Previa design system
- **Radix UI**: `^1.2.0` - Accessible primitives underlying shadcn/ui
- **Lucide React**: `^0.462.0` - Financial icons and UI elements

**Component Library Versions:**
```json
{
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-select": "^2.1.1",
  "@radix-ui/react-progress": "^1.1.0",
  "@radix-ui/react-toast": "^1.2.1",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^2.5.2",
  "tailwindcss-animate": "^1.0.7"
}
```

**Design Rationale:** shadcn/ui provides production-ready financial components while maintaining customization flexibility for Previa's warm color palette.

### State Management & Data Fetching
- **TanStack Query (React Query)**: `^5.56.2` - Server state management for financial data
- **React Hook Form**: `^7.53.0` - Form validation for financial input
- **Zod**: `^3.23.8` - Runtime validation for financial data schemas

**Rationale:** React Query handles complex financial data caching and synchronization. Zod ensures financial data integrity at runtime.

### Financial & Utility Libraries
- **date-fns**: `^3.6.0` - Financial date manipulation and formatting
- **recharts**: `^2.12.7` - Financial charts and analytics visualization
- **react-router-dom**: `^6.26.2` - Client-side routing for financial workflows

**Planned Additions (Epic 1.2):**
```json
{
  "currency.js": "^2.0.4",           // Precise financial calculations
  "react-dropzone": "^14.2.3",      // Document upload interface
  "xlsx": "^0.18.5",                // Excel statement processing
  "papaparse": "^5.4.1",            // CSV statement parsing
  "react-pdf": "^7.7.0"             // PDF statement display
}
```

---

## Backend Stack

### Platform & Services
- **Supabase**: Latest stable - Complete BaaS for authentication, database, storage
- **PostgreSQL**: `15+` - Robust relational database with financial data types
- **Deno**: Latest - Runtime for Supabase Edge Functions
- **n8n Cloud**: Latest - Visual workflow automation for AI processing

**Supabase Components:**
- **Auth**: JWT-based authentication with RLS integration
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: File storage for bank statements and receipts
- **Edge Functions**: Deno runtime for secure API endpoints
- **Realtime**: WebSocket subscriptions for processing status updates

### Edge Functions Runtime
- **Deno**: Latest stable - Secure, TypeScript-native runtime
- **Supabase Edge Runtime**: Latest - Optimized for serverless functions

**Key Dependencies:**
```typescript
// Edge Function dependencies
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
```

### AI & Processing Stack
- **n8n Cloud/Self-hosted**: Latest - Workflow automation platform
- **Google Gemini API**: Latest - Primary LLM for financial document processing
- **OpenAI GPT-4o**: Latest - Optional fallback LLM
- **OCR Services**: Integrated via Gemini Vision API

**Rationale:** n8n separates heavy AI processing from lightweight Edge Functions, enabling cost-effective scaling and visual workflow management.

---

## Database Stack

### Core Database
- **PostgreSQL**: `15+` - ACID compliance for financial transactions
- **Supabase Extensions**: UUID generation, RLS policies, triggers

**Financial Data Types:**
```sql
-- Precise financial amounts
DECIMAL(15,2)  -- Supports up to $999,999,999,999.99

-- Financial status enums
CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
CHECK (tier IN ('user', 'premium_user'))
```

### Data Management
- **Row Level Security (RLS)**: User data isolation
- **Indexes**: Optimized for financial queries
- **Triggers**: Automated tier creation and timestamp management
- **Migrations**: Versioned schema changes via Supabase CLI

**Performance Indexes:**
```sql
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_receipts_user_date ON receipts(user_id, receipt_date DESC);
CREATE INDEX idx_matches_status ON reconciliation_matches(user_id, status);
```

---

## Development Tools

### Build & Development
- **Vite**: `5.4.1` - Development server and production builds
- **ESLint**: `^9.9.0` - Code quality and consistency
- **TypeScript ESLint**: `^8.0.1` - TypeScript-specific linting
- **PostCSS**: `^8.4.47` - CSS processing pipeline
- **Autoprefixer**: `^10.4.20` - CSS vendor prefixes

### Testing Stack
- **Vitest**: Latest - Fast unit testing framework
- **React Testing Library**: Latest - Component testing utilities
- **jsdom**: Latest - DOM environment for tests
- **Playwright**: Latest - End-to-end testing

**Test Configuration:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', 'dist/']
    }
  }
});
```

### Development Utilities
- **Supabase CLI**: `^2.48.3` - Database migrations and local development
- **BMAD Core**: Latest - AI agent development methodology
- **React Query DevTools**: Development-only query inspection

---

## Infrastructure & Deployment

### Hosting & CDN
- **Frontend**: Vercel (primary) or Netlify (alternative)
- **Backend**: Supabase managed infrastructure
- **CDN**: Edge network for global performance
- **DNS**: Cloudflare for security and performance

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Vercel Deployment**: Automatic preview deployments
- **Supabase CLI**: Migration deployment automation

**Deployment Strategy:**
- **Development**: Local Supabase + Vite dev server
- **Staging**: Supabase staging + Vercel preview
- **Production**: Supabase production + Vercel production

### Environment Management
- **Local**: `.env.local` with Supabase keys
- **Server**: Supabase Edge Function secrets
- **CI/CD**: GitHub Secrets for deployment

---

## Security & Compliance

### Authentication
- **Supabase Auth**: JWT tokens with automatic refresh
- **Row Level Security**: Database-level authorization
- **API Security**: Edge Function validation and rate limiting

### Data Protection
- **Encryption**: TLS in transit, AES-256 at rest
- **PII Handling**: Account number masking, no financial data in logs
- **GDPR Compliance**: User data deletion and export capabilities

### Australian Compliance
- **Data Residency**: Supabase Asia-Pacific region
- **Privacy Standards**: Australian Privacy Principles (APP)
- **Financial Regulations**: Prepared for Australian Financial Services License (AFSL)

---

## Version Management Strategy

### Package Management
- **npm**: `9+` - Package manager with lockfile integrity
- **Node.js**: `18+` LTS - Long-term support for stability
- **Version Pinning**: Exact versions for critical dependencies

### Update Strategy
```bash
# Regular dependency updates
npm audit                    # Security vulnerability checks
npm outdated                # Check for version updates
npm update --save-exact     # Update with exact version pinning
```

### Breaking Change Management
- **Major Versions**: Manual review and testing required
- **Security Patches**: Automated updates via Dependabot
- **LTS Alignment**: Follow Node.js LTS schedule

---

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Progressive component loading
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: WebP format with fallbacks

### Backend Performance
- **Database Indexing**: Query-specific indexes for financial data
- **Edge Function Cold Starts**: Minimized through connection pooling
- **Caching**: React Query for client-side, PostgreSQL for server-side
- **CDN**: Static asset delivery via edge network

---

## Integration Patterns

### External Service Integration
```typescript
// n8n Webhook Integration Pattern
const response = await fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WEBHOOK_SECRET}`
  },
  body: JSON.stringify({
    source_id: documentId,
    callback_url: `${EDGE_FUNCTION_URL}/process-document-callback`
  })
});
```

### Database Integration Pattern
```typescript
// RLS-Aware Database Queries
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', user.id)  // Enforced by RLS
  .order('transaction_date', { ascending: false });
```

---

## Migration Path & Future Considerations

### Planned Technology Upgrades
- **React 19**: When stable (concurrent features enhancement)
- **Next.js**: Potential migration for SSR financial reports
- **Open Banking**: CDR API integration post-MVP
- **Direct Integrations**: Xero/QuickBooks API connections

### Scalability Considerations
- **Database Sharding**: User-based partitioning for large scale
- **Microservices**: n8n workflow decomposition
- **Edge Functions**: Regional deployment for latency optimization

---

## Rationale Summary

### Why This Stack?

1. **Developer Experience**: TypeScript + React + Vite provides excellent DX
2. **Financial Accuracy**: Strong typing prevents monetary calculation errors
3. **Security**: RLS + Edge Functions provide defense-in-depth
4. **Scalability**: Serverless architecture scales automatically
5. **Cost-Effectiveness**: Pay-per-use model aligns with startup economics
6. **AI-Ready**: Clear separation allows AI agents to implement components independently

### Trade-offs Accepted

- **Vendor Lock-in**: Supabase dependency for rapid development
- **Complexity**: Multi-service architecture requires orchestration
- **Learning Curve**: Modern React patterns require team upskilling
- **Cold Starts**: Serverless functions may have initialization latency

The chosen stack optimizes for rapid MVP development while maintaining production scalability and financial data security requirements.