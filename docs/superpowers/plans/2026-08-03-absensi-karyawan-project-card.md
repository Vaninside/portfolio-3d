# Absensi Karyawan Project Card — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Absensi Karyawan project as card #3 in the Projects section, reusing the existing hover-screenshot + action-button infrastructure.

**Architecture:** Pure data change — insert one object literal into the `projects` array in `components/Projects.tsx` and update the existing tests to cover the new card. No type changes, no new components, no new dependencies. The screenshot asset already exists at `public/absensi.webp`.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Vitest + React Testing Library (already set up).

## Global Constraints

- **Only edit `components/Projects.tsx` and `components/Projects.test.tsx`** — no other files (spec: Out of Scope). The screenshot `public/absensi.webp` already exists; do not add or modify assets.
- **No new dependencies, no type changes.** The new entry must satisfy the existing `ProjectItem` shape; the array stays `as const`; do not mutate existing entries.
- **New order:** StockFlow, Portfolio 3D, **Absensi Karyawan**, RUKUN, PUSON. Insert the new entry between Portfolio 3D and RUKUN.
- **Exact new-entry field values (verbatim):**
  - `title`: `"Absensi Karyawan"`
  - `description`: `"Employee Attendance App — Face Recognition & GPS"`
  - `period`: `"August 2026 - Present"`
  - `tech`: `["React", "TypeScript", "Vite", "Tailwind CSS", "Leaflet"]`
  - `points`:
    1. `"Built a fully client-side attendance app with on-device face recognition (face-api) — no backend, all data in localStorage."`
    2. `"Integrated GPS geotagging with Leaflet maps and reverse-geocoding, plus lateness detection against each employee's start time."`
    3. `"Delivered a dashboard with daily stats, a 7-day Recharts trend, filterable history, CSV export, and WCAG-AA dark mode."`
  - `links`: `{ demo: "https://absensi-karyawan-five-liard.vercel.app/", github: "https://github.com/Vaninside/absensi-karyawan" }`
  - `color`: `"from-amber-500 via-orange-500 to-rose-500"`
  - `icon`: `"Zap"`
  - `image`: `"/absensi.webp"`
  - `demoAvailable`: omitted (defaults to `true`).
- **Em-dash `—`** appears in `description` and the first bullet — copy it exactly, not a hyphen.

---

## File Structure

- `components/Projects.tsx` — **modify.** Insert one `ProjectItem` object literal into the `projects` array between the Portfolio 3D entry (closes at line 65: `  },`) and the RUKUN entry (opens at line 66: `  {`).
- `components/Projects.test.tsx` — **modify.** Update the "all titles" test to five names and add Absensi-specific assertions (order, links, screenshot, demo button).

---

## Task 1: Add the Absensi Karyawan card (data + tests)

**Files:**
- Modify: `components/Projects.tsx` (insert entry after line 65, before line 66)
- Test: `components/Projects.test.tsx`

**Interfaces:**
- Consumes: the existing `ProjectItem` type, the `projects` array, and the test helper `cardFor(title: string): HTMLElement` (already defined at `components/Projects.test.tsx:5`).
- Produces: a fifth card rendered third in the grid. Nothing downstream depends on this task.

- [ ] **Step 1: Update the failing tests**

In `components/Projects.test.tsx`, replace the existing "renders all four project titles" test (lines 31-36) with a five-title version, and add four Absensi-specific tests. Paste this block in place of the old test (keep the surrounding tests intact):

```tsx
  it("renders all five project titles", () => {
    render(<Projects />);
    for (const name of [
      "StockFlow",
      "Portfolio 3D",
      "Absensi Karyawan",
      "RUKUN",
      "PUSON",
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders Absensi Karyawan as the third project card", () => {
    const { container } = render(<Projects />);
    const titles = Array.from(
      container.querySelectorAll('[data-slot="card-title"]'),
    ).map((el) => el.textContent);
    expect(titles[2]).toBe("Absensi Karyawan");
  });

  it("links Absensi Karyawan to its live demo and repo", () => {
    render(<Projects />);
    const card = cardFor("Absensi Karyawan");
    expect(
      within(card).getByRole("link", { name: /view demo/i }),
    ).toHaveAttribute("href", "https://absensi-karyawan-five-liard.vercel.app/");
    expect(
      within(card).getByRole("link", { name: /view (code|source)/i }),
    ).toHaveAttribute("href", "https://github.com/Vaninside/absensi-karyawan");
  });

  it("renders the Absensi Karyawan screenshot", () => {
    render(<Projects />);
    const card = cardFor("Absensi Karyawan");
    expect(
      within(card).getByRole("img", {
        name: /absensi karyawan dashboard screenshot/i,
      }),
    ).toHaveAttribute("src", "/absensi.webp");
  });
```

Note: `within` and `cardFor` are already imported/defined at the top of the test file — confirm `within` is in the `@testing-library/react` import (it is, from the Task-3/4 work). If `within` is somehow missing, add it to that import.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — "renders all five project titles" can't find "Absensi Karyawan"; the third-card, links, and screenshot tests fail because the card doesn't exist yet.

- [ ] **Step 3: Insert the new project entry**

In `components/Projects.tsx`, insert the following object literal immediately after the Portfolio 3D entry's closing `},` (line 65) and before the RUKUN entry's opening `{` (line 66). The result must read `…image: "/porto.webp",` then `},` then the new `{ title: "Absensi Karyawan", … },` then `{ title: "RUKUN", …`:

```tsx
  {
    title: "Absensi Karyawan",
    description: "Employee Attendance App — Face Recognition & GPS",
    period: "August 2026 - Present",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Leaflet"],
    points: [
      "Built a fully client-side attendance app with on-device face recognition (face-api) — no backend, all data in localStorage.",
      "Integrated GPS geotagging with Leaflet maps and reverse-geocoding, plus lateness detection against each employee's start time.",
      "Delivered a dashboard with daily stats, a 7-day Recharts trend, filterable history, CSV export, and WCAG-AA dark mode.",
    ],
    links: { demo: "https://absensi-karyawan-five-liard.vercel.app/", github: "https://github.com/Vaninside/absensi-karyawan" },
    color: "from-amber-500 via-orange-500 to-rose-500",
    icon: "Zap",
    image: "/absensi.webp",
  },
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests green, including the five-title, third-card, links, and screenshot assertions.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0. (The `Zap` icon is already in `iconMap`; the entry satisfies `ProjectItem`; `as const` is preserved.)

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: "Compiled successfully"; build exits 0. Confirms `/absensi.webp` resolves and the page compiles.

- [ ] **Step 7: Commit**

```bash
git add components/Projects.tsx components/Projects.test.tsx
git commit -m "feat(projects): add Absensi Karyawan project card"
```

---

## Task 2: Browser verification

**Files:**
- No source changes (verification only). If a check fails, fix in `components/Projects.tsx` and re-run Task 1's gates.

**Interfaces:**
- Consumes: the running dev server.
- Produces: confirmation the card renders correctly in a real browser.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (note the port — 3000 unless taken).

- [ ] **Step 2: Verify card order, content, and hover in the browser**

Open the Projects section and confirm:
- Cards appear in order: StockFlow, Portfolio 3D, **Absensi Karyawan**, RUKUN, PUSON.
- The Absensi card shows the amber→orange→rose gradient top border and the `Zap` icon.
- The tech chips read React / TypeScript / Vite / Tailwind CSS / Leaflet.
- Hovering the card reveals the `/absensi.webp` screenshot with the "View Demo" + "View Code" buttons still visible and clickable on top.
- "View Demo" points to `https://absensi-karyawan-five-liard.vercel.app/` and "View Code" to the repo.

- [ ] **Step 3: Confirm the image loads (not 404)**

In the browser devtools/network, confirm `/absensi.webp` returns 200 and the `<img>` has non-zero natural dimensions.

(No commit — verification only.)

---

## Self-Review

**Spec coverage:**
- New order / insert at #3 (spec §1) → Task 1 Step 3, plus the third-card test in Step 1.
- New entry content, all fields verbatim (spec §2) → Task 1 Step 3 (values) + Global Constraints (source of truth).
- Testing: order, five titles, links, screenshot, demo-available (spec Testing) → Task 1 Step 1 tests. "Demo available" is covered by the links test asserting a "View Demo" link exists in the Absensi card (offline cards would have no such link).
- Verification gates: `npm test`, `npx tsc --noEmit`, `npm run build`, browser check (spec Testing) → Task 1 Steps 4-6, Task 2.
- Out of scope (no other card/component/type changes) → Global Constraints restrict edits to two files.

**Placeholder scan:** No TBD/TODO. All test code and the entry literal are complete and concrete.

**Type consistency:** The new entry uses only existing `ProjectItem` fields (`image?`, `demoAvailable?` already optional; `Zap` already in `iconMap`). The test helper `cardFor` and `within` are already present in the test file from prior work. `data-slot="card-title"` selector matches the existing "first card" test's approach. Field values match the spec's Global Constraints exactly.
