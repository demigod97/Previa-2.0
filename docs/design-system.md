# Previa Design System Documentation

## Overview
The Previa design system implements a warm, professional color palette optimized for financial applications. Built on Tailwind CSS and shadcn/ui, it provides consistent, accessible components with WCAG AA compliance.

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Components](#components)
- [Financial UI Patterns](#financial-ui-patterns)
- [Accessibility](#accessibility)
- [Usage Examples](#usage-examples)

---

## Color Palette

### Brand Colors
The Previa color palette uses warm, earthy tones that evoke trust and stability.

| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| **Cream** | `#F2E9D8` | `37 27% 85%` | Primary background, light surfaces |
| **Stone** | `#8C877D` | `35 7% 52%` | Secondary text, borders |
| **Sand** | `#D9C8B4` | `37 24% 77%` | Accent elements, hover states |
| **Charcoal** | `#403B31` | `30 12% 23%` | Primary text, headings |
| **Dark Stone** | `#595347` | `30 13% 30%` | Secondary headings, icons |

### Semantic Color Mapping
```typescript
// Background & Surfaces
background: cream (#F2E9D8)
card: cream (#F2E9D8)
popover: cream (#F2E9D8)

// Text Colors
foreground: charcoal (#403B31)
primary: darkStone (#595347)
secondary: stone (#8C877D)

// Interactive Elements
accent: sand (#D9C8B4)
border: stone (#8C877D)
ring: sand (#D9C8B4) // focus indicators
```

### Financial Status Colors
Used for transaction states and alerts:

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| **Success** | Green | `#10B981` | Approved transactions, positive actions |
| **Warning** | Amber | `#F59E0B` | Matched transactions, needs attention |
| **Error** | Red | `#EF4444` | Rejected transactions, errors |
| **Processing** | Blue | `#3B82F6` | In-progress operations |

### Tailwind Usage
```tsx
// Brand colors
className="bg-previa-cream text-previa-charcoal"
className="border-previa-stone hover:bg-previa-sand"

// Financial status
className="text-success"
className="bg-warning/10 text-warning border-warning/20"
```

---

## Typography

### Fonts
- **Headings & Body:** Inter (from Google Fonts)
- **Financial Numbers:** JetBrains Mono (monospace for precise alignment)

### Font Scale
| Element | Size | Weight | CSS Class | Usage |
|---------|------|--------|-----------|-------|
| **H1** | 2.5rem (40px) | 600 | `text-4xl font-semibold` | Page titles |
| **H2** | 2rem (32px) | 600 | `text-3xl font-semibold` | Section headers |
| **H3** | 1.5rem (24px) | 600 | `text-2xl font-semibold` | Subsection headers |
| **H4** | 1.25rem (20px) | 600 | `text-xl font-semibold` | Card titles |
| **Body** | 1rem (16px) | 400 | `text-base` | Regular text |
| **Small** | 0.875rem (14px) | 400 | `text-sm` | Helper text, captions |

### Typography Classes
```tsx
// Headings (automatic styling)
<h1>Page Title</h1>
<h2>Section Header</h2>

// Body text utilities
<p className="body-text">Regular paragraph text</p>
<span className="small-text">Helper text or caption</span>

// Financial amounts
<span className="financial-amount">$1,234.56</span>
<span className="font-financial">-$45.00</span>
```

### Font Families in Tailwind
```tsx
className="font-sans"      // Inter for body text
className="font-heading"   // Inter for headings
className="font-financial" // JetBrains Mono for numbers
className="font-mono"      // JetBrains Mono alias
```

---

## Components

### Button States
```tsx
// Primary button (default)
<Button>Save Changes</Button>
// Uses: bg-primary (darkStone), text on cream

// Secondary button
<Button variant="secondary">Cancel</Button>
// Uses: stone background, subtle appearance

// Destructive button
<Button variant="destructive">Delete</Button>
// Uses: error red for dangerous actions

// With hover states
<Button className="hover:bg-previa-sand">
  Interactive
</Button>
```

### Card Component
```tsx
// Standard card with Previa styling
<Card className="bg-previa-cream border-previa-stone">
  <CardHeader>
    <CardTitle className="text-previa-charcoal">
      Transaction Details
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-previa-stone">Content here</p>
  </CardContent>
</Card>
```

### Form Inputs
```tsx
// Text input with Previa focus
<Input 
  className="border-previa-stone focus:ring-previa-sand"
  placeholder="Enter amount"
/>

// Focus indicator automatically uses sand color
// via --ring CSS variable
```

### Tables for Financial Data
```tsx
<table className="financial-table">
  <tbody>
    <tr>
      <td>Transaction 1</td>
      <td className="amount">$1,234.56</td>
    </tr>
    <tr>
      <td>Transaction 2</td>
      <td className="amount">-$89.00</td>
    </tr>
  </tbody>
</table>

// Features:
// - Zebra striping (cream background)
// - Hover states (sand highlight)
// - Right-aligned amounts in JetBrains Mono
// - Tabular numbers for alignment
```

---

## Financial UI Patterns

### Transaction Status Badges
```tsx
// Approved transaction
<Badge className="status-approved">Approved</Badge>

// Matched transaction
<Badge className="status-matched">Matched</Badge>

// Rejected transaction
<Badge className="status-rejected">Rejected</Badge>

// Processing transaction
<Badge className="status-processing">Processing</Badge>

// Custom badge styling:
// - 10% opacity background
// - Full color text
// - 20% opacity border
```

### Reconciliation Confidence Indicators
```tsx
// High confidence (90%+)
<Progress value={95} className="confidence-high" />
<span className="confidence-high">95%</span>

// Medium confidence (70-89%)
<Progress value={80} className="confidence-medium" />
<span className="confidence-medium">80%</span>

// Low confidence (<70%)
<Progress value={65} className="confidence-low" />
<span className="confidence-low">65%</span>
```

### Currency Amount Display
```tsx
// Standard amount display
<span className="financial-amount">$1,234.56</span>

// Negative amount (often with color)
<span className="financial-amount text-error">-$45.00</span>

// Large amount in table cell
<td className="amount">$123,456.78</td>

// Features:
// - JetBrains Mono font
// - Tabular numbers (consistent digit width)
// - Right-aligned in tables
```

### File Upload Zone
```tsx
// Standard upload zone
<div className="upload-zone">
  <p>Drop files here or click to upload</p>
</div>

// Active state (during drag)
<div className="upload-zone active">
  <p>Release to upload</p>
</div>

// Features:
// - Dashed sand border
// - Cream background
// - Hover effect with sand tint
// - Active state with darker sand
```

### Gamification Badges
```tsx
// Reward badge
<span className="badge-reward">
  🏆 Goal Achieved
</span>

// Milestone badge
<span className="badge-milestone">
  ⭐ 100 Transactions
</span>

// Features:
// - Rounded full appearance
// - Success/warning color coding
// - Icon support
// - Compact inline display
```

---

## Accessibility

### Color Contrast Ratios
All color combinations meet WCAG AA standards (4.5:1 minimum).

| Combination | Ratio | Status |
|-------------|-------|--------|
| Charcoal on Cream | 7.2:1 | ✅ AAA |
| Dark Stone on Cream | 5.1:1 | ✅ AA |
| Stone on Cream | 3.2:1 | ⚠️ Large text only |

**Note:** Stone (#8C877D) should only be used for large text (18pt+) or secondary information, not for primary body text.

### Focus Indicators
All interactive elements have visible focus indicators:
```css
/* Automatic focus ring (sand color) */
focus:ring-2 focus:ring-previa-sand focus:ring-offset-2
```

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order follows visual layout
- Focus indicators are always visible (never hidden)
- Skip links available for main content navigation

### Screen Reader Support
- Semantic HTML elements used throughout
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for icon-only buttons
- Status announcements for dynamic content
- Alternative text for all images

### Testing Recommendations
1. Test with keyboard-only navigation
2. Verify focus indicators in all states
3. Use screen reader (NVDA, JAWS, or VoiceOver)
4. Check color contrast with automated tools
5. Validate with axe DevTools or similar

---

## Usage Examples

### Complete Transaction Card
```tsx
<Card className="bg-previa-cream border-previa-stone">
  <CardHeader>
    <CardTitle className="text-previa-charcoal">
      Recent Transaction
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-previa-charcoal">
          Coffee Shop
        </p>
        <p className="small-text">Jan 10, 2025</p>
      </div>
      <div className="text-right">
        <p className="financial-amount text-error">-$4.50</p>
        <Badge className="status-approved">Approved</Badge>
      </div>
    </div>
    <div className="pt-4 border-t border-previa-stone">
      <div className="flex items-center gap-2">
        <span className="text-sm text-previa-stone">
          Confidence:
        </span>
        <Progress value={95} className="flex-1" />
        <span className="confidence-high font-medium">95%</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### Financial Summary Widget
```tsx
<Card className="bg-previa-cream border-previa-stone">
  <CardHeader>
    <CardTitle>Monthly Summary</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-previa-stone">Income</span>
        <span className="financial-amount text-success">
          $5,234.00
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-previa-stone">Expenses</span>
        <span className="financial-amount text-error">
          -$3,456.78
        </span>
      </div>
      <div className="pt-3 border-t border-previa-stone">
        <div className="flex justify-between font-semibold">
          <span className="text-previa-charcoal">Net</span>
          <span className="financial-amount text-success">
            $1,777.22
          </span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

### Transaction Table
```tsx
<table className="financial-table w-full">
  <thead>
    <tr className="border-b border-previa-stone">
      <th className="text-left p-3 text-previa-charcoal">
        Description
      </th>
      <th className="text-left p-3 text-previa-charcoal">
        Date
      </th>
      <th className="text-left p-3 text-previa-charcoal">
        Status
      </th>
      <th className="text-right p-3 text-previa-charcoal">
        Amount
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="p-3">Grocery Store</td>
      <td className="p-3 text-previa-stone">Jan 10</td>
      <td className="p-3">
        <Badge className="status-approved">Approved</Badge>
      </td>
      <td className="amount p-3">-$123.45</td>
    </tr>
    <tr>
      <td className="p-3">Paycheck</td>
      <td className="p-3 text-previa-stone">Jan 9</td>
      <td className="p-3">
        <Badge className="status-processing">Processing</Badge>
      </td>
      <td className="amount p-3 text-success">$2,500.00</td>
    </tr>
  </tbody>
</table>
```

### Upload Interface
```tsx
<div className="space-y-4">
  <h3 className="text-previa-charcoal font-semibold">
    Upload Bank Statement
  </h3>
  
  <div className="upload-zone p-8 text-center">
    <div className="space-y-2">
      <p className="text-previa-charcoal font-medium">
        Drop PDF files here
      </p>
      <p className="small-text">
        or click to browse
      </p>
    </div>
  </div>

  <div className="space-y-2">
    <div className="flex items-center gap-3">
      <Progress value={75} className="flex-1" />
      <span className="text-sm text-previa-stone">75%</span>
    </div>
    <p className="small-text">Processing statement.pdf</p>
  </div>
</div>
```

---

## Design Tokens Reference

### CSS Custom Properties
All design tokens are available as CSS custom properties:

```css
/* Colors (HSL values) */
--background: 37 27% 85%;         /* cream */
--foreground: 30 12% 23%;         /* charcoal */
--primary: 30 13% 30%;            /* darkStone */
--secondary: 35 7% 52%;           /* stone */
--accent: 37 24% 77%;             /* sand */

/* Financial Status */
--success: 152 69% 35%;           /* green */
--warning: 38 92% 50%;            /* amber */
--error: 0 72% 51%;               /* red */
--processing: 217 91% 60%;        /* blue */

/* Other */
--radius: 0.5rem;                 /* border radius */
```

### Direct Hex Colors
When CSS variables aren't suitable:

```typescript
export const previaColors = {
  cream: '#F2E9D8',
  stone: '#8C877D',
  sand: '#D9C8B4',
  charcoal: '#403B31',
  darkStone: '#595347',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  processing: '#3B82F6',
};
```

---

## Best Practices

### Do's ✅
- Use `financial-amount` class for all currency displays
- Apply status badges for transaction states
- Use semantic HTML (`<h1>`, `<p>`, `<table>`)
- Leverage Tailwind utilities for spacing and layout
- Test keyboard navigation for all interactions
- Maintain 4.5:1 minimum contrast ratio
- Use `font-financial` for all numerical data

### Don'ts ❌
- Don't use stone color for small body text (contrast)
- Don't skip heading levels (h1 → h3)
- Don't hide focus indicators
- Don't convey information with color alone
- Don't mix font families arbitrarily
- Don't hard-code colors (use design tokens)
- Don't forget to test with screen readers

### Performance
- Fonts are loaded with `font-display: swap` for fast rendering
- CSS is optimized and minified in production
- Tailwind purges unused classes automatically
- Design tokens are compile-time constants

---

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 10, 2025 | Initial design system implementation |

---

## Support
For questions or issues with the design system:
- Review this documentation
- Check component examples above
- Consult shadcn/ui documentation for base components
- Refer to Tailwind CSS documentation for utilities
