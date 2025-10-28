# Previa Version Changelog

**Current Version:** 0.1.0-MVP
**Last Updated:** October 28, 2025
**Repository:** [GitLab URL]

---

## Table of Contents

1. [Current Version](#current-version-010-mvp)
2. [Version History](#version-history)
3. [Feature Additions](#feature-additions)
4. [Bug Fixes](#bug-fixes)
5. [Breaking Changes](#breaking-changes)
6. [Upcoming Features](#upcoming-features)
7. [Migration Guides](#migration-guides)

---

## Current Version: 0.1.0-MVP

**Release Date:** October 28, 2025
**Status:** In Development (80% Complete)
**Target Launch:** November 15, 2025

### Overview

First MVP release of Previa - AI-driven financial intelligence platform. Delivers core reconciliation, OCR processing, and gamification features with 24/30 stories complete.

### What's Included

✅ **Epic 1: Foundation & Infrastructure (100%)**
- React 18 + TypeScript + Vite environment
- Chakra UI 2.10.9 design system
- Supabase backend (Auth, Postgres, Storage, Edge Functions)
- User tier system (Free/Premium)
- Staff role system
- Mock data seeding
- 545 test cases

✅ **Epic 2: Onboarding (100%)**
- 7-step onboarding flow
- Email/password + Google OAuth authentication
- Bank statement upload (PDF/CSV)
- AI OCR processing
- Account confirmation
- Transaction preview

✅ **Epic 3: Upload & Processing (100%)**
- Universal upload hub
- Receipt OCR (Gemini/GPT-4o)
- Status tracking system
- 80+ Australian merchant patterns
- Auto-categorization

✅ **Epic 4: Reconciliation (50%)**
- Transaction & receipt library views
- AI matching algorithm (OpenAI GPT-4o-mini)
- Manual reconciliation
- 🔄 Interactive matching interface (in progress)

✅ **Epic 5: Dashboard & Gamification (83%)**
- Dashboard layout & navigation
- Home view widgets (balance, income, expenses)
- Charts (spending trends, category breakdown)
- Transaction table (AG-Grid)
- 🔄 AI chat assistant (partial)
- Gamification (18 badges, 12 challenges, 50+ tips)

### What's Not Included (Post-MVP)

⏳ **Epic 6: Data Export** - Q1 2026
- CSV/JSON export
- Xero/QuickBooks format compatibility

⏳ **Epic 7: Mobile App** - Q1 2026
- React Native iOS/Android app
- Native camera integration
- Push notifications

⏳ **Epic 8: Open Banking** - Q2 2026
- CDR (Consumer Data Right) integration
- Automatic transaction import

### Known Issues

- **Minor:** "View All" points history link returns 404
- **Medium:** Manual match UI needs clarification (Story 4.3 addresses)
- **Low:** Dashboard chart loading state flickers

### Performance Metrics

- **Bundle Size:** 520KB (target: <400KB for v1.0)
- **Dashboard Load:** P95 500ms (target: <300ms)
- **OCR Processing:** Average 1.2s per receipt
- **Test Coverage:** 85% code coverage (545 tests)

### Database Schema

**17 Migrations Applied:**
- Core financial tables (accounts, statements, transactions, receipts)
- Gamification tables (badges, challenges, tips)
- RLS policies (35+ policies)
- Indexes (20+ indexes)
- AI match suggestions table

**Edge Functions Deployed:** 17 functions

---

## Version History

### Version 0.1.0-MVP (October 28, 2025) - CURRENT

**Status:** In Development (80% complete)

**Added:**
- Initial MVP implementation
- Core financial reconciliation features
- AI-powered OCR and matching
- Gamification system (Australian context)
- Setup wizard and onboarding flow

**Changed:**
- N/A (first version)

**Fixed:**
- N/A (first version)

**Removed:**
- N/A (first version)

---

### Version 0.2.0-MVP (November 15, 2025) - PLANNED

**Target Release:** November 15, 2025

**Will Add:**
- ✅ Interactive matching interface (Story 4.3)
- ✅ Reconciliation engine view enhancement (Story 5.3)
- ✅ Gamification polish (Story 5.6)
- ✅ Reconciliation → Gamification integration

**Will Fix:**
- "View All" points history link 404
- Manual match UI confusion
- Mobile keyboard overlap on input fields

**Will Improve:**
- Bundle size reduction (520KB → 350KB via code splitting)
- Dashboard load time (500ms → 300ms P95)
- Chart loading states (smoother transitions)

---

### Version 1.0.0 (January 15, 2026) - PLANNED

**Target Release:** January 15, 2026 (Public Launch)

**Will Add:**
- ✅ All MVP stories complete (30/30)
- ✅ Match status management (Story 4.4)
- ✅ AI chat assistant (Story 5.5)
- ✅ Data export (CSV/JSON) (Story 6.1)
- ✅ Beta testing complete (500 users)
- ✅ Performance optimized
- ✅ E2E tests expanded

**Will Fix:**
- All known issues from v0.2.0

**Marketing:**
- Public launch announcement
- Content marketing campaign
- Reddit/Whirlpool outreach
- Google Ads

---

### Version 1.1.0 (March 1, 2026) - PLANNED

**Target Release:** March 1, 2026

**Will Add:**
- ✅ Mobile app (React Native, iOS + Android)
- ✅ Bulk receipt upload
- ✅ Advanced analytics dashboard
- ✅ Push notifications (mobile)
- ✅ Biometric auth (mobile)
- ✅ Offline mode (mobile)

**Will Improve:**
- Mobile user experience
- Receipt processing speed (1.2s → 0.8s)

---

### Version 1.2.0 (June 1, 2026) - PLANNED

**Target Release:** June 1, 2026

**Will Add:**
- ✅ Open Banking (CDR) integration
- ✅ Direct Xero API integration
- ✅ Direct QuickBooks API integration
- ✅ Automatic transaction import
- ✅ Real-time balance updates

**Will Change:**
- Manual upload becomes optional (CDR primary)

---

### Version 2.0.0 (October 1, 2026) - PLANNED

**Target Release:** October 1, 2026

**Will Add:**
- ✅ Accountant portal
- ✅ API access for third-party integrations
- ✅ Advanced AI (recurring detection, anomaly detection)
- ✅ Multi-user accounts (household members)
- ✅ White-label solution (banks/fintechs)

**Will Change:**
- Tier structure (add Business tier: $29.99/month)

---

## Feature Additions

### By Epic

**Epic 1: Foundation & Infrastructure**
- [x] React 18 + TypeScript + Vite (v0.1.0)
- [x] Chakra UI 2.10.9 design system (v0.1.0)
- [x] Supabase backend (v0.1.0)
- [x] User tier system (v0.1.0)
- [x] Staff role system (v0.1.0)
- [x] Mock data seeding (v0.1.0)
- [x] Testing infrastructure (v0.1.0)

**Epic 2: Onboarding**
- [x] Welcome screen (v0.1.0)
- [x] Authentication (email/password, Google OAuth) (v0.1.0)
- [x] Bank statement upload (v0.1.0)
- [x] AI OCR processing (v0.1.0)
- [x] Account confirmation (v0.1.0)
- [x] Transaction preview (v0.1.0)

**Epic 3: Upload & Processing**
- [x] Universal upload hub (v0.1.0)
- [x] Receipt OCR (Gemini/GPT-4o) (v0.1.0)
- [x] Status tracking system (v0.1.0)
- [x] Australian merchant patterns (80+) (v0.1.0)
- [x] Auto-categorization (v0.1.0)

**Epic 4: Reconciliation**
- [x] Transaction library (AG-Grid) (v0.1.0)
- [x] Receipt library (grid/list views) (v0.1.0)
- [x] AI matching algorithm (OpenAI GPT-4o-mini) (v0.1.0)
- [x] Manual reconciliation (drag-and-drop) (v0.1.0)
- [ ] Interactive matching interface (v0.2.0 - Nov 15)
- [ ] Match status management (v1.0.0 - Jan 15)

**Epic 5: Dashboard & Gamification**
- [x] Dashboard layout & navigation (v0.1.0)
- [x] Financial overview cards (v0.1.0)
- [x] Charts (Recharts) (v0.1.0)
- [x] Transaction table (AG-Grid) (v0.1.0)
- [x] Gamification (18 badges, 12 challenges) (v0.1.0)
- [ ] Reconciliation engine view enhancement (v0.2.0)
- [ ] AI chat assistant (v1.0.0)

**Epic 6: Data Export**
- [ ] CSV export (v1.0.0)
- [ ] JSON export (v1.0.0)
- [ ] Xero format (v1.2.0)
- [ ] QuickBooks format (v1.2.0)

**Epic 7: Mobile App**
- [ ] React Native setup (v1.1.0)
- [ ] Native camera integration (v1.1.0)
- [ ] Push notifications (v1.1.0)
- [ ] Biometric auth (v1.1.0)
- [ ] Offline mode (v1.1.0)

**Epic 8: Open Banking**
- [ ] CDR accreditation (v1.2.0)
- [ ] Bank account linking (v1.2.0)
- [ ] Automatic transaction import (v1.2.0)
- [ ] Real-time balance updates (v1.2.0)

---

## Bug Fixes

### Version 0.1.0-MVP

**Fixed in Development:**
- Fixed: Receipts page 404 error (navigation issue) - Oct 20, 2025
- Fixed: Setup wizard modal not dismissible - Oct 18, 2025
- Fixed: Dashboard chart loading state - Oct 15, 2025
- Fixed: Upload progress bar stuck at 99% - Oct 12, 2025
- Fixed: Transaction table pagination reset on filter - Oct 10, 2025

**Known Issues (To Be Fixed in v0.2.0):**
- Minor: "View All" points history link 404
- Medium: Manual match UI confusion
- Low: Mobile keyboard overlap on input fields

---

### Version 0.2.0-MVP (Planned - November 15, 2025)

**Will Fix:**
- "View All" points history link 404 (create points history page)
- Manual match UI confusion (Story 4.3 redesign)
- Mobile keyboard overlap (adjust viewport meta tag)
- Chart loading flicker (add skeleton loaders)
- Toast notifications stacking (limit to 3 visible)

---

### Version 1.0.0 (Planned - January 15, 2026)

**Will Fix:**
- All remaining minor/low priority bugs from v0.2.0
- Performance issues with 500+ transactions
- Bundle size optimization (code splitting)
- Safari-specific CSS issues

---

## Breaking Changes

### Version 0.1.0-MVP → 0.2.0-MVP

**None** (backward compatible)

---

### Version 0.2.0-MVP → 1.0.0

**None** (backward compatible)

---

### Version 1.0.0 → 1.2.0

**Breaking Change: Manual Upload Optional**

When Open Banking (CDR) is enabled, manual upload becomes optional for most users. Existing manual workflows remain supported.

**Migration:**
- Existing users: No action required
- New users: Encouraged to use CDR (manual upload available as fallback)

---

### Version 1.2.0 → 2.0.0

**Breaking Change: Tier Structure**

New Business tier ($29.99/month) added. Free tier limits adjusted.

**Old Limits:**
- Free: 3 accounts, 50 transactions/month
- Premium: Unlimited

**New Limits:**
- Free: 2 accounts, 30 transactions/month (reduced)
- Premium: 5 accounts, unlimited transactions
- Business: Unlimited accounts, unlimited transactions, accountant portal

**Migration:**
- Existing Free users: Grandfathered (keep 3 accounts, 50 transactions)
- Existing Premium users: No change (upgraded to 5 accounts)
- New users: New limits apply

---

## Upcoming Features

### Short-Term (Q4 2025 - Q1 2026)

**November 2025 (v0.2.0):**
- Interactive matching interface (side-by-side comparison)
- Reconciliation engine view enhancement
- Gamification polish
- Reconciliation → Gamification integration

**January 2026 (v1.0.0):**
- Match status management (bulk actions)
- AI chat assistant (Copilot Kit)
- Data export (CSV/JSON)

**March 2026 (v1.1.0):**
- Mobile app (React Native)
- Bulk receipt upload
- Advanced analytics dashboard

---

### Medium-Term (Q2 2026)

**June 2026 (v1.2.0):**
- Open Banking (CDR) integration
- Direct Xero API integration
- Direct QuickBooks API integration
- Advanced analytics (budget forecasting, tax estimation)

---

### Long-Term (Q3 2026+)

**October 2026 (v2.0.0):**
- Accountant portal
- API access for third-party integrations
- Advanced AI (recurring detection, anomaly detection)
- Multi-user accounts (household members)

**Q4 2026+:**
- White-label solution (banks/fintechs)
- Predictive budgeting
- Fraud detection
- International expansion (NZ, UK)

---

## Migration Guides

### Upgrading from v0.1.0 to v0.2.0

**No breaking changes.** Update is seamless.

**Steps:**
1. User visits Previa (auto-updates via Vercel)
2. No action required
3. New features available immediately

---

### Upgrading from v0.2.0 to v1.0.0

**No breaking changes.** Update is seamless.

**New Features to Explore:**
- Data export: Click "Export" in sidebar
- AI chat assistant: Click "Chat" in sidebar
- Match status management: Bulk approve/reject buttons

---

### Upgrading from v1.0.0 to v1.1.0

**Mobile app installation (optional):**

1. Download from App Store (iOS) or Google Play (Android)
2. Log in with existing Previa credentials
3. Enable push notifications (optional)
4. Enable biometric auth (optional)
5. Data syncs automatically

**Web app remains fully functional** (no forced migration)

---

### Upgrading from v1.1.0 to v1.2.0

**Open Banking migration (optional):**

1. Navigate to Settings → Bank Accounts
2. Click "Connect via Open Banking"
3. Select your bank (Commonwealth, ANZ, Westpac, NAB)
4. Authorize access (OAuth 2.0 via CDR)
5. Transactions import automatically

**Manual upload remains available** (no forced migration)

---

### Upgrading from v1.2.0 to v2.0.0

**Tier limit changes:**

**If you're on Free tier (created before Oct 2026):**
- You're grandfathered: Keep 3 accounts, 50 transactions/month
- No action required

**If you're on Free tier (created after Oct 2026):**
- New limits: 2 accounts, 30 transactions/month
- To keep 3 accounts: Upgrade to Premium ($9.99/month)
- To get unlimited: Upgrade to Business ($29.99/month)

**If you're on Premium tier:**
- Automatically upgraded: 5 accounts (was unlimited)
- No action required
- To get unlimited: Upgrade to Business ($29.99/month)

---

## Release Notes Format

For each version, we provide:

**Added:** New features and capabilities
**Changed:** Changes to existing functionality
**Fixed:** Bug fixes
**Removed:** Deprecated or removed features
**Security:** Security vulnerability fixes
**Performance:** Performance improvements

---

## Deprecation Policy

**Minimum Support:** 6 months notice for breaking changes

**Deprecation Process:**
1. Feature marked as deprecated in current version
2. Warning added to UI and logs
3. Feature removed in next major version (6 months later)

**Example:**
- v1.0.0 (Jan 2026): Feature X marked deprecated
- v1.1.0 (Mar 2026): Warning displayed when using Feature X
- v1.2.0 (Jun 2026): Feature X still works (6-month grace period)
- v2.0.0 (Oct 2026): Feature X removed

---

## Versioning Scheme

We follow **Semantic Versioning (SemVer):**

**Format:** MAJOR.MINOR.PATCH

- **MAJOR:** Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR:** New features (backward compatible) (e.g., 1.0.0 → 1.1.0)
- **PATCH:** Bug fixes (backward compatible) (e.g., 1.0.0 → 1.0.1)

**Pre-release:** `-MVP`, `-beta`, `-rc` suffix (e.g., 0.1.0-MVP)

---

## Stay Updated

**Subscribe to Updates:**
- Email newsletter (Settings → Notifications → Product Updates)
- RSS feed (coming Q1 2026)
- Twitter: @PreviaAI (coming Q1 2026)
- Discord announcements (coming Q1 2026)

**Changelog:**
- This document (docs/pitch_deck/VERSION-CHANGELOG.md)
- In-app notification (new version available)
- Release notes (GitHub Releases)

---

## Feedback & Bug Reports

**Report Bugs:**
- GitHub Issues: https://github.com/yourusername/previa/issues
- Email: bugs@previa.app

**Request Features:**
- GitHub Issues (feature request template)
- Email: features@previa.app
- Vote on roadmap (coming Q1 2026)

**Provide Feedback:**
- Email: feedback@previa.app
- In-app survey (Settings → Feedback)
- NPS survey (quarterly)

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Maintained By:** Previa Development Team
**For:** FIT3195 Assessment 3 Submission

---

**End of Version Changelog**
