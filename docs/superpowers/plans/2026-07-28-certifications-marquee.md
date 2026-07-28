# Certifications Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Certifications grid in the Education section with an infinite auto-scrolling marquee of the 9 existing certification cards (leftward, 30s, pause-on-hover, edge fade), falling back to the static grid under reduced motion.

**Architecture:** A reusable `Marquee` component (`components/ui/marquee.tsx`) duplicates its children and CSS-animates the track `translateX(0 → -50%)` for a seamless loop, with an edge mask and pause-on-hover. `Education.tsx` extracts the certification card into a shared local piece and renders the 9 cards inside `<Marquee>` when motion is allowed, or the existing static grid when `prefers-reduced-motion`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4, framer-motion v12 (for `useReducedMotion`), styled-jsx (already used across the codebase). No new dependencies, no assets.

## Global Constraints

- No new npm dependency. No image/asset files. Cards are text (name / issuer / year / icon).
- Only the 21st.dev **technique** is reused (duplicate items, `translateX(0 → -50%)` linear-infinite, edge `mask` gradient, hover). The original's Unsplash images, `min-h-screen bg-black` shell, and global `html, body` style are NOT copied. All CSS is scoped via `<style jsx>`.
- Brand palette / existing tokens only (`bg-card`, `border-border`, `text-primary`, etc.). Dark-mode only.
- Marquee: leftward, `speedSeconds` default 30, linear infinite, `pauseOnHover` default true. Include a `@media (prefers-reduced-motion: reduce) { animation: none }` safety rule inside the component.
- Reduced-motion handling in Education is the PRIMARY path: `useReducedMotion()` true → static grid (`grid sm:grid-cols-2 lg:grid-cols-4 gap-4`) of the 9 cards; false → `<Marquee>`.
- Only the Certifications sub-block of `Education.tsx` changes. Do NOT touch the degree card, thesis, honors, subjects, or the section header. Cards stay non-interactive.
- No unit-test runner exists. Verify with `npx tsc --noEmit` (clean, exit 0) and `npm run lint` (no NEW errors in touched files; `Education.tsx` has PRE-EXISTING `react/no-unescaped-entities` warnings that are out of scope). Task 2 adds a browser check.
- `git status` shows untracked `.claude-flow/`, `tasks/`, `.superpowers/` scratch — never stage those. Stage only the files each task names.

## File Structure

- `components/ui/marquee.tsx` — reusable `"use client"` marquee. One responsibility: infinite-scroll whatever children it's given. Knows nothing about certifications.
- `components/Education.tsx` — edit only the Certifications sub-block (~lines 238–262): extract a local `CertCard` renderer, render the 9 cards either inside `<Marquee>` (motion) or the existing static grid (reduced motion).

---

### Task 1: `Marquee` reusable component

Build the infinite-scroll marquee as an isolated, content-agnostic unit.

**Files:**
- Create: `components/ui/marquee.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`; React.
- Produces:
  ```tsx
  export interface MarqueeProps {
    children: React.ReactNode;
    speedSeconds?: number;   // default 30
    pauseOnHover?: boolean;  // default true
    className?: string;
    ariaLabel?: string;
  }
  export function Marquee(props: MarqueeProps): React.JSX.Element;
  ```
  Consumed by Task 2.

- [ ] **Step 1: Write the component**

Create `components/ui/marquee.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";

export interface MarqueeProps {
  /** Content to scroll. Rendered twice for a seamless loop. */
  children: React.ReactNode;
  /** Full loop duration in seconds. Default 30. */
  speedSeconds?: number;
  /** Pause the scroll while hovered. Default true. */
  pauseOnHover?: boolean;
  /** Extra classes on the outer region. */
  className?: string;
  /** Accessible label for the scrolling region. */
  ariaLabel?: string;
}

/**
 * Marquee — infinite horizontal auto-scroll. Duplicates its children into a
 * two-half track and animates translateX(0 → -50%) so the wrap is seamless.
 * Edges fade via a mask. Pauses on hover when enabled. Under
 * prefers-reduced-motion the animation is disabled (a static, clipped row);
 * callers that need a fully static layout should branch before using Marquee.
 */
export function Marquee({
  children,
  speedSeconds = 30,
  pauseOnHover = true,
  className,
  ariaLabel,
}: MarqueeProps) {
  return (
    <div
      className={cn("marquee-root relative w-full overflow-hidden", className)}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className={cn("marquee-track flex w-max", pauseOnHover && "marquee-pausable")}
        style={{ "--marquee-duration": `${speedSeconds}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>

      <style jsx>{`
        .marquee-root {
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
        .marquee-track {
          animation: marquee-scroll var(--marquee-duration, 30s) linear infinite;
        }
        .marquee-pausable:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
```

Note: the track is two identical halves each `shrink-0`; at `-50%` the first half has fully exited and the second sits exactly where the first began → seamless. `w-max` lets the track exceed the viewport. The duration is passed as the CSS custom property `--marquee-duration` via inline `style` and read with `var()` — do NOT interpolate `${speedSeconds}` directly inside the `<style jsx>` `animation` shorthand: styled-jsx mangles a dynamic token in a shorthand to `animation: auto ... 0s` (duration 0 → no motion). The custom-property approach keeps the stylesheet static and works.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/ui/marquee.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/ui/marquee.tsx
git commit -m "feat(cert): add reusable infinite-scroll Marquee component"
```

---

### Task 2: Wire the marquee into Education's Certifications block

Extract the shared cert card, render it in the marquee (motion) or the static grid (reduced motion), then verify in the browser.

**Files:**
- Modify: `components/Education.tsx`

**Interfaces:**
- Consumes: `Marquee` from `@/components/ui/marquee` (Task 1); existing `CERTIFICATIONS`, `iconMap`, `certVariants`, `useReducedMotion` in `Education.tsx`.
- Produces: nothing (wiring).

The line numbers below are approximate — match on the code, not the numbers.

- [ ] **Step 1: Add the import**

In `components/Education.tsx`, add with the other imports (near the top, after the framer-motion import):

```tsx
import { Marquee } from "@/components/ui/marquee";
```

- [ ] **Step 2: Extract a shared `CertCard` renderer**

The current code maps `CERTIFICATIONS` inline inside the grid. Extract the card into a module-level helper so both the marquee and the static fallback render identical cards. Add this function at module scope (after the `certVariants` const, before `export default function Education`):

```tsx
function CertCard({ cert }: { cert: (typeof CERTIFICATIONS)[number] }) {
  const CertIcon = iconMap[cert.icon as keyof typeof iconMap];
  return (
    <motion.div
      variants={certVariants}
      className="group w-72 shrink-0 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <CertIcon className="size-6" aria-hidden="true" />
      </div>
      <h4 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
        {cert.name}
      </h4>
      <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
      <p className="text-xs text-muted-foreground/70 mt-0.5">{cert.year}</p>
    </motion.div>
  );
}
```

Note: this is the existing card markup, with `w-72 shrink-0` added so the marquee row is even and each card holds its width. The static-grid branch (Step 3) overrides layout via the grid, and `w-72` still renders acceptably inside a grid cell (it caps each card's width; acceptable and visually consistent). The `motion.div variants` still animate on the section's in-view stagger.

- [ ] **Step 3: Replace the grid render with a motion-aware branch**

Find the Certifications inner render (currently the `motion.div` with `className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"` mapping `CERTIFICATIONS`, ~lines 238–262). Replace that whole `motion.div` block with:

```tsx
          {reducedMotion ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center"
            >
              {CERTIFICATIONS.map((cert) => (
                <CertCard key={cert.name} cert={cert} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <Marquee speedSeconds={30} pauseOnHover ariaLabel="Certifications" className="py-2">
                <div className="flex gap-4 pr-4">
                  {CERTIFICATIONS.map((cert) => (
                    <CertCard key={cert.name} cert={cert} />
                  ))}
                </div>
              </Marquee>
            </motion.div>
          )}
```

Notes:
- `reducedMotion` and `isInView` are already defined in the component; `containerVariants` is already imported.
- The static branch adds `justify-items-center` so the fixed-width (`w-72`) cards sit centered in their grid cells.
- In the marquee branch, the cards are wrapped in a `flex gap-4 pr-4` row so there is spacing between cards and a trailing gap before the duplicated half (the duplicate is created inside `Marquee`).
- Do NOT alter the heading/subtext above this block, or the outer `motion.div` that wraps the whole Certifications section (the one with `EDU_LABELS.certifications`).

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Education.tsx` (the added JSX contains no unescaped quotes/apostrophes; pre-existing `react/no-unescaped-entities` elsewhere in the file are out of scope and unchanged).

- [ ] **Step 6: Browser verification**

Start the dev server in the background (`npm run dev > /tmp/cert-dev.log 2>&1 &`), poll the log until "Ready"/"Local:", then open `http://localhost:3000/#education` (Chrome DevTools MCP `new_page`). Confirm:
- The Certifications row scrolls leftward continuously.
- The loop is seamless — sample the track's `transform` (or the visible order of cards) over ~a full cycle and confirm no visible jump/gap at the wrap point.
- Hovering the row pauses the scroll; moving away resumes it.
- All 9 certifications are present and readable; the row edges fade.
- `list_console_messages` (error+warn) shows nothing related to this change.
- Reduced motion: reload with `prefers-reduced-motion: reduce` emulated (or reason from the code path if the emulate tool can't set it) → the Certifications block is the static `grid sm:grid-cols-2 lg:grid-cols-4` of 9 cards, no scrolling.

Stop the dev server when done (`pkill -f "next dev"`). Capture observations (and any screenshot paths under the scratch dir) in the report.

- [ ] **Step 7: Commit**

```bash
git add components/Education.tsx
git commit -m "feat(cert): scroll certifications in a marquee with static fallback"
```

---

## Self-Review

**Spec coverage:**
- Reusable marquee (duplicate 2×, translateX 0→-50%, linear infinite, edge mask, pause-on-hover, reduced-motion media rule) → Task 1. ✓
- Adapts 21st.dev technique only; no Unsplash / full-screen black / global body reset; scoped CSS → Task 1 (styled-jsx, no global rules) + Global Constraints. ✓
- Education Certifications: marquee when motion-ok, static grid when reduced-motion → Task 2 Step 3 branch. ✓
- Shared cert card markup extracted, identical in both branches → Task 2 Step 2 `CertCard`. ✓
- 9 existing `CERTIFICATIONS`, no assets → Task 2 uses the existing const. ✓
- Only the Certifications sub-block changes; header/degree/thesis untouched → Task 2 Step 3 notes. ✓
- Brand tokens only, dark mode → card markup reuses existing classes. ✓
- Verify tsc + lint + browser (seamless loop, hover pause, reduced-motion grid) → Task 1 Steps 2–3, Task 2 Steps 4–6. ✓

**Placeholder scan:** No TBD/TODO. Every code step shows complete code. The "match on the code, not the numbers" notes are concrete guidance, not placeholders.

**Type consistency:** `Marquee(MarqueeProps)` defined in Task 1, consumed in Task 2 with `speedSeconds={30} pauseOnHover ariaLabel="Certifications" className="py-2"`. `CertCard` prop type `{ cert: (typeof CERTIFICATIONS)[number] }` matches the existing `CERTIFICATIONS` element shape (name/issuer/year/icon). `iconMap`, `certVariants`, `containerVariants`, `useReducedMotion`, `isInView` all already exist in `Education.tsx`. Consistent.
