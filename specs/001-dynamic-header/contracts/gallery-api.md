# Gallery Landing Page API Contract

**Feature**: Dynamic Header with Photo Gallery Landing Page
**Version**: 1.0.0
**Date**: 2025-11-16
**Protocol**: Inertia.js (Server-Side Rendered)

## Overview

This contract defines the data structure and interaction pattern between the Laravel backend (`PublicGalleryController`) and the React frontend (`gallery.tsx` page component) via Inertia.js v2.

**Note**: This is not a REST API. Inertia.js uses server-side rendering with JSON props, so no separate API endpoints are needed.

---

## Endpoints

### GET / (Gallery Landing Page)

**Purpose**: Render the landing page with dynamic header and photo gallery

**Route**: `/` (root URL)
**Controller**: `PublicGalleryController@gallery`
**Method**: `GET`
**Authentication**: None (public access)

**Request**:
```http
GET / HTTP/1.1
Host: fotowettbewerb-bernbeuren.local
Accept: text/html, application/json (Inertia header)
X-Inertia: true
X-Inertia-Version: <asset-version>
```

**Response** (Inertia JSON):
```json
{
  "component": "Gallery",
  "props": {
    "photos": {
      "deferred": true,
      "data": [
        {
          "id": 1,
          "title": "Sunset over Bernbeuren",
          "url": "/storage/photos/photo-1.jpg",
          "photographer_name": "Max Mustermann",
          "upload_date": "2025-11-15T14:30:00Z",
          "approval_status": "approved"
        },
        {
          "id": 2,
          "title": "Village Church",
          "url": "/storage/photos/photo-2.jpg",
          "photographer_name": null,
          "upload_date": "2025-11-14T10:15:00Z",
          "approval_status": "approved"
        }
      ]
    }
  },
  "url": "/",
  "version": "<asset-version>"
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `component` | string | React component name to render ("Gallery") |
| `props.photos` | object | Deferred prop containing photo collection |
| `props.photos.deferred` | boolean | `true` indicates async loading |
| `props.photos.data` | array | Array of Photo objects (see Photo schema below) |
| `url` | string | Current page URL |
| `version` | string | Asset version for cache busting |

**HTTP Status Codes**:
- `200 OK`: Gallery page rendered successfully
- `500 Internal Server Error`: Server-side error (log and show error page)

---

## Data Schemas

### Photo Object

```typescript
interface Photo {
  id: number;                  // Unique photo identifier
  title: string;               // Photo title/caption (max 255 chars)
  url: string;                 // Absolute or relative path to photo file
  photographer_name: string | null; // Photographer name (optional)
  upload_date: string;         // ISO 8601 timestamp (e.g., "2025-11-15T14:30:00Z")
  approval_status: "approved"; // Only approved photos sent to frontend
}
```

**Field Constraints**:
- `id`: Positive integer, unique across all photos
- `title`: Non-empty string, max 255 characters
- `url`: Valid file path or URL (validated server-side)
- `photographer_name`: String or `null` (anonymous submissions allowed)
- `upload_date`: ISO 8601 format, past or present date
- `approval_status`: Always `"approved"` for public gallery (filtered server-side)

**Example Photo**:
```json
{
  "id": 42,
  "title": "Alpine Meadow",
  "url": "/storage/photos/meadow-42.jpg",
  "photographer_name": "Anna Schmidt",
  "upload_date": "2025-11-10T09:45:00Z",
  "approval_status": "approved"
}
```

---

## Business Logic

### Photo Filtering (Server-Side)

**Query**: Only photos with `approval_status = 'approved'` are returned (FR-008)

```php
// PublicGalleryController.php
Photo::where('approval_status', 'approved')
     ->orderBy('upload_date', 'desc')
     ->get();
```

### Photo Ordering

**Default Sort**: Newest photos first (`upload_date DESC`)
**Future**: Consider user-configurable sorting (most voted, random, etc.)

### Empty State Handling

**Scenario**: No approved photos exist
**Response**: `props.photos.data = []` (empty array)
**Frontend Behavior**: Display empty state message (edge case from spec)

---

## Client-Side Routing (Wayfinder)

### Photo Navigation

**Action**: User clicks photo in gallery (FR-021)
**Behavior**: Navigate to dedicated photo rating page

**Wayfinder Route**:
```typescript
import { show as photoShow } from '@/actions/photo';

<Link href={photoShow.url(photo.id)}>
  <img src={photo.url} alt={photo.title} />
</Link>
```

**Generated Route**: `/photos/{id}` (assumed based on FR-021)

### Menu Navigation

**Action**: User selects menu item (FR-007)
**Routes**:
- Gallery → `route('gallery')` → `/`
- Upload → `route('upload')` → `/upload` (assumed)
- Login → `route('login')` → `/login`
- Impressum → `route('impressum')` → `/impressum`

**Wayfinder Integration**:
```typescript
import { Link } from '@inertiajs/react';
import { gallery, upload, login, impressum } from '@/routes';

<nav>
  <Link href={gallery.url()}>Gallery</Link>
  <Link href={upload.url()}>Upload</Link>
  <Link href={login.url()}>Login</Link>
  <Link href={impressum.url()}>Impressum</Link>
</nav>
```

---

## Performance Contract

### Initial Page Load

**Target**: 5s on 3G, 2s on broadband (SC-009)

**Strategy**:
1. Header and critical CSS load first (synchronous)
2. Photo data loads asynchronously via Inertia deferred props
3. Below-the-fold images lazy-loaded (`loading="lazy"`)

**Metrics**:
- **Time to Interactive (TTI)**: Header functional + first 3 photos visible
- **First Contentful Paint (FCP)**: <1s (header renders immediately)
- **Largest Contentful Paint (LCP)**: <2.5s (first photo visible)

### Caching Strategy

**Server-Side**:
```php
// Cache approved photos for 5 minutes
Cache::remember('approved_photos', 300, function () {
    return Photo::where('approval_status', 'approved')
                ->orderBy('upload_date', 'desc')
                ->get();
});
```

**Client-Side**: Inertia asset versioning for cache busting

---

## Error Handling

### Server Errors

**Scenario**: Database connection fails
**Response**: HTTP 500 with error page
**Frontend Behavior**: Display error message, suggest retry

### Missing Photos

**Scenario**: Photo URL points to non-existent file
**Response**: `url` still returned (backend doesn't validate file existence)
**Frontend Behavior**: Use `<img>` `onerror` handler to show placeholder

**Example**:
```tsx
<img
  src={photo.url}
  alt={photo.title}
  onError={(e) => {
    e.currentTarget.src = '/images/photo-placeholder.jpg';
  }}
/>
```

### Empty State

**Scenario**: No approved photos (`photos.data.length === 0`)
**Frontend Behavior**: Display message "No photos available yet. Check back soon!"

---

## Security Considerations

### Input Validation

**Server-Side**: Photo URLs validated on upload (separate feature, not in scope)
**Frontend**: No user input on landing page (read-only gallery)

### XSS Prevention

**Photo Titles**: Escaped automatically by React (`{photo.title}` is safe)
**Photo URLs**: Validated server-side to prevent JavaScript injection

### CSRF Protection

**Not Required**: No forms or POST requests on landing page
**Future**: Upload and rating pages will require CSRF tokens

---

## Versioning

**Current Version**: 1.0.0
**Breaking Changes**: None (initial implementation)
**Future Considerations**:
- Add pagination (`?page=1`)
- Add filtering (`?category=landscapes`)
- Add sorting (`?sort=votes_desc`)

---

## Testing Checklist

### Backend Tests (PHPUnit)

- [ ] Test `PublicGalleryController@gallery` returns approved photos only
- [ ] Test empty state when no approved photos exist
- [ ] Test photos ordered by `upload_date` descending
- [ ] Test deferred prop structure matches schema
- [ ] Test HTTP 200 response for valid request

### Frontend Tests (Vitest/Jest)

- [ ] Test `gallery.tsx` renders with photo data
- [ ] Test empty state message when `photos.length === 0`
- [ ] Test photo click navigates to rating page
- [ ] Test responsive grid layout (1/3/4 columns)
- [ ] Test photo aspect ratios preserved
- [ ] Test dark mode theme switching

### Integration Tests

- [ ] Test full page load performance (TTI < 5s/3G)
- [ ] Test header scroll transition at 100px threshold
- [ ] Test menu navigation to all 4 routes
- [ ] Test keyboard navigation through menu
- [ ] Test lazy image loading for below-fold photos

---

## Example Implementation

### Backend (Laravel)

```php
// app/Http/Controllers/PublicGalleryController.php
namespace App\Http\Controllers;

use App\Models\Photo;
use Inertia\Inertia;
use Inertia\Response;

class PublicGalleryController extends Controller
{
    public function gallery(): Response
    {
        return Inertia::render('Gallery', [
            'photos' => Inertia::defer(fn () =>
                Photo::where('approval_status', 'approved')
                     ->orderBy('upload_date', 'desc')
                     ->get()
            ),
        ]);
    }
}
```

### Frontend (React)

```tsx
// resources/js/Pages/gallery.tsx
import { Head, Link } from '@inertiajs/react';
import PublicHeader from '@/components/public-header';
import PhotoGrid from '@/components/photo-grid';

interface Props {
  photos: Array<{
    id: number;
    title: string;
    url: string;
    photographer_name: string | null;
    upload_date: string;
    approval_status: 'approved';
  }>;
}

export default function Gallery({ photos }: Props) {
  return (
    <>
      <Head title="Fotowettbewerb Bernbeuren - Gallery" />

      <PublicHeader />

      <main className="container mx-auto px-4 py-8">
        {photos.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No photos available yet. Check back soon!
          </p>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </main>
    </>
  );
}
```

---

## Summary

This API contract defines:
- **1 Inertia page component**: `gallery.tsx`
- **1 backend controller method**: `PublicGalleryController@gallery`
- **1 data schema**: `Photo` object with 6 fields
- **Performance targets**: 5s/3G, 2s/broadband (SC-009)
- **Security measures**: XSS prevention, input validation
- **Error handling**: Empty states, missing images, server errors

The contract ensures type safety via TypeScript interfaces and validates against functional requirements (FR-008, FR-009, FR-021, SC-009).
