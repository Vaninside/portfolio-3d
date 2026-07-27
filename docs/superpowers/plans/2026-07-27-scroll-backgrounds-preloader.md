# Scroll Background Transitions + Preloader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-section animated backgrounds that smoothly crossfade on scroll (8 distinct motifs, Hero keeps its particle network), plus an every-load preloader (name + loader-2 animation on black).

**Architecture:** One fixed full-page `SectionBackground` controller renders 8 stacked motif layers and drives each layer's opacity from scroll progress via motion.dev `useScroll`/`useTransform` (overlapping bands = crossfade). A readability overlay sits above the motifs, below content. Section-level opaque fills are removed so motifs show through. A `Preloader` client component overlays everything on load, then fades out.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4, motion.dev (framer-motion v12, already installed), lucide-react. No new dependencies.

## Global Constraints

- Brand palette ONLY: indigo `#6366f1`, violet `#8b5cf6`, pink `#ec4899`, over near-black bases. Site is dark-mode only.
- motion.dev IS framer-motion — import from `"framer-motion"` (already a dependency). Do NOT add any npm package.
- "Medium" intensity: motifs are visible/"wah" but a `bg-background/40 backdrop-blur-sm` overlay keeps text readable. Motif animations use transform/opacity only (GPU-friendly) — no layout-thrashing property animations.
- Section order (app/page.tsx): Hero, About, Experience, Organization, Projects, Skills, Education, Contact. Motif per section: Hero=Particle (existing, kept), About=AuroraRibbons, Experience=FlowingWaves, Organization=ConstellationGrid, Projects=SpotlightSweep, Skills=MeshBlobs, Education=Starfield, Contact=WarmGlow.
- Preloader: black `bg-black`, name via existing `components/ui/MatrixText`, loader-2 triple-SVG (circle/triangle/rect) with **white** (`#fff`) stroke. Loader CSS is SCOPED to the preloader (styled-jsx `<style jsx>`), never global — do NOT copy the loader file's global `body{}` or `:root{--clr/--bkg}` rules. Plays on EVERY load (no sessionStorage). Locks body scroll while visible.
- Respect `prefers-reduced-motion`: motifs render a static frame (no internal loops); preloader shows briefly and removes without scramble/long fade.
- Existing `components/ParticleBackground.tsx` is REUSED as the Hero motif — never deleted. Its off-screen-pause + reduced-motion logic stays.
- Design polish: for every motif task and the preloader task, invoke the `ui-ux-pro-max` skill (Skill tool, `skill: "ui-ux-pro-max"`) before writing the visual code, to pick motion/color treatment; keep output within the brand palette.
- No unit-test runner exists. Verify each task with `npx tsc --noEmit` (clean) and `npm run lint` (no NEW errors in touched files); pre-existing `react/no-unescaped-entities` warnings are out of scope. Visual checks are done by the controller in-browser.
- `git status` shows untracked `.claude-flow/`, `tasks/`, `.superpowers/` scratch — never stage those. Stage only the files each task names.

## File Structure

- `components/backgrounds/SectionBackground.tsx` — controller (scroll → per-motif opacity, stacks layers, readability overlay).
- `components/backgrounds/motifs/AuroraRibbons.tsx`, `FlowingWaves.tsx`, `ConstellationGrid.tsx`, `SpotlightSweep.tsx`, `MeshBlobs.tsx`, `Starfield.tsx`, `WarmGlow.tsx` — one motif each, zero-prop `React.memo` client components filling `absolute inset-0`.
- `components/backgrounds/motifs/HeroParticles.tsx` — thin re-export of the existing `components/ParticleBackground.tsx` (keep the original file; re-export keeps motif imports uniform without moving/rewriting it).
- `components/Preloader.tsx` — `"use client"` full-screen preloader.
- Edits: `app/layout.tsx` (mount Preloader + SectionBackground), `components/Hero.tsx` (drop its own ParticleBackground), and 4 section files to remove `bg-muted/30`.

---

### Task 1: Motif primitives — the 7 non-hero motif components

Build the 7 CSS/motion motif components as isolated, independently viewable units. Each fills its layer and animates within the brand palette. No wiring yet — this task delivers the visual building blocks.

**Files:**
- Create: `components/backgrounds/motifs/AuroraRibbons.tsx`, `FlowingWaves.tsx`, `ConstellationGrid.tsx`, `SpotlightSweep.tsx`, `MeshBlobs.tsx`, `Starfield.tsx`, `WarmGlow.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: 7 default-exported zero-prop client components, each `export default React.memo(function <Name>() {...})`, rendering a single `absolute inset-0 overflow-hidden` root. Consumed by Task 3 (`SectionBackground`).

- [ ] **Step 1: Invoke the design skill**

Call the Skill tool with `skill: "ui-ux-pro-max"` and ask for motion/color treatment guidance for 7 dark-mode animated background motifs (aurora ribbons, flowing waves, constellation dot grid, spotlight sweep, mesh gradient blobs, starfield, warm rising glow) in an indigo/violet/pink palette. Use its guidance to inform the exact gradients/durations below (you may refine values, but stay in-palette and keep animations transform/opacity-only).

- [ ] **Step 2: Write AuroraRibbons.tsx**

```tsx
"use client";
import { memo } from "react";

function AuroraRibbons() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -inset-[40%] motif-aurora"
        style={{
          background:
            "conic-gradient(from 0deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
          filter: "blur(60px)",
          opacity: 0.4,
        }}
      />
      <style jsx>{`
        .motif-aurora {
          animation: motif-aurora-spin 22s linear infinite;
        }
        @keyframes motif-aurora-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-aurora {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(AuroraRibbons);
```

- [ ] **Step 3: Write FlowingWaves.tsx**

```tsx
"use client";
import { memo } from "react";

function FlowingWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 motif-waves"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 60px, rgba(139,92,246,0.14) 60px 70px, transparent 70px 130px)",
        }}
      />
      <style jsx>{`
        .motif-waves {
          animation: motif-waves-slide 9s linear infinite;
        }
        @keyframes motif-waves-slide {
          to {
            transform: translateX(-130px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-waves {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(FlowingWaves);
```

- [ ] **Step 4: Write ConstellationGrid.tsx**

```tsx
"use client";
import { memo } from "react";

function ConstellationGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 motif-constellation"
        style={{
          backgroundImage:
            "radial-gradient(rgba(236,72,153,0.5) 1.5px, transparent 1.5px), radial-gradient(rgba(99,102,241,0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "44px 44px, 44px 44px",
          backgroundPosition: "0 0, 22px 22px",
        }}
      />
      <style jsx>{`
        .motif-constellation {
          animation: motif-constellation-pulse 5s ease-in-out infinite;
        }
        @keyframes motif-constellation-pulse {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.75;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-constellation {
            animation: none;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(ConstellationGrid);
```

- [ ] **Step 5: Write SpotlightSweep.tsx**

```tsx
"use client";
import { memo } from "react";

function SpotlightSweep() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute top-[-20%] h-[140%] w-[55%] motif-spotlight"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.42), transparent 60%)",
          filter: "blur(40px)",
          left: "-10%",
        }}
      />
      <style jsx>{`
        .motif-spotlight {
          animation: motif-spotlight-sweep 11s ease-in-out infinite alternate;
        }
        @keyframes motif-spotlight-sweep {
          to {
            transform: translateX(120%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-spotlight {
            animation: none;
            transform: translateX(60%);
          }
        }
      `}</style>
    </div>
  );
}

export default memo(SpotlightSweep);
```

- [ ] **Step 6: Write MeshBlobs.tsx**

```tsx
"use client";
import { memo } from "react";

function MeshBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 motif-mesh"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.5), transparent 42%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.42), transparent 42%), radial-gradient(circle at 60% 20%, rgba(139,92,246,0.38), transparent 45%)",
          filter: "blur(20px)",
        }}
      />
      <style jsx>{`
        .motif-mesh {
          animation: motif-mesh-breathe 12s ease-in-out infinite alternate;
          transform-origin: center;
        }
        @keyframes motif-mesh-breathe {
          to {
            transform: scale(1.12);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-mesh {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(MeshBlobs);
```

- [ ] **Step 7: Write Starfield.tsx**

```tsx
"use client";
import { memo } from "react";

function Starfield() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.14), transparent 55%)",
      }}
    >
      <div
        className="absolute inset-0 motif-stars"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.16,
        }}
      />
      <style jsx>{`
        .motif-stars {
          animation: motif-stars-twinkle 4s ease-in-out infinite;
        }
        @keyframes motif-stars-twinkle {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.28;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-stars {
            animation: none;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(Starfield);
```

- [ ] **Step 8: Write WarmGlow.tsx**

```tsx
"use client";
import { memo } from "react";

function WarmGlow() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ background: "linear-gradient(0deg, #1a0f22, transparent)" }}
    >
      <div
        className="absolute inset-0 motif-warm"
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(236,72,153,0.45), transparent 60%)",
        }}
      />
      <style jsx>{`
        .motif-warm {
          animation: motif-warm-rise 6s ease-in-out infinite alternate;
        }
        @keyframes motif-warm-rise {
          to {
            transform: translateY(-16px);
            opacity: 0.85;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-warm {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(WarmGlow);
```

- [ ] **Step 9: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 10: Lint**

Run: `npm run lint`
Expected: no NEW errors in the 7 new files.

- [ ] **Step 11: Commit**

```bash
git add components/backgrounds/motifs/AuroraRibbons.tsx components/backgrounds/motifs/FlowingWaves.tsx components/backgrounds/motifs/ConstellationGrid.tsx components/backgrounds/motifs/SpotlightSweep.tsx components/backgrounds/motifs/MeshBlobs.tsx components/backgrounds/motifs/Starfield.tsx components/backgrounds/motifs/WarmGlow.tsx
git commit -m "feat(bg): add 7 animated section background motifs"
```

---

### Task 2: Hero-particle motif re-export

Provide a uniform motif import for the Hero's existing particle background without moving or rewriting it.

**Files:**
- Create: `components/backgrounds/motifs/HeroParticles.tsx`

**Interfaces:**
- Consumes: existing `components/ParticleBackground.tsx` (default export, zero-prop client component; it renders its own `fixed inset-0 -z-10` wrapper).
- Produces: `export default` — re-exported ParticleBackground. Consumed by Task 3.

- [ ] **Step 1: Write the re-export**

Create `components/backgrounds/motifs/HeroParticles.tsx`:

```tsx
"use client";
export { default } from "@/components/ParticleBackground";
```

Note: `ParticleBackground` currently wraps itself in `fixed inset-0 -z-10`. Inside `SectionBackground` it will be placed in an `absolute inset-0` layer; a nested `fixed` element still fills the viewport, so it renders correctly as the hero layer. Task 3's opacity wrapper controls its visibility. (Do not modify ParticleBackground in this task.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add components/backgrounds/motifs/HeroParticles.tsx
git commit -m "feat(bg): re-export ParticleBackground as hero motif"
```

---

### Task 3: SectionBackground controller (scroll-linked crossfade)

The core: stack all 8 motifs and drive each layer's opacity from page scroll progress so neighbors crossfade. Add the readability overlay.

**Files:**
- Create: `components/backgrounds/SectionBackground.tsx`

**Interfaces:**
- Consumes: the 8 motif components — `HeroParticles`, `AuroraRibbons`, `FlowingWaves`, `ConstellationGrid`, `SpotlightSweep`, `MeshBlobs`, `Starfield`, `WarmGlow` (all default-exported, zero-prop).
- Produces: `export default function SectionBackground()` — a zero-prop `"use client"` component rendering `fixed inset-0 -z-10`. Consumed by Task 4 (mounted in layout).

- [ ] **Step 1: Invoke the design skill**

Call the Skill tool with `skill: "ui-ux-pro-max"` for guidance on smooth scroll-crossfade timing (overlap windows, easing) for a stacked-layer background. Keep the band math below unless it recommends a concretely better curve.

- [ ] **Step 2: Write SectionBackground.tsx**

Each motif owns a band centered on its section. With 8 sections, each band is 1/8 of scroll progress; opacity ramps up over the preceding half-band and down over the following half-band (overlap = crossfade). Uses a helper `MotifLayer` with `useTransform`.

```tsx
"use client";
import { memo, type ComponentType, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import HeroParticles from "@/components/backgrounds/motifs/HeroParticles";
import AuroraRibbons from "@/components/backgrounds/motifs/AuroraRibbons";
import FlowingWaves from "@/components/backgrounds/motifs/FlowingWaves";
import ConstellationGrid from "@/components/backgrounds/motifs/ConstellationGrid";
import SpotlightSweep from "@/components/backgrounds/motifs/SpotlightSweep";
import MeshBlobs from "@/components/backgrounds/motifs/MeshBlobs";
import Starfield from "@/components/backgrounds/motifs/Starfield";
import WarmGlow from "@/components/backgrounds/motifs/WarmGlow";

const MOTIFS: ComponentType[] = [
  HeroParticles,
  AuroraRibbons,
  FlowingWaves,
  ConstellationGrid,
  SpotlightSweep,
  MeshBlobs,
  Starfield,
  WarmGlow,
];

const N = MOTIFS.length; // 8

function MotifLayer({
  index,
  progress,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const band = 1 / N;
  const center = index * band + band / 2;
  // fade-in begins a full band before center, fade-out ends a band after.
  const p0 = Math.max(0, center - band);
  const p1 = center;
  const p2 = Math.min(1, center + band);
  const opacity = useTransform(
    progress,
    [p0, p1, p2],
    [index === 0 ? 1 : 0, 1, index === N - 1 ? 1 : 0]
  );
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {children}
    </motion.div>
  );
}

function SectionBackground() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      {MOTIFS.map((Motif, i) => (
        <MotifLayer key={i} index={i} progress={scrollYProgress}>
          <Motif />
        </MotifLayer>
      ))}
      {/* Readability overlay: keeps text crisp over the motifs */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
    </div>
  );
}

export default memo(SectionBackground);
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0). (`useScroll` with no target tracks the whole document; `useTransform(MotionValue, number[], number[])` returns `MotionValue<number>`, valid for `style={{ opacity }}`.)

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/backgrounds/SectionBackground.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/backgrounds/SectionBackground.tsx
git commit -m "feat(bg): scroll-linked SectionBackground crossfade controller"
```

---

### Task 4: Wire SectionBackground in, remove per-section fills, drop Hero's own particles

Replace the current backgrounds with the new global controller and let motifs show through. After this task the scroll background system is live and visually verifiable.

**Files:**
- Modify: `app/layout.tsx` (mount `SectionBackground` in `<body>`)
- Modify: `components/Hero.tsx` (remove its own `ParticleBackground` dynamic import + `<ParticleBackground />` tag)
- Modify: `components/Experience.tsx`, `components/Projects.tsx`, `components/Education.tsx`, `components/Contact.tsx` (remove `bg-muted/30` from the section-level className)

**Interfaces:**
- Consumes: `SectionBackground` (Task 3).
- Produces: nothing (wiring).

- [ ] **Step 1: Mount SectionBackground in the layout**

In `app/layout.tsx`, add the import and render it as a child of `<body>` (it is `fixed -z-10`, so DOM order among siblings does not matter, but placing it first reads clearly):

Add near the other imports:

```tsx
import SectionBackground from "@/components/backgrounds/SectionBackground";
```

Change the body from:

```tsx
      <body className="min-h-dvh flex flex-col antialiased">
          <Navbar />
          {children}
      </body>
```

to:

```tsx
      <body className="min-h-dvh flex flex-col antialiased">
          <SectionBackground />
          <Navbar />
          {children}
      </body>
```

- [ ] **Step 2: Remove Hero's own ParticleBackground**

In `components/Hero.tsx`, delete the dynamic import block (currently ~lines 11-14):

```tsx
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
  ssr: false,
  loading: () => null,
});
```

and delete its usage (currently ~line 74-75):

```tsx
      {/* Particle network background */}
      <ParticleBackground />
```

If `dynamic` from `next/dynamic` is now unused in Hero.tsx, also remove that import to keep lint clean. Leave Hero's radial-gradient glow and noise overlays intact.

- [ ] **Step 3: Remove `bg-muted/30` from the 4 section fills**

In each of `components/Experience.tsx`, `components/Projects.tsx`, `components/Education.tsx`, `components/Contact.tsx`, find the section-level className `"py-24 px-6 md:py-32 bg-muted/30"` and change it to `"py-24 px-6 md:py-32"` (drop only ` bg-muted/30`). Do NOT touch inner content-card `bg-card` classes — those are content surfaces and stay. About/Organization/Skills have no section-level bg and need no change.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no NEW errors in the touched files (no unused `dynamic`/`ParticleBackground` in Hero).

- [ ] **Step 6: Grep check**

Run: `grep -rn "bg-muted/30" components/Experience.tsx components/Projects.tsx components/Education.tsx components/Contact.tsx`
Expected: no output (all four removed).

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx components/Hero.tsx components/Experience.tsx components/Projects.tsx components/Education.tsx components/Contact.tsx
git commit -m "feat(bg): mount SectionBackground, drop per-section fills and hero particles"
```

---

### Task 5: Preloader component

Full-screen black preloader with the name (MatrixText) + loader-2 white-stroke triple-SVG animation, fading out on load, every load, scroll locked while visible.

**Files:**
- Create: `components/Preloader.tsx`

**Interfaces:**
- Consumes: existing `components/ui/MatrixText` (named export `MatrixText`, used in Hero as `<MatrixText text="..." fontSize=... fontWeight=... fontFamily="" letterAnimationDuration=... letterInterval=... scrambleColor=... matrixChars="01" loop={false} initialDelay=... />`).
- Produces: `export default function Preloader()` — zero-prop `"use client"` component. Consumed by Task 6.

- [ ] **Step 1: Invoke the design skill**

Call the Skill tool with `skill: "ui-ux-pro-max"` for preloader motion polish (entrance/exit easing, name+loader composition on black). Keep loader-2 shapes + white stroke; keep it brand-appropriate.

- [ ] **Step 2: Write Preloader.tsx**

MatrixText props mirror Hero's usage. Loader CSS is scoped via `<style jsx>` with `:global(...)` for the static SVG children. Hide when `load` fired AND min-display elapsed; fade via `AnimatePresence`. Reduced-motion: instant exit, no scramble.

```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MatrixText } from "@/components/ui/MatrixText";

const MIN_DISPLAY_MS = 1400;
const SAFETY_MS = 2500;

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mountedAt = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - mountedAt;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const safety = window.setTimeout(finish, SAFETY_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(safety);
    };
  }, []);

  // Lock scroll while the preloader is visible.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeInOut" }}
          aria-label="Loading"
          role="status"
        >
          <div className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            <MatrixText
              text="Evan Rafif Pradana"
              fontSize="text-3xl sm:text-5xl"
              fontWeight="font-bold"
              fontFamily=""
              letterAnimationDuration={reducedMotion ? 0 : 500}
              letterInterval={reducedMotion ? 0 : 80}
              scrambleColor="#6366f1"
              matrixChars="01"
              loop={false}
              initialDelay={0}
            />
          </div>

          <div className="preloader-shapes flex items-center justify-center">
            <div className="loader">
              <svg viewBox="0 0 80 80">
                <circle r="32" cy="40" cx="40" />
              </svg>
            </div>
            <div className="loader triangle">
              <svg viewBox="0 0 86 80">
                <polygon points="43 8 79 72 7 72" />
              </svg>
            </div>
            <div className="loader">
              <svg viewBox="0 0 80 80">
                <rect height="64" width="64" y="8" x="8" />
              </svg>
            </div>
          </div>

          <style jsx>{`
            .loader {
              display: inline-block;
              width: 56px;
              height: 56px;
              margin: 10px;
            }
            .loader :global(svg) {
              width: 100%;
              height: 100%;
            }
            .loader :global(circle),
            .loader :global(rect),
            .loader :global(polygon) {
              fill: none;
              stroke: #fff;
              stroke-width: 3;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .loader :global(circle) {
              stroke-dasharray: 50 200;
              animation: preloader-path-circle 4s linear infinite;
            }
            .loader.triangle :global(polygon) {
              stroke-dasharray: 74 500;
              animation: preloader-path-triangle 4s linear infinite;
            }
            .loader :global(rect) {
              stroke-dasharray: 64 300;
              animation: preloader-path-rect 4s linear infinite;
            }
            @keyframes preloader-path-circle {
              25% {
                stroke-dashoffset: 125;
              }
              50% {
                stroke-dashoffset: 175;
              }
              75% {
                stroke-dashoffset: 225;
              }
              100% {
                stroke-dashoffset: 275;
              }
            }
            @keyframes preloader-path-triangle {
              33% {
                stroke-dashoffset: 74;
              }
              66% {
                stroke-dashoffset: 147;
              }
              100% {
                stroke-dashoffset: 221;
              }
            }
            @keyframes preloader-path-rect {
              25% {
                stroke-dashoffset: 64;
              }
              50% {
                stroke-dashoffset: 128;
              }
              75% {
                stroke-dashoffset: 192;
              }
              100% {
                stroke-dashoffset: 256;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .loader :global(circle),
              .loader.triangle :global(polygon),
              .loader :global(rect) {
                animation: none;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

Note: `:global(...)` is required because the SVG children are plain markup; without it, styled-jsx scope-hashes the selectors and the styles never match. If any `MatrixText` prop name differs from Hero's actual call, match Hero's call exactly (it is the reference — read `components/Hero.tsx`).

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Preloader.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/Preloader.tsx
git commit -m "feat: add every-load preloader with name + loader-2 animation"
```

---

### Task 6: Mount the preloader

Render the preloader at the top of the layout so it overlays on every load.

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `Preloader` (Task 5), and `SectionBackground` already mounted (Task 4).
- Produces: nothing (wiring).

- [ ] **Step 1: Import and mount Preloader**

In `app/layout.tsx`, add:

```tsx
import Preloader from "@/components/Preloader";
```

and render it as the first child of `<body>` (above `SectionBackground`):

```tsx
      <body className="min-h-dvh flex flex-col antialiased">
          <Preloader />
          <SectionBackground />
          <Navbar />
          {children}
      </body>
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no NEW errors in `app/layout.tsx`.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount preloader in root layout"
```

---

## Self-Review

**Spec coverage:**
- 8 motifs (Hero particle kept + 7 new) → Task 1 (7 motifs) + Task 2 (hero re-export). ✓
- Scroll-linked crossfade controller via motion.dev useScroll/useTransform → Task 3. ✓
- Readability overlay (bg-background/40 backdrop-blur) → Task 3 Step 2. ✓
- Mount controller + section fills transparent + drop hero's own particles → Task 4. ✓
- Preloader: black, MatrixText name, loader-2 white stroke, scoped CSS, every-load, scroll lock, reduced-motion → Task 5. ✓
- Preloader mounted → Task 6. ✓
- ui-ux-pro-max skill invoked for visual tasks → Task 1/3/5 Step 1. ✓
- Brand palette only, no new deps, transform/opacity animations → Global Constraints + each motif. ✓
- prefers-reduced-motion in every motif + preloader → each motif's `<style jsx>` media query + Preloader reducedMotion. ✓
- ParticleBackground reused not deleted → Task 2 re-export; Task 4 only removes Hero's *call*, not the file. ✓

**Placeholder scan:** No TBD/TODO. Every code step shows complete code. The two conditional notes (Task 4 Step 2 "if dynamic now unused, remove import"; Task 5 "match Hero's MatrixText props") are concrete verifications against visible code, not placeholders.

**Type consistency:** `SectionBackground` default export consumed by layout; the 8 motifs are all `export default memo(...)` zero-prop and typed as `ComponentType[]` in Task 3's `MOTIFS`; `MotifLayer` takes `MotionValue<number>`; `useTransform(progress, number[], number[])` returns `MotionValue<number>` for `style={{ opacity }}`. `MatrixText` named import matches Hero's usage. `Preloader` default export consumed by layout in Task 6. All consistent.
