# Previa Design System Documentation

**Version:** 2.0 (Chakra UI)
**Last Updated:** 2025-10-26
**Purpose:** Define Previa's design system implementation using Chakra UI theming, components, and accessibility standards.

---

## Overview

The Previa design system implements a warm, professional color palette optimized for financial applications. Built on **Chakra UI v2.8.0**, it provides consistent, accessible components with WCAG AA compliance, responsive design utilities, and a comprehensive theming system.

## Table of Contents
- [Color Palette](#color-palette)
- [Chakra UI Theme Configuration](#chakra-ui-theme-configuration)
- [Typography](#typography)
- [Component Patterns](#component-patterns)
- [Financial UI Patterns](#financial-ui-patterns)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Usage Examples](#usage-examples)

---

## Color Palette

### Brand Colors

The Previa color palette uses warm, earthy tones that evoke trust and stability—critical for financial applications.

| Color | Hex | HSL | Chakra Token | Usage |
|-------|-----|-----|--------------|-------|
| **Cream** | `#F2E9D8` | `37 27% 85%` | `previa.cream` | Primary background, light surfaces |
| **Stone** | `#8C877D` | `35 7% 52%` | `previa.stone` | Secondary text, borders |
| **Sand** | `#D9C8B4` | `37 24% 77%` | `previa.sand` | Accent elements, hover states |
| **Charcoal** | `#403B31` | `30 12% 23%` | `previa.charcoal` | Primary text, headings |
| **Dark Stone** | `#595347` | `30 13% 30%` | `previa.darkStone` | Secondary headings, icons |

### Financial Status Colors

Used for transaction states, alerts, and confidence indicators:

| Status | Color | Hex | Chakra Token | Usage |
|--------|-------|-----|--------------|-------|
| **Success** | Green | `#10B981` | `green.500` | Approved transactions, positive actions |
| **Warning** | Amber | `#F59E0B` | `orange.500` | Matched transactions, needs attention |
| **Error** | Red | `#EF4444` | `red.500` | Rejected transactions, errors |
| **Processing** | Blue | `#3B82F6` | `blue.500` | In-progress operations |

---

## Chakra UI Theme Configuration

### Theme Structure

The complete Previa theme is defined in `src/theme/index.ts`. See implementation in Phase 1.3.

---

## Component Patterns

### Button Components

```tsx
import { Button } from '@chakra-ui/react'

// Primary button
<Button bg="previa.charcoal.500" color="white">
  Save Changes
</Button>

// Secondary button
<Button variant="outline" borderColor="previa.stone.500">
  Cancel
</Button>
```

### Card Components

```tsx
import { Card, CardHeader, CardBody } from '@chakra-ui/react'

<Card bg="previa.cream.100" borderColor="previa.stone.300" borderWidth="1px">
  <CardHeader>Transaction Details</CardHeader>
  <CardBody>Content here</CardBody>
</Card>
```

---

## Responsive Design

Chakra UI uses `base`, `sm`, `md`, `lg`, `xl`, `2xl` breakpoints for mobile-first responsive design.

---

## Accessibility

All Previa color combinations meet WCAG AA standards. Chakra UI provides automatic focus management and keyboard navigation.

---

## Best Practices

### Do's ✅
- Use Chakra UI components
- Leverage responsive props
- Apply `fontFamily="mono"` for financial amounts
- Test keyboard navigation

### Don'ts ❌
- Don't bypass Chakra's theming system
- Don't use inline styles
- Don't hide focus indicators

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| **2.0** | Oct 26, 2025 | Complete migration to Chakra UI |
| 1.0 | Jan 10, 2025 | Initial design system (shadcn/ui) |
