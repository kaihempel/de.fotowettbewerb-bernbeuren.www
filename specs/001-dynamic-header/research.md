# Research & Technical Decisions

**Feature**: Dynamic Header with Photo Gallery Landing Page
**Date**: 2025-11-16
**Status**: Phase 0 Complete

## Overview

This document consolidates research findings and technical decisions for implementing the dynamic header and photo gallery landing page. All NEEDS CLARIFICATION items from the technical context have been resolved through best practices research.

---

## Research Areas

### 1. Scroll-Based Header Transitions in React

**Decision**: Use React `useEffect` hook with scroll event listener + `useState` for header state management

**Rationale**:
- Native browser scroll events provide precise control over transitions
- React state updates trigger re-renders for CSS class changes
- Debouncing/throttling via `requestAnimationFrame` or lodash ensures 60fps performance
- CSS transitions handle smooth animations (300-400ms as per FR-012)

**Implementation Pattern**:
```typescript
// Custom hook: use-scroll-position.ts
const useScrollPosition = (threshold: number) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    // Throttle with requestAnimationFrame for 60fps
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, isScrolled]);

  return isScrolled;
};
```

**Alternatives Considered**:
- **Intersection Observer API**: Rejected - designed for element visibility, not scroll distance
- **CSS-only with `position: sticky`**: Rejected - cannot trigger height transitions at specific scroll thresholds
- **Scroll libraries (react-scroll, framer-motion)**: Rejected - unnecessary dependency for simple scroll detection

**Best Practices**:
- Use `{ passive: true }` event listener option for better scroll performance
- Throttle with `requestAnimationFrame` instead of debounce for smoother animations
- Store scroll threshold (100px) as configurable constant, not magic number

---

### 2. Responsive Photo Grid Layout (Tailwind CSS v4)

**Decision**: Use Tailwind CSS Grid with responsive breakpoints and `aspect-auto` for preserved ratios

**Rationale**:
- Tailwind CSS v4 grid utilities provide clean, declarative responsive layouts
- CSS Grid handles varying aspect ratios better than Flexbox (no stretching)
- Gap utilities provide consistent spacing without margin hacks

**Implementation Pattern**:
```tsx
// Tailwind classes for photo grid
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {photos.map(photo => (
    <Link key={photo.id} href={route('photo.show', photo.id)}>
      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-auto object-contain aspect-auto"
      />
    </Link>
  ))}
</div>
```

**Breakpoint Strategy**:
- `grid-cols-1`: Mobile (default, 320px-768px) - 1 column
- `md:grid-cols-3`: Tablet (768px-1024px) - 3 columns
- `lg:grid-cols-4`: Desktop (1024px+) - 4 columns

**Alternatives Considered**:
- **Masonry layout (CSS Grid with `grid-auto-flow: dense`)**: Rejected - complex implementation, potential for confusing photo order
- **Flexbox with `flex-wrap`**: Rejected - requires manual width calculations, harder to maintain equal column widths
- **Third-party grid libraries (react-grid-layout)**: Rejected - unnecessary dependency, Tailwind CSS sufficient

**Best Practices**:
- Use `object-contain` not `object-cover` to preserve aspect ratios (FR-022)
- Use `aspect-auto` to prevent forced aspect ratios
- Use `gap-4` (1rem) for spacing instead of margins on individual items
- Lazy load images below the fold with `loading="lazy"` attribute

---

### 3. Mobile Menu Implementation (Radix UI Sheet)

**Decision**: Use Radix UI `Sheet` component for mobile burger menu

**Rationale**:
- Radix UI Sheet provides accessible overlay/sidebar patterns out-of-the-box
- Includes keyboard navigation (Escape to close), focus management, and ARIA attributes
- Matches existing component library in project (constitution principle IV)
- Supports light/dark mode theming automatically

**Implementation Pattern**:
```tsx
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react'; // Icon library

<Sheet>
  <SheetTrigger asChild>
    <button aria-label="Open menu">
      <Menu className="h-6 w-6" />
    </button>
  </SheetTrigger>
  <SheetContent>
    <nav>
      <Link href={route('gallery')}>Gallery</Link>
      <Link href={route('upload')}>Upload</Link>
      <Link href={route('login')}>Login</Link>
      <Link href={route('impressum')}>Impressum</Link>
    </nav>
  </SheetContent>
</Sheet>
```

**Alternatives Considered**:
- **Custom overlay component**: Rejected - reinventing accessibility features Radix provides
- **Radix Dialog component**: Rejected - Sheet is semantic for slide-in menus
- **Headless UI (Transition)**: Rejected - project uses Radix UI, not Headless UI

**Best Practices**:
- Use `asChild` prop to merge button with trigger (avoid nested buttons)
- Include `aria-label` for burger icon button (FR-019)
- Auto-close menu on navigation (Radix handles via state prop)
- Use lucide-react or similar icon library for hamburger menu icon

---

### 4. Performance Optimization for Photo Loading

**Decision**: Implement progressive loading with Inertia deferred props + lazy loading

**Rationale**:
- Inertia v2 `deferred` props load critical content (header) first, photos asynchronously
- Native `loading="lazy"` defers below-the-fold image loading
- Meets 5s/3G and 2s/broadband targets (SC-009)

**Implementation Pattern**:
```php
// PublicGalleryController.php
public function gallery()
{
    return Inertia::render('Gallery', [
        'meta' => [ /* page metadata */ ],
        'photos' => Inertia::defer(fn () => Photo::approved()->get()),
    ]);
}
```

```tsx
// Gallery.tsx
export default function Gallery({ meta, photos }: Props) {
  return (
    <>
      <Header />
      <Suspense fallback={<PhotoGridSkeleton />}>
        <WhenVisible>
          <PhotoGrid photos={photos} />
        </WhenVisible>
      </Suspense>
    </>
  );
}
```

**Alternatives Considered**:
- **Pagination**: Rejected - landing page should show all photos (scrollable)
- **Infinite scroll**: Rejected - over-engineered for initial version
- **Client-side fetch**: Rejected - Inertia deferred props simpler, SSR-friendly

**Best Practices**:
- Use `loading="lazy"` on all `<img>` tags below fold
- Provide skeleton loading state (placeholder boxes)
- Optimize image sizes server-side (responsive image srcset if needed)
- Consider image CDN for production (Laravel filesystem supports S3)

---

### 5. Dark Mode Implementation with Existing `use-appearance` Hook

**Decision**: Reuse existing `use-appearance` hook and Tailwind `dark:` variants

**Rationale**:
- Project already has theme management infrastructure (constitution principle IV)
- `use-appearance` hook manages system/light/dark/auto modes with cookie persistence
- Tailwind CSS v4 supports `dark:` variants natively

**Implementation Pattern**:
```tsx
import { useAppearance } from '@/hooks/use-appearance';

export default function PublicHeader() {
  const { appearance } = useAppearance(); // 'light' | 'dark' | 'system'

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      {/* Header content */}
    </header>
  );
}
```

**Tailwind Classes**:
- Light mode: `bg-white/80 text-gray-900`
- Dark mode: `dark:bg-gray-900/80 dark:text-gray-100`
- Semi-transparent with blur: `bg-white/80 backdrop-blur-lg` (FR-015)

**Alternatives Considered**:
- **CSS custom properties**: Rejected - Tailwind dark mode simpler, consistent with project
- **New theme context**: Rejected - `use-appearance` hook already exists

**Best Practices**:
- Test all interactive elements for WCAG AA contrast (4.5:1 minimum)
- Use alpha transparency (`/80`) for semi-transparent backgrounds
- Apply `backdrop-blur-lg` for modern glassmorphism effect
- Ensure theme persists across page navigations (cookie-based)

---

### 6. Accessibility (ARIA Labels, Keyboard Navigation)

**Decision**: Follow Radix UI patterns + manual ARIA for custom components

**Rationale**:
- Radix UI components (Sheet, Button) include ARIA automatically
- Custom elements (logo, photo grid items) need manual `aria-label` attributes
- Keyboard navigation via Radix focus management + semantic HTML

**Implementation Checklist**:
- ✅ Burger menu button: `aria-label="Open navigation menu"` (FR-019)
- ✅ Logo: `<img alt="Fotowettbewerb Bernbeuren logo">`
- ✅ Photo links: `<Link aria-label={`View ${photo.title}`}>`
- ✅ Menu items: Use `<Link>` (semantic, keyboard accessible)
- ✅ Header: `<header role="banner">` (semantic HTML5)
- ✅ Photo grid: `<main role="main">` wrapper

**Testing**:
- Tab navigation through all menu items (FR-018)
- Escape key closes menu (Radix handles)
- Screen reader announces all elements correctly
- Focus indicators visible on all interactive elements

---

### 7. CSS Animation Performance (60fps Target)

**Decision**: Use CSS `transform` and `opacity` for animations, avoid layout properties

**Rationale**:
- `transform` (scale, translate) and `opacity` are GPU-accelerated
- Changing `height` or `top` triggers layout reflow (slower)
- CSS `transition` with `will-change` hint optimizes for animations

**Implementation Pattern**:
```css
/* Header transition classes */
.header {
  transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.header--expanded {
  transform: scaleY(1); /* 20vh height */
}

.header--compact {
  transform: scaleY(0.4); /* ~80px when base is 200px */
}
```

**Best Practices**:
- Use `cubic-bezier(0.4, 0, 0.2, 1)` easing (smooth, not linear)
- Set `transition-duration: 350ms` (middle of 300-400ms range per FR-012)
- Add `will-change: transform` to hint browser optimization
- Remove `will-change` after animation completes (avoid memory overhead)
- Test on mobile devices (60fps harder to achieve than desktop)

---

## Technology Stack Summary

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Frontend Framework | React | 19 | Project standard (CLAUDE.md) |
| Type System | TypeScript | Latest | Strict typing required (constitution II) |
| Styling | Tailwind CSS | v4 | CSS-first config, dark mode support |
| UI Components | Radix UI | Latest | Accessible, theme-aware components |
| Routing | Laravel Wayfinder | Latest | Type-safe route generation |
| Page Rendering | Inertia.js | v2 | SSR, deferred props for performance |
| Backend | Laravel | 12 | Project framework (constitution I) |
| Testing | PHPUnit | 11 | Laravel standard (constitution III) |

---

## Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial Load (3G) | 5s | Deferred photo loading, lazy images |
| Initial Load (Broadband) | 2s | Optimized assets, CDN (future) |
| Header Transition | 350ms | CSS transform, GPU acceleration |
| Frame Rate | 60fps | requestAnimationFrame throttling |
| Contrast Ratio | 4.5:1 | WCAG AA compliance testing |

---

## Open Questions / Future Enhancements

**None for MVP**. All technical decisions finalized for Phase 1 design.

**Post-MVP Considerations**:
1. Image optimization pipeline (responsive srcset, WebP format)
2. CDN integration for photo delivery (S3 + CloudFront)
3. Infinite scroll for large photo collections (100+ photos)
4. Photo preloading on hover (UX enhancement)
5. Header animation on scroll-up (show header when scrolling up)

---

## References

- [React useEffect Hook Docs](https://react.dev/reference/react/useEffect)
- [Radix UI Sheet Component](https://www.radix-ui.com/primitives/docs/components/sheet)
- [Tailwind CSS v4 Grid Utilities](https://tailwindcss.com/docs/grid-template-columns)
- [Inertia.js v2 Deferred Props](https://inertiajs.com/deferred-props)
- [CSS Triggers (Performance)](https://csstriggers.com/)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
