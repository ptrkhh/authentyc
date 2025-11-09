# Master Plan: ChatGPT History-Based Matching Platform

## Problem Statement
Modern profiles are curated fiction. Resumes exaggerate skills. Dating bios exaggerate personalities. Truth hides in ChatGPT chats, where people drop pretense to ask real questions and reveal how they think.

## Core Insight
Expose authentic capability and character by analyzing ChatGPT share links rather than self-written descriptions. Result: hiring and dating decisions based on actual cognition and behavior, not self-promotion.

## Example Prompt
Based on everything you know about me from our past chats, please describe my personality, intelligence, and communication style as objectively and as detailed as possible.

## Why ChatGPT?
80% marketshare!

## Go-to-Market Strategy (Consumer → Enterprise)
- Phase 1: Launch consumer dating app. Goal: 10,000+ users, 500+ matches, press coverage.
- Phase 2: Launch recruiting app (B2B).
- Phase 3: Dating becomes case study / R&D lab (10% resources). B2B is primary revenue (90% resources).

## Initial Segment Experiments (Interpersonal Use Cases)
- **Dating Matches**: Baseline hypothesis; leverage existing swiping mental model and high willingness to share romantic context.
- **Intentional Friendships**: Pair people seeking deeper friendships around life transitions (new city, career change) where ChatGPT usage signals curiosity and values.
- **Accountability / Group Chats**: Form 3-5 person pods (language learning, fitness, founders) using chat history to assess follow-through and communication style.
- **Co-founder / Project Partner Matching**: Target builders who already collaborate with AI agents; their transcripts showcase problem-solving depth.
- Collect demand signals from waitlist copy variants and manual outreach before committing engineering time to any non-dating vertical.
## Brand Architecture (names haven’t been decided)
- Parent Company: “Authentyc.AI” (enterprise-credible).
- Consumer Product: “RealMatch” (dating).
- Enterprise Product: “TalentSignal” (hiring).

## User Flow – Dating Version
### Onboarding Flow
1. **Example Profiles (Pre-Registration)**
    - User swipes on 5-10 highly-rated profiles without login.
    - Saves pending swipe in localStorage.
2. **Basic Info**
    - Name.
    - Photo (Supabase Storage).
    - Gender (man, woman, non-binary, prefer-not-to-say).
3. **Copy & Paste Instructions**
    - App shows predefined prompt (see example prompt above) in a copyable text box.
    - Big “Copy to Clipboard” button.
    - Visual guide: “Open ChatGPT → Paste this → Copy the share link.”
4. **Consent Screen**
    - Only share what you're comfortable revealing.
    - Ensure your chats don't contain others' private info.
    - “[I understand and consent]” button.
5. **Submit Share Link**
    - Paste ChatGPT share link here.
    - App validates URL format and ensures the prompt is unmodified.
    - Backend processes (see Technical Flow below).
6. **Process Pending Swipe**
    - If user swiped before registration, auto-submit that swipe.
    - Check for match immediately.
    - Show: “Checking if Sarah liked you back...”

## User Flow – Hiring Version
### Onboarding Flow (Recruiters)
1. **Company Setup**
    - Company name, industry, size.
    - Role: Recruiter, Hiring Manager, Founder.
    - Use case: “We're hiring for [role type].”
2. **Explain Value Prop**
    - Cut resume screening time by 80%. Instead of reading 100 resumes, analyze candidates' ChatGPT history to validate technical skills before interviews.
    - Candidates share their ChatGPT profile link.
    - AI extracts technical skills, communication style, problem-solving approach.
    - Recruiter gets ranked candidates with verified skills, not just resume claims.
3. **Pricing (Later)**
    - For MVP: Completely free with rate limits.

### Candidate Flow (Job Seekers)
Same onboarding as dating, but swiping on job offers (instead of people) and different system prompts.

## Example System Prompts
- **Core Profile:** Based on everything you know about me from our past chats, please describe my personality, intelligence, and communication style as objectively and as detailed as possible.
- **Lifestyle:** Based on everything you know about me, describe my ideal vacation and why it suits my personality.
- **Values:** Based on everything you know about me, what are my core values and what matters most to me in life?
- **Dating-Specific:** Based on our conversations, describe what kind of partner I'm looking for and what I value in relationships.
- **Professional:** Based on our discussions, describe my work style, strengths, and how I approach challenges.
- **Project-based:** Based on everything you know about me, what kind of projects am I best suited for and why?

## Data Handling (MVP)
- Keep internal notes on what is stored (share link URL, parsed traits, optional raw HTML) so we can explain it transparently.
- Publish only the data claims we can fulfill manually today; defer “delete anytime” messaging until tooling exists.
- Set up a lightweight manual deletion runbook (Supabase admin + storage cleanup) before launch.
- Flag any sensitive data findings for follow-up instead of claiming automatic redaction.

## Legal Compliance
- **User warrants that:**
    - They have the right to share their ChatGPT data.
    - Shared content doesn't contain others' private information.
    - They consent to AI analysis of their communication patterns.
- **Company disclaims:**
    - Accuracy of compatibility predictions.
    - Liability for hiring/dating decisions based on profiles.
    - Responsibility for content of user-submitted ChatGPT links.
    - Arbitration clause for disputes.

## Privacy Signals (What We Can Honestly Say in MVP)
- **Captured:** Email, optional profile fields, ChatGPT share link HTML (30-day retention), extracted traits, manual match notes, email engagement.
- **Not captured:** Full ChatGPT account history, third-party enrichment, automated behavioral tracking beyond session analytics.
- **Operations today:** Deletion and export happen via manual concierge request (target turnaround <7 days); document the exact steps in our runbook before launch.

## Employment Discrimination (Hiring Mode)
Disclaimer for recruiters: This tool is supplemental only and should not be the sole basis for hiring decisions. Comply with all applicable employment laws (EEOC, ADA, etc.). We do not infer or consider protected characteristics (race, religion, disability, etc.).

## Future Extensions (Post-MVP)
### Phase 2 Features (Months 13-24)
- **Dating App:** Friendship mode (“Find like-minded friends”), video call integration (trust building), AI-generated icebreakers based on shared interests, events/meetups for matched users, premium tier ($10-20/month).
- **Hiring Platform:** ATS integration (Greenhouse, Lever, Workday), bulk candidate processing (upload 50 resumes at once), API access for enterprise customers, interview question generator based on candidate gaps, team compatibility analysis.
- **Both:** Multiple prompt analysis (analyze 3 different prompts per user), profile strength meter (gamification), verified badge (100+ messages analyzed), public leaderboard (“Top communicators this week”), mobile apps (React Native + Expo).

### Phase 3 Features (Months 25-36)
- LLM fine-tuning on anonymized user data.
- Real-time matching notifications (WebSockets).
- Advanced filters (“Show me [specific trait]”).
- Personality insights dashboard.
- Relationship/career coaching based on patterns.
- Integration with other platforms (LinkedIn, GitHub).

## Success Metrics
## Concierge MVP Success Metrics
- 70% of invited testers complete the prompt copy step and submit a valid share link.
- 80% of delivered analysis emails are marked “helpful” or better in post-email survey.
- 50% of recipients click through to view suggested matches or group invites within 48 hours.
- At least one non-dating use case (friendship pod, accountability group, co-founder) reaches 10 warm leads to justify dedicated flow.
- Define “usable transcript” as (a) prompt token detected, (b) message count ≥10, and (c) OpenAI analysis confidence ≥60.
- Define “comfortable” as beta respondents rating trust ≥4/5 or giving positive qualitative feedback (“felt accurate/insightful”).

## Post-MVP KPI Targets (Deferred)
- Once a single segment validates, set user/match goals tailored to that segment.
- Define B2B metrics only after consumer validation produces evidence of sustained engagement.

## Risk & Mitigation
1. **OpenAI blocks share link scraping.** Store raw HTML (already doing), contact OpenAI partnerships team, develop official API partnership plan.
2. **ChatGPT analysis doesn't predict compatibility.** Validate with 50 test couples before launch, A/B test against random matching, pivot if accuracy <60%.
3. **Privacy backlash (“this is creepy”).** Maintain extreme transparency, give users control over what's analyzed, and be explicit about current manual deletion process instead of overpromising automation.
4. **Legal issues (discrimination, privacy violations).** Conduct legal review before launch, ensure EEOC compliance for hiring, include arbitration clause, secure insurance.
5. **Can't convert dating users to B2B customers.** Separate brands from day one, validate B2B interest at month seven, be willing to sunset dating if B2B doesn't work.
6. **Competitors copy the idea.** Move fast, build community, establish brand, leverage network effects from user base.

## Development Timeline (Concierge MVP First)
### Sprint 0 (Week 0-1): Prep & Validation
- Finalize positioning for Authentyc landing page with multiple interpersonal value-prop variants.
- Spin up waitlist Typeform/Airtable, connect to Supabase for lead storage.
- Reach out manually to 10-15 target users across dating, friendship pods, and group accountability to gauge willingness to share transcripts.

### Sprint 1 (Week 2-3): Intake & Manual Delivery
- Ship lightweight Next.js landing experience with waitlist + share link submission gated behind invite.
- Produce internal checklist for verifying prompts, fetching share pages, and logging qualitative notes.
- Send manual analysis emails (using template + Mailchimp/Postmark) to first 20 testers; measure completion and satisfaction.

### Sprint 2 (Week 4-5): Guided Matching Experiment
- Add simple swipe-style preview (static cards) tied to waitlist profile data to test desirability of “compatibility summaries in inbox.”
- Layer in concierge matching: manually curate 3 suggested matches or group invites per user, referencing their transcript insights.
- Track analytics on who engages after receiving email reports to validate retention hook.

### Sprint 3 (Week 6-7): MVP Feature Hardening
- Automate high-friction manual steps only after they prove valuable (share link fetch, OpenAI prompt execution, email send).
- Add minimal profile management (edit bio, withdraw transcript) within the same Next.js app.
- Decide which segment showed strongest pull and scope Iteration 2 accordingly (e.g., dedicated dating vs. friendship pod flow).

## Open Questions to Resolve
- Domain name? (Suggestions: authenticmatch.ai, realmatch.co, talentsignal.io.)
- How to prevent fake/staged ChatGPT conversations? (Authenticity scoring algorithm?)
- Should we partner with OpenAI officially? (Legitimacy boost but loss of control.)
- What if competitor (Tinder, LinkedIn) overtook us? (First-mover advantage critical.)
- Fundraising strategy? (Bootstrap until product-market fit, then raise?)
