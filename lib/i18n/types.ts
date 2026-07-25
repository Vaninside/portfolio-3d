/**
 * Type-safe translation keys for the portfolio i18n system.
 * This explicitly defines all valid translation keys for autocomplete support.
 */

import type enMessages from "./locales/en.json";

/**
 * Recursive type to flatten nested object keys with dot notation.
 * E.g., { a: { b: "value" } } becomes "a.b"
 */
export type FlattenKeys<T, Prefix extends string = ""> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends Record<string, unknown>
          ? FlattenKeys<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

/** All valid translation keys with autocomplete support */
export type TranslationKey = FlattenKeys<typeof enMessages>;

/** Locale type with autocomplete */
export type Locale = "en" | "id";

/**
 * Explicit list of all translation sections for documentation/reference.
 * This ensures TypeScript recognizes all keys properly.
 */
export type TranslationSections =
  | "nav"
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "organization"
  | "contact"
  | "footer"
  | "language";