# Particle Network Hero Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's Three.js glass-shapes background with an interactive 2D canvas particle-network background, keeping all existing hero content.

**Architecture:** A single self-contained `"use client"` component (`components/ParticleBackground.tsx`) owns a full-bleed `<canvas>` and all particle logic inside one `useEffect`. It is dynamically imported (`ssr: false`) into `Hero.tsx` in place of `ThreeBackground`. Built in three layers: (1) static multi-colored particles mounted into the hero, (2) motion + connecting lines + mouse interaction, (3) accessibility (reduced-motion) and off-screen performance (IntersectionObserver).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Canvas 2D API. No new dependencies.

## Global Constraints

- Site is **dark-mode only** (the `dark` class is hardcoded in `app/layout.tsx`). No light-mode handling.
- Particle colors are exactly these brand hexes: `#6366f1` (indigo), `#8b5cf6` (violet), `#ec4899` (pink).
- Connecting-line color is soft violet `rgba(160, 130, 220, <opacity>)`; lines near the cursor brighten to `rgba(255, 255, 255, <opacity>)`.
- Canvas must be **transparent** — clear each frame with `ctx.clearRect(...)`. Never paint a solid background (`fillRect` with black is forbidden; it would occlude the hero's gradient glow).
- Hard cap of **150 particles**; count otherwise derived from viewport area as `floor((w*h)/9000)`.
- Render at **DPR 1** — size the canvas backing store to CSS pixels (`canvas.width = window.innerWidth`, `canvas.height = window.innerHeight`).
- The mouse-repel radius is `200`px.
- Do **not** remove `three` / `@react-three/fiber` / `@react-three/drei` from `package.json`.
- The `useEffect` cleanup must cancel any animation frame, disconnect the observer, and remove every event listener it added.
- Existing hero content in `Hero.tsx` (badge, `MatrixText` name, subtitle, CTA buttons, scroll indicator) and the radial-gradient + noise overlays are unchanged.
- No unit-test runner exists in this repo. Verify each task with `npx tsc --noEmit`, `npm run lint`, and manual visual inspection via `npm run dev` — the same manual-verification convention used elsewhere in this codebase.

---

## File Structure

- **Create:** `components/ParticleBackground.tsx` — the entire particle-network background. One responsibility: render and animate the canvas. No props, no exports beyond the default component.
- **Modify:** `components/Hero.tsx` — swap the dynamically-imported background component (import + one JSX tag + one comment). Nothing else changes.
- **Delete:** `components/three/ThreeBackground.tsx` and the now-empty `components/three/` directory.

---

### Task 1: Static particle component mounted into the hero

Creates `ParticleBackground.tsx` rendering a transparent canvas of static multi-colored dots, wires it into `Hero.tsx` replacing `ThreeBackground`, and removes the old Three.js background. After this task the app runs with the new (still) background and is visually verifiable.

**Files:**
- Create: `components/ParticleBackground.tsx`
- Modify: `components/Hero.tsx` (import block lines ~11-14; JSX tag line ~75)
- Delete: `components/three/ThreeBackground.tsx` (+ empty `components/three/` dir)

**Interfaces:**
- Consumes: nothing.
- Produces: `export default function ParticleBackground(): JSX.Element` — a zero-prop client component. `Hero.tsx` imports it via `dynamic(() => import("@/components/ParticleBackground"), { ssr: false, loading: () => null })`.

- [ ] **Step 1: Create the static component file**

Create `components/ParticleBackground.tsx` with exactly:

```tsx
"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899"] as const;
const MAX_PARTICLES = 150;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    let particles: Particle[] = [];

    function init() {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 9000), MAX_PARTICLES);
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (width - size * 2) + size;
        const y = Math.random() * (height - size * 2) + size;
        const color =
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        particles.push(new Particle(x, y, size, color));
      }
    }

    function renderStatic() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) p.draw();
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
      renderStatic();
    }

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
```

- [ ] **Step 2: Swap the dynamic import in `Hero.tsx`**

In `components/Hero.tsx`, replace this block (currently lines ~11-14):

```tsx
const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), {
  ssr: false,
  loading: () => null,
});
```

with:

```tsx
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
  ssr: false,
  loading: () => null,
});
```

- [ ] **Step 3: Swap the JSX tag in `Hero.tsx`**

In `components/Hero.tsx`, replace (currently lines ~74-75):

```tsx
      {/* 3D Background */}
      <ThreeBackground />
```

with:

```tsx
      {/* Particle network background */}
      <ParticleBackground />
```

- [ ] **Step 4: Delete the old Three.js background**

Run:

```bash
git rm components/three/ThreeBackground.tsx
rmdir components/three 2>/dev/null || true
```

Expected: `ThreeBackground.tsx` removed; `components/three/` gone (it held only that file).

- [ ] **Step 5: Confirm nothing else imports ThreeBackground**

Run:

```bash
grep -rn "ThreeBackground" app components 2>/dev/null
```

Expected: no output.

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 7: Lint**

Run: `npm run lint`
Expected: no errors for `components/ParticleBackground.tsx` or `components/Hero.tsx`.

- [ ] **Step 8: Visual check**

Run `npm run dev`, open the site. Expected: hero shows scattered indigo/violet/pink dots on the dark background; name/subtitle/badge/CTAs render on top; no black rectangle occluding the gradient glow; resizing the window re-scatters the dots. Stop the dev server when done.

- [ ] **Step 9: Commit**

```bash
git add components/ParticleBackground.tsx components/Hero.tsx
git commit -m "feat: replace Three.js hero background with static particle canvas"
```

---

### Task 2: Motion, connecting lines, and mouse interaction

Turns the static field into a live network: particles drift and bounce off edges, nearby particles are joined by distance-faded soft-violet lines, and the cursor repels particles and brightens nearby lines to white.

**Files:**
- Modify: `components/ParticleBackground.tsx` (replace entire file)

**Interfaces:**
- Consumes: the Task 1 component shape (default export, `canvasRef`, the effect scaffold).
- Produces: same default export signature (no API change). Internally adds `Particle.vx/vy/update()`, a module-effect `mouse` object, and `connect()` / `animate()` / `start()` / `stop()` functions used by Task 3.

- [ ] **Step 1: Replace the whole component with the animated version**

Replace the entire contents of `components/ParticleBackground.tsx` with:

```tsx
"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899"] as const;
const MAX_PARTICLES = 150;
const CONNECT_DISTANCE_DIVISOR = 7;
const MOUSE_RADIUS = 200;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId: number | null = null;
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      constructor(
        x: number,
        y: number,
        vx: number,
        vy: number,
        size: number,
        color: string
      ) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > width || this.x < 0) this.vx = -this.vx;
        if (this.y > height || this.y < 0) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < MOUSE_RADIUS + this.size && distance > 0) {
            const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
            this.x -= (dx / distance) * force * 5;
            this.y -= (dy / distance) * force * 5;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.draw();
      }
    }

    let particles: Particle[] = [];

    function init() {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 9000), MAX_PARTICLES);
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (width - size * 2) + size;
        const y = Math.random() * (height - size * 2) + size;
        const vx = Math.random() * 0.4 - 0.2;
        const vy = Math.random() * 0.4 - 0.2;
        const color =
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        particles.push(new Particle(x, y, vx, vy, size, color));
      }
    }

    function connect() {
      const threshold =
        (width / CONNECT_DISTANCE_DIVISOR) * (height / CONNECT_DISTANCE_DIVISOR);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq >= threshold) continue;

          const opacity = 1 - distanceSq / 20000;
          if (opacity <= 0) continue;

          let nearCursor = false;
          if (mouse.x !== null && mouse.y !== null) {
            const mdx = particles[a].x - mouse.x;
            const mdy = particles[a].y - mouse.y;
            nearCursor = Math.sqrt(mdx * mdx + mdy * mdy) < MOUSE_RADIUS;
          }

          ctx.strokeStyle = nearCursor
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(160, 130, 220, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) p.update();
      connect();
      rafId = requestAnimationFrame(animate);
    }

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(animate);
    }

    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function handleMouseOut() {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    resize();
    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors for `components/ParticleBackground.tsx`.

- [ ] **Step 4: Visual check**

Run `npm run dev`, open the site. Expected: dots drift slowly and bounce off the viewport edges; nearby dots are joined by faint violet lines that fade with distance; moving the mouse pushes nearby dots away and turns nearby lines white. Hero content still renders and the `#contact` / CV buttons still work. Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add components/ParticleBackground.tsx
git commit -m "feat: add motion, connecting lines, and mouse interaction to particle bg"
```

---

### Task 3: Reduced-motion accessibility and off-screen performance

Adds two guards to the same effect: honor `prefers-reduced-motion` by drawing one static frame instead of animating, and pause/resume the animation loop via `IntersectionObserver` when the hero scrolls out of / into view.

**Files:**
- Modify: `components/ParticleBackground.tsx` (targeted edits)

**Interfaces:**
- Consumes: Task 2's `start()`, `stop()`, `resize()`, `connect()`, `Particle.draw()`, and the `canvas` / `ctx` / `width` / `height` closure vars.
- Produces: same default export signature. Adds a `reducedMotion` boolean, a `renderStatic()` function, and an `IntersectionObserver`.

- [ ] **Step 1: Add the reduced-motion flag**

In `components/ParticleBackground.tsx`, immediately after:

```tsx
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };
```

add:

```tsx
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
```

- [ ] **Step 2: Add a `renderStatic()` function**

In `components/ParticleBackground.tsx`, insert this function immediately before `function animate() {`:

```tsx
    function renderStatic() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) p.draw();
      connect();
    }

```

- [ ] **Step 3: Branch `start()` on reduced motion**

In `components/ParticleBackground.tsx`, replace:

```tsx
    function start() {
      if (rafId === null) rafId = requestAnimationFrame(animate);
    }
```

with:

```tsx
    function start() {
      if (reducedMotion) {
        renderStatic();
        return;
      }
      if (rafId === null) rafId = requestAnimationFrame(animate);
    }
```

- [ ] **Step 4: Draw a static frame on resize under reduced motion**

In `components/ParticleBackground.tsx`, replace the `resize` function:

```tsx
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    }
```

with:

```tsx
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
      if (reducedMotion) renderStatic();
    }
```

- [ ] **Step 5: Add the IntersectionObserver and swap the initial `start()`**

In `components/ParticleBackground.tsx`, replace this tail block:

```tsx
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    resize();
    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
```

with:

```tsx
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 }
    );

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    resize();
    observer.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 7: Lint**

Run: `npm run lint`
Expected: no errors for `components/ParticleBackground.tsx`.

- [ ] **Step 8: Visual check — normal motion**

Run `npm run dev`. Expected: particles animate as in Task 2. Scroll down so the hero leaves the viewport, then back up — the animation is still smooth (loop paused while off-screen and resumed). Stop the dev server.

- [ ] **Step 9: Visual check — reduced motion**

Enable "Reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion) and reload. Expected: a single static frame of dots + lines, no animation, no cursor-driven movement. Disable it again afterward. Stop the dev server.

- [ ] **Step 10: Commit**

```bash
git add components/ParticleBackground.tsx
git commit -m "feat: honor reduced-motion and pause particle bg when off-screen"
```

---

## Self-Review

**Spec coverage:**
- New `components/ParticleBackground.tsx` → Task 1 (creation) + Tasks 2-3 (behavior). ✓
- `Hero.tsx` dynamic-import swap (`ssr: false`) + JSX tag → Task 1 Steps 2-3. ✓
- Delete `ThreeBackground.tsx` + empty dir → Task 1 Step 4. ✓
- Multi-color particles from brand palette → Task 1 `PARTICLE_COLORS` / `init()`. ✓
- Soft-violet connecting lines, white near cursor, distance-faded → Task 2 `connect()`. ✓
- Drift + edge bounce → Task 2 `Particle.update()`. ✓
- Mouse repel within 200px → Task 2 `Particle.update()` + `MOUSE_RADIUS`. ✓
- Transparent canvas via `clearRect` (no black fill) → Task 1 `renderStatic()`, Task 2 `animate()`. ✓
- `prefers-reduced-motion` static frame → Task 3 Steps 1-4. ✓
- Off-screen pause via IntersectionObserver → Task 3 Step 5. ✓
- Particle cap 150 → Task 1 `MAX_PARTICLES`. ✓
- DPR clamp to 1 (canvas sized to CSS px) → Task 1/2 `resize()`. ✓
- Resize re-init → Task 1/2 `resize()`. ✓
- Full cleanup (raf + observer + listeners) → Task 3 Step 5 return block. ✓
- Keep `three` packages → not touched by any task. ✓
- Hero content/overlays unchanged → Task 1 touches only the import + one tag + one comment. ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"/"similar to Task N". All code shown in full. ✓

**Type consistency:** `start()`/`stop()`/`resize()`/`connect()`/`animate()`/`renderStatic()`/`init()` and `Particle` fields (`x,y,vx,vy,size,color`) are named identically across Tasks 2-3. `rafId: number | null`, `mouse: { x: number | null; y: number | null }`, and `reducedMotion: boolean` are consistent. Task 3 edits reference only symbols defined in Task 2. ✓
