"use client";

import { Easing } from "framer-motion";

/**
 * Shared animation constants & variants for consistent motion across the portfolio
 * Professional standards: 150-300ms micro, ≤400ms complex; stagger 30-50ms
 */

// Spring easing - professional standard (Material Design / iOS-like)
export const springEase: Easing = [0.22, 1, 0.36, 1] as const;

// Spring configs for different weights
export const springConfig = {
  // Micro interactions (buttons, icons, badges): 150-300ms
  micro: { type: "spring" as const, stiffness: 340, damping: 26 },
  // Standard transitions (cards, sections): 300-400ms
  standard: { type: "spring" as const, stiffness: 260, damping: 22 },
  // Complex/entrance (hero, section headers): 400-600ms
  entrance: { type: "spring" as const, stiffness: 180, damping: 18 },
  // Gentle/slow (background elements, scroll indicators)
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
} as const;

// Stagger timing - 30-50ms per item
export const stagger = {
  fast: 0.03,    // 30ms - tight lists
  normal: 0.04,  // 40ms - standard
  slow: 0.05,    // 50ms - spacious
} as const;

// Container variants with stagger children
export const containerVariants = {
  fast: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: stagger.fast, delayChildren: 0.05 } },
  },
  normal: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: stagger.normal, delayChildren: 0.08 } },
  },
  slow: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: stagger.slow, delayChildren: 0.1 } },
  },
} as const;

// Item variants - entrance animations
export const itemVariants = {
  // Standard: fade + slide up
  standard: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: springConfig.standard },
  },
  // Slow: more dramatic entrance
  slow: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: springConfig.entrance },
  },
  // Fast: quick micro entrance
  fast: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: springConfig.micro },
  },
  // Scale-based (for cards, badges)
  scale: {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: springConfig.standard },
  },
  // Slide from left (timeline, lists)
  slideLeft: {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: springConfig.standard },
  },
  // Slide from right
  slideRight: {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: springConfig.standard },
  },
} as const;

// Section header variants
export const headerVariants = {
  standard: {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: springEase } },
  },
  fast: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: springEase } },
  },
} as const;

// Micro-interaction variants (hover, tap, focus)
export const microVariants = {
  // Button hover/tap
  button: {
    hover: { scale: 1.03, y: -2 },
    tap: { scale: 0.98 },
  },
  // Card hover
  card: {
    hover: { y: -4, scale: 1.01 },
    tap: { scale: 0.99 },
  },
  // Icon pulse
  icon: {
    hover: { scale: 1.15 },
    tap: { scale: 0.9 },
  },
  // Badge/small element
  badge: {
    hover: { scale: 1.08 },
    tap: { scale: 0.95 },
  },
} as const;

// Decorative animation variants (infinite, ambient)
export const ambientVariants = {
  // Gentle float
  float: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  // Pulse scale
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  // Rotate slow
  rotate: {
    animate: { rotate: 360 },
    transition: { duration: 20, repeat: Infinity, ease: "linear" },
  },
  // Glow pulse
  glow: {
    animate: { opacity: [0.3, 0.6, 0.3] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
} as const;

// Scroll indicator bounce
export const scrollIndicatorVariants = {
  animate: { y: [0, 8, 0] },
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
} as const;

// Transition helper for reduced motion
export const getTransition = (reducedMotion: boolean, config = springConfig.standard) =>
  reducedMotion ? { duration: 0.01 } : config;

// Stagger delay calculator
export const getStaggerDelay = (index: number, baseDelay = 0, step = stagger.normal) =>
  baseDelay + index * step;