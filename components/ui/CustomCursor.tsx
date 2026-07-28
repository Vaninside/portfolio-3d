"use client";

import { useEffect, useRef } from "react";

/**
 * CustomCursor — a yasio-style cursor: a hollow ring that lags smoothly behind
 * the pointer plus a small solid dot that tracks it 1:1. White with
 * mix-blend-difference so it stays visible on any background. The OS cursor is
 * hidden while active. Disabled on touch/coarse-pointer devices and when the
 * user prefers reduced motion (the native cursor is left intact).
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only for fine pointers (mouse) and when motion is allowed.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Hide the native cursor while the custom one is active.
    const root = document.documentElement;
    const prevCursor = root.style.cursor;
    root.style.cursor = "none";

    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot tracks the pointer exactly.
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const onDown = () => ring.classList.add("cursor-ring--down");
    const onUp = () => ring.classList.remove("cursor-ring--down");

    const loop = () => {
      // Ring eases toward the pointer for a trailing feel.
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      root.style.cursor = prevCursor;
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <style jsx>{`
        .cursor-ring,
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          mix-blend-mode: difference;
          will-change: transform;
        }
        .cursor-ring {
          width: 36px;
          height: 36px;
          border: 1.5px solid #fff;
          border-radius: 50%;
          transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease,
            border-color 0.2s ease;
        }
        .cursor-ring.cursor-ring--down {
          width: 28px;
          height: 28px;
        }
        .cursor-dot {
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          transition: opacity 0.2s ease;
        }
      `}</style>
    </>
  );
}
