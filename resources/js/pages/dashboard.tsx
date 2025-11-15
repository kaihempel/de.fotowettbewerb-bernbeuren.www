import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PhotoSubmissionList } from "@/components/photo-submission-list";
import { PhotoStatusFilter } from "@/components/photo-status-filter";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem, type PhotoSubmission, type PaginatedResponse } from "@/types";
import { Head } from "@inertiajs/react";
import { AlertCircle, CheckCircle2, Images } from "lucide-react";

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
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">
              Success
            </AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              {flash.success}
            </AlertDescription>
          </Alert>
        )}

        {flash?.error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{flash.error}</AlertDescription>
          </Alert>
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statusCounts.all}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                  {statusCounts.new}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                  {statusCounts.approved}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Declined
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                  {statusCounts.declined}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Section */}
        <Card>
          <CardContent className="pt-6">
            <PhotoStatusFilter
              currentFilter={statusFilter}
              counts={statusCounts}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Submissions List */}
        <PhotoSubmissionList
          submissions={submissions}
          currentFilter={statusFilter}
        />
      </div>
    </AppLayout>
  );
}
