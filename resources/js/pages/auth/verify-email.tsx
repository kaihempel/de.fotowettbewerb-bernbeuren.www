// Components
import TextLink from "@/components/text-link";
import GlobalLayout from "@/layouts/global-layout";
import AppLogoIcon from "@/components/app-logo-icon";
import { logout, home } from "@/routes";
import { send } from "@/routes/verification";
import { OxAlert, OxButton, OxSpinner, OxCard } from "@noxickon/onyx";
import { mdiCheckCircle } from "@mdi/js";
import { Form, Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function VerifyEmail({ status }: { status?: string }) {
  const { t } = useTranslation("auth");

  return (
    <GlobalLayout>
      <Head title={t("verifyEmail.title")} />

      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center">
        <OxCard className="w-full">
          <OxCard.Header
            title={
              <div className="flex flex-col items-center gap-4">
                <Link
                  href={home()}
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                    <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                  </div>
                </Link>
                <div className="space-y-2 text-center">
                  <h1 className="text-xl font-medium">
                    {t("verifyEmail.title")}
                  </h1>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("verifyEmail.description")}
                  </p>
                </div>
              </div>
            }
          />
          <OxCard.Body>
            {status === "verification-link-sent" && (
              <OxAlert type="success" className="mb-4">
                <OxAlert.Icon
                  path={mdiCheckCircle}
                  iconClass="text-green-400"
                  iconDivClass="bg-green-500/20"
                />
                <span className="text-green-800 dark:text-green-200">
                  {t("verifyEmail.sent")}
                </span>
              </OxAlert>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
              {({ processing }) => (
                <>
                  <OxButton
                    type="submit"
                    variant="secondary"
                    disabled={processing}
                  >
                    {processing && <OxSpinner />}
                    {t("verifyEmail.resend")}
                  </OxButton>

                  <TextLink href={logout()} className="mx-auto block text-sm">
                    {t("verifyEmail.logout")}
                  </TextLink>
                </>
              )}
            </Form>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
