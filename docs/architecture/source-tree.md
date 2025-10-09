# Source Tree Structure - Previa Financial Intelligence Platform

**Last Updated:** 2025-01-09
**Purpose:** Define the directory structure, file organization patterns, and import conventions for consistent development and AI agent implementation

---

## Project Structure Overview

Previa follows a **feature-first, domain-driven** directory structure optimized for financial domain development and AI agent implementation clarity.

```
previa/
├── docs/                          # 📚 All documentation
│   ├── architecture/              # Architecture specifications
│   ├── prd/                       # Product Requirements (sharded)
│   └── stories/                   # Development stories for AI agents
├── public/                        # 🌐 Static assets
│   ├── test-fixtures/             # Sample bank statements and receipts
│   └── assets/                    # Images, icons, logos
├── src/                           # 💻 Application source code
│   ├── components/                # React components (organized by domain)
│   ├── hooks/                     # Custom React hooks
│   ├── pages/                     # Route-level page components
│   ├── contexts/                  # React contexts
│   ├── integrations/              # External service integrations
│   ├── lib/                       # Utility functions and helpers
│   ├── types/                     # TypeScript type definitions
│   ├── config/                    # Configuration and constants
│   ├── services/                  # Business logic and API services
│   └── test/                      # Test utilities and fixtures
├── supabase/                      # 🗄️ Backend configuration
│   ├── functions/                 # Edge Functions (Deno)
│   ├── migrations/                # Database schema migrations
│   └── config.toml                # Supabase configuration
├── n8n/                           # 🤖 AI workflow exports
│   ├── workflows/                 # n8n workflow definitions
│   └── README.md                  # n8n setup instructions
└── .bmad-core/                    # 🏗️ BMAD development methodology
    ├── tasks/                     # Development tasks
    ├── templates/                 # Code templates
    └── checklists/                # Quality checklists
```

---

## Source Directory Structure (`src/`)

### Core Application Structure

```
src/
├── components/                    # 🧩 React Components
│   ├── financial/                 # Financial domain components
│   │   ├── TransactionCard/
│   │   │   ├── TransactionCard.tsx
│   │   │   ├── TransactionCard.test.tsx
│   │   │   └── index.ts
│   │   ├── ReconciliationEngine/
│   │   │   ├── ReconciliationEngine.tsx
│   │   │   ├── ReconciliationMatch.tsx
│   │   │   ├── MatchConfidenceIndicator.tsx
│   │   │   └── index.ts
│   │   ├── BankAccount/
│   │   │   ├── BankAccountCard.tsx
│   │   │   ├── BankAccountForm.tsx
│   │   │   └── index.ts
│   │   ├── Receipt/
│   │   │   ├── ReceiptCard.tsx
│   │   │   ├── ReceiptUpload.tsx
│   │   │   └── index.ts
│   │   └── index.ts               # Barrel exports
│   ├── onboarding/                # User onboarding flow
│   │   ├── WelcomeScreen.tsx
│   │   ├── StatementUpload.tsx
│   │   ├── AccountConfirmation.tsx
│   │   ├── TransactionPreview.tsx
│   │   └── index.ts
│   ├── dashboard/                 # Dashboard views and widgets
│   │   ├── DashboardHeader.tsx
│   │   ├── widgets/
│   │   │   ├── SpendingWidget.tsx
│   │   │   ├── IncomeWidget.tsx
│   │   │   ├── UnreconciledWidget.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── upload/                    # Document upload functionality
│   │   ├── DocumentUpload.tsx
│   │   ├── FileDropzone.tsx
│   │   ├── ProcessingStatus.tsx
│   │   └── index.ts
│   ├── chat/                      # AI chat assistant
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── CitationDisplay.tsx
│   │   └── index.ts
│   ├── auth/                      # Authentication components
│   │   ├── AuthForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── UserProfile.tsx
│   │   └── index.ts
│   ├── ui/                        # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── table.tsx
│   │   └── ...                    # Other shadcn/ui components
│   └── layout/                    # Layout components
│       ├── AppLayout.tsx
│       ├── Sidebar.tsx
│       ├── Navigation.tsx
│       └── index.ts
├── hooks/                         # 🪝 Custom React Hooks
│   ├── financial/
│   │   ├── useTransactions.ts
│   │   ├── useReconciliation.ts
│   │   ├── useBankAccounts.ts
│   │   ├── useUserTier.ts
│   │   └── index.ts
│   ├── auth/
│   │   ├── useAuth.ts
│   │   ├── useProtectedRoute.ts
│   │   └── index.ts
│   ├── upload/
│   │   ├── useFileUpload.ts
│   │   ├── useProcessingStatus.ts
│   │   └── index.ts
│   └── index.ts                   # Main hooks export
├── pages/                         # 📄 Route-level Pages
│   ├── Auth.tsx                   # /auth - Authentication page
│   ├── Dashboard.tsx              # / - Main dashboard
│   ├── Onboarding.tsx             # /onboarding - User onboarding
│   ├── Reconciliation.tsx         # /reconciliation - Matching interface
│   ├── Transactions.tsx           # /transactions - Transaction table
│   ├── Upload.tsx                 # /upload - Document upload hub
│   ├── Settings.tsx               # /settings - User settings
│   └── NotFound.tsx               # 404 page
├── contexts/                      # ⚡ React Contexts
│   ├── AuthContext.tsx            # User authentication state
│   ├── FinancialContext.tsx       # Financial data state (if needed)
│   └── index.ts
├── integrations/                  # 🔌 External Integrations
│   ├── supabase/
│   │   ├── client.ts              # Supabase client configuration
│   │   ├── types.ts               # Generated database types
│   │   ├── auth.ts                # Authentication helpers
│   │   ├── database.ts            # Database query helpers
│   │   ├── storage.ts             # File storage helpers
│   │   └── index.ts
│   ├── n8n/
│   │   ├── webhooks.ts            # n8n webhook integrations
│   │   ├── types.ts               # n8n workflow types
│   │   └── index.ts
│   └── index.ts
├── lib/                           # 🔧 Utility Functions
│   ├── currency.ts                # Currency formatting and calculations
│   ├── date.ts                    # Date handling utilities
│   ├── validation.ts              # Form and data validation
│   ├── file.ts                    # File processing utilities
│   ├── reconciliation.ts          # Reconciliation algorithm helpers
│   ├── utils.ts                   # General utilities (cn, etc.)
│   └── index.ts
├── types/                         # 📝 TypeScript Definitions
│   ├── financial.ts               # Financial domain types
│   ├── auth.ts                    # Authentication types
│   ├── upload.ts                  # File upload types
│   ├── api.ts                     # API response types
│   ├── ui.ts                      # UI component types
│   └── index.ts
├── config/                        # ⚙️ Configuration
│   ├── constants.ts               # Application constants
│   ├── routes.ts                  # Route definitions
│   ├── api.ts                     # API configuration
│   └── index.ts
├── services/                      # 🏢 Business Logic
│   ├── financial/
│   │   ├── transactionService.ts  # Transaction CRUD operations
│   │   ├── reconciliationService.ts # Reconciliation business logic
│   │   ├── bankAccountService.ts  # Bank account operations
│   │   └── index.ts
│   ├── upload/
│   │   ├── fileUploadService.ts   # File upload handling
│   │   ├── processingService.ts   # Document processing
│   │   └── index.ts
│   ├── auth/
│   │   ├── authService.ts         # Authentication service
│   │   └── index.ts
│   └── index.ts
└── test/                          # 🧪 Test Infrastructure
    ├── fixtures/
    │   ├── financial-data.ts      # Mock financial data
    │   ├── auth-data.ts           # Mock authentication data
    │   ├── upload-data.ts         # Mock upload data
    │   └── index.ts
    ├── utils/
    │   ├── test-utils.tsx         # React Testing Library setup
    │   ├── mock-supabase.ts       # Supabase mocking utilities
    │   └── index.ts
    └── setup.ts                   # Global test setup
```

---

## Component Organization Principles

### Financial Domain Components

**Structure Pattern:**
```
components/financial/[ComponentName]/
├── [ComponentName].tsx           # Main component implementation
├── [ComponentName].test.tsx      # Unit tests
├── [ComponentName].stories.tsx   # Storybook stories (optional)
├── types.ts                      # Component-specific types
├── utils.ts                      # Component-specific utilities
└── index.ts                      # Exports
```

**Example - TransactionCard:**
```typescript
// components/financial/TransactionCard/TransactionCard.tsx
export function TransactionCard({ transaction, onSelect }: TransactionCardProps) {
  // Implementation
}

// components/financial/TransactionCard/types.ts
export interface TransactionCardProps {
  transaction: Transaction;
  onSelect?: (id: string) => void;
  className?: string;
}

// components/financial/TransactionCard/index.ts
export { TransactionCard } from './TransactionCard';
export type { TransactionCardProps } from './types';
```

### shadcn/ui Components

**Base UI Components Location:**
```
components/ui/
├── button.tsx                    # shadcn/ui Button
├── card.tsx                      # shadcn/ui Card
├── form.tsx                      # shadcn/ui Form
├── input.tsx                     # shadcn/ui Input
├── table.tsx                     # shadcn/ui Table
├── dialog.tsx                    # shadcn/ui Dialog
├── progress.tsx                  # shadcn/ui Progress
├── badge.tsx                     # shadcn/ui Badge
└── ...                           # Other shadcn/ui components
```

**Previa Customization Pattern:**
```typescript
// components/ui/button.tsx (shadcn/ui base)
export { Button, buttonVariants } from './button';

// components/financial/PreviaButton.tsx (custom extension)
import { Button, ButtonProps } from '@/components/ui/button';

interface PreviaButtonProps extends ButtonProps {
  variant?: 'default' | 'previa' | 'financial';
}

export function PreviaButton({ variant = 'previa', ...props }: PreviaButtonProps) {
  return <Button variant={variant} {...props} />;
}
```

---

## Import Conventions

### Path Aliases

**Configured Aliases:**
```typescript
// vite.config.ts / tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/types/*": ["./src/types/*"],
    "@/config/*": ["./src/config/*"]
  }
}
```

**Import Order Standards:**
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// 2. UI components (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// 3. Internal components
import { TransactionCard } from '@/components/financial/TransactionCard';
import { useTransactions } from '@/hooks/financial/useTransactions';

// 4. Utilities and config
import { formatCurrency } from '@/lib/currency';
import { TIER_LIMITS } from '@/config/constants';

// 5. Types (always last)
import type { Transaction } from '@/types/financial';
import type { ComponentProps } from 'react';
```

### Barrel Export Strategy

**Feature-Level Exports:**
```typescript
// components/financial/index.ts
export { TransactionCard } from './TransactionCard';
export { ReconciliationEngine } from './ReconciliationEngine';
export { BankAccountCard } from './BankAccount';
export { ReceiptCard } from './Receipt';

// Export types
export type {
  TransactionCardProps,
  ReconciliationEngineProps,
  BankAccountCardProps,
  ReceiptCardProps
} from './types';

// Main components/index.ts
export * from './financial';
export * from './onboarding';
export * from './dashboard';
export * from './auth';
```

---

## File Naming Conventions

### Component Files

**React Components:**
- Use **PascalCase** for component files
- Include component type in name when helpful
- Examples: `TransactionCard.tsx`, `ReconciliationEngine.tsx`, `BankAccountForm.tsx`

**Component Tests:**
- Same name as component with `.test.tsx` suffix
- Examples: `TransactionCard.test.tsx`, `useTransactions.test.ts`

### Hook Files

**Custom Hooks:**
- Use **camelCase** starting with `use`
- Include domain context
- Examples: `useTransactions.ts`, `useReconciliation.ts`, `useBankAccounts.ts`

### Utility Files

**Utility Functions:**
- Use **camelCase** with descriptive names
- Group by domain when possible
- Examples: `currency.ts`, `dateHelpers.ts`, `validationUtils.ts`

### Type Files

**Type Definitions:**
- Use **camelCase** with descriptive names
- Often end with domain context
- Examples: `financialTypes.ts`, `apiTypes.ts`, `componentTypes.ts`

---

## Domain-Driven Organization

### Financial Domain Structure

**Primary Financial Entities:**
```
components/financial/
├── Transaction/               # Transaction-related components
├── Receipt/                   # Receipt-related components
├── BankAccount/              # Bank account components
├── Reconciliation/           # Reconciliation matching
├── Dashboard/                # Financial dashboard widgets
└── Reports/                  # Financial reporting (future)
```

**Supporting Domains:**
```
components/
├── auth/                     # Authentication domain
├── onboarding/               # User onboarding flow
├── upload/                   # Document upload domain
├── chat/                     # AI chat assistant
└── layout/                   # Application layout
```

### Service Layer Organization

**Business Logic Services:**
```
services/
├── financial/
│   ├── transactionService.ts    # CRUD + business rules
│   ├── reconciliationService.ts # Matching algorithms
│   ├── reportingService.ts      # Financial calculations
│   └── tierService.ts           # Freemium tier logic
├── upload/
│   ├── fileUploadService.ts     # File handling
│   └── processingService.ts     # Document processing
└── auth/
    └── authService.ts            # Authentication logic
```

---

## AI Agent Implementation Guidelines

### Clear Component Boundaries

**Single Responsibility Components:**
```typescript
// ✅ GOOD: Clear, focused component
interface TransactionCardProps {
  transaction: Transaction;
  onSelect?: (id: string) => void;
}

export function TransactionCard(props: TransactionCardProps) {
  // Single responsibility: display transaction
}

// ❌ AVOID: Mixed responsibilities
export function DashboardTransactionManager() {
  // Handles transactions, reconciliation, navigation, auth...
}
```

### Predictable File Locations

**Component Location Rules:**
1. **Financial components** → `components/financial/[ComponentName]/`
2. **UI components** → `components/ui/[componentName].tsx`
3. **Hooks** → `hooks/[domain]/use[HookName].ts`
4. **Types** → `types/[domain].ts`
5. **Services** → `services/[domain]/[serviceName].ts`

### Import Path Consistency

**Standard Import Patterns:**
```typescript
// Always use these patterns for AI agent consistency
import { TransactionCard } from '@/components/financial/TransactionCard';
import { useTransactions } from '@/hooks/financial/useTransactions';
import { formatCurrency } from '@/lib/currency';
import { TIER_LIMITS } from '@/config/constants';
import type { Transaction } from '@/types/financial';
```

---

## Migration Guidelines (Epic 1.1)

### PolicyAi Cleanup Structure

**Components to Remove:**
```
src/components/
├── notebook/                 # ❌ Remove entire directory
├── policy-document/          # ❌ Remove entire directory
├── chat/PolicyChatInterface.tsx # ❌ Remove specific files
└── chat/PolicyCitationComponent.tsx # ❌ Remove specific files
```

**Components to Preserve:**
```
src/components/
├── auth/                     # ✅ Keep - reusable for Previa
├── ui/                       # ✅ Keep - shadcn/ui components
├── dashboard/                # ✅ Modify for financial domain
└── layout/                   # ✅ Keep - general layout components
```

**New Structure Post-Cleanup:**
```
src/components/
├── financial/                # 🆕 Create - financial domain components
├── onboarding/               # 🆕 Create - onboarding flow
├── upload/                   # 🆕 Create - document upload
├── auth/                     # ✅ Keep existing
├── ui/                       # ✅ Keep existing
├── dashboard/                # 🔄 Modify for financial widgets
└── layout/                   # ✅ Keep existing
```

---

## Development Workflow

### Component Development Process

1. **Create Component Directory**
   ```bash
   mkdir src/components/financial/NewComponent
   cd src/components/financial/NewComponent
   ```

2. **Create Required Files**
   ```bash
   touch NewComponent.tsx
   touch NewComponent.test.tsx
   touch types.ts
   touch index.ts
   ```

3. **Implement Component**
   - Start with `types.ts` for interface definition
   - Implement `NewComponent.tsx` with clear props
   - Add `index.ts` barrel export
   - Write `NewComponent.test.tsx` tests

4. **Update Barrel Exports**
   ```typescript
   // components/financial/index.ts
   export { NewComponent } from './NewComponent';
   ```

### Hook Development Process

1. **Create Hook File**
   ```bash
   touch src/hooks/financial/useNewFeature.ts
   ```

2. **Implement Hook**
   ```typescript
   export function useNewFeature() {
     // Implementation with clear return type
   }
   ```

3. **Add Tests**
   ```bash
   touch src/hooks/financial/useNewFeature.test.ts
   ```

4. **Update Exports**
   ```typescript
   // hooks/financial/index.ts
   export { useNewFeature } from './useNewFeature';
   ```

---

This source tree structure ensures consistent organization, clear domain boundaries, and optimal AI agent implementation while supporting the financial intelligence platform's growth and maintainability.