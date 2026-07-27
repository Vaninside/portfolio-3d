# Particle Network Hero Background — Design

**Date:** 2026-07-27
**Status:** Approved (design phase)

## Summary

Replace the Three.js glass-shapes hero background with a 2D canvas
particle-network background adapted from the 21st.dev "Aether Flow" prompt.
All existing hero content (badge, animated `MatrixText` name, subtitle, CTA
buttons, scroll indicator) is preserved unchanged. Particles are multi-colored
using the brand palette and react to the mouse cursor.

The site is dark-mode only (the `dark` class is hardcoded in
`app/layout.tsx`), so no light-mode handling is required.

## Goals

- Swap the hero's animated background from Three.js floating glass shapes to an
  interactive 2D particle network.
- Keep all hero foreground content and existing gradient/noise overlays intact.
- Match the site's brand identity via multi-colored particles.
- Ship it performant and accessible (reduced-motion, off-screen pause, capped
  particle count).

## Non-Goals

- No changes to hero copy, layout, `MatrixText`, badge, CTAs, or scroll
  indicator.
- No light-mode support (site is dark-only).
- No removal of `three` / `@react-three/fiber` / `@react-three/drei` npm
  packages in this change (kept installed for possible future use; can be
  cleaned up separately).

## Architecture

### New component: `components/ParticleBackground.tsx`

A `"use client"` component rendering a full-bleed `<canvas>`. TypeScript,
cleaned up from the raw Aether Flow snippet.

Structure:
- `fixed inset-0 -z-10` wrapper (mirrors how `ThreeBackground` positioned
  itself) so it sits behind hero content.
- A single `<canvas>` filling the wrapper.
- All animation logic inside one `useEffect` with a proper cleanup return.

### Integration in `components/Hero.tsx`

- Replace the dynamic import:
  - Remove `const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), { ssr: false, loading: () => null })`.
  - Add `const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false, loading: () => null })`.
- Replace `<ThreeBackground />` in the JSX with `<ParticleBackground />`.
- Everything else in `Hero.tsx` stays byte-for-byte the same, including the
  radial-gradient glow overlay (lines ~77–84) and the noise-texture overlay
  (lines ~86–95).

`ssr: false` is required because the canvas logic uses `window`, `document`,
and canvas 2D APIs that are unavailable during server rendering.

### Cleanup

- Delete `components/three/ThreeBackground.tsx` (no longer imported anywhere).
  It is the only file in `components/three/`, so remove the now-empty directory
  as well.
- Leave the `three` family of packages in `package.json` untouched.

## Particle Behavior

### Colors (multi-color)

- Each particle is assigned one random color at creation from the brand palette:
  - Indigo `#6366f1`
  - Violet `#8b5cf6`
  - Pink `#ec4899`
- Connecting lines use a soft neutral violet (`rgba(160, 130, 220, opacity)`)
  so the colored dots stand out and the lines read as subtle connectors.
- Lines near the cursor brighten toward white
  (`rgba(255, 255, 255, opacity)`), matching the original Aether Flow effect.

### Motion & interaction

- Particles drift with small random velocities and bounce off canvas edges.
- Mouse repel: within a cursor radius (~200px), particles are pushed away from
  the pointer.
- `connect()` draws a line between two particles when they are within a
  distance threshold; line opacity fades with distance. This is an O(n²) pass —
  particle count must stay capped (see Performance).
- On `mouseout` (pointer leaves the window), cursor tracking resets so no
  lines/repel anchor to a stale position.

### Canvas is transparent

Critical difference from the source snippet: the original repaints a **solid
black** background every frame (`ctx.fillStyle = 'black'; ctx.fillRect(...)`).
This implementation instead clears with `ctx.clearRect(0, 0, w, h)` each frame
so the canvas is transparent. This lets the existing hero radial-gradient glow
(indigo/pink) and the page background show through, rather than stamping an
opaque black rectangle over them.

## Performance & Accessibility

- **`prefers-reduced-motion`**: when set, render a single static frame (draw
  particles + connections once, no `requestAnimationFrame` loop, no mouse
  listeners driving motion). Uses `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- **Off-screen pause**: an `IntersectionObserver` on the canvas wrapper stops
  the animation loop when the hero is not visible and resumes it when it scrolls
  back into view, saving CPU on the rest of the page.
- **Particle cap**: number of particles derived from viewport area but hard-capped
  at ~150 to bound the O(n²) `connect()` cost.
- **DPR clamp**: render at devicePixelRatio clamped to 1 (canvas sized to CSS
  pixels) to avoid a 4× fragment cost on retina/large displays. Revisit if the
  result looks too soft.
- **Resize handling**: on `window.resize`, resize the canvas and re-init the
  particle field.
- **Cleanup**: the `useEffect` return must `cancelAnimationFrame`, disconnect the
  `IntersectionObserver`, and remove all `resize` / `mousemove` / `mouseout`
  listeners.

## Data Flow

No props, no external state, no context. The component is fully self-contained:
it reads viewport size and pointer position from the browser, owns its particle
array in the effect's closure, and renders to its own canvas. It communicates
with the rest of the app only by existing in the DOM behind the hero.

## Error Handling / Edge Cases

- Guard on `canvas` and `ctx` being non-null before use (bail early if either is
  missing).
- Reset `mouse.x/y` to `null` on `mouseout` and skip repel/brighten math when
  null.
- Guard the reduced-motion path so no animation frame is ever scheduled.
- Zero-size viewport (e.g. during initial layout): re-init runs on the first
  resize call, which is invoked immediately after mount.

## Testing / Verification

Manual visual verification (consistent with the prior i18n work in this repo):
- `npx tsc --noEmit` passes.
- `npm run dev` → hero shows a multi-colored particle network on the dark
  background; existing name/subtitle/badge/CTAs render on top and remain
  interactive.
- Moving the mouse repels nearby particles and brightens nearby lines.
- Scrolling away and back confirms the animation pauses/resumes (spot-check via
  CPU or a `console` breadcrumb during dev, removed before finishing).
- Toggling OS "reduce motion" yields a static particle frame with no animation.
- `grep` confirms no remaining import of `ThreeBackground`.

## Files Touched

- **New:** `components/ParticleBackground.tsx`
- **Edit:** `components/Hero.tsx` (swap the dynamic background import + JSX tag)
- **Delete:** `components/three/ThreeBackground.tsx` (and the empty
  `components/three/` directory)
