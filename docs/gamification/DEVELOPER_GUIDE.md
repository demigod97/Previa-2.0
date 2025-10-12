# Australian Gamification System - Developer Quick Reference

**Last Updated:** 2025-10-13
**Target Audience:** Frontend/Backend Developers implementing gamification features

---

## 🚀 Quick Start

### 1. Run Database Migrations

```bash
# From Supabase CLI or Dashboard
cd supabase/migrations

# Apply core tables migration
supabase migration up 20251013000001_create_australian_gamification_tables.sql

# Apply seed data (after creation)
supabase migration up 20251013000002_seed_australian_badges.sql
supabase migration up 20251013000003_seed_educational_tips.sql
supabase migration up 20251013000004_seed_challenge_definitions.sql
```

### 2. Generate TypeScript Types

```bash
# Generate types from Supabase schema
npm run db:types
# or
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### 3. Import Gamification Service

```typescript
import { gamificationService } from '@/services/gamificationService';

// Fetch user's gamification profile
const profile = await gamificationService.fetchGamificationProfile(userId);

// Award points
await gamificationService.awardPoints(userId, 10, 'Receipt uploaded');

// Award badge
await gamificationService.awardBadge(userId, 'duplicate_detective');
```

---

## 📊 Database Schema Reference

### Core Tables

```typescript
// 1. australian_badges (badge definitions - READ ONLY for users)
interface AustralianBadge {
  badge_id: string;
  badge_name: string;
  badge_description: string;
  badge_category: 'onboarding' | 'transaction' | 'education' | 'data_driven' | 'milestone';
  badge_theme: 'green' | 'blue' | 'gold' | 'purple' | 'platinum';
  badge_icon: string; // Lucide icon name
  badge_color: string; // Hex code
  unlock_criteria: string;
  unlock_logic: Record<string, any>; // JSONB
  reward_points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  australian_context: string;
  asic_reference?: string;
  ato_reference?: string;
  sort_order: number;
}

// 2. educational_tips (tip definitions - READ ONLY for users)
interface EducationalTip {
  tip_id: string;
  tip_text: string;
  tip_category: 'tax' | 'super' | 'banking' | 'gst' | 'consumer' | 'budget' | 'scam' | 'debt';
  tip_subcategory?: string;
  context_trigger?: string; // 'receipt_upload', 'work_expense_tagged', etc.
  age_group: '18-25' | '25-35' | '30-50' | 'all';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  external_link?: string;
  regulatory_reference?: string;
}

// 3. educational_modules
interface EducationalModule {
  module_id: string;
  module_name: string;
  module_category: 'superannuation' | 'taxation' | 'banking' | 'consumer_rights' | 'scam_prevention';
  description: string;
  learning_outcomes: string[];
  estimated_duration_minutes: number;
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  prerequisite_modules?: string[];
  completion_badge_id?: string;
  content: {
    sections: Array<{
      title: string;
      content: string;
      examples: string[];
      quiz_questions?: QuizQuestion[];
    }>;
  };
  external_resources: Array<{
    title: string;
    url: string;
    type: 'asic' | 'ato' | 'accc' | 'government' | 'other';
  }>;
}

// 4. user_educational_progress (user-scoped)
interface UserEducationalProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percent: number; // 0-100
  current_section: number;
  quiz_attempts: number;
  quiz_score?: number; // Latest score
  quiz_best_score?: number;
  time_spent_minutes: number;
  started_at?: Date;
  completed_at?: Date;
}

// 5. transaction_insights (user-scoped)
interface TransactionInsight {
  id: string;
  user_id: string;
  insight_type: 'duplicate' | 'budget_alert' | 'tax_opportunity' | 'savings_potential' | 'spending_trend';
  severity: 'info' | 'warning' | 'action_required';
  title: string;
  description: string;
  recommendation: string;
  potential_savings?: number;
  related_transactions: string[]; // transaction IDs
  metadata: Record<string, any>;
  dismissed: boolean;
}

// 6. user_badge_progress (user-scoped)
interface UserBadgeProgress {
  id: string;
  user_id: string;
  badge_id: string;
  current_progress: number;
  target_progress: number;
  progress_metadata: Record<string, any>;
}

// 7. challenge_definitions
interface ChallengeDefinition {
  challenge_id: string;
  challenge_name: string;
  challenge_description: string;
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'educational';
  challenge_category?: string;
  target_count: number;
  reward_points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

---

## 🔧 Helper Functions (PostgreSQL)

### Available in SQL

```sql
-- Calculate level from total points
SELECT calculate_level(2500); -- Returns: 5

-- Get Australian level title
SELECT get_australian_level_title(5); -- Returns: 'Financial Wizard'

-- Award badge (handles points, profile update, prevents duplicates)
SELECT award_australian_badge(
  'user-uuid-here'::uuid,
  'duplicate_detective'
); -- Returns: true if awarded, false if already earned
```

### Use from TypeScript

```typescript
// Call via Supabase RPC
const { data, error } = await supabase.rpc('award_australian_badge', {
  p_user_id: userId,
  p_badge_id: 'duplicate_detective'
});

if (data) {
  // Badge awarded successfully
  showToast({
    title: 'Badge Unlocked! 🎉',
    description: 'Duplicate Detective - You found subscription duplicates!',
    icon: 'PartyPopper'
  });
}
```

---

## 🎨 Component Examples

### 1. Fetch and Display Badges

```typescript
// src/components/gamification/AustralianBadgeShowcase.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function AustralianBadgeShowcase() {
  // Fetch all badge definitions
  const { data: allBadges } = useQuery({
    queryKey: ['australian-badges'],
    queryFn: async () => {
      const { data } = await supabase
        .from('australian_badges')
        .select('*')
        .order('sort_order');
      return data;
    }
  });

  // Fetch user's earned badges
  const { data: userBadges } = useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_badges')
        .select('badge_id, unlocked_at')
        .eq('user_id', userId);
      return data;
    }
  });

  const earnedBadgeIds = new Set(userBadges?.map(b => b.badge_id) || []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {allBadges?.map(badge => {
        const isEarned = earnedBadgeIds.has(badge.badge_id);
        return (
          <BadgeCard
            key={badge.badge_id}
            badge={badge}
            isEarned={isEarned}
          />
        );
      })}
    </div>
  );
}
```

### 2. Display Contextual Tips

```typescript
// src/components/gamification/AustralianTipOfTheDay.tsx
import { useQuery } from '@tanstack/react-query';

export function AustralianTipOfTheDay({
  contextTrigger = null,
  userAge = null
}: {
  contextTrigger?: string;
  userAge?: number;
}) {
  const { data: tips } = useQuery({
    queryKey: ['educational-tips', contextTrigger, userAge],
    queryFn: async () => {
      let query = supabase
        .from('educational_tips')
        .select('*')
        .eq('is_active', true);

      // Filter by context trigger if provided
      if (contextTrigger) {
        query = query.eq('context_trigger', contextTrigger);
      }

      // Filter by age group
      const ageGroup = getAgeGroup(userAge);
      query = query.in('age_group', [ageGroup, 'all']);

      const { data } = await query.limit(10);
      return data;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          💡 Australian Financial Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-charcoal mb-4">
          {tips?.[currentIndex]?.tip_text}
        </p>
        {tips?.[currentIndex]?.external_link && (
          <a href={tips[currentIndex].external_link} target="_blank" rel="noopener noreferrer">
            Learn more →
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function getAgeGroup(age?: number): string {
  if (!age) return 'all';
  if (age <= 25) return '18-25';
  if (age <= 35) return '25-35';
  return '30-50';
}
```

### 3. Track Educational Progress

```typescript
// src/hooks/useEducationalProgress.ts
export function useEducationalProgress(moduleId: string) {
  const { user } = useAuth();

  const { data: progress } = useQuery({
    queryKey: ['educational-progress', user?.id, moduleId],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_educational_progress')
        .select('*')
        .eq('user_id', user!.id)
        .eq('module_id', moduleId)
        .single();
      return data;
    },
    enabled: !!user?.id
  });

  const updateProgress = async (updates: Partial<UserEducationalProgress>) => {
    const { data } = await supabase
      .from('user_educational_progress')
      .upsert({
        user_id: user!.id,
        module_id: moduleId,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    return data;
  };

  const completeSection = async (sectionNumber: number) => {
    // Calculate new progress percentage
    const newProgress = Math.min(100, ((sectionNumber + 1) / totalSections) * 100);

    await updateProgress({
      current_section: sectionNumber + 1,
      progress_percent: newProgress,
      status: newProgress === 100 ? 'completed' : 'in_progress',
      completed_at: newProgress === 100 ? new Date().toISOString() : null
    });
  };

  return { progress, updateProgress, completeSection };
}
```

### 4. Display Transaction Insights

```typescript
// src/components/gamification/DataDrivenAchievements.tsx
export function DataDrivenAchievements() {
  const { user } = useAuth();

  const { data: insights } = useQuery({
    queryKey: ['transaction-insights', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('transaction_insights')
        .select('*')
        .eq('user_id', user!.id)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })
        .limit(5);
      return data;
    }
  });

  const dismissInsight = async (insightId: string) => {
    await supabase
      .from('transaction_insights')
      .update({ dismissed: true, dismissed_at: new Date().toISOString() })
      .eq('id', insightId);
  };

  return (
    <div className="space-y-4">
      {insights?.map(insight => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onDismiss={() => dismissInsight(insight.id)}
        />
      ))}
    </div>
  );
}
```

---

## 🎯 Achievement Trigger Logic

### Event-Based Triggers

```typescript
// When user uploads a receipt
async function handleReceiptUpload(userId: string, receiptId: string) {
  // Award points
  await gamificationService.awardPoints(userId, 5, 'Receipt uploaded');

  // Check for badge unlocks
  const receiptCount = await getReceiptCount(userId);

  if (receiptCount === 1) {
    await gamificationService.awardBadge(userId, 'receipt_rookie');
  } else if (receiptCount === 10) {
    await gamificationService.awardBadge(userId, 'receipt_hunter_bronze');
  } else if (receiptCount === 50) {
    await gamificationService.awardBadge(userId, 'receipt_hunter_silver');
  } else if (receiptCount === 100) {
    await gamificationService.awardBadge(userId, 'receipt_hunter_gold');
  }

  // Show contextual tip
  showTipForContext(userId, 'receipt_upload');
}
```

### Data-Driven Triggers (Run Periodically)

```typescript
// Run daily via cron job or scheduled function
async function checkDataDrivenAchievements(userId: string) {
  // Analyze transactions
  const analysis = await analyzeTransactions(userId);

  // Check for duplicate subscriptions
  if (analysis.duplicateSubscriptions.length >= 2) {
    const badgeAwarded = await gamificationService.awardBadge(
      userId,
      'duplicate_detective'
    );

    if (badgeAwarded) {
      // Create insight
      await supabase.from('transaction_insights').insert({
        user_id: userId,
        insight_type: 'duplicate',
        severity: 'action_required',
        title: 'Duplicate Subscriptions Found',
        description: `You have ${analysis.duplicateSubscriptions.length} duplicate subscriptions`,
        recommendation: 'Cancel one to save money',
        potential_savings: analysis.totalDuplicateWaste,
        related_transactions: analysis.duplicateTransactionIds,
        metadata: { duplicates: analysis.duplicateSubscriptions }
      });
    }
  }

  // Check budget adherence
  if (analysis.monthsUnderBudget >= 3) {
    await gamificationService.awardBadge(userId, 'budget_master');
  }

  // Check tax readiness
  if (analysis.workExpensesTagged >= 50) {
    await gamificationService.awardBadge(userId, 'tax_time_hero');
  }
}
```

---

## 🎨 Previa Design Tokens

### Colors

```typescript
// Badge Theme Colors
const badgeColors = {
  green: '#10B981',   // Onboarding
  blue: '#3B82F6',    // Transaction
  gold: '#FFD700',    // Education
  purple: '#9333EA',  // Data-Driven
  platinum: '#E5E4E2' // Milestone
};

// Previa Brand Colors
const previaColors = {
  paper: '#FFFEF9',      // Paper white background
  cream: '#F5F3E7',      // Cream accents
  sand: '#D9C8B4',       // Sand primary
  stone: '#8B7E74',      // Stone secondary
  charcoal: '#2C2825',   // Charcoal text
  ruled: 'rgba(43, 40, 37, 0.06)' // Ruled lines
};
```

### Icons (Lucide React)

```typescript
import {
  Trophy,       // first_steps
  Building,     // account_creator
  CheckCircle,  // onboarding_complete
  Camera,       // receipt badges
  RefreshCw,    // reconciliation_starter
  Medal,        // reconciliation_pro
  Award,        // reconciliation_expert
  PieChart,     // category_master
  Star,         // aussie_super_star
  FileText,     // tax_ninja
  Landmark,     // banking_pro
  Shield,       // consumer_champion
  AlertTriangle,// scam_spotter
  Search,       // duplicate_detective
  DollarSign,   // budget_master
  TrendingUp,   // tax_time_hero
  Target,       // savings_streak
  Calculator,   // spending_analyzer
  Sparkles,     // six_month_veteran
  Gem,          // year_in_review
  PartyPopper,  // tax_ready
  Lightbulb,    // tips
  Lock,         // locked badges
  Flame,        // streaks
  Calendar      // milestones
} from 'lucide-react';
```

---

## 📱 shadcn/ui Components Used

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
```

---

## 🧪 Testing Examples

### Unit Test: Level Calculation

```typescript
import { describe, it, expect } from 'vitest';

describe('Level Calculation', () => {
  it('calculates correct level from points', () => {
    expect(calculateLevel(0)).toBe(0);
    expect(calculateLevel(100)).toBe(1);
    expect(calculateLevel(400)).toBe(2);
    expect(calculateLevel(900)).toBe(3);
    expect(calculateLevel(2500)).toBe(5);
    expect(calculateLevel(10000)).toBe(10);
  });

  it('returns correct level title', () => {
    expect(getLevelTitle(1)).toBe('Financial Beginner');
    expect(getLevelTitle(5)).toBe('Financial Wizard');
    expect(getLevelTitle(10)).toBe('Master of Money');
  });
});
```

### Integration Test: Badge Award

```typescript
import { describe, it, expect } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Badge Award', () => {
  it('awards badge and updates profile', async () => {
    const userId = 'test-user-uuid';

    // Award badge
    const { data } = await supabase.rpc('award_australian_badge', {
      p_user_id: userId,
      p_badge_id: 'duplicate_detective'
    });

    expect(data).toBe(true);

    // Verify badge in user_badges
    const { data: userBadge } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', 'duplicate_detective')
      .single();

    expect(userBadge).toBeTruthy();

    // Verify points awarded
    const { data: profile } = await supabase
      .from('gamification_profiles')
      .select('total_points')
      .eq('user_id', userId)
      .single();

    expect(profile.total_points).toBeGreaterThan(0);
  });

  it('prevents duplicate badge awards', async () => {
    const userId = 'test-user-uuid';

    // Award badge twice
    await supabase.rpc('award_australian_badge', {
      p_user_id: userId,
      p_badge_id: 'receipt_rookie'
    });

    const { data } = await supabase.rpc('award_australian_badge', {
      p_user_id: userId,
      p_badge_id: 'receipt_rookie'
    });

    expect(data).toBe(false); // Already earned
  });
});
```

---

## 🔐 Security Best Practices

### Row Level Security (RLS)

```sql
-- Always enforced at database level
-- Users can only access their own data

-- ✅ GOOD: RLS policy filters by user_id
SELECT * FROM user_educational_progress WHERE user_id = auth.uid();

-- ❌ BAD: Client-side filtering (still protected by RLS, but inefficient)
SELECT * FROM user_educational_progress; -- Then filter in JavaScript
```

### Secure Badge Awards

```typescript
// ✅ GOOD: Award via backend function (server-side validation)
await supabase.rpc('award_australian_badge', {
  p_user_id: userId,
  p_badge_id: 'duplicate_detective'
});

// ❌ BAD: Direct insert (won't work due to RLS, but conceptually wrong)
await supabase.from('user_badges').insert({
  user_id: userId,
  badge_id: 'duplicate_detective'
}); // Missing points award, profile update, validation
```

---

## 📚 Useful Queries

### Get User's Badge Progress

```typescript
const { data: badgeProgress } = await supabase
  .from('user_badge_progress')
  .select(`
    *,
    badge:australian_badges(*)
  `)
  .eq('user_id', userId)
  .lt('current_progress', 'target_progress'); // Only incomplete badges
```

### Get Tips for Context

```typescript
const { data: tips } = await supabase
  .from('educational_tips')
  .select('*')
  .eq('context_trigger', 'receipt_upload')
  .in('age_group', ['18-25', 'all'])
  .limit(5);
```

### Get Module with Progress

```typescript
const { data: moduleWithProgress } = await supabase
  .from('educational_modules')
  .select(`
    *,
    user_progress:user_educational_progress(*)
  `)
  .eq('module_id', 'australian_superannuation')
  .eq('user_progress.user_id', userId)
  .single();
```

---

## 🎉 Quick Wins

### 1. Add a New Badge

```yaml
# In badges.yaml
- badge_id: new_badge_id
  badge_name: "Badge Name"
  badge_description: "Description"
  badge_category: transaction
  badge_theme: blue
  badge_icon: Trophy
  badge_color: "#3B82F6"
  unlock_criteria: "Do something 10 times"
  reward_points: 50
  rarity: rare
```

Then seed:
```sql
INSERT INTO australian_badges (badge_id, badge_name, ...) VALUES (...);
```

### 2. Add a New Tip

```yaml
# In tips.yaml
- tip_id: tax_041
  tip_text: "New tip content here"
  tip_category: tax
  context_trigger: null
  age_group: all
  difficulty_level: beginner
```

Then seed:
```sql
INSERT INTO educational_tips (tip_id, tip_text, ...) VALUES (...);
```

### 3. Trigger Badge Award

```typescript
// In your event handler
await supabase.rpc('award_australian_badge', {
  p_user_id: user.id,
  p_badge_id: 'your_badge_id'
});
```

---

**Happy Coding! 🚀**

For questions or issues, refer to:
- [Implementation Plan](./implementation-plan.md)
- [Progress Log](./progress-log.md)
- [Summary Document](./SUMMARY.md)
