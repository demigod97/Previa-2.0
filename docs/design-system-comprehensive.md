# Previa Comprehensive Design System

**Version:** 3.0 (Chakra UI)
**Last Updated:** 2025-10-27
**Purpose:** Single source of truth for all frontend styling, components, and UX patterns across Previa.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [UI Patterns](#ui-patterns)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Component Reference](#component-reference)
10. [Page Templates](#page-templates)
11. [Theme Configuration](#theme-configuration)

---

## Design Philosophy

### Physical Notebook Theme

Previa's UI mimics a physical notebook to create familiarity and trust:

- **Paper White Data Surfaces** (`#FFFFFF`) - Financial data, tables, cards
- **Ruled Lines** - Subtle borders between items like notebook paper (`border-charcoal/10`)
- **Cream Backgrounds** (`#F2E9D8`) - Navigation, page surrounds, giving warmth
- **Emoji + Icon Blending** - Friendly, approachable feel (🏠 + Lucide icons)

### Core Principles

1. **Clarity First** - Financial data must be instantly readable
2. **Consistent Spacing** - 4px base unit, predictable rhythm
3. **Touch-Friendly** - Minimum 44x44px touch targets
4. **WCAG AA Compliance** - All color combinations meet accessibility standards

---

## Color System

### Brand Colors

```typescript
// src/theme/colors.ts
export const previaColors = {
  // Primary Palette
  cream: '#F2E9D8',      // Backgrounds, light surfaces
  stone: '#8C877D',      // Secondary text, borders
  sand: '#D9C8B4',       // Accent, hover states
  charcoal: '#403B31',   // Primary text, headings
  darkStone: '#595347',  // Secondary headings, icons
  paperWhite: '#FFFFFF', // Data surfaces, cards
}
```

### Usage Guidelines

| Color | Usage | Chakra Token | Example |
|-------|-------|--------------|---------|
| **Cream** | Page backgrounds, sidebar | `previa.cream` | `bg="previa.cream"` |
| **Paper White** | Cards, tables, data surfaces | `white` | `bg="white"` |
| **Charcoal** | Primary text, headings | `previa.charcoal` | `color="previa.charcoal"` |
| **Stone** | Secondary text, borders | `previa.stone` | `color="previa.stone"` |
| **Sand** | Accents, hover states, buttons | `previa.sand` | `bg="previa.sand"` |
| **Dark Stone** | Icons, subheadings | `previa.darkStone` | `color="previa.darkStone"` |

### Semantic Colors

```typescript
// Status indicators
green.500: '#10B981'  // Success, approved, positive amounts
red.500:   '#EF4444'  // Error, rejected, negative amounts
orange.500: '#F59E0B' // Warning, matched, needs attention
blue.500:  '#3B82F6'  // Processing, info
```

### Contrast Requirements (WCAG AA)

- ✅ Charcoal on White: 10.7:1 (AAA)
- ✅ Charcoal on Cream: 8.9:1 (AAA)
- ⚠️ Stone on Cream: 3.8:1 (AA Large Text Only)
- ✅ Dark Stone on White: 7.2:1 (AAA)

---

## Typography

### Font Families

```css
/* src/theme/index.ts */
fonts: {
  heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'JetBrains Mono, "SF Mono", Monaco, "Cascadia Code", monospace',
}
```

### Type Scale

| Element | Size | Weight | Usage | Chakra Props |
|---------|------|--------|-------|--------------|
| **H1** | 2.5rem (40px) | 600 | Page titles | `fontSize="4xl" fontWeight="semibold"` |
| **H2** | 2rem (32px) | 600 | Section headings | `fontSize="3xl" fontWeight="semibold"` |
| **H3** | 1.5rem (24px) | 600 | Card titles | `fontSize="2xl" fontWeight="semibold"` |
| **H4** | 1.25rem (20px) | 600 | Widget headers | `fontSize="xl" fontWeight="semibold"` |
| **Body** | 1rem (16px) | 400 | General text | `fontSize="md"` |
| **Small** | 0.875rem (14px) | 400 | Labels, captions | `fontSize="sm"` |
| **Tiny** | 0.75rem (12px) | 400 | Timestamps | `fontSize="xs"` |

### Financial Data Typography

```tsx
// Always use mono font for amounts
<Text fontFamily="mono" fontSize="lg" fontWeight="semibold">
  $1,234.56
</Text>

// Color coding for amounts
<Text
  fontFamily="mono"
  color={amount >= 0 ? 'green.600' : 'red.600'}
>
  {amount >= 0 ? '+' : ''}{formatCurrency(amount)}
</Text>
```

---

## Spacing & Layout

### Spacing Scale (4px base)

```tsx
// Chakra spacing tokens
0: '0px'      // none
1: '0.25rem'  // 4px   - tight spacing
2: '0.5rem'   // 8px   - compact
3: '0.75rem'  // 12px  - small gaps
4: '1rem'     // 16px  - default gap
6: '1.5rem'   // 24px  - medium section spacing
8: '2rem'     // 32px  - large section spacing
12: '3rem'    // 48px  // page sections
```

### Common Spacing Patterns

```tsx
// Card padding
<Card p={6}>  // 24px padding

// Stack spacing
<VStack spacing={4}>  // 16px between items

// Button padding
<Button px={6} py={3}>  // 24px horizontal, 12px vertical

// Page margins
<Box px={6} py={8}>  // 24px horizontal, 32px vertical
```

### Layout Grid

```tsx
// Dashboard 3-column grid
<Grid templateColumns="repeat(3, 1fr)" gap={6}>

// Responsive 2-column
<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>

// Sidebar + Content
<Grid templateColumns={{ base: '1fr', lg: '256px 1fr' }}>
```

---

## Component Library

### Base Components

All components use Chakra UI with Previa theming.

#### Avatar

```tsx
// src/components/chakra-ui/avatar.tsx
<Avatar size="md">  // 40px
  <AvatarFallback bg="previa.sand" color="previa.charcoal">
    JD
  </AvatarFallback>
</Avatar>

// Sizes: xs (24px), sm (32px), md (40px), lg (48px), xl (64px)
```

**Fixed Issues:**
- ✅ Font size set to `sm` to prevent overflow
- ✅ Font weight `medium` for clarity

#### Button

```tsx
// src/components/chakra-ui/button.tsx
// Primary button
<Button bg="previa.charcoal" color="white" _hover={{ bg: "previa.darkStone" }}>
  Save Changes
</Button>

// Secondary button
<Button variant="outline" borderColor="previa.sand" _hover={{ bg: "previa.cream" }}>
  Cancel
</Button>

// Minimum size: 44x44px for accessibility
```

#### Input

```tsx
// src/components/chakra-ui/input.tsx
// Standard input
<Input
  placeholder="Enter text"
  borderColor="previa.stone"
  _focus={{ borderColor: "previa.sand", boxShadow: "0 0 0 1px #D9C8B4" }}
/>

// Input with icon (IMPORTANT: Proper spacing)
<Box position="relative">
  <Icon
    as={Search}
    position="absolute"
    left="3"
    top="50%"
    transform="translateY(-50%)"
    pointerEvents="none"
    color="previa.stone"
  />
  <Input paddingLeft="2.5rem" placeholder="Search..." />
</Box>
```

**Icon Spacing Math:**
- Icon position: `left="3"` (12px)
- Icon width: 16px (lucide icons)
- Icon extends to: 12px + 16px = 28px
- Text padding: `2.5rem` (40px)
- Clearance: 40px - 28px = **12px ✓**

#### Dropdown Menu

```tsx
// src/components/chakra-ui/dropdown-menu.tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent minW="14rem">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem color="red.600">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Theme Overrides (src/theme/index.ts):**
```typescript
Menu: {
  baseStyle: {
    list: {
      py: 2,              // 8px top/bottom padding
      borderRadius: 'md',
      borderColor: 'previa.sand',
      bg: 'white',
      boxShadow: 'lg',
    },
    item: {
      py: 2,              // 8px top/bottom
      px: 4,              // 16px left/right
      _hover: { bg: 'previa.cream' },
      _focus: { bg: 'previa.cream' },
    },
    groupTitle: {
      px: 4,
      py: 2,
      fontSize: 'sm',
      fontWeight: 'semibold',
      color: 'previa.darkStone',
    },
    divider: {
      my: 2,
      borderColor: 'previa.sand',
    },
  },
},
```

#### Card

```tsx
// src/components/chakra-ui/card.tsx
<Card>
  <CardHeader>
    <CardTitle>Transaction Details</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// Theme default: white background, sand border
```

---

## UI Patterns

### Loading States

#### Skeleton Loaders

```tsx
// Content-aware skeletons (src/components/ui/skeletons/)
import { TransactionCardSkeleton, BankAccountCardSkeleton, ChartWidgetSkeleton } from '@/components/ui/skeletons';

// Transaction list loading
<TransactionCardSkeleton count={5} />

// Bank account loading
<BankAccountCardSkeleton count={2} />

// Chart loading
<ChartWidgetSkeleton height="400px" type="bar" />
```

**Never use:**
- ❌ Generic `<Skeleton>` boxes
- ❌ Spinners for data loading
- ❌ "Loading..." text

**Always use:**
- ✅ Shape-matched skeletons
- ✅ Same height as actual content
- ✅ Smooth transitions

### Empty States

```tsx
<Box textAlign="center" py={8}>
  <Text fontSize="4xl" mb={3}>📭</Text>
  <Text fontSize="md" color="previa.stone" mb={2}>
    No transactions yet
  </Text>
  <Text fontSize="sm" color="previa.stone">
    Upload a bank statement to get started
  </Text>
</Box>
```

### Hover States

```tsx
// Card hover
<Box
  cursor="pointer"
  transition="all 0.2s"
  _hover={{ bg: "previa.cream" }}
>

// Button hover (theme handles automatically)

// Transaction row hover
<Flex
  _hover={{ bg: "previa.cream" }}
  transition="all 0.2s ease-out"
>
```

### Focus States

```tsx
// All interactive elements must have visible focus
<Button
  _focus={{
    outline: "2px solid",
    outlineColor: "previa.sand",
    outlineOffset: "2px",
  }}
>
```

---

## Responsive Design

### Breakpoints

```typescript
// Chakra UI breakpoints
{
  base: '0px',    // Mobile first
  sm: '480px',    // Small phones
  md: '768px',    // Tablets
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px' // Extra large
}
```

### Responsive Patterns

```tsx
// Show/hide based on screen size
<Box display={{ base: 'block', lg: 'none' }}>Mobile only</Box>
<Box display={{ base: 'none', lg: 'block' }}>Desktop only</Box>

// Responsive grid
<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>

// Responsive padding
<Box px={{ base: 4, md: 6, lg: 8 }}>

// Responsive font size
<Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
```

### Mobile Navigation

- **< 768px**: Bottom tab bar
- **768px - 1024px**: Collapsed sidebar
- **> 1024px**: Full sidebar

---

## Accessibility

### WCAG AA Compliance

**Touch Targets:**
- Minimum 44x44px for all interactive elements
- Buttons, links, icons, checkboxes

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators required on all focusable elements

**Screen Readers:**
```tsx
// Always provide aria-labels
<Button aria-label="Delete transaction" icon={<Trash />} />

// Use semantic HTML
<nav aria-label="Main navigation">
<main aria-label="Dashboard content">

// Announce dynamic changes
<Box role="status" aria-live="polite">
  {successMessage}
</Box>
```

---

## Component Reference

### Core UI Components

| Component | Location | Usage |
|-----------|----------|-------|
| Avatar | `src/components/chakra-ui/avatar.tsx` | User icons, profile pictures |
| Button | `src/components/chakra-ui/button.tsx` | All buttons, CTAs |
| Card | `src/components/chakra-ui/card.tsx` | Content containers |
| Input | `src/components/chakra-ui/input.tsx` | Text inputs, search fields |
| Select | `src/components/chakra-ui/select.tsx` | Dropdowns |
| Dialog | `src/components/chakra-ui/dialog.tsx` | Modals, confirmations |
| Badge | `src/components/chakra-ui/badge.tsx` | Status indicators, tags |
| Skeleton | `src/components/chakra-ui/skeleton.tsx` | Loading states |

### Custom Components

| Component | Location | Usage |
|-----------|----------|-------|
| Logo | `src/components/chakra-ui/Logo.tsx` | Previa SVG logo |
| TransactionCardSkeleton | `src/components/ui/skeletons/TransactionCardSkeleton.tsx` | Transaction loading |
| BankAccountCardSkeleton | `src/components/ui/skeletons/BankAccountCardSkeleton.tsx` | Account loading |
| ChartWidgetSkeleton | `src/components/ui/skeletons/ChartWidgetSkeleton.tsx` | Chart loading |
| DeleteConfirmationDialog | `src/components/chakra-ui/delete-confirmation-dialog.tsx` | Delete confirmations |

### Financial Components

| Component | Location | Usage |
|-----------|----------|-------|
| RecentTransactionsList | `src/components/dashboard/RecentTransactionsList.tsx` | Dashboard widget |
| BankAccountsList | `src/components/dashboard/BankAccountsList.tsx` | Dashboard widget |
| FinancialOverviewCards | `src/components/dashboard/FinancialOverviewCards.tsx` | Dashboard stats |
| TransactionCard | `src/components/reconciliation/TransactionCard.tsx` | Reconciliation |
| ReceiptCard | `src/components/reconciliation/ReceiptCard.tsx` | Reconciliation |
| TransactionTableToolbar | `src/components/transactions/TransactionTableToolbar.tsx` | Search/filter |

### Layout Components

| Component | Location | Usage |
|-----------|----------|-------|
| Sidebar | `src/components/layout/Sidebar.tsx` | Main navigation |
| TopBar | `src/components/layout/TopBar.tsx` | Top navigation, user menu |
| DashboardLayout | `src/components/layout/DashboardLayout.tsx` | Page wrapper |
| AppLayout | `src/components/layout/AppLayout.tsx` | Root layout |

---

## Page Templates

### Dashboard

**File:** `src/pages/Dashboard.tsx`

**Layout:**
```
┌─────────────────────────────────────┐
│ TopBar                              │
├────┬────────────────────────────────┤
│    │ User Greeting                  │
│ S  ├──────────────┬─────────────────┤
│ i  │ Chart 1      │ Chart 2         │
│ d  ├──────────────┼─────────────────┤
│ e  │ Alert        │ Recent Trans    │
│ b  ├──────────────┴─────────────────┤
│ a  │ Financial Overview Cards       │
│ r  │                                │
└────┴────────────────────────────────┘
```

**Key Components:**
- UserGreetingCard
- MonthlySpendingChart (lazy loaded)
- IncomeVsExpensesChart (lazy loaded)
- UnreconciledAlert (lazy loaded)
- RecentTransactionsList
- FinancialOverviewCards
- BankAccountsList
- TierDisplay

### Transactions

**File:** `src/pages/TransactionsView.tsx`

**Layout:**
```
┌─────────────────────────────────────┐
│ TopBar                              │
├────┬────────────────────────────────┤
│    │ TransactionTableToolbar         │
│ S  │ (Search, Filters, Export)      │
│ i  ├────────────────────────────────┤
│ d  │                                │
│ e  │ AG-Grid Transaction Table      │
│ b  │ (with inline editing)          │
│ a  │                                │
│ r  │                                │
└────┴────────────────────────────────┘
```

### Reconciliation

**File:** `src/pages/ReconciliationView.tsx`

**Layout:**
```
┌──────────────────────────────────────────┐
│ TopBar                                   │
├────┬──────────┬──────────┬───────────────┤
│    │ Trans    │ Preview  │ Receipts      │
│ S  │ List     │ (Match)  │ List          │
│ i  │          │          │               │
│ d  │ (Search) │          │ (Upload)      │
│ e  │ (Filter) │ Drag &   │ (Grid/List)   │
│ b  │          │ Drop     │               │
│ a  │          │          │               │
│ r  │          │          │               │
└────┴──────────┴──────────┴───────────────┘
```

**Resizable panels** with drag-and-drop matching.

### Chat

**File:** `src/pages/ChatView.tsx`

**Layout:**
```
┌─────────────────────────────────────┐
│ TopBar                              │
├────┬────────────────────────────────┤
│    │ ChatModeToggle                 │
│ S  │ (Financial Chat / CopilotKit)  │
│ i  ├────────────────────────────────┤
│ d  │                                │
│ e  │ FinancialChatPanel             │
│ b  │ (Messages + Citations)         │
│ a  │                                │
│ r  │                                │
└────┴────────────────────────────────┘
```

---

## Theme Configuration

### Complete Theme File

**File:** `src/theme/index.ts`

```typescript
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { previaColors } from './colors'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const previaTheme = extendTheme({
  config,
  colors: {
    previa: previaColors,
    // Semantic mappings
    brand: {
      50: '#F9F4EB',
      100: '#F2E9D8',
      200: '#E8D9C0',
      300: '#DEC9A8',
      400: '#D4B990',
      500: '#403B31',
      600: '#332F27',
      700: '#26231D',
      800: '#1A1713',
      900: '#0D0B09',
    },
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'JetBrains Mono, "SF Mono", Monaco, "Cascadia Code", monospace',
  },
  styles: {
    global: {
      body: {
        bg: 'previa.cream',
        color: 'previa.charcoal',
        fontFamily: 'body',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
        minH: '44px',  // Accessibility
        minW: '44px',
      },
      variants: {
        solid: {
          bg: 'previa.charcoal',
          color: 'white',
          _hover: { bg: 'previa.darkStone' },
        },
        outline: {
          borderColor: 'previa.stone',
          color: 'previa.charcoal',
          _hover: { bg: 'previa.sand' },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderColor: 'previa.sand',
          borderWidth: '1px',
          borderRadius: 'lg',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderColor: 'previa.stone',
          _focus: {
            borderColor: 'previa.sand',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-sand)',
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          py: 2,
          borderRadius: 'md',
          borderColor: 'previa.sand',
          bg: 'white',
          boxShadow: 'lg',
        },
        item: {
          py: 2,
          px: 4,
          _hover: { bg: 'previa.cream' },
          _focus: { bg: 'previa.cream' },
        },
        groupTitle: {
          px: 4,
          py: 2,
          fontSize: 'sm',
          fontWeight: 'semibold',
          color: 'previa.darkStone',
        },
        divider: {
          my: 2,
          borderColor: 'previa.sand',
        },
      },
    },
  },
})
```

---

## Quick Reference Checklist

### Before Creating Any Component

- [ ] Check this design system for existing patterns
- [ ] Use Chakra UI components from `src/components/chakra-ui/`
- [ ] Apply Previa color tokens (`previa.*`)
- [ ] Ensure 44x44px minimum touch targets
- [ ] Add proper hover states
- [ ] Add proper focus indicators
- [ ] Test keyboard navigation
- [ ] Use mono font for financial amounts
- [ ] Apply proper spacing (4px base unit)

### Before Creating Any Page

- [ ] Use DashboardLayout wrapper
- [ ] Include TopBar and Sidebar
- [ ] Follow responsive breakpoints
- [ ] Add proper loading states (skeletons)
- [ ] Add empty states with emojis
- [ ] Test mobile view

### Before Deploying

- [ ] Run accessibility audit
- [ ] Test all touch targets (mobile)
- [ ] Verify all colors meet WCAG AA
- [ ] Test keyboard navigation
- [ ] Check screen reader compatibility

---

## Maintenance

### Updating This Document

This document should be updated whenever:
- New components are created
- Design patterns change
- Color palette is modified
- Spacing scale changes
- Accessibility requirements evolve

### Related Documentation

- `docs/frontend-spec-new.md.v2-backup` - Original v2 specification
- `src/theme/index.ts` - Chakra UI theme configuration
- `src/theme/colors.ts` - Color palette definition
- `CLAUDE.md` - Development guidelines

---

**Last Updated:** 2025-10-27
**Maintained By:** Development Team
**Questions?** Check component source files or ask in Discord
