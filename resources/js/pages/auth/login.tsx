import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import AuthLayout from "@/layouts/auth-layout";
import { register } from "@/routes";
import { store } from "@/routes/login";
import { request } from "@/routes/password";
import { OxButton, OxCheckbox, OxLabel, OxSpinner, OxTextInput } from "@noxickon/onyx";
import { Form, Head } from "@inertiajs/react";

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
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={["password"]}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <OxLabel htmlFor="email">Email address</OxLabel>
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
                                    <OxLabel htmlFor="password">Password</OxLabel>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot password?
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
                                        placeholder="Password"
                                    />
                                    <OxTextInput.VisibilityButton />
                                </OxTextInput.Container>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <OxCheckbox id="remember" name="remember" />
                                <OxLabel htmlFor="remember">Remember me</OxLabel>
                            </div>

                            <OxButton
                                type="submit"
                                variant="primary"
                                className="mt-4 w-full"
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <OxSpinner />}
                                Log in
                            </OxButton>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
