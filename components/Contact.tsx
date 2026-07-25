"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
import {
  springEase,
  springConfig,
  containerVariants,
} from "@/lib/animations";
import {
  animateButtonHover,
  animateCardHover,
  animateSocialHover,
  prefersReducedMotion,
} from "@/lib/micro-interactions";
import { useTranslation } from "@/lib/i18n/useTranslation";

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

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactInfoItem {
  label: string;
  value: string;
  icon: string;
  href: string;
  description: string;
}

interface SocialLinkItem {
  label: string;
  icon: string;
  href: string;
  color: string;
}

type IconName = keyof typeof iconMap;
const iconMap = {
  Mail,
  Phone,
  MapPin,
  Clock,
  GitBranch,
  ExternalLink,
  Send,
};

export default function Contact() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const reducedMotion = prefersReducedMotion();
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Attach micro-interactions on mount
  useEffect(() => {
    if (reducedMotion) return;

    const cleanupHandlers: Array<{ el: HTMLElement; type: string; fn: EventListener }> = [];

    // Contact info cards
    cardRefs.current.forEach((el) => {
      if (!el) return;
      const handleEnter = () => animateCardHover(el, "hover");
      const handleLeave = () => animateCardHover(el, "leave");
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      cleanupHandlers.push({ el, type: "mouseenter", fn: handleEnter });
      cleanupHandlers.push({ el, type: "mouseleave", fn: handleLeave });
    });

    // Social links
    socialRefs.current.forEach((el) => {
      if (!el) return;
      const handleEnter = () => animateSocialHover(el, "hover");
      const handleLeave = () => animateSocialHover(el, "leave");
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      cleanupHandlers.push({ el, type: "mouseenter", fn: handleEnter });
      cleanupHandlers.push({ el, type: "mouseleave", fn: handleLeave });
    });

    // Hire me button
    const hireBtn = document.querySelector('[data-hire-btn]');
    if (hireBtn) {
      const hireBtnEl = hireBtn as HTMLElement;
      const handleEnter = () => animateButtonHover(hireBtnEl, "hover");
      const handleLeave = () => animateButtonHover(hireBtnEl, "leave");
      const handleTap = () => animateButtonHover(hireBtnEl, "tap");
      hireBtnEl.addEventListener("mouseenter", handleEnter);
      hireBtnEl.addEventListener("mouseleave", handleLeave);
      hireBtnEl.addEventListener("mousedown", handleTap);
      cleanupHandlers.push({ el: hireBtnEl, type: "mouseenter", fn: handleEnter });
      cleanupHandlers.push({ el: hireBtnEl, type: "mouseleave", fn: handleLeave });
      cleanupHandlers.push({ el: hireBtnEl, type: "mousedown", fn: handleTap });
    }

    // Cleanup function
    return () => {
      cleanupHandlers.forEach(({ el, type, fn }) => {
        el.removeEventListener(type, fn);
      });
    };
  }, [reducedMotion]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormState> = {};
    const validation = t("contact.form.validation", { returnObjects: true }) as {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      subjectRequired: string;
      messageRequired: string;
    };

    if (!formState.name.trim()) newErrors.name = validation.nameRequired;
    if (!formState.email.trim()) newErrors.email = validation.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) newErrors.email = validation.emailInvalid;
    if (!formState.subject.trim()) newErrors.subject = validation.subjectRequired;
    if (!formState.message.trim()) newErrors.message = validation.messageRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    setSubmitStatus("submitting");
    setErrors({});

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

  const contactInfo = t("contact.contactInfo", { returnObjects: true }) as ContactInfoItem[];
  const socialLinks = t("contact.socialLinks", { returnObjects: true }) as SocialLinkItem[];
  const formLabels = t("contact.form", { returnObjects: true }) as {
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    placeholder: { name: string; email: string; message: string };
    subjectOptions: { select: string; job: string; freelance: string; collaboration: string; mentoring: string; other: string };
    validation: { nameRequired: string; emailRequired: string; emailInvalid: string; subjectRequired: string; messageRequired: string };
  };
  const footer = t("contact", { returnObjects: true }) as {
    footerNote: string;
    privacyPolicy: string;
    termsOfService: string;
    bySubmitting: string;
  };
  const contactSection = t("contact", { returnObjects: true }) as {
    title: string;
    subtitle: string;
    description: string;
    connectWithMe: string;
    sendMessage: string;
    hireMe: string;
    downloadCv: string;
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
            {contactSection.title}
          </span>
          <h2 id="contact-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
            {contactSection.subtitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {contactSection.description}
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
            {contactInfo.map((item, index) => {
              const IconComponent = iconMap[item.icon as IconName];
              return (
                <motion.article
                  key={item.label}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  variants={cardVariants}
                  className="group relative flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {IconComponent && <IconComponent className="size-6" aria-hidden="true" />}
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
              )
            })}
          </div>

          {/* Social Links */}
          <motion.div
            variants={cardVariants}
            style={{ gridColumn: "span 1" }}
          >
            <h3 className="font-bold text-lg mb-4">{contactSection.connectWithMe}</h3>
            <div className="space-y-3" role="list" aria-label="Social links">
              {socialLinks.map((social, index) => {
                const SocialIcon = iconMap[social.icon as IconName];
                return (
                  <motion.a
                    key={social.label}
                    ref={(el) => { socialRefs.current[index] = el; }}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={socialVariants}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 ${social.color}`}
                  >
                    <SocialIcon className="size-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="font-medium">{social.label}</span>
                  <ArrowRight className="size-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </motion.a>
                )
              })}
            </div>

            {/* Quick CTA buttons */}
            <div className="mt-8 pt-6 border-t border-border space-y-3">
              <a
                data-hire-btn
                href="mailto:evanrafifpradana@gmail.com?subject=Job Opportunity&body=Hi Evan,%0D%0A%0D%0AI came across your portfolio and..."
                className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <Mail className="size-4" aria-hidden="true" />
                {contactSection.hireMe}
              </a>
              <a
                href="/cv.pdf"
                download
                className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border border-border hover:bg-accent/10 hover:border-primary/30 transition-all duration-300"
              >
                <FileText className="size-4" aria-hidden="true" />
                {contactSection.downloadCv}
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
              <h3 className="text-2xl font-bold tracking-tight mb-6">{contactSection.sendMessage}</h3>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Form fields grid */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {formLabels.name} <span className="text-primary" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                      placeholder={formLabels.placeholder.name}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {formLabels.email} <span className="text-primary" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                      placeholder={formLabels.placeholder.email}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    {formLabels.subject} <span className="text-primary" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  >
                    <option value="">{formLabels.subjectOptions.select}</option>
                    <option value="job">{formLabels.subjectOptions.job}</option>
                    <option value="freelance">{formLabels.subjectOptions.freelance}</option>
                    <option value="collaboration">{formLabels.subjectOptions.collaboration}</option>
                    <option value="mentoring">{formLabels.subjectOptions.mentoring}</option>
                    <option value="other">{formLabels.subjectOptions.other}</option>
                  </select>
                  {errors.subject && (
                    <p id="subject-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400" role="alert">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {formLabels.message} <span className="text-primary" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors placeholder:text-muted-foreground/50 resize-none"
                    placeholder={formLabels.placeholder.message}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400" role="alert">
                      {errors.message}
                    </p>
                  )}
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
                          {formLabels.sending}
                        </>
                      ) : submitStatus === "success" ? (
                        <>
                          <CheckCircle className="size-4" aria-hidden="true" />
                          {formLabels.success}
                        </>
                      ) : (
                        <>
                          <Send className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                          {formLabels.send}
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
                      role="alert"
                      aria-live="polite"
                      className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                    >
                      <CheckCircle className="size-4" />
                      {formLabels.success}
                    </motion.div>
                  )}
                </div>

                {/* Form footer */}
                <p className="text-xs text-muted-foreground/70 text-center">
                  {footer.bySubmitting}{' '}
                  <a href="#privacy" className="underline hover:text-primary transition-colors">
                    {footer.privacyPolicy}
                  </a>{' '}
                  &{' '}
                  <a href="#terms" className="underline hover:text-primary transition-colors">
                    {footer.termsOfService}
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
            {footer.footerNote}{' '}
            <a href="mailto:evanrafifpradana@gmail.com" className="font-medium text-primary hover:underline">
              evanrafifpradana@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}