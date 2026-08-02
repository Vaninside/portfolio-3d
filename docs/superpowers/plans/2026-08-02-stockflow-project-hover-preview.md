# StockFlow Project + Hover Preview + Demo-Offline Marker — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add StockFlow as the flagship project card, reorder the project list, give every card a hover-triggered dashboard screenshot preview, and mark RUKUN & PUSON as demo-offline while keeping their source links.

**Architecture:** All UI changes live in the single presentational component `components/Projects.tsx`. The `ProjectItem` type gains two optional fields (`image`, `demoAvailable`); the `projects` data array is edited; `ProjectCard` gains a conditional screenshot overlay (via `next/image`) and a conditional action row. Screenshot assets already exist at the root of `public/`.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, framer-motion 12, lucide-react, Tailwind CSS v4. Tests added with Vitest + React Testing Library + jsdom (new to this repo).

## Global Constraints

- **All source edits are confined to `components/Projects.tsx`** — no other component/section changes (spec: Out of Scope).
- **No new runtime dependencies** — `next/image`, `framer-motion`, `lucide-react` are already installed. New deps are dev-only (test harness).
- **Immutability:** never mutate the `projects` array or its entries; the array is `as const`.
- **Screenshot public paths (exact):** StockFlow `/stock-flow.webp`, Portfolio 3D `/porto.webp`, RUKUN `/rukun.webp`, PUSON `/puson.webp`.
- **`demoAvailable` semantics:** default (omitted or `true`) → demo button shown; `false` → demo button removed, offline note shown, GitHub button remains.
- **`image` semantics:** truthy → screenshot overlay enabled; omitted → card renders exactly as today.
- **Accessibility:** decorative overlay/hint is `aria-hidden`; screenshot `alt` is descriptive; offline state is conveyed by text, not color alone.
- **Reduced motion:** honor `prefers-reduced-motion` — no zoom/scale, opacity-only reveal.
- **This repo had NO prior test infrastructure.** Task 1 introduces it. If the user prefers to skip automated tests, Tasks 2–4 can be verified by `npx tsc --noEmit` + `npm run build` + manual browser check; the assertions still document intended behavior.
- **StockFlow gradient:** `"from-indigo-500 via-blue-500 to-cyan-500"` (distinct from Portfolio 3D's `from-violet-500 via-purple-500 to-pink-500`).
- **Offline hint-pill copy:** `"↗ View screenshot"`. **Live-demo hint-pill copy:** `"↗ View live demo"`. **Offline note copy:** `"Live demo tidak tersedia — database sudah offline."`

---

## File Structure

- `components/Projects.tsx` — **modify.** Type extension, data edits, and two new pieces of conditional rendering inside `ProjectCard`. To keep the file focused (already ~260 lines), extract two small local presentational sub-components inside this file: `ProjectScreenshot` (the hover overlay) and `ProjectActions` (the action row). They stay in the same file because they are only used by `ProjectCard` and change together.
- `vitest.config.ts` — **create.** Vitest config with jsdom environment and the React plugin.
- `test/setup.ts` — **create.** Global test setup: jest-dom matchers + mocks for `next/image`, `IntersectionObserver`, and `matchMedia`.
- `components/Projects.test.tsx` — **create.** Rendering + conditional-behavior tests.
- `package.json` — **modify.** Add dev dependencies and `test` script.

---

## Task 1: Test harness setup (Vitest + React Testing Library)

**Files:**
- Modify: `package.json` (scripts + devDependencies)
- Create: `vitest.config.ts`
- Create: `test/setup.ts`
- Create: `components/Projects.test.tsx` (smoke test only in this task)

**Interfaces:**
- Consumes: nothing.
- Produces: a working `npm test` command; a `test/setup.ts` that mocks `next/image` → plain `<img>`, stubs `IntersectionObserver`, and stubs `window.matchMedia`. Later tasks add cases to `components/Projects.test.tsx`.

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm install -D vitest@^2 @vitejs/plugin-react@^4 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 2: Add the test script to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    css: false,
  },
});
```

- [ ] **Step 4: Create `test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// next/image → plain <img> so jsdom can render it
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, fill, priority, ...rest } = props as {
      src: string;
      alt: string;
      fill?: boolean;
      priority?: boolean;
      [k: string]: unknown;
    };
    return React.createElement("img", { src, alt, ...rest });
  },
}));

// framer-motion useInView relies on IntersectionObserver
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IO);

// matchMedia used for prefers-reduced-motion / hover detection
vi.stubGlobal(
  "matchMedia",
  (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
);
```

- [ ] **Step 5: Create a smoke test in `components/Projects.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Projects from "@/components/Projects";

describe("Projects", () => {
  it("renders the section heading", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { name: /my project/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify the harness works**

Run: `npm test`
Expected: PASS (1 test). If jsdom/module errors appear, resolve config before proceeding.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts test/setup.ts components/Projects.test.tsx
git commit -m "test: add vitest + react testing library harness"
```

---

## Task 2: Extend type + update project data (add StockFlow, reorder, images, flags)

**Files:**
- Modify: `components/Projects.tsx:21-75` (the `ProjectItem` type and the `projects` array)
- Test: `components/Projects.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the extended `ProjectItem` type with `image?: string` and `demoAvailable?: boolean`; a reordered `projects` array whose first entry is StockFlow. Tasks 3 and 4 read `project.demoAvailable` and `project.image`.

- [ ] **Step 1: Write the failing tests**

Add to `components/Projects.test.tsx`:
```tsx
it("renders StockFlow as the first project card", () => {
  render(<Projects />);
  const titles = screen
    .getAllByRole("heading", { level: 3 })
    .map((h) => h.textContent);
  expect(titles[0]).toBe("StockFlow");
});

it("renders all four project titles", () => {
  render(<Projects />);
  for (const name of ["StockFlow", "Portfolio 3D", "RUKUN", "PUSON"]) {
    expect(screen.getByText(name)).toBeInTheDocument();
  }
});

it("links StockFlow to its live demo and repo", () => {
  render(<Projects />);
  expect(
    screen.getByRole("link", { name: /view demo/i }),
  ).toHaveAttribute("href", "https://stock-flow-web-iota.vercel.app/");
  expect(
    screen.getAllByRole("link", { name: /view (code|source)/i })[0],
  ).toHaveAttribute("href", "https://github.com/Vaninside/Stock-flow");
});
```

Note: `CardTitle` renders as an `<h3>`-level heading in this codebase. If the query for level 3 returns nothing, inspect the rendered output and adjust the selector to match the actual element `CardTitle` produces (it is the element wrapping `{project.title}` at `components/Projects.tsx:170`).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — first title is currently "RUKUN", and the StockFlow demo link does not exist yet.

- [ ] **Step 3: Extend the `ProjectItem` type**

In `components/Projects.tsx`, update the type (currently lines 21-30) to add two optional fields:
```tsx
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

- [ ] **Step 4: Replace the `projects` array**

Replace the entire `const projects = [ ... ] as const;` block (currently lines 32-75) with:
```tsx
const projects = [
  {
    title: "StockFlow",
    description: "Multi-Location Inventory Management — Fullstack Portfolio Project",
    period: "July 2026 - Present",
    tech: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "TypeScript"],
    points: [
      "Built a fullstack monorepo with a NestJS REST API and Next.js 15 frontend, sharing types across the workspace.",
      "Implemented JWT auth with refresh tokens and role-based access (Admin/Staff) enforced server-side.",
      "Designed atomic cross-location stock transfers with an append-only, immutable audit trail.",
    ],
    links: { demo: "https://stock-flow-web-iota.vercel.app/", github: "https://github.com/Vaninside/Stock-flow" },
    color: "from-indigo-500 via-blue-500 to-cyan-500",
    icon: "Globe",
    image: "/stock-flow.webp",
  },
  {
    title: "Portfolio 3D",
    description: "Personal Portfolio — Next.js & Framer Motion",
    period: "July 2026 - Present",
    tech: ["Next.js", "React", "TypeScript", "Framer Motion", "Tailwind CSS"],
    points: [
      "Built an interactive particle-network canvas hero background reactive to the cursor.",
      "Implemented scroll-triggered animations with spring physics and reduced-motion support.",
      "Optimized with dynamic imports and off-screen pausing for smooth performance.",
    ],
    links: { demo: "#", github: "https://github.com/vaninside/portfolio-3d" },
    color: "from-violet-500 via-purple-500 to-pink-500",
    icon: "Layers",
    image: "/porto.webp",
  },
  {
    title: "RUKUN",
    description: "Internship Project at PT Cazh Teknologi Inovasi",
    period: "May 2025 - July 2025",
    tech: ["Vue.js", "Nuxt.js", "REST API", "Pinia", "Middleware"],
    points: [
      "Architected and developed client-side using Vue.js and Nuxt.js with modular components for scalability.",
      "Integrated complex RESTful APIs to render dynamic data for admin dashboard and user profile management.",
      "Configured state management and route middleware for secure multi-level authentication flows.",
    ],
    links: { demo: "#", github: "https://github.com/rukun-dev/Rukun" },
    color: "from-blue-500 via-cyan-500 to-blue-600",
    icon: "Globe",
    image: "/rukun.webp",
    demoAvailable: false,
  },
  {
    title: "PUSON",
    description: "Posyandu untuk Stunting Online — Academic Project",
    period: "March 2025 - Sep 2025",
    tech: ["QA Testing", "UI/UX Design", "System Testing", "Bug Tracking", "Jira"],
    points: [
      "Developed and executed comprehensive test plans and test cases to identify software defects.",
      "Conducted rigorous UI/UX and system testing for a seamless stunting monitoring application.",
      "Documented system anomalies and collaborated with the development team to resolve critical bugs.",
    ],
    links: { demo: "#", github: "https://github.com/rvnkrwn-dev/PUSON" },
    color: "from-emerald-500 via-teal-500 to-emerald-600",
    icon: "Shield",
    image: "/puson.webp",
    demoAvailable: false,
  },
] as const;
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — StockFlow first, four titles present, demo/repo links correct.

Note: the "View Demo" link test passes here because StockFlow (first card, `demoAvailable` defaulted) still renders a demo button. The conditional-removal for RUKUN/PUSON is Task 3.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (The new optional fields are compatible with `as const`.)

- [ ] **Step 7: Commit**

```bash
git add components/Projects.tsx components/Projects.test.tsx
git commit -m "feat(projects): add StockFlow card, reorder list, wire screenshots + flags"
```

---

## Task 3: Conditional action row — demo-offline note

**Files:**
- Modify: `components/Projects.tsx` (extract `ProjectActions`, use it in `ProjectCard` at the action-row block currently lines 200-209)
- Test: `components/Projects.test.tsx`

**Interfaces:**
- Consumes: `ProjectItem` (`links`, `demoAvailable`) from Task 2.
- Produces: a local `ProjectActions` component: `function ProjectActions({ project }: { project: ProjectItem }): JSX.Element`. Renders demo + code buttons when `demoAvailable !== false`; renders offline note + code button when `demoAvailable === false`.

- [ ] **Step 1: Write the failing tests**

Add to `components/Projects.test.tsx`:
```tsx
import { within } from "@testing-library/react";

function cardFor(title: string): HTMLElement {
  const heading = screen.getByText(title);
  const card = heading.closest("[data-project-card]");
  if (!(card instanceof HTMLElement)) {
    throw new Error(`card wrapper not found for ${title}`);
  }
  return card;
}

it("hides the demo button and shows an offline note for RUKUN", () => {
  render(<Projects />);
  const card = cardFor("RUKUN");
  expect(within(card).queryByRole("link", { name: /view demo/i })).toBeNull();
  expect(within(card).getByText(/database sudah offline/i)).toBeInTheDocument();
  expect(
    within(card).getByRole("link", { name: /view source|view code/i }),
  ).toHaveAttribute("href", "https://github.com/rukun-dev/Rukun");
});

it("shows the demo button for StockFlow (demo available)", () => {
  render(<Projects />);
  const card = cardFor("StockFlow");
  expect(
    within(card).getByRole("link", { name: /view demo/i }),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — there is no `data-project-card` attribute yet, and RUKUN still renders a demo button.

- [ ] **Step 3: Add the `data-project-card` hook to the card wrapper**

In `ProjectCard`, add `data-project-card` to the outermost `motion.div` (currently starts line 134):
```tsx
<motion.div
  ref={ref}
  data-project-card
  variants={cardVariants}
  // ...rest unchanged
```

- [ ] **Step 4: Create the `ProjectActions` sub-component**

Add this component in `components/Projects.tsx` (place it above `ProjectCard` or above the default export, alongside other helpers):
```tsx
function ProjectActions({ project }: { project: ProjectItem }) {
  const demoAvailable = project.demoAvailable !== false;

  return (
    <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
      {!demoAvailable && (
        <p className="flex items-center gap-2 text-xs text-amber-500/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <span aria-hidden="true">ℹ️</span>
          Live demo tidak tersedia — database sudah offline.
        </p>
      )}
      <div className="flex items-center gap-3">
        {demoAvailable && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
          >
            <ExternalLink className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            View Demo
          </a>
        )}
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold border border-border hover:bg-accent/10 hover:border-primary/30 transition-all duration-300 group"
        >
          <GitBranch className="size-4" aria-hidden="true" />
          {demoAvailable ? "View Code" : "View Source Code"}
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Replace the inline action row in `ProjectCard`**

Replace the existing action-row `motion.div` (currently lines 200-209) with:
```tsx
<motion.div variants={contentVariants}>
  <ProjectActions project={project} />
</motion.div>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — RUKUN has no demo link + shows offline note + has source link; StockFlow still has demo link.

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add components/Projects.tsx components/Projects.test.tsx
git commit -m "feat(projects): demo-offline note for cards without a live demo"
```

---

## Task 4: Hover screenshot overlay (Variant C)

**Files:**
- Modify: `components/Projects.tsx` (add `import Image from "next/image"`; extract `ProjectScreenshot`; render it inside the `Card` in `ProjectCard`)
- Test: `components/Projects.test.tsx`

**Interfaces:**
- Consumes: `ProjectItem` (`image`, `title`, `demoAvailable`) from Task 2.
- Produces: a local `ProjectScreenshot` component: `function ProjectScreenshot({ project }: { project: ProjectItem }): JSX.Element | null`. Returns `null` when `project.image` is falsy; otherwise renders a `next/image` overlay with descriptive `alt` and a decorative hint pill.

- [ ] **Step 1: Write the failing tests**

Add to `components/Projects.test.tsx`:
```tsx
it("renders a screenshot image for cards that have one", () => {
  render(<Projects />);
  const card = cardFor("StockFlow");
  const img = within(card).getByRole("img", {
    name: /stockflow dashboard screenshot/i,
  });
  expect(img).toHaveAttribute("src", "/stock-flow.webp");
});

it("uses a screenshot hint even when the live demo is offline", () => {
  render(<Projects />);
  const card = cardFor("RUKUN");
  expect(
    within(card).getByRole("img", { name: /rukun dashboard screenshot/i }),
  ).toHaveAttribute("src", "/rukun.webp");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — no `<img>` / screenshot overlay is rendered yet.

- [ ] **Step 3: Add the `next/image` import**

At the top of `components/Projects.tsx`, add:
```tsx
import Image from "next/image";
```

- [ ] **Step 4: Create the `ProjectScreenshot` sub-component**

Add this component in `components/Projects.tsx`. The overlay is hidden by default and revealed on hover of the parent `.group` card; on touch/no-hover devices it shows as a static top banner; reduced-motion removes the zoom. Tailwind v4 utilities used: `group-hover:*`, `motion-reduce:*`, and the `[@media(hover:none)]:` arbitrary variant for the touch fallback.
```tsx
function ProjectScreenshot({ project }: { project: ProjectItem }) {
  if (!project.image) return null;

  const demoAvailable = project.demoAvailable !== false;
  const hint = demoAvailable ? "↗ View live demo" : "↗ View screenshot";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 rounded-2xl overflow-hidden opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 motion-reduce:scale-100 motion-reduce:transition-opacity [@media(hover:none)]:static [@media(hover:none)]:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:h-40 [@media(hover:none)]:mb-4"
    >
      <Image
        src={project.image}
        alt={`${project.title} dashboard screenshot`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/40 [@media(hover:none)]:bg-black/10" />
      <span className="absolute inset-0 hidden items-center justify-center group-hover:flex [@media(hover:none)]:hidden">
        <span className="px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
          {hint}
        </span>
      </span>
    </div>
  );
}
```

Note on the touch fallback: `[@media(hover:none)]:static` takes the overlay out of the absolute layer and gives it height so it sits as a banner above the card content. Verify this visually on a narrow viewport in Step 7; if the banner overlaps content, adjust the height/margin utilities. The desktop hover path (the default `absolute inset-0`) is the primary experience and is what the tests assert.

- [ ] **Step 5: Render the overlay inside the card**

In `ProjectCard`, inside the `<Card>` element (which already has the `group` class on the outer wrapper at line 146), add `<ProjectScreenshot project={project} />` as the first child of `<Card>` (before the gradient top-border div at line 164). The `Card` must be `relative` (it already is) so the absolute overlay is contained.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — StockFlow and RUKUN each render an `<img>` with the correct `src` and descriptive `alt`.

- [ ] **Step 7: Manual visual + typecheck + build**

Run: `npx tsc --noEmit` → no errors.
Run: `npm run dev`, open the Projects section, and confirm:
- Desktop: hovering a card fades/zooms in the screenshot with the hint pill.
- Reduced motion (OS setting on): screenshot fades without zoom.
- Narrow/touch viewport (DevTools device mode): screenshot shows as a static banner, no permanent-hidden state.
Run: `npm run build` → succeeds.

- [ ] **Step 8: Commit**

```bash
git add components/Projects.tsx components/Projects.test.tsx
git commit -m "feat(projects): hover screenshot preview with reduced-motion + touch fallback"
```

---

## Task 5: Full-suite verification & final commit

**Files:**
- No source changes (verification only). If any check fails, fix in the relevant task's file and re-run.

**Interfaces:**
- Consumes: everything from Tasks 1–4.
- Produces: a green test suite, clean typecheck, and successful production build.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable if pre-existing).

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build succeeds; the 4 `public/*.webp` images resolve.

- [ ] **Step 5: Final manual sweep**

In `npm run dev`, verify the four cards in order (StockFlow, Portfolio 3D, RUKUN, PUSON), StockFlow's demo + repo buttons, RUKUN/PUSON offline note + source button, and hover screenshots on all four.

- [ ] **Step 6: Commit any final fixes**

```bash
git add -A
git commit -m "chore(projects): verification pass for StockFlow feature"
```
(Skip if nothing changed.)

---

## Self-Review

**Spec coverage:**
- Card order & content (spec §1) → Task 2.
- Type changes `image?`/`demoAvailable?` (spec §2) → Task 2.
- Hover preview Variant C, reduced-motion, mobile fallback, `next/image`, alt text (spec §3) → Task 4.
- Demo-offline marker, note copy, GitHub label change (spec §4) → Task 3.
- Testing section (spec) → Tasks 1–5 (harness + rendering + conditional button + overlay presence + a11y attributes).
- Error/edge handling (missing image, both flags, reduced motion, touch) → Tasks 3–4 logic + Task 4 manual sweep.

**Placeholder scan:** No TBD/TODO. The two spec "Open Items" (hint copy, gradient) are resolved to concrete values in Global Constraints and used verbatim in tasks.

**Type consistency:** `ProjectItem` (Task 2) is consumed unchanged by `ProjectActions` (Task 3) and `ProjectScreenshot` (Task 4). `demoAvailable !== false` default logic is identical in both sub-components. `data-project-card` (added Task 3) is the selector used by test helpers in Tasks 3–4. Public image paths match Global Constraints and the verified files in `public/`.

**Known risk:** `CardTitle`'s rendered heading level (Task 2 Step 1) and the Tailwind v4 arbitrary `[@media(hover:none)]:` variants (Task 4) are the two spots most likely to need a small on-the-spot adjustment; both have inline notes telling the implementer how to verify and adapt.
