import { useTranslation } from "react-i18next";
import { Link, router } from "@inertiajs/react";
import { Globe, LogOut, Settings } from "lucide-react";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/user-info";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { useLocale, type SupportedLocale } from "@/hooks/use-locale";
import { logout } from "@/routes";
import { edit } from "@/routes/profile";
import { type User } from "@/types";
import { cn } from "@/lib/utils";

interface LocaleConfig {
  code: SupportedLocale;
  label: string;
  flag: string;
}

const LOCALE_CONFIG: LocaleConfig[] = [
  { code: "de", label: "Deutsch", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  { code: "en", label: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
];

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const { t } = useTranslation();
  const cleanup = useMobileNavigation();
  const { switchLocale, isCurrentLocale } = useLocale();

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  const handleLocaleSwitch = (newLocale: SupportedLocale) => {
    switchLocale(newLocale);
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="block w-full"
            href={edit()}
            as="button"
            prefetch
            onClick={cleanup}
          >
            <Settings className="mr-2" />
            {t("navigation.settings")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe className="mr-2 size-4" />
            <span>{t("locale.label")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {LOCALE_CONFIG.map((config) => (
              <DropdownMenuItem
                key={config.code}
                onClick={() => handleLocaleSwitch(config.code)}
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
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link
          className="block w-full"
          href={logout()}
          as="button"
          onClick={handleLogout}
          data-test="logout-button"
        >
          <LogOut className="mr-2" />
          {t("navigation.logout")}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
