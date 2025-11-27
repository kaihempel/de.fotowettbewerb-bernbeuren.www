import { login, home } from "@/routes";
import { store } from "@/routes/register";
import { Form, Head, Link } from "@inertiajs/react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
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

export default function Register() {
  const { t } = useTranslation("auth");

  return (
    <GlobalLayout>
      <Head title={t("register.submit")} />

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
                  <h1 className="text-xl font-medium">{t("register.title")}</h1>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("register.description")}
                  </p>
                </div>
              </div>
            }
          />
          <OxCard.Body>
            <Form
              {...store.form()}
              resetOnSuccess={["password", "password_confirmation"]}
              disableWhileProcessing
              className="flex flex-col gap-6"
            >
              {({ processing, errors }) => (
                <>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <OxLabel htmlFor="name">{t("register.name")}</OxLabel>
                      <OxTextInput.Container error={!!errors.name}>
                        <OxTextInput
                          id="name"
                          name="name"
                          autoComplete="name"
                          placeholder={t("register.namePlaceholder")}
                        />
                      </OxTextInput.Container>
                      <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                      <OxLabel htmlFor="email">{t("register.email")}</OxLabel>
                      <OxTextInput.Container
                        type="email"
                        error={!!errors.email}
                      >
                        <OxTextInput
                          id="email"
                          name="email"
                          autoComplete="email"
                          placeholder="email@example.com"
                        />
                      </OxTextInput.Container>
                      <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                      <OxLabel htmlFor="password">
                        {t("register.password")}
                      </OxLabel>
                      <OxTextInput.Container
                        type="password"
                        error={!!errors.password}
                      >
                        <OxTextInput
                          id="password"
                          name="password"
                          autoComplete="new-password"
                          placeholder={t("register.password")}
                        />
                        <OxTextInput.VisibilityButton />
                      </OxTextInput.Container>
                      <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                      <OxLabel htmlFor="password_confirmation">
                        {t("register.confirmPassword")}
                      </OxLabel>
                      <OxTextInput.Container
                        type="password"
                        error={!!errors.password_confirmation}
                      >
                        <OxTextInput
                          id="password_confirmation"
                          name="password_confirmation"
                          autoComplete="new-password"
                          placeholder={t("register.confirmPassword")}
                        />
                        <OxTextInput.VisibilityButton />
                      </OxTextInput.Container>
                      <InputError message={errors.password_confirmation} />
                    </div>

                    <OxButton
                      type="submit"
                      variant="primary"
                      className="mt-2 w-full"
                      tabIndex={5}
                      data-test="register-user-button"
                    >
                      {processing && <OxSpinner />}
                      {t("register.submit")}
                    </OxButton>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    {t("register.hasAccount")}{" "}
                    <TextLink href={login()} tabIndex={6}>
                      {t("register.login")}
                    </TextLink>
                  </div>
                </>
              )}
            </Form>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
