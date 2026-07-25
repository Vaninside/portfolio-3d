"use client";

/**
 * MatrixText - Matrix-style text scramble effect
 * Inspired by @kokonutui/matrix-text
 * Letters scramble through binary characters before revealing the actual text
 */

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LetterState {
  char: string;
  isMatrix: boolean;
  isSpace: boolean;
}

interface MatrixTextProps {
  /** Text to display */
  text?: string;
  /** Additional CSS classes */
  className?: string;
  /** Delay before animation starts (ms) */
  initialDelay?: number;
  /** Duration each letter stays in matrix mode (ms) */
  letterAnimationDuration?: number;
  /** Delay between each letter animation (ms) */
  letterInterval?: number;
  /** Whether to loop the animation */
  loop?: boolean;
  /** Time between loops (ms) */
  loopInterval?: number;
  /** Characters to use for matrix effect */
  matrixChars?: string;
  /** Color when scrambling (default: primary) */
  scrambleColor?: string;
  /** Font size classes */
  fontSize?: string;
  /** Font weight */
  fontWeight?: string;
  /** Custom font family */
  fontFamily?: string;
}

const DEFAULT_MATRIX_CHARS = "01";

export function MatrixText({
  text = "Hello World!",
  className,
  initialDelay = 200,
  letterAnimationDuration = 500,
  letterInterval = 80,
  loop = false,
  loopInterval = 3000,
  matrixChars = DEFAULT_MATRIX_CHARS,
  scrambleColor = "#22c55e",
  fontSize = "text-4xl md:text-6xl lg:text-7xl",
  fontWeight = "font-bold",
  fontFamily = "font-mono",
}: MatrixTextProps) {
  const reducedMotion = useReducedMotion();
  const animationFrameRef = useRef<Record<number, number>>({});
  const isAnimatingRef = useRef(false);
  const startAnimationRef = useRef<() => void>(() => {});
  const textRef = useRef(text);
  const reducedMotionRef = useRef(reducedMotion);
  const getLettersFromTextRef = useRef<((t: string) => LetterState[]) | null>(null);

  // Sync refs in effect (not during render)
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  // Generate letters from text (pure function) - store in ref
  const getLettersFromText = useCallback((t: string): LetterState[] => {
    return t.split("").map((char) => ({
      char,
      isMatrix: false,
      isSpace: char === " ",
    }));
  }, []);

  // Update ref when function changes (stable reference)
  useEffect(() => {
    getLettersFromTextRef.current = getLettersFromText;
  }, [getLettersFromText]);

  // Letters state - initialize from text
  const [letters, setLetters] = useState<LetterState[]>(() =>
    getLettersFromText(text)
  );

  const getRandomChar = useCallback(
    () => matrixChars[Math.floor(Math.random() * matrixChars.length)],
    [matrixChars]
  );

  const animateLetter = useCallback(
    (index: number) => {
      if (index >= textRef.current.length) return;

      // Clear any existing frame for this index
      if (animationFrameRef.current[index]) {
        cancelAnimationFrame(animationFrameRef.current[index]);
      }

      const frameId = requestAnimationFrame(() => {
        setLetters((prev) => {
          const newLetters = [...prev];
          if (!newLetters[index]?.isSpace) {
            newLetters[index] = {
              ...newLetters[index],
              char: getRandomChar(),
              isMatrix: true,
            };
          }
          return newLetters;
        });

        // Switch back to real character after duration
        setTimeout(() => {
          setLetters((prev) => {
            const newLetters = [...prev];
            newLetters[index] = {
              ...newLetters[index],
              char: textRef.current[index] ?? "",
              isMatrix: false,
            };
            return newLetters;
          });
        }, letterAnimationDuration);
      });

      animationFrameRef.current[index] = frameId;
    },
    [getRandomChar, letterAnimationDuration]
  );

  // Start animation - use refs for stable reference
  const startAnimation = useCallback(() => {
    const runAnimation = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const totalDuration = initialDelay + textRef.current.length * letterInterval;

      textRef.current.split("").forEach((_, index) => {
        setTimeout(() => {
          setLetters((prev) => {
            if (!prev[index]?.isSpace) {
              animateLetter(index);
            }
            return prev;
          });
        }, initialDelay + index * letterInterval);
      });

      // Reset animation state after completion (or loop)
      setTimeout(() => {
        isAnimatingRef.current = false;
        if (loop) {
          runAnimation();
        }
      }, totalDuration + letterAnimationDuration + (loop ? loopInterval : 0));
    };

    runAnimation();
  }, [initialDelay, letterInterval, letterAnimationDuration, loop, loopInterval, animateLetter]);

  // Store startAnimation in ref for effects
  useEffect(() => {
    startAnimationRef.current = startAnimation;
  }, [startAnimation]);

  // Auto-start animation on mount (only once)
  useEffect(() => {
    if (!reducedMotionRef.current) {
      const timer = setTimeout(() => startAnimationRef.current?.(), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync letters with text prop changes (derived state)
  useEffect(() => {
    const currentGetLetters = getLettersFromTextRef.current;
    if (!currentGetLetters) return;

    setLetters((prev) => {
      // Only recreate if length changed or chars differ
      if (prev.length !== text.length) {
        return currentGetLetters(text);
      }
      const hasDifferentChars = prev.some(
        (l, i) => l.char !== text[i] && !l.isSpace
      );
      if (hasDifferentChars) {
        return currentGetLetters(text);
      }
      return prev;
    });
  }, [text]);

  // Cleanup on unmount - capture frames at effect time
  useEffect(() => {
    const frames = { ...animationFrameRef.current };
    return () => {
      Object.values(frames).forEach((frame) => cancelAnimationFrame(frame));
    };
  }, []);

  // Optimized render
  return (
    <span
      className={cn("inline-flex flex-wrap", fontSize, fontWeight, fontFamily, className)}
      aria-label={text}
      role="text"
      style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-colors duration-150",
            letter.isMatrix && `text-[${scrambleColor}] font-mono`,
            letter.isSpace && "w-1"
          )}
          aria-hidden={!letter.isSpace}
          style={{ width: "1ch", textAlign: "center", display: "inline-block" }}
        >
          {letter.isSpace ? " " : letter.char}
        </span>
      ))}
    </span>
  );
}

export default MatrixText;