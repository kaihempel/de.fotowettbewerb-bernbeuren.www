import InputError from "@/components/input-error";
import AuthLayout from "@/layouts/auth-layout";
import { store } from "@/routes/password/confirm";
import { OxButton, OxLabel, OxSpinner, OxTextInput } from "@noxickon/onyx";
import { Form, Head } from "@inertiajs/react";

export default function ConfirmPassword() {
  return (
    <AuthLayout
      title="Confirm your password"
      description="This is a secure area of the application. Please confirm your password before continuing."
    >
      <Head title="Confirm password" />

      <Form {...store.form()} resetOnSuccess={["password"]}>
        {({ processing, errors }) => (
          <div className="space-y-6">
            <div className="grid gap-2">
              <OxLabel htmlFor="password">Password</OxLabel>
              <OxTextInput.Container type="password" error={!!errors.password}>
                <OxTextInput
                  id="password"
                  name="password"
                  placeholder="Password"
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
                Confirm password
              </OxButton>
            </div>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}
