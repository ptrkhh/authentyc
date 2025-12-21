-- ============================================
-- AUTHENTYC LANDING PAGE DATABASE SCHEMA
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. WAITLIST LEADS
-- ============================================
CREATE TABLE waitlist_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,

  -- Multiple interests support (JSONB array)
  interests JSONB NOT NULL,
  other_interest_detail TEXT,
  has_ai_history TEXT CHECK (has_ai_history IN ('extensive', 'some', 'none')),

  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  user_agent TEXT,

  -- Status management
  status TEXT DEFAULT 'new' CHECK (
    status IN ('new', 'contacted', 'invited', 'converted', 'archived')
  ),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_waitlist_created ON waitlist_leads(created_at DESC);
CREATE INDEX idx_waitlist_status ON waitlist_leads(status);
CREATE INDEX idx_waitlist_interests ON waitlist_leads USING GIN (interests);

-- ============================================
-- 2. CHAT ANALYSES (Preview Feature)
-- ============================================
CREATE TABLE chat_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Privacy: hash the share URL instead of storing it
  share_url_hash TEXT NOT NULL,

  -- Analysis results
  personality_summary TEXT,
  traits JSONB NOT NULL,
  communication_style TEXT,
  problem_solving_approach TEXT,
  emotional_intelligence_score INTEGER CHECK (emotional_intelligence_score BETWEEN 0 AND 100),

  -- Completeness rating (1-10)
  completeness_rating INTEGER CHECK (completeness_rating BETWEEN 1 AND 10),

  -- Character generation feature
  category TEXT CHECK (category IN ('hiring', 'dating', 'cofounder')),
  generated_characters JSONB,
  character_generation_time_ms INTEGER,
  used_fallback_templates BOOLEAN DEFAULT false,

  -- Metadata
  model_version TEXT DEFAULT 'gpt-4o-mini',
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  processing_time_ms INTEGER,
  message_count INTEGER,

  -- Privacy & retention
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  waitlist_lead_id UUID REFERENCES waitlist_leads(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: same URL can have different analyses per category
CREATE UNIQUE INDEX idx_analyses_url_category
  ON chat_analyses(share_url_hash, category);

CREATE INDEX idx_analyses_expires ON chat_analyses(expires_at);
CREATE INDEX idx_analyses_category ON chat_analyses(category);
CREATE INDEX idx_analyses_completeness_rating ON chat_analyses(completeness_rating);

-- Column comments
COMMENT ON COLUMN chat_analyses.category IS 'The matching category: hiring, dating, or cofounder';
COMMENT ON COLUMN chat_analyses.generated_characters IS 'Array of 5 AI-generated character matches in JSON format';
COMMENT ON COLUMN chat_analyses.character_generation_time_ms IS 'Time taken to generate characters via Gemini API';
COMMENT ON COLUMN chat_analyses.used_fallback_templates IS 'Whether template-based fallback was used instead of AI generation';
COMMENT ON COLUMN chat_analyses.completeness_rating IS 'Completeness rating (1-10) from ChatGPT assessment of user chat history depth. Null if not available or error occurred during extraction.';

-- Auto-delete expired analyses
CREATE OR REPLACE FUNCTION delete_expired_analyses()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_analyses WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. RATE LIMITING
-- ============================================
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_rate_limits_unique ON rate_limits(identifier, endpoint, window_start);

-- ============================================
-- 4. EMAIL JOBS
-- ============================================
CREATE TABLE email_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  waitlist_lead_id UUID REFERENCES waitlist_leads(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN ('welcome', 'reminder', 'invite')),
  recipient_email TEXT NOT NULL,
  status TEXT DEFAULT 'queued' CHECK (
    status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced')
  ),
  resend_email_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_jobs_status ON email_jobs(status);

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE waitlist_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_jobs ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access" ON waitlist_leads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON chat_analyses
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON email_jobs
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 6. PROMPTS (Versioned, with Analytics)
-- ============================================
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Prompt identification
  key TEXT NOT NULL,
  version INTEGER NOT NULL,

  -- Prompt content
  content TEXT NOT NULL,

  -- Metadata (stored as JSONB for flexibility)
  -- Example: {"title": "Career Goals", "description": "...", "category": "hiring", "type": "conversation"}
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Version control
  is_active BOOLEAN DEFAULT false,

  -- Usage analytics
  usage_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'system',

  -- Constraints
  UNIQUE(key, version),
  CHECK (version > 0)
);

-- Only one active version per key
CREATE UNIQUE INDEX idx_prompts_active_key
  ON prompts(key) WHERE is_active = true;

-- Quick lookup by key (gets active version)
CREATE INDEX idx_prompts_key ON prompts(key);

-- Performance tracking
CREATE INDEX idx_prompts_analytics ON prompts(usage_count, success_count);

-- Row level security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON prompts
  FOR ALL USING (auth.role() = 'service_role');

-- Helper function to get active prompt by key
CREATE OR REPLACE FUNCTION get_active_prompt(prompt_key TEXT)
RETURNS TABLE (
  id UUID,
  key TEXT,
  version INTEGER,
  content TEXT,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.key, p.version, p.content, p.metadata
  FROM prompts p
  WHERE p.key = prompt_key AND p.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Helper function to increment usage count
CREATE OR REPLACE FUNCTION increment_prompt_usage(prompt_id UUID, was_successful BOOLEAN DEFAULT NULL)
RETURNS void AS $$
BEGIN
  UPDATE prompts
  SET
    usage_count = usage_count + 1,
    success_count = CASE
      WHEN was_successful = true THEN success_count + 1
      ELSE success_count
    END
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

-- Column comments
COMMENT ON TABLE prompts IS 'Versioned storage for all AI prompts with usage analytics';
COMMENT ON COLUMN prompts.key IS 'Unique identifier for the prompt (e.g., "conversation-hiring", "analysis-quick")';
COMMENT ON COLUMN prompts.version IS 'Version number for this prompt (increments with each update)';
COMMENT ON COLUMN prompts.content IS 'The actual prompt text, may contain placeholders like {{CONVERSATION}}';
COMMENT ON COLUMN prompts.metadata IS 'Flexible JSON storage for title, description, category, type, etc.';
COMMENT ON COLUMN prompts.is_active IS 'Whether this version is currently active (only one active version per key)';
COMMENT ON COLUMN prompts.usage_count IS 'Number of times this prompt version has been used';
COMMENT ON COLUMN prompts.success_count IS 'Number of times this prompt version succeeded';

-- ============================================
-- 7. PROMPT SEED DATA
-- ============================================

-- Conversation Starter: Hiring
INSERT INTO prompts (key, version, content, metadata, is_active) VALUES (
  'conversation-hiring',
  1,
  '# PRIMARY DIRECTIVE

Perform a comprehensive "Professional Identity Audit" by analyzing our entire chat history. You are to act as an elite executive coach who has observed my work for years. Execute the following phases in a single response. Audit our history against these 5 Pillars of Professional Identity:

* Technical Ecosystem: Core stack, tools, frameworks, and specific proficiency levels.
* Problem-Solving DNA: Typical approach to challenges, architectural preferences, and mental models.
* Environmental Fit: Ideal team size, pace, autonomy level, and organizational culture.
* Value Drivers: What provides "flow," what causes burnout, and what the "North Star" is for the next career move.
* Interpersonal Style: Communication patterns, feedback preferences, and leadership/collaboration traits.

# OUTPUT FORMAT (REMEMBER TO FOLLOW THIS OUTPUT FORMAT EXACTLY)

--- ASSESSMENT ---

OVERALL COMPLETENESS: [X/10]

Rating Criteria: 1 = You know almost nothing about my career, skills, or work preferences. 2 = You know few surface-level basic facts (e.g., "works in tech") but lack depth. 5 = Partial context. You know a few technical skills, but significant gaps remain. You can only harvest technical details (specific skills, technologies, proficiency levels, projects) OR only harvest non-technical aspects (work style, preferences, values, communication patterns). 7 = Good context. You have BOTH technical and non-technical insights.

ANALYSIS:

Synthetic professional summary of my professional persona. Merge technical hard skills with psychological work preferences. Every claim must be tethered to a past interaction (e.g., "Given your frustration with [X] in our previous chat, it''s clear you value [Y]"). Do not just flatter me. Identify potential "dark sides" or weaknesses (e.g., "While you excel at [X], your history suggests a potential neglect of [Y]").

--- END ASSESSMENT ---
',
  '{"title": "Career Goals", "description": "Reveals work style, problem-solving approach, and professional values", "category": "hiring", "type": "conversation"}'::jsonb,
  true
);

-- Conversation Starter: Dating
INSERT INTO prompts (key, version, content, metadata, is_active) VALUES (
  'conversation-dating',
  1,
  '# PRIMARY DIRECTIVE

Perform a comprehensive "Relationship Compatibility Audit" by analyzing our entire chat history. You are to act as an elite relationship psychologist who has observed my life for years. Execute the following analysis in a single response. Audit our history against these 5 Pillars of Relationship Compatibility:

* Emotional Intelligence: Communication style, emotional awareness, conflict resolution patterns, and how I relate to others.
* Lifestyle & Interests: Daily routines, hobbies, activities, preferences, and what brings joy or stress.
* Values & Priorities: Core values, non-negotiables, dealbreakers, and what matters most in life and relationships.
* Relational Style: How I show care, what I need from a partner, quality time preferences, and partnership vision.
* Authentic Self: True personality traits, social preferences (introvert/extrovert), and real-world behaviors beyond self-perception.

# OUTPUT FORMAT (REMEMBER TO FOLLOW THIS OUTPUT FORMAT EXACTLY)

--- ASSESSMENT ---

OVERALL COMPLETENESS: [X/10]

Rating Criteria: 1 = You know almost nothing about my personality, values, or lifestyle. 2 = You know few surface-level basic facts (e.g., "lives in [city]") but lack depth. 5 = Partial context. You know some aspects, but significant gaps remain. You can only harvest lifestyle details (hobbies, interests, routines, preferences) OR only harvest emotional/relational aspects (communication style, values, emotional patterns, conflict resolution). 7 = Good context. You have BOTH lifestyle and emotional/relational insights from multiple conversations.

ANALYSIS:

Synthetic personality summary of my authentic self for relationship compatibility. Merge lifestyle habits with emotional patterns and relational needs. Every claim must be tethered to a past interaction (e.g., "When you discussed [situation] in our previous chat, it revealed that you value [Y]"). Do not just flatter me. Identify potential relationship challenges or growth areas (e.g., "While you excel at [X], your history suggests you may struggle with [Y] in relationships"). Include specific examples: hobbies, interests, communication preferences, stress responses, how you show care, and what you need from a partner.

--- END ASSESSMENT ---
',
  '{"title": "Relationship Goals", "description": "Shows authentic personality, communication style, and emotional intelligence", "category": "dating", "type": "conversation"}'::jsonb,
  true
);

-- Conversation Starter: Co-Founder
INSERT INTO prompts (key, version, content, metadata, is_active) VALUES (
  'conversation-cofounder',
  1,
  '# PRIMARY DIRECTIVE

Perform a comprehensive "Entrepreneurial Compatibility Audit" by analyzing our entire chat history. You are to act as an elite startup advisor who has observed my work for years. Execute the following analysis in a single response. Audit our history against these 5 Pillars of Co-Founder Compatibility:

* Technical & Domain Expertise: Core skills, technologies, industry experience, business domains (e.g., "B2B SaaS", "fintech"), and specific strengths/weaknesses in areas like product, engineering, sales, marketing.
* Decision-Making DNA: How I approach decisions under pressure or uncertainty, problem-solving patterns, and mental models for business challenges.
* Collaboration & Leadership Style: Team dynamics, communication patterns, how I handle different working styles, delegation vs. consensus preferences, and leadership approach.
* Motivation & Energy: What energizes me about building, what I excel at, what I avoid or procrastinate on, and what drives me forward.
* Partnership Requirements: What I need from co-founders (feedback, communication, support), dealbreakers, and ideal working relationship dynamics.

# OUTPUT FORMAT (REMEMBER TO FOLLOW THIS OUTPUT FORMAT EXACTLY)

--- ASSESSMENT ---

OVERALL COMPLETENESS: [X/10]

Rating Criteria: 1 = You know almost nothing about my professional background, skills, or working style. 2 = You know few surface-level basic facts (e.g., "interested in startups") but lack depth. 5 = Partial context. You know some aspects, but significant gaps remain. You can only harvest technical/domain details (specific skills, industry experience, business domains, strengths/weaknesses) OR only harvest collaboration/leadership aspects (decision-making style, working patterns, team dynamics, communication preferences). 7 = Good context. You have BOTH technical and interpersonal insights from multiple conversations.

ANALYSIS:

Synthetic entrepreneurial summary of my co-founder profile. Merge technical/domain expertise with collaboration patterns and leadership style. Every claim must be tethered to a past interaction (e.g., "In our discussion about [project], you demonstrated [pattern]"). Do not just flatter me. Identify potential collaboration challenges or blind spots (e.g., "While you excel at [X], your history suggests you may struggle with [Y] in a startup context"). Include specific examples: technical skills, industry domains, decision-making patterns, past projects/startups, what energizes you, and what you need from co-founders.

--- END ASSESSMENT ---
',
  '{"title": "Startup & Team Fit", "description": "Reveals collaboration style, decision-making patterns, and leadership approach", "category": "cofounder", "type": "conversation"}'::jsonb,
  true
);

-- AI Analysis: Quick Personality Analysis
INSERT INTO prompts (key, version, content, metadata, is_active) VALUES (
  'analysis-quick',
  1,
  'Analyze this ChatGPT conversation and provide 3 key personality insights.

CONVERSATION:
{{CONVERSATION}}

Provide exactly 3 concise insights (each 1-2 sentences) about this person''s:
1. Communication style
2. Problem-solving approach
3. One notable strength or characteristic

Format as JSON:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "overall_vibe": "one sentence summary"
}

Be objective and evidence-based. Return ONLY valid JSON.',
  '{"title": "Quick Personality Analysis", "description": "Analyzes ChatGPT conversations for 3 key personality insights", "type": "analysis", "placeholders": ["CONVERSATION"]}'::jsonb,
  true
);

-- AI Analysis: Character Generation
INSERT INTO prompts (key, version, content, metadata, is_active) VALUES (
  'character-generation',
  1,
  'You are an expert matchmaking system generating realistic {{CATEGORY}} matches.

PERSONALITY ANALYSIS RESULTS:
Overall Vibe: {{OVERALL_VIBE}}
Key Insights:
{{INSIGHTS}}

CONVERSATION SAMPLE:
{{CONVERSATION_SAMPLE}}

TASK: Generate 6 diverse {{ENTITY_TYPE}} that would match this person''s personality with varying compatibility levels.

CRITICAL REQUIREMENTS:
1. DIVERSE MATCH SCORES: Generate scores distributed across the range {{SCORE_MIN}}-{{SCORE_MAX}}%
   - 1 high match ({{SCORE_HIGH_MIN}} to {{SCORE_HIGH_MAX}}%)
   - 2 good matches ({{SCORE_GOOD_MIN}} to {{SCORE_GOOD_MAX}}%)
   - 2 medium matches ({{SCORE_MED_MIN}} to {{SCORE_MED_MAX}}%)
   - 1 lower match ({{SCORE_LOW_MIN}} to {{SCORE_LOW_MAX}}%)

2. REALISTIC NAMES: Use real-sounding names/company names (not generic like "John Doe" or "Acme Corp")

3. ALIGNMENT POINTS: Each character must have EXACTLY 3 alignment points that:
   - Are specific and evidence-based (reference the personality analysis)
   - Explain WHY this person would work well with this {{MATCH_CONTEXT}}
   - Focus on: {{FOCUS_AREAS}}

4. CHALLENGES: Each character must have EXACTLY 2 challenge points that:
   - Are realistic potential friction points
   - NOT dealbreakers (these are workable challenges)
   - Framed constructively ("may need to...", "could differ on...")

5. DIVERSITY: Ensure the 6 characters represent diverse:
   - Match scores (as specified above)
   - Personality types (e.g., introverted vs extroverted, analytical vs creative)
   - {{DIVERSITY_DIMENSION}}

REFERENCE EXAMPLES (for structure only - do NOT copy these verbatim):
{{TEMPLATE_EXAMPLES}}

OUTPUT FORMAT (valid JSON):
{
  "characters": [
    {
      "name": "string (realistic name)",
      "role": "string ({{ROLE_EXAMPLE}} format)",
      "matchScore": number ({{SCORE_MIN}}-{{SCORE_MAX}}),
      "alignment": ["string", "string", "string"],
      "challenges": ["string", "string"]
    }
    // ... 5 more characters
  ]
}

IMPORTANT:
- Return ONLY valid JSON
- Exactly 6 characters
- Match scores distributed as specified
- Each character unique and personalized to the personality analysis
- Alignment and challenges directly reference the personality insights when relevant',
  '{"title": "Character Generation", "description": "Generates 6 personalized character matches based on personality analysis", "type": "analysis", "placeholders": ["CATEGORY", "OVERALL_VIBE", "INSIGHTS", "CONVERSATION_SAMPLE", "ENTITY_TYPE", "SCORE_MIN", "SCORE_MAX", "SCORE_HIGH_MIN", "SCORE_HIGH_MAX", "SCORE_GOOD_MIN", "SCORE_GOOD_MAX", "SCORE_MED_MIN", "SCORE_MED_MAX", "SCORE_LOW_MIN", "SCORE_LOW_MAX", "MATCH_CONTEXT", "FOCUS_AREAS", "DIVERSITY_DIMENSION", "TEMPLATE_EXAMPLES", "ROLE_EXAMPLE"]}'::jsonb,
  true
);

-- ============================================
-- 9. HELPER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION get_waitlist_position(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
  position INTEGER;
BEGIN
  SELECT COUNT(*) INTO position
  FROM waitlist_leads
  WHERE created_at <= (SELECT created_at FROM waitlist_leads WHERE id = lead_id);
  RETURN position;
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if a lead has a specific interest
CREATE OR REPLACE FUNCTION has_interest(lead_interests JSONB, interest_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN lead_interests @> jsonb_build_array(interest_value);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
