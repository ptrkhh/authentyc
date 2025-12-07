-- ============================================
-- ADD CHARACTER GENERATION COLUMNS
-- Migration for AI-generated character matches feature
-- ============================================

-- Add new columns to chat_analyses table
ALTER TABLE chat_analyses
  ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('hiring', 'dating', 'founder')),
  ADD COLUMN IF NOT EXISTS generated_characters JSONB,
  ADD COLUMN IF NOT EXISTS character_generation_time_ms INTEGER,
  ADD COLUMN IF NOT EXISTS used_fallback_templates BOOLEAN DEFAULT false;

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_analyses_category ON chat_analyses(category);

-- Update unique constraint to include category
-- First drop the old unique constraint on share_url_hash
ALTER TABLE chat_analyses DROP CONSTRAINT IF EXISTS chat_analyses_share_url_hash_key;

-- Add new composite unique constraint: same URL can have different analyses per category
CREATE UNIQUE INDEX IF NOT EXISTS idx_analyses_url_category
  ON chat_analyses(share_url_hash, category);

-- Add comment explaining the schema
COMMENT ON COLUMN chat_analyses.category IS 'The matching category: hiring, dating, or founder';
COMMENT ON COLUMN chat_analyses.generated_characters IS 'Array of 5 AI-generated character matches in JSON format';
COMMENT ON COLUMN chat_analyses.character_generation_time_ms IS 'Time taken to generate characters via Gemini API';
COMMENT ON COLUMN chat_analyses.used_fallback_templates IS 'Whether template-based fallback was used instead of AI generation';
