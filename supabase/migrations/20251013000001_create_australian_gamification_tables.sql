-- ============================================
-- AUSTRALIAN FINANCIAL LITERACY GAMIFICATION SYSTEM
-- Migration: Create core tables for enhanced gamification
-- Version: 1.0
-- Date: 2025-10-13
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: AUSTRALIAN_BADGES
-- Stores Australian-specific badge definitions
-- ============================================

CREATE TABLE IF NOT EXISTS australian_badges (
  badge_id TEXT PRIMARY KEY,
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_category TEXT NOT NULL CHECK (badge_category IN ('onboarding', 'transaction', 'education', 'data_driven', 'milestone')),
  badge_theme TEXT NOT NULL CHECK (badge_theme IN ('green', 'blue', 'gold', 'purple', 'platinum')),
  badge_icon TEXT NOT NULL, -- Lucide icon name or emoji
  badge_color TEXT NOT NULL, -- Hex color code
  unlock_criteria TEXT NOT NULL,
  unlock_logic JSONB, -- JSON object with trigger conditions
  reward_points INTEGER NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  australian_context TEXT,
  asic_reference TEXT,
  ato_reference TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for category filtering
CREATE INDEX idx_australian_badges_category ON australian_badges(badge_category);
CREATE INDEX idx_australian_badges_rarity ON australian_badges(badge_rarity);
CREATE INDEX idx_australian_badges_sort ON australian_badges(sort_order);

-- Add comment
COMMENT ON TABLE australian_badges IS 'Australian-specific badge definitions with educational context and unlock logic';

-- ============================================
-- TABLE 2: EDUCATIONAL_TIPS
-- Stores 200+ Australian financial literacy tips
-- ============================================

CREATE TABLE IF NOT EXISTS educational_tips (
  tip_id TEXT PRIMARY KEY,
  tip_text TEXT NOT NULL,
  tip_category TEXT NOT NULL CHECK (tip_category IN ('tax', 'super', 'banking', 'gst', 'consumer', 'budget', 'scam', 'debt')),
  tip_subcategory TEXT,
  context_trigger TEXT, -- Event that can trigger this tip display
  age_group TEXT CHECK (age_group IN ('18-25', '25-35', '30-50', 'all')),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  external_link TEXT,
  last_updated DATE DEFAULT CURRENT_DATE,
  is_australian_specific BOOLEAN DEFAULT true,
  regulatory_reference TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient filtering
CREATE INDEX idx_educational_tips_category ON educational_tips(tip_category);
CREATE INDEX idx_educational_tips_age_group ON educational_tips(age_group);
CREATE INDEX idx_educational_tips_difficulty ON educational_tips(difficulty_level);
CREATE INDEX idx_educational_tips_context ON educational_tips(context_trigger) WHERE context_trigger IS NOT NULL;

-- Add comment
COMMENT ON TABLE educational_tips IS 'Australian financial literacy tips with contextual triggers and age-appropriate targeting';

-- ============================================
-- TABLE 3: EDUCATIONAL_MODULES
-- Stores comprehensive learning modules with quizzes
-- ============================================

CREATE TABLE IF NOT EXISTS educational_modules (
  module_id TEXT PRIMARY KEY,
  module_name TEXT NOT NULL,
  module_category TEXT NOT NULL CHECK (module_category IN ('superannuation', 'taxation', 'banking', 'consumer_rights', 'scam_prevention')),
  description TEXT NOT NULL,
  learning_outcomes TEXT[] NOT NULL, -- Array of learning outcomes
  australian_curriculum_alignment TEXT,
  estimated_duration_minutes INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('foundation', 'intermediate', 'advanced')),
  prerequisite_modules TEXT[], -- Array of module_ids
  completion_badge_id TEXT REFERENCES australian_badges(badge_id),
  content JSONB NOT NULL, -- Structured module content with sections and quizzes
  external_resources JSONB, -- Array of external resource objects
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_educational_modules_category ON educational_modules(module_category);
CREATE INDEX idx_educational_modules_difficulty ON educational_modules(difficulty);

-- Add comment
COMMENT ON TABLE educational_modules IS 'Comprehensive educational modules aligned with Australian Curriculum and ASIC/ATO standards';

-- ============================================
-- TABLE 4: USER_EDUCATIONAL_PROGRESS
-- Tracks user progress through educational modules
-- ============================================

CREATE TABLE IF NOT EXISTS user_educational_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES educational_modules(module_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  current_section INTEGER DEFAULT 0,
  quiz_attempts INTEGER DEFAULT 0,
  quiz_score INTEGER, -- Latest quiz score (0-100)
  quiz_best_score INTEGER, -- Best quiz score achieved
  time_spent_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create indexes for efficient querying
CREATE INDEX idx_user_educational_progress_user ON user_educational_progress(user_id);
CREATE INDEX idx_user_educational_progress_module ON user_educational_progress(module_id);
CREATE INDEX idx_user_educational_progress_status ON user_educational_progress(status);
CREATE INDEX idx_user_educational_progress_completed ON user_educational_progress(user_id, status) WHERE status = 'completed';

-- Add comment
COMMENT ON TABLE user_educational_progress IS 'Tracks individual user progress through educational modules including quiz scores';

-- ============================================
-- TABLE 5: TRANSACTION_INSIGHTS
-- Stores data-driven insights from transaction analysis
-- ============================================

CREATE TABLE IF NOT EXISTS transaction_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('duplicate', 'budget_alert', 'tax_opportunity', 'savings_potential', 'spending_trend')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'action_required')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  potential_savings DECIMAL(10, 2),
  related_transactions UUID[], -- Array of transaction IDs
  metadata JSONB, -- Additional context data
  dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,
  action_taken TEXT,
  action_taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_transaction_insights_user ON transaction_insights(user_id);
CREATE INDEX idx_transaction_insights_type ON transaction_insights(insight_type);
CREATE INDEX idx_transaction_insights_severity ON transaction_insights(severity);
CREATE INDEX idx_transaction_insights_active ON transaction_insights(user_id, dismissed) WHERE dismissed = false;
CREATE INDEX idx_transaction_insights_created ON transaction_insights(created_at DESC);

-- Add comment
COMMENT ON TABLE transaction_insights IS 'Data-driven insights generated from transaction pattern analysis for achievement triggers';

-- ============================================
-- TABLE 6: USER_BADGE_PROGRESS
-- Tracks progress toward unlocking badges
-- ============================================

CREATE TABLE IF NOT EXISTS user_badge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES australian_badges(badge_id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  target_progress INTEGER NOT NULL,
  progress_metadata JSONB, -- Stores additional progress tracking data
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create indexes
CREATE INDEX idx_user_badge_progress_user ON user_badge_progress(user_id);
CREATE INDEX idx_user_badge_progress_badge ON user_badge_progress(badge_id);
CREATE INDEX idx_user_badge_progress_incomplete ON user_badge_progress(user_id) WHERE current_progress < target_progress;

-- Add comment
COMMENT ON TABLE user_badge_progress IS 'Tracks user progress toward unlocking each badge';

-- ============================================
-- TABLE 7: CHALLENGE_DEFINITIONS
-- Stores challenge templates (daily/weekly/monthly)
-- ============================================

CREATE TABLE IF NOT EXISTS challenge_definitions (
  challenge_id TEXT PRIMARY KEY,
  challenge_name TEXT NOT NULL,
  challenge_description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('daily', 'weekly', 'monthly', 'educational')),
  challenge_category TEXT,
  target_count INTEGER NOT NULL,
  reward_points INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  australian_context TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_challenge_definitions_type ON challenge_definitions(challenge_type);

-- Add comment
COMMENT ON TABLE challenge_definitions IS 'Challenge templates for daily, weekly, and monthly challenges';

-- ============================================
-- EXTEND EXISTING TABLE: gamification_profiles
-- Add Australian-specific fields
-- ============================================

-- Check if gamification_profiles exists, add columns if it does
DO $$
BEGIN
  -- Add Australian level titles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gamification_profiles' AND column_name = 'level_title'
  ) THEN
    ALTER TABLE gamification_profiles ADD COLUMN level_title TEXT;
  END IF;

  -- Add last achievement date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gamification_profiles' AND column_name = 'last_achievement_at'
  ) THEN
    ALTER TABLE gamification_profiles ADD COLUMN last_achievement_at TIMESTAMPTZ;
  END IF;

  -- Add EOFY readiness score
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gamification_profiles' AND column_name = 'eofy_readiness_score'
  ) THEN
    ALTER TABLE gamification_profiles ADD COLUMN eofy_readiness_score INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE australian_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_educational_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_definitions ENABLE ROW LEVEL SECURITY;

-- Badges and tips are publicly readable
CREATE POLICY "Australian badges are viewable by all authenticated users"
  ON australian_badges FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Educational tips are viewable by all authenticated users"
  ON educational_tips FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Educational modules are viewable by all authenticated users"
  ON educational_modules FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User-specific data policies
CREATE POLICY "Users can view own educational progress"
  ON user_educational_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own educational progress"
  ON user_educational_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own educational progress"
  ON user_educational_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transaction insights"
  ON transaction_insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own transaction insights"
  ON transaction_insights FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badge progress"
  ON user_badge_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Challenge definitions are viewable by all authenticated users"
  ON challenge_definitions FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_australian_badges_updated_at
  BEFORE UPDATE ON australian_badges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_modules_updated_at
  BEFORE UPDATE ON educational_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_educational_progress_updated_at
  BEFORE UPDATE ON user_educational_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate level from points (reusable)
CREATE OR REPLACE FUNCTION calculate_level(total_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(SQRT(total_points / 100.0))::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get Australian level title
CREATE OR REPLACE FUNCTION get_australian_level_title(level_num INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE
    WHEN level_num = 1 THEN 'Financial Beginner'
    WHEN level_num = 2 THEN 'Money Learner'
    WHEN level_num = 3 THEN 'Budget Practitioner'
    WHEN level_num = 4 THEN 'Financial Achiever'
    WHEN level_num = 5 THEN 'Financial Wizard'
    WHEN level_num = 6 THEN 'Money Expert'
    WHEN level_num = 7 THEN 'Financial Guru'
    WHEN level_num = 8 THEN 'Wealth Sage'
    WHEN level_num = 9 THEN 'Financial Legend'
    WHEN level_num >= 10 THEN 'Master of Money'
    ELSE 'Financial Novice'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to award badge and update profile
CREATE OR REPLACE FUNCTION award_australian_badge(
  p_user_id UUID,
  p_badge_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_reward_points INTEGER;
  v_badge_exists BOOLEAN;
BEGIN
  -- Check if badge already awarded
  SELECT EXISTS(
    SELECT 1 FROM user_badges
    WHERE user_id = p_user_id AND badge_id = p_badge_id
  ) INTO v_badge_exists;

  IF v_badge_exists THEN
    RETURN FALSE; -- Already earned
  END IF;

  -- Get reward points
  SELECT reward_points INTO v_reward_points
  FROM australian_badges
  WHERE badge_id = p_badge_id;

  -- Insert user badge
  INSERT INTO user_badges (user_id, badge_id, unlocked_at)
  VALUES (p_user_id, p_badge_id, NOW());

  -- Award points
  INSERT INTO point_transactions (user_id, points_earned, reason, reference_id)
  VALUES (p_user_id, v_reward_points, 'Badge unlocked: ' || p_badge_id, NULL);

  -- Update gamification profile
  UPDATE gamification_profiles
  SET
    total_points = total_points + v_reward_points,
    current_level = calculate_level(total_points + v_reward_points),
    level_title = get_australian_level_title(calculate_level(total_points + v_reward_points)),
    last_achievement_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Create additional composite indexes for common queries
CREATE INDEX idx_user_badges_user_date ON user_badges(user_id, unlocked_at DESC);
CREATE INDEX idx_point_transactions_user_date ON point_transactions(user_id, created_at DESC);

-- ============================================
-- GRANTS (if needed for service roles)
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT SELECT ON australian_badges TO authenticated;
GRANT SELECT ON educational_tips TO authenticated;
GRANT SELECT ON educational_modules TO authenticated;
GRANT ALL ON user_educational_progress TO authenticated;
GRANT ALL ON transaction_insights TO authenticated;
GRANT ALL ON user_badge_progress TO authenticated;
GRANT SELECT ON challenge_definitions TO authenticated;

-- ============================================
-- END OF MIGRATION
-- ============================================

-- Add migration record
COMMENT ON SCHEMA public IS 'Australian Financial Literacy Gamification - Migration applied 2025-10-13';
