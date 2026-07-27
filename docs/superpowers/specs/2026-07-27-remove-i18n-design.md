# Remove i18n — Inline English Content

**Date:** 2026-07-27
**Status:** Approved (brainstorm)
**Target:** `portfolio_3d`
**Language:** English (locked, single)

## Goal

Single-language (English) portfolio. Remove all i18n machinery: provider, hook, context, types, language switcher, and both locale JSON files (including the dead duplicate under `public/locales`). All user-facing strings become inline literals in JSX; structured arrays (projects, skills, experience, education, organization, contact info) become typed `const` declarations at the top of their component file. No `t()`, no runtime language selection, no `localStorage` language key.

The user explicitly chose **approach A: pure inline, no JSON** — every translation-key call and every locale JSON file is deleted. English content is copied verbatim from the existing `lib/i18n/locales/en.json` into the components.

## Why

The portfolio ships in one language. The i18n abstraction (context, provider, hook, switcher, two locale trees, JSON import + `resolveJsonModule`) is overhead with a single consumer. Removing it deletes a layer of indirection from every component and a duplicate content tree (`public/locales` is never fetched). After the change, editing content means editing the component that renders it — one mental model, no indirection.

## Scope

**In scope:**
- Rewrite 9 components + layout to inline content, drop `t()` and the i18n imports.
- Delete `lib/i18n/` and `public/locales/`.
- Delete `components/ui/LanguageSwitcher.tsx`.
- Remove the switcher from `Navbar` and the `I18nProvider` wrap from `layout.tsx`.

**Out of scope:**
- Editing content wording — values are copied verbatim from `en.json`. No rewrites, no new copy.
- Adding a content module / data layer — the user declined approaches B and C. Arrays live in-component.
- Touching `<html lang="en">` or metadata — already English, unchanged.
- Changing `resolveJsonModule` in `tsconfig.json` — harmless to leave true; no JSON imports remain after the work.
- Adding tests — project has no test framework. Verification is `tsc --noEmit` + `next build` + visual eyeball (see Testing).

## Current architecture (what exists)

i18n is a custom React Context system:

- `lib/i18n/context.tsx` — `I18nProvider` + `useTranslation` hook. Loads `en`/`id` JSON, keeps `language` in state, persists to `localStorage("language")`, exposes `{ language, setLanguage, t, messages }`. `t()` supports overloads: string lookup with `{{param}}` interpolation, and `{ returnObjects: true }` to return raw arrays/objects.
- `lib/i18n/types.ts` — `Locale` type, `FlattenKeys`/`TranslationKey` (dot-path autocomplete type derived from `en.json`), `TranslationSections`.
- `lib/i18n/useTranslation.ts` — re-export barrel (`useTranslation`, `I18nProvider`).
- `lib/i18n/locales/{en,id}.json` — full content + translations (431 keys each).
- `public/locales/{en,id}.json` — **dead duplicate**: identical, no fetcher exists. Comment in `context.tsx` says "copied from public/locales" but the copy is manual/non-automated.
- `components/ui/LanguageSwitcher.tsx` — a styled `<select>` en/id; used only at `Navbar.tsx:113`.
- `app/layout.tsx` — wraps `<Navbar/>{children}` in `<I18nProvider>`.

Consumers (10 files call `t()`):
`Hero`, `Navbar`, `About`, `Experience`, `Projects`, `Skills`, `Education`, `Organization`, `Contact`, `LanguageSwitcher`.

`useTranslation` is used heavily with `returnObjects: true` to pull structured arrays: `projects.items`, `skills.technicalSkills`, `skills.softSkills`, `skills.languages`, `experience.items`, `education.items`, `education.certifications`, `organization.items`, `contact.contactInfo`, `contact.socialLinks`, `contact.form`. Several components also call `t()` for plain strings (`title`, `subtitle`, labels, validation messages).

Two special call patterns to preserve:
1. **About.tsx (dynamic key):** `t(\`about.skills.${skill.key}.label\` as TranslationKey)` — a dynamic key built at runtime from `skill.key` (`frontend` | `academic` | `leadership` | `problemSolving`). Replaced by a typed `Record<string, { label, desc }>` constant in `About.tsx`.
2. **Contact.tsx (footer block):** `const footer = t("contact", { returnObjects: true })` reads a shallow slice of top-level `contact` fields (`footerNote`, `bySubmitting`, `privacyPolicy`, `termsOfService`). Replaced by individual inline literals at each usage site (no object indirection needed).

Dead JSON sections (never referenced by any component — confirmed by grep): `language.*` (only the switcher read these, and it is being deleted) and `footer.copyright` / `footer.builtWith` (no `Footer` component exists; the footer text rendered in `Contact.tsx` reads `contact.*` fields instead). These are dropped, not transcribed.

## Target architecture

No shared i18n layer. Each component is self-contained: it declares its own inline content and depends only on `lucide-react`, `framer-motion`, and `@/components/ui/*`. No cross-content imports.

Per-component transformation (applied uniformly):
- Delete `import { useTranslation } from "@/lib/i18n/useTranslation";`
- Delete `const { t } = useTranslation();` (or `const { language, setLanguage, t } = ...` in the switcher).
- Every `t("a.b")` → the literal English string verbatim from `en.json`.
- Every `t("a", { returnObjects: true })` → a typed `const` declared at the top of the file, holding the array/object verbatim from `en.json`.
- Keep all non-i18n logic untouched: framer-motion variants, refs/effects, event handlers, animation configs, `"use client"` directives, form state, the 3D tilt card logic in `Projects`, the form validation logic in `Contact`.
- Existing `iconMap` patterns (e.g. `Projects` maps `project.icon` string keys → lucide components) continue to key off the inline string `"Globe"` etc. — no change to the map, just the data source becomes inline.
- Unused JSON keys are not transcribed.

### Per-component content inventory

| Component | `t()` calls | Inline content to add |
|---|---|---|
| `Hero` | 6 | `badge`, `name1`, `name2`, `subtitle`, `ctaContact`, `ctaCv` — string literals |
| `Navbar` | 8 | 5 nav link labels (`about`, `experience`, `projects`, `skills`, `contact`); delete `LanguageSwitcher` import + `<LanguageSwitcher/>` element |
| `About` | 14 | `title`, `description1`, `description2`, `highlights.{experience,projects,technologies}`, and `aboutSkills: Record<"frontend" \| "academic" \| "leadership" \| "problemSolving", { label, desc }>` replacing the dynamic-key lookup |
| `Experience` | 5 | `title`, `subtitle`, `present`, `responsibilities`, `technologies`, `items` (2 objects with `points[]`, `tech[]`) |
| `Projects` | 8 | `title`, `subtitle`, `viewCode`, `viewDemo`, `items` (4 objects: title, description, period, `tech[]`, `points[]`, `links{demo,github}`, color, icon). Per-card CTAs read `viewCode`/`viewDemo` inline. |
| `Skills` | 9 | `title`, `subtitle`, `categories{frontend,backend,tools,testing}`, `technicalSkills` (4 categories × 8 skills), `softSkills` (6), `languages` (3) |
| `Education` | 7 | `title`, `subtitle`, `items` (1, with `honors[]`, `subjects[]`), `certifications` (5), `labels{period,location,thesis,honors,subjects,certifications,continuousLearning}` |
| `Organization` | 5 | `title`, `subtitle`, `orgs` (2 objects with `points[]`, `icon`, `color`, `bgColor`, `borderColor`, `highlight`), `labels{experience,leading}` |
| `Contact` | 8 | `title`, `subtitle`, `description`, `connectWithMe`, `sendMessage`, `hireMe`, `downloadCv`; `contactInfo` (4), `socialLinks` (3); `form` block — `name/email/subject/message/send/sending/success/error`, `placeholder.*`, `subjectOptions{select,job,freelance,collaboration,mentoring,other}`, `validation{nameRequired,emailRequired,emailInvalid,subjectRequired,messageRequired}`; footer fields `bySubmitting`, `privacyPolicy`, `termsOfService`, `footerNote` (inlined at each usage site rather than via a `footer` object) |
| `Layout` | — | Remove `I18nProvider` import + the `<I18nProvider>` / `</I18nProvider>` wrap around `<Navbar/>{children}`. Leave `<html lang="en">`, Geist fonts, metadata unchanged. |

`LanguageSwitcher` is deleted, not rewritten.

## Delete list (exact)

- `lib/i18n/context.tsx`
- `lib/i18n/types.ts`
- `lib/i18n/useTranslation.ts`
- `lib/i18n/locales/en.json`
- `lib/i18n/locales/id.json`
- `lib/i18n/` directory (empty after above)
- `public/locales/en.json`
- `public/locales/id.json`
- `public/locales/` directory (empty after above)
- `components/ui/LanguageSwitcher.tsx`

Edits (not deletion):
- `app/layout.tsx` — drop `I18nProvider` import + wrap.
- `components/Navbar.tsx` — drop `LanguageSwitcher` import + usage; inline nav labels.
- The 8 other components listed above.

## Migration order (build stays green at each step)

The `I18nProvider` remains valid (no-op-ish) until every consumer stops calling `useTranslation`, so components are rewritten **before** the provider is removed. This keeps `tsc` green throughout.

1. Rewrite leaf components one at a time (provider still in place, harmless). Suggested order, smallest-first to build the pattern:
   `Hero` → `About` → `Experience` → `Projects` → `Skills` → `Education` → `Organization` → `Contact` → `Navbar`.
   After each, that file has no `t()` and no `useTranslation` import.
2. Delete `components/ui/LanguageSwitcher.tsx` (only `Navbar` imported it; `Navbar` no longer does after step 1).
3. Edit `app/layout.tsx`: remove `I18nProvider` import and the `<I18nProvider>` / `</I18nProvider>` wrapper tags.
4. Delete `lib/i18n/` and `public/locales/`.
5. Verify: `npx tsc --noEmit` then `npx next build`.

## Error handling / edge cases

- **Hydration mismatch risk:** the old `getInitialLanguage` read `localStorage` on the client, defaulting to `"en"` on SSR — a known hydration landmine. Removing it entirely eliminates the risk rather than patching it. No localStorage read remains.
- **Transcription risk:** the biggest arrays (`skills.technicalSkills` 4×8, `projects.items` 4×~15-line objects) are large enough that a hand-copy introduces a real chance of a dropped field or a typo. Mitigation: copy **verbatim** field-by-field from `en.json` EN section; no rewording, no "improvements"; rely on `tsc` (typed consts) + build + visual check to catch mismatches.
- **Dynamic key in `About`:** the only runtime-built translation key in the codebase. Replacing it with a `Record<string, {label, desc}>` keyed on the four known `skill.key` values eliminates the dynamic lookup and keeps the four cards rendering the same strings. If a fifth key were ever added later, TS would error at the lookup site — acceptable, better than silent fallback.
- **Footer block in `Contact`:** inlined at each usage site (`{bySubmitting}`, `{privacyPolicy}`, `{termsOfService}`, `{footerNote}`) rather than kept as a `footer` object. Indirection removed; values identical.
- **Dead sections dropped:** `language.*`, `footer.copyright`, `footer.builtWith`, and per-section extras (`projects.featured`, `projects.period`, `projects.technologies`, `projects.points`, `education.degree`, `education.university`, `education.gpa`, `education.thesis`, `education.graduation`, `contact.email`, `contact.phone`, `contact.location`, `contact.locationValue`, `contact.availability`, `contact.linkedin`, `contact.github`, `organization.role`, `organization.period`) are present in `en.json` but never read by any component — confirmed by grepping direct `t("...")` call sites; `Contact` renders the `contactInfo[]` array instead of these scalars. They are not transcribed. This is intentional, not an omission.

## Testing

No test framework in the project (`package.json` has `dev`/`build`/`start`/`lint` only). Verification:

1. `npx tsc --noEmit` — no dangling `i18n` imports, no missing fields on typed inline consts, no `useTranslation` outside a provider (there is no provider).
2. `npx next build` — production build succeeds; no missing-module errors for deleted files.
3. Manual eyeball (run `npm run dev`): every section renders English; nav has 5 links and no language dropdown; HTML source has no `language-select`; DevTools console clean (no "useTranslation must be used within an I18nProvider"); no hydration warning.

**Ponytail ceiling:** transcription is the dominant risk on arrays ~200 lines combined. The mitigation is verbatim copy + `tsc`, not unit tests — adding a test fixture for static content would be more code than the content it guards. If content drift becomes a recurring concern later (it won't — it's static), introduce a single source-of-truth module then.

## Files touched summary

- **Rewrite (9):** `Hero.tsx`, `About.tsx`, `Experience.tsx`, `Projects.tsx`, `Skills.tsx`, `Education.tsx`, `Organization.tsx`, `Contact.tsx`, `Navbar.tsx`
- **Edit (1):** `app/layout.tsx`
- **Delete (10 files + 3 dirs):** `components/ui/LanguageSwitcher.tsx`, `lib/i18n/{context,types,useTranslation}.tsx`, `lib/i18n/locales/{en,id}.json`, `public/locales/{en,id}.json`, `lib/i18n/`, `public/locales/`

## Non-goals reaffirmed

Not adding new content, not rewording content, not extracting a data module, not touching config semantics, not adding tests, not touching `<html lang>`/metadata. The smallest diff that erases the i18n layer without leaving dead code.
