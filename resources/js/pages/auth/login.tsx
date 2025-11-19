import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import GlobalLayout from "@/layouts/global-layout";
import { register } from "@/routes";
import { store } from "@/routes/login";
import { request } from "@/routes/password";
import { OxButton, OxCheckbox, OxLabel, OxSpinner, OxTextInput, OxCard } from "@noxickon/onyx";
import { Form, Head } from "@inertiajs/react";
import AppLogoIcon from "@/components/app-logo-icon";
import { Link } from "@inertiajs/react";
import { home } from "@/routes";

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
        <GlobalLayout>
            <Head title="Log in" />

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
                                    <h1 className="text-xl font-medium">Log in to your account</h1>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Enter your email and password below to log in
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
