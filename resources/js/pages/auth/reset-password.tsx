import { update } from "@/routes/password";
import { home } from "@/routes";
import { Form, Head, Link } from "@inertiajs/react";

import InputError from "@/components/input-error";
import GlobalLayout from "@/layouts/global-layout";
import AppLogoIcon from "@/components/app-logo-icon";
import {
  OxButton,
  OxLabel,
  OxSpinner,
  OxTextInput,
  OxCard,
} from "@noxickon/onyx";
import { useTranslation } from "react-i18next";

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const { t } = useTranslation("auth");

  return (
    <GlobalLayout>
      <Head title={t("resetPassword.title")} />

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
                    {t("resetPassword.title")}
                  </h1>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("resetPassword.description")}
                  </p>
                </div>
              </div>
            }
          />
          <OxCard.Body>
            <Form
              {...update.form()}
              transform={(data) => ({ ...data, token, email })}
              resetOnSuccess={["password", "password_confirmation"]}
            >
              {({ processing, errors }) => (
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <OxLabel htmlFor="email">{t("resetPassword.email")}</OxLabel>
                    <OxTextInput.Container type="email" disabled>
                      <OxTextInput
                        id="email"
                        name="email"
                        autoComplete="email"
                        readOnly
                        className="mt-1 block w-full"
                      />
                    </OxTextInput.Container>
                    <InputError message={errors.email} className="mt-2" />
                  </div>

                  <div className="grid gap-2">
                    <OxLabel htmlFor="password">
                      {t("resetPassword.password")}
                    </OxLabel>
                    <OxTextInput.Container
                      type="password"
                      error={!!errors.password}
                    >
                      <OxTextInput
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder={t("resetPassword.password")}
                      />
                      <OxTextInput.VisibilityButton />
                    </OxTextInput.Container>
                    <InputError message={errors.password} />
                  </div>

                  <div className="grid gap-2">
                    <OxLabel htmlFor="password_confirmation">
                      {t("resetPassword.confirmPassword")}
                    </OxLabel>
                    <OxTextInput.Container
                      type="password"
                      error={!!errors.password_confirmation}
                    >
                      <OxTextInput
                        id="password_confirmation"
                        name="password_confirmation"
                        autoComplete="new-password"
                        placeholder={t("resetPassword.confirmPassword")}
                      />
                      <OxTextInput.VisibilityButton />
                    </OxTextInput.Container>
                    <InputError
                      message={errors.password_confirmation}
                      className="mt-2"
                    />
                  </div>

                  <OxButton
                    type="submit"
                    variant="primary"
                    className="mt-4 w-full"
                    disabled={processing}
                    data-test="reset-password-button"
                  >
                    {processing && <OxSpinner />}
                    {t("resetPassword.submit")}
                  </OxButton>
                </div>
              )}
            </Form>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
