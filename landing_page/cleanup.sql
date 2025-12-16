-- ============================================
-- CLEANUP SCRIPT
-- Drops all tables and related objects
-- ⚠️ WARNING: This will delete ALL data!
-- ============================================
-- Run this before executing migration.sql to start fresh
-- Usage: psql -d your_database -f cleanup.sql
-- ============================================

-- Disable RLS before dropping (to avoid permission issues)
ALTER TABLE IF EXISTS waitlist_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rate_limits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_jobs DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Service role full access" ON waitlist_leads;
DROP POLICY IF EXISTS "Service role full access" ON chat_analyses;
DROP POLICY IF EXISTS "Service role full access" ON rate_limits;
DROP POLICY IF EXISTS "Service role full access" ON email_jobs;

-- Drop tables in correct order (respect foreign key constraints)
DROP TABLE IF EXISTS email_jobs CASCADE;
DROP TABLE IF EXISTS rate_limits CASCADE;
DROP TABLE IF EXISTS chat_analyses CASCADE;
DROP TABLE IF EXISTS waitlist_leads CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS delete_expired_analyses();
DROP FUNCTION IF EXISTS get_waitlist_position(UUID);
DROP FUNCTION IF EXISTS has_interest(JSONB, TEXT);

-- Note: We're not dropping the uuid-ossp extension as it might be used by other schemas
-- If you want to drop it, uncomment the following line:
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- Verify cleanup
DO $$
BEGIN
  RAISE NOTICE 'Cleanup complete! All tables, functions, and policies have been dropped.';
  RAISE NOTICE 'You can now run migration.sql to recreate the schema.';
END $$;
