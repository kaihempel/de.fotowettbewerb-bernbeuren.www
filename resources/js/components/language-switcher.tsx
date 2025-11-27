import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, type SupportedLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** Visual variant of the switcher */
  variant?: "dropdown" | "inline";
  /** Additional CSS classes */
  className?: string;
  /** Show language labels (e.g., "Deutsch" vs just flag) */
  showLabel?: boolean;
  /** Size variant for the button */
  size?: "default" | "sm" | "icon";
}

interface LocaleConfig {
  code: SupportedLocale;
  label: string;
  flag: string;
}

const LOCALE_CONFIG: LocaleConfig[] = [
  { code: "de", label: "Deutsch", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  { code: "en", label: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
];

/**
 * Language switcher component for switching between supported locales
 *
 * Provides two visual variants:
 * - dropdown: Uses a dropdown menu with all available languages
 * - inline: Shows inline buttons for quick switching
 *
 * Features:
 * - Flag emoji indicators for each language
 * - Accessible with proper aria-labels
 * - Dark mode support
 * - Syncs with server for authenticated users
 */
export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  variant = "dropdown",
  className,
  showLabel = true,
  size = "default",
}) => {
  const { t } = useTranslation();
  const { locale, switchLocale, isCurrentLocale } = useLocale();

  const currentLocaleConfig = LOCALE_CONFIG.find(
    (config) => config.code === locale,
  );

  if (variant === "inline") {
    return (
      <div
        className={cn("flex items-center gap-1", className)}
        role="group"
        aria-label={t("locale.label")}
      >
        {LOCALE_CONFIG.map((config) => (
          <Button
            key={config.code}
            variant={isCurrentLocale(config.code) ? "secondary" : "ghost"}
            size={size === "icon" ? "icon" : "sm"}
            onClick={() => switchLocale(config.code)}
            aria-pressed={isCurrentLocale(config.code)}
            aria-label={config.label}
            className={cn(
              "transition-colors",
              isCurrentLocale(config.code) &&
                "bg-accent text-accent-foreground",
            )}
          >
            <span className="text-base" aria-hidden="true">
              {config.flag}
            </span>
            {showLabel && size !== "icon" && (
              <span className="ml-1">{config.code.toUpperCase()}</span>
            )}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className={cn(
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className,
          )}
          aria-label={t("accessibility.toggleLanguage")}
        >
          {size === "icon" ? (
            <Globe className="size-4" />
          ) : (
            <>
              <span className="text-base" aria-hidden="true">
                {currentLocaleConfig?.flag}
              </span>
              {showLabel && (
                <span className="ml-1">{currentLocaleConfig?.label}</span>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LOCALE_CONFIG.map((config) => (
          <DropdownMenuItem
            key={config.code}
            onClick={() => switchLocale(config.code)}
            className={cn(
              "cursor-pointer",
              isCurrentLocale(config.code) &&
                "bg-accent text-accent-foreground",
            )}
            aria-selected={isCurrentLocale(config.code)}
          >
            <span className="mr-2 text-base" aria-hidden="true">
              {config.flag}
            </span>
            <span>{config.label}</span>
            {isCurrentLocale(config.code) && (
              <span className="sr-only">({t("labels.status")}: active)</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
