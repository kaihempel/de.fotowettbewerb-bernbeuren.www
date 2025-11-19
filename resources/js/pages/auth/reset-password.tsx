import { update } from "@/routes/password";
import { Form, Head } from "@inertiajs/react";

import InputError from "@/components/input-error";
import AuthLayout from "@/layouts/auth-layout";
import { OxButton, OxLabel, OxSpinner, OxTextInput } from "@noxickon/onyx";

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  return (
    <AuthLayout
      title="Reset password"
      description="Please enter your new password below"
    >
      <Head title="Reset password" />

      <Form
        {...update.form()}
        transform={(data) => ({ ...data, token, email })}
        resetOnSuccess={["password", "password_confirmation"]}
      >
        {({ processing, errors }) => (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <OxLabel htmlFor="email">Email</OxLabel>
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
              <OxLabel htmlFor="password">Password</OxLabel>
              <OxTextInput.Container type="password" error={!!errors.password}>
                <OxTextInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                />
                <OxTextInput.VisibilityButton />
              </OxTextInput.Container>
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <OxLabel htmlFor="password_confirmation">Confirm password</OxLabel>
              <OxTextInput.Container type="password" error={!!errors.password_confirmation}>
                <OxTextInput
                  id="password_confirmation"
                  name="password_confirmation"
                  autoComplete="new-password"
                  placeholder="Confirm password"
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
              Reset password
            </OxButton>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}
