// Australian Financial Literacy Gamification Types
// Based on Australian gamification schema

export interface GamificationProfile {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  level_title?: string;
  last_achievement_at?: string;
  eofy_readiness_score?: number;
  created_at: string;
  updated_at: string;
}

export interface AustralianBadge {
  badge_id: string;
  badge_name: string;
  badge_description: string;
  badge_category: 'onboarding' | 'transaction' | 'education' | 'data_driven' | 'milestone';
  badge_theme: 'green' | 'blue' | 'gold' | 'purple' | 'platinum';
  badge_icon: string; // Lucide icon name
  badge_color: string; // Hex code
  unlock_criteria: string;
  unlock_logic: Record<string, unknown>; // JSONB
  reward_points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  australian_context: string;
  asic_reference?: string;
  ato_reference?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  created_at: string;
  badge?: AustralianBadge;
}

export interface EducationalTip {
  tip_id: string;
  tip_text: string;
  tip_category: 'tax' | 'super' | 'banking' | 'gst' | 'consumer' | 'budget' | 'scam' | 'debt';
  tip_subcategory?: string;
  context_trigger?: string; // 'receipt_upload', 'work_expense_tagged', etc.
  age_group: '18-25' | '25-35' | '30-50' | 'all';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  external_link?: string;
  is_australian_specific: boolean;
  regulatory_reference?: string;
  is_active: boolean;
  created_at: string;
}

export interface ChallengeDefinition {
  challenge_id: string;
  challenge_name: string;
  challenge_description: string;
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'educational';
  challenge_category?: string;
  target_count: number;
  reward_points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  australian_context?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'available' | 'active' | 'completed' | 'expired';
  current_progress: number;
  started_at?: string;
  completed_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  challenge?: ChallengeDefinition;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points_earned: number;
  reason: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface UserBadgeProgress {
  id: string;
  user_id: string;
  badge_id: string;
  current_progress: number;
  target_progress: number;
  progress_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  badge?: AustralianBadge;
}

export interface TransactionInsight {
  id: string;
  user_id: string;
  insight_type: 'duplicate' | 'budget_alert' | 'tax_opportunity' | 'savings_potential' | 'spending_trend';
  severity: 'info' | 'warning' | 'action_required';
  title: string;
  description: string;
  recommendation: string;
  potential_savings?: number;
  related_transactions?: string[];
  metadata?: Record<string, unknown>;
  dismissed: boolean;
  dismissed_at?: string;
  action_taken: boolean;
  action_taken_at?: string;
  created_at: string;
}

// Helper types for UI
export interface BadgeWithProgress extends AustralianBadge {
  isEarned: boolean;
  progress?: UserBadgeProgress;
  earnedDate?: string;
}

export interface LevelInfo {
  currentLevel: number;
  levelTitle: string;
  totalPoints: number;
  currentLevelThreshold: number;
  nextLevel: number;
  nextLevelTitle: string;
  nextLevelThreshold: number;
  pointsToNextLevel: number;
  progressPercent: number;
}

// Australian level titles mapping
export const AUSTRALIAN_LEVEL_TITLES: Record<number, string> = {
  0: 'Getting Started',
  1: 'Financial Beginner',
  2: 'Money Learner',
  3: 'Budget Practitioner',
  4: 'Financial Achiever',
  5: 'Financial Wizard',
  6: 'Money Expert',
  7: 'Financial Guru',
  8: 'Wealth Sage',
  9: 'Financial Legend',
  10: 'Master of Money',
};

// Badge theme color mapping
export const BADGE_THEME_COLORS = {
  green: '#10B981',
  blue: '#3B82F6',
  gold: '#FFD700',
  purple: '#9333EA',
  platinum: '#E5E4E2',
} as const;

// Badge category icons (Lucide React icons)
export const BADGE_CATEGORY_ICONS = {
  onboarding: 'CheckCircle',
  transaction: 'RefreshCw',
  education: 'GraduationCap',
  data_driven: 'TrendingUp',
  milestone: 'Trophy',
} as const;
