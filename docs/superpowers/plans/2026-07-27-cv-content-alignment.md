# CV Content Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every user-visible claim on the portfolio site match Evan Rafif Pradana's CV and verified credentials — correcting factual fields, deleting fabricated content, and rewriting Skills/Certifications/Projects.

**Architecture:** Direct inline content edits to six section components. Content lives inline in each component (the i18n JSON layer was removed earlier), so each component is an independent, self-contained edit. No layout, styling, animation, or component-structure changes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4, framer-motion, lucide-react. No new dependencies.

## Global Constraints

- CV source of truth: `tasks/cv_evan.md`. Contact facts: email `evanrafif45@gmail.com`, phone `+62 823-2543-9854`, location `Purbalingga, Central Java`, LinkedIn `linkedin.com/in/evanrafifpradana`.
- Content-only change: do NOT modify layout, className styling, animation configs, or component structure. Only edit the data (text/arrays) and, where required, add a lucide icon import + iconMap entry.
- Every remaining claim must appear in the CV OR be one of the user-confirmed real skills: TypeScript, Tailwind, React, Framer Motion, Python, QA/Testing, Node.js, SQL.
- Certifications = the 9 real ones (below). Render name + issuer + year "2025" only — NO Credential ID.
- Real metrics to KEEP: Todays 2025 "1000+ mahasiswa baru", TUPEC "100+ peserta", GPA 3.75/4.00.
- Fabricated content to DELETE: TaskFlow project; fake certs (React/Meta, TypeScript/Microsoft, AWS, Google UX, Next.js/Vercel); invented tech (GraphQL, Prisma, Docker, Redis, Playwright, Storybook, Express, etc.); "TOEFL 550+"; "Javanese"; "50+ students"; "picked up Vue/Nuxt in 2 weeks"; honor "Top 2 selling … Market Day 2025".
- Languages: English + Indonesian ONLY.
- No unit-test runner exists. Verify each task with `npx tsc --noEmit` (clean) and `npm run lint` (no NEW errors in the edited file — pre-existing `react/no-unescaped-entities` warnings in these files are out of scope), plus a grep cross-check against the CV.
- `git status` shows untracked `.claude-flow/`, `tasks/`, `.superpowers/` scratch — never stage those. Stage only the one component file per task.

### The 9 real certifications (all 2025)

| # | Name | Issuer | Suggested icon |
|---|------|--------|----------------|
| 1 | EPrT (English Proficiency Test) | Telkom University | Medal |
| 2 | Belajar Back-End Pemula dengan JavaScript | Dicoding | Code2 |
| 3 | Belajar Dasar Pemrograman JavaScript | Dicoding | Code2 |
| 4 | Belajar Dasar Cloud dan Gen AI di AWS | Dicoding | Award |
| 5 | Memulai Pemrograman dengan Python | Dicoding | Code2 |
| 6 | Belajar Dasar Data Science | Dicoding | BookOpen |
| 7 | Belajar Dasar AI | Dicoding | Award |
| 8 | Belajar Dasar Visualisasi Data | Dicoding | BookOpen |
| 9 | Belajar Dasar Structured Query Language (SQL) | Dicoding | Code2 |

Icons must come from Education's existing `iconMap` = `{ GraduationCap, Award, BookOpen, Code2, Medal }`. Do not add new icon imports there.

---

## Components with NO changes (verified during planning)

- `components/Experience.tsx` — both roles, dates, and bullets are already CV-accurate. Subheading "Building real-world products and mentoring the next generation" contains no fabricated number. No change.
- `components/Hero.tsx` — badge "Informatics Engineering Graduate" and the subtitle are consistent with the CV summary; no fabricated claim. No change.

No task touches these two files.

---

### Task 1: Contact — real contact details, LinkedIn icon, drop Twitter

**Files:**
- Modify: `components/Contact.tsx` (imports ~line 6-18; `iconMap` ~line 73-80; `contactInfo` ~line 83-111; `socialLinks` ~line 114-118)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (content-only, independent).

- [ ] **Step 1: Add the Linkedin icon to the lucide import**

In `components/Contact.tsx`, the icon import block (starts ~line 6, `import {` … `} from "lucide-react";`) currently includes names like `ExternalLink`, `GitBranch`, `Send`, `Mail`, `Phone`, `MapPin`, `Clock`. Add `Linkedin` to that import list (alphabetical position is fine, just inside the same braces).

- [ ] **Step 2: Add Linkedin to the component's iconMap**

The `iconMap` object (~line 73) maps string names to icon components (`Mail, Phone, MapPin, Clock, GitBranch, ExternalLink, Send`). Add a `Linkedin,` entry to it.

- [ ] **Step 3: Replace the `contactInfo` array**

Replace the entire `contactInfo` array with:

```tsx
const contactInfo = [
  {
    label: "Email",
    value: "evanrafif45@gmail.com",
    icon: "Mail",
    href: "mailto:evanrafif45@gmail.com",
    description: "Primary contact for opportunities",
  },
  {
    label: "Phone",
    value: "+62 823-2543-9854",
    icon: "Phone",
    href: "tel:+6282325439854",
    description: "WhatsApp / Call available",
  },
  {
    label: "Location",
    value: "Purbalingga, Central Java",
    icon: "MapPin",
    href: "https://maps.google.com/?q=Purbalingga,Indonesia",
    description: "Open to relocation & remote",
  },
  {
    label: "Availability",
    value: "Full-time / Freelance",
    icon: "Clock",
    href: "#",
    description: "Immediate start available",
  },
] as const;
```

- [ ] **Step 4: Replace the `socialLinks` array (drop Twitter/X, fix LinkedIn icon)**

Replace the entire `socialLinks` array with:

```tsx
const socialLinks = [
  { label: "GitHub", icon: "GitBranch", href: "https://github.com/vaninside", color: "hover:text-gray-400 dark:hover:text-gray-500" },
  { label: "LinkedIn", icon: "Linkedin", href: "https://linkedin.com/in/evanrafifpradana", color: "hover:text-primary/80 dark:hover:text-primary" },
] as const;
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0). If `Linkedin` is not an exported lucide icon, tsc/build fails here — in that unlikely case, keep the icon as `"ExternalLink"` in socialLinks and remove the `Linkedin` import/iconMap entry, then re-run.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Contact.tsx`.

- [ ] **Step 7: Cross-check against CV**

Run: `grep -nE "evanrafif45|823-2543-9854|Purbalingga|linkedin.com/in/evanrafifpradana" components/Contact.tsx` and `grep -nc "x.com/vaninside\|Twitter" components/Contact.tsx`
Expected: first grep shows all four real values present; second grep shows `0` (Twitter/X gone).

- [ ] **Step 8: Commit**

```bash
git add components/Contact.tsx
git commit -m "fix(contact): use real CV contact details, LinkedIn icon, drop Twitter"
```

---

### Task 2: About — location, intro paragraphs, stat cards

**Files:**
- Modify: `components/About.tsx` (intro paragraphs ~line 71-77; location line ~line 129; stat cards ~line 134-150)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (content-only, independent).

- [ ] **Step 1: Rewrite the two intro paragraphs**

Replace the two intro `<p>` blocks (the `text-lg md:text-xl font-medium text-foreground` paragraph and the plain `<p>` that follows it) with:

```tsx
            <p className="text-lg md:text-xl font-medium text-foreground">
              I&apos;m an Informatics Engineering graduate from Telkom University, blending frontend web development with data analysis and hands-on operational leadership. I build clean, performant web experiences with Vue, Nuxt, and Next.js.
            </p>
            <p>
              I&apos;ve shipped a production frontend as an intern at PT Cazh Teknologi Inovasi, mentored students as a Software Construction Lab Assistant, and coordinated logistics for large-scale campus events. I enjoy turning complex problems into clear, testable solutions.
            </p>
```

- [ ] **Step 2: Fix the location line**

Replace:

```tsx
                  <p className="text-sm text-muted-foreground mt-2">Yogyakarta, Indonesia</p>
```

with:

```tsx
                  <p className="text-sm text-muted-foreground mt-2">Purbalingga, Central Java</p>
```

- [ ] **Step 3: Replace the four stat cards with CV-true values**

The current "Quick stats" grid has garbled labels ("2 Present", "5+ 2024"). Replace the four stat-card `<div>`s (inside `{/* Quick stats */}`) with:

```tsx
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">3.75</div>
                    <div className="text-xs text-muted-foreground">GPA / 4.00</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">9</div>
                    <div className="text-xs text-muted-foreground">Certifications</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">2</div>
                    <div className="text-xs text-muted-foreground">Work Experiences</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">2026</div>
                    <div className="text-xs text-muted-foreground">Graduated</div>
                  </div>
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/About.tsx`.

- [ ] **Step 6: Cross-check**

Run: `grep -nc "Yogyakarta" components/About.tsx`
Expected: `0` (location fixed).

- [ ] **Step 7: Commit**

```bash
git add components/About.tsx
git commit -m "fix(about): CV summary intro, Purbalingga location, real stat cards"
```

---

### Task 3: Education — 9 real certifications, drop fake honor

**Files:**
- Modify: `components/Education.tsx` (`EDUCATION[0].honors` ~line 30; `CERTIFICATIONS` ~line 42-48; honors render block ~line 173-192)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (content-only, independent).

- [ ] **Step 1: Empty the fabricated honors array**

Replace:

```tsx
    honors: ["Top 2 selling on Telkom University Campus Purwokerto Market Day 2025"],
```

with:

```tsx
    honors: [],
```

- [ ] **Step 2: Guard the honors render so the empty block does not show**

In the render, the honors column is a `<div>` containing `{EDU_LABELS.honors}` and `{edu.honors.map(...)}`. Wrap that entire honors `<div>` (the one starting right after `{/* Honors */}`) in a length guard. Change:

```tsx
                  {/* Honors */}
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                      <Award className="size-5 text-primary" aria-hidden="true" />
                      {EDU_LABELS.honors}
                    </h4>
                    <ul className="space-y-2" role="list">
                      {edu.honors.map((honor) => (
                        <motion.li
                          key={honor}
                          variants={honorVariants}
                          className="flex items-center gap-3 text-sm text-muted-foreground"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Medal className="size-3" aria-hidden="true" />
                          </span>
                          {honor}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
```

to wrap it in `{edu.honors.length > 0 && ( ... )}`:

```tsx
                  {/* Honors */}
                  {edu.honors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                        <Award className="size-5 text-primary" aria-hidden="true" />
                        {EDU_LABELS.honors}
                      </h4>
                      <ul className="space-y-2" role="list">
                        {edu.honors.map((honor) => (
                          <motion.li
                            key={honor}
                            variants={honorVariants}
                            className="flex items-center gap-3 text-sm text-muted-foreground"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Medal className="size-3" aria-hidden="true" />
                            </span>
                            {honor}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
```

Note: `EDUCATION` is declared `as const`, so `honors: []` has type `readonly []`; `.length > 0` and `.map` both type-check.

- [ ] **Step 3: Replace the CERTIFICATIONS array with the 9 real certs**

Replace the entire `CERTIFICATIONS` array with:

```tsx
const CERTIFICATIONS = [
  { name: "EPrT (English Proficiency Test)", issuer: "Telkom University", year: "2025", icon: "Medal" as const },
  { name: "Belajar Back-End Pemula dengan JavaScript", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
  { name: "Belajar Dasar Pemrograman JavaScript", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
  { name: "Belajar Dasar Cloud dan Gen AI di AWS", issuer: "Dicoding", year: "2025", icon: "Award" as const },
  { name: "Memulai Pemrograman dengan Python", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
  { name: "Belajar Dasar Data Science", issuer: "Dicoding", year: "2025", icon: "BookOpen" as const },
  { name: "Belajar Dasar AI", issuer: "Dicoding", year: "2025", icon: "Award" as const },
  { name: "Belajar Dasar Visualisasi Data", issuer: "Dicoding", year: "2025", icon: "BookOpen" as const },
  { name: "Belajar Dasar Structured Query Language (SQL)", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
] as const;
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0). All four icon names used (`Medal`, `Code2`, `Award`, `BookOpen`) already exist in `iconMap`.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Education.tsx`.

- [ ] **Step 6: Cross-check**

Run: `grep -nc "Meta\|Microsoft\|Google UX\|Vercel\|Market Day" components/Education.tsx`
Expected: `0` (all fabricated certs + fake honor gone). Then `grep -nc "Dicoding" components/Education.tsx` → expect `8`.

- [ ] **Step 7: Commit**

```bash
git add components/Education.tsx
git commit -m "fix(education): 9 real certifications, remove fabricated honor"
```

---

### Task 4: Projects — remove TaskFlow, update the portfolio project

**Files:**
- Modify: `components/Projects.tsx` (`projects` array — the "Portfolio 3D" object ~line 62-74 and the "TaskFlow" object ~line 76-88)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (content-only, independent).

- [ ] **Step 1: Delete the entire TaskFlow project object**

Remove the fourth project object (the one with `title: "TaskFlow"`), including its trailing comma, so the `projects` array ends with the Portfolio project. RUKUN and PUSON (first two) are unchanged.

- [ ] **Step 2: Replace the Portfolio project object with accurate content**

Replace the `title: "Portfolio 3D"` object with:

```tsx
  {
    title: "Portfolio 3D",
    description: "Personal Portfolio — Next.js & Framer Motion",
    period: "July 2025 - Present",
    tech: ["Next.js", "React", "TypeScript", "Framer Motion", "Tailwind CSS"],
    points: [
      "Built an interactive particle-network canvas hero background reactive to the cursor.",
      "Implemented scroll-triggered animations with spring physics and reduced-motion support.",
      "Optimized with dynamic imports and off-screen pausing for smooth performance.",
    ],
    links: { demo: "#", github: "https://github.com/vaninside/portfolio-3d" },
    color: "from-violet-500 via-purple-500 to-pink-500",
    icon: "Layers",
  },
```

Note: the bullet-list field is named `points` (confirmed — the `ProjectItem` type declares `points: readonly string[]`, and RUKUN/PUSON both use `points`). The `icon: "Layers"` value already exists in the file's `iconMap` (`{ Globe, Shield, Layers, Zap }`).

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Projects.tsx`.

- [ ] **Step 5: Cross-check**

Run: `grep -nc "TaskFlow\|Three.js\|React Three Fiber\|WebGL\|Socket.io\|Prisma" components/Projects.tsx`
Expected: `0` (TaskFlow and all stale/fabricated tech references gone). Then `grep -nc "title:" components/Projects.tsx` → expect `3` (RUKUN, PUSON, Portfolio 3D).

- [ ] **Step 6: Commit**

```bash
git add components/Projects.tsx
git commit -m "fix(projects): drop fabricated TaskFlow, update portfolio to real stack"
```

---

### Task 5: Skills — real technical categories, soft skills, languages

**Files:**
- Modify: `components/Skills.tsx` (`technicalSkills` ~line 45-105; `softSkills` ~line 107-139; `languages` ~line 141-145)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (content-only, independent).

- [ ] **Step 1: Replace the four fabricated technical categories with three real ones**

Replace the entire `technicalSkills` array with:

```tsx
const technicalSkills = [
  {
    category: "Frontend",
    icon: "Code" as const,
    color: "from-blue-500 via-cyan-500 to-blue-600",
    skills: [
      "Vue.js / Nuxt.js",
      "Next.js (App Router)",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    category: "Data & AI",
    icon: "Brain" as const,
    color: "from-emerald-500 via-teal-500 to-emerald-600",
    skills: [
      "Python",
      "Machine Learning / NLP",
      "Data Analysis & Data Science",
      "Data Visualization",
      "Generative AI",
      "AWS (Cloud & Gen AI)",
    ],
  },
  {
    category: "Languages & Tools",
    icon: "Server" as const,
    color: "from-violet-500 via-purple-500 to-pink-500",
    skills: [
      "JavaScript",
      "Node.js",
      "PHP",
      "SQL",
      "Git / Version Control",
      "REST API",
      "Clean Code Principles",
      "QA / Testing",
    ],
  },
] as const;
```

Icon names `Code`, `Brain`, `Server` all exist in this file's `iconMap`.

- [ ] **Step 2: Replace the softSkills array (remove fabricated specifics)**

Replace the entire `softSkills` array with:

```tsx
const softSkills = [
  {
    label: "Teamwork",
    icon: "Users" as const,
    desc: "Collaborate effectively across design, engineering, and operations teams",
  },
  {
    label: "Problem Solving",
    icon: "Brain" as const,
    desc: "Break complex challenges into clear, testable solutions",
  },
  {
    label: "Communication",
    icon: "MessageSquare" as const,
    desc: "Clear communication across teams, vendors, and stakeholders",
  },
  {
    label: "Cross-functional Coordination",
    icon: "Target" as const,
    desc: "Coordinate schedules, resources, and delivery across functions",
  },
  {
    label: "Inventory Management",
    icon: "Clock" as const,
    desc: "Managed logistics, resources, and inventory for large-scale events",
  },
  {
    label: "Leadership",
    icon: "Lightbulb" as const,
    desc: "Mentored students as a lab assistant and led event operations",
  },
] as const;
```

All six icon names (`Users`, `Brain`, `MessageSquare`, `Target`, `Clock`, `Lightbulb`) already exist in this file's `iconMap` (each was used by the previous softSkills entries).

- [ ] **Step 3: Replace the languages array (English + Indonesian only)**

Replace the entire `languages` array with:

```tsx
const languages = [
  { name: "Indonesian", level: "Native", icon: "Globe" as const },
  { name: "English", level: "Professional", icon: "Globe" as const },
] as const;
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Skills.tsx`.

- [ ] **Step 6: Cross-check**

Run: `grep -nc "GraphQL\|Prisma\|Docker\|Redis\|Playwright\|Storybook\|Express\|Fastify\|MongoDB\|TOEFL\|Javanese\|Three.js" components/Skills.tsx`
Expected: `0` (all fabricated tech + fake languages gone).

- [ ] **Step 7: Commit**

```bash
git add components/Skills.tsx
git commit -m "fix(skills): real skill categories, CV soft skills, EN/ID languages only"
```

---

### Task 6: Organization — TUPEC name fix, real highlights

**Files:**
- Modify: `components/Organization.tsx` (`orgs` array — `event` ~line 62, `highlight` ~line 58 and ~line 74)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (content-only, independent).

- [ ] **Step 1: Fix the Todays 2025 highlight**

Replace:

```tsx
    highlight: "1000+ attendees",
```

with:

```tsx
    highlight: "1000+ mahasiswa baru",
```

- [ ] **Step 2: Fix the event name TUPE → TUPEC**

Replace:

```tsx
    event: "TUPE E-Sport Event",
```

with:

```tsx
    event: "TUPEC E-Sport Event",
```

- [ ] **Step 3: Fix the sponsorship highlight**

Replace:

```tsx
    highlight: "4 tier packages",
```

with:

```tsx
    highlight: "100+ peserta",
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/Organization.tsx`.

- [ ] **Step 6: Cross-check**

Run: `grep -nE "TUPEC|1000\+ mahasiswa baru|100\+ peserta" components/Organization.tsx`
Expected: all three present. Then `grep -nc "TUPE E-Sport\|4 tier packages\|1000+ attendees" components/Organization.tsx` → expect `0`.

- [ ] **Step 7: Commit**

```bash
git add components/Organization.tsx
git commit -m "fix(organization): TUPEC name, real attendance highlights"
```

---

## Self-Review

**Spec coverage:**
- Contact: email/phone/location + drop Twitter + LinkedIn icon → Task 1. ✓
- About: location, intro paragraphs, stat cards (aboutSkills "1000+" is real, left intact) → Task 2. ✓
- Education: 9 certs (name+issuer+2025, no ID), empty honors + render guard → Task 3. ✓
- Projects: drop TaskFlow, update Portfolio 3D to particle/Next.js stack, keep RUKUN/PUSON → Task 4. ✓
- Skills: 3 real technical categories, CV soft skills, EN/ID languages, Node.js+SQL added → Task 5. ✓
- Organization: TUPEC fix, 1000+ mahasiswa baru, 100+ peserta → Task 6. ✓
- Experience/Hero: verified clean, no task. ✓
- Certifications list matches spec's authoritative 9. ✓
- Real metrics kept (1000+, 100+, GPA 3.75). ✓

**Placeholder scan:** No TBD/TODO. All edits show complete before/after code. The one conditional instruction (Task 4 Step 2, "match RUKUN/PUSON's bullet key name") is a concrete verification against visible sibling objects, not a placeholder. The one fallback (Task 1 Step 5, Linkedin import) is a named, concrete recovery path. ✓

**Type consistency:** Icon names used are confirmed present in each file's existing `iconMap` (Education: Medal/Code2/Award/BookOpen; Skills technical: Code/Brain/Server; Skills soft: Users/Brain/MessageSquare/Target/Clock/Lightbulb; Projects: Layers; Contact adds Linkedin). All arrays keep their existing `as const` and field shapes. ✓
