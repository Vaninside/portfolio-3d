"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Code, Award, Users, Zap } from "lucide-react";

import {
  containerVariants,
  itemVariants,
  headerVariants,
} from "@/lib/animations";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { TranslationKey } from "@/lib/i18n/types";

const skills = [
  { icon: Code, key: "frontend" as const },
  { icon: Award, key: "academic" as const },
  { icon: Users, key: "leadership" as const },
  { icon: Zap, key: "problemSolving" as const },
];

export default function About() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      id="about"
      className="py-24 px-6 md:py-32"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          variants={headerVariants.standard}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 tracking-widest uppercase mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" style={{ animationDuration: reducedMotion ? "0.01s" : "2s" }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            {t("about.title") as string}
          </span>
          <h2 id="about-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            Hi, I&apos;m <span className="text-primary">Evan Rafif Pradana</span>
          </h2>
        </motion.div>

        {/* Main content grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={containerVariants}
          className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start"
        >
          {/* Bio column */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 text-muted-foreground leading-relaxed"
          >
            <p className="text-lg md:text-xl font-medium text-foreground">
              {t("about.description1")}
            </p>
            <p>
              {t("about.description2")}
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              {skills.map((skill) => (
                <motion.div
                  key={skill.key}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <skill.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t(`about.skills.${skill.key}.label` as TranslationKey)}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{t(`about.skills.${skill.key}.desc` as TranslationKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Profile / Stats column */}
          <motion.div
            variants={itemVariants}
            style={{ transitionDelay: "0.08s" }}
            className="relative"
          >
            {/* Profile card */}
            <div className="relative rounded-2xl bg-linear-to-br from-primary/5 via-transparent to-violet-500/5 border border-border p-6 md:p-8 sticky top-24">
              {/* Decorative blobs */}
              <div className="absolute -top-6 -right-6 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden="true" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" aria-hidden="true" />

              <div className="relative space-y-6">
                {/* Profile placeholder */}
                <div className="mx-auto relative">
                  <div className="size-40 md:size-48 rounded-2xl bg-linear-to-br from-primary/20 to-violet-500/20 border-4 border-primary/30 flex items-center justify-center overflow-hidden relative">
                    <div className="size-full flex items-center justify-center">
                      <Code className="size-16 md:size-20 text-primary/30" aria-hidden="true" />
                    </div>
                    {/* Accent ring */}
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl" />
                    <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                      <Award className="size-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Name & role */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold tracking-tight">Evan Rafif Pradana</h3>
                  <p className="text-primary font-medium mt-1">{t("hero.badge")}</p>
                  <p className="text-sm text-muted-foreground mt-2">Yogyakarta, Indonesia</p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">3.75</div>
                    <div className="text-xs text-muted-foreground">{t("education.gpa")}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">2+</div>
                    <div className="text-xs text-muted-foreground">{t("about.highlights.projects")}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">2</div>
                    <div className="text-xs text-muted-foreground">{t("experience.present")}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-3xl font-bold tracking-tight text-primary">5+</div>
                    <div className="text-xs text-muted-foreground">{t("education.graduation")}</div>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="#contact"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
                  >
                    {t("hero.ctaContact")}
                  </a>
                  <a
                    href="/cv.pdf"
                    download
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border border-border hover:bg-accent/10 transition-colors"
                  >
                    {t("hero.ctaCv")}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}