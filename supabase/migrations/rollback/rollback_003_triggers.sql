-- Rollback for 20250109000003_create_default_tier_trigger.sql
-- Drops tier creation trigger and trigger functions

-- CRITICAL: This rollback will DISABLE automatic tier creation on user signup
-- Only run this if the trigger is misconfigured and needs to be recreated

BEGIN;

-- Drop trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_tier ON auth.users;

-- Drop trigger function
DROP FUNCTION IF EXISTS handle_new_user_tier();

-- Drop updated_at trigger function (if exists)
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;

COMMIT;

-- Verify rollback
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created_tier'
  ) THEN
    RAISE EXCEPTION 'Rollback failed: Tier creation trigger still exists';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user_tier'
  ) THEN
    RAISE EXCEPTION 'Rollback failed: handle_new_user_tier function still exists';
  END IF;
  
  RAISE NOTICE 'Rollback 003 successful: All triggers and functions dropped';
END $$;

