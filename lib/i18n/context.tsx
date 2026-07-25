"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
// Import from lib/i18n/locales which are copied from public/locales
import enMessages from "./locales/en.json";
import idMessages from "./locales/id.json";
import type { Locale } from "./types";

type Language = Locale;

// More permissive type that allows arrays and nested objects
interface TranslationMessages {
  [key: string]: string | TranslationMessages | TranslationMessages[] | unknown;
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: {
    (key: string, params?: Record<string, string>): string;
    (key: string, options: { returnObjects: true }): unknown;
  };
  messages: TranslationMessages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const allMessages: Record<Language, TranslationMessages> = {
  en: enMessages as TranslationMessages,
  id: idMessages as TranslationMessages,
};

/**
 * Get initial language from localStorage.
 * Returns "en" on SSR (no window) or if localStorage is unavailable/invalid.
 * This ensures SSR/client hydration match by defaulting to English server-side.
 */
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("language") as Language | null;
    return saved === "en" || saved === "id" ? saved : "en";
  } catch {
    return "en";
  }
}

/**
 * Look up a nested translation key in the given messages object.
 * Returns the translation value (string or object) or undefined if not found.
 */
function lookupValue(messages: TranslationMessages, key: string): unknown {
  const keys = key.split(".");
  let value: unknown = messages;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as TranslationMessages)[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Look up a nested translation key with fallback to English.
 * Returns the translation string or the original key if not found.
 */
function lookupTranslation(messages: Record<Language, TranslationMessages>, language: Language, key: string): string {
  let value = lookupValue(messages[language], key);

  if (value === undefined) {
    value = lookupValue(messages.en, key);
  }

  return typeof value === "string" ? value : key;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    try { localStorage.setItem("language", lang); } catch {}
  }, []);

  const messages = allMessages[language];

  // t function with overloads for returnObjects
  const translate = useCallback(
    (key: string, options?: Record<string, string> | { returnObjects: true }): string | unknown => {
      const currentMessages = allMessages[language];

      // Handle returnObjects option
      if (options && "returnObjects" in options && options.returnObjects === true) {
        let value = lookupValue(currentMessages, key);

        if (value === undefined) {
          value = lookupValue(allMessages.en, key);
        }

        return value;
      }

      // Default string translation
      let result = lookupTranslation(allMessages, language, key);
      if (options && !("returnObjects" in options)) {
        Object.entries(options as Record<string, string>).forEach(([paramKey, paramValue]) => {
          result = result.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, "g"), paramValue);
        });
      }
      return result;
    },
    [language]
  ) as {
    (key: string, params?: Record<string, string>): string;
    (key: string, options: { returnObjects: true }): unknown;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translate, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation must be used within an I18nProvider");
  return context;
}