# Epic 1.X: User Sign-up & Staff Role System

## Epic Goal
Enable new users to sign up for Previa using verification codes while establishing a staff role system for platform administration, completely separate from the existing user tier system.

## Epic Status
Draft - Ready for Implementation

## Context & Background

**Current State:**
- Authentication: Sign-in only (no sign-up)
- User Tiers: 'user' and 'premium_user' (payment-based)
- No staff/admin role system
- No sign-up code verification

**Desired State:**
- Complete sign-up flow with code verification
- Staff role system: 'team' and 'super_admin' roles
- Admin interface for managing sign-up codes
- Code-gated access to prevent spam signups

## Business Value

### For Users
- **Self-service onboarding**: Users can create accounts without manual approval
- **Secure access**: Verification codes prevent spam and ensure controlled growth
- **Professional UX**: Modern 6-field code entry (like 2FA patterns)

### For Platform
- **Access control**: Manage who can sign up through code distribution
- **Usage tracking**: Monitor code usage and patterns
- **Staff management**: Separate admin roles from user tiers
- **Scalable growth**: Easy to distribute codes to beta testers, early adopters, etc.

## Architecture Decision

### Why Separate staff_roles from user_tiers?

**Rationale:**
1. **Different Concerns:**
   - `user_tiers`: Payment/subscription level (business model)
   - `staff_roles`: Platform administration level (security model)

2. **Independent Lifecycle:**
   - User tier can change based on payment/subscription
   - Staff role is permanent (or requires explicit admin action)

3. **Dual Roles Possible:**
   - A super_admin can also be premium_user
   - Allows testing premium features as admin

4. **Security Isolation:**
   - Staff features never exposed to non-staff users
   - Separate RLS policies, separate UI sections

## Stories

### Story 1.9: Sign-up UI with Code Verification
**Owner**: Frontend Developer  
**Estimate**: 3-4 days  
**Dependencies**: None

**Delivers:**
- Sign-up form with email, password, confirm password
- 6-field verification code input (2FA-style UI)
- Code validation against `signup_codes` table
- Account creation flow with automatic user tier assignment
- Database migration for `signup_codes` table

**Key Components:**
- `SignUpForm.tsx`
- `CodeVerificationInput.tsx`
- `useSignUp.ts` hook
- Migration: `create_signup_codes_table.sql`

---

### Story 1.10: Staff Role System + Database Migrations
**Owner**: Backend Developer  
**Estimate**: 2-3 days  
**Dependencies**: None (can run parallel to 1.9)

**Delivers:**
- `staff_roles` table with 'team' and 'super_admin' roles
- Helper functions: `is_super_admin()`, `is_staff_member()`, `get_user_staff_role()`
- RLS policies for staff tables
- Assignment of super_admin role to demi@coralshades.ai
- TypeScript types and `useStaffRole` hook

**Key Components:**
- Migration: `create_staff_roles_system.sql`
- Migration: `assign_initial_super_admin.sql`
- `useStaffRole.ts` hook
- Security functions and RLS policies

---

### Story 1.11: Sign-up Code Management (Admin Interface)
**Owner**: Full-stack Developer  
**Estimate**: 4-5 days  
**Dependencies**: Stories 1.9 and 1.10 (both must be complete)

**Delivers:**
- Admin interface for CRUD operations on signup codes
- Code generator with uniqueness validation
- Usage tracking and statistics
- Expiry date and usage limit management
- Protected admin routes (super_admin only)

**Key Components:**
- `SignUpCodeManagement.tsx` page
- `SignUpCodeList.tsx`, `SignUpCodeForm.tsx`, `SignUpCodeDetails.tsx`
- `useSignUpCodes.ts` hook with CRUD operations
- `ProtectedAdminRoute.tsx` guard
- Admin navigation section

## Technical Architecture

### Database Schema Overview

```sql
-- User Authentication & Tiers (Existing)
auth.users                    -- Supabase managed
public.profiles               -- User profiles
public.user_tiers             -- Payment tiers: 'user' | 'premium_user'

-- Staff Roles (New - Story 1.10)
public.staff_roles            -- Admin roles: 'team' | 'super_admin'

-- Sign-up Codes (New - Story 1.9)
public.signup_codes           -- Verification codes for sign-up
```

### Key Relationships

```
auth.users
├── profiles (1:1)
├── user_tiers (1:1) ────────── Payment tier
└── staff_roles (0:1) ───────── Admin role (optional)

signup_codes
├── created_by → auth.users
└── used in sign-up flow
```

### Security Model

**RLS Policies:**
```sql
-- signup_codes: Staff can manage, public RPC for verification
staff_roles:   Super admins only (users can see own role)
user_tiers:    Users can see own tier
```

**Helper Functions:**
- `is_super_admin(uuid)`: Check if user is super admin
- `is_staff_member(uuid)`: Check if user is any staff (team or super_admin)
- `verify_signup_code(text)`: Public RPC for sign-up verification

## Implementation Sequence

### Phase 1: Foundation (Parallel - Stories 1.9 & 1.10)
**Week 1:**
1. **Story 1.9**: Frontend team builds sign-up UI + code verification
2. **Story 1.10**: Backend team builds staff role system + migrations

**Deliverables:**
- Working sign-up flow with code verification
- Staff role system fully functional
- Super admin assigned to demi@coralshades.ai

### Phase 2: Admin Interface (Story 1.11)
**Week 2:**
3. **Story 1.11**: Full-stack team builds admin code management UI

**Deliverables:**
- Complete admin interface for code management
- Super admin can create, edit, deactivate codes
- Team members can view codes (read-only)

## Testing Strategy

### Unit Tests
- [ ] Code verification input component behavior
- [ ] Form validation logic
- [ ] Code generator uniqueness
- [ ] Staff role helper functions

### Integration Tests
- [ ] Complete sign-up flow (email → password → code → success)
- [ ] Code validation with valid/invalid/expired codes
- [ ] Staff role assignment and verification
- [ ] Admin CRUD operations with RLS enforcement

### E2E Tests
- [ ] User sign-up journey (happy path)
- [ ] Admin code management workflow
- [ ] Access control (admin vs regular user)

### Security Tests
- [ ] RLS policy enforcement
- [ ] Privilege escalation attempts
- [ ] Code verification bypass attempts

## Acceptance Criteria (Epic Level)

### Must Have
- [ ] Users can sign up with email, password, and verification code
- [ ] Sign-up codes can be created/managed by super admins only
- [ ] demi@coralshades.ai is assigned super_admin role
- [ ] Staff roles are separate from user tiers
- [ ] Regular users cannot see staff features
- [ ] All RLS policies prevent unauthorized access

### Should Have
- [ ] Code generator creates unique codes automatically
- [ ] Usage tracking shows how many times each code was used
- [ ] Expiry dates and usage limits work correctly
- [ ] Admin UI is intuitive and responsive

### Nice to Have (Future)
- [ ] Bulk code generation
- [ ] Detailed usage analytics
- [ ] Code usage history per code
- [ ] Email notifications for code events

## Risks & Mitigations

### Risk 1: Privilege Escalation
**Impact**: High  
**Likelihood**: Low  
**Mitigation**: Comprehensive RLS policies, security audit, penetration testing

### Risk 2: Code Enumeration Attack
**Impact**: Medium  
**Likelihood**: Medium  
**Mitigation**: Rate limiting on verification endpoint, account lockout after failures

### Risk 3: UI Breaks on Browser Compatibility
**Impact**: Low  
**Likelihood**: Low  
**Mitigation**: Cross-browser testing (Chrome, Firefox, Safari, Edge)

## Success Metrics

### User Sign-up
- Sign-up completion rate > 80%
- Average time to complete sign-up < 2 minutes
- Code verification success rate > 95%

### Admin Usage
- Average time to create new code < 30 seconds
- Code deactivation response time < 1 second
- Zero unauthorized access attempts logged

### System Health
- RLS policy blocks 100% of unauthorized attempts
- Sign-up endpoint response time < 500ms (p95)
- Code validation endpoint response time < 200ms (p95)

## Dependencies

### External
- Supabase Cloud database (production)
- Email service for confirmation emails (future)

### Internal
- Existing user_tiers system (must remain functional)
- Existing sign-in flow (must not be affected)
- AuthContext integration

## Future Enhancements

### Phase 2 Features (Post-MVP)
1. **Email Confirmation**: Require email verification after sign-up
2. **Onboarding Wizard**: Epic 2 - Multi-step onboarding flow
3. **Code Analytics Dashboard**: Usage patterns, conversion rates
4. **Bulk Operations**: Import/export codes via CSV
5. **Team Management**: Additional staff roles (support, analyst)
6. **Audit Log**: Track all admin actions

### Integration Opportunities
1. **Stripe Integration**: Link premium tier upgrades to payment
2. **Email Marketing**: Send onboarding emails with code
3. **Referral System**: Generate codes for user referrals
4. **Partner Programs**: Distribute codes to partners

## Documentation

### Developer Docs
- [ ] RLS policy documentation in `docs/architecture/7-security-rls-deterministic-rules.md`
- [ ] Staff role system guide
- [ ] Code verification flow diagram
- [ ] Admin UI component documentation

### User Docs (Future)
- [ ] Sign-up guide for new users
- [ ] Admin guide for code management
- [ ] Staff role permissions matrix

## Sign-off

**Created by**: Sarah (Product Owner)  
**Date**: [Current Date]  
**Approved by**: [Pending]

**Stakeholders:**
- [ ] Product Manager - Approve epic scope
- [ ] Tech Lead - Review architecture decisions
- [ ] Security Team - Approve security model
- [ ] Frontend Lead - Confirm UI feasibility
- [ ] Backend Lead - Confirm database design

---

## Quick Reference

**Epic**: 1.X - User Sign-up & Staff Role System  
**Stories**: 3 (1.9, 1.10, 1.11)  
**Total Estimate**: 9-12 days  
**Priority**: High (Foundation for user growth)  
**Status**: Draft - Ready for Implementation

**Key Deliverables:**
✅ User sign-up with code verification  
✅ Staff role system (team, super_admin)  
✅ Admin interface for code management  
✅ demi@coralshades.ai as super_admin

