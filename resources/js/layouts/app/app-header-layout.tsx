import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import { type BreadcrumbItem } from "@/types";
import { OxMainContent } from "@noxickon/onyx/layouts";
import type { PropsWithChildren } from "react";

export default function AppHeaderLayout({
  children,
  breadcrumbs,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell>
      <OxMainContent>
        <OxMainContent.Header>
          <AppHeader breadcrumbs={breadcrumbs} />
        </OxMainContent.Header>
        <OxMainContent.Body>{children}</OxMainContent.Body>
      </OxMainContent>
    </AppShell>
  );
}
