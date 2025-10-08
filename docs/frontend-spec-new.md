# Previa Frontend Specification (shadcn/ui + MCP)

**Version:** 2.0  
**Date:** 2025-01-08  
**Scope:** Complete UI/UX specification for Previa financial intelligence platform using shadcn/ui components with Previa design system.

---

## 1) Design System

### 1.1 Color Palette

**Previa Brand Colors:**
```typescript
// tailwind.config.ts
const colors = {
  previa: {
    cream: '#F2E9D8',      // Primary background, light surfaces
    stone: '#8C877D',      // Secondary text, borders
    sand: '#D9C8B4',       // Accent elements, hover states
    charcoal: '#403B31',   // Primary text, headings
    darkStone: '#595347',  // Secondary headings, icons
  }
}
```

**Semantic Color Mapping:**
- **Background:** `cream` (#F2E9D8)
- **Primary Text:** `charcoal` (#403B31)
- **Secondary Text:** `stone` (#8C877D)
- **Accent/Interactive:** `sand` (#D9C8B4)
- **Emphasis:** `darkStone` (#595347)

**Status Colors:**
- **Success/Approved:** Green (#10B981)
- **Warning/Matched:** Amber (#F59E0B)
- **Error/Rejected:** Red (#EF4444)
- **Processing:** Blue (#3B82F6)

### 1.2 Typography

**Font Families:**
- **Headings:** Inter (Bold/Semibold)
- **Body:** Inter (Regular/Medium)
- **Numbers/Amounts:** JetBrains Mono (for financial data clarity)

**Scale:**
```css
h1: 2.5rem / 600
h2: 2rem / 600
h3: 1.5rem / 600
h4: 1.25rem / 600
body: 1rem / 400
small: 0.875rem / 400
```

### 1.3 Component Library

**Base:** shadcn/ui with custom Previa theme overrides

**Component Generation via shadcn MCP:**
All components will be generated using shadcn MCP with consistent Previa design tokens applied automatically.

---

## 2) Screen Specifications

### 2.1 Onboarding Flow (7 Screens)

#### Screen 1: Welcome & Value Proposition

**Layout:**
- Full-screen hero section
- Previa logo (centered, top)
- Value proposition headline: "Save 5+ hours/week on financial admin"
- 3 key benefits (icons + text):
  - 🤖 AI-powered reconciliation
  - 📊 Clear financial insights
  - 🎯 Tax-ready bookkeeping
- CTA: Large "Get Started" button (cream background, charcoal text, sand hover)

**Components:**
- Custom Hero component (shadcn Card base)
- shadcn Button for CTA

---

#### Screen 2: Sign Up / Sign In

**Layout:**
- Split screen (optional): Left = value props, Right = auth form
- Auth form (centered):
  - Email input
  - Password input
  - "Create Account" button
  - Divider with "or"
  - "Sign in with magic link" option
  - "Already have an account?" toggle

**Components:**
- shadcn Form + Input components
- shadcn Button variants
- Supabase Auth integration

**Validation:**
- Email format validation
- Password strength indicator (min 8 chars)
- Error messages inline (red text, sand outline on error)

---

#### Screen 3: Upload First Bank Statement

**Layout:**
- Progress indicator (Step 1 of 5)
- Instruction: "Upload your first bank statement"
- Large drag/drop zone (dashed sand border, cream background)
- Or file picker button
- Accepted formats display: "PDF or CSV (max 50MB)"
- Visual: Upload cloud icon (large, charcoal color)

**Components:**
- shadcn custom Dropzone component
- shadcn Progress (at top)
- File validation logic

**States:**
- Default: Dashed border, upload icon
- Drag over: Solid sand border, highlighted background
- Uploading: Progress bar inside dropzone
- Error: Red border, error message below

---

#### Screen 4: AI Processing & Extraction

**Layout:**
- Loading state with animated progress
- "Extracting your account details..."
- Processing animation (pulsing Previa logo or spinner)
- Status text: "Found 1 account, 47 transactions" (updates in real-time)

**Components:**
- shadcn Progress (indeterminate or percentage)
- Custom loading animation
- Real-time status updates via polling

---

#### Screen 5: Confirm Bank Account Details

**Layout:**
- "Confirm your account details" heading
- Extracted data in shadcn Card:
  - Institution name (editable)
  - Account name (editable)
  - Last 4 digits (editable, masked format)
  - Opening balance (editable, number format)
- Confidence indicator: "High confidence" (green badge)
- Edit icon next to each field
- CTAs: "Looks good!" (primary) / "Edit details" (secondary)

**Components:**
- shadcn Card for data display
- shadcn Input components (inline edit mode)
- shadcn Badge for confidence
- shadcn Button group

**Validation:**
- Institution required (dropdown or autocomplete)
- Account name required
- Last 4 digits (numeric, exactly 4)

---

#### Screen 6: Transaction Preview

**Layout:**
- "We found 47 transactions for Aug 2024 - Sep 2024"
- shadcn Table showing first 10 transactions
- Columns: Date | Description | Amount
- Amounts right-aligned, JetBrains Mono font
- "View all transactions" link at bottom
- CTA: "Continue to Dashboard"

**Components:**
- shadcn Table (compact variant)
- shadcn ScrollArea (if > 10 rows)
- shadcn Button for CTA

---

#### Screen 7: Onboarding Complete

**Layout:**
- Success state with confetti animation (optional)
- "You're all set!" heading
- First gamification badge: "🏆 First Upload" (large, centered)
- Summary: "1 bank account connected, 47 transactions ready for reconciliation"
- CTA: "Go to Dashboard" (large, primary button)

**Components:**
- Custom success animation
- shadcn Badge (large variant for achievement)
- shadcn Button

---

### 2.2 Main Dashboard Layout

#### Layout Structure

**Desktop (>1024px):**
- Persistent sidebar (left, 240px width)
- Main content area (right, fluid)
- Top bar with user menu + notifications

**Tablet (768px - 1024px):**
- Collapsible sidebar (icons only, expands on hover)
- Main content area (fluid)

**Mobile (<768px):**
- Bottom navigation bar
- Hamburger menu for additional options
- Full-screen main content

---

#### Sidebar Navigation (shadcn Sheet/Sidebar)

**Components:**
- Previa logo (top)
- Nav items (icon + label):
  1. 🏠 Home
  2. 🔄 Reconciliation
  3. 📊 Transactions
  4. 💬 Chat
  5. ⚙️ Settings
- User menu (bottom):
  - Avatar (or initials)
  - Email
  - Tier badge (`user` or `premium_user`)
  - Sign out

**States:**
- Active nav item: Sand background, charcoal text, left border (darkStone)
- Hover: Cream background
- Inactive: Transparent background, stone text

---

### 2.3 View 1: Home / Overview Dashboard

**Layout:**
- Grid of widgets (2x2 on desktop, stacked on mobile)
- Widget types:
  1. **Monthly Spending** (top-left)
  2. **Income vs Expenses** (top-right)
  3. **Unreconciled Items** (bottom-left)
  4. **Recent Transactions** (bottom-right)

#### Widget 1: Monthly Spending

**Components:**
- shadcn Card
- Line chart (chart.js or recharts)
- Period selector (shadcn Select): This Month / Last 3 Months / Year

**Data:**
- X-axis: Days/weeks
- Y-axis: AUD amount
- Line color: darkStone
- Hover: Show exact amount + date

---

#### Widget 2: Income vs Expenses

**Components:**
- shadcn Card
- Bar chart (grouped bars)
- Legend (Income: green, Expenses: red)

**Data:**
- Current month vs previous month comparison
- Amounts in JetBrains Mono font

---

#### Widget 3: Unreconciled Items Alert

**Components:**
- shadcn Card with Alert styling
- Icon: Warning triangle (amber)
- Count: "23 transactions need reconciliation"
- CTA: "Review Now" button (small, sand background)

---

#### Widget 4: Recent Transactions

**Components:**
- shadcn Card
- Mini table (5 rows max)
- Columns: Date | Description | Amount
- "View all" link at bottom

---

### 2.4 View 2: Reconciliation Engine

**Layout:**
- Split layout (shadcn ResizablePanelGroup)
- **Left Panel (40%):** Unmatched transactions
- **Right Panel (40%):** Receipts library
- **Center Panel (20%, appears on match):** Matching preview

#### Left Panel: Unmatched Transactions

**Components:**
- shadcn ScrollArea
- Transaction cards (shadcn Card):
  - Date (top-left)
  - Description (main text)
  - Amount (top-right, JetBrains Mono)
  - Category badge (if auto-categorized)
  - "Match" button

**Filters:**
- Date range (shadcn Popover + Calendar)
- Amount range (dual slider)
- Category (shadcn Select)

---

#### Right Panel: Receipts Library

**Components:**
- Grid/List toggle (shadcn Tabs)
- Receipt cards (shadcn Card):
  - Thumbnail (if image)
  - Merchant name
  - Date
  - Amount
  - Confidence badge (High/Medium/Low)
  - "Match" button

**Upload:**
- Floating "+" button (bottom-right)
- Opens upload dialog

---

#### Matching Interface (Center Panel or Modal)

**Flow:**
1. User clicks "Match" on transaction OR drags receipt onto transaction
2. Preview appears (shadcn Dialog or inline panel):
   - **Left:** Transaction details
   - **Right:** Receipt details
   - **Center:** Confidence score (shadcn Progress circle)
   - AI explanation: "Matched by date (exact) and amount (±$0.50)"
3. Actions:
   - ✅ Approve Match (green button)
   - ❌ Reject Match (red button, ghost)
   - ✏️ Edit Details (opens form)

**Components:**
- shadcn Dialog (for modal variant)
- shadcn Progress (circular, 0-100%)
- shadcn Button group

**Success State:**
- Green checkmark animation
- Card moves to "Matched" section
- Toast notification: "Match approved!"

---

**Inspiration:**
- Monarch Money: Confidence indicators, clean card layouts
- Expensify: Approval workflow, side-by-side comparison

---

### 2.5 View 3: Transaction Table

**Layout:**
- Full-width shadcn Data Table
- Toolbar (top):
  - Search (shadcn Input)
  - Filters (shadcn Popover):
    - Date range (Calendar)
    - Status (Checkbox group)
    - Category (Multi-select)
  - Batch actions (shadcn DropdownMenu): "Categorize selected", "Export"
  - View options (density, columns)

**Columns:**
1. Checkbox (select)
2. Date (sortable)
3. Description (searchable)
4. Amount (sortable, right-aligned, JetBrains Mono)
5. Category (filterable, badge)
6. Status (filterable, color-coded badge):
   - Unreconciled (red)
   - Matched (yellow)
   - Approved (green)
   - Rejected (gray)
7. Actions (shadcn DropdownMenu):
   - View details
   - Edit
   - Reconcile
   - Delete

**Features:**
- Column sorting (asc/desc)
- Column resizing
- Column visibility toggle
- Pagination (shadcn Pagination)
- Rows per page: 10 / 25 / 50 / 100

**Empty State:**
- "No transactions yet" with upload prompt

---

### 2.6 View 4: AI Chat Assistant

**Layout:**
- Chat interface (full height)
- Message list (shadcn ScrollArea):
  - User messages (right-aligned, sand background, charcoal text)
  - AI responses (left-aligned, cream background, charcoal text)
  - Citations (shadcn HoverCard on hover, shows source transaction/receipt)
  - Timestamps (small, stone color)
- Input area (bottom):
  - shadcn Textarea (auto-resize)
  - Send button (or Ctrl+Enter)
  - Character counter (if limit)

**Starter Prompts (when empty):**
- "What did I spend on groceries this month?"
- "Show me duplicate transactions"
- "Categorize my Uber transactions"
- "What's my biggest expense category?"

**Components:**
- Custom chat message components
- shadcn ScrollArea (auto-scroll to bottom)
- shadcn Textarea
- shadcn Button (send)
- shadcn HoverCard (citations)

**Message Types:**
- Text (with markdown support)
- Table (for transaction lists)
- Chart (for insights)
- Citations (linked to source data)

**States:**
- Typing indicator (AI is responding)
- Error state (retry button)
- Loading state (skeleton messages)

---

### 2.7 Upload Hub

**Layout:**
- Large drag/drop area (top, 60% of viewport)
- File list below (shadcn Table)

**Drag/Drop Area:**
- Dashed sand border
- Upload icon (cloud, large)
- "Drag & drop files here"
- "or browse files" (button)
- Accepted formats: PDF, CSV, PNG, JPG (< 50MB)

**File List:**
- Columns:
  - File name
  - Type (icon)
  - Size
  - Status (badge):
    - Uploading (blue, with %)
    - Processing (yellow, pulsing)
    - Completed (green, checkmark)
    - Failed (red, X)
  - Actions (retry, delete)

**Components:**
- Custom Dropzone
- shadcn Table
- shadcn Progress (per-file)
- shadcn Button (retry, delete)

**Batch Upload:**
- Show total progress bar (top)
- "X of Y files completed"

---

### 2.8 Document Library

**Layout:**
- Toggle: Grid view / List view (shadcn Tabs)
- Filters (left sidebar or top bar):
  - Type (Statements / Receipts)
  - Status (All / Pending / Completed / Failed)
  - Date range (Calendar)
- Sort: Date uploaded (desc) / File name / Status

#### Grid View:
- Cards (shadcn Card):
  - File type icon (PDF, CSV, etc.)
  - File name (truncated)
  - Upload date (relative: "2 days ago")
  - Status badge
  - Actions menu (shadcn DropdownMenu):
    - View
    - Reprocess
    - Download
    - Delete

#### List View:
- shadcn Table:
  - Columns: Name | Type | Upload Date | Status | Size | Actions

**Empty State:**
- "No documents yet"
- CTA: "Upload your first document"

---

## 3) Component Inventory (shadcn/ui)

| Component | Primary Usage | Previa Customization |
|-----------|---------------|----------------------|
| **Button** | CTAs, actions | Cream default, sand hover, charcoal text, rounded-lg |
| **Card** | Widgets, containers | Cream background, subtle shadow, charcoal text |
| **Input** | Forms, search | Sand focus ring, charcoal text, cream background |
| **Table** | Transactions, files | Zebra striping (cream/white rows), charcoal text |
| **Dialog** | Modals, confirmations | Cream background, charcoal overlay |
| **Popover** | Filters, tooltips | Cream background, subtle shadow |
| **Progress** | Upload, processing | Sand fill color, cream track |
| **Badge** | Status, tags | Color-coded (green/yellow/red/blue), rounded-full |
| **Tabs** | View switching | Underline active with sand, stone inactive |
| **Sheet** | Mobile sidebar | Slide-in from left, cream background |
| **ScrollArea** | Long lists, chat | Custom scrollbar (stone thumb, cream track) |
| **Calendar** | Date filters | Sand highlights, charcoal text |
| **HoverCard** | Citations, details | Cream background, appears on hover |
| **Form** | All input forms | Validation with error states (red), success (green) |
| **Textarea** | Chat, notes | Auto-resize, sand focus ring |
| **Select** | Dropdowns | Sand accent, charcoal text |
| **Checkbox** | Multi-select | Sand checked, charcoal border |
| **Separator** | Dividers | Stone color, subtle |
| **Skeleton** | Loading states | Cream background, stone shimmer |
| **Toast** | Notifications | Contextual colors, bottom-right position |

---

## 4) Responsive Design Strategy

### Breakpoints

```css
mobile: < 768px
tablet: 768px - 1024px
desktop: > 1024px
```

### Mobile-First Adjustments

**Onboarding:**
- Full-screen steps
- Single-column layout
- Larger touch targets (min 44px)

**Dashboard:**
- Vertical widget stack
- Single-column grid
- Bottom navigation bar (5 items max)

**Reconciliation:**
- Tabs instead of split panels: "Transactions" | "Receipts" | "Matched"
- Full-screen matching modal
- Swipe gestures (future)

**Transaction Table:**
- Horizontal scroll for table
- Or card view as alternative
- Collapsible filters

**Chat:**
- Full-screen chat view
- Back button to dashboard
- Floating input bar (bottom)

**Upload Hub:**
- Full-screen dropzone
- File list below (vertical scroll)

---

## 5) Accessibility (WCAG AA)

**Keyboard Navigation:**
- All interactive elements focusable (tab order logical)
- Esc closes dialogs/modals
- Enter/Space activates buttons
- Arrow keys navigate lists/tables

**Focus Indicators:**
- Visible focus ring (sand color, 2px outline)
- Never `outline: none` without alternative

**ARIA Labels:**
- All form inputs have labels
- Icon buttons have aria-label
- Dynamic content uses aria-live regions
- Status changes announced to screen readers

**Color Contrast:**
- All text meets AA contrast ratios:
  - Charcoal (#403B31) on Cream (#F2E9D8): 7.2:1 ✅
  - DarkStone (#595347) on Cream: 5.1:1 ✅
  - Stone (#8C877D) on Cream: 3.2:1 ⚠️ (use for secondary only)

**Screen Reader Support:**
- Semantic HTML (headings, landmarks, lists)
- Alt text for images/icons
- Table headers properly associated
- Form validation messages linked to inputs

---

## 6) shadcn MCP Usage Examples

### Example 1: Transaction Card Component

**Prompt:**
```
Create a transaction card component using shadcn Card with Previa color scheme. 
Background: cream (#F2E9D8), text: charcoal (#403B31). 
Include: date (top-left, small), description (center, truncated), amount (top-right, JetBrains Mono font, bold), status badge (bottom-left, color-coded). 
Make it clickable with hover effect (sand border, subtle shadow).
```

---

### Example 2: File Upload Dropzone

**Prompt:**
```
Build a file upload dropzone with drag/drop using shadcn custom component. 
Dashed sand (#D9C8B4) border, cream (#F2E9D8) background. 
On drag over: solid sand border, slightly darker cream background. 
Show upload progress with shadcn Progress (sand fill). 
Accept PDF and CSV only, max 50MB. Display error messages below in red.
```

---

### Example 3: Filterable Transaction Table

**Prompt:**
```
Generate a filterable transaction table using shadcn Data Table. 
Columns: date (sortable), description (searchable), amount (sortable, right-aligned, JetBrains Mono), category (filterable badge), status (filterable, color-coded badge), actions menu. 
Include toolbar with search input, date range filter (shadcn Calendar in Popover), status checkboxes, and export button. 
Use Previa colors: cream background, charcoal text, sand accents. 
Pagination with 10/25/50 rows per page options.
```

---

### Example 4: Chat Interface

**Prompt:**
```
Create a chat interface with shadcn components. 
Message list in ScrollArea with auto-scroll to bottom. 
User messages: right-aligned, sand (#D9C8B4) background, charcoal (#403B31) text, rounded corners. 
AI messages: left-aligned, cream (#F2E9D8) background, charcoal text. 
Citations as HoverCard showing source data. 
Input area: Textarea (auto-resize) with send button. 
Include starter prompts as clickable chips when empty.
```

---

## 7) Animation & Micro-interactions

**Button Interactions:**
- Hover: Scale 1.02, transition 150ms ease
- Active: Scale 0.98
- Disabled: Opacity 0.5, cursor not-allowed

**Card Interactions:**
- Hover (clickable cards): Subtle shadow elevation, border color change to sand
- Transition: 200ms ease-out

**File Upload:**
- Drag over: Highlight animation (pulsing sand border)
- Upload progress: Smooth progress bar animation
- Success: Green checkmark fade-in with scale animation

**Match Success:**
- Checkmark icon: Scale from 0 to 1.2 to 1, with slight bounce
- Card: Slide out to "Matched" section with 300ms ease

**Processing Indicators:**
- Pulsing animation for processing badges
- Spinner (Previa logo or circular) for longer operations
- Skeleton loaders for content loading (shimmer effect)

**Navigation Transitions:**
- View changes: Smooth fade (200ms)
- Sidebar toggle: Slide animation (250ms ease-in-out)

**Toast Notifications:**
- Slide in from bottom-right
- Auto-dismiss after 4s (with progress bar)
- Swipe to dismiss

---

## 8) Reference Implementations

### Monarch Money Patterns to Adopt:

1. **Transaction Confidence Indicators:**
   - Visual confidence score (percentage or bar)
   - Color-coded: Green (high), Yellow (medium), Red (low)
   - Explanatory text on hover

2. **Category Color Coding:**
   - Consistent colors per category
   - Visual legend/key
   - Color-coded charts and badges

3. **Clean Table Layouts:**
   - Zebra striping for readability
   - Right-aligned numbers
   - Monospace font for amounts
   - Sticky headers on scroll

---

### Expensify Patterns to Adopt:

1. **Receipt Scanning UX:**
   - Clear capture area
   - Real-time extraction feedback
   - Confidence indicators for OCR fields
   - Manual correction workflow

2. **Approval Workflows:**
   - Side-by-side comparison view
   - Bulk approve/reject actions
   - Comments/notes per item
   - Audit trail visibility

3. **Mobile Camera Integration (Future):**
   - In-app camera for receipt capture
   - Auto-crop and enhance
   - Immediate upload and processing

---

### PocketSmith Patterns to Adopt:

1. **Multi-Account Dashboard:**
   - Account switcher/filter
   - Aggregated vs individual views
   - Visual account grouping

2. **Calendar-Based Transaction Views (Future):**
   - Month view with spending per day
   - Drag transactions to recategorize
   - Forecast overlay

3. **Forecast Widgets (Future):**
   - Projected balance charts
   - Scenario modeling
   - Cash flow predictions

---

## 9) Implementation Priorities

### Phase 1: MVP Core (Epics 1-3)
- ✅ Authentication screens
- ✅ Onboarding flow (7 screens)
- ✅ Upload hub
- ✅ Basic dashboard (home view only)
- ✅ Transaction table (basic filtering)

### Phase 2: Reconciliation Engine (Epic 4)
- ✅ Reconciliation view (split layout)
- ✅ Matching interface
- ✅ Confidence indicators

### Phase 3: Enhanced Dashboard (Epic 5)
- ✅ Multi-view dashboard
- ✅ Chat assistant
- ✅ Widgets with charts
- ✅ Gamification elements

### Phase 4: Polish & Advanced (Epic 6+)
- ✅ Data export
- ✅ Advanced analytics
- ✅ Mobile optimizations
- ✅ Accessibility audit

---

## 10) Design Handoff Checklist

**For UX Expert → Dev Handoff:**

- [ ] All screen layouts documented
- [ ] Component specifications complete
- [ ] Previa design tokens configured in Tailwind
- [ ] shadcn/ui components customized
- [ ] shadcn MCP prompts tested and validated
- [ ] Responsive breakpoints defined
- [ ] Accessibility requirements specified
- [ ] Animation specifications documented
- [ ] Reference patterns identified from Monarch/Expensify/PocketSmith
- [ ] Asset files provided (logo SVG, icons)

---

**End of Frontend Specification**

---

## 11) Acceptance Criteria (Linked to PRD)

### Onboarding Flow (FR8)
- [ ] User can complete 5–7 onboarding steps without errors (Welcome → Auth → Upload → Extract → Confirm → Preview → Complete).
- [ ] Upload step enforces PDF/CSV and ≤ 50MB with clear inline errors.
- [ ] Extraction step shows progress; if processing fails, user can retry or skip with explanation.
- [ ] Confirmation step allows editing institution, account name, last 4 digits; validations enforced.
- [ ] Completion grants first badge and routes to dashboard.

### Uploads (FR1–FR2)
- [ ] Drag/drop and file picker both work; validation prior to upload (type/size).
- [ ] Per-file status transitions: uploading → processing → completed/failed visible in UI.
- [ ] Retry action available on failed items; disabled while in-flight.
- [ ] Multiple websites and copied text flows create sources and invoke processing successfully.

### OCR/AI Extraction & Matching (FR3–FR4)
- [ ] Document processing results populate content/summary for sources.
- [ ] Reconciliation view displays unmatched transactions and receipt library.
- [ ] Matching UI shows confidence and explanation; approve/reject updates state.
- [ ] Manual corrections persist and reflect in views.

### Dashboard Review/Approve (FR5)
- [ ] Home widgets render with real data and responsive charts.
- [ ] Transaction table supports search, filters, sorting, pagination.
- [ ] Approve/reject actions available from reconciliation and transaction detail routes.

### Data Export (FR7)
- [ ] Export button (placeholder) present with disabled state until backend ready.

### Non-Functional (NFR1–NFR4)
- [ ] All new screens meet responsive breakpoints and WCAG AA basics.
- [ ] Error states are accessible (aria-live), actionable, and consistent.
- [ ] Upload/processing and chat show retry/backoff UX for 5xx/429.

---

## 12) Component Cross-Reference (by Screen)

| Screen/View | Primary Components | Secondary Components |
|---|---|---|
| Welcome | Card, Button | Logo, Typography |
| Auth | Form, Input, Button | Divider, Toast |
| Upload (Onboarding) | Dropzone, Progress, Button | Badge, Toast |
| Extraction | Progress, Skeleton | Toast |
| Confirm Account | Card, Input, Badge, Button | Inline Edit Controls |
| Transaction Preview | Table, ScrollArea, Button | Link |
| Onboarding Complete | Badge, Button | Animation |
| Home Dashboard | Card, Chart, Select | Grid, Badge |
| Reconciliation | ResizablePanelGroup, Card, Tabs | Dialog, Progress |
| Transaction Table | Data Table, Popover, Calendar, DropdownMenu, Pagination | Input, Checkbox |
| Chat Assistant | ScrollArea, Textarea, Button, HoverCard | Toast |
| Upload Hub | Dropzone, Table, Progress | Button, Toast |
| Document Library | Tabs, Card, Table, DropdownMenu | Calendar |

Notes:
- All components are shadcn/ui with Previa theme overrides.
- Use shared types for Edge contract payloads to avoid drift.

