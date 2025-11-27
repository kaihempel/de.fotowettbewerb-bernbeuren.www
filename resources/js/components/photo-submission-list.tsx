import type { FC } from "react";
import { router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, FileQuestion } from "lucide-react";
import { OxButton, OxCard, OxSkeleton, OxSkeletonText } from "@noxickon/onyx";
import { PhotoSubmissionCard } from "@/components/photo-submission-card";
import type { PhotoSubmission, PaginatedResponse } from "@/types";
import { cn } from "@/lib/utils";

interface PhotoSubmissionListProps {
  submissions: PaginatedResponse<PhotoSubmission>;
  currentFilter?: string;
}

// Skeleton loader component for loading state
const SubmissionCardSkeleton: FC = () => (
  <OxCard className="overflow-hidden" padding="none">
    <OxCard.Body className="p-0">
      {/* Photo Thumbnail Skeleton */}
      <OxSkeleton className="aspect-auto w-full" shape="rectangle" animate />

      {/* Card Info Skeleton */}
      <div className="space-y-3 p-4">
        {/* User Info Skeleton */}
        <div className="flex items-center gap-2">
          <OxSkeleton width="16px" height="16px" shape="circle" animate />
          <OxSkeletonText width="120px" height="14px" animate />
        </div>

        {/* Submission Date Skeleton */}
        <OxSkeletonText width="180px" height="12px" animate />

        {/* Photo ID Skeleton */}
        <OxSkeletonText width="140px" height="12px" animate />

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 pt-2">
          <OxSkeleton
            className="flex-1"
            height="36px"
            shape="rectangle"
            animate
          />
          <OxSkeleton
            className="flex-1"
            height="36px"
            shape="rectangle"
            animate
          />
        </div>
      </div>
    </OxCard.Body>
  </OxCard>
);

export const PhotoSubmissionList: FC<PhotoSubmissionListProps> = ({
  submissions,
  currentFilter = "all",
}) => {
  const { t } = useTranslation("dashboard");

  // Show skeleton loaders if submissions is undefined or still loading
  if (!submissions) {
    return (
      <div className="space-y-6">
        {/* Grid of skeleton cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SubmissionCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());

    if (currentFilter && currentFilter !== "all") {
      params.set("status", currentFilter);
    }

    router.get(`?${params.toString()}`, undefined, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handlePrevious = () => {
    if (submissions.current_page > 1) {
      handlePageChange(submissions.current_page - 1);
    }
  };

  const handleNext = () => {
    if (submissions.current_page < submissions.last_page) {
      handlePageChange(submissions.current_page + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = submissions.last_page;
    const currentPage = submissions.current_page;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Get empty state message based on filter
  const getEmptyMessage = (): string => {
    switch (currentFilter) {
      case "new":
        return t("empty.pending");
      case "approved":
        return t("empty.approved");
      case "declined":
        return t("empty.declined");
      default:
        return t("empty.all");
    }
  };

  // Empty state
  if (!submissions.data || submissions.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <FileQuestion className="mb-4 size-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">{t("empty.title")}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {getEmptyMessage()}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid of submission cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {submissions.data.map((submission) => (
          <PhotoSubmissionCard key={submission.id} submission={submission} />
        ))}
      </div>

      {/* Pagination Controls */}
      {submissions.last_page > 1 && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Results info */}
          <div className="text-sm text-muted-foreground">
            {t("pagination.showing", {
              from: submissions.from,
              to: submissions.to,
              total: submissions.total,
            })}
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <OxButton
              onClick={handlePrevious}
              disabled={submissions.current_page === 1}
              variant="secondary"
              size="sm"
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              {t("pagination.previous")}
            </OxButton>

            {/* Page numbers */}
            <div className="hidden items-center gap-1 sm:flex">
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                const isActive = pageNum === submissions.current_page;

                return (
                  <OxButton
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={isActive ? "primary" : "secondary"}
                    size="sm"
                    className={cn(
                      "min-w-[2.5rem]",
                      isActive && "pointer-events-none",
                    )}
                  >
                    {pageNum}
                  </OxButton>
                );
              })}
            </div>

            {/* Mobile page indicator */}
            <div className="flex items-center gap-2 sm:hidden">
              <span className="text-sm text-muted-foreground">
                {t("pagination.page", {
                  current: submissions.current_page,
                  total: submissions.last_page,
                })}
              </span>
            </div>

            {/* Next button */}
            <OxButton
              onClick={handleNext}
              disabled={submissions.current_page === submissions.last_page}
              variant="secondary"
              size="sm"
              className="gap-1"
            >
              {t("pagination.next")}
              <ChevronRight className="size-4" />
            </OxButton>
          </div>
        </div>
      )}
    </div>
  );
};
