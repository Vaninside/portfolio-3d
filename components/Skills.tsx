"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Database,
  Server,
  Users,
  Target,
  MessageSquare,
  Clock,
  Brain,
  Lightbulb,
  Shield,
  Globe as GlobeIcon,
} from "lucide-react";
import {
  springEase,
  springConfig,
  containerVariants,
  itemVariants,
  headerVariants,
} from "@/lib/animations";
import {
  animateCardHover,
  animateBadgeHover,
} from "@/lib/micro-interactions";

const technicalSkills = [
  {
    category: "Frontend",
    icon: Code,
    color: "from-blue-500 via-cyan-500 to-blue-600",
    skills: [
      "React 18 / Next.js 16 (App Router)",
      "TypeScript (Strict Mode)",
      "Tailwind CSS v4 / CSS Variables",
      "Framer Motion / GSAP",
      "React Three Fiber / Three.js",
      "Shadcn/UI / Radix UI",
      "Zustand / React Context",
      "React Hook Form / Zod",
    ],
  },
  {
    category: "Backend & API",
    icon: Server,
    color: "from-emerald-500 via-teal-500 to-emerald-600",
    skills: [
      "Node.js / Express / Fastify",
      "RESTful API Design",
      "GraphQL (Apollo / URQL)",
      "Prisma ORM / Drizzle ORM",
      "PostgreSQL / MySQL / MongoDB",
      "Redis (Caching / Sessions)",
      "WebSocket / Socket.io",
      "NextAuth.js / Clerk",
    ],
  },
  {
    category: "DevOps & Tools",
    icon: Database,
    color: "from-violet-500 via-purple-500 to-pink-500",
    skills: [
      "Git / GitHub / GitLab CI",
      "Vercel / Netlify / AWS Amplify",
      "Docker / Docker Compose",
      "ESLint / Prettier / Husky",
      "Vitest / Jest / Playwright",
      "Turborepo / Nx",
      "pnpm / npm Workspaces",
      "VS Code / Cursor / Warp",
    ],
  },
  {
    category: "Testing & Quality",
    icon: Shield,
    color: "from-amber-500 via-orange-500 to-red-500",
    skills: [
      "Unit Testing (Vitest / Jest)",
      "Integration Testing (MSW)",
      "E2E Testing (Playwright / Cypress)",
      "Component Testing (Storybook + Vitest)",
      "Visual Regression (Chromatic)",
      "Accessibility Testing (axe-core)",
      "Performance Profiling (Lighthouse CI)",
      "Type Safety (tsc --strict)",
    ],
  },
];

const softSkills = [
  {
    label: "Problem Solving",
    icon: Brain,
    desc: "Break down complex challenges into manageable, testable solutions",
  },
  {
    label: "Communication",
    icon: MessageSquare,
    desc: "Clear technical communication across design, product, and engineering",
  },
  {
    label: "Time Management",
    icon: Clock,
    desc: "Prioritize effectively, deliver iteratively, meet deadlines reliably",
  },
  {
    label: "Leadership",
    icon: Target,
    desc: "Mentored junior developers, led lab sessions (50+ students), organized 1000+ attendee events",
  },
  {
    label: "Adaptability",
    icon: Lightbulb,
    desc: "Quick learner — picked up Vue/Nuxt in 2 weeks for RUKUN internship project",
  },
  {
    label: "Collaboration",
    icon: Users,
    desc: "Cross-functional teamwork: designers, PMs, QA, backend, stakeholders",
  },
];

const languages = [
  { name: "Indonesian", level: "Native", icon: GlobeIcon },
  { name: "English", level: "Professional (TOEFL 550+)", icon: GlobeIcon },
  { name: "Javanese", level: "Conversational", icon: GlobeIcon },
];

// Skill-specific variants (not in shared lib)
const softCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: springConfig },
};

const langVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: springEase } },
};

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();
  const skillCardRefs = useRef<(HTMLElement | null)[]>([]);
  const badgeRefs = useRef<(HTMLElement | null)[]>([]);

  // Attach micro-interactions
  useEffect(() => {
    if (reducedMotion) return;

    const cleanupHandlers: Array<{ el: HTMLElement; type: string; fn: EventListener }> = [];

    skillCardRefs.current.forEach((el) => {
      if (!el) return;
      const handleEnter = () => animateCardHover(el, "hover");
      const handleLeave = () => animateCardHover(el, "leave");
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      cleanupHandlers.push({ el, type: "mouseenter", fn: handleEnter });
      cleanupHandlers.push({ el, type: "mouseleave", fn: handleLeave });
    });

    badgeRefs.current.forEach((el) => {
      if (!el) return;
      const handleEnter = () => animateBadgeHover(el, "hover");
      const handleLeave = () => animateBadgeHover(el, "leave");
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      cleanupHandlers.push({ el, type: "mouseenter", fn: handleEnter });
      cleanupHandlers.push({ el, type: "mouseleave", fn: handleLeave });
    });

    // Cleanup function
    return () => {
      cleanupHandlers.forEach(({ el, type, fn }) => {
        el.removeEventListener(type, fn);
      });
    };
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      id="skills"
      className="py-24 px-6 md:py-32"
      aria-labelledby="skills-heading"
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" style={{ animationDuration: reducedMotion ? "0.01s" : "2s" }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Skills
          </span>
          <h2 id="skills-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            Technical & <span className="text-primary">Soft</span> Skills
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Technologies I work with and competencies I bring to every team
          </p>
        </motion.div>

        {/* Technical Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
          role="list"
          aria-label="Technical skills"
        >
          {technicalSkills.map((category, i) => (
            <motion.article
              key={category.category}
              ref={(el) => { skillCardRefs.current[i] = el; }}
              variants={itemVariants.standard}
              className="group relative rounded-2xl bg-card border border-border p-6 md:p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
              whileHover={{ y: -4 }}
            >
              {/* Gradient top border */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{
                  background: `linear-gradient(90deg, ${category.color.replace("from-", "").replace("via-", "").replace("to-", "")})`,
                }}
                aria-hidden="true"
              />

              {/* Decorative glow */}
              <div
                className="absolute -top-6 -right-6 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${category.color.split(" ")[0].replace("from-", "")}20, transparent)`,
                }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <category.icon className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{category.category}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{category.skills.length} technologies</p>
                  </div>
                </div>

                {/* Skills list */}
                <motion.ul variants={containerVariants} className="space-y-2.5">
                  {category.skills.map((skill, j) => (
                    <motion.li
                      key={skill}
                      variants={itemVariants}
                      className="flex items-center gap-2 text-sm text-muted-foreground leading-relaxed"
                    >
                      <motion.div
                        className="flex h-5 w-5 shrink-0 items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.1 }}
                      >
                        <div className="relative size-5 rounded-full border border-primary/30" />
                        <motion.div className="absolute size-1.5 rounded-full bg-primary" animate={{ scale: [1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.1 }} />
                      </motion.div>
                      <span className="group-hover:text-foreground transition-colors">{skill}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Soft Skills */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          style={{ transitionDelay: "0.12s" }}
          className="mt-16 md:mt-20"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Soft <span className="text-primary">Skills</span>
            </h3>
            <p className="text-muted-foreground">
              Complementary competencies that make collaboration effective
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {softSkills.map((skill) => (
              <motion.div
                key={skill.label}
                variants={softCardVariants}
                className="group relative p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <skill.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{skill.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{skill.desc}</p>
                  </div>
                </div>
                {/* Accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Languages */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          style={{ transitionDelay: "0.2s" }}
          className="mt-16 md:mt-20 pt-10 border-t border-border"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Languages</h3>
            <p className="text-muted-foreground">Professional proficiency for global collaboration</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {languages.map((lang) => (
              <motion.div
                key={lang.name}
                variants={langVariants}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <lang.icon className="size-4 text-primary" aria-hidden="true" />
                <span className="font-medium">{lang.name}</span>
                <Badge variant="secondary" className="text-xs px-2.5 py-0.5 ml-1">
                  {lang.level}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}