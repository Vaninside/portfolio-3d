"use client";

import { useEffect, useState } from "react";

/**
 * useTypewriter — drives a type → pause → delete → advance loop over a list of
 * words and returns the current partial string. Index wraps around forever.
 * When `reducedMotion` is true, returns the first word statically with no timers.
 */
export interface UseTypewriterOptions {
  /** Words to cycle through, in order. */
  words: string[];
  /** Delay between typed characters (ms). */
  typeSpeedMs?: number;
  /** Delay between deleted characters (ms). */
  deleteSpeedMs?: number;
  /** Hold time once a word is fully typed (ms). */
  pauseMs?: number;
  /** Pause after a word is fully deleted, before the next word types (ms). */
  startDelayMs?: number;
  /** When true, skip all animation and show the first word. */
  reducedMotion?: boolean;
}

type Phase = "typing" | "pausing" | "deleting";

export function useTypewriter({
  words,
  typeSpeedMs = 90,
  deleteSpeedMs = 45,
  pauseMs = 1400,
  startDelayMs = 400,
  reducedMotion = false,
}: UseTypewriterOptions): { text: string } {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    // Static cases (no words / reduced motion) are derived below — no timers.
    if (words.length === 0 || reducedMotion) {
      return;
    }

    let wordIndex = 0;
    let charCount = 0;
    let phase: Phase = "typing";
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = words[wordIndex];

      if (phase === "typing") {
        charCount++;
        setTyped(current.slice(0, charCount));
        if (charCount === current.length) {
          phase = "pausing";
          timer = setTimeout(tick, pauseMs);
        } else {
          timer = setTimeout(tick, typeSpeedMs);
        }
      } else if (phase === "pausing") {
        phase = "deleting";
        timer = setTimeout(tick, deleteSpeedMs);
      } else {
        charCount--;
        setTyped(current.slice(0, charCount));
        if (charCount === 0) {
          wordIndex = (wordIndex + 1) % words.length;
          phase = "typing";
          timer = setTimeout(tick, startDelayMs);
        } else {
          timer = setTimeout(tick, deleteSpeedMs);
        }
      }
    };

    timer = setTimeout(tick, typeSpeedMs);

    return () => clearTimeout(timer);
  }, [words, typeSpeedMs, deleteSpeedMs, pauseMs, startDelayMs, reducedMotion]);

  // Derive visible text: static for empty/reduced-motion, animated otherwise.
  const text = words.length === 0 ? "" : reducedMotion ? words[0] : typed;

  return { text };
}
