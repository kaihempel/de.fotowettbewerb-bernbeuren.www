import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GlobalLayout from "@/layouts/global-layout";
import { cn } from "@/lib/utils";
import { type PhotoSubmission, type PaginatedResponse } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Download, Upload, Image as ImageIcon } from "lucide-react";
import { type FC } from "react";

interface MySubmissionsPageProps {
  submissions: PaginatedResponse<PhotoSubmission>;
  remainingSlots: number;
}

const getStatusColor = (status: PhotoSubmission["status"]): string => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "new":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "declined":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    default:
      return "";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const EmptyState: FC = () => (
  <Card className="border-dashed">
    <CardContent className="flex flex-col items-center justify-center py-16">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <ImageIcon className="size-10 text-muted-foreground" />
      </div>
      <div className="mt-6 space-y-2 text-center">
        <h3 className="text-lg font-semibold">No submissions yet</h3>
        <p className="text-sm text-muted-foreground">
          You haven't uploaded any photos for the contest.
        </p>
      </div>
      <Button
        className="mt-6"
        onClick={() => router.visit("/photos")}
        size="lg"
      >
        <Upload className="mr-2 size-4" />
        Upload Your First Photo
      </Button>
    </CardContent>
  </Card>
);

export default function MySubmissionsPage({
  submissions,
  remainingSlots,
}: MySubmissionsPageProps) {
  const handleDownload = (fileUrl: string, filename: string) => {
    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlobalLayout>
      <Head title="My Submissions" />

      <div className="mx-auto max-w-6xl space-y-6 p-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>My Photo Submissions</CardTitle>
                <CardDescription>
                  View and manage your contest photo submissions
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 text-center",
                    remainingSlots === 0
                      ? "bg-destructive/10 dark:bg-destructive/20"
                      : "bg-primary/10 dark:bg-primary/20",
                  )}
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    Remaining Slots
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      remainingSlots === 0
                        ? "text-destructive"
                        : "text-primary dark:text-primary",
                    )}
                  >
                    {remainingSlots}/3
                  </p>
                </div>
                {remainingSlots > 0 && (
                  <Button onClick={() => router.visit("/photos")}>
                    <Upload className="mr-2 size-4" />
                    Upload Photo
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Submissions List */}
        {submissions.data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.data.map((submission) => (
              <Card
                key={submission.id}
                className="group overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="line-clamp-1 text-base">
                        {submission.original_filename}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {submission.fwb_id}
                      </CardDescription>
                    </div>
                    <Badge
                      className={cn(
                        "shrink-0 capitalize",
                        getStatusColor(submission.status),
                      )}
                    >
                      {submission.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Metadata */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>File Size:</span>
                      <span className="font-medium text-foreground">
                        {formatFileSize(submission.file_size)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Uploaded:</span>
                      <span className="font-medium text-foreground">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    {submission.reviewed_at && (
                      <div className="flex items-center justify-between">
                        <span>Reviewed:</span>
                        <span className="font-medium text-foreground">
                          {new Date(
                            submission.reviewed_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      handleDownload(
                        submission.file_url,
                        submission.original_filename,
                      )
                    }
                  >
                    <Download className="mr-2 size-4" />
                    Download Photo
                  </Button>

                  {/* Status Description */}
                  {submission.status === "new" && (
                    <p className="text-xs text-muted-foreground">
                      Your photo is awaiting review by contest administrators.
                    </p>
                  )}
                  {submission.status === "approved" && (
                    <p className="text-xs text-muted-foreground">
                      Your photo has been approved and is entered in the
                      contest!
                    </p>
                  )}
                  {submission.status === "declined" && (
                    <p className="text-xs text-muted-foreground">
                      This submission was not accepted. You can upload a new
                      photo in this slot.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {submissions.last_page > 1 && (
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <p className="text-sm text-muted-foreground">
                Showing {submissions.data.length} of {submissions.total}{" "}
                {submissions.total === 1 ? "submission" : "submissions"}
              </p>
              <div className="flex gap-2">
                {submissions.current_page > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.visit(
                        `/photos/submissions?page=${submissions.current_page - 1}`,
                      )
                    }
                  >
                    Previous
                  </Button>
                )}
                {submissions.current_page < submissions.last_page && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.visit(
                        `/photos/submissions?page=${submissions.current_page + 1}`,
                      )
                    }
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GlobalLayout>
  );
}
