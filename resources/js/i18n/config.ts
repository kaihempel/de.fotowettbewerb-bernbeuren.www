import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import deAuth from "./locales/de/auth.json";
import deCommon from "./locales/de/common.json";
import deContent from "./locales/de/content.json";
import deDashboard from "./locales/de/dashboard.json";
import deGallery from "./locales/de/gallery.json";
import deSettings from "./locales/de/settings.json";
import deSubmissions from "./locales/de/submissions.json";
import deValidation from "./locales/de/validation.json";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enContent from "./locales/en/content.json";
import enDashboard from "./locales/en/dashboard.json";
import enGallery from "./locales/en/gallery.json";
import enSettings from "./locales/en/settings.json";
import enSubmissions from "./locales/en/submissions.json";
import enValidation from "./locales/en/validation.json";

// Define available namespaces
export const NAMESPACES = [
  "common",
  "auth",
  "dashboard",
  "gallery",
  "submissions",
  "settings",
  "validation",
  "content",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

// Define supported locales
export const SUPPORTED_LOCALES = ["de", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "de";
export const DEFAULT_NAMESPACE: Namespace = "common";

// Translation resources
export const resources = {
  de: {
    auth: deAuth,
    common: deCommon,
    content: deContent,
    dashboard: deDashboard,
    gallery: deGallery,
    settings: deSettings,
    submissions: deSubmissions,
    validation: deValidation,
  },
  en: {
    auth: enAuth,
    common: enCommon,
    content: enContent,
    dashboard: enDashboard,
    gallery: enGallery,
    settings: enSettings,
    submissions: enSubmissions,
    validation: enValidation,
  },
} as const;

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: DEFAULT_NAMESPACE,
    ns: [DEFAULT_NAMESPACE, "auth", "content", "dashboard", "gallery", "settings", "submissions", "validation"], // All namespaces
    supportedLngs: [...SUPPORTED_LOCALES],

    interpolation: {
      // React already escapes values to prevent XSS
      escapeValue: false,
    },

    detection: {
      // Order of language detection
      order: ["localStorage", "navigator"],
      // Cache the detected language in localStorage
      caches: ["localStorage"],
      // Key used in localStorage
      lookupLocalStorage: "locale",
    },

    react: {
      // Suspend while translations are loading
      useSuspense: false,
    },
  });

/**
 * Initialize i18n with a specific locale from server props
 * @param locale - The locale to set (from Inertia shared props)
 */
export function initializeI18n(locale?: string): void {
  if (locale && SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    i18n.changeLanguage(locale);
  }
}

export default i18n;
