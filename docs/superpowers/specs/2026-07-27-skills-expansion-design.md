# Skills Section Expansion — Design

**Date:** 2026-07-27
**Status:** Approved (design phase)
**Branch:** feat/cv-content (continues the CV-alignment work)

## Summary

Expand the Skills section from 3 technical categories to **5 categories, each
with exactly 8 skills**, so every card looks full and balanced. Backend and
Tools become their own categories (per the owner's request). Every skill must
remain honest — traceable to the CV, one of the owner's 9 Dicoding/Telkom
certifications, his RUKUN internship, his IndoBERT thesis, or a
degree/tooling skill he explicitly confirmed. No invented padding.

This is a follow-up to the CV content-alignment work (which removed fabricated
skills like GraphQL/Docker/Redis). The honesty bar set there still applies.

## Goals

- 5 technical categories, each with exactly 8 skills.
- Add Backend and Tools as standalone categories; keep them (do not merge or
  drop).
- Add a Programming Languages category.
- Every entry is real (see provenance notes below).
- Keep the section's visual design; only adjust the grid to flow 5 cards
  cleanly and add the two new category icons/colors.

## Non-Goals

- No change to soft skills or spoken languages (Indonesian/English) — those
  stay exactly as they are.
- No change to other components.
- No new npm dependencies (both new icons exist in the installed lucide-react).

## The 5 Categories (exact content)

Each `skills` array must have exactly 8 entries.

### 1. Frontend — icon `Code`, color `from-blue-500 via-cyan-500 to-blue-600`
1. React
2. Next.js
3. Vue.js
4. Nuxt.js
5. Tailwind CSS
6. Framer Motion
7. HTML5
8. CSS3

### 2. Backend — icon `Server`, color `from-emerald-500 via-teal-500 to-emerald-600`
1. Node.js
2. REST API
3. Authentication & Middleware
4. PHP
5. SQL / MySQL
6. Database Design
7. OOP
8. API Integration

Provenance: Node.js + OOP from Dicoding Back-End & Python certs; PHP + REST +
auth/middleware + API integration from CV and the RUKUN internship (secure
multi-level auth, route middleware, RESTful API); SQL/MySQL + Database Design
from the Dicoding SQL cert.

### 3. Data & AI — icon `Brain`, color `from-violet-500 via-purple-500 to-pink-500`
1. Machine Learning
2. Deep Learning
3. NLP / IndoBERT
4. Data Analysis
5. Data Science
6. Data Visualization
7. Generative AI
8. Model Fine-tuning

Provenance: thesis (IndoBERT fine-tuning, NLP, optimizers) + Dicoding Data
Science / AI / Data Visualization / Cloud & Gen AI certs + CV coursework
(Machine Learning, Deep Learning).

### 4. Programming Languages — icon `Braces`, color `from-amber-500 via-orange-500 to-red-500`
1. JavaScript
2. TypeScript
3. Python
4. PHP
5. SQL
6. Java
7. C / C++
8. Dart

Provenance: JS/TS/Python/PHP/SQL from certs + internship + portfolio; Java,
C/C++, Dart confirmed by the owner as languages he has actually used
(Informatics degree coursework — DSA, OOP, mobile).

### 5. Tools — icon `Wrench`, color `from-rose-500 via-pink-500 to-fuchsia-500`
1. Git / GitHub
2. VS Code
3. Postman
4. Figma
5. Jira / Trello
6. Vercel / Netlify
7. AWS
8. npm

Provenance: Postman / Figma / Jira-Trello / Vercel-Netlify confirmed by the
owner; Git/VS Code/npm are standard daily tools evidenced by this repo; AWS
from the Dicoding Cloud & Gen AI cert.

## Implementation Notes (components/Skills.tsx only)

- **Data:** replace the 3-element `technicalSkills` array with the 5 categories
  above, each `skills` array holding exactly 8 strings. Keep `as const`, keep
  the `{ category, icon, color, skills }` object shape.
- **Icons:** add `Braces` and `Wrench` to the lucide-react import block AND to
  the component's `iconMap` object. Both are confirmed exports of the installed
  lucide-react. No other icon changes; existing icons (Code/Server/Brain) are
  reused for the first three categories.
- **Colors:** categories 4 and 5 introduce two color strings. `from-amber-500
  via-orange-500 to-red-500` already existed on the old 4th category;
  `from-rose-500 via-pink-500 to-fuchsia-500` is new. Both are plain Tailwind
  gradient utility strings consumed the same way as existing ones — no config
  change needed.
- **Grid:** the category grid is currently `grid gap-8 md:grid-cols-2
  lg:grid-cols-4`. With 5 cards that leaves a lone 5th card on the lg row.
  Change `lg:grid-cols-4` → `lg:grid-cols-3` so 5 cards flow 3 + 2 (balanced).
  md stays 2-up. This is the only layout change.
- **Card subtitle:** the card already renders `{category.skills.length}
  technologies` — with 8 entries it shows "8 technologies" automatically. No
  edit needed.
- Do NOT touch `softSkills`, `languages`, the render markup beyond the one grid
  className, or any other file.

## Verification

No unit-test runner (repo convention). Verify with:
- `npx tsc --noEmit` (clean, exit 0).
- `npm run lint` (no NEW errors in Skills.tsx).
- Grep/inspection: each of the 5 `skills` arrays has exactly 8 entries.
- Browser pass (`npm run dev`): 5 category cards render, each shows "8
  technologies", the two new icons (Braces, Wrench) display, grid flows 3+2 on
  desktop, soft skills + spoken languages unchanged.

## Files Touched

- Edit: `components/Skills.tsx` (technicalSkills array, lucide import + iconMap,
  one grid className).
