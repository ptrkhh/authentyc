# Design: Remove false-button affordance from informational cards

**Date:** 2026-05-23
**Status:** Approved — revised 2026-05-23 after a verification debate (claims re-checked against the codebase; see "Verified findings").
**Scope:** `landing_page/` — `SurfaceCard` and its three consumers

## Problem

The `ProblemSection` and `HowItWorks` sections render their items with the shared
`SurfaceCard` component. On hover, `SurfaceCard` lifts (`y: -8`), scales
(`scale: 1.01`), and brightens its border — the same signals an interactive
button/link gives. But these cards have no click target and perform no action.
The result is a false affordance: users expect a click to do something, and
nothing happens.

An audit of `landing_page/components/` found the only source of this lift/scale
hover affordance is `SurfaceCard` (`components/ui/surface-card.tsx`,
`whileHover={{ y: -8, scale }}` + `hover:border-[var(--surface-highlight)]`).
`premium-button.tsx` and `SimulationResults.tsx` also have hover motion, but
those are real `<button>`s — correct affordance, out of scope.

`SurfaceCard` has three consumers:

| Consumer | Interactive? | Decision |
| --- | --- | --- |
| `CategoryCards` | Yes — contains a `PremiumButton` (`Try It Yourself →`) | Keep hover |
| `ProblemSection` | No — pure info (Resumes Lie, etc.) | Make static |
| `HowItWorks` | No — pure info (3 steps) | Make static |

## Decisions

1. **Direction:** remove the false affordance — the info cards become calm static
   content. No new interactivity is added (the cards have no natural action;
   inventing one would be YAGNI).
2. **Degree:** fully static — zero hover reaction. The existing scroll-in
   entrance animation stays (it is not an affordance, so it does not imply
   clickability).
3. **Implementation:** opt-in `interactive` prop on `SurfaceCard`, defaulting to
   static. This makes "not clickable-looking" the honest default; any future
   card must explicitly opt into button-like hover. Chosen over an opt-out
   `static` prop because the opt-out leaves the dishonest behavior as the
   default that new cards silently inherit.

## Verified findings

Re-checked against the code on 2026-05-23 (`grep`/read), so the design rests on
facts, not assumptions:

- **Audit is complete.** `whileHover` exists in exactly two places —
  `surface-card.tsx:37` (the false affordance) and `premium-button.tsx:47` (a real
  `<motion.button>`). The only CSS lift is `SimulationResults.tsx:163`, a real
  `<button>` (`hover:-translate-y-0.5`). No other component lifts/scales on hover,
  so making the default static cannot silently strip an affordance elsewhere.
- **Three consumers, all accounted for.** `SurfaceCard` is used only by
  `CategoryCards.tsx:127` (interactive — wraps a `PremiumButton`),
  `ProblemSection.tsx:54`, and `HowItWorks.tsx:59`.
- **Removing `whileHover` cannot affect the scroll-in entrance.** Entrance and
  hover are driven independently:
  - `ProblemSection` / `HowItWorks` parents use `variants={VARIANTS.stagger}` with
    **string** states (`initial="initial"`, `whileInView="animate"`), which
    propagate to the child `SurfaceCard`'s `variants={VARIANTS.fadeIn}`
    (`opacity/y/scale: 0.95→1`). That is the entrance, and it is orthogonal to
    `whileHover`.
  - `CategoryCards` (`:85`) wraps each card in a `motion.div` that uses
    **object-literal** `initial`/`whileInView`, which do *not* propagate named
    variants — so its `SurfaceCard`'s `fadeIn` variant is inert and entrance is the
    wrapper's job. `CategoryCards` stays `interactive`, so its hover is kept anyway.
- **Only one stray `group-hover` needs removal.** `ProblemSection.tsx:58` is the
  sole hover-reactive child on a card that becomes static (`HowItWorks` has none;
  `CategoryCards.tsx:132` stays interactive).

## Changes

### 1. `components/ui/surface-card.tsx` — add opt-in interactivity
- Add prop `interactive?: boolean` (default `false`).
- `whileHover` = `interactive ? { y: -8, scale: featured ? 1.02 : 1.01 } : undefined`.
  `undefined` is the framer-motion (`^12.23.26`) way to disable the gesture —
  equivalent to omitting the prop.
- Apply `hover:border-[var(--surface-highlight)]` only when `interactive` is true.
- Keep unchanged: entrance `variants={VARIANTS.fadeIn}`, the top highlight line,
  base background/border/shadow, and the `featured` gradient overlay.
- Left intentionally as-is (no regression, verified):
  - `will-change-transform` stays gated on `featured`, not `interactive`. The only
    interactive consumer (`CategoryCards`) already gets it on its featured card;
    behavior is identical to today for every existing card. Re-gating is an
    unrelated perf tweak, out of scope.
  - `transition-all duration-500` stays. For a static card no hovered CSS property
    changes, so it is inert; the class is still needed for the interactive card's
    border transition.

### 2. `components/landing/CategoryCards.tsx` (line ~127) — opt in
- Pass `interactive` to the `SurfaceCard`, preserving its current lift/scale/glow.

### 3. `components/landing/ProblemSection.tsx`
- No prop needed — inherits the static default.
- Remove the icon's `group-hover:shadow-[0_0_40px_var(--brand-primary-glow)]`
  (line ~58) so the icon does not react to hover either. Keep its static
  gradient background and border.

### 4. `components/landing/HowItWorks.tsx`
- No code change — inherits the static default; cards stop lifting. (Its icon has
  no `group-hover` glow.)

## Non-goals
- No new interactivity, expand, or link behavior on the info cards.
- No changes to other sections — the audit found no other false affordances.
- No changes to real buttons (`premium-button`, `SimulationResults`).
- No `prefers-reduced-motion` handling. Today neither the entrance animation nor
  the interactive-card hover respects reduced-motion; that is a pre-existing,
  separate concern and not part of removing the false affordance. Called out so the
  omission is a decision, not an oversight.

## Verification
- Typecheck/build the new prop wiring: `npm run build` (or `tsc --noEmit`).
- Run the test suite: `npm test`.
- Run the dev server and hover-test:
  - `ProblemSection` and `HowItWorks` cards: no lift, scale, border-brighten, or
    icon-glow on hover; scroll-in entrance still plays.
  - `CategoryCards`: still lifts/scales/glows as before.
- Accessibility: no change expected, for two independent reasons —
  (a) `__tests__/accessibility.test.tsx` does not render `SurfaceCard`,
  `ProblemSection`, or `HowItWorks` (it covers Button, Input, Alert, Label,
  Accordion, Dialog), so it is structurally unaffected; and (b) the cards are
  non-focusable, non-clickable `motion.div`s (no `role`/`tabindex`/`onClick`), so
  removing a mouse-only hover effect changes nothing for assistive tech. Confirm by
  running `npm test` rather than assuming.
