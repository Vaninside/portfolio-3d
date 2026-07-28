# Scroll-Reveal for Sections Below Hero

**Date:** 2026-07-28
**Status:** Approved

## Goal

Make every section below the Hero "pelan-pelan keluar" (reveal) as the user
scrolls — content rises and fades in, bound to scroll position (scrub), then
stays clearly visible once fully in view. Hero itself is unchanged.

The user referenced a GSAP CinematicFooter prompt as a *style* example only.
We are NOT adding that footer, NOT adding GSAP, and NOT touching the Hero. We
reuse the project's existing **framer-motion v12**.

## Scope

**In scope:**
- New reusable component `components/ui/ScrollReveal.tsx`.
- Wrap sections below Hero (About, Experience, Organization, Projects, Skills,
  Education, Contact) in `app/page.tsx`.

**Out of scope:**
- Hero (stays instant, no scrub).
- New footer / cinematic footer from the prompt.
- GSAP or any new dependency.
- Editing the internal contents of the 7 sections.

## Chosen Approach

**Approach A — reusable `<ScrollReveal>` wrapper.**

Rationale: KISS + DRY. One new file, ~7 wrapper lines in `page.tsx`, does not
touch section internals, fully reversible. If double-fade (wrapper fade +
section-internal `useInView` fade) proves distracting during browser
verification, we escalate to reducing the wrapper fade range or dampening the
internal fade (Approach C). Recorded as a tuning risk, not a plan change.

Rejected:
- **B** (rewrite scroll logic inside all 7 sections): touches 7 files,
  duplicates scroll logic, violates DRY, risky.
- **C** (wrapper + disable internal fades): cleaner visually but edits wrapper
  + 7 sections upfront; only adopt if A shows a real double-fade problem.

## Component Design

File: `components/ui/ScrollReveal.tsx` (`"use client"`).

```tsx
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}
```

Behavior:
- `ref` on the wrapper `<motion.div>`.
- `useScroll({ target: ref, offset: ["start end", "start 60%"] })` →
  `scrollYProgress` runs 0→1 as the section top enters from the bottom of the
  viewport (`start end`) until the section top reaches 60% of viewport height
  (`start 60%`).
- `const y = useTransform(scrollYProgress, [0, 1], [64, 0])` — rise 64px → 0.
- `const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])` — fade 0 → 1.
- framer's `useTransform` **auto-clamps** outside the input range, so once
  progress passes 1 the values pin at `y:0, opacity:1` → content stays clear,
  does not re-fade on further scroll. (Matches the "muncul lalu tetap jelas"
  decision.)
- `useReducedMotion()` → when true, render `<div className={className}>` with no
  animation (content immediately visible).
- Return `<motion.div ref={ref} style={{ y, opacity }} className={className}>`.

Why `style` (MotionValue) not `animate`: scrub is a realtime scroll-bound value;
MotionValues in `style` update without React re-render (cheap). Same pattern
already used in `components/backgrounds/SectionBackground.tsx`.

## Integration (`app/page.tsx`)

```tsx
import ScrollReveal from "@/components/ui/ScrollReveal";
// ...
<main>
  <Hero />
  <ScrollReveal><About /></ScrollReveal>
  <ScrollReveal><Experience /></ScrollReveal>
  <ScrollReveal><Organization /></ScrollReveal>
  <ScrollReveal><Projects /></ScrollReveal>
  <ScrollReveal><Skills /></ScrollReveal>
  <ScrollReveal><Education /></ScrollReveal>
  <ScrollReveal><Contact /></ScrollReveal>
</main>
```

The wrapper `<motion.div>` is `display:block` full-width, matching the current
`<section>` flow — layout does not shift.

## Edge Cases

- **prefers-reduced-motion:** wrapper renders a plain div; content is immediately
  visible, no scrub.
- **Last section (Contact) near page bottom:** with `start 60%`, a short section
  at the end of scroll may never fully reach progress 1. Mitigation if observed:
  add an optional `offset` prop and pass a looser offset (e.g.
  `["start end", "center 75%"]`) for Contact only. Recorded as possible tuning.
- **SSR:** MotionValue via `style` is SSR-safe (same as SectionBackground); no
  hydration mismatch expected.
- **Double-fade:** wrapper fade may stack with each section's internal
  `useInView` fade. Verify in browser; tune if distracting.

## Verification

- `npx tsc --noEmit` — no new type errors.
- `npm run lint` — no new lint errors.
- Chrome DevTools MCP at `localhost:3000`:
  - Scroll slowly Hero → bottom; confirm each section rises + fades bound to
    scroll, then stays clear when scrolled past (no re-fade).
  - Check for double-fade harshness; screenshot 2–3 sections.
  - Confirm Contact reaches full visibility; apply offset tuning if not.
  - Console clean, no hydration warnings.

No unit-test runner in this project; verification is tsc + lint + browser
(consistent with prior sessions). No test files added.
