import { Head } from "@inertiajs/react";

import AppearanceTabs from "@/components/appearance-tabs";
import HeadingSmall from "@/components/heading-small";

import GlobalLayout from "@/layouts/global-layout";
import SettingsLayout from "@/layouts/settings/layout";

export default function Appearance() {
  return (
    <GlobalLayout>
      <Head title="Appearance settings" />

      <div className="mx-auto max-w-4xl">
        <SettingsLayout>
          <div className="space-y-6">
            <HeadingSmall
              title="Appearance settings"
              description="Update your account's appearance settings"
            />
            <AppearanceTabs />
          </div>
        </SettingsLayout>
      </div>
    </GlobalLayout>
  );
}
