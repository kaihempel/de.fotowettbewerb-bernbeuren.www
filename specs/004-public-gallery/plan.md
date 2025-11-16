# Implementation Plan: Public Gallery Homepage with Infinite Scroll

**Branch**: `004-public-gallery` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-public-gallery/spec.md`

## Summary

Create a public-facing gallery homepage that displays all approved photos in a responsive, infinite-scrolling grid layout. Users can browse photos and click any photo to navigate to the voting page. The gallery serves as the main entry point to the photo contest platform, transforming it from admin-focused to public-facing.

**Technical Approach**: Laravel controller with cursor-based pagination, React infinite scroll component using Intersection Observer API, skeleton loaders for loading states, and Radix UI components for consistent styling.

## Technical Context

**Language/Version**: PHP 8.4 (backend), TypeScript (frontend)
**Primary Dependencies**:
- Backend: Laravel 12, Inertia.js v2
- Frontend: React 19, Tailwind CSS v4, Radix UI components, Intersection Observer API
**Storage**: SQLite (development), Laravel filesystem for photos
**Testing**: PHPUnit 11 for backend tests
**Target Platform**: Web (responsive: mobile 320px+, tablet 768px+, desktop 1024px+)
**Project Type**: Web application (Laravel + React with Inertia)
**Performance Goals**:
- Initial page load < 2s
- Subsequent batches < 500ms
- 60fps scroll performance
- 10,000 concurrent users
**Constraints**:
- Thumbnail size < 50KB each
- Database query < 100ms
- Zero N+1 queries
- WCAG 2.1 AA accessibility compliance
**Scale/Scope**:
- < 10,000 photos for v1
- 20 photos per batch
- Cursor-based pagination

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Laravel-First Architecture
✅ **PASS** - Will use `php artisan make:controller` for PublicGalleryController, Eloquent query builder with cursor pagination, and register routes in `routes/web.php`.

### II. Type Safety & Modern Standards
✅ **PASS** - All PHP methods will have explicit return types, TypeScript strict mode enabled, Wayfinder for type-safe routes.

### III. Test-Driven Development (TDD)
✅ **PASS** - PHPUnit tests required for:
- PublicGalleryController pagination logic
- Edge cases (empty gallery, single page, last page)
- Query optimization verification (no N+1)
- Approved photo filtering

### IV. Component Reusability
✅ **PASS** - Will leverage existing Radix UI components:
- Spinner component for loading states (if exists, otherwise skeleton pattern)
- Card components for photo grid items
- Will create reusable PhotoGrid and GalleryPhotoCard components

### V. Inertia Best Practices
✅ **PASS** - Will use:
- `Inertia::render()` for gallery page
- `<Link>` component for photo navigation
- Cursor-based pagination with Inertia's data merging for infinite scroll
- Skeleton loaders while data loads

### VI. Accessibility & User Experience
✅ **PASS** - Will implement:
- Keyboard navigation (Tab, Enter)
- ARIA labels and alt text for photos
- Light/dark theme support via existing `use-appearance` hook
- Responsive design for all breakpoints
- Loading states and error handling

### VII. Code Quality & Formatting
✅ **PASS** - Will run:
- `vendor/bin/pint --dirty` before finalizing PHP changes
- `npm run lint` before finalizing TypeScript changes
- `npm run types` to verify TypeScript compilation

### VIII. Security & Authentication
✅ **PASS** - Security considerations:
- No authentication required (public gallery)
- Only approved photos exposed (status filter)
- Rate limiting on pagination endpoint
- No internal file paths exposed in URLs
- CSRF protection (automatic with Inertia)

**Constitution Compliance**: All gates PASSED. No violations to justify.

### Post-Design Constitution Re-Check

*Phase 1 Design Complete - Re-validating compliance*

✅ **All gates still PASS** after completing research and design phases:
- Laravel-First: Using Eloquent cursorPaginate, scopes, accessors
- Type Safety: All methods typed, TypeScript strict mode, Wayfinder integration
- TDD: Test plan defined (7 test scenarios in data-model.md)
- Component Reusability: Leveraging existing Radix UI components
- Inertia v2: Using preserveState, preserveScroll, cursor pagination patterns
- Accessibility: WCAG 2.1 AA compliance planned
- Code Quality: Pint/ESLint/TypeScript checks required
- Security: Public endpoint, approved photos only, rate limiting

**No new violations introduced during design phase.**

## Project Structure

### Documentation (this feature)

```text
specs/004-public-gallery/
├── plan.md              # This file
├── research.md          # Phase 0 output (technology patterns)
├── data-model.md        # Phase 1 output (PhotoSubmission entity)
├── quickstart.md        # Phase 1 output (setup instructions)
├── contracts/           # Phase 1 output (API contracts)
│   └── gallery-api.yml  # OpenAPI spec for gallery endpoint
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (Laravel + React)
app/
├── Http/
│   └── Controllers/
│       └── PublicGalleryController.php    # New: Gallery pagination endpoint
└── Models/
    └── PhotoSubmission.php                 # Existing: Add scopeApproved(), accessors

routes/
└── web.php                                 # Update: Add gallery route

resources/
├── js/
│   ├── Pages/
│   │   └── Gallery/
│   │       └── Index.tsx                   # New: Gallery page component
│   ├── components/
│   │   ├── PhotoGrid.tsx                   # New: Infinite scroll grid component
│   │   └── GalleryPhotoCard.tsx            # New: Individual photo card
│   └── hooks/
│       └── use-infinite-scroll.ts          # New: Infinite scroll hook (optional)
└── css/
    └── app.css                             # Existing: May need skeleton loader styles

tests/
└── Feature/
    └── PublicGalleryControllerTest.php     # New: Controller tests

database/
└── migrations/
    └── [existing]_create_photo_submissions_table.php  # Existing: Verify indexes
```

**Structure Decision**: Using Laravel 12's standard web application structure with Inertia.js bridging backend/frontend. Backend logic in `app/Http/Controllers/`, React pages in `resources/js/Pages/`, reusable components in `resources/js/components/`. This aligns with existing project structure from Issues #1, #2, #3.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All requirements align with constitution principles.

## Phase 0: Research

**Research Topics** (to be consolidated in `research.md`):

1. **Cursor-based pagination in Laravel**
   - Laravel's `cursorPaginate()` method
   - Cursor encoding/decoding
   - Inertia integration with cursor pagination

2. **Infinite scroll patterns with Inertia.js v2**
   - Data merging for append behavior
   - `WhenVisible` component for scroll detection
   - Alternative: Intersection Observer API directly

3. **Skeleton loader implementation**
   - CSS-only skeleton patterns with Tailwind
   - Placeholder component patterns
   - Integration with lazy loading

4. **Image lazy loading best practices**
   - Native `loading="lazy"` attribute
   - Intersection Observer for custom control
   - Progressive image loading strategies

5. **React 19 infinite scroll patterns**
   - useEffect + Intersection Observer
   - Cleanup and memory management
   - State management for loading/hasMore flags

6. **Database indexing for gallery queries**
   - Composite index on (status, created_at)
   - Query optimization for cursor pagination
   - N+1 prevention strategies

## Phase 1: Design

### Data Model (`data-model.md`)

**Entities**:

1. **PhotoSubmission** (existing, updates needed)
   - Attributes: id, user_id, image_path, thumbnail_path, status, rate, created_at, updated_at
   - New scope: `scopeApproved()`
   - New accessors: `thumbnailUrl`, `fullImageUrl`
   - Indexes: (status, created_at) composite for optimal queries

2. **GalleryPage** (conceptual, not persisted)
   - Represents paginated batch response
   - Attributes: photos collection, next_cursor, has_more, total

### API Contracts (`contracts/gallery-api.yml`)

**Endpoint**: `GET /` or `GET /gallery`
- Query params: `cursor` (optional, base64-encoded)
- Response: Inertia props with photos array, pagination metadata
- Rate limit: 100 requests/minute per IP

### Quickstart (`quickstart.md`)

Developer setup instructions:
1. Seed database with approved photos: `php artisan db:seed --class=PhotoSubmissionSeeder`
2. Start dev server: `composer run dev`
3. Visit gallery: `http://localhost:8000/`
4. Test infinite scroll by scrolling to bottom
5. Run tests: `php artisan test --filter=PublicGallery`

## Next Steps

After completing `/speckit.plan`:
1. Review generated artifacts: `research.md`, `data-model.md`, `contracts/`, `quickstart.md`
2. Run `/speckit.tasks` to generate actionable task breakdown
3. Begin implementation following task order
4. Run tests incrementally as tasks complete
5. Format code before finalizing (`pint --dirty`, `npm run lint`)

## Dependencies & Integration

**Blocking Dependencies**:
- Issue #2 (Photo Management Dashboard): Required for approved photos to exist

**Integration Dependencies**:
- Issue #3 (Public Photo Voting System): Gallery links to voting page via photo ID

**Optional Dependencies**:
- Issue #1 (Photo Upload System): Thumbnail generation improves performance

**Integration Points**:
- Voting page route: Will use Wayfinder to generate type-safe links to voting page
- Photo approval status: Relies on Issue #2's approval workflow setting `status='approved'`
