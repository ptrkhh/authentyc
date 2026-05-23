# Design: Remove false-button affordance from informational cards

**Date:** 2026-05-23
**Status:** Approved
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

## Changes

### 1. `components/ui/surface-card.tsx` — add opt-in interactivity
- Add prop `interactive?: boolean` (default `false`).
- `whileHover` = `interactive ? { y: -8, scale: featured ? 1.02 : 1.01 } : undefined`.
- Apply `hover:border-[var(--surface-highlight)]` only when `interactive` is true.
- Keep unchanged: entrance `variants={VARIANTS.fadeIn}`, the top highlight line,
  base background/border/shadow, and the `featured` gradient overlay.

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

## Verification
- Run the dev server and hover-test:
  - `ProblemSection` and `HowItWorks` cards: no lift, scale, border-brighten, or
    icon-glow on hover.
  - `CategoryCards`: still lifts/scales/glows as before.
- Cards were never focusable or clickable, so there is no accessibility change;
  `__tests__/accessibility.test.tsx` should still pass.
