# Project Analysis

## Key Risks to Hitting an MVP Quickly

> Dual-market scope (dating and hiring) is baked into Phase 1, stretching focus and resources before validating a single use case (MASTER_PLAN_BUSINESS.md:15; MASTER_PLAN_BUSINESS.md:154-187; MASTER_PLAN_TECHNICAL.md:589-705).

Phase 1 should be dating. Once dating reaches a certain threshold (MAU, for example) then we will start developing the hiring version. Also see RELATIONSHIP_EXPANSIONS.md, we might not even be doing dating at all.

> The onboarding path assumes users will copy prompts, generate ChatGPT share links, and hand them over—each step is high-friction and unproven for cold users (MASTER_PLAN_BUSINESS.md:34-51; MASTER_PLAN_TECHNICAL.md:85-135).

What else could you think of? It's the only sure-fire way of knowing a) the results actually come from ChatGPT, not fabricated and b) the user copies the prompt, unmodified

> Automated scraping of ChatGPT share pages with Playwright risks ToS violations, brittleness, and extra infrastructure effort (MASTER_PLAN_BUSINESS.md:145-151; MASTER_PLAN_TECHNICAL.md:727-775).

Other than Playwright, what's the more ToS/MVP friendly?

> Storing full chat HTML alongside derived traits creates heavy privacy/data-handling obligations the team may not be ready to satisfy in an MVP (MASTER_PLAN_BUSINESS.md:78-108; MASTER_PLAN_TECHNICAL.md:831-867).

Generally, an MVP won't be scrutinized legally, if its giving a personal project vibe, then OpenAI or other parties won't even worry about it

> The roadmap targets aggressive usage and revenue milestones without intermediate validation loops, risking large build cycles before learning (MASTER_PLAN_BUSINESS.md:129-200).

What would you recommmend here?

## Business Plan Observations & Recommendations

> **Narrow initial segment**: Validate desirability with a single vertical (e.g., dating) and a tight persona before allocating resources to a B2B pivot (MASTER_PLAN_BUSINESS.md:15-23). Consider a milestone such as 100 qualified beta users before scheduling enterprise work.

As I mentioned above, what are the alternatives to dating?

> **User acquisition experiment first**: Replace the complex pre-registration swipe experience with a simple waitlist + concierge onboarding to confirm that users will share chats at all (MASTER_PLAN_BUSINESS.md:25-51). A landing page plus manual follow-up can produce this signal faster.

So basically swipe --> swipe --> swipe --> waitlist registration --> end?

> **Measure willingness, not vanity metrics**: Early KPIs should focus on the percentage of sign-ups who actually submit a usable transcript and feel comfortable with the analysis, rather than 10k-user goals (MASTER_PLAN_BUSINESS.md:129-136). Track qualitative feedback on trust and perceived value.

How would you measure "usable" and "comfortable"?

> **Privacy messaging needs matching ops**: Promising easy deletions and PII scrubbing creates expectations for operational rigor (MASTER_PLAN_BUSINESS.md:78-107). Delay public promises until automation exists, or document the manual process the MVP can truly deliver.

Completely agree. Please remove those promises from MASTER_PLAN_BUSINESS.md

## Technical Plan Observations & Recommendations
> **Simplify the stack**: Running Next.js+tRPC+Supabase on the frontend alongside a FastAPI service, Redis, and Playwright scraping increases coordination overhead (MASTER_PLAN_TECHNICAL.md:595-775). For MVP, keep everything in a single Next.js app with Supabase functions or Next API routes to reduce moving parts.

Completely agree. Please adjust MASTER_PLAN_TECHNICAL.md to the MVP friendly version. We will decide on the post-MVP version later

> **Start with manual transcript ingestion**: Instead of headless scraping, accept pasted text or uploaded PDFs, then automate once conversion funnels prove users will comply (MASTER_PLAN_TECHNICAL.md:727-775). This avoids Playwright hosting and lowers ToS risk.

Can't do pasted text since it can be easily manipulated. Uploaded PDF is even higher friction to the user experience than simply copy-pasting a URL

> **Trim data storage**: Persist only parsed traits and metadata required for matching; avoid raw HTML unless there is a legal basis and storage plan (MASTER_PLAN_TECHNICAL.md:831-867). If raw chats are needed temporarily for review, keep them in short-lived object storage with auto-expiry.

As I said before, legality of data storage shouldn't really be a concern right now for an MVP. Storage plan of an HTML text is trivial compared to, say storing images

> **Defer multi-mode UI**: Building separate routing, design systems, and feature sets for dating and hiring in one repo slows delivery (MASTER_PLAN_TECHNICAL.md:623-704). Ship a single-mode UI until product-market fit is clearer.

Completely agree. Please adjust MASTER_PLAN_TECHNICAL.md
 
> **Revisit timeline**: Foundation month includes both frontends, share-link scraper, and auth—likely too much for a tiny team (MASTER_PLAN_BUSINESS.md:154-174). Sequence as: (1) landing page + manual report, (2) lightweight profile submission, (3) simplified matching.

Agreed except for one thing: It still needs scraping the share link, since its the USP of this application.
Please adjust MASTER_PLAN_TECHNICAL.md

## Suggested Fast-Track MVP Path

> Launch a single landing page with clear value prop and a Typeform/Rowy intake to collect volunteer transcripts and consent.

The landing page should be about Authentyc, the company behind authenticity-focused AI interpersonal matching system, be it dating, jobseeking, or anything. Emphasize that the company is new and open for new possibilities

> Use a lightweight notebook or backend script to run OpenAI analysis manually, returning results via email to validate perceived value.

Genius idea! After the user finished the signup flow, the confirmation email should include the results, along with compatibility summary to the previously swiped items (from pre-registration), be it person (dating app) or job opening (jobseeking app)

This would incentivize the user to continue using the app, even when they are scrolling through their email inboxes
