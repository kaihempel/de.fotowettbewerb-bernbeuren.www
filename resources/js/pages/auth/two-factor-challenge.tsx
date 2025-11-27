import InputError from "@/components/input-error";
import { OTP_MAX_LENGTH } from "@/hooks/use-two-factor-auth";
import GlobalLayout from "@/layouts/global-layout";
import AppLogoIcon from "@/components/app-logo-icon";
import { home } from "@/routes";
import { store } from "@/routes/two-factor/login";
import { OxButton, OxOtpInput, OxTextInput, OxCard } from "@noxickon/onyx";
import { Form, Head, Link } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TwoFactorChallenge() {
  const { t } = useTranslation("auth");
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const authConfigContent = useMemo<{
    title: string;
    description: string;
    toggleText: string;
  }>(() => {
    if (showRecoveryInput) {
      return {
        title: t("twoFactor.recoveryCode.title"),
        description: t("twoFactor.recoveryCode.description"),
        toggleText: t("twoFactor.authenticationCode.toggleText"),
      };
    }

    return {
      title: t("twoFactor.authenticationCode.title"),
      description: t("twoFactor.authenticationCode.description"),
      toggleText: t("twoFactor.recoveryCode.toggleText"),
    };
  }, [showRecoveryInput, t]);

  const toggleRecoveryMode = (clearErrors: () => void): void => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode("");
  };

  return (
    <GlobalLayout>
      <Head title={t("twoFactor.title")} />

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
                    {authConfigContent.title}
                  </h1>
                  <p className="text-center text-sm text-muted-foreground">
                    {authConfigContent.description}
                  </p>
                </div>
              </div>
            }
          />
          <OxCard.Body>
            <div className="space-y-6">
              <Form
                {...store.form()}
                className="space-y-4"
                resetOnError
                resetOnSuccess={!showRecoveryInput}
              >
                {({ errors, processing, clearErrors }) => (
                  <>
                    {showRecoveryInput ? (
                      <>
                        <OxTextInput.Container error={!!errors.recovery_code}>
                          <OxTextInput
                            name="recovery_code"
                            placeholder={t("twoFactor.recoveryCode.placeholder")}
                          />
                        </OxTextInput.Container>
                        <InputError message={errors.recovery_code} />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-3 text-center">
                        <div className="flex w-full items-center justify-center">
                          <input type="hidden" name="code" value={code} />
                          <OxOtpInput
                            length={OTP_MAX_LENGTH}
                            onValueChange={(value) => setCode(value)}
                            disabled={processing}
                            type="numeric"
                            error={!!errors.code}
                          />
                        </div>
                        <InputError message={errors.code} />
                      </div>
                    )}

                    <OxButton
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={processing}
                    >
                      {t("twoFactor.continue")}
                    </OxButton>

                    <div className="text-center text-sm text-muted-foreground">
                      <span>{t("twoFactor.orYouCan")} </span>
                      <button
                        type="button"
                        className="cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                        onClick={() => toggleRecoveryMode(clearErrors)}
                      >
                        {authConfigContent.toggleText}
                      </button>
                    </div>
                  </>
                )}
              </Form>
            </div>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
