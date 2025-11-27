import { router, usePage } from "@inertiajs/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { update as localeUpdate } from "@/actions/App/Http/Controllers/LocaleController";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/i18n/config";
import type { SharedData } from "@/types";

interface UseLocaleReturn {
  /** Current active locale */
  locale: SupportedLocale;
  /** List of available locales from server */
  availableLocales: SupportedLocale[];
  /** Change the current locale */
  switchLocale: (newLocale: SupportedLocale) => void;
  /** Check if a locale is currently active */
  isCurrentLocale: (locale: SupportedLocale) => boolean;
}

/**
 * Hook for managing application locale/language
 *
 * Provides the current locale, available locales, and a function to switch
 * between languages. Handles synchronization between i18next, localStorage,
 * and the server for authenticated users.
 *
 * @example
 * ```tsx
 * const { locale, availableLocales, switchLocale } = useLocale();
 *
 * return (
 *   <select value={locale} onChange={(e) => switchLocale(e.target.value as SupportedLocale)}>
 *     {availableLocales.map((loc) => (
 *       <option key={loc} value={loc}>{loc}</option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function useLocale(): UseLocaleReturn {
  const { i18n } = useTranslation();
  const { props } = usePage<SharedData>();

  // Get current locale from i18next (source of truth for frontend)
  const locale = (i18n.language as SupportedLocale) || DEFAULT_LOCALE;

  // Get available locales from server props or fall back to supported locales
  const availableLocales = (props.locales?.filter((l) =>
    SUPPORTED_LOCALES.includes(l as SupportedLocale),
  ) || [...SUPPORTED_LOCALES]) as SupportedLocale[];

  /**
   * Switch to a new locale
   *
   * 1. Updates localStorage for persistence
   * 2. Changes i18next language (triggers React re-render)
   * 3. Posts to /locale endpoint to update server preference (for authenticated users)
   */
  const switchLocale = useCallback(
    (newLocale: SupportedLocale) => {
      // Validate the locale
      if (!SUPPORTED_LOCALES.includes(newLocale)) {
        console.warn(`Unsupported locale: ${newLocale}`);
        return;
      }

      // Skip if already on this locale
      if (newLocale === locale) {
        return;
      }

      // Update localStorage for client-side persistence
      localStorage.setItem("locale", newLocale);

      // Change i18next language (this triggers React re-render)
      i18n.changeLanguage(newLocale);

      // Post to server to update preference (for authenticated users and session)
      router.post(
        localeUpdate.url(),
        { locale: newLocale },
        {
          preserveState: true,
          preserveScroll: true,
          // Silently handle errors - locale switch should still work client-side
          onError: () => {
            // Locale is still changed client-side, server sync failed silently
          },
        },
      );
    },
    [i18n, locale],
  );

  /**
   * Check if a locale is currently active
   */
  const isCurrentLocale = useCallback(
    (checkLocale: SupportedLocale) => locale === checkLocale,
    [locale],
  );

  return {
    locale,
    availableLocales,
    switchLocale,
    isCurrentLocale,
  };
}

export type { UseLocaleReturn, SupportedLocale };
