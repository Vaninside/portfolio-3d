# Todo: Portfolio 3D Premium — Evan Rafif Pradana

## Phase 1: Foundation

- [x] **Task 1: Init Next.js Project**
  - Init Next.js 14 with TypeScript + Tailwind
  - Install dependencies: framer-motion, animejs, three, @react-three/fiber, @react-three/drei, next-themes, lucide-react, clsx, tailwind-merge
  - Setup folder structure
  - Acceptance: `npm run dev` jalan, `npm run build` pass

- [x] **Task 2: shadcn/ui + Tailwind Config**
  - Init shadcn/ui (`npx shadcn init`)
  - Setup `components.json`
  - Add base components: Button, Card, Badge
  - Tailwind config: custom colors, fonts, dark mode via class
  - Setup globals.css dengan dark mode variables
  - Acceptance: shadcn components ter-render, dark mode class work

- [x] **Task 3: Layout + Navbar**
  - Root layout dengan metadata + fonts (Inter/Plus Jakarta Sans)
  - Navbar: transparent di hero → solid bg pas scroll
  - Navbar: links smooth scroll ke tiap section
  - Dark mode toggle button di navbar
  - Acceptance: navbar muncul, scroll effect jalan, toggle dark mode work

### ✅ Checkpoint Phase 1
- [x] `npm run dev` no errors
- [x] Build pass
- [x] Dark mode toggle works

## Phase 2: 3D & Hero

- [x] **Task 4: 3D Components**
  - `FloatingShape.tsx` — 3D geometric object (torus, icosahedron, dll)
  - `Scene.tsx` — Three.js scene wrapper
  - Dynamic import biar ga SSR error
  - Acceptance: 3D object render di browser

- [x] **Task 5: Hero Section**
  - Full-viewport hero with 3D background
  - Animated entrance: nama + title fade/slide up
  - CTA buttons: Download CV, Contact
  - Subtle particle atau floating geometry
  - Acceptance: 3D muncul, animasi smooth, responsive

### ✅ Checkpoint Phase 2
- [x] Hero looks premium
- [x] 3D renders without console errors
- [x] Mobile responsive

## Phase 3: Content Sections

- [x] **Task 6: About + Education**
  - About: professional summary + foto/profile placeholder
  - Education: card with GPA, thesis title
  - Scroll reveal animation (fade + translateY)
  - Acceptance: konten terisi, animasi reveal work

- [x] **Task 7: Experience + Organization**
  - Experience: timeline animasi (connector line fill on scroll)
  - Organization: card grid dengan stagger animation
  - Acceptance: timeline animasi mulus, cards muncul bergantian

- [x] **Task 8: Projects Section**
  - Project cards dengan 3D tilt effect (mouse follow rotate)
  - Hover: scale(1.02) + shadow + glow
  - Tech stack badges
  - Acceptance: 3D tilt work, hover effects halus

- [x] **Task 9: Skills + Contact**
  - Skills: categorized grid (Technical + Soft Skills)
  - Contact: email, LinkedIn, WhatsApp links dengan icon
  - Subtle entrance animation
  - Acceptance: semua link work, layout rapi

### ✅ Checkpoint Phase 3
- [x] Semua section terisi konten real
- [x] Scroll reveal animasi jalan semua
- [x] Responsive semua section
- [x] 3D tilt di projects work

## Phase 4: Polish

- [ ] **Task 10: Animasi Refinement**
  - Framer Motion: timing, easing, stagger delays di-tuning
  - anime.js: micro-interactions (button hover, icon pulse)
  - Scroll-triggered animasi konsisten antar section
  - Performance check: no layout shift, smooth 60fps
  - Acceptance: animasi terasa premium, tidak berlebihan

- [ ] **Task 11: Dark Mode Final**
  - Dark mode untuk semua komponen
  - Toggle icon (sun/moon) dengan animasi
  - Color scheme konsisten di light & dark
  - Acceptance: semua komponen proper di kedua mode

### ✅ Checkpoint Phase 4
- [ ] Animasi smooth tested
- [ ] Dark/light mode all good
- [ ] Build pass without warnings

## Phase 5: Deploy

- [ ] **Task 12: Deploy ke Vercel**
  - Build final: `npm run build`
  - Push ke GitHub
  - Connect Vercel ke repo
  - Deploy + domain config
  - Acceptance: live di Vercel, akses publik

### ✅ Final Checkpoint
- [ ] Live di Vercel
- [ ] Semua section kerja
- [ ] Responsive, animasi jalan
- [ ] Dark mode ok
- [ ] Siap dikirim ke recruiter