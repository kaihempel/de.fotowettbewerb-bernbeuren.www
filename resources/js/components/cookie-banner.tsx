import type { FC } from "react";
import { router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { OxPopover, OxButton, OxHeading } from "@noxickon/onyx";
import type { SharedData } from "@/types";
import { accept as acceptCookieConsent } from "@/routes/cookie-consent";

/**
 * Cookie consent banner component
 * - Displays as a modal overlay when cookies haven't been accepted
 * - Uses OxPopover from @noxickon/onyx for consistent UI
 * - Manages consent state via Laravel session
 * - Translatable content via i18next
 */
export const CookieBanner: FC = () => {
  const { t } = useTranslation();
  const { cookies_accepted } = usePage<SharedData>().props;

  const handleAccept = () => {
    router.post(
      acceptCookieConsent.url(),
      {},
      {
        preserveScroll: true,
        preserveState: true,
      }
    );
  };

  // Don't render if cookies already accepted
  if (cookies_accepted) {
    return null;
  }

  return (
    <OxPopover open={true} defaultOpen={true}>
      <OxPopover.Content
        className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 transform rounded-lg border border-border bg-background p-6 shadow-lg sm:bottom-8"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <OxHeading as="h2" level={3} className="font-semibold">
            {t("cookies.title")}
          </OxHeading>

          <p className="text-sm text-muted-foreground">
            {t("cookies.description")}
          </p>

          <p className="text-xs text-muted-foreground">
            {t("cookies.learnMore")}
          </p>

          <div className="flex justify-end">
            <OxButton onClick={handleAccept} size="md">
              {t("cookies.accept")}
            </OxButton>
          </div>
        </div>
      </OxPopover.Content>
    </OxPopover>
  );
};
