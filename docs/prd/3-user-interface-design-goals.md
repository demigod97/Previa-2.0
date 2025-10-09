# 3. User Interface Design Goals

## Overall UX Vision
The user experience should be simple, intuitive, and trustworthy. The app should feel more like a personal financial assistant than a complex accounting tool, reducing the stress associated with financial management. It must be accessible to users with a wide range of financial literacy levels.

## Key Interaction Paradigms
* **Effortless Onboarding**: The user's first experience must be seamless, guiding them through the manual data upload process with clear and simple instructions.
* **AI as a Partner**: The AI's role should be to make suggestions and automate tasks, not to act as a black box. Users should always feel in control, with the ability to review and approve all AI actions.
* **Gamified Feedback Loops**: User interactions will be reinforced with gamified elements, such as progress bars, points, and rewards, to promote positive financial habits.
* **Contextual Help**: Help and guidance should be available at the moment of need, without disrupting the user's workflow.

## Core Screens and Views
The MVP includes 12 primary screens organized into 4 main flows:

**Onboarding Flow (5-7 screens):**
1. Welcome & Value Proposition
2. Account Creation (Supabase Auth)
3. Upload First Bank Statement
4. AI Extraction & Account Setup
5. Transaction Preview
6. Onboarding Complete (gamification intro)

**Main Dashboard (Multi-View):**
7. Home/Overview - Widgets showing spending, income, categories, trends
8. Reconciliation Engine - Side-by-side transaction/receipt matching interface
9. Transaction Table - Filterable, sortable list with batch actions
10. AI Chat Assistant - Financial guidance with citations

**Document Management:**
11. Upload Hub - Drag/drop for statements/receipts with status tracking
12. Document Library - All uploaded sources with processing status

Each screen will be built with shadcn/ui components following the Previa design system.

## Accessibility
* **Accessibility**: I am assuming a baseline of WCAG AA accessibility compliance to ensure the app is usable by a broad audience.

## Branding & Visual Identity

**Color Palette:**
Previa uses a warm, trustworthy color scheme designed to make financial management feel approachable:

| Color Name | Hex | Usage |
|------------|-----|-------|
| Cream | #F2E9D8 | Primary background, light surfaces |
| Stone Gray | #8C877D | Secondary text, borders |
| Sand | #D9C8B4 | Accent elements, hover states |
| Charcoal | #403B31 | Primary text, headings |
| Dark Stone | #595347 | Secondary headings, icons |

**Logo:**
The Previa logo (fingerprint design) represents the unique financial journey of each user. See `Asset 1L1.svg` for implementation.

**Design Influences:**
- **Monarch Money:** Clean transaction tables, confidence indicators, category visualization
- **Expensify:** Receipt scanning UX, approval workflows
- **PocketSmith:** Multi-account dashboards, calendar-based views

**Target Device and Platforms**
* **Target Platforms**: The product will be a Web Responsive application for desktop users and a dedicated mobile app for Android and iOS devices.

