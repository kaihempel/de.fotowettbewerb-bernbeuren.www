import { useState, useCallback, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { PhotoUpload } from "@/components/photo-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OxButton, OxCard, OxAlert } from "@noxickon/onyx";
import { PublicLayout } from "@/layouts/public-layout";
import { HCaptcha } from "@/components/hcaptcha";
import { cn } from "@/lib/utils";
import { mdiCheckCircle, mdiAlertCircle } from "@mdi/js";
import NProgress from "nprogress";
import type { PhotoSubmission } from "@/types";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [photographerName, setPhotographerName] = useState<string>("");
  const [photographerEmail, setPhotographerEmail] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState<string>(""); // Honeypot field

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
        setUploadError("Please select a photo to upload.");
        return;
      }

      if (!captchaToken) {
        setUploadError("Please complete the CAPTCHA verification.");
        return;
      }

      if (!photographerName.trim()) {
        setUploadError("Please enter your name.");
        return;
      }

      if (!photographerEmail.trim()) {
        setUploadError("Please enter your email address.");
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
      formData.append("website", honeypot); // Honeypot field

      router.post("/submit-photo", formData, {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedFile(null);
          setPreview(null);
          setPhotographerName("");
          setPhotographerEmail("");
          setCaptchaToken(null);
          NProgress.done();
          setIsUploading(false);
        },
        onError: (errors) => {
          const errorMessage =
            errors.photo ||
            errors.photographer_name ||
            errors.photographer_email ||
            errors.captcha_token ||
            errors.general ||
            "Upload failed. Please try again.";
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
    [selectedFile, captchaToken, photographerName, photographerEmail, honeypot],
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
      <Head title="Submit Your Photo" />

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
                Success!
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
              <strong>Error</strong>
              <br />
              {flash.error}
            </span>
          </OxAlert>
        )}

        {/* Upload Card */}
        <OxCard>
          <OxCard.Header
            title="Submit Your Photo"
            subtitle="Upload your photograph for the Fotowettbewerb Bernbeuren. Maximum 3 submissions per person."
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
                    Submissions
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
                  <strong>Maximum Submissions Reached</strong>
                  <br />
                  You have submitted the maximum of 3 photos. Thank you for your
                  participation!
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
                      Photographer Information{" "}
                      <span className="text-destructive">*</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Required for contest participation. Your information will
                      be kept private.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="photographer_name">
                        Your Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="photographer_name"
                        type="text"
                        placeholder="John Doe"
                        value={photographerName}
                        onChange={(e) => setPhotographerName(e.target.value)}
                        disabled={isUploading}
                        maxLength={255}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photographer_email">
                        Your Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="photographer_email"
                        type="email"
                        placeholder="john@example.com"
                        value={photographerEmail}
                        onChange={(e) => setPhotographerEmail(e.target.value)}
                        disabled={isUploading}
                        maxLength={255}
                        required
                      />
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
                    siteKey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                    onVerify={handleCaptchaVerify}
                    onExpire={() => setCaptchaToken(null)}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"}{" "}
                      remaining
                    </p>
                    <p className="text-xs text-muted-foreground">
                      File size limit: 15MB. Formats: JPG, PNG, HEIC
                    </p>
                  </div>
                  <OxButton
                    type="submit"
                    disabled={!selectedFile || !captchaToken || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Submit Photo"}
                  </OxButton>
                </div>
              </form>
            )}
          </OxCard.Body>
        </OxCard>

        {/* Recent Submissions */}
        {submissions.data.length > 0 && (
          <OxCard>
            <OxCard.Header title="Your Recent Submissions" />
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
                      {submission.status}
                    </div>
                  </div>
                ))}
              </div>
            </OxCard.Body>
          </OxCard>
        )}
      </div>
    </PublicLayout>
  );
}
