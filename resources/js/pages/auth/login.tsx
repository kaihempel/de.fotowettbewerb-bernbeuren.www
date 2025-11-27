import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import GlobalLayout from "@/layouts/global-layout";
import { register } from "@/routes";
import { store } from "@/routes/login";
import { request } from "@/routes/password";
import {
  OxButton,
  OxCheckbox,
  OxLabel,
  OxSpinner,
  OxTextInput,
  OxCard,
} from "@noxickon/onyx";
import { Form, Head } from "@inertiajs/react";
import AppLogoIcon from "@/components/app-logo-icon";
import { Link } from "@inertiajs/react";
import { home } from "@/routes";
import { useTranslation } from "react-i18next";

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
}

export default function Login({
  status,
  canResetPassword,
  canRegister,
}: LoginProps) {
  const { t } = useTranslation("auth");

  return (
    <GlobalLayout>
      <Head title={t("login.submit")} />

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
                  <h1 className="text-xl font-medium">{t("login.title")}</h1>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("login.description")}
                  </p>
                </div>
              </div>
            }
          />
          <OxCard.Body>
            <Form
              {...store.form()}
              resetOnSuccess={["password"]}
              className="flex flex-col gap-6"
            >
              {({ processing, errors }) => (
                <>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <OxLabel htmlFor="email">{t("login.email")}</OxLabel>
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
                      <div className="flex items-center">
                        <OxLabel htmlFor="password">
                          {t("login.password")}
                        </OxLabel>
                        {canResetPassword && (
                          <TextLink
                            href={request()}
                            className="ml-auto text-sm"
                            tabIndex={5}
                          >
                            {t("login.forgotPassword")}
                          </TextLink>
                        )}
                      </div>
                      <OxTextInput.Container
                        type="password"
                        error={!!errors.password}
                      >
                        <OxTextInput
                          id="password"
                          name="password"
                          autoComplete="current-password"
                          placeholder={t("login.password")}
                        />
                        <OxTextInput.VisibilityButton />
                      </OxTextInput.Container>
                      <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                      <OxCheckbox id="remember" name="remember" />
                      <OxLabel htmlFor="remember">
                        {t("login.rememberMe")}
                      </OxLabel>
                    </div>

                    <OxButton
                      type="submit"
                      variant="primary"
                      className="mt-4 w-full"
                      disabled={processing}
                      data-test="login-button"
                    >
                      {processing && <OxSpinner />}
                      {t("login.submit")}
                    </OxButton>
                  </div>

                  {canRegister && (
                    <div className="text-center text-sm text-muted-foreground">
                      {t("login.noAccount")}{" "}
                      <TextLink href={register()} tabIndex={5}>
                        {t("login.register")}
                      </TextLink>
                    </div>
                  )}
                </>
              )}
            </Form>

            {status && (
              <div className="mt-4 text-center text-sm font-medium text-green-600">
                {status}
              </div>
            )}
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
