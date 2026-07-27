# CV Content Alignment — Design

**Date:** 2026-07-27
**Status:** Approved (design phase)

## Summary

The portfolio site currently mixes Evan Rafif Pradana's real CV data with
fabricated placeholder content (fake certifications, an invented project, tech
skills he doesn't use, wrong contact details, wrong location). This change
makes every user-visible claim on the site match the CV at
`tasks/cv_evan.md` — correcting factual fields, deleting fabricated content,
and rewriting the Skills section to only real, confirmed competencies.

The CV is the single source of truth. The only additions beyond the CV's
literal text are frontend/data skills the user explicitly confirmed he uses
(TypeScript, Tailwind, React, Framer Motion, Python, QA/Testing) and the
in-progress portfolio itself as a third project.

## Goals

- Every factual claim (contact, education, experience, certifications,
  organizations) matches the CV exactly.
- Remove all fabricated content: fake certs, the TaskFlow project, invented
  tech stacks, fake language proficiencies, fabricated metrics.
- Rewrite Skills to reflect only CV skills + user-confirmed real skills.
- Keep the site's existing visual design, layout, and animations unchanged —
  this is a content edit only.

## Non-Goals

- No layout, styling, animation, or component-structure changes.
- No new sections or removed sections (all eight components stay).
- No changes to build tooling, dependencies, or i18n (already removed).

## Source of Truth

CV file: `tasks/cv_evan.md`. Key facts:
- Name: Evan Rafif Pradana
- Location: Purbalingga (rendered as "Purbalingga, Central Java")
- Email: evanrafif45@gmail.com
- Phone: 082325439854 (rendered as "+62 823-2543-9854")
- LinkedIn: linkedin.com/in/evanrafifpradana
- Education: Bachelor's, Informatics Engineering, Telkom University Campus
  Purwokerto, Sept 2022 – Feb 2026, GPA 3.75/4.00, Thesis: "Fine-tuning
  IndoBERT Model for Sentiment Analysis and Comparative Study of Optimizers"
- Certifications: Belajar Dasar Data Science (Dicoding), Belajar Dasar AI
  (Dicoding), EPrT English Proficiency Test (Telkom University)
- Languages: English, Indonesian (only these two)

## Per-Component Changes

### `components/Contact.tsx`
- Email `evanrafifpradana@gmail.com` → `evanrafif45@gmail.com` (both the
  display value and the `mailto:` href).
- Phone `+62 8xx-xxxx-xxxx` → `+62 823-2543-9854`.
- Location `Yogyakarta, Indonesia` → `Purbalingga, Central Java`; update the
  `maps.google.com` query to `Purbalingga,Indonesia`.
- Remove the Twitter/X social link (`x.com/vaninside` — not in CV, not a
  confirmed account). Keep GitHub (`github.com/vaninside`) and LinkedIn.
- Leave the contact form, its placeholder strings, validation, and topic
  options as-is (they are UI scaffolding, not CV claims). The form's example
  email placeholder `evan@example.com` stays (it's a placeholder, not a claim).

### `components/About.tsx`
- Location line `Yogyakarta, Indonesia` → `Purbalingga, Central Java`.
- `aboutSkills` card descriptions: remove the fabricated metric
  "Event Organizer (1000+ attendees)" → phrasing that matches the CV without
  invented numbers ("Lab Assistant, Event Organizer"). Keep GPA 3.75/4.00 and
  the IndoBERT thesis reference (both real).
- Intro paragraph: align to the CV summary — Informatics Engineering fresh
  graduate from Telkom University blending frontend development, data analysis,
  and operational leadership. No fabricated numbers.
- Stat cards: GPA 3.75/4.00 and graduation Feb 2026 stay (real). Any card
  showing a fabricated count (e.g. "Projects Completed" with an invented
  number) is reworded to a CV-true value or a neutral non-numeric label.

### `components/Education.tsx`
- Replace the entire `CERTIFICATIONS` array (React/Meta, TypeScript/Microsoft,
  AWS, Google UX, Next.js/Vercel — all fake) with the three real certs:
  - `Belajar Dasar Data Science` — Dicoding
  - `Belajar Dasar AI` — Dicoding
  - `EPrT (English Proficiency Test)` — Telkom University
  The CV gives no years; make the `year` field optional and leave it empty —
  do not invent years. If the card layout requires a value, omit the year
  element rather than fabricating one.
- Remove the fabricated honor "Top 2 selling on Telkom University Campus
  Purwokerto Market Day 2025" from `EDUCATION[0].honors`. The CV lists no
  honors, so the honors array becomes empty and the Honors block is not
  rendered when empty (guard the render on a non-empty array).
- Keep degree, school, period, GPA, thesis, and the coursework list (consistent
  with an Informatics/ML degree and the IndoBERT thesis).

### `components/Projects.tsx`
- Remove the `TaskFlow` project entirely (fabricated, not in CV).
- Update the third project (currently "Portfolio 3D") to describe this actual
  site accurately: keep the title "Portfolio 3D"; description as a personal
  portfolio built with Next.js; bullets and `tech` updated to the current stack
  — particle-network canvas background (NOT Three.js), Next.js, Framer Motion,
  Tailwind CSS, TypeScript. Remove all Three.js / React Three Fiber / WebGL
  references.
- Keep RUKUN and PUSON as-is (already accurate to CV).
- Result: three project cards.

### `components/Skills.tsx`
- Replace the four fabricated technical categories with three real ones:
  - Frontend: Vue.js, Nuxt.js, Next.js, React, TypeScript, Tailwind CSS,
    Framer Motion
  - Data & AI: Python, Machine Learning / NLP, Data Analysis & Data Science,
    Data Visualization, Generative AI, AWS
  - Languages & Tools: JavaScript, PHP, Git, REST API, Clean Code, QA / Testing
- Soft skills: align to CV — Teamwork, Problem-Solving, Communication,
  Cross-functional Coordination, Inventory Management, Leadership. Remove
  fabricated specifics ("50+ students", "picked up Vue/Nuxt in 2 weeks",
  "1000+ attendee events") — keep neutral CV-true descriptions.
- Languages: English, Indonesian only. Remove "Javanese" and the invented
  "TOEFL 550+" proficiency label. Use plain proficiency wording (e.g.
  "Professional" / "Native") without fabricated test scores.

### `components/Organization.tsx`
- Fix event name `TUPE E-Sport Event` → `TUPEC E-Sport Event` (the CV names the
  event "TUP E-Sports Championship Season 4"; keep that season detail in the
  description).
- Remove the fabricated `highlight: "1000+ attendees"` metric on the Todays
  2025 role → a neutral highlight (e.g. "Logistics & Operations") or drop the
  highlight field. Keep the "4 tier packages" highlight on the sponsorship role
  (Silver/Gold/Platinum/Diamond is stated verbatim in the CV).
- Keep both roles' descriptions (already accurate to CV).

### `components/Experience.tsx`
- Already accurate to CV (both roles, dates, bullets). No content changes
  required. The `tech` tag arrays are reasonable and stay. Verify no fabricated
  claim is present; if the section subheading contains an invented metric,
  neutralize it.

### `components/Hero.tsx`
- Badge "Informatics Engineering Graduate" and subtitle "Frontend developer &
  problem solver…" are consistent with the CV summary — keep. No change unless
  a fabricated number is found.

## Approach

Direct content edits to the eight section components. No data-file indirection
(the i18n JSON layer was removed earlier; content lives inline in each
component, which is the established pattern). Each component is edited
independently and verified.

## Verification

This repo has no unit-test runner (consistent with prior work). Each edited
component is verified with:
- `npx tsc --noEmit` (clean)
- `npm run lint` (no new errors in edited files)
- A cross-check against `tasks/cv_evan.md` confirming every remaining claim
  appears in the CV or is a user-confirmed real skill.
- A final `npm run dev` browser pass confirming all eight sections render and
  no fabricated content remains.

## Files Touched

- Edit: `components/Contact.tsx`
- Edit: `components/About.tsx`
- Edit: `components/Education.tsx`
- Edit: `components/Projects.tsx`
- Edit: `components/Skills.tsx`
- Edit: `components/Organization.tsx`
- Edit (verify/neutralize only): `components/Experience.tsx`, `components/Hero.tsx`
