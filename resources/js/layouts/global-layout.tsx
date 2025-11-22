import type { FC, PropsWithChildren } from "react";
import { PublicHeader } from "@/components/public-header";
import { OxMainContent } from "@noxickon/onyx/layouts";

interface GlobalLayoutProps extends PropsWithChildren {
  className?: string;
}

/**
 * Global layout component that provides consistent structure across all pages
 * - Public header with navigation
 * - Main content area with OxMainContent.Body
 * - Responsive design (mobile, tablet, desktop)
 * - Dark mode support
 */
const GlobalLayout: FC<GlobalLayoutProps> = ({ children, className }) => {
  return (
    <>
      {/* Dynamic Header */}
      <PublicHeader />

      {/* Main Content */}
      <OxMainContent.Body className={className}>{children}</OxMainContent.Body>
    </>
  );
};

export default GlobalLayout;
