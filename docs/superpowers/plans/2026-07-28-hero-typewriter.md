# Hero Typewriter Line Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated typewriter line ("I design and develop" + rotating `websites → webapps → ui/ux → things`) directly below the hero name, replacing the current static subtitle.

**Architecture:** A logic-only hook (`useTypewriter`) drives a type→pause→delete→advance state machine via `setTimeout`. A thin presentational component (`Typewriter`) renders the hook's partial string plus a blinking cursor and an sr-only full-word list. Hero swaps its static subtitle paragraph for the prefix text + `<Typewriter>`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4, framer-motion v12 (for `useReducedMotion` only). No new dependencies.

## Global Constraints

- No new npm dependency. framer-motion v12 is already installed; use only its `useReducedMotion`.
- Brand palette only. The rotating word + cursor use `text-primary` (which is brand indigo `#6366f1` in this theme). Prefix stays `text-muted-foreground`. Dark-mode only.
- Rotating words, exact and in order: `websites`, `webapps`, `ui/ux`, `things`. Prefix, exact: `I design and develop ` (trailing space before the rotating word).
- Respect `prefers-reduced-motion`: the hook returns the first word statically (no timers); the cursor stops blinking (solid).
- Files (kebab-case for hooks) follow existing patterns: `"use client"` first line, JSDoc on the hook, `cn` from `@/lib/utils` where classes are composed.
- No unit-test runner exists. Verify each task with `npx tsc --noEmit` (clean, exit 0) and `npm run lint` (no NEW errors in touched files; pre-existing `react/no-unescaped-entities` warnings elsewhere are out of scope). Task 3 adds a browser check.
- `git status` shows untracked `.claude-flow/`, `tasks/`, `.superpowers/` scratch — never stage those. Stage only the files each task names.

## File Structure

- `hooks/use-typewriter.ts` — the state-machine hook. One responsibility: given a word list, produce the current partial string over time. No JSX.
- `components/ui/Typewriter.tsx` — thin `"use client"` component: calls the hook, renders rotating word + blinking cursor + sr-only list. One responsibility: presentation.
- `components/Hero.tsx` — edit only: replace the static subtitle `motion.p` with the prefix + `<Typewriter>`, add the import and a module-level stable words constant.

---

### Task 1: `useTypewriter` hook (logic)

Build the type→pause→delete→advance state machine as an isolated, JSX-free hook.

**Files:**
- Create: `hooks/use-typewriter.ts`

**Interfaces:**
- Consumes: nothing (React `useEffect`/`useState` only).
- Produces:
  ```ts
  export interface UseTypewriterOptions {
    words: string[];
    typeSpeedMs?: number;
    deleteSpeedMs?: number;
    pauseMs?: number;
    startDelayMs?: number;
    reducedMotion?: boolean;
  }
  export function useTypewriter(options: UseTypewriterOptions): { text: string };
  ```
  Consumed by Task 2.

- [ ] **Step 1: Write the hook**

Create `hooks/use-typewriter.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

/**
 * useTypewriter — drives a type → pause → delete → advance loop over a list of
 * words and returns the current partial string. Index wraps around forever.
 * When `reducedMotion` is true, returns the first word statically with no timers.
 */
export interface UseTypewriterOptions {
  /** Words to cycle through, in order. */
  words: string[];
  /** Delay between typed characters (ms). */
  typeSpeedMs?: number;
  /** Delay between deleted characters (ms). */
  deleteSpeedMs?: number;
  /** Hold time once a word is fully typed (ms). */
  pauseMs?: number;
  /** Pause after a word is fully deleted, before the next word types (ms). */
  startDelayMs?: number;
  /** When true, skip all animation and show the first word. */
  reducedMotion?: boolean;
}

type Phase = "typing" | "pausing" | "deleting";

export function useTypewriter({
  words,
  typeSpeedMs = 90,
  deleteSpeedMs = 45,
  pauseMs = 1400,
  startDelayMs = 400,
  reducedMotion = false,
}: UseTypewriterOptions): { text: string } {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    // Static cases (no words / reduced motion) are derived below — no timers.
    if (words.length === 0 || reducedMotion) {
      return;
    }

    let wordIndex = 0;
    let charCount = 0;
    let phase: Phase = "typing";
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = words[wordIndex];

      if (phase === "typing") {
        charCount++;
        setTyped(current.slice(0, charCount));
        if (charCount === current.length) {
          phase = "pausing";
          timer = setTimeout(tick, pauseMs);
        } else {
          timer = setTimeout(tick, typeSpeedMs);
        }
      } else if (phase === "pausing") {
        phase = "deleting";
        timer = setTimeout(tick, deleteSpeedMs);
      } else {
        charCount--;
        setTyped(current.slice(0, charCount));
        if (charCount === 0) {
          wordIndex = (wordIndex + 1) % words.length;
          phase = "typing";
          timer = setTimeout(tick, startDelayMs);
        } else {
          timer = setTimeout(tick, deleteSpeedMs);
        }
      }
    };

    timer = setTimeout(tick, typeSpeedMs);

    return () => clearTimeout(timer);
  }, [words, typeSpeedMs, deleteSpeedMs, pauseMs, startDelayMs, reducedMotion]);

  // Derive visible text: static for empty/reduced-motion, animated otherwise.
  const text = words.length === 0 ? "" : reducedMotion ? words[0] : typed;

  return { text };
}
```

Note: `words` is in the dependency array, so callers MUST pass a stable reference (a module-level constant or a `useMemo`'d array) or the effect will restart every render. Task 3 uses a module-level constant, satisfying this. The static cases (empty / reduced-motion) are **derived** from `words` rather than pushed via `setState` inside the effect — this avoids React 19's `react-hooks/set-state-in-effect` lint error while keeping identical behavior.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no NEW errors in `hooks/use-typewriter.ts`. (In particular, no `react-hooks/exhaustive-deps` warning — every value used inside the effect is in the deps array.)

- [ ] **Step 4: Commit**

```bash
git add hooks/use-typewriter.ts
git commit -m "feat(hero): add useTypewriter state-machine hook"
```

---

### Task 2: `Typewriter` component (presentation)

Render the hook's output plus a blinking cursor and an accessible full-word list.

**Files:**
- Create: `components/ui/Typewriter.tsx`

**Interfaces:**
- Consumes: `useTypewriter` from `@/hooks/use-typewriter` (Task 1); `useReducedMotion` from `framer-motion`; `cn` from `@/lib/utils`.
- Produces:
  ```tsx
  export interface TypewriterProps {
    words: string[];
    className?: string;
    typeSpeedMs?: number;
    deleteSpeedMs?: number;
    pauseMs?: number;
    startDelayMs?: number;
  }
  export function Typewriter(props: TypewriterProps): React.JSX.Element;
  ```
  Consumed by Task 3.

- [ ] **Step 1: Write the component**

Create `components/ui/Typewriter.tsx`:

```tsx
"use client";

import { useReducedMotion } from "framer-motion";
import { useTypewriter } from "@/hooks/use-typewriter";
import { cn } from "@/lib/utils";

export interface TypewriterProps {
  /** Words to cycle through, in order. Pass a stable reference. */
  words: string[];
  /** Extra classes for the rotating-word span. */
  className?: string;
  typeSpeedMs?: number;
  deleteSpeedMs?: number;
  pauseMs?: number;
  startDelayMs?: number;
}

/**
 * Typewriter — types a rotating word in/out with a blinking cursor. The prefix
 * text lives in the parent; this renders only the animated word + cursor.
 * Screen readers get the full word list once via an sr-only span.
 */
export function Typewriter({
  words,
  className,
  typeSpeedMs,
  deleteSpeedMs,
  pauseMs,
  startDelayMs,
}: TypewriterProps) {
  const reducedMotion = useReducedMotion();
  const { text } = useTypewriter({
    words,
    typeSpeedMs,
    deleteSpeedMs,
    pauseMs,
    startDelayMs,
    reducedMotion: reducedMotion ?? false,
  });

  return (
    <span className={cn("text-primary font-semibold", className)}>
      <span aria-hidden="true">{text}</span>
      <span
        className={cn("typewriter-cursor", reducedMotion && "typewriter-cursor--static")}
        aria-hidden="true"
      >
        |
      </span>
      <span className="sr-only">{words.join(", ")}</span>
      <style jsx>{`
        .typewriter-cursor {
          margin-left: 1px;
          animation: typewriter-blink 1s steps(2, start) infinite;
        }
        .typewriter-cursor--static {
          animation: none;
          opacity: 1;
        }
        @keyframes typewriter-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .typewriter-cursor {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
```

Note: `text-primary` is the theme's brand indigo (`#6366f1`), matching the spec. The cursor is a `|` glyph (baseline-aligns with the word automatically); it blinks via opacity and goes solid under reduced motion (both the JS-driven `--static` class and the CSS media query cover it).

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/ui/Typewriter.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Typewriter.tsx
git commit -m "feat(hero): add Typewriter presentational component"
```

---

### Task 3: Wire the typewriter into Hero (replace static subtitle)

Swap the hero's static subtitle paragraph for the prefix + `<Typewriter>`, then verify in the browser.

**Files:**
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `Typewriter` from `@/components/ui/Typewriter` (Task 2).
- Produces: nothing (wiring).

- [ ] **Step 1: Add the import**

In `components/Hero.tsx`, add with the other component imports (near the `MatrixText` import, ~line 8):

```tsx
import { Typewriter } from "@/components/ui/Typewriter";
```

- [ ] **Step 2: Add a stable words constant**

In `components/Hero.tsx`, add a module-level constant near the top (after imports, alongside the existing `heroBadgeVariants`/`heroItemVariantsFast` consts, ~line 22). A module-level constant is a stable reference, which the hook requires:

```tsx
const TYPEWRITER_WORDS = ["websites", "webapps", "ui/ux", "things"];
```

- [ ] **Step 3: Replace the static subtitle**

In `components/Hero.tsx`, find the static subtitle block (currently ~lines 149–154):

```tsx
        {/* Subtitle - staggered */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance"
        >
          "Frontend developer & problem solver. Passionate about building clean, performant web experiences that make a difference."
        </motion.p>
```

Replace it with (keep the same `motion.p`, variants, and className so the staggered entrance and proportions are unchanged):

```tsx
        {/* Tagline - typewriter rotating words */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance"
        >
          I design and develop{" "}
          <Typewriter words={TYPEWRITER_WORDS} />
        </motion.p>
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Hero.tsx`.

- [ ] **Step 6: Browser verification**

Start the dev server (`npm run dev`) and open `http://localhost:3000`. Confirm:
- Below the name "Evan Rafif Pradana" the line reads `I design and develop` followed by a rotating word.
- Over a few seconds the word types in, holds, deletes, and advances through `websites → webapps → ui/ux → things` then wraps.
- A cursor (`|`) blinks next to the word.
- The rotating word is brand indigo; the prefix is muted.
- No console errors/warnings (Chrome DevTools MCP `list_console_messages`).
- Emulate `prefers-reduced-motion: reduce` and reload: the line is static `I design and develop websites` with a solid (non-blinking) cursor.

Stop the dev server when done.

- [ ] **Step 7: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): replace static subtitle with typewriter tagline"
```

---

## Self-Review

**Spec coverage:**
- Static prefix "I design and develop " + rotating `websites/webapps/ui/ux/things` → Task 1 (logic) + Task 3 (prefix + words constant). ✓
- Type → pause → delete → advance, infinite wrap → Task 1 state machine. ✓
- Blinking cursor, brand indigo → Task 2. ✓
- Replaces static subtitle, same wrapper/variants/font → Task 3 Step 3. ✓
- Reduced motion → static first word + solid cursor → Task 1 (`reducedMotion` branch) + Task 2 (cursor `--static` + media query). ✓
- Accessibility: prefix real text, rotating word + cursor `aria-hidden`, one sr-only full-word list → Task 2. ✓
- No new dependency; framer-motion only for `useReducedMotion` → Global Constraints + Task 2. ✓
- Two focused units (hook + component) + Hero edit → File Structure. ✓

**Placeholder scan:** No TBD/TODO. Every code step shows complete code. The stable-reference note (Task 1 Step 1 / Task 3 Step 2) is a concrete requirement satisfied by the module-level constant, not a placeholder.

**Type consistency:** `useTypewriter(UseTypewriterOptions): { text: string }` defined in Task 1, consumed identically in Task 2. `Typewriter(TypewriterProps)` defined in Task 2, consumed in Task 3 with `words={TYPEWRITER_WORDS}`. Prop names (`typeSpeedMs`, `deleteSpeedMs`, `pauseMs`, `startDelayMs`, `words`, `className`) match across hook and component. `reducedMotion ?? false` bridges framer-motion's `boolean | null` to the hook's `boolean`. All consistent.
