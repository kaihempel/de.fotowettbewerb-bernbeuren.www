import { useEffect, useState } from "react";

interface UseScrollPositionOptions {
  threshold?: number;
}

/**
 * Custom hook to detect scroll position with requestAnimationFrame throttling
 * for optimal 60fps performance
 *
 * @param options - Configuration options
 * @param options.threshold - Scroll position threshold in pixels (default: 100)
 * @returns boolean indicating if scroll position is beyond threshold
 */
export function useScrollPosition({
  threshold = 100,
}: UseScrollPositionOptions = {}): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setIsScrolled(scrollPosition > threshold);
          ticking = false;
        });

        ticking = true;
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolled;
}
