import type { FC } from "react";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { mdiMenu, mdiLogout, mdiCog, mdiAccount } from "@mdi/js";
import {
  OxDrawer,
  OxLink,
  OxHeading,
  OxIcon,
  OxSeparator,
} from "@noxickon/onyx";
import { login, dashboard, logout } from "@/routes";
import { edit as editProfile } from "@/routes/profile";
import { index as publicPhotosIndex } from "@/routes/public/photos";
import { OxMainContent } from "@noxickon/onyx/layouts";
import AppLogoIcon from "@/components/app-logo-icon";
import type { SharedData } from "@/types";

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
export const PublicHeader: FC<PublicHeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth } = usePage<SharedData>().props;
  const isAuthenticated = !!auth?.user;

  // Base menu items available to everyone
  const publicMenuItems: MenuItem[] = [
    {
      label: "Gallery",
      href: "/",
      description: "View all contest photos",
    },
    {
      label: "Upload",
      href: publicPhotosIndex.url(),
      description: "Submit your photo",
    },
    {
      label: "About Us",
      href: "/about-us",
      description: "Learn more about us",
    },
    {
      label: "Project",
      href: "/project",
      description: "About the photo contest",
    },
  ];

  // Authenticated user menu items
  const authMenuItems: MenuItem[] = isAuthenticated
    ? [
        {
          label: "Dashboard",
          href: dashboard().url,
          description: "Review submissions",
        },
      ]
    : [];

  // User account items (for authenticated users)
  const userMenuItems: MenuItem[] = isAuthenticated
    ? [
        {
          label: "Settings",
          href: editProfile().url,
          description: "Manage your account",
        },
      ]
    : [
        {
          label: "Login",
          href: login.url(),
          description: "Access your account",
        },
      ];

  // Footer items
  const footerItems: MenuItem[] = [
    {
      label: "Impressum",
      href: "/impressum",
      description: "Legal information",
    },
  ];

  const menuItems = [...publicMenuItems, ...authMenuItems];

  const handleMenuItemClick = () => {
    setMenuOpen(false);
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
              <OxIcon path={mdiMenu} />
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
                  {/* Main Navigation Items */}
                  {menuItems.map((item) => (
                    <OxLink
                      key={item.href}
                      className="w-full justify-start"
                      variant="ghost"
                      href={item.href}
                      onClick={handleMenuItemClick}
                    >
                      {item.label}
                    </OxLink>
                  ))}

                  <OxSeparator className="my-4" />

                  {/* User Account Section */}
                  {isAuthenticated && (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          {auth.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {auth.user.email}
                        </p>
                      </div>
                    </>
                  )}

                  {userMenuItems.map((item) => (
                    <OxLink
                      key={item.href}
                      className="w-full justify-start"
                      variant="ghost"
                      href={item.href}
                      onClick={handleMenuItemClick}
                    >
                      <OxIcon
                        path={item.label === "Settings" ? mdiCog : mdiAccount}
                        className="mr-2 size-4"
                      />
                      {item.label}
                    </OxLink>
                  ))}

                  {isAuthenticated && (
                    <Link
                      href={logout()}
                      method="post"
                      as="button"
                      className="flex w-full items-center justify-start rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                      onClick={handleMenuItemClick}
                    >
                      <OxIcon path={mdiLogout} className="mr-2 size-4" />
                      Logout
                    </Link>
                  )}

                  <OxSeparator className="my-4" />

                  {/* Footer Items */}
                  {footerItems.map((item) => (
                    <OxLink
                      key={item.href}
                      className="w-full justify-start text-muted-foreground"
                      variant="ghost"
                      href={item.href}
                      onClick={handleMenuItemClick}
                    >
                      {item.label}
                    </OxLink>
                  ))}
                </div>
              </OxDrawer.Body>
            </OxDrawer.Content>
          </OxDrawer>
        </div>
      </OxMainContent.Header>
    </>
  );
};
