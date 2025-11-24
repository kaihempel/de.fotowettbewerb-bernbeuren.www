import type { FC, PropsWithChildren } from "react";
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";
import { OxMainContent } from "@noxickon/onyx/layouts";

interface GlobalLayoutProps extends PropsWithChildren {
  className?: string;
}

/**
 * Global layout component that provides consistent structure across all pages
 * - Public header with navigation
 * - Main content area with OxMainContent.Body
 * - Global footer with links to About Us, Impressum, and Project pages
 * - Responsive design (mobile, tablet, desktop)
 * - Dark mode support
 */
const GlobalLayout: FC<GlobalLayoutProps> = ({ children, className }) => {
  return (
    <>
      {/* Dynamic Header */}
      <PublicHeader />

      {/* Main Content with bottom padding to prevent footer overlap */}
      <OxMainContent.Body
        className={className}
        style={{ paddingBottom: "30px" }}
      >
        {children}
      </OxMainContent.Body>

      {/* Global Footer */}
      <Footer />
    </>
  );
};

export default GlobalLayout;
