# Scroll-Reveal Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every section below the Hero (About, Experience, Organization, Projects, Skills, Education, Contact) rises + fades in bound to scroll position (scrub) and then stays clearly visible once fully in view. Hero is unchanged. Reuse framer-motion v12 — no GSAP, no new footer, no new dependency.

**Architecture:** A reusable `ScrollReveal` wrapper (`components/ui/ScrollReveal.tsx`) uses `useScroll({ target, offset })` + `useTransform` to drive `y` (64px → 0) and `opacity` (0 → 1) as MotionValues in `style`. framer's `useTransform` auto-clamps outside the input range, so once a section is fully revealed the values pin at `y:0, opacity:1` (no re-fade). `app/page.tsx` wraps each below-Hero section in `<ScrollReveal>`. Section internals are untouched.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4, framer-motion v12. No new dependencies, no assets.

## Global Constraints

- No new npm dependency. No GSAP. No new footer. No assets.
- Only sections **below Hero** are wrapped. `<Hero />` stays instant (not wrapped).
- Do NOT edit the internal contents of the 7 sections. Only `page.tsx` and the new component change.
- MotionValues drive `style={{ y, opacity }}` (scroll-bound, no re-render) — same pattern as `components/backgrounds/SectionBackground.tsx`. Do NOT use `animate` for the scrub.
- `useReducedMotion()` true → render a plain `<div className={className}>{children}</div>`, no animation, content immediately visible.
- Reveal is one-directional in feel: scrub in, then stay clear. Achieved by clamping (default `useTransform` behavior) — do NOT add reverse/exit fade.
- No unit-test runner exists. Verify with `npx tsc --noEmit` (clean, exit 0) and `npm run lint` (no NEW errors in touched files). Task 2 adds a browser check.
- `git status` shows untracked `.claude-flow/`, `tasks/` scratch — never stage those. Stage only the files each task names.

## File Structure

- `components/ui/ScrollReveal.tsx` — reusable `"use client"` wrapper. One responsibility: scrub-reveal whatever single child block it wraps. Knows nothing about which section.
- `app/page.tsx` — import `ScrollReveal`, wrap the 7 below-Hero sections. Hero left as-is.

---

### Task 1: `ScrollReveal` reusable component

Build the scrub-reveal wrapper as an isolated, content-agnostic unit.

**Files:**
- Create: `components/ui/ScrollReveal.tsx`

**Interfaces:**
- Consumes: `framer-motion` (`motion`, `useScroll`, `useTransform`, `useReducedMotion`); React.
- Produces:
  ```tsx
  interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
  }
  export default function ScrollReveal(props: ScrollRevealProps): React.JSX.Element;
  ```
  Consumed by Task 2.

- [ ] **Step 1: Write the component**

Create `components/ui/ScrollReveal.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 60%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
```

Notes:
- All hooks (`useRef`, `useReducedMotion`, `useScroll`, `useTransform`) are called UNCONDITIONALLY at the top, before any branch. Only the returned JSX branches on `reducedMotion`. Hook order is stable — no `react-hooks/rules-of-hooks` violation. Keep it exactly as written.
- `useTransform` auto-clamps: past progress 1, `y` stays 0 and `opacity` stays 1. This delivers "muncul lalu tetap jelas" with no extra logic.
- Do not add `willChange`, `viewport`, or `initial/animate` — scrub is fully driven by `style` MotionValues.

- [ ] **Step 2: Verify**

- `npx tsc --noEmit` → exit 0.
- `npm run lint` → no NEW errors for `components/ui/ScrollReveal.tsx`.
- Confirm no `react-hooks/rules-of-hooks` warning (all hooks are above the branch).

**Task 1 ledger:** record files changed, tsc/lint result.

---

### Task 2: Wire into `app/page.tsx` + browser verification

Wrap the 7 below-Hero sections and verify the effect in the browser.

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` default export from Task 1.
- Produces: no new exports.

- [ ] **Step 1: Edit `app/page.tsx`**

Add the import and wrap each section below `<Hero />`:

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Organization from "@/components/Organization";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
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
  );
}
```

Hero stays unwrapped. Import order/style follows the existing file.

- [ ] **Step 2: Static checks**

- `npx tsc --noEmit` → exit 0.
- `npm run lint` → no NEW errors in `app/page.tsx`.

- [ ] **Step 3: Browser verification (Chrome DevTools MCP)**

Dev server on `localhost:3000` (start `npm run dev` if not running).

- Scroll slowly Hero → bottom. Confirm each wrapped section rises (~64px) + fades in bound to scroll, then STAYS clear when scrolled past (no re-fade).
- Watch for double-fade harshness (wrapper fade stacking with each section's internal `useInView` fade). Screenshot About, Projects, Contact.
- Confirm Contact reaches full `opacity:1` at the bottom of the page. If it never fully reveals (short section at scroll end), apply the tuning below.
- `list_console_messages` → no errors, no hydration warnings.

- [ ] **Step 4: Tuning (only if Step 3 shows a problem)**

Conditional, do NOT apply pre-emptively:
- **Contact never fully reveals:** add an optional `offset?: Parameters<typeof useScroll>[0]["offset"]` prop to `ScrollReveal` (default `["start end", "start 60%"]`) and pass `offset={["start end", "center 75%"]}` to the Contact wrapper only.
- **Double-fade too harsh:** narrow the wrapper fade — change `opacity` input range to `[0, 0.6]` so fade completes earlier, letting the section's own reveal finish the effect. If still harsh, escalate to Approach C (dampen internal fade) — but flag to the user before touching section internals, since that is out of the current scope.

**Task 2 ledger:** record files changed, tsc/lint result, browser observations, whether any tuning was applied.

---

## Final Review (whole branch)

After both tasks:
- `npx tsc --noEmit` clean, `npm run lint` no new errors.
- Re-scroll the full page once more in the browser; confirm smooth scrub reveal on every below-Hero section and a clean console.
- `git diff` shows only `components/ui/ScrollReveal.tsx` (new) and `app/page.tsx` (wrapped sections). No section internals touched.
- Commit: `feat(reveal): scrub-reveal sections below hero on scroll`.
