import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { type BreadcrumbItem } from "@/types";
import { OxMainContent } from "@noxickon/onyx/layouts";
import { type PropsWithChildren } from "react";

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <OxMainContent className="overflow-x-hidden">
        <OxMainContent.Header>
          <AppSidebarHeader breadcrumbs={breadcrumbs} />
        </OxMainContent.Header>
        <OxMainContent.Body>{children}</OxMainContent.Body>
      </OxMainContent>
    </AppShell>
  );
}
