import { PhotoUpload } from "@/components/photo-upload";
import { OxAlert, OxButton, OxCard } from "@noxickon/onyx";
import GlobalLayout from "@/layouts/global-layout";
import { cn } from "@/lib/utils";
import { type PhotoSubmission } from "@/types";
import { Head, router } from "@inertiajs/react";
import { mdiCheckCircle, mdiAlertCircle } from "@mdi/js";
import NProgress from "nprogress";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadPageProps {
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

export default function PhotoUploadPage({
  remainingSlots,
  submissions,
  flash,
}: PhotoUploadPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [photographerName, setPhotographerName] = useState<string>("");
  const [photographerEmail, setPhotographerEmail] = useState<string>("");

  const hasReachedLimit = remainingSlots === 0;

  // Configure NProgress
  useEffect(() => {
    NProgress.configure({ showSpinner: false });
  }, []);

  // Generate preview when file is selected
  useEffect(() => {
    if (!selectedFile) {
      return;
    }

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
    setPhotographerName("");
    setPhotographerEmail("");
  }, []);

  const handleUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedFile) {
        setUploadError("Please select a photo to upload.");
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      NProgress.start();

      const formData = new FormData();
      formData.append("photo", selectedFile);
      if (photographerName) {
        formData.append("photographer_name", photographerName);
      }
      if (photographerEmail) {
        formData.append("photographer_email", photographerEmail);
      }

      router.post("/photos/upload", formData, {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedFile(null);
          setPreview(null);
          setPhotographerName("");
          setPhotographerEmail("");
          NProgress.done();
          setIsUploading(false);
        },
        onError: (errors) => {
          const errorMessage =
            errors.photo ||
            errors.photographer_name ||
            errors.photographer_email ||
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
    [selectedFile, photographerName, photographerEmail],
  );

  // Warn user before navigating away during upload
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
    <GlobalLayout>
      <Head title="Upload Photo" />

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Success Flash Message */}
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

        {/* Error Flash Message */}
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

        {/* Header Card with Submission Counter */}
        <OxCard>
          <OxCard.Header
            title="Submit Your Photo"
            subtitle="Upload your high-quality photograph for the contest. Maximum file size: 15MB."
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
                  You have reached the maximum of 3 photo submissions for this
                  contest. Only photos with status "new" or "approved" count
                  toward this limit.
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

                {/* Photographer Information (Optional) */}
                <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">
                      Photographer Information{" "}
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      This information is only visible to administrators and will
                      not be shown publicly.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="photographer_name">
                        Photographer Name
                      </Label>
                      <Input
                        id="photographer_name"
                        type="text"
                        placeholder="Enter photographer name"
                        value={photographerName}
                        onChange={(e) => setPhotographerName(e.target.value)}
                        disabled={isUploading}
                        maxLength={255}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photographer_email">
                        Photographer Email
                      </Label>
                      <Input
                        id="photographer_email"
                        type="email"
                        placeholder="photographer@example.com"
                        value={photographerEmail}
                        onChange={(e) => setPhotographerEmail(e.target.value)}
                        disabled={isUploading}
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"}{" "}
                      remaining
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Declined submissions free up a slot for resubmission.
                    </p>
                  </div>
                  <OxButton
                    type="submit"
                    disabled={!selectedFile || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </OxButton>
                </div>
              </form>
            )}
          </OxCard.Body>
        </OxCard>

        {/* Recent Submissions Preview */}
        {submissions.data.length > 0 && (
          <OxCard>
            <OxCard.Header
              title="Your Submissions"
              action={
                <OxButton
                  variant="secondary"
                  size="sm"
                  onClick={() => router.visit("/photos/submissions")}
                >
                  View All
                </OxButton>
              }
            />
            <OxCard.Body>
              <div className="space-y-3">
                {submissions.data.slice(0, 3).map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
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
    </GlobalLayout>
  );
}
