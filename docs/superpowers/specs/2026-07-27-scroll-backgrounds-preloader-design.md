# Scroll Background Transitions + Preloader — Design

**Date:** 2026-07-27
**Status:** Approved (design phase)

## Summary

Two related features for the portfolio:

1. **Per-section animated backgrounds with smooth scroll crossfade.** A single
   fixed full-page background controller renders 8 distinct animated motifs
   (one per section) and crossfades between them as the user scrolls, driven by
   motion.dev (framer-motion) `useScroll`/`useTransform`. Each section gets a
   visually distinct motif in the brand palette (indigo #6366f1 / violet
   #8b5cf6 / pink #ec4899), so it feels different per section without being
   monotonous. The Hero keeps the existing particle-network background.

2. **A page preloader.** On every load, a full-screen black overlay shows the
   name "Evan Rafif Pradana" (using the existing MatrixText component) with the
   `loader-2` triple-SVG animation (circle / triangle / rect, white stroke)
   beneath it, then fades out to reveal the site.

Animation polish is done with the ui-ux-pro-max skill during implementation.
No new npm dependency (motion.dev IS framer-motion, already installed at v12).

## Goals

- Hero background stays in the hero; scrolling into lower sections smoothly
  transitions to a different themed background per section.
- Transitions are smooth crossfades (no hard cuts), scroll-linked.
- Each section's motif is distinct but cohesive (shared brand palette).
- Content text stays readable over the animated backgrounds ("medium"
  intensity: motif visible/"wah" but a dark blur overlay keeps text crisp).
- A preloader plays on every load: name + loader-2 animation on black, then
  fade to content.
- Respect prefers-reduced-motion and keep performance smooth.

## Non-Goals

- No new section content or copy changes.
- No new npm dependencies.
- No change to the CV-content work already merged.
- Preloader is NOT session-gated — it plays on every load (user's choice).

## Section → Motif Map

Page section order (from app/page.tsx): Hero, About, Experience, Organization,
Projects, Skills, Education, Contact.

| # | Section | Motif | Behavior |
|---|---------|-------|----------|
| 1 | Hero | Particle network (existing ParticleBackground) | kept as-is; the hero background "stays" |
| 2 | About | Aurora ribbons | slow-rotating conic-gradient light ribbons, blurred |
| 3 | Experience | Flowing waves | diagonal moving gradient wave stripes |
| 4 | Organization | Constellation grid | pulsing two-tone dot grid |
| 5 | Projects | Spotlight sweep | large soft radial glow sweeping horizontally |
| 6 | Skills | Mesh gradient blobs | multiple soft radial blobs breathing/scaling |
| 7 | Education | Starfield depth | faint twinkling star dots over deep radial |
| 8 | Contact | Warm glow rising | pink radial glow rising from the bottom |

All motifs use only the brand palette + near-black bases. Approved by the user.

## Architecture

### Background system

**New: `components/backgrounds/SectionBackground.tsx`** — a `"use client"`
controller, `fixed inset-0 -z-10`, that:
- Uses motion.dev `useScroll()` on the document (whole-page scroll progress
  0→1).
- Renders all 8 motif layers absolutely stacked. Each motif's opacity is a
  `useTransform(scrollYProgress, [inRange], [0,1,1,0])` keyframed so that as
  scroll crosses that section's band, the motif fades in, holds, and fades out
  — overlapping its neighbors' bands so the transition is a **crossfade**, not
  a cut.
- Section bands are computed as even slices across the 8 sections (each ~1/8 of
  scroll progress) with a small overlap window for the crossfade. Because
  sections have different heights, v1 uses even progress slices for simplicity;
  if a section feels mistimed, the band can be tuned per-motif later. (Explicit
  simplification — documented, not silent.)

**New: `components/backgrounds/motifs/` — one file per motif:**
- `AuroraRibbons.tsx`, `FlowingWaves.tsx`, `ConstellationGrid.tsx`,
  `SpotlightSweep.tsx`, `MeshBlobs.tsx`, `Starfield.tsx`, `WarmGlow.tsx`.
- The existing `components/ParticleBackground.tsx` is reused as the Hero motif
  (motif #1). It is NOT deleted. It may be moved into
  `components/backgrounds/motifs/ParticleBackground.tsx` for co-location, or
  left in place and imported — the plan will pick one and keep imports
  consistent. Its current internal off-screen-pause and reduced-motion logic
  stays.
- Each motif is a zero-prop `"use client"` component, `React.memo`'d, absolutely
  positioned to fill its layer (`absolute inset-0`), animation via motion.dev or
  lightweight CSS transforms (GPU-friendly: transform/opacity only, no layout
  thrash).

**Readability overlay:** above the motif layers but below page content, a single
`absolute inset-0` overlay with `bg-background/40 backdrop-blur-sm` (tunable)
keeps text crisp at "medium" intensity. Lives inside SectionBackground.

**Wiring in `app/page.tsx` / `app/layout.tsx`:** `SectionBackground` replaces the
per-section `ParticleBackground` usage — it renders once at the page level
(behind everything). The current `<ParticleBackground />` call inside Hero is
removed (Hero's motif is now driven by the controller). Hero's own gradient-glow
and noise overlays (Hero.tsx ~77-95) stay.

**Section backgrounds go transparent:** sections currently set `bg-card`,
`bg-muted/30`, `bg-card/80`, `bg-background/80` (About, Experience, Organization,
Projects, Skills, Education, Contact). These opaque/semi-opaque backgrounds would
hide the motifs, so they are removed or set transparent. Readability is handled
by the global overlay instead of per-section fills. (The plan enumerates the
exact class per section.)

### Preloader

**New: `components/Preloader.tsx`** (`"use client"`):
- Full-screen `fixed inset-0 z-[100]` black (`bg-black`) overlay.
- Center column: the name "Evan Rafif Pradana" via the existing
  `components/ui/MatrixText` component (matching the hero's treatment), and
  below it the `loader-2` triple-SVG animation (circle, triangle, rect) with a
  **white stroke**.
- The loader CSS (`.loader`, `.triangle`, the `pathCircle/pathTriangle/pathRect`
  keyframes and stroke styling from tasks/loader-2-integration.md) is **scoped**
  to the preloader — NOT applied globally. Do NOT copy the file's global
  `body { background }` or `:root { --clr/--bkg }` rules (they would clash with
  the site theme). Stroke color is hard-white (`#fff`) via scoped CSS or inline
  style; the `count`/`setCount` unused state from the snippet is dropped.
- Timing: mount visible; hide when BOTH (a) the window `load` event has fired
  (or a safety timeout ~2.5s) AND (b) a minimum display time (~1.4s) has elapsed
  so the animation is seen. Then fade out via motion.dev `AnimatePresence` +
  `motion.div` exit (opacity → 0, ~0.6s), then unmount.
- Plays on EVERY load (no sessionStorage gate).
- While visible, lock scroll: set `document.body.style.overflow = "hidden"` on
  mount, restore on unmount.

**Wiring:** since `app/layout.tsx` is a server component, add a small client
wrapper (e.g. `components/PreloaderGate.tsx` or make the preloader self-contained
with `"use client"`) rendered at the top of `<body>` before Navbar/children. The
preloader overlays everything via its high z-index; it does not need to wrap
children.

## Performance & Accessibility

- **prefers-reduced-motion:** every motif renders a single static frame (no
  loops); the crossfade still works (opacity is scroll-linked, not
  time-animated, so it's acceptable) OR, to be safe, reduced-motion can snap
  motif opacity per section without the animated internal motion. Preloader
  under reduced motion: skip the fade/scramble, show a brief static frame then
  remove. ParticleBackground already honors reduced-motion.
- **Off-screen / cost:** motifs animate transform/opacity only. The particle
  motif keeps its existing rAF + off-screen pause. Non-hero motifs are cheap CSS
  transforms; all 8 are always mounted but only the visible 1-2 have non-zero
  opacity (browser still composites them — keep each motif's animation cheap;
  if profiling shows cost, gate internal animation on opacity>0 later).
- **DPR / paints:** favor gradients + transforms; avoid large blurred elements
  animating size every frame where a transform scale suffices.

## Verification

No unit-test runner (repo convention). Verify with:
- `npx tsc --noEmit` (clean).
- `npm run lint` (no new errors in touched files).
- `npm run dev` browser pass:
  - Preloader shows on load (name + white loader-2 shapes on black), then fades
    to the site; scroll is locked during preload and restored after.
  - Scrolling from Hero downward crossfades the background through all 8 motifs
    smoothly; Hero shows the particle network.
  - Text in every section remains readable over its motif.
  - Reduced-motion: motifs static, preloader brief/static.
  - No console errors; reload replays the preloader (every-load behavior).

## Files Touched

- New: `components/backgrounds/SectionBackground.tsx`
- New: `components/backgrounds/motifs/AuroraRibbons.tsx`, `FlowingWaves.tsx`,
  `ConstellationGrid.tsx`, `SpotlightSweep.tsx`, `MeshBlobs.tsx`,
  `Starfield.tsx`, `WarmGlow.tsx`
- New: `components/Preloader.tsx` (+ a client gate if needed for layout)
- Reuse: `components/ParticleBackground.tsx` (hero motif; kept)
- Edit: `app/layout.tsx` (mount preloader + SectionBackground), `app/page.tsx`
  or `components/Hero.tsx` (remove per-hero ParticleBackground call)
- Edit: `components/About.tsx`, `Experience.tsx`, `Organization.tsx`,
  `Projects.tsx`, `Skills.tsx`, `Education.tsx`, `Contact.tsx` (make section
  backgrounds transparent)
- Reference: `tasks/loader-2-integration.md` (loader SVG + keyframes, scoped)
