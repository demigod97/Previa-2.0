# Previa - AI-Driven Financial Intelligence Platform

> Transform your financial management with AI-powered reconciliation. Save 5+ hours/week on financial admin with intelligent transaction matching and tax-ready bookkeeping.

**Previa** is an AI-driven financial intelligence and pre-accounting platform designed for Australian households, freelancers, and small businesses. It automates the tedious tasks of transaction reconciliation, receipt processing, and financial record-keeping while educating users through gamified financial literacy experiences.

---

## 🎯 About The Project

Previa addresses the critical challenge of manual financial administration that burdens individuals, freelancers, and small businesses. Traditional financial management involves inconsistent, manual processes that are prone to errors and lead to tax compliance issues.

### The Problem

- **Income Instability**: Fluctuating workloads and inconsistent payments make budgeting difficult
- **Delayed Payments**: Late or non-payments impact cash flow and cause financial stress
- **Complex Taxes**: Manual tax planning and compliance without professional assistance
- **Mixed Finances**: Personal and business transactions create confusion and poor cash flow management

### Our Solution

Previa provides an intelligent, automated platform that:

- **Effortless Data Ingestion**: Upload bank statements (PDF/CSV) and receipts via web or mobile
- **Intelligent AI Reconciliation**: Automatically extract and match transactions to receipts using OCR and LLMs
- **Financial Literacy through Gamification**: Engaging challenges and rewards that build better financial habits
- **Seamless Integration**: Export reconciled data to Xero, QuickBooks, and other accounting software
- **Future-Ready Architecture**: Built to support Australia's Consumer Data Right (CDR) and Open Banking APIs

---

## ✨ Key Features

### MVP Core Features

- **🎓 Interactive Onboarding**: Guided 7-step workflow to upload your first bank statement with AI-assisted account setup
- **📤 Manual Data Upload**: Support for bank statements (PDF/CSV) and receipts (PDF/images)
- **🤖 AI-Powered Reconciliation**: 70%+ automation rate for transaction-to-receipt matching
- **📊 Financial Dashboard**: Real-time insights into income, expenses, and reconciliation status
- **🎮 Gamified Tasks**: Rewards and challenges that make financial management engaging
- **💾 Data Export**: Export reconciled data in standardized formats compatible with accounting software

### Planned Features

- Open Banking (CDR) Integration
- Direct API Integration with Xero and QuickBooks
- Advanced Reporting and Analytics
- Multi-User Functionality

---

## 🎨 Design & User Experience

Previa features a warm, approachable design built with **Chakra UI** components:

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | `#F2E9D8` | Primary background, light surfaces |
| Stone Gray | `#8C877D` | Secondary text, borders |
| Sand | `#D9C8B4` | Accent elements, hover states |
| Charcoal | `#403B31` | Primary text, headings |
| Dark Stone | `#595347` | Secondary headings, icons |

### Core User Flows

1. **Onboarding**: Welcome → Auth → Upload Statement → AI Extraction → Confirm Details → Preview → Complete
2. **Dashboard**: 4-view interface (Home, Reconciliation, Transactions, Chat)
3. **Reconciliation**: Side-by-side transaction-receipt matching with confidence indicators
4. **Document Management**: Upload hub and library with processing status tracking

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1
- **UI Components**: Chakra UI 2.8.0 with custom Previa theme
- **Data Grids**: AG-Grid Enterprise 31.0.0 for financial tables
- **AI Chat**: Copilot Kit 0.10.0 for intelligent assistant
- **Styling**: Tailwind CSS 3.4.11 (complementary to Chakra UI)
- **State Management**: TanStack Query 5.56.2
- **Testing**: Vitest, React Testing Library, Playwright

### Backend
- **Platform**: Supabase (Authentication, Storage, Database, Edge Functions)
- **Database**: PostgreSQL 15 with Row Level Security (RLS)
- **Automation**: n8n Cloud for OCR extraction and AI reconciliation workflows
- **Runtime**: Deno for Edge Functions
- **API Style**: REST-like with async/polling patterns

### Infrastructure
- **Repository**: Monorepo structure
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel/Netlify (frontend), Supabase (backend)
- **Hosting**: Serverless architecture

---

## 📐 Architecture Overview

```mermaid
flowchart LR
  subgraph Client [React SPA]
    UI[Auth, Onboarding, Dashboard, Reconciliation]
  end

  subgraph Supabase
    Auth[Authentication]
    DB[(PostgreSQL + RLS)]
    Storage[(Storage: Statements/Receipts)]
    EF[Edge Functions]
  end

  subgraph n8n [n8n Workflows]
    W1[OCR Extraction]
    W2[AI Reconciliation]
    W3[Chat Assistant]
  end

  UI <---> Auth
  UI -->|upload| Storage
  UI -->|invoke| EF
  EF -->|POST| W1 & W2 & W3
  W1 & W2 -->|callback| EF --> DB
  DB <--> Storage
```

### Data Model (Financial Domain)

Core tables optimized for financial reconciliation:

- **`user_tiers`**: Freemium tier management (user/premium_user)
- **`bank_accounts`**: User-created accounts from uploaded statements
- **`bank_statements`**: Uploaded PDF/CSV files with processing status
- **`transactions`**: Individual transactions extracted from statements
- **`receipts`**: Uploaded receipts/bills with OCR data
- **`reconciliation_matches`**: AI-suggested transaction-receipt matches with confidence scores

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended for local development)
- **npm** 9+ or **yarn** 1.22+
- **Supabase** account (https://supabase.com)
- **n8n** Cloud account or self-hosted instance (https://n8n.io)
- **Google Gemini API** key (primary LLM) - Get from https://ai.google.dev
- **OpenAI API** key (optional fallback) - Get from https://platform.openai.com

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/previa.git
   cd previa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run migrations from `supabase/migrations/`
   - Configure environment secrets in Supabase Edge Functions

4. **Configure n8n workflows**
   - Import workflows from `n8n/` directory
   - Configure webhooks for:
     - `DOCUMENT_PROCESSING_WEBHOOK_URL`
     - `RECONCILIATION_WEBHOOK_URL`
     - `CHAT_WEBHOOK_URL`
   - Add webhook URLs to Supabase secrets

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase URL and anon key
   ```
   
   **Important:** See [docs/environment-variables.md](./docs/environment-variables.md) for complete environment setup including:
   - Supabase configuration
   - LLM API keys (Gemini + optional GPT-4o)
   - n8n webhook URLs
   - Server-side secrets configuration
   
   **Note:** n8n workflows are documented in [docs/n8n-workflow-requirements.md](./docs/n8n-workflow-requirements.md)

6. **Run development server**
   ```bash
   npm run dev
   ```

---

## 📱 User Roles

### Free Tier (`user`)
- 3 bank accounts maximum
- 50 transactions per month
- Basic reconciliation features
- Export to CSV

### Premium Tier (`premium_user`)
- Unlimited bank accounts
- Unlimited transactions
- Advanced analytics
- Priority support
- Direct accounting software integration

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run with coverage
npm run test -- --coverage

# Linting
npm run lint
```

### Mock Data for Development

Previa includes comprehensive mock financial data for testing:

- **Location:** `src/test/fixtures/financial-data.ts`
- **Includes:** Sample bank accounts, statements, transactions, receipts, and reconciliation matches
- **Sample Files:** `public/test-fixtures/` (placeholders for bank statements and receipt images)

**Test Data Summary:**
- 3 bank accounts (Commonwealth, ANZ, Westpac)
- 2 bank statements (Jan 2024)
- 10 sample transactions (groceries, transport, dining, subscriptions, income)
- 5 receipts with OCR data
- 4 reconciliation matches (various confidence levels)

Use these fixtures to:
- Test UI components without real financial data
- Develop reconciliation algorithms
- Demo the platform to potential users

See `src/test/fixtures/financial-data.ts` for helper functions like `getUnreconciledTransactions()` and `getTotalSpendingByCategory()`.

---

## 🔐 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: PostgreSQL Row Level Security (RLS) for data isolation
- **Secrets Management**: Server-side only, never exposed to client
- **Data Protection**: PII masking, encrypted storage, WCAG AA compliance
- **Rate Limiting**: CDN/edge tier protection for API endpoints

---

## 📊 Success Metrics

### User Success
- Reduce manual financial admin time by 5+ hours/week
- Achieve 70%+ AI reconciliation automation rate
- Improve financial literacy through gamification engagement

### Business KPIs
- Activation Rate: % of users completing onboarding
- Retention Rate: Day 7 and Day 30 retention
- Transaction Volume: Transactions reconciled per month
- Conversion Rate: Free → Premium tier upgrades

---

## 🗺️ Roadmap

### Phase 1: MVP Core (Current)
- ✅ Authentication and user management
- ✅ Onboarding workflow
- ✅ Document upload and OCR extraction
- ✅ Basic reconciliation engine
- ✅ Financial dashboard

### Phase 2: Enhanced Features
- 🔄 Multi-view dashboard with widgets
- 🔄 AI chat assistant
- 🔄 Gamification elements
- 🔄 Mobile optimization

### Phase 3: Integration & Scale
- 📋 Data export to accounting software
- 📋 Open Banking (CDR) integration
- 📋 Advanced analytics
- 📋 Multi-user functionality

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Chakra UI**: Comprehensive accessible component library
- **AG-Grid**: Enterprise-grade data grid solution
- **Copilot Kit**: AI chat interface framework
- **Supabase**: Backend-as-a-Service platform
- **n8n**: Workflow automation
- **Design Inspiration**: Monarch Money, Expensify, PocketSmith

---

## 📞 Support

- **Documentation**: See `docs/` folder for detailed specifications
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join our community discussions

---

## 🎯 Target Users

### Primary: Australian Households
Managing rising costs, seeking simple budgeting tools to reduce financial stress and build savings.

### Secondary: Freelancers & Sole Traders
Dealing with inconsistent income, self-managed taxes, and mixed personal/business finances.

### Tertiary: Small Business Owners
Focused on cash flow and profitability, needing automated record-keeping for compliance.

---

**Built with ❤️ for the Australian market** | **Save Time. Gain Clarity. Build Wealth.**
