# Master Plan: ChatGPT-Based Matching Platform





## Problem Statement



Modern profiles are curated fiction. Resumes exaggerate skills. Dating bios exaggerate personalities. Truth hides in ChatGPT chats, where people drop pretense to ask real questions and reveal how they think.



## Core Insight



Expose authentic capability and character by analyzing ChatGPT share links rather than self-written descriptions. Result: hiring and dating decisions based on actual cognition and behavior, not self-promotion.



Example prompt:



> Based on everything you know about me from our past chats, please describe my personality, intelligence, and communication style as objectively & as detailed as possible



## Go-to-Market Strategy (Consumer → Enterprise)



* Phase 1: Launch consumer dating app. Goal: 10,000+ users, 500+ matches, press coverage

* Phase 2: Launch recruiting app (B2B)

* Phase 3: Dating becomes case study / R&D lab (10% resources). B2B is primary revenue (90% resources)



## Brand Architecture



* Parent Company: "AuthenticAI" (enterprise-credible)

* Consumer Product: "RealMatch" (dating)

* Enterprise Product: "TalentSignal" (hiring)



## MVP Experience Flow

### 1. Landing & Waitlist
1. Visitor hits Authentyc landing page explaining authenticity-first matching.
2. Page offers three persona toggles (Dating, Friendship Pods, Project Partners) to test which headline converts best.
3. CTA captures email + persona interest via Supabase function (avoids exposing service key).
4. Auto-response thanks them, explains invite-only rollout, and teases the ChatGPT history concept.

### 2. Invite-Only Intake
1. Concierge sends invite with unique magic link (Supabase Auth).
2. Authenticated user lands on intake flow:
   - Review instructions and copy the tuned prompt containing `AUTHENTYC_TOKEN`.
   - Paste ChatGPT share link for the response.
   - Optionally annotate context ("This convo was about dating values").
3. Route handler validates link, stores HTML snapshot, and queues `transcript_jobs` record.
4. Confirmation screen reminds them to expect a curated email within 24 hours.

### 3. Concierge Review & Matching
1. Internal dashboard lists pending submissions sorted by created_at.
2. Reviewer skims transcript snippet, confirms token, tags persona (dating/friendship/etc.).
3. Reviewer selects 2-3 curated matches or groups from `curated_entities` and adds rationale notes.
4. One-click triggers analysis worker, which calls OpenAI and saves structured traits.
5. Email composer preview shows traits + curated matches; concierge can tweak copy before sending.

### 4. Results Email & Follow-Up
1. Email subject: "Your Authentyc insights + first introductions".
2. Body includes: top three personality traits, communication style summary, curated matches/groups with compatibility notes, CTA back to dashboard.
3. Post-send webhook logs engagement; if no open within 48h, automated nudge email goes out (optional).
4. Dashboard displays status badges (Sent, Opened, Clicked) so concierge can follow up manually.

### 5. Feedback Collection
- Include quick thumbs-up/down block in email to capture perceived accuracy.
- Store responses in Supabase via `/api/email/feedback` endpoint linked from email buttons.
- High-signal feedback ("spot on", "needs work") drives prompt iterations and curated data updates.

## Deferred Modes & Features (Post-MVP)
- **Realtime Swiping UI**: Hold until transcript submission rate proves users will invest effort.
- **Peer-to-peer Matching Logic**: After 100+ analyzed users, revisit automated compatibility graph.
- **Hiring Workflow**: Maintain outline in separate doc; build once consumer segment validates authenticity scoring.
- **Mobile Apps / React Native**: Only when daily active metrics justify additional surfaces.
- **Ask-AI Why Streams**: Replace with static explanations until automation is justified.

## Technical Architecture (Concierge MVP)

### Single Next.js Application
- Next.js 14 (App Router) runs landing, intake, concierge views, and internal tooling in one repo.
- Supabase Auth + Postgres handle auth/storage; access via Supabase JS client inside Next server actions or route handlers.
- Styling: Tailwind CSS with a thin shadcn/ui layer for inputs/modals.
- Forms: React Hook Form + Zod only where client validation is needed (waitlist/intake).
- State management: rely on React Server Components and lightweight context; no global state libraries until realtime surfaces.
- API surface: typed `app/api/.../route.ts` handlers or server actions—skip tRPC for MVP.

### Project Structure (MVP)
```
app/
  page.tsx                   # Landing with multi-segment messaging tests
  waitlist/page.tsx          # Waitlist capture writes straight to Supabase
  intake/page.tsx            # Invite-only prompt copy + share link submit
  dashboard/page.tsx         # Concierge queue (protected via Supabase Auth)
  experiments/...            # Optional marketing experiments

lib/
  supabaseClient.ts          # Browser client
  server/supabase.ts         # Service-role client (server-only)
  prompts.ts                 # Prompt templates + checksum helpers
  emailTemplates.ts          # Result email HTML/text

app/api/
  share-link/validate/route.ts   # Fetch & parse ChatGPT share page
  transcripts/process/route.ts   # Trigger OpenAI analysis or queue job
  matches/send-email/route.ts    # Email results & compatibility summary

workers/
  processTranscript.ts       # Runnable script (manual CLI or Vercel cron)
  sendDigest.ts              # Optional follow-up email worker
```
- Single Vercel deployment; gate concierge routes behind Supabase RLS + middleware.
- Dashboard doubles as internal tooling—no separate admin app.

### Share Link Retrieval & Validation
- Require prompt token (e.g., `AUTHENTYC_TOKEN=abc123`) embedded in the user prompt so transcripts prove provenance.
- `share-link/validate` performs a standard `fetch` with descriptive `User-Agent`; ChatGPT share pages return static HTML so no Playwright/automation needed.
- Parse with `cheerio` to extract assistant response, message count, and confirm prompt checksum + token.
- On failure (captcha, 4xx, missing token), leave job `pending_review` for manual follow-up instead of aggressive retries to stay ToS-friendly.
- Store HTML snapshot in Supabase Storage with 30-day TTL; persist hashed share URL + metadata in Postgres for dedupe/audit.

### Concierge Processing Loop
1. Valid submissions create a `transcript_jobs` row (`status='pending_review'`).
2. Concierge dashboard lists pending jobs with parsed preview text.
3. Reviewer verifies authenticity, fixes obvious prompt typos, and presses “Run analysis”.
4. Worker script (manual CLI or cron) calls OpenAI (gpt-4o-mini) to structure traits into `chat_analyses`.
5. Reviewer curates 2-3 suggested matches/groups from `curated_profiles` or other consenting users, adding rationale notes.
6. `matches/send-email` merges traits + curated suggestions into HTML email via Resend/Postmark.
7. Post-send feedback (opens, replies) logged in Supabase for KPI tracking.
- Keep automation optional feature flags until completion rate proves value.

### Gradual Automation After Signal
- After >20 transcripts complete the loop, enable cron job to auto-run analysis for jobs marked `approved`.
- Auto-generate compatibility summaries against seeded archetype profiles before scaling peer-to-peer matching.
- Alert concierge (email/Slack webhook) when analysis confidence < threshold or checksum mismatch occurs.
- Still avoid headless browsers; if fetch success rate drops below 80%, revisit alternatives with explicit risk review.

#### Database Schema (MVP)

Users
```
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  prompt_token TEXT UNIQUE,
  onboarding_status TEXT DEFAULT 'invited', -- invited | submitted | analyzed
  last_share_url_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Waitlist Leads
```
CREATE TABLE waitlist_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT, -- landing, referral, manual
  persona_hint TEXT, -- dating, friendship, group, cofounder
  status TEXT DEFAULT 'new', -- new | contacted | scheduled | converted | archived
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Transcript Jobs
```
CREATE TABLE transcript_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  share_url_hash TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  prompt_template_id TEXT NOT NULL,
  message_count INTEGER,
  status TEXT DEFAULT 'pending_review', -- pending_review | approved | rejected | analyzed | emailed
  failure_reason TEXT,
  reviewer_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Chat Analyses
```
CREATE TABLE chat_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transcript_job_id UUID REFERENCES transcript_jobs(id) ON DELETE SET NULL,
  traits JSONB NOT NULL,
  summary TEXT,
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  model_version TEXT DEFAULT 'gpt-4o-mini:1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Curated Profiles & Groups
```
CREATE TABLE curated_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT CHECK (entity_type IN ('profile','group','opportunity')),
  title TEXT NOT NULL,
  blurb TEXT,
  traits JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Recommendation Log
```
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recommended_entity_id UUID REFERENCES curated_entities(id) ON DELETE SET NULL,
  rationale TEXT,
  email_job_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Email Jobs
```
CREATE TABLE email_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL, -- stored template variables
  status TEXT DEFAULT 'queued', -- queued | sent | failed
  provider_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Indexing & Retention
- Hash share URLs with SHA-256 before storage (`last_share_url_hash`, `share_url_hash`).
- Index `transcript_jobs` on `(status, created_at DESC)` for concierge queue.
- Schedule Supabase Storage bucket policy to auto-delete raw HTML after 30 days; retain hash + metadata for audit.
- Nightly job can archive `email_jobs` older than 90 days to keep table lean.

#### Row-Level Security (Supabase)
- Enable RLS on `users`, `chat_analyses`, `transcript_jobs`, `recommendations`, `email_jobs`.
- Authenticated users can see only their own records; concierge role (service key) bypasses via Supabase edge function.
- Waitlist table stays service-key only; landing page writes use anon key via Supabase function that whitelists fields.

Policies example:
```
CREATE POLICY "Users manage their analysis" ON chat_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users view own emails" ON email_jobs
  FOR SELECT USING (auth.uid() = user_id);
```

Concierge policy (via edge function or RLS override):
```
CREATE POLICY "Concierge access" ON transcript_jobs
  FOR ALL USING (
    auth.role() = 'service_role'
  ) WITH CHECK (auth.role() = 'service_role');
```

### Route Handlers & Server Actions (MVP)
- `POST /api/waitlist` → Stores email + persona hint in `waitlist_leads`; throttled by IP/cookie.
- `POST /api/share-link/validate` → Accepts `{ shareUrl, promptTemplateId }`, fetches HTML, validates checksum/token, stores snapshot to Supabase Storage, creates `transcript_jobs` row.
- `POST /api/transcripts/{id}/run` (server action) → Concierge-triggered; loads HTML from storage, calls OpenAI to extract traits, writes to `chat_analyses`, updates job status.
- `POST /api/transcripts/{id}/recommend` → Saves manual match notes + recommended curated entities.
- `POST /api/email/send` → Enqueues email job and calls provider (Resend/Postmark). Include idempotency key to avoid double send if concierge clicks twice.

### Email Templates & Delivery
- Templates live in `lib/emailTemplates.ts` with MJML/React-email components.
- Personalization tokens: `{firstName}`, `{topTraits}`, `{matchSummaries[]}`, `{nextSteps}`.
- Track opens/clicks via provider webhooks → Next API endpoint updates `email_jobs` status.
- Include plain-text alternative to keep deliverability high.

### Analytics & Instrumentation
- Use Vercel Analytics + PostHog snippet to track waitlist conversion, prompt copy completion, share link submission.
- Concierge dashboard logs manual outcomes (e.g., "user declined to share after reminder") into `transcript_jobs.failure_reason` for learning loops.
- Add lightweight logging (pino) inside route handlers; pipe to Logflare (Vercel integration) for quick debugging.

### Testing Focus
- Unit test prompt checksum + token validation (Jest).
- Integration test share-link handler with recorded fixture HTML.
- Smoke test worker script locally using `.env.test` and mock OpenAI client before shipping.



## Hosting and Deployment

### Infrastructure Choices
- **Vercel** (hobby tier) deploys the entire Next.js app, including API routes and server actions.
- **Supabase** (free tier) for Postgres, Auth, Storage, and Edge Functions used for concierge role actions.
- **Resend or Postmark** for transactional email delivery; keep provider selection flexible via env var.
- **Logflare + Vercel Analytics** for logging/metrics; PostHog snippet for product analytics.
- Optional: **Supabase Edge Function** can run scheduled jobs (auto-analysis) if Vercel cron limits are hit.

### Deployment Workflow
1. Push to `main` → Vercel builds & deploys preview.
2. Supabase migrations managed via SQL files committed with code (use `supabase db push`).
3. Concierge scripts (`workers/`) executed locally with service-role key or via Vercel cron job once automated.
4. Maintain `.env.example` that reflects all required keys for local dev.

### Operational Runbook (MVP)
- Landing waitlist live day 1; share-link intake behind invite-only feature flag (`NEXT_PUBLIC_INTAKE_ENABLED`).
- Concierge uses Supabase Auth account with `role=concierge`; middleware restricts dashboard route to that role.
- Daily manual checklist: review new waitlist leads, follow up via email, process submitted transcripts, send results.
- Weekly data hygiene: export anonymized metrics (submissions, completion rate, email engagement) for team review.

### Environment Variables
```
# Shared
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_INTAKE_ENABLED=false

# Server-only (Vercel)
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=  # or POSTMARK_TOKEN
CHAT_SHARE_BUCKET=authentyc-transcripts
AUTHENTYC_PROMPT_TOKEN=abc123
CONCIERGE_WEBHOOK_SECRET=
```
- Use Vercel project settings for server secrets; never expose service role key to client.
- Rotate `AUTHENTYC_PROMPT_TOKEN` if it ever leaks and update landing copy accordingly.

### Monitoring & Alerts
- Configure Resend webhooks to hit `/api/email/webhook` for bounce/complaint handling.
- Set Supabase storage usage alerts (30-day TTL should keep bucket small).
- Use Vercel deployment notifications in Slack/Email for visibility.
- Add simple health check endpoint (`/api/ping`) consumed by UptimeRobot once automation increases.

### Cost Snapshot (MVP)
- Vercel Hobby: $0
- Supabase Free: $0 (monitor 500MB limit)
- Resend Free tier: up to 3k emails/month
- PostHog Cloud Free: up to 1M events/month
- Domain: ~$12/year (Namecheap)
- Total MVP run-rate ≈ $12/year until volume grows.

