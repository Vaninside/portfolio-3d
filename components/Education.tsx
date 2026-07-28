"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Award, BookOpen, Calendar, Code2, Medal } from "lucide-react";

import {
  springEase,
  springConfig,
  containerVariants,
  headerVariants,
} from "@/lib/animations";
import { Marquee } from "@/components/ui/marquee";

const iconMap = {
  GraduationCap,
  Award,
  BookOpen,
  Code2,
  Medal,
};

const EDUCATION = [
  {
    degree: "Bachelor's Degree, Informatics Engineering",
    school: "Telkom University",
    location: "Campus Purwokerto",
    period: "Sept 2022 — Feb 2026",
    gpa: "3.75 / 4.00",
    thesis: "Fine-tuning IndoBERT Model for Sentiment Analysis and Comparative Study of Optimizers",
    honors: [],
    subjects: [
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Data Mining",
      "Software Engineering",
      "Algorithm & Data Structures",
    ],
  },
] as const;

const CERTIFICATIONS = [
  { name: "EPrT (English Proficiency Test)", issuer: "Telkom University", year: "2025", icon: "Medal" as const },
  { name: "Belajar Back-End Pemula dengan JavaScript", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
  { name: "Belajar Dasar Pemrograman JavaScript", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
  { name: "Belajar Dasar Cloud dan Gen AI di AWS", issuer: "Dicoding", year: "2025", icon: "Award" as const },
  { name: "Memulai Pemrograman dengan Python", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
  { name: "Belajar Dasar Data Science", issuer: "Dicoding", year: "2025", icon: "BookOpen" as const },
  { name: "Belajar Dasar AI", issuer: "Dicoding", year: "2025", icon: "Award" as const },
  { name: "Belajar Dasar Visualisasi Data", issuer: "Dicoding", year: "2025", icon: "BookOpen" as const },
  { name: "Belajar Dasar Structured Query Language (SQL)", issuer: "Dicoding", year: "2025", icon: "Code2" as const },
] as const;

const EDU_LABELS = {
  period: "Period",
  location: "Location",
  thesis: "Thesis",
  honors: "Honors & Achievements",
  subjects: "Key Coursework",
  certifications: "Certifications",
  continuousLearning: "Continuous learning & professional development",
} as const;

// Education-specific variants using shared configs
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: springConfig.entrance },
};

const honorVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: springEase } },
};

const subjectVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: springEase } },
};

const certVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: springEase } },
};

function CertCard({ cert }: { cert: (typeof CERTIFICATIONS)[number] }) {
  const CertIcon = iconMap[cert.icon as keyof typeof iconMap];
  return (
    <motion.div
      variants={certVariants}
      className="group w-72 shrink-0 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <CertIcon className="size-6" aria-hidden="true" />
      </div>
      <h4 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
        {cert.name}
      </h4>
      <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
      <p className="text-xs text-muted-foreground/70 mt-0.5">{cert.year}</p>
    </motion.div>
  );
}

export default function Education() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      id="education"
      className="py-24 px-6 md:py-32"
      aria-labelledby="education-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 tracking-widest uppercase mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
                style={{ animationDuration: reducedMotion ? "0.01s" : "2s" }}
              />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Education
          </span>
          <h2 id="education-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            My Academic <span className="text-primary">Background</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Foundation built on rigorous coursework, research, and continuous learning
          </p>
        </motion.div>

        {/* Education Cards */}
        <motion.div
          variants={containerVariants.normal}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="space-y-8"
        >
          {EDUCATION.map((edu) => (
            <motion.div
              key={edu.degree}
              variants={cardVariants}
              className="relative rounded-2xl bg-card border border-border overflow-hidden"
              whileHover={{ y: -2 }}
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-pink-500" aria-hidden="true" />

              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="size-7" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">{edu.degree}</h3>
                      <p className="text-primary font-medium mt-1">{edu.school}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="size-3.5" aria-hidden="true" />
                        {edu.period} &bull; {edu.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right md:items-end">
                    <div className="text-3xl font-bold text-primary tabular-nums">{edu.gpa}</div>
                    <div className="text-xs text-muted-foreground">IPK</div>
                  </div>
                </div>

                {/* Thesis */}
                <div className="mb-8 p-5 rounded-xl bg-background border border-border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{EDU_LABELS.thesis}</h4>
                      <p className="text-muted-foreground mt-1">{edu.thesis}</p>
                    </div>
                  </div>
                </div>

                {/* Honors & Subjects grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Honors */}
                  {edu.honors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                        <Award className="size-5 text-primary" aria-hidden="true" />
                        {EDU_LABELS.honors}
                      </h4>
                      <ul className="space-y-2" role="list">
                        {edu.honors.map((honor) => (
                          <motion.li
                            key={honor}
                            variants={honorVariants}
                            className="flex items-center gap-3 text-sm text-muted-foreground"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Medal className="size-3" aria-hidden="true" />
                            </span>
                            {honor}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Subjects */}
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                      <Code2 className="size-5 text-primary" aria-hidden="true" />
                      {EDU_LABELS.subjects}
                    </h4>
                    <div className="flex flex-wrap gap-2" role="list">
                      {edu.subjects.map((subject) => (
                        <motion.span
                          key={subject}
                          variants={subjectVariants}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors"
                        >
                          {subject}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          style={{ transitionDelay: "0.2s" }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold tracking-tight">{EDU_LABELS.certifications}</h3>
            <p className="text-muted-foreground mt-2">{EDU_LABELS.continuousLearning}</p>
          </div>

          {reducedMotion ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center"
            >
              {CERTIFICATIONS.map((cert) => (
                <CertCard key={cert.name} cert={cert} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <Marquee speedSeconds={30} pauseOnHover ariaLabel="Certifications" className="py-2">
                <div className="flex gap-4 pr-4">
                  {CERTIFICATIONS.map((cert) => (
                    <CertCard key={cert.name} cert={cert} />
                  ))}
                </div>
              </Marquee>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}