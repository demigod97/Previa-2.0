# Gamification System Specification

**Version:** 1.0  
**Date:** 2025-01-13  
**Purpose:** Define gamification mechanics for Previa financial literacy and engagement

---

## 1. Overview

Gamification in Previa serves two primary goals:
1. **Engagement:** Keep users returning to the app through rewards and progress tracking
2. **Financial Literacy:** Teach financial management through challenges and achievements

---

## 2. Badge System

### 2.1 Badge Categories

**Onboarding Badges** (unlock during first-time experience)
- 🏆 **First Upload** - Upload first bank statement
- 📊 **Account Created** - Create first bank account
- 🔍 **First Match** - Approve first reconciliation match
- ✅ **First Complete** - Complete onboarding flow

**Activity Badges** (ongoing engagement)
- 📸 **Receipt Hunter** - Upload 10/50/100 receipts
- 💰 **Transaction Master** - Reconcile 25/100/500 transactions
- 📅 **Weekly Warrior** - Use app 7 days in a row
- 🔥 **Monthly Champion** - Complete all tasks for a month

**Financial Literacy Badges** (educational achievements)
- 🎓 **Budget Basics** - Complete budgeting tutorial
- 💡 **Tax Time Pro** - Learn about tax deductions
- 🎯 **Goal Setter** - Create first financial goal
- 📈 **Trend Watcher** - Review spending trends 5 times

**Milestone Badges** (long-term achievements)
- 🌟 **6 Month Veteran** - Active for 6 months
- 💎 **Premium Member** - Upgrade to premium tier
- 🏅 **Tax Ready** - Export data for tax time
- 🎊 **Year in Review** - Complete annual summary

### 2.2 Badge Data Structure

```typescript
interface Badge {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  description: string;
  category: 'onboarding' | 'activity' | 'literacy' | 'milestone';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: BadgeCriteria;
  reward_points: number;
  unlocked_at?: Date;
}

interface BadgeCriteria {
  type: 'count' | 'streak' | 'date' | 'completion';
  target: number;
  metric: string; // e.g., 'receipts_uploaded', 'days_active'
}
```

### 2.3 Badge Display

**UI Components:**
- Large badge display on unlock (modal with animation)
- Badge collection grid in user profile
- Progress indicators for in-progress badges
- Mini badge icons in notifications

**Visual Design:**
- Use Previa sand color for badge backgrounds
- Tier colors: Bronze (#CD7F32), Silver (#C0C0C0), Gold (#FFD700), Platinum (#E5E4E2)
- Locked badges shown in grayscale with progress percentage

---

## 3. Challenge System

### 3.1 Challenge Types

**Daily Challenges** (reset every 24 hours)
- Upload 1 receipt
- Review 5 transactions
- Check spending dashboard
- Categorize 3 uncategorized transactions

**Weekly Challenges** (reset every Monday)
- Reconcile 10 transactions
- Upload weekly receipts
- Complete financial quiz
- Review spending vs budget

**Monthly Challenges** (reset 1st of month)
- Export reconciled data
- Achieve 90% reconciliation rate
- Complete all weekly challenges
- Review monthly spending trends

**Educational Challenges** (one-time completions)
- Complete tax deduction tutorial
- Learn about GST tracking
- Understand reconciliation process
- Master expense categorization

### 3.2 Challenge Data Structure

```typescript
interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'educational';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  criteria: ChallengeCriteria;
  expires_at?: Date;
  completed_at?: Date;
}

interface ChallengeCriteria {
  tasks: ChallengeTask[];
  all_required: boolean; // true = all tasks, false = any task
}

interface ChallengeTask {
  description: string;
  metric: string;
  target: number;
  current: number;
}
```

### 3.3 Challenge UI Patterns

**Challenge Card:**
- Title and description
- Progress bar (current/target)
- Points reward display
- "Start Challenge" or "In Progress" state
- Completion checkmark animation

**Challenge Feed:**
- Active challenges at top
- Completed challenges below (collapsed)
- Suggested next challenges
- Daily/Weekly/Monthly tabs

---

## 4. Points & Rewards System

### 4.1 Point Sources

**Activity Points:**
- Upload receipt: 5 points
- Reconcile transaction: 3 points
- Categorize transaction: 2 points
- Daily login: 1 point
- Weekly streak bonus: 10 points

**Challenge Points:**
- Daily challenge: 10-25 points
- Weekly challenge: 50-100 points
- Monthly challenge: 200-500 points
- Educational challenge: 25-75 points

**Badge Points:**
- Bronze badge: 50 points
- Silver badge: 100 points
- Gold badge: 250 points
- Platinum badge: 500 points

### 4.2 Point Display

**UI Elements:**
- Total points in header/profile
- Points earned animation on actions
- Leaderboard (future feature - not MVP)
- Points history/log

### 4.3 Reward Tiers (Future Consideration)

**Note:** MVP focuses on intrinsic rewards (badges, progress). Future tiers could include:
- 1,000 points: Premium feature unlock
- 5,000 points: Custom export templates
- 10,000 points: Advanced analytics access

---

## 5. Progress Tracking

### 5.1 Streak System

**Daily Streak:**
- Track consecutive days of app usage
- Reset on missed day
- Display fire emoji 🔥 with streak count
- Weekly milestone rewards (7, 14, 30, 90 days)

**Upload Streak:**
- Track consecutive weeks with receipt uploads
- Encourage regular financial admin habits
- Display in dashboard widget

### 5.2 Level System (Optional for MVP)

**User Levels:**
- Level 1: Beginner (0-100 points)
- Level 2: Learner (100-500 points)
- Level 3: Practitioner (500-1,500 points)
- Level 4: Expert (1,500-5,000 points)
- Level 5: Master (5,000+ points)

**Level Benefits:**
- Unlock advanced features at higher levels
- Display level badge in profile
- Level-up celebration animation

---

## 6. Onboarding Gamification

### 6.1 First-Time User Flow

**Screen 7: Onboarding Complete**
- Display "First Upload" badge with animation
- Show points earned (50 points)
- Preview next badges to unlock
- CTA: "Continue to Dashboard"

### 6.2 Unlock Sequence

1. **First Upload** (Screen 3): Upload bank statement
2. **Account Created** (Screen 5): Confirm bank account
3. **Transaction Preview** (Screen 6): View first transactions
4. **Onboarding Complete** (Screen 7): Finish flow

---

## 7. Database Schema

### 7.1 Tables

```sql
-- User gamification profile
CREATE TABLE gamification_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge unlocks
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Challenge progress
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  progress JSONB, -- Store task progress
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Point transactions (audit log)
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL, -- e.g., 'receipt_upload', 'badge_unlock'
  reference_id UUID, -- Link to transaction/badge/challenge
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 Indexes

```sql
CREATE INDEX idx_gamification_profiles_user ON gamification_profiles(user_id);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_challenges_user_status ON user_challenges(user_id, status);
CREATE INDEX idx_point_transactions_user_date ON point_transactions(user_id, created_at DESC);
```

---

## 8. Trigger Events

### 8.1 Badge Unlock Triggers

**Event-Based Triggers:**
- `on_first_upload`: When bank_statements row inserted
- `on_account_created`: When bank_accounts row inserted
- `on_first_match`: When reconciliation_matches status = 'approved'
- `on_receipt_milestone`: When receipts count reaches threshold (10, 50, 100)

**Implementation:**
- PostgreSQL triggers or Edge Function listeners
- Check criteria, insert user_badges row
- Update gamification_profiles.total_points
- Send notification to user

### 8.2 Point Award Triggers

**Automatic Point Awards:**
- Receipt upload: +5 points
- Transaction reconciled: +3 points
- Daily login: +1 point
- Badge unlock: Variable points based on badge tier

---

## 9. UI Component Specifications

### 9.1 Badge Display Component

**BadgeCard:**
```tsx
interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  progress?: number; // 0-100 for in-progress badges
}

// Visual states:
// - Locked: Grayscale, show progress bar
// - Unlocked: Full color, show unlock date
// - Featured: Large size for celebrations
```

### 9.2 Challenge Component

**ChallengeCard:**
```tsx
interface ChallengeCardProps {
  challenge: Challenge;
  progress: ChallengeCriteria;
  onStart: () => void;
  onClaim: () => void;
}

// Visual states:
// - Available: Call-to-action button
// - In Progress: Progress bar, current/target
// - Completed: Checkmark, claim reward button
// - Expired: Faded, "Expired" badge
```

### 9.3 Points Display

**PointsWidget:**
```tsx
interface PointsWidgetProps {
  totalPoints: number;
  recentEarned?: number; // Show "+10" animation
  level: number;
  nextLevelThreshold: number;
}

// Placement: Header, Profile, Dashboard widget
```

---

## 10. MVP Scope

### 10.1 Must Have (MVP)

✅ **Badge System:**
- 4 onboarding badges
- Basic activity badges (upload, reconcile)
- Badge collection display
- Unlock animations

✅ **Points System:**
- Point earning for key actions
- Total points display
- Points history log

✅ **Onboarding Gamification:**
- First upload badge celebration
- Progress indicators in onboarding flow

### 10.2 Nice to Have (Post-MVP)

⏳ **Challenge System:**
- Daily/weekly/monthly challenges
- Challenge feed UI
- Challenge completion rewards

⏳ **Streak Tracking:**
- Daily login streaks
- Streak milestone rewards

⏳ **Level System:**
- User levels based on points
- Level-up celebrations

⏳ **Leaderboards:**
- Friend comparisons
- Community rankings

---

## 11. Analytics & Tracking

### 11.1 Metrics to Track

**Engagement Metrics:**
- Badge unlock rate
- Average time to first badge
- Challenge completion rate
- Daily active users with gamification actions

**Retention Metrics:**
- Streak retention (day 7, 14, 30)
- Gamified users vs non-gamified retention
- Points per user per week

---

## 12. Accessibility Considerations

### 12.1 Requirements

- Badge descriptions must be screen-reader friendly
- Progress bars include aria-valuenow attributes
- Animations respect prefers-reduced-motion
- Color is not the only indicator of status (use icons/text)

---

## 13. Testing Requirements

### 13.1 Test Cases

**Badge System:**
- Verify badge unlocks on criteria met
- Test duplicate badge prevention (UNIQUE constraint)
- Verify point awards on badge unlock
- Test badge display states (locked, unlocked, featured)

**Points System:**
- Verify point calculations
- Test point transaction audit log
- Verify total points update on actions

**UI Components:**
- Test badge card rendering (all states)
- Test unlock animation performance
- Test progress bar accuracy
- Verify responsive layouts

---

## 14. Security Considerations

### 14.1 Safeguards

- All gamification actions validated server-side (no client-only awards)
- Point transactions logged for audit trail
- Badge criteria checked via RLS policies
- Prevent point manipulation via direct DB access

---

**End of Specification**
