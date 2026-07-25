"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const handleChange = (lang: "en" | "id") => {
    setLanguage(lang);
  };

  // Get localized name for the target language
  const targetLanguageLabel = language === "en" ? t("language.id") : t("language.en");

  return (
    <div className="relative inline-flex items-center">
      <label
        htmlFor="language-select"
        className="sr-only"
      >
        {t("language.switchTo", { lang: targetLanguageLabel })}
      </label>

      <select
        id="language-select"
        value={language}
        onChange={(e) => handleChange(e.target.value as "en" | "id")}
        className={cn(
          "appearance-none bg-background/80 backdrop-blur-sm border border-border",
          "text-sm font-medium px-3 py-1.5 rounded-full pr-10",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "cursor-pointer transition-all duration-200",
          "hover:border-primary/50",
          "min-w-[100px] text-center"
        )}
        aria-label={t("language.switchTo", { lang: targetLanguageLabel })}
      >
        <option value="en">🇺🇸 {t("language.en")}</option>
        <option value="id">🇮🇩 {t("language.id")}</option>
      </select>

      <div
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
          "size-4 flex items-center justify-center",
          reducedMotion ? "transition-none" : "transition-transform duration-200"
        )}
        aria-hidden="true"
      >
        <svg
          className="size-3.5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}