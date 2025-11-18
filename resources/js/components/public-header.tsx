import type { FC } from "react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { mdiMenu } from '@mdi/js';
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { OxDrawer, OxLink, OxHeading, OxIcon } from "@noxickon/onyx";
import { cn } from "@/lib/utils";
import { login } from "@/routes";
import {OxMainContent} from "@noxickon/onyx/layouts";
import AppLogoIcon from "@/components/app-logo-icon";

interface PublicHeaderProps {
  logoUrl?: string;
  className?: string;
}

interface MenuItem {
  label: string;
  href: string;
  description?: string;
}

/**
 * Public header component with dynamic scroll behavior
 * - Starts at 20vh height, transitions to 80px on scroll
 * - Smooth 350ms transition animation
 * - Logo scales proportionally
 * - Backdrop blur effect
 * - Responsive burger menu with Onyx Drawer
 * - Keyboard accessible navigation
 */
export const PublicHeader: FC<PublicHeaderProps> = ({
  logoUrl = "/images/logo.png",
  className,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isScrolled = useScrollPosition({ threshold: 100 });

  const menuItems: MenuItem[] = [
    {
      label: "Gallery",
      href: "/",
      description: "View all contest photos",
    },
    {
      label: "Upload",
      href: "/photos",
      description: "Submit your photo",
    },
    {
      label: "Login",
      href: login.url(),
      description: "Access your account",
    },
    {
      label: "Impressum",
      href: "/impressum",
      description: "Legal information",
    },
  ];

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <OxMainContent.Header className="flex flex-row justify-between">
        {/* Logo */}
          <Link
              href="/"
              className="flex items-center transition-transform duration-[350ms] ease-in-out"
              aria-label="Home"
          >
            <AppLogoIcon className="size-15 stroke-white"></AppLogoIcon>
          </Link>

          <div className="align-middle min-h-max">
          {/* Mobile Navigation Menu */}
              <OxDrawer open={menuOpen} onOpenChange={setMenuOpen}>
                  <OxDrawer.Trigger>
                      <OxIcon path={mdiMenu}/>
                  </OxDrawer.Trigger>
                  <OxDrawer.Content side="right">
                      <OxDrawer.Header>
                          <OxHeading as="h2" level={2}>
                              Navigation
                          </OxHeading>
                      </OxDrawer.Header>
                      <OxDrawer.Body>
                          <div
                              id="navigation-menu"
                              className="space-y-2"
                              aria-label="Main navigation"
                          >
                              {menuItems.map((item) => (
                                  <OxLink className="w-full justify-start" variant="ghost" href={item.href}>
                                      {item.label}
                                  </OxLink>
                              ))}
                          </div>
                      </OxDrawer.Body>
                  </OxDrawer.Content>
              </OxDrawer>
          </div>
      </OxMainContent.Header>

        {/* Spacer to prevent content hiding under fixed header */}
        <div
            className={cn(
                "transition-all duration-[350ms] ease-in-out",
                isScrolled ? "h-20" : "h-[20vh]",
            )}
            aria-hidden="true"
        />

    </>
  );
};
