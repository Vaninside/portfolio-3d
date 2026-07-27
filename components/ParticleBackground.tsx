"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899"] as const;
const MAX_PARTICLES = 150;
const CONNECT_DISTANCE_DIVISOR = 7;
const MOUSE_RADIUS = 200;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // Non-null aliases: narrowing from the guards above is not preserved
    // inside the nested class/function closures below under strict mode.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    let width = 0;
    let height = 0;
    let rafId: number | null = null;
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

    function renderStatic() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) p.draw();
      connect();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) p.update();
      connect();
      rafId = requestAnimationFrame(animate);
    }

    function start() {
      if (reducedMotion) {
        renderStatic();
        return;
      }
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
      if (reducedMotion) renderStatic();
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
    // `mouseleave` on document fires only when the pointer truly leaves the
    // window, unlike `mouseout` which bubbles on inner-element boundaries.
    document.addEventListener("mouseleave", handleMouseOut);
    resize();
    // The canvas is fixed and full-page, so it stays visible through the whole
    // scroll. Keep the loop running continuously so particles never freeze
    // behind the lower sections; the browser throttles rAF while the tab is
    // hidden, so there is no cost when the page is not on screen.
    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseOut);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
