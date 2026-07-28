"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Longer window that completes once the section top reaches the reading zone
  // (~35% down the viewport) so the motion is visible as the user scrolls into it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 35%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const blurPx = useTransform(scrollYProgress, [0, 0.7], [6, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, opacity, filter }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
