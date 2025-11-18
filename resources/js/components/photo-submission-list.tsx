import type { FC } from "react";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, FileQuestion } from "lucide-react";
import { OxButton } from "@noxickon/onyx";
import { PhotoSubmissionCard } from "@/components/photo-submission-card";
import type { PhotoSubmission, PaginatedResponse } from "@/types";
import { cn } from "@/lib/utils";

interface PhotoSubmissionListProps {
  submissions: PaginatedResponse<PhotoSubmission>;
  currentFilter?: string;
}

export const PhotoSubmissionList: FC<PhotoSubmissionListProps> = ({
  submissions,
  currentFilter = "all",
}) => {
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

  // Empty state
  if (!submissions.data || submissions.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <FileQuestion className="mb-4 size-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">No submissions found</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {currentFilter === "new" &&
            "There are no pending submissions to review at the moment. Check back later!"}
          {currentFilter === "approved" &&
            "No approved submissions yet. Start reviewing to see approved photos here."}
          {currentFilter === "declined" &&
            "No declined submissions yet. Declined photos will appear here."}
          {currentFilter === "all" &&
            "No photo submissions have been made yet. They will appear here once users start uploading."}
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
            Showing {submissions.from} to {submissions.to} of{" "}
            {submissions.total} submissions
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
              Previous
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
                    className={cn("min-w-[2.5rem]", isActive && "pointer-events-none")}
                  >
                    {pageNum}
                  </OxButton>
                );
              })}
            </div>

            {/* Mobile page indicator */}
            <div className="flex items-center gap-2 sm:hidden">
              <span className="text-sm text-muted-foreground">
                Page {submissions.current_page} of {submissions.last_page}
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
              Next
              <ChevronRight className="size-4" />
            </OxButton>
          </div>
        </div>
      )}
    </div>
  );
};
