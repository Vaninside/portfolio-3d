"use client";

import { useReducedMotion } from "framer-motion";
import { useTypewriter } from "@/hooks/use-typewriter";
import { cn } from "@/lib/utils";

export interface TypewriterProps {
  /** Words to cycle through, in order. Pass a stable reference. */
  words: string[];
  /** Extra classes for the rotating-word span. */
  className?: string;
  typeSpeedMs?: number;
  deleteSpeedMs?: number;
  pauseMs?: number;
  startDelayMs?: number;
}

/**
 * Typewriter — types a rotating word in/out with a blinking cursor. The prefix
 * text lives in the parent; this renders only the animated word + cursor.
 * Screen readers get the full word list once via an sr-only span.
 */
export function Typewriter({
  words,
  className,
  typeSpeedMs,
  deleteSpeedMs,
  pauseMs,
  startDelayMs,
}: TypewriterProps) {
  const reducedMotion = useReducedMotion();
  const { text } = useTypewriter({
    words,
    typeSpeedMs,
    deleteSpeedMs,
    pauseMs,
    startDelayMs,
    reducedMotion: reducedMotion ?? false,
  });

  return (
    <span className={cn("text-primary font-semibold", className)}>
      <span aria-hidden="true">{text}</span>
      <span
        className={cn("typewriter-cursor", reducedMotion && "typewriter-cursor--static")}
        aria-hidden="true"
      >
        |
      </span>
      <span className="sr-only">{words.join(", ")}</span>
      <style jsx>{`
        .typewriter-cursor {
          margin-left: 1px;
          animation: typewriter-blink 1s steps(2, start) infinite;
        }
        .typewriter-cursor--static {
          animation: none;
          opacity: 1;
        }
        @keyframes typewriter-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .typewriter-cursor {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
