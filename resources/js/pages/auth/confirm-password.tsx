import InputError from "@/components/input-error";
import GlobalLayout from "@/layouts/global-layout";
import AppLogoIcon from "@/components/app-logo-icon";
import { home } from "@/routes";
import { store } from "@/routes/password/confirm";
import {
  OxButton,
  OxLabel,
  OxSpinner,
  OxTextInput,
  OxCard,
} from "@noxickon/onyx";
import { Form, Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function ConfirmPassword() {
  const { t } = useTranslation("auth");

  return (
    <GlobalLayout>
      <Head title={t("confirmPassword.title")} />

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
                    {t("confirmPassword.title")}
                  </h1>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("confirmPassword.description")}
                  </p>
                </div>
              </div>
            }
          />
          <OxCard.Body>
            <Form {...store.form()} resetOnSuccess={["password"]}>
              {({ processing, errors }) => (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <OxLabel htmlFor="password">
                      {t("confirmPassword.password")}
                    </OxLabel>
                    <OxTextInput.Container
                      type="password"
                      error={!!errors.password}
                    >
                      <OxTextInput
                        id="password"
                        name="password"
                        placeholder={t("confirmPassword.password")}
                        autoComplete="current-password"
                      />
                      <OxTextInput.VisibilityButton />
                    </OxTextInput.Container>

                    <InputError message={errors.password} />
                  </div>

                  <div className="flex items-center">
                    <OxButton
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={processing}
                      data-test="confirm-password-button"
                    >
                      {processing && <OxSpinner />}
                      {t("confirmPassword.submit")}
                    </OxButton>
                  </div>
                </div>
              )}
            </Form>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
