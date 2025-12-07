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
  primary_interest TEXT NOT NULL CHECK (
    primary_interest IN (
      'hiring_recruiter',
      'hiring_jobseeker',
      'dating',
      'cofounder',
      'mastermind',
      'other'
    )
  ),
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
CREATE INDEX idx_waitlist_interest ON waitlist_leads(primary_interest);

-- ============================================
-- 2. CHAT ANALYSES (Preview Feature)
-- ============================================
CREATE TABLE chat_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Privacy: hash the share URL instead of storing it
  share_url_hash TEXT NOT NULL UNIQUE,

  -- Analysis results
  personality_summary TEXT,
  traits JSONB NOT NULL,
  communication_style TEXT,
  problem_solving_approach TEXT,
  emotional_intelligence_score INTEGER CHECK (emotional_intelligence_score BETWEEN 0 AND 100),

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

CREATE INDEX idx_analyses_hash ON chat_analyses(share_url_hash);
CREATE INDEX idx_analyses_expires ON chat_analyses(expires_at);

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
-- 6. HELPER FUNCTIONS
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
