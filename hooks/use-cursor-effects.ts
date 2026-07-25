"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import {
  createCursorFollower,
  createMagneticHover,
  createClickRipple,
  createTextScramble,
  prefersReducedMotion,
} from "@/lib/micro-interactions";

/**
 * Hook for cursor follower (trailing dot effect)
 */
export const useCursorFollower = (options?: Parameters<typeof createCursorFollower>[0]) => {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const cleanup = createCursorFollower(optionsRef.current);
    return cleanup;
  }, []);
};

/**
 * Hook for magnetic hover effect on elements
 * Add className="magnetic" or custom selector to elements
 */
export const useMagneticHover = (
  selector: string = ".magnetic",
  options?: Omit<Parameters<typeof createMagneticHover>[0], "selector">
) => {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const cleanup = createMagneticHover({ selector, ...optionsRef.current });
    return cleanup;
  }, [selector]);
};

/**
 * Hook for click ripple effect
 */
export const useClickRipple = (options?: Parameters<typeof createClickRipple>[0]) => {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const cleanup = createClickRipple(optionsRef.current);
    return cleanup;
  }, []);
};

/**
 * Hook for text scramble effect
 */
export const useTextScramble = (
  selector: string,
  options?: Omit<Parameters<typeof createTextScramble>[0], "selector">
) => {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const cleanup = createTextScramble({ selector, ...optionsRef.current });
    return cleanup;
  }, [selector]);
};

/**
 * Combined hook for all cursor effects (convenience)
 */
export const useAllCursorEffects = () => {
  useCursorFollower();
  useMagneticHover();
  useClickRipple();
};

/**
 * Hook to apply magnetic effect to a specific element ref
 * Usage: const ref = useMagneticElement({ strength: 0.4 })
 * Then <div ref={ref} className="magnetic">...</div>
 */
export const useMagneticElement = (options?: Omit<Parameters<typeof createMagneticHover>[0], "selector">) => {
  const ref = useRef<HTMLElement>(null);
  const optionsRef = useRef(options);

  // Update ref in effect, not during render
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const el = ref.current;
    const { strength = 0.3, distance = 100, duration = 400 } = optionsRef.current || {};

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
          easing: "easeOutElastic(1, 0.5)",
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

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return ref;
};

/**
 * Hook for custom cursor style on specific elements
 * Usage: const ref = useCustomCursor('pointer')
 */
export const useCustomCursor = (cursorStyle: string = "pointer") => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.cursor = cursorStyle;
    return () => {
      el.style.cursor = "";
    };
  }, [cursorStyle]);

  return ref;
};