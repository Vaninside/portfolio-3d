"use client";

import { motion, useInView, useMotionValue, useTransform, type Variants } from "framer-motion";
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, GitBranch, Layers, Zap, Shield, Globe } from "lucide-react";
import {
  springEase,
  springConfig,
  headerVariants,
  containerVariants,
} from "@/lib/animations";

const iconMap = {
  Globe,
  Shield,
  Layers,
  Zap,
};

type ProjectItem = {
  title: string;
  description: string;
  period: string;
  tech: readonly string[];
  points: readonly string[];
  links: { demo: string; github: string };
  color: string;
  icon: keyof typeof iconMap;
  image?: string;
  demoAvailable?: boolean;
};

const projects = [
  {
    title: "StockFlow",
    description: "Multi-Location Inventory Management — Fullstack Portfolio Project",
    period: "July 2026 - Present",
    tech: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "TypeScript"],
    points: [
      "Built a fullstack monorepo with a NestJS REST API and Next.js 15 frontend, sharing types across the workspace.",
      "Implemented JWT auth with refresh tokens and role-based access (Admin/Staff) enforced server-side.",
      "Designed atomic cross-location stock transfers with an append-only, immutable audit trail.",
    ],
    links: { demo: "https://stock-flow-web-iota.vercel.app/", github: "https://github.com/Vaninside/Stock-flow" },
    color: "from-indigo-500 via-blue-500 to-cyan-500",
    icon: "Globe",
    image: "/stock-flow.webp",
  },
  {
    title: "Portfolio 3D",
    description: "Personal Portfolio — Next.js & Framer Motion",
    period: "July 2026 - Present",
    tech: ["Next.js", "React", "TypeScript", "Framer Motion", "Tailwind CSS"],
    points: [
      "Built an interactive particle-network canvas hero background reactive to the cursor.",
      "Implemented scroll-triggered animations with spring physics and reduced-motion support.",
      "Optimized with dynamic imports and off-screen pausing for smooth performance.",
    ],
    links: { demo: "#", github: "https://github.com/vaninside/portfolio-3d" },
    color: "from-violet-500 via-purple-500 to-pink-500",
    icon: "Layers",
    image: "/porto.webp",
  },
  {
    title: "RUKUN",
    description: "Internship Project at PT Cazh Teknologi Inovasi",
    period: "May 2025 - July 2025",
    tech: ["Vue.js", "Nuxt.js", "REST API", "Pinia", "Middleware"],
    points: [
      "Architected and developed client-side using Vue.js and Nuxt.js with modular components for scalability.",
      "Integrated complex RESTful APIs to render dynamic data for admin dashboard and user profile management.",
      "Configured state management and route middleware for secure multi-level authentication flows.",
    ],
    links: { demo: "#", github: "https://github.com/rukun-dev/Rukun" },
    color: "from-blue-500 via-cyan-500 to-blue-600",
    icon: "Globe",
    image: "/rukun.webp",
    demoAvailable: false,
  },
  {
    title: "PUSON",
    description: "Posyandu untuk Stunting Online — Academic Project",
    period: "March 2025 - Sep 2025",
    tech: ["QA Testing", "UI/UX Design", "System Testing", "Bug Tracking", "Jira"],
    points: [
      "Developed and executed comprehensive test plans and test cases to identify software defects.",
      "Conducted rigorous UI/UX and system testing for a seamless stunting monitoring application.",
      "Documented system anomalies and collaborated with the development team to resolve critical bugs.",
    ],
    links: { demo: "#", github: "https://github.com/rvnkrwn-dev/PUSON" },
    color: "from-emerald-500 via-teal-500 to-emerald-600",
    icon: "Shield",
    image: "/puson.webp",
    demoAvailable: false,
  },
] as const;

function ProjectActions({ project }: { project: ProjectItem }) {
  const demoAvailable = project.demoAvailable !== false;

  return (
    <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
      {!demoAvailable && (
        <p className="flex items-center gap-2 text-xs text-amber-500/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <span aria-hidden="true">ℹ️</span>
          Live demo tidak tersedia — database sudah offline.
        </p>
      )}
      <div className="flex items-center gap-3">
        {demoAvailable && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
          >
            <ExternalLink className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            View Demo
          </a>
        )}
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold border border-border hover:bg-accent/10 hover:border-primary/30 transition-all duration-300 group"
        >
          <GitBranch className="size-4" aria-hidden="true" />
          {demoAvailable ? "View Code" : "View Source Code"}
        </a>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  // Use shared header variants
  const headerVariantsLocal = headerVariants.standard;

  // 3D Tilt Card Component
  function ProjectCard({ project, index, isInView }: { project: ProjectItem; index: number; isInView: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const isHovering = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], ["8deg", "-8deg"]);
    const rotateY = useTransform(x, [-100, 100], ["-8deg", "8deg"]);
    const glowOpacity = useTransform(isHovering, [0, 1], [0, 0.15]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleMove = (e: MouseEvent) => {
        if (isHovering.get() === 0) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
      };

      const handleEnter = () => { isHovering.set(1); };
      const handleLeave = () => { isHovering.set(0); x.set(0); y.set(0); };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      return () => {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      };
    }, [x, y, isHovering]);

    const cardVariants: Variants = {
      hidden: { opacity: 0, y: 40, scale: 0.98 },
      show: { opacity: 1, y: 0, scale: 1, transition: springConfig.entrance },
    };

    const contentVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: springEase } },
    };

    const IconComponent = iconMap[project.icon];

    return (
      <motion.div
        ref={ref}
        data-project-card
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        transition={{ delay: index * 0.08 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className="group relative h-full"
      >
        {/* Glow overlay - follows cursor */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: project.color,
            filter: "blur(60px)",
            transform: "scale(1.3)",
            zIndex: -1,
            opacity: glowOpacity,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Card */}
        <Card className="relative h-full flex flex-col bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 overflow-hidden">
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${project.color.replace("from-", "").replace("via-", "").replace("to-", "")})` }} aria-hidden="true" />

          <CardHeader className="pb-4">
            <motion.p variants={contentVariants} className="text-xs text-muted-foreground font-medium">{project.period}</motion.p>
            <motion.div variants={contentVariants} className="flex items-center gap-2 mt-1">
              <IconComponent className="size-5" style={{ color: project.color.split(" ")[0].replace("from-", "") }} aria-hidden="true" />
              <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{project.title}</CardTitle>
            </motion.div>
            <motion.p variants={contentVariants} className="text-sm text-muted-foreground mt-2">{project.description}</motion.p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-4">
            <motion.ul variants={contentVariants} className="space-y-3 text-sm text-muted-foreground flex-1 leading-relaxed">
              {project.points.map((point, j) => (
                <motion.li key={point} variants={contentVariants} className="flex gap-3">
                  <span className="relative flex h-5 w-5 shrink-0 items-center justify-center mt-0.5">
                    <motion.div className="absolute size-1.5 rounded-full bg-primary/60" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }} />
                    <div className="relative size-5 rounded-full border border-primary/30" />
                  </span>
                  <span>{point}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={contentVariants} className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <motion.span
                  key={t}
                  variants={contentVariants}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-colors"
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={contentVariants}>
              <ProjectActions project={project} />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 px-6 md:py-32"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          variants={headerVariantsLocal}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 tracking-widest uppercase mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Projects
          </span>
          <h2 id="projects-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            My <span className="text-primary">Project</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-world applications built with modern tech stacks
          </p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
          role="list"
          aria-label="Projects"
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} isInView={isInView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}