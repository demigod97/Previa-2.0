// Australian Financial Literacy Gamification Service
// Handles all gamification-related data fetching and operations

import { supabase } from '@/integrations/supabase/client';
import type {
  GamificationProfile,
  AustralianBadge,
  UserBadge,
  EducationalTip,
  ChallengeDefinition,
  UserChallenge,
  PointTransaction,
  UserBadgeProgress,
  TransactionInsight,
  LevelInfo,
  BadgeWithProgress,
  AUSTRALIAN_LEVEL_TITLES,
} from '@/types/gamification';

/**
 * Calculate level from total points using Australian level formula
 * Formula: level = floor(sqrt(points/100))
 */
export function calculateLevel(totalPoints: number): number {
  return Math.floor(Math.sqrt(totalPoints / 100));
}

/**
 * Get Australian level title for a given level
 */
export function getAustralianLevelTitle(level: number): string {
  const titles: typeof AUSTRALIAN_LEVEL_TITLES = {
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

  return titles[level] || (level > 10 ? 'Master of Money' : 'Getting Started');
}

/**
 * Calculate level information including progress to next level
 */
export function calculateLevelInfo(totalPoints: number): LevelInfo {
  const currentLevel = calculateLevel(totalPoints);
  const nextLevel = currentLevel + 1;

  const currentLevelThreshold = currentLevel * currentLevel * 100;
  const nextLevelThreshold = nextLevel * nextLevel * 100;

  const pointsToNextLevel = nextLevelThreshold - totalPoints;
  const pointsInCurrentLevel = totalPoints - currentLevelThreshold;
  const pointsNeededForLevel = nextLevelThreshold - currentLevelThreshold;
  const progressPercent = (pointsInCurrentLevel / pointsNeededForLevel) * 100;

  return {
    currentLevel,
    levelTitle: getAustralianLevelTitle(currentLevel),
    totalPoints,
    currentLevelThreshold,
    nextLevel,
    nextLevelTitle: getAustralianLevelTitle(nextLevel),
    nextLevelThreshold,
    pointsToNextLevel,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
  };
}

/**
 * Fetch gamification profile for current user
 */
export async function fetchGamificationProfile(): Promise<GamificationProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('gamification_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching gamification profile:', error);
    return null;
  }

  return data;
}

/**
 * Fetch all Australian badge definitions
 */
export async function fetchAllBadges(): Promise<AustralianBadge[]> {
  const { data, error } = await supabase
    .from('australian_badges')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch user's earned badges
 */
export async function fetchUserBadges(): Promise<UserBadge[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:australian_badges(*)
    `)
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all badges with earned status and progress
 */
export async function fetchBadgesWithProgress(): Promise<BadgeWithProgress[]> {
  const [allBadges, userBadges, badgeProgress] = await Promise.all([
    fetchAllBadges(),
    fetchUserBadges(),
    fetchBadgeProgress(),
  ]);

  const earnedBadgeIds = new Set(userBadges.map(b => b.badge_id));
  const progressMap = new Map(badgeProgress.map(p => [p.badge_id, p]));

  return allBadges.map(badge => ({
    ...badge,
    isEarned: earnedBadgeIds.has(badge.badge_id),
    progress: progressMap.get(badge.badge_id),
    earnedDate: userBadges.find(b => b.badge_id === badge.badge_id)?.unlocked_at,
  }));
}

/**
 * Fetch badge progress for current user
 */
export async function fetchBadgeProgress(): Promise<UserBadgeProgress[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_badge_progress')
    .select(`
      *,
      badge:australian_badges(*)
    `)
    .eq('user_id', user.id)
    .lt('current_progress', 'target_progress'); // Only incomplete badges

  if (error) {
    console.error('Error fetching badge progress:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch educational tips (optional: filter by context, age group, category)
 */
export async function fetchEducationalTips(options?: {
  contextTrigger?: string;
  category?: string;
  ageGroup?: '18-25' | '25-35' | '30-50' | 'all';
  limit?: number;
}): Promise<EducationalTip[]> {
  let query = supabase
    .from('educational_tips')
    .select('*')
    .eq('is_active', true);

  if (options?.contextTrigger) {
    query = query.eq('context_trigger', options.contextTrigger);
  }

  if (options?.category) {
    query = query.eq('tip_category', options.category);
  }

  if (options?.ageGroup) {
    query = query.in('age_group', [options.ageGroup, 'all']);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tips:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch active challenges for current user
 */
export async function fetchActiveChallenges(): Promise<UserChallenge[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenge:challenge_definitions(*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('expires_at', { ascending: true });

  if (error) {
    console.error('Error fetching active challenges:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch points history for current user
 */
export async function fetchPointsHistory(limit: number = 10): Promise<PointTransaction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching points history:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch transaction insights for current user
 */
export async function fetchTransactionInsights(): Promise<TransactionInsight[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('transaction_insights')
    .select('*')
    .eq('user_id', user.id)
    .eq('dismissed', false)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching insights:', error);
    return [];
  }

  return data || [];
}

/**
 * Award points to user (calls RPC function for proper calculation)
 */
export async function awardPoints(points: number, reason: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('point_transactions')
    .insert({
      user_id: user.id,
      points_earned: points,
      reason,
    });

  if (error) {
    console.error('Error awarding points:', error);
    return false;
  }

  return true;
}

/**
 * Award badge to user (calls RPC function for proper handling)
 */
export async function awardBadge(badgeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Call the award_australian_badge RPC function
  const { data, error } = await supabase.rpc('award_australian_badge', {
    p_user_id: user.id,
    p_badge_id: badgeId,
  });

  if (error) {
    console.error('Error awarding badge:', error);
    return false;
  }

  return data === true;
}

/**
 * Dismiss a transaction insight
 */
export async function dismissInsight(insightId: string): Promise<boolean> {
  const { error } = await supabase
    .from('transaction_insights')
    .update({
      dismissed: true,
      dismissed_at: new Date().toISOString(),
    })
    .eq('id', insightId);

  if (error) {
    console.error('Error dismissing insight:', error);
    return false;
  }

  return true;
}

/**
 * Get random tips for "Tip of the Day" widget
 */
export async function getRandomTips(count: number = 10): Promise<EducationalTip[]> {
  const { data, error } = await supabase
    .from('educational_tips')
    .select('*')
    .eq('is_active', true)
    .limit(50); // Get 50 random tips

  if (error || !data) {
    console.error('Error fetching random tips:', error);
    return [];
  }

  // Shuffle and return requested count
  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
