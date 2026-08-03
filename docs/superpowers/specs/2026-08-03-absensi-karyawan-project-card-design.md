# Absensi Karyawan Project Card

**Date:** 2026-08-03
**Scope:** Single component — `components/Projects.tsx` data array (+ existing `public/absensi.webp`)
**Status:** Approved design, ready for implementation plan

## Goal

Add the **Absensi Karyawan** project to the portfolio's Projects section as card #3, using the existing card infrastructure (hover screenshot preview, action buttons over image). No new UI mechanics — this is a data-only addition.

## Context

The Projects section already supports everything this card needs. `ProjectItem` in [components/Projects.tsx](../../../components/Projects.tsx#L21) has these fields:

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
  image?: string;
  demoAvailable?: boolean;
};
```

`iconMap` currently exposes `Globe`, `Shield`, `Layers`, `Zap`. The hover screenshot overlay (`ProjectScreenshot`) and the demo-offline note (`ProjectActions`) are already implemented and render off the `image` / `demoAvailable` fields. The screenshot asset already exists at `public/absensi.webp` → served at `/absensi.webp`.

Current order: StockFlow, Portfolio 3D, RUKUN, PUSON.

## Requirements

### 1. New order

Insert Absensi Karyawan at position #3:

1. StockFlow
2. Portfolio 3D
3. **Absensi Karyawan** (new)
4. RUKUN
5. PUSON

### 2. New entry content

Insert this object into the `projects` array between the Portfolio 3D entry and the RUKUN entry:

- `title`: `"Absensi Karyawan"`
- `description`: `"Employee Attendance App — Face Recognition & GPS"`
- `period`: `"August 2026 - Present"`
- `tech`: `["React", "TypeScript", "Vite", "Tailwind CSS", "Leaflet"]`
- `points`:
  1. `"Built a fully client-side attendance app with on-device face recognition (face-api) — no backend, all data in localStorage."`
  2. `"Integrated GPS geotagging with Leaflet maps and reverse-geocoding, plus lateness detection against each employee's start time."`
  3. `"Delivered a dashboard with daily stats, a 7-day Recharts trend, filterable history, CSV export, and WCAG-AA dark mode."`
- `links`: `{ demo: "https://absensi-karyawan-five-liard.vercel.app/", github: "https://github.com/Vaninside/absensi-karyawan" }`
- `color`: `"from-amber-500 via-orange-500 to-rose-500"` — a warm gradient, distinct from the four existing cards (indigo/blue, violet/purple, blue/cyan, emerald/teal).
- `icon`: `"Zap"` — the only `iconMap` entry not yet used by another card.
- `image`: `"/absensi.webp"`
- `demoAvailable`: omitted (defaults to `true` — the live demo works).

No other card changes.

## Architecture / Approach

Pure data change: insert one object literal into the `projects` array in [components/Projects.tsx](../../../components/Projects.tsx). No type changes, no new components, no new dependencies, no new files (the image already exists in `public/`). The array is `as const`; the new entry must satisfy the existing `ProjectItem` shape.

## Error / Edge Handling

- **Image:** `/absensi.webp` is confirmed present in `public/`; the hover overlay renders it via the existing `ProjectScreenshot` (which already handles reduced-motion, touch fallback, and buttons-over-image).
- **Demo available:** `demoAvailable` defaults true, so the card renders the standard "View Demo" + "View Code" action row — no offline note.
- **Color/icon uniqueness:** the amber→rose gradient and `Zap` icon are chosen to stay visually distinct from the existing four cards.

## Testing

Extend the existing `components/Projects.test.tsx` suite:

- **Order:** the third card's title is "Absensi Karyawan" (StockFlow first, Absensi third).
- **Count/titles:** all five project titles render.
- **Links:** the Absensi card links to `https://absensi-karyawan-five-liard.vercel.app/` (demo) and `https://github.com/Vaninside/absensi-karyawan` (code), scoped to its own card via the existing `cardFor` helper.
- **Screenshot:** the Absensi card renders an `<img>` with `src="/absensi.webp"` and a descriptive `alt`.
- **Demo available:** the Absensi card renders a "View Demo" link (not the offline note).

Verify with the existing gates: `npm test` (all pass), `npx tsc --noEmit` (clean), `npm run build` (succeeds), and a browser check that the card appears third with a working hover preview.

## Out of Scope

- No changes to any other card or component.
- No changes to `ProjectItem`, `ProjectScreenshot`, `ProjectActions`, or the section layout.
- No new dependencies or assets (the screenshot already exists).
