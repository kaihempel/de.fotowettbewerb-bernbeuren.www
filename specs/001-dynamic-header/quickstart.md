# Quick Start Guide: Dynamic Header & Photo Gallery

**Feature**: Dynamic Header with Photo Gallery Landing Page
**Branch**: `001-dynamic-header`
**Estimated Time**: 2-3 hours

## Prerequisites

- Laravel 12 development environment running
- Node.js and npm installed
- Basic familiarity with React, TypeScript, and Tailwind CSS

## Overview

This guide walks you through implementing the dynamic header and photo gallery landing page in **logical implementation order**, following Test-Driven Development (TDD) principles from the project constitution.

---

## Phase 1: Setup & Component Scaffolding (30 minutes)

### Step 1: Create Feature Test (TDD)

Start with tests before implementation (constitution principle III).

```bash
php artisan make:test LandingPageTest --no-interaction
```

**File**: `tests/Feature/LandingPageTest.php`

```php
<?php

namespace Tests\Feature;

use App\Models\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_displays_approved_photos(): void
    {
        // Arrange
        $approvedPhoto = Photo::factory()->create([
            'approval_status' => 'approved',
            'title' => 'Test Photo',
        ]);

        $pendingPhoto = Photo::factory()->create([
            'approval_status' => 'pending',
        ]);

        // Act
        $response = $this->get('/');

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Gallery')
            ->has('photos', 1) // Only approved photo
            ->where('photos.0.id', $approvedPhoto->id)
            ->where('photos.0.title', 'Test Photo')
        );
    }

    public function test_landing_page_shows_empty_state_when_no_photos(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Gallery')
            ->where('photos', [])
        );
    }
}
```

**Run test** (should fail - TDD red phase):
```bash
php artisan test --filter=LandingPageTest
```

### Step 2: Create Custom Hook for Scroll Detection

**File**: `resources/js/hooks/use-scroll-position.ts`

```typescript
import { useState, useEffect } from 'react';

interface UseScrollPositionOptions {
  threshold: number;
}

export function useScrollPosition({ threshold }: UseScrollPositionOptions) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollPosition(currentPosition);
      setIsScrolled(currentPosition > threshold);
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

    // Initial check
    handleScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { isScrolled, scrollPosition };
}
```

### Step 3: Create Header Component

**File**: `resources/js/components/public-header.tsx`

```typescript
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { useScrollPosition } from '@/hooks/use-scroll-position';

interface PublicHeaderProps {
  logoUrl?: string;
}

export default function PublicHeader({ logoUrl = '/images/logo.svg' }: PublicHeaderProps) {
  const { isScrolled } = useScrollPosition({ threshold: 100 });

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg
        border-b border-gray-200 dark:border-gray-800
        transition-all duration-[350ms] ease-out
        ${isScrolled ? 'h-20' : 'h-[20vh]'}
      `}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src={logoUrl}
            alt="Fotowettbewerb Bernbeuren"
            className={`
              transition-all duration-[350ms] ease-out
              ${isScrolled ? 'h-12' : 'h-16'}
            `}
          />
        </Link>

        {/* Burger Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="Open navigation menu"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </button>
          </SheetTrigger>

          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/upload"
                className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Upload
              </Link>
              <Link
                href="/login"
                className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/impressum"
                className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Impressum
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

### Step 4: Create Photo Grid Component

**File**: `resources/js/components/photo-grid.tsx`

```typescript
import { Link } from '@inertiajs/react';

interface Photo {
  id: number;
  title: string;
  url: string;
  photographer_name: string | null;
  upload_date: string;
  approval_status: 'approved';
}

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Link
          key={photo.id}
          href={`/photos/${photo.id}`}
          className="group relative overflow-hidden rounded-lg hover:shadow-xl transition-shadow"
          aria-label={`View ${photo.title}`}
        >
          <img
            src={photo.url}
            alt={photo.title}
            loading="lazy"
            className="w-full h-auto object-contain aspect-auto hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/images/photo-placeholder.jpg';
            }}
          />

          {/* Optional: Overlay with photo info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <div className="text-white">
              <h3 className="font-semibold text-sm">{photo.title}</h3>
              {photo.photographer_name && (
                <p className="text-xs text-gray-300">by {photo.photographer_name}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

---

## Phase 2: Page Component & Backend (45 minutes)

### Step 5: Create Gallery Page Component

**File**: `resources/js/Pages/Gallery.tsx` (replace `welcome.tsx`)

```tsx
import { Head } from '@inertiajs/react';
import PublicHeader from '@/components/public-header';
import PhotoGrid from '@/components/photo-grid';

interface Photo {
  id: number;
  title: string;
  url: string;
  photographer_name: string | null;
  upload_date: string;
  approval_status: 'approved';
}

interface Props {
  photos: Photo[];
}

export default function Gallery({ photos }: Props) {
  return (
    <>
      <Head>
        <title>Fotowettbewerb Bernbeuren - Gallery</title>
        <meta
          name="description"
          content="Browse contest photo entries from Bernbeuren"
        />
      </Head>

      <PublicHeader />

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-[20vh]" />

      <main className="container mx-auto px-4 py-8">
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No photos available yet. Check back soon!
            </p>
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </main>
    </>
  );
}
```

### Step 6: Update Backend Controller (if needed)

**File**: `app/Http/Controllers/PublicGalleryController.php`

Verify controller returns approved photos:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Inertia\Inertia;
use Inertia\Response;

class PublicGalleryController extends Controller
{
    public function gallery(): Response
    {
        $photos = Photo::where('approval_status', 'approved')
                       ->orderBy('upload_date', 'desc')
                       ->get();

        return Inertia::render('Gallery', [
            'photos' => $photos,
        ]);
    }
}
```

**Optional: Add caching for performance**

```php
use Illuminate\Support\Facades\Cache;

$photos = Cache::remember('approved_photos', 300, function () {
    return Photo::where('approval_status', 'approved')
                ->orderBy('upload_date', 'desc')
                ->get();
});
```

### Step 7: Update Route (if needed)

**File**: `routes/web.php`

Verify route exists (should already be configured per spec):

```php
Route::get('/', [PublicGalleryController::class, 'gallery'])->name('gallery');
```

---

## Phase 3: Testing & Refinement (45 minutes)

### Step 8: Run Backend Tests

```bash
# Run feature tests
php artisan test --filter=LandingPageTest

# Should now pass (TDD green phase)
```

### Step 9: Manual Testing Checklist

1. **Header Scroll Behavior**:
   - [ ] Open `http://localhost:8000/`
   - [ ] Verify header is 20vh tall at top
   - [ ] Scroll down 100px
   - [ ] Verify header smoothly transitions to 80px over ~350ms
   - [ ] Scroll back up
   - [ ] Verify header expands back to 20vh

2. **Photo Grid Layout**:
   - [ ] Resize browser to mobile width (320px)
   - [ ] Verify photos display in 1 column
   - [ ] Resize to tablet width (768px)
   - [ ] Verify photos display in 3 columns
   - [ ] Resize to desktop width (1024px+)
   - [ ] Verify photos display in 4 columns

3. **Menu Navigation**:
   - [ ] Click burger menu icon
   - [ ] Verify menu opens with 4 items
   - [ ] Click each menu item
   - [ ] Verify navigation works (may get 404 if pages don't exist yet)
   - [ ] Press Escape key
   - [ ] Verify menu closes

4. **Dark Mode**:
   - [ ] Toggle system theme to dark mode
   - [ ] Verify header background changes
   - [ ] Verify text remains readable (4.5:1 contrast)
   - [ ] Verify photo grid maintains proper styling

5. **Photo Interaction**:
   - [ ] Click a photo
   - [ ] Verify navigation to `/photos/{id}` (may get 404 if route doesn't exist)

### Step 10: Performance Testing

```bash
# Build production assets
npm run build

# Test load time with DevTools Network tab (throttle to "Slow 3G")
# Target: Page interactive within 5 seconds
```

**Lighthouse Audit**:
1. Open Chrome DevTools → Lighthouse
2. Select "Performance" category
3. Run audit
4. Target scores:
   - Performance: >90
   - Accessibility: 100
   - Best Practices: >90

---

## Phase 4: Code Quality & Finalization (30 minutes)

### Step 11: Format Code

```bash
# Format PHP
vendor/bin/pint --dirty

# Format TypeScript/React
npm run lint

# Type check
npm run types
```

### Step 12: Browser Testing

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on macOS)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Step 13: Accessibility Testing

```bash
# Install axe-core (if not already)
npm install --save-dev @axe-core/react

# Or use browser extension: axe DevTools
```

**Manual Tests**:
- [ ] Tab through all menu items (keyboard navigation)
- [ ] Verify focus indicators visible
- [ ] Test with screen reader (VoiceOver on macOS, NVDA on Windows)
- [ ] Verify all images have alt text
- [ ] Verify ARIA labels on burger menu button

---

## Troubleshooting

### Header doesn't transition on scroll

**Cause**: `useScrollPosition` hook not detecting scroll
**Fix**: Verify `threshold` prop is set to `100`

```tsx
const { isScrolled } = useScrollPosition({ threshold: 100 });
```

### Photos not loading

**Cause**: Photo URLs incorrect or `PublicGalleryController` not returning data
**Debug**:
```bash
# Check database for approved photos
php artisan tinker
>>> Photo::where('approval_status', 'approved')->count();

# Check Inertia props in browser DevTools Network tab
# Look for Inertia response JSON
```

### Menu doesn't close after clicking item

**Cause**: Radix Sheet not auto-closing
**Fix**: Add `onOpenChange` handler to Sheet component:

```tsx
import { useState } from 'react';

const [menuOpen, setMenuOpen] = useState(false);

<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
  {/* ... */}
  <Link onClick={() => setMenuOpen(false)}>Gallery</Link>
</Sheet>
```

### Dark mode not working

**Cause**: `use-appearance` hook not configured
**Fix**: Verify hook is imported and Tailwind `dark:` classes applied:

```tsx
// Header should have dark mode classes
className="bg-white/80 dark:bg-gray-900/80"
```

---

## Next Steps

After completing this feature:

1. **Implement Photo Rating Page** (FR-021 dependency)
   - Create `/photos/{id}` route
   - Build rating interface
   - Link from gallery

2. **Add Photo Upload Feature**
   - Create `/upload` route
   - Build upload form
   - Implement file validation

3. **Optimize Images**
   - Generate responsive image sizes (srcset)
   - Convert to WebP format
   - Set up CDN (S3 + CloudFront)

4. **Add Analytics**
   - Track photo clicks
   - Measure SC-008 (95% navigation success rate)

---

## Summary

**Total Time**: ~2.5 hours
**Files Created/Modified**: 6
- `tests/Feature/LandingPageTest.php` (NEW)
- `resources/js/hooks/use-scroll-position.ts` (NEW)
- `resources/js/components/public-header.tsx` (NEW)
- `resources/js/components/photo-grid.tsx` (NEW)
- `resources/js/Pages/Gallery.tsx` (NEW, replaces welcome.tsx)
- `app/Http/Controllers/PublicGalleryController.php` (VERIFY/UPDATE)

**Tests Written**: 2 feature tests
**Success Criteria Met**: FR-001 through FR-023, SC-001 through SC-009

You now have a fully functional dynamic header and photo gallery landing page! 🎉
