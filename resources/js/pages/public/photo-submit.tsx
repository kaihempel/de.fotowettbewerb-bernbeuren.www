import { useState, useCallback, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { PhotoUpload } from "@/components/photo-upload";
import { OxButton, OxCard, OxAlert, OxTextInput, OxLabel, OxCheckbox } from "@noxickon/onyx";
import { PublicLayout } from "@/layouts/public-layout";
import { HCaptcha } from "@/components/hcaptcha";
import { cn } from "@/lib/utils";
import { mdiCheckCircle, mdiAlertCircle } from "@mdi/js";
import NProgress from "nprogress";
import type { PhotoSubmission, SharedData } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PublicPhotoSubmitProps {
  remainingSlots: number;
  submissions: {
    data: PhotoSubmission[];
  };
  flash?: {
    success?: string;
    error?: string;
    warning?: string;
  };
}

export default function PublicPhotoSubmit({
  remainingSlots,
  submissions,
  flash,
}: PublicPhotoSubmitProps) {
  const { t } = useTranslation(["submissions", "common"]);
  const { hcaptcha_sitekey } = usePage<SharedData>().props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [photographerName, setPhotographerName] = useState<string>("");
  const [photographerEmail, setPhotographerEmail] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState<string>(""); // Honeypot field
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);

  const hasReachedLimit = remainingSlots === 0;

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setUploadError(null);
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setUploadError(null);
  }, []);

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const handleUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedFile) {
        setUploadError(t("submissions:validation.photoRequired"));
        return;
      }

      if (!captchaToken) {
        setUploadError(t("submissions:captcha.required"));
        return;
      }

      if (!photographerName.trim()) {
        setUploadError(t("submissions:validation.nameRequired"));
        return;
      }

      if (!photographerEmail.trim()) {
        setUploadError(t("submissions:validation.emailRequired"));
        return;
      }

      if (!disclaimerAccepted) {
        setUploadError(t("submissions:validation.disclaimerRequired"));
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      NProgress.start();

      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("captcha_token", captchaToken);
      formData.append("photographer_name", photographerName.trim());
      formData.append("photographer_email", photographerEmail.trim());
      formData.append("disclaimer_accepted", disclaimerAccepted ? "1" : "0");
      formData.append("website", honeypot); // Honeypot field

      router.post("/submit-photo", formData, {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedFile(null);
          setPreview(null);
          setPhotographerName("");
          setPhotographerEmail("");
          setCaptchaToken(null);
          setDisclaimerAccepted(false);
          NProgress.done();
          setIsUploading(false);
        },
        onError: (errors) => {
          const errorMessage =
            errors.photo ||
            errors.photographer_name ||
            errors.photographer_email ||
            errors.captcha_token ||
            errors.disclaimer_accepted ||
            errors.general ||
            t("submissions:alerts.error.message");
          setUploadError(errorMessage);
          NProgress.done();
          setIsUploading(false);
        },
        onFinish: () => {
          NProgress.done();
          setIsUploading(false);
        },
      });
    },
    [selectedFile, captchaToken, photographerName, photographerEmail, disclaimerAccepted, honeypot, t],
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUploading]);

  return (
    <PublicLayout>
      <Head title={t("submissions:pageTitle")} />

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Flash Messages */}
        {flash?.success && (
          <OxAlert type="success">
            <OxAlert.Icon
              path={mdiCheckCircle}
              iconClass="text-green-400"
              iconDivClass="bg-green-500/20"
            />
            <span className="text-green-800 dark:text-green-200">
              <strong className="text-green-900 dark:text-green-100">
                {t("submissions:alerts.success.title")}
              </strong>
              <br />
              {flash.success}
            </span>
          </OxAlert>
        )}

        {flash?.error && (
          <OxAlert type="error">
            <OxAlert.Icon
              path={mdiAlertCircle}
              iconClass="text-red-400"
              iconDivClass="bg-red-500/20"
            />
            <span>
              <strong>{t("submissions:alerts.error.title")}</strong>
              <br />
              {flash.error}
            </span>
          </OxAlert>
        )}

        {/* Upload Card */}
        <OxCard>
          <OxCard.Header
            title={t("submissions:card.title")}
            subtitle={t("submissions:card.subtitle")}
            action={
              <div className="shrink-0">
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 text-center",
                    hasReachedLimit
                      ? "bg-destructive/10 dark:bg-destructive/20"
                      : "bg-primary/10 dark:bg-primary/20",
                  )}
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("submissions:counter.label")}
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      hasReachedLimit
                        ? "text-destructive"
                        : "text-primary dark:text-primary",
                    )}
                  >
                    {3 - remainingSlots}/3
                  </p>
                </div>
              </div>
            }
          />

          <OxCard.Body>
            {hasReachedLimit ? (
              <OxAlert type="error">
                <OxAlert.Icon
                  path={mdiAlertCircle}
                  iconClass="text-red-400"
                  iconDivClass="bg-red-500/20"
                />
                <span>
                  <strong>{t("submissions:alerts.maxReached.title")}</strong>
                  <br />
                  {t("submissions:alerts.maxReached.message")}
                </span>
              </OxAlert>
            ) : (
              <form onSubmit={handleUpload} className="space-y-6">
                <PhotoUpload
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onClearFile={handleClearFile}
                  isUploading={isUploading}
                  preview={preview}
                  error={uploadError}
                  warning={flash?.warning || null}
                />

                {/* Photographer Information (Required) */}
                <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">
                      {t("submissions:photographerInfo.title")}{" "}
                      <span className="text-destructive">{t("submissions:photographerInfo.required")}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions:photographerInfo.description")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <OxLabel htmlFor="photographer_name" required>
                        {t("submissions:form.photographerName")}
                      </OxLabel>
                      <OxTextInput.Container
                        value={photographerName}
                        onChange={(val) => setPhotographerName(val)}
                        disabled={isUploading}
                        required
                      >
                        <OxTextInput
                          id="photographer_name"
                          placeholder={t("submissions:form.photographerNamePlaceholder")}
                          maxLength={255}
                        />
                      </OxTextInput.Container>
                    </div>

                    <div className="space-y-2">
                      <OxLabel htmlFor="photographer_email" required>
                        {t("submissions:form.photographerEmail")}
                      </OxLabel>
                      <OxTextInput.Container
                        value={photographerEmail}
                        onChange={(val) => setPhotographerEmail(val)}
                        disabled={isUploading}
                        required
                      >
                        <OxTextInput
                          id="photographer_email"
                          placeholder={t("submissions:form.photographerEmailPlaceholder")}
                          maxLength={255}
                        />
                      </OxTextInput.Container>
                    </div>

                    {/* Honeypot field - hidden from users */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{
                        position: "absolute",
                        left: "-9999px",
                        width: "1px",
                        height: "1px",
                      }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* CAPTCHA */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <HCaptcha
                    siteKey={hcaptcha_sitekey}
                    onVerify={handleCaptchaVerify}
                    onExpire={() => setCaptchaToken(null)}
                  />
                </div>

                {/* Disclaimer Checkbox */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-start space-x-3">
                    <OxCheckbox
                      id="disclaimer"
                      checked={disclaimerAccepted}
                      onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                      disabled={isUploading}
                    />
                    <OxLabel htmlFor="disclaimer" className="cursor-pointer text-sm leading-relaxed">
                      <span>
                        {t("submissions:disclaimer.prefix")}
                        <button
                          type="button"
                          onClick={() => setShowDisclaimerModal(true)}
                          className="text-primary underline hover:text-primary/80"
                        >
                          {t("submissions:disclaimer.linkText")}
                        </button>
                        {t("submissions:disclaimer.suffix")}
                      </span>
                    </OxLabel>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {t("submissions:requirements.slotsRemaining", { count: remainingSlots })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions:requirements.fileSizeLimit")}
                    </p>
                  </div>
                  <OxButton
                    type="submit"
                    disabled={!selectedFile || !captchaToken || !disclaimerAccepted || isUploading}
                  >
                    {isUploading ? t("submissions:form.submitting") : t("submissions:form.submit")}
                  </OxButton>
                </div>
              </form>
            )}
          </OxCard.Body>
        </OxCard>

        {/* Recent Submissions */}
        {submissions.data.length > 0 && (
          <OxCard>
            <OxCard.Header title={t("submissions:recentSubmissions.title")} />
            <OxCard.Body>
              <div className="space-y-3">
                {submissions.data.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {submission.original_filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {submission.fwb_id} •{" "}
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "rounded-md px-2 py-1 text-xs font-medium",
                        submission.status === "new" &&
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                        submission.status === "approved" &&
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                        submission.status === "declined" &&
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                      )}
                    >
                      {t(`submissions:status.${submission.status}`)}
                    </div>
                  </div>
                ))}
              </div>
            </OxCard.Body>
          </OxCard>
        )}
      </div>

      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("submissions:disclaimer.modalTitle")}</DialogTitle>
            <DialogDescription className="whitespace-pre-line text-left">
              {t("submissions:disclaimer.modalContent")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
