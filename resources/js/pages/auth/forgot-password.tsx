// Components
import { login, home } from "@/routes";
import { email } from "@/routes/password";
import { Form, Head, Link } from "@inertiajs/react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import GlobalLayout from "@/layouts/global-layout";
import AppLogoIcon from "@/components/app-logo-icon";
import {
  OxAlert,
  OxButton,
  OxLabel,
  OxSpinner,
  OxTextInput,
  OxCard,
} from "@noxickon/onyx";
import { mdiCheckCircle } from "@mdi/js";
import { useTranslation } from "react-i18next";

export default function ForgotPassword({ status }: { status?: string }) {
  const { t } = useTranslation("auth");

  return (
    <GlobalLayout>
      <Head title={t("forgotPassword.title")} />

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
                    {t("forgotPassword.title")}
                  </h1>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("forgotPassword.description")}
                  </p>
                </div>
              </div>
            }
          />
          <OxCard.Body>
            {status && (
              <OxAlert type="success" className="mb-4">
                <OxAlert.Icon
                  path={mdiCheckCircle}
                  iconClass="text-green-400"
                  iconDivClass="bg-green-500/20"
                />
                <span className="text-green-800 dark:text-green-200">
                  {status}
                </span>
              </OxAlert>
            )}

            <div className="space-y-6">
              <Form {...email.form()}>
                {({ processing, errors }) => (
                  <>
                    <div className="grid gap-2">
                      <OxLabel htmlFor="email">
                        {t("forgotPassword.email")}
                      </OxLabel>
                      <OxTextInput.Container
                        type="email"
                        error={!!errors.email}
                      >
                        <OxTextInput
                          id="email"
                          name="email"
                          autoComplete="off"
                          placeholder="email@example.com"
                        />
                      </OxTextInput.Container>

                      <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                      <OxButton
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={processing}
                        data-test="email-password-reset-link-button"
                      >
                        {processing && <OxSpinner />}
                        {t("forgotPassword.submit")}
                      </OxButton>
                    </div>
                  </>
                )}
              </Form>

              <div className="space-x-1 text-center text-sm text-muted-foreground">
                <span>{t("forgotPassword.backToLogin")}</span>
                <TextLink href={login()}>{t("forgotPassword.loginLink")}</TextLink>
              </div>
            </div>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
