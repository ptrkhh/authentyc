# Static Info Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the false "clickable button" affordance from the `ProblemSection` and `HowItWorks` informational cards while keeping the legitimate hover on `CategoryCards`.

**Architecture:** Add an opt-in `interactive` prop to the shared `SurfaceCard` (default `false`). When `false`, the lift/scale `whileHover` gesture and the `hover:border` highlight are omitted, so the card is fully static. `CategoryCards` (which wraps a real `PremiumButton`) opts in; the two informational sections inherit the static default. One stray `group-hover` icon glow in `ProblemSection` is also removed.

**Tech Stack:** Next.js, React, TypeScript, framer-motion `^12.23.26`, Tailwind, Jest + `@testing-library/react` (jsdom).

**Spec:** `docs/superpowers/specs/2026-05-23-static-info-cards-design.md`

---

## Working directory

All paths below are relative to `landing_page/`. Run all `npm`/`git` commands from `landing_page/` unless noted.

```bash
cd landing_page
```

## Git identity note

This repo has **no git identity configured** (`git config user.name`/`user.email` are empty) and a bare `git commit` fails with `empty ident name`. The existing history author is `Patrick Hermawan <patrick.hermawan@outlook.com>`. Every commit command below passes that identity inline with `-c` flags. **Do not run `git config`** — the inline override is per-command and leaves config untouched.

Note: `git` commands operate on the whole repo, so they work from `landing_page/` too. Stage files by their `landing_page/...` paths (shown in each commit step).

---

## Task 1: Add `interactive` prop to SurfaceCard + opt CategoryCards in

Combined into one task/commit so no intermediate state regresses `CategoryCards` (once the default becomes static, `CategoryCards` must opt back in immediately).

**Files:**
- Modify: `landing_page/components/ui/surface-card.tsx`
- Modify: `landing_page/components/landing/CategoryCards.tsx:127`
- Test (create): `landing_page/__tests__/static-cards.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `landing_page/__tests__/static-cards.test.tsx` with exactly this content. The `framer-motion` mock renders each `motion.*` element as its plain HTML tag, forwarding `className`/`children` and dropping animation-only props (`whileHover`, `variants`, etc.). This makes the rendered `className` deterministic and lets us assert on the hover-border class — the DOM proxy for the affordance (framer gesture props are not observable in jsdom).

```tsx
import React from 'react';
import { render } from '@testing-library/react';

jest.mock('framer-motion', () => {
  const ReactLib = require('react');
  const passthrough =
    (tag: string) =>
    ({
      children,
      whileHover,
      whileTap,
      whileInView,
      viewport,
      variants,
      initial,
      animate,
      exit,
      transition,
      ...rest
    }: any) =>
      ReactLib.createElement(tag, rest, children);
  return {
    __esModule: true,
    motion: new Proxy({}, { get: (_t, tag: string) => passthrough(tag) }),
    AnimatePresence: ({ children }: any) =>
      ReactLib.createElement(ReactLib.Fragment, null, children),
  };
});

import { SurfaceCard } from '@/components/ui/surface-card';

const HOVER_BORDER = 'hover:border-[var(--surface-highlight)]';

describe('SurfaceCard interactive prop', () => {
  it('is static by default (no clickable-looking hover border)', () => {
    const { container } = render(<SurfaceCard>content</SurfaceCard>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain(HOVER_BORDER);
  });

  it('shows the hover border only when interactive', () => {
    const { container } = render(<SurfaceCard interactive>content</SurfaceCard>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain(HOVER_BORDER);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- static-cards`
Expected: the **"is static by default"** test FAILS (today `SurfaceCard` always includes `hover:border-[var(--surface-highlight)]`, so the default `className` still contains it). The "only when interactive" test passes.

- [ ] **Step 3: Implement the `interactive` prop in SurfaceCard**

Replace the entire contents of `landing_page/components/ui/surface-card.tsx` with:

```tsx
'use client';

import { motion } from 'framer-motion';
import { SPRING_CONFIGS, VARIANTS } from '@/lib/animations/constants';

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  /**
   * Opt in to button-like hover (lift, scale, border highlight). Default false:
   * the card is static, so it does not look clickable. Only pass this when the
   * card actually leads to an action.
   */
  interactive?: boolean;
}

/**
 * Frosted glass surface card component with subtle animations.
 * Creates premium feel through restrained execution, not technical complexity.
 * Featured cards have enhanced hover effects for emphasis.
 */
export function SurfaceCard({
  children,
  className = '',
  featured = false,
  interactive = false,
}: SurfaceCardProps) {
  return (
    <motion.div
      className={`
        relative p-8 rounded-2xl
        bg-[var(--surface-base)]
        border border-[var(--surface-border)]
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        transition-all duration-500 ease-smooth
        ${interactive ? 'hover:border-[var(--surface-highlight)]' : ''}
        overflow-hidden
        group
        ${featured ? 'will-change-transform' : ''}
        ${className}
      `}
      variants={VARIANTS.fadeIn}
      whileHover={interactive ? { y: -8, scale: featured ? 1.02 : 1.01 } : undefined}
      transition={SPRING_CONFIGS.gentle}
    >
      {/* Top highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
        from-transparent via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle gradient overlay on hover - only on featured cards for performance */}
      {featured && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30
          transition-opacity duration-700 pointer-events-none
          bg-gradient-to-br from-brand-primary/10 to-transparent" />
      )}
    </motion.div>
  );
}
```

What changed vs. the original: added the `interactive?: boolean` prop (default `false`); the `hover:border-[var(--surface-highlight)]` class is now inside `${interactive ? '...' : ''}`; `whileHover` is `undefined` (gesture disabled) unless `interactive`. Everything else — entrance `variants={VARIANTS.fadeIn}`, top highlight line, base styles, `featured` overlay, `will-change-transform` gating — is unchanged.

- [ ] **Step 4: Opt CategoryCards back in**

In `landing_page/components/landing/CategoryCards.tsx`, find line ~127:

```tsx
    <SurfaceCard className={`h-full flex flex-col ${isExpanded ? 'ring-2 ring-brand-primary' : ''}`} featured={featured}>
```

Change it to add `interactive`:

```tsx
    <SurfaceCard interactive className={`h-full flex flex-col ${isExpanded ? 'ring-2 ring-brand-primary' : ''}`} featured={featured}>
```

(`CategoryCards` legitimately contains a `PremiumButton`, so it keeps the lift/scale/border-highlight hover.)

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- static-cards`
Expected: both `SurfaceCard` tests PASS.

- [ ] **Step 6: Commit**

```bash
git add landing_page/components/ui/surface-card.tsx landing_page/components/landing/CategoryCards.tsx landing_page/__tests__/static-cards.test.tsx
git -c user.name="Patrick Hermawan" -c user.email="patrick.hermawan@outlook.com" commit -m "Add opt-in interactive prop to SurfaceCard"
```

---

## Task 2: Make ProblemSection fully static + guard HowItWorks

`ProblemSection` and `HowItWorks` already lose the lift/scale and hover-border from Task 1 (they inherit the new static default). `ProblemSection` has one remaining hover reaction: the icon's `group-hover:shadow` glow. Remove it, and add regression-guard tests for both sections.

**Files:**
- Modify: `landing_page/components/landing/ProblemSection.tsx:58`
- Modify (append): `landing_page/__tests__/static-cards.test.tsx`

- [ ] **Step 1: Write the failing test**

Append this `describe` block to the end of `landing_page/__tests__/static-cards.test.tsx` (after the existing `SurfaceCard` describe, before end of file). Add the two imports at the top of the file alongside the existing `SurfaceCard` import:

Add near the other import:

```tsx
import { ProblemSection } from '@/components/landing/ProblemSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
```

Append at the end of the file:

```tsx
describe('Informational landing cards are static', () => {
  it('ProblemSection has no hover affordance (no hover border, no icon hover-glow)', () => {
    const { container } = render(<ProblemSection />);
    expect(container.innerHTML).not.toContain(HOVER_BORDER);
    expect(container.innerHTML).not.toContain('group-hover:shadow');
  });

  it('HowItWorks has no hover border affordance', () => {
    const { container } = render(<HowItWorks />);
    expect(container.innerHTML).not.toContain(HOVER_BORDER);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- static-cards`
Expected: the **ProblemSection** test FAILS on `expect(...).not.toContain('group-hover:shadow')` (the icon still has `group-hover:shadow-[0_0_40px_var(--brand-primary-glow)]`). The HowItWorks test PASSES already (it inherits the static default from Task 1 — this is a regression guard).

- [ ] **Step 3: Remove the icon hover glow in ProblemSection**

In `landing_page/components/landing/ProblemSection.tsx`, find the icon `div` (lines ~56-60):

```tsx
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/10
                border border-white/10 flex items-center justify-center text-3xl
                group-hover:shadow-[0_0_40px_var(--brand-primary-glow)] transition-all">
```

Remove the `group-hover:shadow-[0_0_40px_var(--brand-primary-glow)]` token, leaving:

```tsx
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/10
                border border-white/10 flex items-center justify-center text-3xl
                transition-all">
```

(The static gradient background and border stay; only the hover-triggered glow is gone.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- static-cards`
Expected: all four tests PASS (`SurfaceCard` ×2, `ProblemSection`, `HowItWorks`).

- [ ] **Step 5: Commit**

```bash
git add landing_page/components/landing/ProblemSection.tsx landing_page/__tests__/static-cards.test.tsx
git -c user.name="Patrick Hermawan" -c user.email="patrick.hermawan@outlook.com" commit -m "Make ProblemSection info cards fully static"
```

---

## Task 3: Full verification

No code changes — confirm the whole change is sound (type/build, full suite, and the parts jsdom cannot assert: the actual lift/scale gesture).

- [ ] **Step 1: Type-check / build**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors (the new `interactive` prop type-checks at every call site).
(Faster alternative if you only want types: `npx tsc --noEmit`.)

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including the existing `__tests__/accessibility.test.tsx` (unchanged) and the new `static-cards` tests.

- [ ] **Step 3: Manual hover check (the gesture jsdom can't see)**

Run: `npm run dev`, open `http://localhost:3000`, scroll to each section, and hover:
- **The Problem With Matching** (ProblemSection) cards: NO lift, NO scale, NO border-brighten, NO icon glow on hover. Scroll-in entrance animation still plays.
- **From Conversation to Connection** (HowItWorks) cards: NO lift/scale/border-brighten on hover. Entrance still plays.
- **CategoryCards** (the category grid): cards STILL lift, scale, and brighten their border on hover, exactly as before.

Stop the dev server when done (Ctrl-C).

- [ ] **Step 4: Final commit (only if Steps 1-3 surfaced fixes)**

If everything passed with no changes, there is nothing to commit — Tasks 1 and 2 already committed the work. If a fix was needed, stage **only the specific file(s) you changed** (do NOT use `git add -A` / `git add .` — this repo has many unrelated pre-existing uncommitted changes that must not be swept in):

```bash
git add landing_page/<the-file-you-fixed>
git -c user.name="Patrick Hermawan" -c user.email="patrick.hermawan@outlook.com" commit -m "Fix issues found during info-card affordance verification"
```

---

## Notes for the implementer

- **Why `className` substring instead of testing the lift?** framer-motion's `whileHover` gesture is not reflected in the jsdom DOM, so it cannot be asserted in Jest. Both the gesture and the `hover:border` class are gated on the same `interactive` flag, so the class is a faithful proxy; the actual motion is verified manually in Task 3, Step 3.
- **Why mock framer-motion in the test?** To render `motion.*` deterministically as plain tags (forwarding `className`) and avoid relying on framer's jsdom behavior. The mock lives only in `static-cards.test.tsx`.
- **Do not** add `prefers-reduced-motion` handling, new interactivity, or changes to other sections — all explicitly out of scope per the spec.
