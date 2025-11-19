// Components
import { login } from "@/routes";
import { email } from "@/routes/password";
import { Form, Head } from "@inertiajs/react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import AuthLayout from "@/layouts/auth-layout";
import { OxAlert, OxButton, OxLabel, OxSpinner, OxTextInput } from "@noxickon/onyx";
import { mdiCheckCircle } from "@mdi/js";

export default function ForgotPassword({ status }: { status?: string }) {
  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email to receive a password reset link"
    >
      <Head title="Forgot password" />

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
                <OxLabel htmlFor="email">Email address</OxLabel>
                <OxTextInput.Container type="email" error={!!errors.email}>
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
                  Email password reset link
                </OxButton>
              </div>
            </>
          )}
        </Form>

        <div className="space-x-1 text-center text-sm text-muted-foreground">
          <span>Or, return to</span>
          <TextLink href={login()}>log in</TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}
