"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Handshake, Users, CheckCircle } from "lucide-react";
import {
  springEase,
  springConfig,
  containerVariants,
  headerVariants,
} from "@/lib/animations";

const iconMap = {
  Handshake,
  Users,
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: springConfig.standard },
};

const pointVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: springEase } },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: springEase } },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: springEase } },
};

const periodVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: springEase } },
};

const orgs = [
  {
    title: "Staff Logistic And Operation",
    event: "Todays 2025",
    org: "BEM KEMA Telkom University Purwokerto",
    period: "June 2025 - Sep 2025",
    points: [
      "Orchestrated logistics and operational activities for seamless execution of daily programs and large-scale events.",
      "Coordinated with internal teams and external vendors to manage schedules, resources, and inventory.",
      "Enforced industry standards by promoting clean code principles, version control, and systematic documentation.",
    ],
    icon: "Users" as const,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    highlight: "1000+ mahasiswa baru",
  },
  {
    title: "Staff Sponsorship",
    event: "TUPEC E-Sport Event",
    org: "UKM Esport Telkom University Purwokerto",
    period: "Sep 2025 - Nov 2025",
    points: [
      "Spearheaded acquisition of corporate sponsorships by pitching structured funding packages (Silver, Gold, Platinum, Diamond).",
      "Negotiated and formalized MoU agreements with external partners ensuring mutually beneficial terms.",
      "Coordinated cross-functionally to execute sponsorship deliverables including logo placements and live stream adlibs.",
    ],
    icon: "Handshake" as const,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    highlight: "100+ peserta",
  },
] as const;

const orgLabels = {
  experience: "Organization Experience",
  leading: "Leading initiatives, securing partnerships, and delivering impact at scale",
} as const;

const headerVariantsLocal: Variants = headerVariants.standard;

export default function Organization() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  return (
    <section
      ref={sectionRef}
      id="organization"
      className="py-24 px-6 md:py-32"
      aria-labelledby="organization-heading"
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
            {orgLabels.experience}
          </span>
          <h2 id="organization-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            Organization & Leadership
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {orgLabels.leading}
          </p>
        </motion.div>

        {/* Organization cards grid */}
        <motion.div
          variants={containerVariants.normal}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-8 md:grid-cols-2"
        >
          {orgs.map((org) => {
            const OrgIcon = iconMap[org.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={org.title}
                variants={cardVariants}
                className="group relative rounded-2xl border bg-card p-6 md:p-8 hover:shadow-xl hover:border-primary/30 hover:shadow-primary/5 transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                {/* Decorative top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-violet-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

                {/* Icon + highlight badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${org.bgColor} ${org.color}`}>
                    <OrgIcon className="size-6" aria-hidden="true" />
                  </div>
                  <motion.div
                    variants={badgeVariants}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {org.highlight}
                  </motion.div>
                </div>

                {/* Period */}
                <motion.p
                  variants={periodVariants}
                  className="text-xs text-muted-foreground mb-1"
                >
                  {org.period}
                </motion.p>

                {/* Title */}
                <motion.h3
                  variants={textVariants}
                  className="text-lg font-bold mb-1 group-hover:text-primary transition-colors"
                >
                  {org.title}
                </motion.h3>

                {/* Event + Org */}
                <motion.p
                  variants={textVariants}
                  className="text-sm text-primary mb-5 font-medium"
                >
                  {org.event} — {org.org}
                </motion.p>

                {/* Points */}
                <ul className="space-y-3" role="list">
                  {org.points.map((point) => (
                    <motion.li
                      key={point}
                      variants={pointVariants}
                      className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                    >
                      <CheckCircle className="size-3.5 text-primary/60 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}