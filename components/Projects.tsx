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
import { useTranslation } from "@/lib/i18n/useTranslation";

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
  tech: string[];
  points: string[];
  links: { demo: string; github: string };
  color: string;
  icon: keyof typeof iconMap;
};

export default function Projects() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  const projects = t("projects.items", { returnObjects: true }) as ProjectItem[];

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

            <motion.div variants={contentVariants} className="flex items-center gap-3 pt-2 border-t border-border/50">
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group">
                <ExternalLink className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                {t("projects.viewDemo")}
              </a>
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold border border-border hover:bg-accent/10 hover:border-primary/30 transition-all duration-300 group">
                <GitBranch className="size-4" aria-hidden="true" />
                {t("projects.viewCode")}
              </a>
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
      className="py-24 px-6 md:py-32 bg-muted/30"
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
            {t("projects.title")}
          </span>
          <h2 id="projects-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            {t("projects.subtitle")}
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
          aria-label={t("projects.title")}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} isInView={isInView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}