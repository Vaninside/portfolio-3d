# Certifications Marquee — Design Spec

**Date:** 2026-07-28
**Status:** Approved (pending written-spec review)

## Goal

Replace the static Certifications grid in the Education section with an infinite
auto-scrolling marquee, adapting the pattern from the 21st.dev
`image-auto-slider` component. One row of the existing 9 certification cards
scrolls left, loops seamlessly, pauses on hover, and fades at the edges. Under
`prefers-reduced-motion: reduce` it falls back to the current static grid.

## Source Reference & Adaptation

The prompt supplied a 21st.dev `image-auto-slider.tsx` (Unsplash photos,
full-screen black, a global `<style>` resetting `html, body`). Only its
**technique** is reused — not its markup:
- Reused: duplicate the items (`[...items, ...items]`), animate `translateX(0 →
  -50%)` `linear infinite` for a seamless loop, an edge `mask` linear-gradient,
  hover scale on items.
- Dropped: the Unsplash images (we scroll text cards, no new assets), the
  `min-h-screen bg-black` full-viewport shell, and the global `html, body`
  style (it would break the site theme). All styles are scoped.

Project already satisfies the prompt's prerequisites: shadcn structure, Tailwind
v4, TypeScript, and `components/ui/` all exist (MatrixText, Typewriter, badge,
button, card). No shadcn CLI setup, no folder creation needed.

## Non-Goals

- No new npm dependency. No image assets (cards are text — name/issuer/year/icon).
- Do not touch the Education degree card, thesis, honors, subjects, or the
  section header. Only the Certifications sub-block changes.
- Not a generic carousel with arrows/dots/pagination. YAGNI — it's a marquee.
- The original component's Unsplash photos / full-screen black / global body
  reset are explicitly NOT copied.

## Architecture

One new reusable unit + one edit. The marquee knows nothing about
certifications — it scrolls whatever children it's given (reusable later for
skills/tools). Mirrors the codebase's self-contained `components/ui/*` pattern.

### Unit 1 — `components/ui/marquee.tsx` (reusable marquee)

A thin `"use client"` wrapper that infinite-scrolls its children.

- **Signature:**
  ```tsx
  export interface MarqueeProps {
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
  export function Marquee(props: MarqueeProps): React.JSX.Element;
  ```
- **Behavior:** renders the children track TWICE inside a `flex w-max` row (the
  second copy is `aria-hidden="true"`), animates the track
  `translateX(0 → -50%)` via a scoped `<style jsx>` `@keyframes`, `linear`,
  `infinite`, duration `speedSeconds`. Because the track is exactly two
  identical halves, `-50%` lands on a seam that matches the start → seamless.
- **Edge fade:** the track container uses
  `mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)`
  (+ `-webkit-mask`), so cards fade in/out at both edges over the section
  background (transparent, not black).
- **Hover:** when `pauseOnHover`, hovering the region sets
  `animation-play-state: paused` (via a hover class/style on the track).
- **Reduced motion:** a `@media (prefers-reduced-motion: reduce)` rule sets
  `animation: none` as a second safety layer. (Primary reduced-motion handling
  is in the consumer — see Education below — which swaps to a static grid.)
- **A11y:** outer element `role="region"` + `aria-label={ariaLabel}`; the
  duplicated track copy is `aria-hidden="true"` so assistive tech reads the set
  once.
- Uses `cn` from `@/lib/utils`. No new dependency.

### Edit — `components/Education.tsx` (Certifications sub-block only)

Currently the Certifications block (around lines 238–262) renders the 9 cards in
`grid sm:grid-cols-2 lg:grid-cols-4 gap-4`. Change:

- Extract the single certification card's markup into a small local
  presentational piece (e.g. a `CertCard` function or an inline `.map` used in
  both branches) so the marquee and the static fallback render identical cards.
  Card markup stays visually identical to today (icon box, name, issuer, year),
  wrapped at a fixed width (`w-72 shrink-0`) so the row is even.
- Render logic:
  - `reducedMotion` **true** → the existing static grid
    (`grid sm:grid-cols-2 lg:grid-cols-4 gap-4`) of the 9 cards. Fully readable,
    no motion.
  - `reducedMotion` **false** → `<Marquee speedSeconds={30} pauseOnHover ariaLabel="Certifications">`
    containing the 9 cards.
- The "Certifications" heading + "Continuous learning…" subtext (lines 233–236)
  stay unchanged. `useReducedMotion()` is already imported and used in this file.
- Keep the cards non-interactive (as today — they are not links/buttons).

## Data

`CERTIFICATIONS` (the 9 existing entries: name / issuer / year / icon) is used
as-is. No additions, no assets. In the marquee branch the 9 cards are duplicated
(18 DOM nodes) for the loop; the duplicate half is `aria-hidden`.

## Visual / Palette

- Dark-mode only. Cards keep `bg-card` / `border-border` / `text-primary` and
  the existing hover treatment (`whileHover={{ y: -2 }}` + group hover recolor).
- Edge mask is transparent→opaque→transparent so it blends with the section
  background (no hard black bars).
- Brand palette only; no colors outside the existing tokens.

## Timing / Interaction

| Property | Value |
| --- | --- |
| Direction | leftward (`translateX 0 → -50%`) |
| Duration | 30s |
| Timing | linear, infinite |
| Pause on hover | yes (`animation-play-state: paused`) |
| Per-card hover | unchanged (`y: -2` / group recolor) |

## Scope / Files

- Create: `components/ui/marquee.tsx`
- Modify: `components/Education.tsx` (Certifications sub-block: marquee + static
  fallback; extract shared card markup)
- No new dependencies, no assets.

## Verification

- `npx tsc --noEmit` clean; `npm run lint` no new errors in touched files
  (Education.tsx has PRE-EXISTING `react/no-unescaped-entities` warnings that are
  out of scope — do not add new ones).
- Browser (Chrome DevTools MCP): the row scrolls left; the loop is seamless (no
  visible jump at the wrap point — verify by sampling the track transform over
  time); hovering pauses it; all 9 certifications are present and readable; edges
  fade; no console errors.
- Emulate `prefers-reduced-motion: reduce` and reload: the Certifications block
  is the static grid of 9 cards, no motion.
