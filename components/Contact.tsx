"use client";

import { motion, useInView, type Variants, type Easing } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Send,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  CheckCircle,
  Loader2,
  ExternalLink,
  FileText,
  GitBranch,
} from "lucide-react";

const springEase: Easing = [0.22, 1, 0.36, 1] as const;

const springConfig = { type: "spring" as const, stiffness: 260, damping: 22 } as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: springConfig },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: springEase } },
};

const socialVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: springEase } },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: springEase } },
};

const contactInfo = [
  {
    label: "Email",
    value: "evanrafifpradana@gmail.com",
    icon: Mail,
    href: "mailto:evanrafifpradana@gmail.com",
    description: "Primary contact for opportunities",
  },
  {
    label: "Phone",
    value: "+62 8xx-xxxx-xxxx",
    icon: Phone,
    href: "tel:+628xxxxxxxxxx",
    description: "WhatsApp / Call available",
  },
  {
    label: "Location",
    value: "Yogyakarta, Indonesia",
    icon: MapPin,
    href: "https://maps.google.com/?q=Yogyakarta,Indonesia",
    description: "Open to relocation & remote",
  },
  {
    label: "Availability",
    value: "Full-time / Freelance",
    icon: Clock,
    href: "#",
    description: "Immediate start available",
  },
];

const socialLinks = [
  { label: "GitHub", icon: GitBranch, href: "https://github.com/vaninside", color: "hover:text-gray-400 dark:hover:text-gray-500" },
  { label: "LinkedIn", icon: ExternalLink, href: "https://linkedin.com/in/evanrafifpradana", color: "hover:text-primary/80 dark:hover:text-primary" },
  { label: "Twitter / X", icon: ExternalLink, href: "https://x.com/vaninside", color: "hover:text-sky-500" },
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production: await fetch("/api/contact", { method: "POST", body: JSON.stringify(formState) })
    setSubmitStatus("success");
    setFormState({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setSubmitStatus("idle"), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="py-24 px-6 md:py-32 bg-muted/30"
      aria-labelledby="contact-heading"
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Contact
          </span>
          <h2 id="contact-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            Let&apos;s <span className="text-primary">Build</span> Something
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a project in mind or just want to say hi? I&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Main content grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-12 lg:grid-cols-3"
        >
          {/* Contact Info Cards - 2 columns */}
          <div className="lg:col-span-2 space-y-6" role="list" aria-label="Contact information">
            {contactInfo.map((item) => (
              <motion.article
                key={item.label}
                variants={cardVariants}
                className="group relative flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="size-6" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</h3>
                    {item.href !== "#" && (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`Open ${item.label}`}
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground select-all">
                    <a href={item.href} className="hover:text-primary transition-colors" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                      {item.value}
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{item.description}</p>
                </div>
                {/* Accent indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary to-violet-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              </motion.article>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            variants={cardVariants}
            className="space-y-4"
            style={{ gridColumn: "span 1" }}
          >
            <h3 className="font-bold text-lg mb-4">Connect With Me</h3>
            <div className="space-y-3" role="list" aria-label="Social links">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialVariants}
                  whileHover={{ x: 4 }}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="size-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="font-medium">{social.label}</span>
                  <ArrowRight className="size-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </motion.a>
              ))}
            </div>

            {/* Quick CTA buttons */}
            <div className="mt-8 pt-6 border-t border-border space-y-3">
              <a
                href="mailto:evanrafifpradana@gmail.com?subject=Job Opportunity&body=Hi Evan,%0D%0A%0D%0AI came across your portfolio and..."
                className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <Mail className="size-4" aria-hidden="true" />
                Hire Me
              </a>
              <a
                href="/cv.pdf"
                download
                className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border border-border hover:bg-accent/10 hover:border-primary/30 transition-all duration-300"
              >
                <FileText className="size-4" aria-hidden="true" />
                Download CV
              </a>
            </div>
          </motion.div>

          {/* Contact Form - Full width */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-3"
          >
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="rounded-2xl bg-card border border-border p-6 md:p-8"
            >
              <h3 className="text-2xl font-bold tracking-tight mb-6">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Form fields grid */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name <span className="text-primary" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                      placeholder="Evan Rafif Pradana"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email <span className="text-primary" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                      placeholder="evan@example.com"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject <span className="text-primary" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                  >
                    <option value="">Select a topic</option>
                    <option value="job">Job Opportunity</option>
                    <option value="freelance">Freelance Project</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="mentoring">Mentoring / Speaking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-primary" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors placeholder:text-muted-foreground/50 resize-none"
                    placeholder="Tell me about your project, role, or just say hi..."
                    aria-required="true"
                  />
                </div>

                {/* Submit button + status */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
                  <Button
                    type="submit"
                    disabled={submitStatus === "submitting"}
                    className="w-full sm:w-auto group relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)" }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {submitStatus === "submitting" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          Sending...
                        </>
                      ) : submitStatus === "success" ? (
                        <>
                          <CheckCircle className="size-4" aria-hidden="true" />
                          Sent Successfully!
                        </>
                      ) : (
                        <>
                          <Send className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </span>
                    {submitStatus !== "submitting" && submitStatus !== "success" && (
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500"
                        style={{ backgroundSize: "200% 200%" }}
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </Button>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                    >
                      <CheckCircle className="size-4" />
                      Message sent! I&apos;ll get back to you soon.
                    </motion.div>
                  )}
                </div>

                {/* Form footer */}
                <p className="text-xs text-muted-foreground/70 text-center">
                  By submitting, you agree to my{' '}
                  <a href="#privacy" className="underline hover:text-primary transition-colors">
                    Privacy Policy
                  </a>{' '}
                  &{' '}
                  <a href="#terms" className="underline hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </p>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Prefer a direct email?{' '}
            <a href="mailto:evanrafifpradana@gmail.com" className="font-medium text-primary hover:underline">
              evanrafifpradana@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}