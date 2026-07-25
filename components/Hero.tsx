"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Download } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { animateBadgePulse } from "@/lib/micro-interactions";

const ThreeBackground = dynamic(() => import("@/components/three/ThreeBackground"), {
  ssr: false,
  loading: () => null,
});

import {
  springConfig,
  containerVariants,
  itemVariants,
  getTransition,
} from "@/lib/animations";

// Use shared animation configs - overrides for Hero-specific needs
const heroBadgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { ...springConfig.standard, delay: 0.05 } },
};

const heroItemVariantsSlow: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: springConfig.entrance },
};

const heroItemVariantsFast: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springConfig.micro },
};

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const badgeRef = useRef<HTMLParagraphElement>(null);

  // Start badge pulse animation after mount
  useEffect(() => {
    if (!reducedMotion && badgeRef.current) {
      animateBadgePulse(badgeRef.current);
    }
  }, [reducedMotion]);

  // Respect prefers-reduced-motion
  const transition = getTransition(reducedMotion ?? false, springConfig.standard);

  // Handle CTA smooth scroll
  useEffect(() => {
    const handleContactClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      if (target.getAttribute("href") === "#contact") {
        e.preventDefault();
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }
    };

    const cta = document.querySelector('a[href="#contact"]');
    cta?.addEventListener("click", handleContactClick);
    return () => cta?.removeEventListener("click", handleContactClick);
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center justify-center px-6 overflow-hidden isolation"
      role="banner"
    >
      {/* 3D Background */}
      <ThreeBackground />

      {/* Radial gradient glow behind content (light/dark adaptive) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Noise texture overlay for tactile feel */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <motion.div
        className="text-center max-w-3xl mx-auto relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        role="region"
        aria-label="Hero section"
      >
        {/* Floating badge */}
        <motion.p
          ref={badgeRef}
          variants={heroBadgeVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm mb-6"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
              style={{ animationDuration: "2s" }}
            />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          Informatics Engineering Graduate
        </motion.p>

        {/* Name - staggered */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-balance"
        >
          <span className="block">Evan Rafif</span>
          <motion.span
            variants={heroItemVariantsSlow}
            className="block bg-linear-to-r from-primary via-primary/80 to-violet-500 bg-clip-text text-transparent animate-gradient-x"
            style={{
              animation: "gradient-shift 4s ease-in-out infinite",
              backgroundSize: "200% 200%",
            }}
          >
            Pradana
          </motion.span>
        </motion.h1>

        {/* Subtitle - staggered */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance"
        >
          Frontend developer & problem solver. Passionate about building clean,
          performant web experiences that make a difference.
        </motion.p>

        {/* CTA Buttons - staggered with spring hover/tap */}
        <motion.div
          variants={heroItemVariantsFast}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA - Contact */}
          <motion.a
            href="#contact"
            className="group relative inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full text-sm font-semibold text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              backgroundSize: "200% 200%",
            }}
            whileHover={reducedMotion ? {} : { scale: 1.04, y: -2, boxShadow: "0 20px 40px -12px rgba(99, 102, 241, 0.5)" }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            transition={transition}
          >
            <span className="relative z-10">Get in Touch</span>
            <motion.span
              className="absolute inset-0 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100"
              style={{ backgroundSize: "200% 200%" }}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-primary via-violet-500 to-pink-500"
              style={{ backgroundSize: "200% 200%" }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <ArrowRight className="relative z-10 size-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </motion.a>

          {/* Secondary CTA - Download CV */}
          <motion.a
            href="/cv.pdf"
            download
            className="group relative inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full text-sm font-semibold border border-border bg-background/80 backdrop-blur-sm hover:bg-accent/10 transition-all duration-300"
            whileHover={reducedMotion ? {} : { scale: 1.03, y: -1.5, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.1)" }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            transition={transition}
          >
            <Download className="size-4" />
            <span className="relative z-10">Download CV</span>
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ animationDelay: "1.2s" }}
        >
          <div className="size-6 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <motion.div
              className="size-1.5 rounded-full bg-muted-foreground/60"
              animate={{ scaleY: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* CSS for gradient animation on name */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-shift 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}