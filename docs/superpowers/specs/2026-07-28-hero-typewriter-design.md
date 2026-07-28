# Hero Typewriter Line — Design Spec

**Date:** 2026-07-28
**Status:** Approved (pending written-spec review)

## Goal

Add an animated typewriter line directly below the name in the hero section, in
the style of yasio.dev's "i design and develop ___". A static prefix
**"I design and develop"** is followed by a rotating word that types in, pauses,
deletes, and advances to the next — looping forever with a blinking cursor. This
**replaces** the current static subtitle.

Reference the user pointed to:
`https://motion.dev/examples/react-typewriter-change-content` (and yasio.dev).
That official example uses the `Typewriter` component from the newer standalone
`motion` package and is paywalled (Motion+). This project uses `framer-motion`
v12, which has no `Typewriter` primitive, and no standalone `motion` package is
installed. Rather than add an overlapping dependency for one line, the effect is
reproduced with a small custom hook — zero new dependencies.

## Exact Content

- Static prefix (real text, screen-reader visible): `I design and develop `
- Rotating words, in order: `websites`, `webapps`, `ui/ux`, `things`
- Loop: after the last word, wrap back to the first (infinite).

## Non-Goals

- No new npm dependency (no `motion` package, no typewriter library).
- Do not touch the name (`MatrixText`) rendering, the CTA buttons, the scroll
  indicator, or the background/preloader systems.
- Not a general-purpose typewriter with per-word timing overrides beyond the few
  props below. YAGNI.

## Architecture

Two new focused units + one edit. Logic (timing state machine) is separated from
presentation (JSX + cursor), mirroring the codebase's self-contained
`components/ui/MatrixText.tsx` pattern.

### Unit 1 — `hooks/use-typewriter.ts` (logic, no JSX)

A custom React hook that drives the type→pause→delete→advance state machine.

- **Signature:**
  ```ts
  interface UseTypewriterOptions {
    words: string[];
    typeSpeedMs?: number;    // default 90
    deleteSpeedMs?: number;  // default 45
    pauseMs?: number;        // default 1400 (hold after a word is fully typed)
    startDelayMs?: number;   // default 400 (pause before typing the next word after delete)
    reducedMotion?: boolean; // when true, no animation
  }
  function useTypewriter(options: UseTypewriterOptions): { text: string };
  ```
- **Behavior:** phases `typing → paused → deleting → (advance index) → typing`.
  Index advances with wraparound (`(i + 1) % words.length`). Each phase schedules
  the next via `setTimeout`; every scheduled timeout id is cleared in the effect
  cleanup so nothing fires after unmount or dependency change.
- **Reduced motion:** when `reducedMotion` is true, the hook returns
  `{ text: words[0] }` immediately (first word, fully shown) and schedules no
  timers — the line is static "I design and develop websites".
- **Edge:** empty `words` array returns `{ text: "" }` and does nothing (guard).

### Unit 2 — `components/ui/Typewriter.tsx` (presentation)

A thin `"use client"` component that renders the hook's output plus a cursor.

- **Signature:**
  ```tsx
  interface TypewriterProps {
    words: string[];
    className?: string;        // applied to the rotating-word span
    typeSpeedMs?: number;
    deleteSpeedMs?: number;
    pauseMs?: number;
    startDelayMs?: number;
  }
  export function Typewriter(props: TypewriterProps): JSX.Element;
  ```
- Calls `useReducedMotion()` (framer-motion) and passes it into `useTypewriter`.
- Renders:
  - a rotating-word `<span aria-hidden="true">{text}</span>` (brand-colored),
  - a blinking cursor `<span aria-hidden="true">` (a `|` or thin bar) that blinks
    via scoped `<style jsx>` `@keyframes` opacity; under reduced motion the cursor
    is solid (no blink),
  - a visually-hidden `<span className="sr-only">websites, webapps, ui/ux, things</span>`
    so screen readers get the full meaning once, without per-character spam.
- Cursor + rotating word use brand indigo `#6366f1`.

### Edit — `components/Hero.tsx`

Replace the static subtitle block (currently the `motion.p` at ~lines 149–154,
the "Frontend developer & problem solver…" paragraph) with the typewriter line.

- Keep the **same** wrapper `motion.p variants={itemVariants}` so the staggered
  entrance timing/rhythm is unchanged.
- Keep the **same** font sizing as the old subtitle
  (`text-base sm:text-lg md:text-xl`) and `text-muted-foreground` on the prefix,
  so hero proportions don't shift.
- Structure inside the paragraph:
  ```
  I design and develop <Typewriter words={["websites","webapps","ui/ux","things"]} />
  ```
  Prefix is plain muted text; only the rotating segment is the brand-colored
  `Typewriter`. A trailing space separates prefix and rotating word.
- The name `MatrixText` blocks above are untouched. Timing feels natural: the
  name types in via its own `initialDelay` (800–1000ms); the typewriter begins
  as soon as it mounts, reading as a follow-on beat.

## Accessibility

- Prefix text is real, readable text.
- Rotating word + cursor are `aria-hidden` (decorative animation).
- One `sr-only` span lists all four words so assistive tech conveys the full
  intent without announcing every intermediate partial string.
- Reduced motion → static "I design and develop websites", solid cursor.

## Visual / Palette

- Dark-mode only (consistent with the site).
- Prefix: `text-muted-foreground` (matches the old subtitle tone).
- Rotating word + cursor: brand indigo `#6366f1`.
- No colors outside the brand palette.

## Timing Defaults

| Phase | Value |
| --- | --- |
| Type speed | ~90 ms/char |
| Delete speed | ~45 ms/char |
| Hold (word fully typed) | ~1400 ms |
| Delay before next word | ~400 ms |
| Loop | infinite (wrap index) |

## Scope / Files

- Create: `hooks/use-typewriter.ts`
- Create: `components/ui/Typewriter.tsx`
- Modify: `components/Hero.tsx` (swap static subtitle → typewriter line)
- No new dependencies. No changes to background/preloader systems.

## Verification

- `npx tsc --noEmit` clean; `npm run lint` no new errors in touched files.
- Browser (Chrome DevTools MCP): typewriter line renders below the name; the
  type → pause → delete → advance cycle runs across all four words; cursor
  blinks; no console errors.
- Emulate `prefers-reduced-motion: reduce` → line is static
  "I design and develop websites", cursor solid, no timers running.
