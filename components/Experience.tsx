"use client";

import { motion, useInView, useScroll, useTransform, type Variants, type Easing } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Code, CheckCircle } from "lucide-react";

const experiences = [
  {
    role: "Frontend Web Developer Intern",
    company: "PT Cazh Teknologi Inovasi",
    location: "Purwokerto",
    period: "May 2025 - July 2025",
    points: [
      "Spearheaded frontend web development for the \"Rukun\" application using Vue.js/Nuxt.js.",
      "Designed and implemented interactive dashboards for complex data visualization, user management, and profile management.",
      "Engineered secure authentication workflows, including login, registration, password reset, and route protection using middleware.",
    ],
    tech: ["Vue.js", "Nuxt.js", "TypeScript", "Tailwind CSS", "Pinia"],
  },
  {
    role: "Laboratory Assistant - Software Construction",
    company: "Programming Lab, Telkom University",
    location: "Purwokerto",
    period: "Feb 2025 - June 2025",
    points: [
      "Guided students through software design, development, testing, and maintenance processes.",
      "Conducted on-site problem-solving and ensured operational procedures complied with standards.",
      "Mentored students on implementing proper coding practices, debugging, and code reviews.",
    ],
    tech: ["JavaScript", "React", "Node.js", "Git", "Testing"],
  },
];

// Animation constants - professional standards
const springEase: Easing = [0.22, 1, 0.36, 1] as const;

const springConfig = { type: "spring" as const, stiffness: 260, damping: 22 } as const;

// Stagger container - 30-50ms per item
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: springConfig },
};

const dotVariants: Variants = {
  hidden: { scale: 0 },
  show: { scale: 1, transition: { duration: 0.4, ease: springEase } },
};

const pointVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: springEase } },
};

const techVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: springEase } },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: springEase } },
};

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Progress for timeline line fill
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 px-6 md:py-32 bg-muted/30"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 relative"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 tracking-widest uppercase mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Experience
          </span>
          <h2 id="experience-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Building real-world products and mentoring the next generation
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line with progress fill */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border/50" aria-hidden="true">
            <motion.div
              className="absolute left-0 top-0 w-full bg-linear-to-b from-primary to-violet-500"
              style={{ transformOrigin: "top center", scaleY: lineProgress }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ duration: 1.2, ease: springEase }}
            />
          </div>

          {/* Timeline items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="space-y-12"
          >
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role}
                variants={cardVariants}
                className="relative pl-20"
              >
                {/* Timeline dot */}
                <motion.div
                  variants={dotVariants}
                  className="absolute left-8 top-2 size-3 -translate-x-1.5 rounded-full bg-primary border-4 border-background z-10"
                />

                {/* Connector pulse - subtle indicator of active timeline segment */}
                <motion.div
                  className="absolute left-8 top-0 h-full w-0.5 bg-primary/10"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ animationDelay: `${i * 0.8}s` }}
                />

                {/* Card */}
                <motion.div
                  className="group relative rounded-2xl bg-card border border-border p-6 md:p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Briefcase className="size-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{exp.role}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {exp.period}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground md:ml-8">
                      <GraduationCap className="size-4" aria-hidden="true" />
                      <span>{exp.company}</span>
                      <span className="text-muted-foreground/50">—</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Points */}
                  <ul className="space-y-3 mb-6" role="list">
                    {exp.points.map((point, j) => (
                      <motion.li
                        key={point}
                        variants={pointVariants}
                        className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                      >
                        <motion.div
                          className="flex h-5 w-5 shrink-0 items-center justify-center mt-0.5"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }}
                        >
                          <CheckCircle className="size-3.5 text-primary/60" aria-hidden="true" />
                        </motion.div>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border" role="list" aria-label="Technologies used">
                    {exp.tech.map((t) => (
                      <motion.span
                        key={t}
                        variants={techVariants}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-colors"
                      >
                        <Code className="size-3" aria-hidden="true" />
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* End of timeline marker */}
          <motion.div
            variants={dotVariants}
            className="absolute left-8 bottom-0 size-3 -translate-x-1.5 rounded-full bg-primary border-4 border-background z-10"
          />
        </div>
      </div>
    </section>
  );
}