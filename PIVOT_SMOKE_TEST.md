# Pivot Smoke Test: 6-Week Dual Validation

**Status**: Committed plan — decision rules pre-registered before Week 1.
**Context**: Follows the critical review (`BUSINESS_PLAN_REVIEW.md`) verdict of PIVOT on the original plan. Brainstorm converged on network-effect marketplaces as the moat criterion ("features are replicable in a week; liquidity isn't"), narrowed to two finalists, resolved by cheap evidence instead of judgment.

---

## The Two Finalists

### Track A — Verified Contract-Talent Marketplace
"Verified senior SEA engineers on monthly contracts, with AI-native work-sample proof."
Employers engage engineers at $3–6K/mo (vs $10–15K US contractors); platform takes 10–15% of ongoing billings. High transaction frequency = a snowball that doesn't melt. Endgame: the network of verified profiles + performance history nobody can fabricate.

### Track B — Verified Dating, Jakarta Young Professionals
Serious-intent, verified-real-human dating for Jakarta professionals (25–35), secular positioning: "no bots, no catfish, no games." Counter-positioned against incumbents who structurally can't claim "serious and verified" (Hinge-style brand defense, not feature defense). Endgame: city-level liquidity moat, expand city by city.

**Why a dual test instead of judgment**: Track A wins on revenue speed, founder home-field, bootstrap fit. Track B wins on virality and consumer ceiling. Both have real network effects. $1.5–2.5K and 6 weeks buys evidence.

**How this differs from the original plan's mistake**: the original ran 3 categories for 12 months with full product builds and drifting criteria. This runs 2 tracks for 6 weeks with landing pages + one concierge transaction each, against pass bars written down in advance.

---

## Pre-Registered Decision Rules (DO NOT EDIT AFTER WEEK 1)

| Outcome | Decision |
|---|---|
| A passes, B fails | **Talent primary.** Dating shelved. |
| B passes, A fails | **Dating primary.** Accept ~12 months pre-revenue grind, eyes open. |
| **Both pass** | **Talent primary anyway** (revenue funds everything; dating becomes a funded experiment later). This tiebreak is committed NOW to prevent week-7 rationalization. |
| Both fail | Neither idea earned the next 6 months. Total tuition ~$1.5–2.5K. Return to the pivot menu. |

Mid-test checkpoints adjust *tactics*, never *pass bars*.

---

## Track A: Plan & Pass Bar

**Targeting (decided)**: Behavior-first, not geo-first — companies **already hiring remote/offshore**. Sources: YC jobs board, Wellfront/Wellfound remote listings, RemoteOK, WeWorkRemotely employer lists, recently-funded startups with remote engineering postings. Skews US → discovery calls land at Jakarta 8–11pm (US East mornings). Sustainable solo; avoid US West (midnight calls).

**Weeks 1–2: Supply + collateral**
- Vet 10–15 engineers from personal network + Indonesian dev communities.
- Verification = timed, realistic work-sample task (AI copilot allowed — *how they work with AI is part of the signal*), recorded session.
- Build 2–3 polished sample "verified profiles" (Claude drafts the report from the transcript; founder applies judgment). These are the sales collateral.

**Weeks 1–6: Demand (the actual test)**
- 300 targeted contacts, ≤50/day from a warmed domain, 3-touch sequence.
- Personalization = research depth (their actual job posting, stack, funding), NOT volume. AI-personalized spam is saturated in 2026; specificity is the only thing left that works. Human approval on every outbound send.
- Offer: zero placement fee on first engineer + 2-week risk-free trial.
- Founder takes every discovery call personally.

**Week 3 checkpoint**: <2% reply rate after 150 contacts → rewrite messaging/offer, don't kill.

**PASS BAR**: ≥10 qualified sales conversations **AND** ≥1 signed paying engagement (or 2 LOIs with deposits). Anything less = demand problem confirmed.

**Budget**: ~$200 (prospecting tools, email infra).

## Track B: Plan & Pass Bar

**Niche (decided)**: Jakarta young professionals, 25–35, secular serious-intent. Content-led citywide growth, seeded from communities the founder can actually reach.

**Weeks 1–2: Intent-depth funnel**
- Separate brand + landing page with a deliberate friction step: a mock verification flow after waitlist signup. The metric is **verification-step completion rate**, not signup count. Waitlist counts lie; friction reveals intent.
- 3–5 TikTok/IG concept videos, ~$300 boosted, Jakarta 25–35 targeting. Founder's real face/voice in content — no AI-generated "authenticity."

**Weeks 3–6: Willingness to pay and show up**
- Two ticketed verified-singles events (~Rp 200K / ~$12, 16–20 seats, private café/restaurant area, structured icebreakers, ID-verified guest list).
- Overbook 20–25% against no-shows.

**PASS BAR** (all four): waitlist CAC < $0.50 **AND** ≥25% verification-step completion **AND** both events sell out **AND** ≥60% of attendees say "would return and bring a friend."

**Budget**: ~$600–800 (ads + venue deposits, partially offset by ticket revenue).

---

## Division of Labor: Solo Founder + Claude Max + OpenClaw

**AI absorbs (~60–70% of grunt work)**:
- Both landing pages built and iterated (start from existing `landing_page/`)
- Track A: company list building, contact enrichment, outreach drafts referencing real job postings, verified-profile report drafts
- OpenClaw: follow-up cadences, scheduling, CRM hygiene, waitlist/ticketing ops, comment triage — with human approval on all outgoing messages
- Track B: scripts, captions, posting schedule, event reminder flows

**Irreducibly founder (the real bottlenecks)**:
1. All sales calls (Track A)
2. On-camera content + hosting both events (Track B)
3. Engineer-vetting judgment calls
4. The Week-6 kill decision

## Budget & Calendar

| Item | Cost |
|---|---|
| Domains, landing pages, analytics, Stripe | ~$100 |
| Track A tools (prospecting, email) | ~$200 |
| Track B ads | ~$300 |
| Track B events (net of tickets) | ~$300–500 |
| Buffer | ~$400 |
| **Total** | **~$1.5–2.5K** |

| Week | Track A | Track B |
|---|---|---|
| 0 | Landing page, domain warmup, list build starts | Landing page + mock-verification funnel |
| 1–2 | Vet 10–15 engineers, build 3 sample profiles, outbound begins | Shoot/post 3–5 content concepts, boost, measure funnel |
| 3 | Checkpoint: reply-rate review | Event #1 (sell out or learn why not) |
| 4–5 | Calls, proposals, push to close | Iterate content; Event #2 |
| 6 | Tally vs pass bar | Tally vs pass bar |
| End of 6 | **Apply pre-registered decision rules. No renegotiation.** | |

## Known Risks of the Test Itself

- **Cold-email saturation**: mitigated by low volume + research depth; if Track A fails purely on channel (zero replies but strong call-conversion when reached), note it — that's a channel failure, not a demand failure.
- **Brand cross-contamination**: B2B buyers must never see the dating brand. Separate domains, separate socials, no shared naming.
- **Solo-founder overload**: if forced to drop balls, protect the two human bottlenecks (calls, events) and let content cadence slip first.
- **Evidence quality**: 6 weeks gives directional signal, not statistical certainty. The pass bars are deliberately set at "undeniable pull," not "encouraging noise."

## Carried Forward From the Review (applies to whichever track wins)

- No dark patterns; advertised flow = built flow.
- Verification must be first-party and tamper-evident (work samples on-platform; ID/liveness for dating) — never copy-pasted ChatGPT outputs.
- Bottom-up market math only; no $500B TAM slides.
- Network effects are the end-state moat; the wedge is liquidity in one narrow pocket of density.
