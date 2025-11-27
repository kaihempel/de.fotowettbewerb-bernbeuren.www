import type { FC } from "react";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
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
import { LanguageSwitcher } from "@/components/language-switcher";
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
  const { t } = useTranslation();
  const { auth } = usePage<SharedData>().props;
  const isAuthenticated = !!auth?.user;

  // Base menu items available to everyone
  const publicMenuItems: MenuItem[] = [
    {
      label: t("navigation.gallery"),
      href: "/",
      description: t("navigation.gallery"),
    },
    {
      label: t("navigation.submit"),
      href: publicPhotosIndex.url(),
      description: t("navigation.submit"),
    },
    {
      label: t("navigation.about"),
      href: "/about-us",
      description: t("navigation.about"),
    },
    {
      label: t("navigation.project"),
      href: "/project",
      description: t("navigation.project"),
    },
  ];

  // Authenticated user menu items
  const authMenuItems: MenuItem[] = isAuthenticated
    ? [
        {
          label: t("navigation.dashboard"),
          href: dashboard().url,
          description: t("navigation.dashboard"),
        },
      ]
    : [];

  // User account items (for authenticated users)
  const userMenuItems: MenuItem[] = isAuthenticated
    ? [
        {
          label: t("navigation.settings"),
          href: editProfile().url,
          description: t("navigation.settings"),
        },
      ]
    : [
        {
          label: t("navigation.login"),
          href: login.url(),
          description: t("navigation.login"),
        },
      ];

  // Footer items
  const footerItems: MenuItem[] = [
    {
      label: t("navigation.imprint"),
      href: "/impressum",
      description: t("navigation.imprint"),
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
          aria-label={t("navigation.home")}
        >
          <AppLogoIcon className="size-15 stroke-white"></AppLogoIcon>
        </Link>

        <div className="flex items-center gap-2">
          {/* Language Switcher - visible on all screen sizes */}
          <LanguageSwitcher variant="dropdown" size="icon" showLabel={false} />

          {/* Mobile Navigation Menu */}
          <OxDrawer open={menuOpen} onOpenChange={setMenuOpen}>
            <OxDrawer.Trigger>
              <OxIcon path={mdiMenu} />
            </OxDrawer.Trigger>
            <OxDrawer.Content side="right">
              <OxDrawer.Header>
                <OxHeading as="h2" level={2}>
                  {t("accessibility.mainNavigation")}
                </OxHeading>
              </OxDrawer.Header>
              <OxDrawer.Body>
                <div
                  id="navigation-menu"
                  className="space-y-2"
                  aria-label={t("accessibility.mainNavigation")}
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
                        path={
                          item.href === editProfile().url ? mdiCog : mdiAccount
                        }
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
                      {t("navigation.logout")}
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
