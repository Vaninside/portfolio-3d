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

The CV is the primary source of truth, supplemented by the user's verified
LinkedIn/GitHub credentials (9 real certifications — a superset of the CV's
list) and two confirmed-real organization metrics (Todays 2025: 1000+ new
students; TUPEC: 100+ participants). The only additions beyond documented
credentials are frontend/data skills the user explicitly confirmed he uses
(TypeScript, Tailwind, React, Framer Motion, Python, QA/Testing, plus Node.js
and SQL backed by his Dicoding certs) and the in-progress portfolio itself as a
third project.

## Goals

- Every factual claim (contact, education, experience, certifications,
  organizations) matches the CV exactly.
- Remove all fabricated content: fake certs, the TaskFlow project, invented
  tech stacks, fake language proficiencies (TOEFL 550+, Javanese), and
  fabricated metrics ("50+ students", "Vue in 2 weeks"). Note: the org
  attendance figures (Todays 1000+, TUPEC 100+) are REAL and are kept.
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
- Certifications (9 total, from the user's LinkedIn/GitHub credentials — a
  superset of the CV's list): see the Education section for the full list.
- Languages: English, Indonesian (only these two)

### Certifications (authoritative list — 9)

All issued 2025. Credential IDs recorded here for reference but NOT rendered
(the cards show name + issuer + year only, per the user's choice).

1. EPrT (English Proficiency Test) — Telkom University Language Center — 2025
2. Belajar Back-End Pemula dengan JavaScript — Dicoding — 2025
3. Belajar Dasar Pemrograman JavaScript — Dicoding — 2025
4. Belajar Dasar Cloud dan Gen AI di AWS — Dicoding — 2025
5. Memulai Pemrograman dengan Python — Dicoding — 2025
6. Belajar Dasar Data Science — Dicoding — 2025
7. Belajar Dasar AI — Dicoding — 2025
8. Belajar Dasar Visualisasi Data — Dicoding — 2025
9. Belajar Dasar Structured Query Language (SQL) — Dicoding — 2025

### Organization metrics (both real, confirmed by user)

- Todays 2025 (BEM KEMA): highlight "1000+ mahasiswa baru" — REAL, keep it.
- TUPEC E-Sport Event: highlight "100+ peserta" — REAL, ~100 participants.

## Per-Component Changes

### `components/Contact.tsx`
- Email `evanrafifpradana@gmail.com` → `evanrafif45@gmail.com` (both the
  display value and the `mailto:` href).
- Phone `+62 8xx-xxxx-xxxx` → `+62 823-2543-9854`.
- Location `Yogyakarta, Indonesia` → `Purbalingga, Central Java`; update the
  `maps.google.com` query to `Purbalingga,Indonesia`.
- Remove the Twitter/X social link (`x.com/vaninside` — not in CV, not a
  confirmed account). Keep GitHub (`github.com/vaninside`) and LinkedIn
  (`linkedin.com/in/evanrafifpradana`). LinkedIn must be prominently present as
  a social link (the user explicitly asked to keep/emphasize it) — verify the
  href is exactly `https://linkedin.com/in/evanrafifpradana` and the icon reads
  as LinkedIn, not a generic external-link glyph.
- Leave the contact form, its placeholder strings, validation, and topic
  options as-is (they are UI scaffolding, not CV claims). The form's example
  email placeholder `evan@example.com` stays (it's a placeholder, not a claim).

### `components/About.tsx`
- Location line `Yogyakarta, Indonesia` → `Purbalingga, Central Java`.
- `aboutSkills` card descriptions: the "Event Organizer (1000+ attendees)"
  metric is REAL (Todays 2025 had 1000+ new students) — keep it. Keep GPA
  3.75/4.00 and the IndoBERT thesis reference (both real).
- Intro paragraph: align to the CV summary — Informatics Engineering fresh
  graduate from Telkom University blending frontend development, data analysis,
  and operational leadership. No fabricated numbers.
- Stat cards: GPA 3.75/4.00 and graduation Feb 2026 stay (real). Any card
  showing a fabricated count (e.g. "Projects Completed" with an invented
  number) is reworded to a CV-true value or a neutral non-numeric label.

### `components/Education.tsx`
- Replace the entire `CERTIFICATIONS` array (React/Meta, TypeScript/Microsoft,
  AWS, Google UX, Next.js/Vercel — all fake) with the nine real certs listed in
  the "Certifications (authoritative list — 9)" section above. Render each card
  as **name + issuer + year (2025)** only — no Credential ID. Issuers:
  "Telkom University" for EPrT, "Dicoding" for the other eight.
  - Pick a sensible existing icon per cert from the component's `iconMap`
    (e.g. Code2 for the programming/back-end/SQL certs, Award/Medal for
    EPrT, Brain/Award for AI/Data Science). Do not add new icon imports beyond
    what the component already supports; reuse the existing set.
  - Nine cards is more than the old five — confirm the grid/layout flows
    naturally (it uses a responsive grid; no layout change needed, just more
    items).
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
  - Languages & Tools: JavaScript, Node.js, PHP, SQL, Git, REST API, Clean
    Code, QA / Testing
    (Node.js and SQL are backed by the user's Dicoding back-end and SQL certs.)
- Soft skills: align to CV — Teamwork, Problem-Solving, Communication,
  Cross-functional Coordination, Inventory Management, Leadership. Remove
  fabricated specifics ("50+ students", "picked up Vue/Nuxt in 2 weeks"). The
  "1000+ attendee events" reference is REAL (Todays 2025) and may stay, but
  keep descriptions concise and CV-true.
- Languages: English, Indonesian only. Remove "Javanese" and the invented
  "TOEFL 550+" proficiency label. Use plain proficiency wording (e.g.
  "Professional" / "Native") without fabricated test scores.

### `components/Organization.tsx`
- Fix event name `TUPE E-Sport Event` → `TUPEC E-Sport Event` (the CV names the
  event "TUP E-Sports Championship Season 4"; keep that season detail in the
  description).
- Highlights (both real): Todays 2025 role → "1000+ mahasiswa baru" (keep;
  this metric is confirmed real). TUPEC sponsorship role → change the current
  "4 tier packages" highlight to "100+ peserta" per the user's choice. (The
  4-tier package detail — Silver/Gold/Platinum/Diamond — remains in the role's
  description bullets, just not as the headline badge.)
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
