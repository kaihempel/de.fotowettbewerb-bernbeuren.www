import type { FC } from "react";
import { router } from "@inertiajs/react";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";
import { OxBadge, OxButton, OxCard, OxSpinner } from "@noxickon/onyx";
import { AuditTrailIndicator } from "@/components/audit-trail-indicator";
import type { PhotoSubmission } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PhotoSubmissionCardProps {
  submission: PhotoSubmission;
  onActionSuccess?: () => void;
}

export const PhotoSubmissionCard: FC<PhotoSubmissionCardProps> = ({
  submission,
  onActionSuccess,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const isProcessing = isApproving || isDeclining;
  const isNew = submission.status === "new";

  const handleApprove = () => {
    if (isProcessing) return;

    setIsApproving(true);

    router.patch(
      `/photos/${submission.id}/approve`,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          onActionSuccess?.();
        },
        onError: () => {
          // Error handling will be done via flash messages
        },
        onFinish: () => {
          setIsApproving(false);
        },
      },
    );
  };

  const handleDecline = () => {
    if (isProcessing) return;

    setIsDeclining(true);

    router.patch(
      `/photos/${submission.id}/decline`,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          onActionSuccess?.();
        },
        onError: () => {
          // Error handling will be done via flash messages
        },
        onFinish: () => {
          setIsDeclining(false);
        },
      },
    );
  };

  const getStatusBadgeColor = () => {
    switch (submission.status) {
      case "approved":
        return "green";
      case "declined":
        return "red";
      case "new":
      default:
        return "yellow";
    }
  };

  const getStatusIcon = () => {
    switch (submission.status) {
      case "approved":
        return <CheckCircle className="size-3" />;
      case "declined":
        return <XCircle className="size-3" />;
      case "new":
      default:
        return <Clock className="size-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <OxCard className="overflow-hidden transition-shadow hover:shadow-md" padding="none">
      <OxCard.Body className="p-0">
        {/* Photo Thumbnail */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={submission.file_url}
            alt={submission.original_filename}
            className="size-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />

          {/* Status Badge Overlay */}
          <div className="absolute right-2 top-2">
            <OxBadge
              color={getStatusBadgeColor()}
              className={cn(
                "shadow-sm",
                submission.status === "new" &&
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-100",
                submission.status === "approved" &&
                  "bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-100",
                submission.status === "declined" &&
                  "bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-100",
              )}
            >
              {getStatusIcon()}
              {submission.status}
            </OxBadge>
          </div>
        </div>

        {/* Card Info */}
        <div className="space-y-3 p-4">
          {/* User Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-4" />
            <span className="font-medium">
              {submission.user?.name || "Unknown User"}
            </span>
          </div>

          {/* Submission Date */}
          <div className="text-xs text-muted-foreground">
            Submitted: {formatDate(submission.submitted_at)}
          </div>

          {/* Reviewer Info (if reviewed) */}
          {submission.reviewed_at && submission.reviewer && (
            <div className="rounded-md border border-muted bg-muted/30 p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviewed by:</span>
                <span className="font-medium">{submission.reviewer.name}</span>
              </div>
              <div className="mt-1 text-muted-foreground">
                {formatDate(submission.reviewed_at)}
              </div>
            </div>
          )}

          {/* Photo ID and Audit Trail */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-mono text-muted-foreground">
              ID: {submission.fwb_id}
            </div>

            {/* Audit Trail Indicator - Show for reviewed submissions */}
            {submission.reviewed_at &&
              submission.reviewer &&
              submission.status !== "new" && (
                <AuditTrailIndicator
                  reviewer={submission.reviewer}
                  reviewedAt={submission.reviewed_at}
                  status={submission.status}
                />
              )}
          </div>

          {/* Action Buttons - Only show for "new" status */}
          {isNew && (
            <div className="flex gap-2 pt-2">
              <OxButton
                onClick={handleApprove}
                disabled={isProcessing}
                variant="primary"
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              >
                {isApproving ? (
                  <>
                    <OxSpinner className="size-4" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4" />
                    Accept
                  </>
                )}
              </OxButton>

              <OxButton
                onClick={handleDecline}
                disabled={isProcessing}
                variant="danger"
                size="sm"
                className="flex-1"
              >
                {isDeclining ? (
                  <>
                    <OxSpinner className="size-4" />
                    Declining...
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" />
                    Decline
                  </>
                )}
              </OxButton>
            </div>
          )}
        </div>
      </OxCard.Body>
    </OxCard>
  );
};
