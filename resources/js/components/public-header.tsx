import type { FC } from "react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Menu } from "lucide-react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { login } from "@/routes";

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
 * - Responsive burger menu with Radix UI Sheet
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
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-white/80 px-6 backdrop-blur-lg transition-all duration-[350ms] ease-in-out dark:bg-gray-900/80 md:px-8",
          isScrolled ? "h-20" : "h-[20vh]",
          className,
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-transform duration-[350ms] ease-in-out hover:scale-105"
          aria-label="Home"
        >
          <img
            src={logoUrl}
            alt="Logo"
            className={cn(
              "h-auto object-contain transition-all duration-[350ms] ease-in-out",
              isScrolled ? "w-12 md:w-16" : "w-16 md:w-24",
            )}
          />
        </Link>

        {/* Burger Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          aria-controls="navigation-menu"
          className="text-gray-900 dark:text-gray-100"
        >
          <Menu className="size-6" />
        </Button>
      </header>

      {/* Spacer to prevent content hiding under fixed header */}
      <div
        className={cn(
          "transition-all duration-[350ms] ease-in-out",
          isScrolled ? "h-20" : "h-[20vh]",
        )}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md"
          onKeyDown={handleKeyDown}
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <nav
            id="navigation-menu"
            className="mt-8 flex flex-col gap-2"
            aria-label="Main navigation"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuItemClick}
                className="group flex flex-col rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-750 dark:focus:ring-gray-100"
              >
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {item.label}
                </span>
                {item.description && (
                  <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};
