"use client";

import { animate, stagger, engine, type AnimationParams } from "animejs";

/**
 * Anime.js micro-interactions for subtle, performant UI feedback
 * Used alongside Framer Motion for hover/tap/focus micro-animations
 * All animations respect prefers-reduced-motion
 */

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Button hover/tap micro-interaction
 * Adds subtle scale + shadow + ripple effect
 */
export const animateButtonHover = (
  element: HTMLElement,
  type: "hover" | "tap" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const config: Record<"hover" | "tap" | "leave", AnimationParams> = {
    hover: { scale: 1.03, boxShadow: "0 12px 24px -8px rgba(99, 102, 241, 0.4)", duration: 200, easing: "easeOutQuad" },
    tap: { scale: 0.98, duration: 100, easing: "easeOutQuad" },
    leave: { scale: 1, boxShadow: "none", duration: 200, easing: "easeOutQuad" },
  };

  animate(element, config[type]);
};

/**
 * Icon pulse on hover - subtle scale bounce
 */
export const animateIconPulse = (
  element: HTMLElement,
  type: "hover" | "tap" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const config: Record<"hover" | "tap" | "leave", AnimationParams> = {
    hover: { scale: 1.15, rotate: 3, duration: 300, easing: "easeOutElastic(1, 0.6)" },
    tap: { scale: 0.9, duration: 80, easing: "easeOutQuad" },
    leave: { scale: 1, rotate: 0, duration: 250, easing: "easeOutQuad" },
  };

  animate(element, config[type]);
};

/**
 * Badge/chip hover - gentle scale
 */
export const animateBadgeHover = (
  element: HTMLElement,
  type: "hover" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const config: Record<"hover" | "leave", AnimationParams> = {
    hover: { scale: 1.06, duration: 200, easing: "easeOutQuad" },
    leave: { scale: 1, duration: 200, easing: "easeOutQuad" },
  };

  animate(element, config[type]);
};

/**
 * Card hover - subtle lift with shadow
 */
export const animateCardHover = (
  element: HTMLElement,
  type: "hover" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const config: Record<"hover" | "leave", AnimationParams> = {
    hover: { translateY: -4, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)", duration: 300, easing: "easeOutQuad" },
    leave: { translateY: 0, boxShadow: "none", duration: 300, easing: "easeOutQuad" },
  };

  animate(element, config[type]);
};

/**
 * Input focus ring animation
 */
export const animateInputFocus = (
  element: HTMLElement,
  focused: boolean
) => {
  if (prefersReducedMotion()) return;

  const borderEl = element.querySelector("[data-focus-ring]") as HTMLElement | null;
  if (!borderEl) return;

  animate(borderEl, {
    opacity: focused ? 1 : 0,
    scale: focused ? 1 : 0.95,
    duration: 200,
    easing: "easeOutQuad",
  });
};

/**
 * Social link hover - slide icon + color transition
 */
export const animateSocialHover = (
  element: HTMLElement,
  type: "hover" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const icon = element.querySelector("svg") as HTMLElement | null;
  const arrow = element.querySelector("[data-arrow]") as HTMLElement | null;

  if (type === "hover") {
    if (icon) animate(icon, { scale: 1.1, translateX: 2, duration: 200, easing: "easeOutQuad" });
    if (arrow) animate(arrow, { translateX: 4, opacity: 1, duration: 200, easing: "easeOutQuad" });
  } else {
    if (icon) animate(icon, { scale: 1, translateX: 0, duration: 200, easing: "easeOutQuad" });
    if (arrow) animate(arrow, { translateX: 0, opacity: 0.5, duration: 200, easing: "easeOutQuad" });
  }
};

/**
 * Nav link hover - underline slide
 */
export const animateNavLink = (
  element: HTMLElement,
  type: "hover" | "active" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const underline = element.querySelector("[data-underline]") as HTMLElement | null;
  if (!underline) return;

  const config: Record<"hover" | "active" | "leave", AnimationParams> = {
    hover: { scaleX: 1, opacity: 1, duration: 250, easing: "easeOutQuad" },
    active: { scaleX: 1, opacity: 1, duration: 0, easing: "linear" },
    leave: { scaleX: 0, opacity: 0.5, duration: 250, easing: "easeOutQuad" },
  };

  animate(underline, { transformOrigin: "left center", ...config[type] });
};

/**
 * Theme toggle icon morph (sun/moon rotate + scale)
 */
export const animateThemeToggle = (
  element: HTMLElement,
  isDark: boolean
) => {
  if (prefersReducedMotion()) return;

  animate(element, {
    rotate: isDark ? 180 : 0,
    scale: [1, 0.8, 1],
    duration: 400,
    easing: "easeOutElastic(1, 0.5)",
  });
};

/**
 * Floating badge pulse (hero section live indicator)
 */
export const animateBadgePulse = (element: HTMLElement) => {
  if (prefersReducedMotion()) return;

  const ring = element.querySelector("[data-pulse-ring]") as HTMLElement | null;
  const dot = element.querySelector("[data-pulse-dot]") as HTMLElement | null;

  if (ring) {
    animate(ring, {
      scale: [0, 1.5],
      opacity: [0.7, 0],
      duration: 2000,
      loop: true,
      easing: "easeOutQuad",
    });
  }
  if (dot) {
    animate(dot, {
      scale: [1, 1.3, 1],
      duration: 2000,
      loop: true,
      easing: "easeInOutQuad",
    });
  }
};

/**
 * Skill/item dot pulse (Skills section)
 */
export const animateSkillDot = (element: HTMLElement, delay = 0) => {
  if (prefersReducedMotion()) return;

  const outer = element.querySelector("[data-skill-outer]") as HTMLElement | null;
  const inner = element.querySelector("[data-skill-inner]") as HTMLElement | null;

  if (outer) {
    animate(outer, {
      scale: [1, 1.1, 1],
      duration: 1500,
      delay,
      loop: true,
      easing: "easeInOutQuad",
    });
  }
  if (inner) {
    animate(inner, {
      scale: [1, 1.4, 1],
      duration: 1500,
      delay,
      loop: true,
      easing: "easeInOutQuad",
    });
  }
};

/**
 * Timeline dot pulse (Experience section)
 */
export const animateTimelineDot = (element: HTMLElement, delay = 0) => {
  if (prefersReducedMotion()) return;

  animate(element, {
    scale: [1, 1.2, 1],
    boxShadow: [
      "0 0 0 0 rgba(99, 102, 241, 0.4)",
      "0 0 0 8px rgba(99, 102, 241, 0)",
      "0 0 0 0 rgba(99, 102, 241, 0.4)",
    ],
    duration: 2000,
    delay,
    loop: true,
    easing: "easeInOutQuad",
  });
};

/**
 * Cleanup all anime animations on page unload or component unmount
 */
export const killAllAnimations = () => {
  let anim = engine._head;
  while (anim) {
    const next = anim._next;
    (anim as { pause?: () => void }).pause?.();
    anim = next;
  }
};

/**
 * Stagger entrance for a list of elements (anime.js alternative to FM stagger)
 */
export const staggerEntrance = (
  elements: HTMLElement[],
  options: {
    translateY?: number;
    delay?: number;
    stagger?: number;
    duration?: number;
    easing?: string;
  } = {}
) => {
  if (prefersReducedMotion() || elements.length === 0) return;

  const {
    translateY = 20,
    delay = 100,
    stagger: staggerMs = 40,
    duration = 500,
    easing = "easeOutQuad",
  } = options;

  animate(elements, {
    opacity: [0, 1],
    translateY: [translateY, 0],
    delay: stagger(staggerMs, { start: delay }),
    duration,
    easing,
  });
};

/**
 * ========================================
 * CURSOR FOLLOWER EFFECTS
 * ========================================
 * Using animejs v4 for reactive cursor tracking
 */

/**
 * Cursor follower with trail - creates a smooth trailing cursor dot
 * Usage: const cleanup = createCursorFollower({ color: '#6366f1', size: 12, trailLength: 5 })
 */
interface CursorFollowerOptions {
  color?: string;
  size?: number;
  trailLength?: number;
}

export const createCursorFollower = (options: CursorFollowerOptions = {}) => {
  if (prefersReducedMotion() || typeof window === "undefined") return () => {};

  const {
    color = "#6366f1",
    size = 12,
    trailLength = 5,
  } = options;

  // Create cursor element
  const cursor = document.createElement("div");
  cursor.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${color};
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;
  document.body.appendChild(cursor);

  // Create trail elements
  const trail: HTMLElement[] = [];
  for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement("div");
    const dotSize = size * (1 - i / trailLength) * 0.5;
    dot.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${dotSize}px;
      height: ${dotSize}px;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      z-index: ${9998 - i};
      transform: translate(-50%, -50%);
      opacity: ${0.6 - i * 0.1};
      mix-blend-mode: difference;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  // Current and target positions
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let isVisible = false;

  const handleMouseMove = (e: MouseEvent) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!isVisible) {
      cursor.style.opacity = "1";
      isVisible = true;
    }
  };

  const handleMouseLeave = () => {
    cursor.style.opacity = "0";
  };

  // Animation loop using simple spring interpolation
  let rafId: number;
  const animateCursor = () => {
    // Spring interpolation (easeOutQuart feeling)
    const spring = 0.15;
    currentX += (targetX - currentX) * spring;
    currentY += (targetY - currentY) * spring;

    // Apply to main cursor
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;

    // Apply to trail with delay using setTimeout queue
    trail.forEach((dot, i) => {
      const delay = (i + 1) * 15;
      setTimeout(() => {
        dot.style.left = `${currentX}px`;
        dot.style.top = `${currentY}px`;
      }, delay);
    });

    rafId = requestAnimationFrame(animateCursor);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseleave", handleMouseLeave);
  animateCursor();

  // Cleanup function
  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseleave", handleMouseLeave);
    cancelAnimationFrame(rafId);
    cursor.remove();
    trail.forEach((dot) => dot.remove());
  };
};

/**
 * Magnetic hover effect - elements attract cursor when nearby
 * Usage: const cleanup = createMagneticHover('.magnetic', { strength: 0.3, distance: 100 })
 */
interface MagneticHoverOptions {
  selector: string;
  strength?: number;      // 0-1, how strong the pull is
  distance?: number;      // px, max distance to start pulling
  easing?: string;
  duration?: number;
}

export const createMagneticHover = (options: MagneticHoverOptions) => {
  if (prefersReducedMotion() || typeof window === "undefined") return () => {};

  const {
    selector,
    strength = 0.3,
    distance = 100,
    easing = "easeOutElastic(1, 0.5)",
    duration = 400,
  } = options;

  const elements = document.querySelectorAll<HTMLElement>(selector);
  if (elements.length === 0) return () => {};

  const handlers: Array<{ el: HTMLElement; type: string; fn: (e: Event) => void }> = [];

  elements.forEach((el) => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);

      if (dist < distance) {
        const pullX = deltaX * strength * (1 - dist / distance);
        const pullY = deltaY * strength * (1 - dist / distance);

        animate(el, {
          translateX: pullX,
          translateY: pullY,
          duration,
          easing,
        });
      }
    };

    const handleMouseLeave = () => {
      animate(el, {
        translateX: 0,
        translateY: 0,
        duration: 500,
        easing: "easeOutElastic(1, 0.5)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove as EventListener);
    el.addEventListener("mouseleave", handleMouseLeave as EventListener);
    handlers.push({ el, type: "mousemove", fn: handleMouseMove as (e: Event) => void });
    handlers.push({ el, type: "mouseleave", fn: handleMouseLeave as (e: Event) => void });
  });

  return () => {
    handlers.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  };
};

/**
 * Cursor glow/ripple on click - creates expanding ripple at click position
 * Usage: const cleanup = createClickRipple({ color: '#6366f1', maxSize: 300 })
 */
interface ClickRippleOptions {
  color?: string;
  maxSize?: number;
  duration?: number;
}

export const createClickRipple = (options: ClickRippleOptions = {}) => {
  if (prefersReducedMotion() || typeof window === "undefined") return () => {};

  const { color = "#6366f1", maxSize = 300, duration = 600 } = options;

  const handleClick = (e: MouseEvent) => {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: ${color};
      opacity: 0.3;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(ripple);

    animate(ripple, {
      width: maxSize,
      height: maxSize,
      opacity: [0.3, 0],
      duration,
      easing: "easeOutQuad",
      complete: () => ripple.remove(),
    });
  };

  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
};

/**
 * Text scramble effect - great for hero titles
 * Usage: const cleanup = createTextScramble('.hero-title', { text: 'New Text', duration: 1000 })
 */
interface TextScrambleOptions {
  selector: string;
  text?: string;
  chars?: string;
  duration?: number;
  delay?: number;
  easing?: string;
  loop?: boolean;
  interval?: number;
}

export const createTextScramble = (options: TextScrambleOptions) => {
  if (prefersReducedMotion() || typeof window === "undefined") return () => {};

  const {
    selector,
    text,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
    duration = 1000,
    loop = false,
    interval = 3000,
  } = options;

  const elements = document.querySelectorAll<HTMLElement>(selector);
  if (elements.length === 0) return () => {};

  const originalTexts = Array.from(elements).map((el) => el.textContent || "");

  const scramble = (el: HTMLElement, targetText: string) => {
    const length = targetText.length;
    let progress = 0;

    const animateFrame = () => {
      progress += 1 / (duration / 16);
      if (progress > 1) progress = 1;

      let result = "";
      for (let i = 0; i < length; i++) {
        if (i / length < progress) {
          result += targetText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = result;

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      }
    };
    animateFrame();
  };

  let intervalId: ReturnType<typeof setInterval>;
  const run = () => {
    elements.forEach((el, i) => {
      const target = text || originalTexts[i];
      setTimeout(() => scramble(el, target), i * 100);
    });
  };

  run();
  if (loop) {
    intervalId = setInterval(run, interval);
  }

  return () => {
    if (intervalId) clearInterval(intervalId);
    elements.forEach((el, i) => {
      el.textContent = originalTexts[i];
    });
  };
};