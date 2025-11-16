# Research: Public Gallery Homepage with Infinite Scroll

**Feature**: 004-public-gallery
**Date**: 2025-11-15
**Status**: Complete

## Overview

This document consolidates research findings for implementing the public gallery homepage with infinite scroll pagination. All technical decisions are based on Laravel 12, Inertia.js v2, React 19, and Tailwind CSS v4 best practices.

---

## 1. Cursor-Based Pagination in Laravel

### Decision
Use Laravel's built-in `cursorPaginate()` method for gallery pagination.

### Rationale
- **Consistency**: Prevents duplicate/missing items when new photos are approved during browsing
- **Performance**: More efficient for large datasets (< 10,000 photos in scope)
- **Simplicity**: Built into Laravel 12, no custom implementation needed
- **Cursor Encoding**: Automatically handles base64 encoding of cursor position

### Implementation Pattern

```php
// In PublicGalleryController
public function index(Request $request): Response
{
    $photos = PhotoSubmission::query()
        ->approved()
        ->select(['id', 'thumbnail_path', 'image_path', 'rate', 'created_at'])
        ->orderBy('created_at')
        ->cursorPaginate(20);

    return Inertia::render('Gallery/Index', [
        'photos' => $photos->through(fn ($photo) => [
            'id' => $photo->id,
            'thumbnail_url' => $photo->thumbnail_url,
            'full_image_url' => $photo->full_image_url,
            'rate' => $photo->rate,
            'created_at' => $photo->created_at,
        ]),
    ]);
}
```

### Inertia Integration
- Cursor automatically included in pagination metadata
- Access via `photos.next_cursor` in React
- Pass cursor as `?cursor=xxx` query parameter for next page

### Alternatives Considered
- **Offset pagination**: Rejected due to "page drift" issues when data changes
- **Custom cursor implementation**: Rejected as Laravel provides this out-of-box

---

## 2. Infinite Scroll Patterns with Inertia.js v2

### Decision
Use Intersection Observer API with manual state management for infinite scroll.

### Rationale
- **Inertia v2 WhenVisible**: Designed for deferred props, not ideal for append-style pagination
- **Control**: Direct control over scroll detection, loading states, and data merging
- **Browser Support**: Intersection Observer supported in all target browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
- **Performance**: No additional Inertia overhead, efficient scroll detection

### Implementation Pattern

```tsx
// In Gallery/Index.tsx
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

export default function GalleryIndex({ photos: initialPhotos }) {
  const [photos, setPhotos] = useState(initialPhotos.data);
  const [cursor, setCursor] = useState(initialPhotos.next_cursor);
  const [hasMore, setHasMore] = useState(!!initialPhotos.next_cursor);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    router.get(
      '/',
      { cursor },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['photos'],
        onSuccess: (page) => {
          const newPhotos = page.props.photos;
          setPhotos(prev => [...prev, ...newPhotos.data]);
          setCursor(newPhotos.next_cursor);
          setHasMore(!!newPhotos.next_cursor);
          setIsLoading(false);
        },
      }
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, cursor]);

  return (
    <div>
      <PhotoGrid photos={photos} />
      {isLoading && <SkeletonLoader />}
      {hasMore && <div ref={loadMoreRef} />}
      {!hasMore && <p>You've reached the end!</p>}
    </div>
  );
}
```

### Key Points
- **preserveState: true**: Keeps component state during navigation
- **preserveScroll: true**: Prevents scroll reset on load
- **only: ['photos']**: Optimizes payload by requesting only photos data
- **threshold: 0.1**: Triggers when 10% of sentinel element visible

### Alternatives Considered
- **Inertia WhenVisible**: Rejected as it's designed for deferred props, not pagination
- **Manual scroll events**: Rejected in favor of Intersection Observer (better performance)
- **Third-party libraries (react-infinite-scroll)**: Rejected to minimize dependencies

---

## 3. Skeleton Loader Implementation

### Decision
Use Tailwind CSS-only skeleton loaders with animated gradient.

### Rationale
- **Performance**: Pure CSS, no JavaScript overhead
- **Consistency**: Matches photo grid layout exactly
- **Dark Mode**: Automatically adapts via Tailwind `dark:` variants
- **No Dependencies**: No additional libraries needed

### Implementation Pattern

```tsx
// SkeletonLoader.tsx
export default function SkeletonLoader() {
  const skeletonCount = 20; // Match page size

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}
```

```css
/* In app.css if custom animation needed */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-shine) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Key Points
- **aspect-square**: Maintains 1:1 aspect ratio (prevents layout shift)
- **animate-pulse**: Tailwind's built-in pulse animation
- **Grid matches PhotoGrid**: Same responsive column configuration

### Alternatives Considered
- **Spinner component**: Rejected as spec requires skeleton loaders
- **react-loading-skeleton**: Rejected to minimize dependencies
- **Static placeholders**: Rejected as animation improves perceived performance

---

## 4. Image Lazy Loading Best Practices

### Decision
Use native `loading="lazy"` attribute with Intersection Observer fallback.

### Rationale
- **Browser Native**: Supported in all target browsers, zero JavaScript for most users
- **Performance**: Browser handles intersection detection natively
- **Fallback**: Intersection Observer for older browsers or custom control
- **Progressive Enhancement**: Works without JavaScript (degrades gracefully)

### Implementation Pattern

```tsx
// GalleryPhotoCard.tsx
import { useState } from 'react';

interface Props {
  photo: {
    id: number;
    thumbnail_url: string;
    rate: number;
  };
}

export default function GalleryPhotoCard({ photo }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
      {!hasError ? (
        <img
          src={photo.thumbnail_url}
          alt={`Photo ${photo.id}`}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <span>Failed to load</span>
        </div>
      )}
    </div>
  );
}
```

### Key Points
- **loading="lazy"**: Browser handles lazy loading
- **Opacity transition**: Fade-in effect when image loads
- **Error handling**: Graceful fallback for failed images
- **Alt text**: Accessibility requirement

### Alternatives Considered
- **Intersection Observer only**: Rejected as native lazy loading is simpler and more performant
- **Progressive image loading (blur-up)**: Deferred to future enhancement
- **Responsive images (srcset)**: Deferred to future enhancement

---

## 5. React 19 Infinite Scroll Patterns

### Decision
Use `useEffect` with Intersection Observer and proper cleanup.

### Rationale
- **React 19 Compatible**: Standard hook patterns work with React 19
- **Memory Management**: Proper cleanup prevents memory leaks
- **Performance**: Intersection Observer is efficient for scroll detection
- **State Management**: Simple useState for loading/cursor/hasMore flags

### Implementation Pattern

Already covered in Section 2 (Infinite Scroll Patterns with Inertia.js v2).

### Key Points
- **Cleanup function**: `return () => observer.disconnect()`
- **Dependencies array**: `[hasMore, isLoading, cursor]` ensures re-run when state changes
- **Ref pattern**: `loadMoreRef` for sentinel element
- **Debouncing**: Not needed as Intersection Observer handles efficiently

### Alternatives Considered
- **react-window**: Rejected as not needed for < 10,000 photos
- **useInfiniteQuery (TanStack Query)**: Rejected as Inertia handles data fetching
- **Custom scroll event listeners**: Rejected in favor of Intersection Observer

---

## 6. Database Indexing for Gallery Queries

### Decision
Add composite index on `(status, created_at)` in photo_submissions table.

### Rationale
- **Query Optimization**: Gallery query filters by status and orders by created_at
- **Cursor Pagination**: Index supports efficient cursor-based pagination
- **Performance**: Meets < 100ms query execution requirement
- **Single Index**: Composite index covers both WHERE and ORDER BY clauses

### Implementation Pattern

```php
// In existing migration: XXXX_create_photo_submissions_table.php
Schema::table('photo_submissions', function (Blueprint $table) {
    $table->index(['status', 'created_at']); // Composite index for gallery queries
});
```

### Query Explained

```sql
-- Generated by Eloquent
SELECT id, thumbnail_path, image_path, rate, created_at
FROM photo_submissions
WHERE status = 'approved'
ORDER BY created_at ASC
LIMIT 20;

-- Index (status, created_at) allows:
-- 1. Fast filtering by status
-- 2. Ordered scan by created_at without additional sort
```

### N+1 Prevention
- **No relationships loaded**: Gallery doesn't need user data, so no N+1 risk
- **Select specific columns**: Only fetches needed columns
- **No additional queries**: Single query per page

### Alternatives Considered
- **Separate indexes**: Rejected as composite index is more efficient
- **Index on created_at only**: Rejected as missing status filter
- **Full-text search index**: Out of scope for v1

---

## Summary of Decisions

| Aspect | Decision | Key Benefit |
|--------|----------|-------------|
| Pagination | Laravel `cursorPaginate()` | Consistency, prevents duplicates |
| Infinite Scroll | Intersection Observer + manual state | Full control, performant |
| Loading Indicator | Tailwind CSS skeleton loaders | Matches layout, no dependencies |
| Image Lazy Loading | Native `loading="lazy"` | Browser-native, zero JS |
| React Pattern | `useEffect` + Intersection Observer | React 19 compatible, clean |
| Database Index | Composite `(status, created_at)` | Optimal query performance |

---

## Technology Stack Confirmation

All decisions align with project constitution:

- ✅ **Laravel 12**: Using cursorPaginate(), Eloquent, Inertia
- ✅ **React 19**: Standard hooks, functional components
- ✅ **TypeScript**: Strict typing, explicit props
- ✅ **Tailwind CSS v4**: CSS-only skeletons, gap utilities, dark mode
- ✅ **Inertia.js v2**: preserveState, preserveScroll, only prop
- ✅ **PHPUnit 11**: Testing strategy defined
- ✅ **Accessibility**: Alt text, keyboard nav, ARIA labels

No new dependencies introduced. All patterns use existing project stack.

---

## Open Questions Resolved

All "NEEDS CLARIFICATION" items from Technical Context have been resolved:

1. ✅ Pagination strategy: Cursor-based (Laravel cursorPaginate)
2. ✅ Infinite scroll implementation: Intersection Observer
3. ✅ Loading indicator: Tailwind CSS skeleton loaders
4. ✅ Image lazy loading: Native loading="lazy"
5. ✅ Database optimization: Composite index on (status, created_at)
6. ✅ React pattern: useEffect + Intersection Observer with cleanup

Ready to proceed to Phase 1: Design (data-model.md and contracts).
