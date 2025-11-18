import { OxAlert, OxCard, OxSeparator } from "@noxickon/onyx";
import { PhotoSubmissionList } from "@/components/photo-submission-list";
import { PhotoStatusFilter } from "@/components/photo-status-filter";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem, type PhotoSubmission, type PaginatedResponse } from "@/types";
import { Head } from "@inertiajs/react";
import { Images } from "lucide-react";
import { mdiCheckCircle, mdiAlertCircle } from "@mdi/js";

interface DashboardProps {
  submissions: PaginatedResponse<PhotoSubmission>;
  statusFilter?: "all" | "new" | "approved" | "declined";
  statusCounts?: {
    all: number;
    new: number;
    approved: number;
    declined: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: dashboard().url,
  },
];

export default function Dashboard({
  submissions,
  statusFilter = "all",
  statusCounts,
  flash,
}: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard - Photo Review" />

      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Flash Messages */}
        {flash?.success && (
          <OxAlert type="success">
            <OxAlert.Icon
              path={mdiCheckCircle}
              iconClass="text-green-400"
              iconDivClass="bg-green-500/20"
            />
            <span className="text-green-800 dark:text-green-200">
              <strong className="text-green-900 dark:text-green-100">Success</strong>
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

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Images className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Photo Review Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Review and manage photo submissions for the contest
          </p>
        </div>

        {/* Statistics Cards */}
        {statusCounts && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OxCard>
              <OxCard.Header
                title={<span className="text-sm font-medium text-muted-foreground">Total Submissions</span>}
                className="pb-3"
              />
              <OxCard.Body>
                <div className="text-2xl font-bold">{statusCounts.all}</div>
              </OxCard.Body>
            </OxCard>

            <OxCard>
              <OxCard.Header
                title={<span className="text-sm font-medium text-muted-foreground">Pending Review</span>}
                className="pb-3"
              />
              <OxCard.Body>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                  {statusCounts.new}
                </div>
              </OxCard.Body>
            </OxCard>

            <OxCard>
              <OxCard.Header
                title={<span className="text-sm font-medium text-muted-foreground">Approved</span>}
                className="pb-3"
              />
              <OxCard.Body>
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                  {statusCounts.approved}
                </div>
              </OxCard.Body>
            </OxCard>

            <OxCard>
              <OxCard.Header
                title={<span className="text-sm font-medium text-muted-foreground">Declined</span>}
                className="pb-3"
              />
              <OxCard.Body>
                <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                  {statusCounts.declined}
                </div>
              </OxCard.Body>
            </OxCard>
          </div>
        )}

        {/* Filter Section */}
        <OxCard>
          <OxCard.Body className="pt-6">
            <PhotoStatusFilter
              currentFilter={statusFilter}
              counts={statusCounts}
            />
          </OxCard.Body>
        </OxCard>

        <OxSeparator />

        {/* Submissions List */}
        <PhotoSubmissionList
          submissions={submissions}
          currentFilter={statusFilter}
        />
      </div>
    </AppLayout>
  );
}
