# Implementation Plan: Portfolio 3D Premium — Evan Rafif Pradana

## Overview
Portfolio website pribadi premium dengan 3D elements, animasi smooth, dark mode, dan tampilan setara website tech besar (Apple/atigravity). Single-page app dengan Next.js 14 + Tailwind + shadcn/ui + Framer Motion + Three.js.

## Architecture Decisions
- **Static site** — tanpa backend/database, deploy Vercel
- **Single page** — semua section di page.tsx, navigasi smooth scroll
- **3D hanya di client** — Three.js components pakai `"use client"` + dynamic import
- **Dark mode** — next-themes + Tailwind dark variant
- **Animasi** — Framer Motion untuk scroll reveal + stagger, anime.js untuk micro-interactions
- **Skiper UI + shadcn/ui** — base components yang reusable

## Dependency Graph
```
Project Init (Next.js + Tailwind)
    │
    ├── shadcn/ui setup
    ├── Dependencies (Framer Motion, Three.js, anime.js, dll)
    │
    └── Layout + Navbar (global wrapper)
            │
            ├── Hero (3D + animasi)
            ├── About (scroll reveal)
            ├── Experience (timeline animasi)
            ├── Organization (card stagger)
            ├── Projects (3D tilt cards)
            ├── Skills (grid animasi)
            ├── Education (card)
            ├── Contact (footer)
            │
            └── Dark mode toggle — global state
```

## Task List

### Phase 1: Foundation
- [ ] Task 1: Init Next.js project + dependencies
- [ ] Task 2: Konfigurasi Tailwind + shadcn/ui + dark mode setup
- [ ] Task 3: Layout global + Navbar (transparant→solid)

### Checkpoint: Foundation
- [ ] `npm run dev` jalan tanpa error
- [ ] Navbar muncul, dark mode toggle visible
- [ ] Build pass

### Phase 2: 3D & Hero
- [ ] Task 4: 3D Components (FloatingShape, dll)
- [ ] Task 5: Hero section (3D + animasi entrance)

### Checkpoint: Hero
- [ ] 3D object muncul di hero
- [ ] Animasi entrance smooth
- [ ] Hero responsive

### Phase 3: Content Sections
- [ ] Task 6: About + Education section
- [ ] Task 7: Experience + Organization (timeline)
- [ ] Task 8: Projects section (3D tilt cards)
- [ ] Task 9: Skills + Contact section

### Checkpoint: Content
- [ ] Semua konten terisi
- [ ] Scroll reveal animasi jalan
- [ ] Responsive semua section

### Phase 4: Polish
- [ ] Task 10: Animasi refinement + micro-interactions
- [ ] Task 11: Dark mode finalisasi

### Phase 5: Deploy
- [ ] Task 12: Build test + deploy ke Vercel

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| 3D terlalu berat | Medium | Lazy load Three.js, fallback untuk low-end device |
| Animasi glitch/not smooth | Medium | Test di berbagai browser, pakai will-change CSS |
| Konflik library animasi | Low | Framer Motion untuk scroll, anime.js untuk micro saja |
| Build error Three.js di server | High | Dynamic import + "use client" + suppressHydrationWarning |

## Open Questions
- (resolved saat interview)