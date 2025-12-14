-- ============================================
-- ADD COMPLETENESS RATING COLUMN
-- Migration for completeness rating feature
-- ============================================

-- Add completeness rating column to chat_analyses table
ALTER TABLE chat_analyses
  ADD COLUMN IF NOT EXISTS completeness_rating INTEGER CHECK (completeness_rating BETWEEN 1 AND 10);

-- Add index for rating queries (useful for analytics)
CREATE INDEX IF NOT EXISTS idx_analyses_completeness_rating ON chat_analyses(completeness_rating);

-- Add comment explaining the column
COMMENT ON COLUMN chat_analyses.completeness_rating IS 'Completeness rating (1-10) from ChatGPT assessment of user chat history depth. Null if not available or error occurred during extraction.';
