import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";

import { aboutUs, imprint, project } from "@/routes";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

/**
 * Global footer component that appears on all pages
 * - Fixed at bottom of viewport (30px height)
 * - Contains links to About Us, Impressum, and Project pages
 * - Minimal design to maximize usable screen space
 * - Responsive on mobile devices
 * - Dark mode support
 */
export const Footer: FC<FooterProps> = ({ className }) => {
  const { t } = useTranslation();

  const footerLinks = [
    { label: t("navigation.about"), href: aboutUs.url() },
    { label: t("navigation.imprint"), href: imprint.url() },
    { label: t("navigation.project"), href: project.url() },
  ];

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "h-[30px] border-t border-border border-gray-400 bg-gray-100",
        className,
      )}
    >
      <div className="flex h-full items-center justify-center gap-4 px-4 md:gap-6">
        {footerLinks.map((link, index) => (
          <span key={link.href} className="flex items-center">
            {index > 0 && (
              <span className="mr-4 accent-gray-400 md:mr-6">|</span>
            )}
            <Link
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground focus:text-foreground focus:outline-none"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </div>
    </footer>
  );
};
