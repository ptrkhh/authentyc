# Smoke Test: Verified Contract-Talent Marketplace (6 Weeks)

**Status**: Committed plan — decision rules pre-registered before Week 1.
**Context**: Follows the critical review (`BUSINESS_PLAN_REVIEW.md`) verdict of PIVOT on the original plan. Brainstorm converged on network-effect marketplaces as the moat criterion ("features are replicable in a week; liquidity isn't") and selected a single track for full founder focus.

---

## The Bet

**"Verified senior SEA engineers on monthly contracts, with AI-native work-sample proof."**

- **Mechanism**: Candidates complete a timed, realistic engineering task with an AI copilot embedded in our sandbox. The session transcript — how they decompose problems, prompt, catch AI errors, verify output — IS the credential. First-party, tamper-evident, job-relevant by construction.
- **The measured competency**: how well someone works *with* AI. Every employer in 2026 wants this distinguished (AI-leveraged vs AI-dependent engineers); no incumbent assessment measures it.
- **Transaction**: Employers engage engineers at $3–6K/mo (vs $10–15K US contractors); platform takes 10–15% of ongoing billings. High frequency = a snowball that doesn't melt; engineers re-list between gigs.
- **Endgame moat**: verified work-session transcripts tied to real contract outcomes (renewals, reviews) — an outcome-labeled dataset competitors can't fabricate. Engineered over months 6–18, not assumed.

## Pre-Registered Decision Rules (DO NOT EDIT AFTER WEEK 1)

| Outcome | Decision |
|---|---|
| **Pass** | Talent marketplace is the company. Next phase: repeatable sales motion + one cold acquisition channel test. |
| **Weak pass** (bar met, but signed client(s) came only from warm intros) | Extend 4 weeks with cold-sourced pipeline only. Commit only after one cold-originated signing. |
| **Fail** | No build. Return to the pivot menu. Total tuition ~$500–800. |

Mid-test checkpoints adjust *tactics*, never *pass bars*.

### Pass Bar
- ≥10 qualified sales conversations, **AND**
- ≥1 signed paying engagement (or 2 LOIs with deposits), **AND**
- Evidence-quality floor: ≥5 of the conversations originate from cold, behavior-targeted outbound (a pass built purely on the founder's warm network proves founder-network reach, not market demand).

## Targeting (decided)

Behavior-first, not geo-first: companies **already hiring remote/offshore**. Sources: YC jobs board, Wellfound remote listings, RemoteOK, WeWorkRemotely employer lists, recently-funded startups with remote engineering postings. Skews US → discovery calls at Jakarta 8–11pm (US East mornings). Avoid US West (midnight calls).

## Plan

**Week 0 — Setup**
- Landing page (build from existing `landing_page/` assets), analytics, calendar booking.
- Outbound domain warmup starts immediately; list build begins (300 target companies, enriched contacts).

**Weeks 1–2 — Supply + collateral**
- Vet 10–15 engineers from personal network + Indonesian dev communities (their incentive: free verification, access to global rates).
- Run work-sample sessions: timed realistic task, AI copilot allowed and expected, session recorded.
- Build 2–3 polished sample "verified profiles" (Claude drafts the report from the transcript; founder applies judgment). These are the sales collateral.

**Weeks 1–6 — Demand (the actual test)**
- 300 targeted contacts, ≤50/day, 3-touch sequence.
- Personalization = research depth (their actual job posting, stack, funding), NOT volume. AI-personalized spam is saturated in 2026; specificity is the only thing that still works. Human approval on every outbound send.
- Offer: zero placement fee on first engineer + 2-week risk-free trial.
- Founder takes every discovery call personally.

**Week 3 — Checkpoint**
- <2% reply rate after 150 contacts → rewrite messaging/offer (channel problem), don't kill (not yet a demand verdict).

**Weeks 4–6 — Close + deliver**
- Calls → proposals → signatures.
- If a client signs early, deliver concierge-style (founder as account manager) — delivery learnings count as test output.

## Division of Labor: Solo Founder + Claude Max + OpenClaw

**AI absorbs**: landing page, company list building + contact enrichment, outreach drafts referencing real job postings, verified-profile report drafts, follow-up cadences / scheduling / CRM hygiene via OpenClaw (human approval on all outgoing messages).

**Irreducibly founder**: all sales calls, engineer-vetting judgment, work-sample task design, the Week-6 decision.

## Budget

| Item | Cost |
|---|---|
| Domain, landing page, analytics | ~$100 |
| Prospecting tools (Apollo/LinkedIn) | ~$200 |
| Email infrastructure + warmup | ~$100 |
| Buffer | ~$200–400 |
| **Total** | **~$500–800** |

## Calendar

| Week | Focus |
|---|---|
| 0 | Landing page, domain warmup, list build |
| 1–2 | Vet engineers, run work samples, build 3 profiles, outbound begins |
| 3 | Reply-rate checkpoint; iterate messaging |
| 4–5 | Calls, proposals, push to close |
| 6 | Tally vs pass bar; **apply pre-registered rules — no renegotiation** |

## Known Risks of the Test Itself

- **Cold-email saturation**: if replies are near zero but call-conversion is strong when reached, record it as a *channel* failure, not a *demand* failure — different verdicts.
- **Founder-network artifact**: handled by the provenance rule in the pass bar.
- **Evidence quality**: 6 weeks gives directional signal, not certainty. Bars are set at "undeniable pull," not "encouraging noise."
- **Solo bandwidth**: if anything slips, protect the calls — everything else can be late.

## Future Adjacency (explicitly out of scope for this test)

**Cofounder matching as a second transaction type on the same network** (post-liquidity): the work-sample mechanism extends naturally to *joint* trials — two prospective cofounders + AI copilot on a shared task, compatibility directly observed rather than inferred. Same supply pool, same verified profiles, strengthens the network rather than fragmenting focus. Revisit only after the talent marketplace has real liquidity (~300+ verified engineers).

## Carried Forward From the Review

- No dark patterns; advertised flow = built flow.
- Verification must be first-party and tamper-evident — never imported third-party conversation data.
- Bottom-up market math only; no $500B TAM slides.
- Network effects are the end-state moat and must be deliberately engineered (what accumulates? what makes engineer #200 and client #50 harder to poach?); the wedge is liquidity in one narrow pocket of density.
