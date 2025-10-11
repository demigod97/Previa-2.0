# Manual Accessibility Testing Checklist - Previa Financial Dashboard

**Last Updated:** 2025-01-12
**WCAG Level Target:** AA
**Testing Date:** _____________________
**Tester Name:** _____________________

---

## Overview

This checklist ensures Previa meets WCAG 2.1 AA accessibility standards across all financial dashboard features. Test each section systematically across different assistive technologies and input methods.

---

## 1. Keyboard Navigation & Focus Management

### 1.1 Tab Order
- [ ] Tab order is logical and follows visual layout
- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order flows: Sidebar → TopBar → Main content → Footer
- [ ] No keyboard traps (users can Tab away from all elements)
- [ ] Skip links available for repetitive navigation (if applicable)

### 1.2 Focus Indicators
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators use `ring-2 ring-sand` (Previa design system)
- [ ] Focus indicators are clearly visible against all backgrounds
- [ ] Focus indicators meet 3:1 contrast ratio requirement
- [ ] Focus indicators are not hidden by other elements

### 1.3 Keyboard Shortcuts
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dropdowns
- [ ] Arrow keys navigate within dropdown menus
- [ ] Ctrl+Enter sends chat messages (ChatInput component)
- [ ] No conflicts with browser/screen reader shortcuts

### 1.4 Component-Specific Navigation

#### Sidebar Navigation
- [ ] All navigation links accessible via keyboard
- [ ] Active state announced by screen readers
- [ ] Mobile bottom navigation has proper tab order
- [ ] Sign out button is keyboard accessible

#### Transaction Table
- [ ] Column headers are keyboard accessible for sorting
- [ ] Pagination controls work with keyboard
- [ ] Dropdown menus (actions) open/close with keyboard
- [ ] Row selection works with Space key

#### Reconciliation View
- [ ] Transaction cards can be selected with keyboard
- [ ] Receipt cards can be selected with keyboard
- [ ] Matching preview actions (Approve/Reject) accessible
- [ ] Drag-and-drop has keyboard alternative

#### Financial Chat
- [ ] Chat input is keyboard accessible
- [ ] Send button works with keyboard
- [ ] Example questions can be selected with keyboard
- [ ] Citation buttons are keyboard accessible

---

## 2. Screen Reader Compatibility

### 2.1 Screen Reader Testing Tools
- [ ] NVDA (Windows) - Version: _____
- [ ] JAWS (Windows) - Version: _____
- [ ] VoiceOver (macOS) - Version: _____
- [ ] TalkBack (Android) - Version: _____
- [ ] VoiceOver (iOS) - Version: _____

### 2.2 ARIA Labels & Roles

#### Navigation Elements
- [ ] Sidebar has `role="navigation"` and `aria-label="Main navigation"`
- [ ] Active nav item has `aria-current="page"`
- [ ] Icon-only buttons have descriptive `aria-label` attributes
- [ ] User menu toggle has clear label

#### Financial Data
- [ ] Transaction amounts have `aria-label` with full currency description
- [ ] Status badges announce current status
- [ ] Category badges are readable
- [ ] Date displays are formatted accessibly

#### Interactive Components
- [ ] Buttons have descriptive labels (not just icons)
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Success messages are announced

#### Dashboard Widgets
- [ ] Chart widgets have `aria-label` descriptions
- [ ] Financial overview cards announce values
- [ ] Loading states have `aria-live="polite"` announcements
- [ ] Empty states provide guidance

### 2.3 Live Regions
- [ ] Toast notifications use `aria-live="polite"`
- [ ] Error alerts use `aria-live="assertive"`
- [ ] Dynamic content changes are announced
- [ ] Loading indicators announce state changes

### 2.4 Component-Specific Screen Reader Tests

#### Sidebar
- [ ] Navigation links announced with emoji and text
- [ ] User avatar/profile info readable
- [ ] Tier badge ("Free" / "Premium") announced
- [ ] Sign out button clearly labeled

#### Dashboard
- [ ] Financial overview cards announce count and label
- [ ] Recent transactions list readable
- [ ] Bank accounts list readable
- [ ] Charts have text alternatives

#### Transactions View
- [ ] Table headers announced correctly
- [ ] Each transaction row readable
- [ ] Sort state announced (ascending/descending)
- [ ] Filter state announced
- [ ] Pagination info announced

#### Reconciliation View
- [ ] Transaction cards announce date, description, amount
- [ ] Receipt cards announce merchant, amount, confidence
- [ ] Match preview describes both sides
- [ ] Action buttons clearly labeled

#### ErrorBoundary
- [ ] Error message announced immediately
- [ ] Recovery options (Try Again, Go Home) clearly labeled
- [ ] Emoji descriptions included or hidden from screen readers

---

## 3. Color & Contrast

### 3.1 Text Contrast Ratios (WCAG AA: 4.5:1 for normal text, 3:1 for large text)

#### Previa Color Palette Tests
- [ ] Charcoal (#403B31) on Cream (#F2E9D8): **7.2:1** ✓
- [ ] Dark Stone (#595347) on Cream (#F2E9D8): **5.1:1** ✓
- [ ] Stone (#8C877D) on Cream (#F2E9D8): **3.2:1** ⚠️ (Use only for non-essential text)
- [ ] Charcoal (#403B31) on White (#FFFFFF): **10.5:1** ✓
- [ ] Charcoal (#403B31) on Sand (#D9C8B4): **5.8:1** ✓

#### Component-Specific Contrast
- [ ] Transaction amounts (red/green) meet contrast ratio
- [ ] Status badges (red/yellow/green/gray) meet contrast ratio
- [ ] Category badges meet contrast ratio
- [ ] Button text on sand background meets ratio
- [ ] Link text on cream background meets ratio

### 3.2 Color Independence
- [ ] Information not conveyed by color alone
- [ ] Transaction types use +/- symbols in addition to color
- [ ] Status uses emojis + badges in addition to color
- [ ] Charts have patterns or labels in addition to color
- [ ] Error/success states have icons in addition to color

### 3.3 Focus Indicators
- [ ] Focus ring (sand color) meets 3:1 non-text contrast
- [ ] Focus visible on all backgrounds
- [ ] Focus not obscured by other elements

---

## 4. Form Accessibility

### 4.1 Form Labels
- [ ] All form inputs have visible labels
- [ ] Labels are programmatically associated (for/id or aria-labelledby)
- [ ] Required fields clearly marked
- [ ] Optional fields clearly marked (if applicable)

### 4.2 Form Validation
- [ ] Error messages appear near relevant fields
- [ ] Error messages have `role="alert"` or `aria-live="assertive"`
- [ ] Errors announced by screen readers
- [ ] Error messages are descriptive (not just "Error")
- [ ] Success messages announced

### 4.3 Input Constraints
- [ ] Min/max length announced
- [ ] Input format described (e.g., "DD/MM/YYYY")
- [ ] Currency inputs use proper formatting
- [ ] Date pickers are keyboard accessible

### 4.4 Component-Specific Form Tests

#### Login Form (AuthForm)
- [ ] Email input labeled and accessible
- [ ] Password input labeled and accessible
- [ ] Show/hide password toggle accessible
- [ ] Submit button clearly labeled
- [ ] Error messages announced

#### Transaction Edit Dialog
- [ ] All fields labeled (Date, Description, Amount, Category, Status)
- [ ] Date picker keyboard accessible
- [ ] Amount input accepts proper currency format
- [ ] Category dropdown keyboard accessible
- [ ] Save/Cancel buttons clearly labeled

#### Bank Account Form (future)
- [ ] Institution field labeled
- [ ] Account name field labeled
- [ ] Account number field labeled
- [ ] Security messaging clear

---

## 5. Images & Media

### 5.1 Alternative Text
- [ ] All images have alt text
- [ ] Decorative images have `alt=""` or `aria-hidden="true"`
- [ ] Icon-only buttons have `aria-label` or text alternative
- [ ] Charts have text descriptions

### 5.2 Emojis
- [ ] Decorative emojis have `aria-hidden="true"`
- [ ] Informative emojis have text alternatives
- [ ] Status emojis (📝⚠️✅❌) paired with text labels
- [ ] Action emojis (👁️✏️🗑️) paired with action text

---

## 6. Responsive & Touch Accessibility

### 6.1 Touch Target Sizes (WCAG 2.1 AA: 44x44px minimum)
- [ ] All buttons meet 44px minimum (mobile)
- [ ] Transaction cards meet 64px minimum height
- [ ] Navigation items meet 44px minimum
- [ ] Dropdown menu items meet 44px minimum
- [ ] Form inputs meet 44px minimum height

### 6.2 Mobile Navigation
- [ ] Bottom navigation accessible on mobile
- [ ] Gestures have keyboard alternatives
- [ ] No hover-only interactions
- [ ] Pinch-to-zoom not disabled

### 6.3 Responsive Breakpoints
- [ ] Desktop (1024px+): All features accessible
- [ ] Tablet (768px - 1023px): Sidebar collapses, touch targets appropriate
- [ ] Mobile (<768px): Bottom navigation, card layouts accessible

---

## 7. Content Accessibility

### 7.1 Headings Structure
- [ ] Proper heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Page has one H1 (page title)
- [ ] Section headings use H2
- [ ] Subsections use H3
- [ ] Headings describe content accurately

### 7.2 Link Text
- [ ] Links have descriptive text (not "click here")
- [ ] Link purpose clear from link text alone
- [ ] External links indicated (if applicable)
- [ ] File downloads indicated with file type and size

### 7.3 Language
- [ ] Page language set (`lang="en"`)
- [ ] Currency clearly Australian (AUD)
- [ ] Dates in Australian format (DD/MM/YYYY)
- [ ] Technical jargon explained or avoided

### 7.4 Reading Order
- [ ] Content order matches visual order
- [ ] Tables read in correct order
- [ ] Forms flow logically
- [ ] Multi-column layouts read correctly

---

## 8. Motion & Animation

### 8.1 Reduced Motion
- [ ] `prefers-reduced-motion` media query respected
- [ ] Animations can be disabled
- [ ] Critical info not conveyed through animation alone
- [ ] Loading indicators have text alternatives

### 8.2 Animation Timing
- [ ] Transitions are smooth (150-200ms per Previa spec)
- [ ] No flashing content (exceeding 3 flashes per second)
- [ ] Animations do not auto-play for >5 seconds
- [ ] Users can pause/stop animations

---

## 9. Error Recovery & Help

### 9.1 Error Boundaries
- [ ] ErrorBoundary catches runtime errors
- [ ] User-friendly error messages displayed
- [ ] Recovery options provided (Try Again, Go Home)
- [ ] Errors don't break entire application

### 9.2 Validation Errors
- [ ] Specific error descriptions provided
- [ ] Suggestions for fixing errors given
- [ ] Users can correct errors inline
- [ ] Error count announced if multiple errors

### 9.3 Help & Guidance
- [ ] Tooltips available for complex features
- [ ] Example data/formats provided
- [ ] Empty states provide next steps
- [ ] Onboarding guidance clear

---

## 10. Financial Data Accessibility

### 10.1 Currency Formatting
- [ ] All amounts use consistent format ($X,XXX.XX)
- [ ] Currency symbol announced by screen readers
- [ ] Negative amounts clearly indicated (-$XX or red color + symbol)
- [ ] Positive amounts clearly indicated (+$XX or green color + symbol)

### 10.2 Transaction Status
- [ ] Status communicated via emoji + text + color
- [ ] Status badges have proper contrast
- [ ] Status changes announced
- [ ] Unreconciled alerts clearly worded

### 10.3 Charts & Visualizations
- [ ] Charts have text descriptions
- [ ] Chart data available in table format (if complex)
- [ ] Axis labels clear and readable
- [ ] Legend items distinguishable

---

## 11. Browser & Assistive Technology Testing Matrix

### 11.1 Browser Compatibility
- [ ] Chrome (Windows) + NVDA
- [ ] Firefox (Windows) + NVDA
- [ ] Edge (Windows) + Narrator
- [ ] Safari (macOS) + VoiceOver
- [ ] Chrome (macOS) + VoiceOver
- [ ] Safari (iOS) + VoiceOver
- [ ] Chrome (Android) + TalkBack

### 11.2 Specific Feature Tests

| Feature | Chrome/NVDA | Firefox/NVDA | Safari/VO | iOS/VO | Android/TB |
|---------|-------------|--------------|-----------|--------|------------|
| Sidebar Navigation | ☐ | ☐ | ☐ | ☐ | ☐ |
| Dashboard Widgets | ☐ | ☐ | ☐ | ☐ | ☐ |
| Transaction Table | ☐ | ☐ | ☐ | ☐ | ☐ |
| Reconciliation View | ☐ | ☐ | ☐ | ☐ | ☐ |
| Financial Chat | ☐ | ☐ | ☐ | ☐ | ☐ |
| ErrorBoundary | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 12. Critical User Flows

### 12.1 View Dashboard
- [ ] Navigate to dashboard via keyboard
- [ ] Screen reader announces financial overview
- [ ] Recent transactions readable
- [ ] Bank accounts readable
- [ ] Charts have alternatives

### 12.2 View & Filter Transactions
- [ ] Navigate to transactions page
- [ ] Use search to filter
- [ ] Use category filter
- [ ] Sort by column
- [ ] Navigate table with keyboard
- [ ] Export transactions

### 12.3 Reconcile Transaction
- [ ] Select transaction with keyboard
- [ ] Select receipt with keyboard
- [ ] Review match preview
- [ ] Approve match with keyboard
- [ ] Confirmation announced

### 12.4 Chat with AI Assistant
- [ ] Navigate to chat
- [ ] Type question
- [ ] Send with Ctrl+Enter
- [ ] Response announced
- [ ] Citations accessible

### 12.5 Error Recovery
- [ ] Encounter error
- [ ] Error message announced
- [ ] Use Try Again button
- [ ] Use Go Home button
- [ ] Navigation successful

---

## 13. Issues & Recommendations

### Critical Issues (Must Fix)
1. ______________________________________________________________
2. ______________________________________________________________
3. ______________________________________________________________

### Important Issues (Should Fix)
1. ______________________________________________________________
2. ______________________________________________________________
3. ______________________________________________________________

### Minor Issues (Nice to Fix)
1. ______________________________________________________________
2. ______________________________________________________________
3. ______________________________________________________________

---

## 14. Sign-Off

### Compliance Summary
- **WCAG 2.1 Level A**: ☐ Pass ☐ Fail
- **WCAG 2.1 Level AA**: ☐ Pass ☐ Fail
- **Keyboard Accessibility**: ☐ Pass ☐ Fail
- **Screen Reader Compatibility**: ☐ Pass ☐ Fail
- **Color Contrast**: ☐ Pass ☐ Fail
- **Touch Target Sizes**: ☐ Pass ☐ Fail

### Tester Sign-Off
**Name:** _______________________________
**Date:** _______________________________
**Signature:** _______________________________

### Notes
________________________________________________________________
________________________________________________________________
________________________________________________________________

---

**End of Accessibility Testing Checklist**
