// Components
import TextLink from "@/components/text-link";
import AuthLayout from "@/layouts/auth-layout";
import { logout } from "@/routes";
import { send } from "@/routes/verification";
import { OxAlert, OxButton, OxSpinner } from "@noxickon/onyx";
import { mdiCheckCircle } from "@mdi/js";
import { Form, Head } from "@inertiajs/react";

export default function VerifyEmail({ status }: { status?: string }) {
  return (
    <AuthLayout
      title="Verify email"
      description="Please verify your email address by clicking on the link we just emailed to you."
    >
      <Head title="Email verification" />

      {status === "verification-link-sent" && (
        <OxAlert type="success" className="mb-4">
          <OxAlert.Icon
            path={mdiCheckCircle}
            iconClass="text-green-400"
            iconDivClass="bg-green-500/20"
          />
          <span className="text-green-800 dark:text-green-200">
            A new verification link has been sent to the email address you
            provided during registration.
          </span>
        </OxAlert>
      )}

      <Form {...send.form()} className="space-y-6 text-center">
        {({ processing }) => (
          <>
            <OxButton
              type="submit"
              variant="secondary"
              disabled={processing}
            >
              {processing && <OxSpinner />}
              Resend verification email
            </OxButton>

            <TextLink href={logout()} className="mx-auto block text-sm">
              Log out
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
