# StockFlow Project + Hover Preview + Demo-Offline Marker

**Date:** 2026-08-02
**Scope:** Single component — `components/Projects.tsx` (plus 4 existing images in `public/`)
**Status:** Approved design, ready for implementation plan

## Goal

Add the **StockFlow** project to the portfolio's Projects section as the flagship (first) card, reorder the existing cards, add a hover-triggered dashboard screenshot preview to every card, and mark RUKUN & PUSON as having no live demo (database offline) while keeping their source-code links.

## Context

Projects are defined as a `const projects` array in [components/Projects.tsx](../../../components/Projects.tsx#L32). Each entry is rendered by the inner `ProjectCard` component. Current fields:

```ts
type ProjectItem = {
  title: string;
  description: string;
  period: string;
  tech: readonly string[];
  points: readonly string[];
  links: { demo: string; github: string };
  color: string;
  icon: keyof typeof iconMap;
};
```

The card currently renders: gradient top border → header (period, icon+title, description) → bullet list → tech chips → two action buttons (View Demo / View Code). No card currently has an image.

Screenshot assets already exist at the root of `public/`:

| Card         | File                      | Public path          |
| ------------ | ------------------------- | -------------------- |
| StockFlow    | `public/stock-flow.webp`  | `/stock-flow.webp`   |
| Portfolio 3D | `public/porto.webp`       | `/porto.webp`        |
| RUKUN        | `public/rukun.webp`       | `/rukun.webp`        |
| PUSON        | `public/puson.webp`       | `/puson.webp`        |

## Requirements

### 1. Card order & content

New order of the `projects` array:

1. **StockFlow** (new)
2. **Portfolio 3D** (existing — update `period`)
3. **RUKUN** (existing — mark demo offline)
4. **PUSON** (existing — mark demo offline)

**StockFlow** entry:

- `title`: `"StockFlow"`
- `description`: `"Multi-Location Inventory Management — Fullstack Portfolio Project"`
- `period`: `"July 2026 - Present"`
- `tech`: `["Next.js", "NestJS", "PostgreSQL", "Prisma", "TypeScript"]`
- `points`:
  1. `"Built a fullstack monorepo with a NestJS REST API and Next.js 15 frontend, sharing types across the workspace."`
  2. `"Implemented JWT auth with refresh tokens and role-based access (Admin/Staff) enforced server-side."`
  3. `"Designed atomic cross-location stock transfers with an append-only, immutable audit trail."`
- `links`: `{ demo: "https://stock-flow-web-iota.vercel.app/", github: "https://github.com/Vaninside/Stock-flow" }`
- `color`: a distinct gradient (e.g. `"from-indigo-500 via-blue-500 to-cyan-500"`) — must remain visually distinct from Portfolio 3D's `from-violet-500 via-purple-500 to-pink-500`.
- `icon`: `"Globe"` (distinct from Portfolio 3D's `"Layers"`)
- `image`: `"/stock-flow.webp"`
- `demoAvailable`: omitted (defaults to `true`)

**Portfolio 3D** changes:

- `period`: `"July 2025 - Present"` → `"July 2026 - Present"`
- add `image: "/porto.webp"`

**RUKUN** changes:

- add `image: "/rukun.webp"`
- add `demoAvailable: false`

**PUSON** changes:

- add `image: "/puson.webp"`
- add `demoAvailable: false`

### 2. Type changes

Extend `ProjectItem` with two optional fields:

```ts
type ProjectItem = {
  // ...existing fields...
  image?: string;          // public path to dashboard screenshot; enables hover preview
  demoAvailable?: boolean; // default true; false → hide demo button, show offline note
};
```

Optional fields keep every existing card valid and let future cards opt in without a signature change (YAGNI-friendly).

### 3. Hover preview (Variant C — zoom + view hint)

When a card has `image`:

- Render the screenshot as an absolutely-positioned overlay covering the card (`inset-0`, `object-cover`, `rounded` to match card).
- **Desktop hover:** overlay transitions from `opacity: 0; scale: 1.12` → `opacity: 1; scale: 1` (fade + zoom-in). A centered hint pill "↗ View live demo" fades in on top.
  - For cards with `demoAvailable === false`, the hint pill reads "↗ View screenshot" (or similar) instead of "View live demo", since there is no live demo. Final copy decided during implementation.
- **Reduced motion:** respect `prefers-reduced-motion` — no zoom/scale animation; use a plain opacity fade (or instant show). Follow the existing reduced-motion approach already used elsewhere in the app.
- **Mobile / no-hover fallback:** on touch/no-hover devices the overlay must not trap the card in a permanent hidden state. Show the screenshot as a static banner at the top of the card (partial height) so the image is still visible without hover. Detection via CSS `@media (hover: hover)` / `(pointer: fine)` rather than JS user-agent sniffing.
- Use `next/image` for the screenshot (lazy load, responsive sizing, format optimization). Provide meaningful `alt` text (e.g. `` `${project.title} dashboard screenshot` ``).
- Cards without `image` render exactly as they do today (no overlay, no behavior change).

The hover preview is independent of `demoAvailable` — RUKUN & PUSON still get the screenshot popup even though their live demo is gone.

### 4. Demo-offline marker (Variant C — info note)

When `demoAvailable === false`:

- **Remove** the "View Demo" button.
- In its place render an info note line: `ℹ️ Live demo tidak tersedia — database sudah offline.` styled as a subtle amber/warning note (border + tint), consistent with the card's existing muted styling.
- Keep the GitHub button; its label becomes "View Source Code" (full-width or paired with the note, whichever reads cleanest in the existing flex layout).

When `demoAvailable !== false` (default), the action row is unchanged: "View Demo" + "View Code" side by side.

## Architecture / Approach

All changes are contained in [components/Projects.tsx](../../../components/Projects.tsx). No new files, no new dependencies (`next/image`, `framer-motion`, `lucide-react` are already used).

Implementation shape:

- Extend the `ProjectItem` type (two optional fields).
- Update the `projects` array (add StockFlow, reorder, set `image`/`demoAvailable`/period edits).
- In `ProjectCard`:
  - Add the image overlay layer (rendered only when `project.image` is truthy), driven by CSS/Framer hover state + `@media (hover)` fallback + reduced-motion guard.
  - Make the action row conditional on `project.demoAvailable`.

Keep the component under control: the file is already ~260 lines. Extracting the overlay and the action row into small local sub-components (or well-named render helpers) is encouraged to avoid bloating `ProjectCard` and to keep each piece independently readable, per the project's file-organization rules.

## Error / Edge Handling

- **Missing image:** if `image` is undefined, no overlay renders — safe default.
- **Broken image path:** `next/image` will fail to load; acceptable since paths are static and verified to exist. No runtime fallback UI required.
- **Both flags on a card:** `image` present + `demoAvailable: false` (RUKUN/PUSON) is the intended combination — screenshot shows, demo button hidden.
- **Reduced motion:** zoom disabled; opacity fade or instant reveal only.
- **Touch devices:** static banner fallback — screenshot never permanently hidden behind an unreachable hover.

## Testing

Per project testing rules, verify:

- **Rendering:** all four cards render with correct title/period/tech/links; StockFlow is first.
- **Conditional demo button:** cards with `demoAvailable === false` (RUKUN, PUSON) do NOT render a demo button and DO render the offline note + GitHub button; default cards render both buttons.
- **Image overlay presence:** cards with `image` render the `next/image` overlay with correct `src` and non-empty `alt`; cards without `image` render no overlay.
- **Accessibility:** hint pill / overlay is `aria-hidden` where decorative; screenshot `alt` is descriptive; offline note is readable text (not conveyed by color alone).
- Manual check: desktop hover zoom, reduced-motion fallback, and mobile static-banner fallback.

## Out of Scope

- No changes to any other section/component.
- No new routing, data fetching, or backend work.
- No redesign of the Projects section layout/grid beyond the card-level changes above.
- No unrelated refactors.

## Open Items (resolved during implementation, not blocking)

- Exact hint-pill copy for offline cards ("View live demo" vs "View screenshot").
- Exact StockFlow gradient value and whether GitHub button goes full-width vs paired when the demo button is removed.
