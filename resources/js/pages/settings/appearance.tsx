import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

import AppearanceTabs from "@/components/appearance-tabs";
import HeadingSmall from "@/components/heading-small";

import GlobalLayout from "@/layouts/global-layout";
import SettingsLayout from "@/layouts/settings/layout";

export default function Appearance() {
  const { t } = useTranslation("settings");

  return (
    <GlobalLayout>
      <Head title={t("appearance.pageTitle")} />

      <div className="mx-auto max-w-4xl">
        <SettingsLayout>
          <div className="space-y-6">
            <HeadingSmall
              title={t("appearance.title")}
              description={t("appearance.description")}
            />
            <AppearanceTabs />
          </div>
        </SettingsLayout>
      </div>
    </GlobalLayout>
  );
}
