"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MatrixText } from "@/components/ui/MatrixText";

const MIN_DISPLAY_MS = 1400;
const SAFETY_MS = 2500;

// Premium motion curves (GPU-friendly: opacity + transform only).
// Cinematic dissolve on exit; snappy ease-out for the content entrance.
const EASE_EXIT: [number, number, number, number] = [0.65, 0, 0.35, 1];
const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mountedAt = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - mountedAt;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const safety = window.setTimeout(finish, SAFETY_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(safety);
    };
  }, []);

  // Lock scroll while the preloader is visible; restore prior overflow on unmount.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.04 }}
          transition={{
            duration: reducedMotion ? 0 : 0.7,
            ease: EASE_EXIT,
          }}
          aria-label="Loading"
          role="status"
        >
          <motion.div
            className="flex flex-col items-center justify-center gap-10 sm:gap-12"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.5,
              ease: EASE_ENTER,
              delay: reducedMotion ? 0 : 0.1,
            }}
          >
            <div className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              <MatrixText
                text="Evan Rafif Pradana"
                fontSize="text-3xl sm:text-5xl"
                fontWeight="font-bold"
                fontFamily=""
                letterAnimationDuration={reducedMotion ? 0 : 500}
                letterInterval={reducedMotion ? 0 : 80}
                scrambleColor="#6366f1"
                matrixChars="01"
                loop={false}
                initialDelay={0}
              />
            </div>

            <div className="preloader-shapes flex items-center justify-center">
              <div className="loader">
                <svg viewBox="0 0 80 80">
                  <circle r="32" cy="40" cx="40" />
                </svg>
              </div>
              <div className="loader triangle">
                <svg viewBox="0 0 86 80">
                  <polygon points="43 8 79 72 7 72" />
                </svg>
              </div>
              <div className="loader">
                <svg viewBox="0 0 80 80">
                  <rect height="64" width="64" y="8" x="8" />
                </svg>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            .loader {
              display: inline-block;
              width: 56px;
              height: 56px;
              margin: 10px;
            }
            .loader :global(svg) {
              width: 100%;
              height: 100%;
            }
            .loader :global(circle),
            .loader :global(rect),
            .loader :global(polygon) {
              fill: none;
              stroke: #fff;
              stroke-width: 3;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .loader :global(circle) {
              stroke-dasharray: 50 200;
              animation: preloader-path-circle 4s linear infinite;
            }
            .loader.triangle :global(polygon) {
              stroke-dasharray: 74 500;
              animation: preloader-path-triangle 4s linear infinite;
            }
            .loader :global(rect) {
              stroke-dasharray: 64 300;
              animation: preloader-path-rect 4s linear infinite;
            }
            @keyframes preloader-path-circle {
              25% {
                stroke-dashoffset: 125;
              }
              50% {
                stroke-dashoffset: 175;
              }
              75% {
                stroke-dashoffset: 225;
              }
              100% {
                stroke-dashoffset: 275;
              }
            }
            @keyframes preloader-path-triangle {
              33% {
                stroke-dashoffset: 74;
              }
              66% {
                stroke-dashoffset: 147;
              }
              100% {
                stroke-dashoffset: 221;
              }
            }
            @keyframes preloader-path-rect {
              25% {
                stroke-dashoffset: 64;
              }
              50% {
                stroke-dashoffset: 128;
              }
              75% {
                stroke-dashoffset: 192;
              }
              100% {
                stroke-dashoffset: 256;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .loader :global(circle),
              .loader.triangle :global(polygon),
              .loader :global(rect) {
                animation: none;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
