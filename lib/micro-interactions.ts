"use client";

import { animate, stagger, engine } from "animejs";

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

  const config = {
    hover: { scale: 1.03, boxShadow: "0 12px 24px -8px rgba(99, 102, 241, 0.4)", duration: 200, easing: "easeOutQuad" },
    tap: { scale: 0.98, duration: 100, easing: "easeOutQuad" },
    leave: { scale: 1, boxShadow: "none", duration: 200, easing: "easeOutQuad" },
  }[type];

  animate(element, config as any);
};

/**
 * Icon pulse on hover - subtle scale bounce
 */
export const animateIconPulse = (
  element: HTMLElement,
  type: "hover" | "tap" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const config = {
    hover: { scale: 1.15, rotate: 3, duration: 300, easing: "easeOutElastic(1, 0.6)" },
    tap: { scale: 0.9, duration: 80, easing: "easeOutQuad" },
    leave: { scale: 1, rotate: 0, duration: 250, easing: "easeOutQuad" },
  }[type];

  animate(element, config as any);
};

/**
 * Badge/chip hover - gentle scale
 */
export const animateBadgeHover = (
  element: HTMLElement,
  type: "hover" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const config = {
    hover: { scale: 1.06, duration: 200, easing: "easeOutQuad" },
    leave: { scale: 1, duration: 200, easing: "easeOutQuad" },
  }[type];

  animate(element, config as any);
};

/**
 * Card hover - subtle lift with shadow
 */
export const animateCardHover = (
  element: HTMLElement,
  type: "hover" | "leave"
) => {
  if (prefersReducedMotion()) return;

  const config = {
    hover: { translateY: -4, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)", duration: 300, easing: "easeOutQuad" },
    leave: { translateY: 0, boxShadow: "none", duration: 300, easing: "easeOutQuad" },
  }[type];

  animate(element, config as any);
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

  const config = {
    hover: { scaleX: 1, opacity: 1, duration: 250, easing: "easeOutQuad" },
    active: { scaleX: 1, opacity: 1, duration: 0, easing: "linear" },
    leave: { scaleX: 0, opacity: 0.5, duration: 250, easing: "easeOutQuad" },
  }[type];

  animate(underline, { transformOrigin: "left center", ...config });
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
    (anim as any).pause?.();
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