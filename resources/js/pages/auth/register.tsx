import { login } from "@/routes";
import { store } from "@/routes/register";
import { Form, Head } from "@inertiajs/react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import AuthLayout from "@/layouts/auth-layout";
import { OxButton, OxLabel, OxSpinner, OxTextInput } from "@noxickon/onyx";

export default function Register() {
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <Head title="Register" />
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
                <OxLabel htmlFor="name">Name</OxLabel>
                <OxTextInput.Container error={!!errors.name}>
                  <OxTextInput
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Full name"
                  />
                </OxTextInput.Container>
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="grid gap-2">
                <OxLabel htmlFor="email">Email address</OxLabel>
                <OxTextInput.Container type="email" error={!!errors.email}>
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
                Create account
              </OxButton>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <TextLink href={login()} tabIndex={6}>
                Log in
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
