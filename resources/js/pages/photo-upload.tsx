import { PhotoUpload } from "@/components/photo-upload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { type BreadcrumbItem, type PhotoSubmission } from "@/types";
import { Head, router } from "@inertiajs/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import NProgress from "nprogress";
import { useCallback, useEffect, useState } from "react";

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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Upload Photo",
    href: "/photos",
  },
];

export default function PhotoUploadPage({
  remainingSlots,
  submissions,
  flash,
}: PhotoUploadPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

      router.post("/photos/upload", formData, {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedFile(null);
          setPreview(null);
          NProgress.done();
          setIsUploading(false);
        },
        onError: (errors) => {
          const errorMessage =
            errors.photo || errors.general || "Upload failed. Please try again.";
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
    [selectedFile],
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
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Upload Photo" />

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Success Flash Message */}
        {flash?.success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">
              Success!
            </AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              {flash.success}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Flash Message */}
        {flash?.error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{flash.error}</AlertDescription>
          </Alert>
        )}

        {/* Header Card with Submission Counter */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Submit Your Photo</CardTitle>
                <CardDescription>
                  Upload your high-quality photograph for the contest. Maximum
                  file size: 15MB.
                </CardDescription>
              </div>
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
            </div>
          </CardHeader>

          <CardContent>
            {hasReachedLimit ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Maximum Submissions Reached</AlertTitle>
                <AlertDescription>
                  You have reached the maximum of 3 photo submissions for this
                  contest. Only photos with status "new" or "approved" count
                  toward this limit.
                </AlertDescription>
              </Alert>
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
                  <Button
                    type="submit"
                    disabled={!selectedFile || isUploading}
                    size="lg"
                  >
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Recent Submissions Preview */}
        {submissions.data.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Submissions</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.visit("/photos/submissions")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
