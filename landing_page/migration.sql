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
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint to validate interests array values
  CONSTRAINT interests_valid_values CHECK (
    interests @> '[]'::jsonb AND
    (
      SELECT bool_and(elem::text IN (
        '"hiring_recruiter"',
        '"hiring_jobseeker"',
        '"dating"',
        '"cofounder"',
        '"mastermind"',
        '"other"'
      ))
      FROM jsonb_array_elements(interests) elem
    )
  )
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
  category TEXT CHECK (category IN ('hiring', 'dating', 'founder')),
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
COMMENT ON COLUMN chat_analyses.category IS 'The matching category: hiring, dating, or founder';
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
  'PRIMARY DIRECTIVE: Follow this process exactly.

PHASE 1 - ASSESS EXISTING KNOWLEDGE:
First, analyze our complete chat history. Evaluate ONLY conversations that occurred BEFORE this session. Do not count anything I say in this current conversation.

For each question below, determine:
- Can you answer it substantively from our PAST chats? (not this session)
- Do you have specific examples, details, or patterns from our history?
- How many different conversations/time periods does this evidence come from?

PHASE 2 - RATE COMPLETENESS:
Based ONLY on pre-existing chat history, rate completeness from 1-10:

Rating Criteria:
1-2 = No relevant past chats. You know almost nothing about my career, skills, or work preferences. You would need to ask all questions.

3-4 = Minimal past context. You know 1-2 basic facts (e.g., "works in tech") but lack depth. You would need to ask 5+ questions.

5-6 = Partial context. You can answer 2-4 questions from past chats with some specificity (e.g., you know my role and a few technical skills), but significant gaps remain. Missing either:
- Technical details (specific skills, technologies, proficiency levels, projects), OR
- Non-technical aspects (work style, preferences, values, communication patterns)

7-8 = Good context. You can answer 5-6 questions from past chats with specific examples. You have BOTH technical and non-technical insights, but some aspects lack depth or recent updates.

9-10 = Comprehensive context. You can answer all 7 questions with specific, detailed examples from multiple conversations across different time periods. You have:
- Detailed technical knowledge (specific skills, technologies, proficiency levels, preferred tools, architectural preferences)
- Deep non-technical understanding (work style, values, communication preferences, what energizes/drains me)
- Evidence from at least 3+ separate conversations over time
- Recent data (within last few months)

PHASE 3 - MANDATORY OUTPUT FORMAT:
You must output EXACTLY in this format:

--- COMPLETENESS ASSESSMENT ---
RATING: [X/10]

EVIDENCE FROM PAST CHATS:
[List specific examples from our chat history that support your rating. Include approximate timeframes like "In our conversation about [topic] a few weeks ago..." or "Based on multiple discussions over the past months...". If rating is below 7, explicitly state what''s missing.]

QUESTIONS I CAN ALREADY ANSWER:
[List which of the 7 questions you can answer from past chats, with brief supporting evidence]

QUESTIONS I NEED TO ASK:
[List which questions require new information]
--- END ASSESSMENT ---

PHASE 4 - INTERVIEW (if rating < 7):
If rating is below 7, stop here and say: "Your chat history needs more depth before generating an authentic profile. Consider having more conversations with me about your work, projects, and career over time, then try again."

PHASE 4 - INTERVIEW (if rating ≥ 7):
Ask only the questions you listed in "QUESTIONS I NEED TO ASK" one at a time. After each answer, ask the next question. Do not ask questions you can already answer.

PHASE 5 - FINAL SUMMARY (only after all needed questions are answered):
Write a comprehensive summary that:
- Integrates answers from this session WITH specific examples from our past chats
- Includes specific technical skills, programming languages, frameworks, and proficiency levels (e.g., "expert in React and TypeScript, comfortable with Python for data analysis")
- Cites specific examples from past conversations (e.g., "As mentioned in our discussion about [project]...")
- Includes work style, preferences, and values with concrete examples
- Is 300-500 words
- ENDS with the exact line: "COMPLETENESS RATING: [X/10]"

CRITICAL: Your FINAL response must ONLY contain the summary. No closing remarks, no "If you''d like...", no offers for assistance.

---

THE 7 QUESTIONS:
1. What aspects of your current or most recent role energize you the most, and what drains you?
2. Describe a recent work challenge you handled well - what was your approach?
3. What does your ideal work environment look like? (team size, pace, structure, autonomy)
4. What are you optimizing for in your next role? (learning, impact, compensation, flexibility, etc.)
5. How do you prefer to receive feedback and recognition?
6. What kind of problems or projects do you want to spend most of your time on?
7. What would make you excited to start work each day?

Begin with PHASE 1 assessment.',
  '{"title": "Career Goals", "description": "Reveals work style, problem-solving approach, and professional values", "category": "hiring", "type": "conversation"}'::jsonb,
  true
);

-- Conversation Starter: Dating
INSERT INTO prompts (key, version, content, metadata, is_active) VALUES (
  'conversation-dating',
  1,
  'PRIMARY DIRECTIVE: Follow this process exactly.

PHASE 1 - ASSESS EXISTING KNOWLEDGE:
First, analyze our complete chat history. Evaluate ONLY conversations that occurred BEFORE this session. Do not count anything I say in this current conversation.

For each question below, determine:
- Can you answer it substantively from our PAST chats? (not this session)
- Do you have specific examples, personality insights, or patterns from our history?
- How many different conversations/contexts does this evidence come from?

PHASE 2 - RATE COMPLETENESS:
Based ONLY on pre-existing chat history, rate completeness from 1-10:

Rating Criteria:
1-2 = No relevant past chats. You know almost nothing about my personality, values, or lifestyle. You would need to ask all questions.

3-4 = Minimal past context. You know 1-2 basic facts (e.g., "lives in [city]") but lack depth. You would need to ask 5+ questions.

5-6 = Partial context. You can answer 2-4 questions from past chats with some specificity, but significant gaps remain. Missing either:
- Lifestyle/interests details (hobbies, activities, daily routines, preferences), OR
- Emotional/relational aspects (communication style, conflict resolution, values, emotional needs)

7-8 = Good context. You can answer 5-6 questions from past chats with specific examples. You have BOTH lifestyle and emotional insights, drawn from multiple conversations, but some aspects lack depth.

9-10 = Comprehensive context. You can answer all 7 questions with specific, detailed examples from multiple conversations across different contexts. You have:
- Detailed lifestyle knowledge (hobbies, interests, routines, preferences, social patterns)
- Deep personality understanding (communication style, emotional patterns, values, stress responses)
- Evidence from at least 3+ separate conversations over time
- Examples from different life contexts (work, relationships, challenges, joys)

PHASE 3 - MANDATORY OUTPUT FORMAT:
You must output EXACTLY in this format:

--- COMPLETENESS ASSESSMENT ---
RATING: [X/10]

EVIDENCE FROM PAST CHATS:
[List specific examples from our chat history that support your rating. Include contexts like "When you discussed [situation]..." or "Based on multiple conversations about [topic]...". If rating is below 7, explicitly state what''s missing.]

QUESTIONS I CAN ALREADY ANSWER:
[List which of the 7 questions you can answer from past chats, with brief supporting evidence]

QUESTIONS I NEED TO ASK:
[List which questions require new information]
--- END ASSESSMENT ---

PHASE 4 - INTERVIEW (if rating < 7):
If rating is below 7, stop here and say: "Your chat history needs more depth before generating an authentic profile. Consider having more conversations with me about your life, interests, and experiences over time, then try again."

PHASE 4 - INTERVIEW (if rating ≥ 7):
Ask only the questions you listed in "QUESTIONS I NEED TO ASK" one at a time. After each answer, ask the next question. Do not ask questions you can already answer.

PHASE 5 - FINAL SUMMARY (only after all needed questions are answered):
Write a comprehensive summary that:
- Integrates answers from this session WITH specific examples from our past chats
- Includes specific lifestyle preferences, hobbies, interests, and personality traits (e.g., "enjoys hiking and outdoor photography", "values deep intellectual conversations", "introverted but enjoys small group settings")
- Cites specific examples from past conversations (e.g., "As you mentioned when discussing [experience]...")
- Includes communication style, emotional patterns, and values with concrete examples
- Is 300-500 words
- ENDS with the exact line: "COMPLETENESS RATING: [X/10]"

CRITICAL: Your FINAL response must ONLY contain the summary. No closing remarks, no "If you''d like...", no offers for assistance.

---

THE 7 QUESTIONS:
1. What does a typical ''good day'' look like for you? What small things matter most?
2. Think of a recent disagreement or frustration - how did you handle it and what would your ideal resolution have looked like?
3. What do you need from a partner when you''re stressed or going through a difficult time?
4. What activities or experiences do you want to share regularly with a partner?
5. How do you like to show care and appreciation to people you''re close to?
6. What values or dealbreakers are non-negotiable for you in a relationship?
7. What does ''quality time together'' mean to you - what does it look like in practice?

Begin with PHASE 1 assessment.',
  '{"title": "Relationship Goals", "description": "Shows authentic personality, communication style, and emotional intelligence", "category": "dating", "type": "conversation"}'::jsonb,
  true
);

-- Conversation Starter: Founder
INSERT INTO prompts (key, version, content, metadata, is_active) VALUES (
  'conversation-founder',
  1,
  'PRIMARY DIRECTIVE: Follow this process exactly.

PHASE 1 - ASSESS EXISTING KNOWLEDGE:
First, analyze our complete chat history. Evaluate ONLY conversations that occurred BEFORE this session. Do not count anything I say in this current conversation.

For each question below, determine:
- Can you answer it substantively from our PAST chats? (not this session)
- Do you have specific examples, business insights, or patterns from our history?
- How many different conversations/contexts does this evidence come from?

PHASE 2 - RATE COMPLETENESS:
Based ONLY on pre-existing chat history, rate completeness from 1-10:

Rating Criteria:
1-2 = No relevant past chats. You know almost nothing about my professional background, skills, or working style. You would need to ask all questions.

3-4 = Minimal past context. You know 1-2 basic facts (e.g., "interested in startups") but lack depth. You would need to ask 5+ questions.

5-6 = Partial context. You can answer 2-4 questions from past chats with some specificity, but significant gaps remain. Missing either:
- Technical/domain expertise (specific skills, industry experience, business domains, strengths/weaknesses), OR
- Collaboration/leadership aspects (decision-making style, working patterns, team dynamics, communication preferences)

7-8 = Good context. You can answer 5-6 questions from past chats with specific examples. You have BOTH technical and interpersonal insights, but some aspects lack depth or concrete examples.

9-10 = Comprehensive context. You can answer all 7 questions with specific, detailed examples from multiple conversations across different contexts. You have:
- Detailed technical/domain knowledge (skills, industry experience, business domains like "B2B SaaS" or "fintech", specific strengths in areas like product, engineering, sales)
- Deep collaboration understanding (decision-making patterns, leadership style, team dynamics, conflict resolution, communication preferences)
- Evidence from at least 3+ separate conversations over time
- Examples of past projects, startups, or entrepreneurial experiences

PHASE 3 - MANDATORY OUTPUT FORMAT:
You must output EXACTLY in this format:

--- COMPLETENESS ASSESSMENT ---
RATING: [X/10]

EVIDENCE FROM PAST CHATS:
[List specific examples from our chat history that support your rating. Include contexts like "In our discussions about [project/business]..." or "Based on conversations about [topic]...". If rating is below 7, explicitly state what''s missing.]

QUESTIONS I CAN ALREADY ANSWER:
[List which of the 7 questions you can answer from past chats, with brief supporting evidence]

QUESTIONS I NEED TO ASK:
[List which questions require new information]
--- END ASSESSMENT ---

PHASE 4 - INTERVIEW (if rating < 7):
If rating is below 7, stop here and say: "Your chat history needs more depth before generating an authentic profile. Consider having more conversations with me about your projects, business ideas, and professional experiences over time, then try again."

PHASE 4 - INTERVIEW (if rating ≥ 7):
Ask only the questions you listed in "QUESTIONS I NEED TO ASK" one at a time. After each answer, ask the next question. Do not ask questions you can already answer.

PHASE 5 - FINAL SUMMARY (only after all needed questions are answered):
Write a comprehensive summary that:
- Integrates answers from this session WITH specific examples from our past chats
- Includes specific technical skills, industry experience, and business domains (e.g., "experienced in B2B SaaS with background in fintech", "strong in product development and technical architecture, less experienced in sales")
- Cites specific examples from past conversations (e.g., "As demonstrated in your work on [project]...")
- Includes decision-making style, collaboration patterns, and leadership approach with concrete examples
- Mentions any previous startup or entrepreneurial experience
- Is 300-500 words
- ENDS with the exact line: "COMPLETENESS RATING: [X/10]"

CRITICAL: Your FINAL response must ONLY contain the summary. No closing remarks, no "If you''d like...", no offers for assistance.

---

THE 7 QUESTIONS:
1. Walk me through how you typically make important decisions under time pressure or uncertainty.
2. Describe a past collaboration that went really well - what made it work?
3. When you''ve worked with others who have different working styles than you, what challenges came up and how did you handle them?
4. What energizes you most about building something new? What parts do you tend to avoid or procrastinate on?
5. How do you prefer to divide responsibilities and make decisions in a team? (consensus, delegation, other?)
6. What kind of feedback, communication, or support do you need from co-founders or teammates?
7. What would be a dealbreaker for you in a co-founder or early team member?

Begin with PHASE 1 assessment.',
  '{"title": "Startup & Team Fit", "description": "Reveals collaboration style, decision-making patterns, and leadership approach", "category": "founder", "type": "conversation"}'::jsonb,
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
-- 8. HELPER FUNCTIONS
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
