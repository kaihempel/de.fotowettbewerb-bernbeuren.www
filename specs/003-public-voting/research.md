# Research: Public Photo Voting System

**Feature**: 003-public-voting
**Date**: 2025-11-15
**Phase**: 0 - Outline & Research

## Overview

This document consolidates research findings for implementing the public photo voting system. All technical unknowns from the planning phase have been resolved through analysis of Laravel best practices, Inertia.js patterns, and React component design.

## Research Areas

### 1. Cookie-Based User Identification

**Decision**: Use Laravel's built-in Cookie facade with UUID v4 identifiers

**Rationale**:
- Laravel provides secure cookie handling with encryption out of the box
- UUID v4 provides sufficient randomness for anonymous user tracking (2^122 unique values)
- Cookie middleware can be registered globally in `bootstrap/app.php` following Laravel 12 patterns
- HttpOnly flag prevents JavaScript access, reducing XSS risk
- SameSite=lax prevents CSRF while allowing normal navigation

**Implementation Pattern**:
```php
// In EnsureFwbId middleware
if (!$request->hasCookie('fwb_id')) {
    $fwbId = Str::uuid()->toString();
    Cookie::queue('fwb_id', $fwbId, 525600); // 1 year in minutes
}
```

**Alternatives Considered**:
- Session-based tracking: Rejected because sessions expire too quickly for long-term contest voting
- IP-based tracking: Rejected due to shared IPs (NAT, public WiFi) causing false duplicate prevention
- LocalStorage: Rejected because not accessible server-side for vote validation

**Security Considerations**:
- Cookie encrypted by Laravel's encryption middleware
- Rate limiting by IP prevents cookie manipulation abuse
- No PII stored in cookie (just random UUID)

---

### 2. Vote Rate Calculation Logic

**Decision**: Use database transactions with row-level locking for atomic rate updates

**Rationale**:
- Prevents race conditions when multiple votes submitted simultaneously
- Ensures rate never goes below 0 (minimum constraint)
- Maintains data integrity with ACID guarantees
- Laravel's DB::transaction() provides clean syntax

**Implementation Pattern**:
```php
DB::transaction(function () use ($photoSubmission, $voteType, $fwbId) {
    $existingVote = $photoSubmission->votes()
        ->where('fwb_id', $fwbId)
        ->lockForUpdate() // Prevents concurrent modifications
        ->first();

    $adjustment = 0;

    if ($existingVote) {
        if ($existingVote->vote_type !== $voteType) {
            $adjustment = $voteType ? 2 : -2; // Vote change: up->down or down->up
            $existingVote->update(['vote_type' => $voteType]);
        }
        // Same vote = no change
    } else {
        $adjustment = $voteType ? 1 : -1; // New vote
        PhotoVote::create([
            'photo_submission_id' => $photoSubmission->id,
            'fwb_id' => $fwbId,
            'vote_type' => $voteType,
        ]);
    }

    if ($adjustment !== 0) {
        $newRate = max(0, $photoSubmission->rate + $adjustment);
        $photoSubmission->update(['rate' => $newRate]);
    }
});
```

**Alternatives Considered**:
- Pessimistic locking on photo_submissions table: Rejected due to performance impact on concurrent reads
- Optimistic locking with version column: Rejected as unnecessarily complex for this use case
- Queue-based vote processing: Rejected because optimistic UI updates require immediate feedback

**Edge Cases Handled**:
- Concurrent vote submissions: Transaction isolation prevents conflicts
- Rate going negative: `max(0, ...)` enforces minimum constraint
- Vote change calculation: Correctly handles all transitions (up->down=-2, down->up=+2)

---

### 3. Navigation Query Optimization

**Decision**: Use Eloquent scopes with indexed queries for efficient next/previous photo lookup

**Rationale**:
- Avoid N+1 queries by eager loading vote relationships
- Index on `created_at` column for fast chronological ordering
- Subquery approach filters unrated photos efficiently
- Laravel's query builder optimizes to single SQL query

**Implementation Pattern**:
```php
// In PhotoSubmission model
public function getNextUnratedFor(string $fwbId): ?PhotoSubmission
{
    return static::approved()
        ->where('created_at', '>', $this->created_at)
        ->whereDoesntHave('votes', fn($q) => $q->where('fwb_id', $fwbId))
        ->orderBy('created_at', 'asc')
        ->first();
}

public function getPreviousRatedFor(string $fwbId): ?PhotoSubmission
{
    return static::approved()
        ->where('created_at', '<', $this->created_at)
        ->whereHas('votes', fn($q) => $q->where('fwb_id', $fwbId))
        ->orderBy('created_at', 'desc')
        ->first();
}
```

**Query Performance**:
- Index on `photo_submissions.created_at` ensures fast ordering
- Index on `photo_votes.fwb_id` accelerates vote lookups
- Composite index on `(photo_submission_id, fwb_id)` for unique constraint doubles as query optimization
- `first()` with `limit 1` prevents unnecessary row scanning

**Alternatives Considered**:
- Load all photos and filter in PHP: Rejected due to memory usage with large datasets
- Separate queries for voted/unvoted lists: Rejected as less efficient than on-demand lookup
- Cursor pagination: Deferred to future optimization if performance issues arise

---

### 4. Optimistic UI Updates with Error Recovery

**Decision**: Use Inertia.js manual visit with onBefore/onSuccess/onError hooks for optimistic updates

**Rationale**:
- Inertia v2 provides built-in hooks for request lifecycle
- React state updates before server response for immediate feedback
- Automatic rollback on error maintains UI consistency
- Single retry with exponential backoff handles transient failures

**Implementation Pattern**:
```typescript
const handleVote = (voteType: 'up' | 'down') => {
  const previousVote = currentVote;

  // Optimistic update
  setCurrentVote(voteType);

  router.post(vote.url(photoId),
    { vote_type: voteType },
    {
      preserveScroll: true,
      onError: () => {
        // Retry once after 500ms
        setTimeout(() => {
          router.post(vote.url(photoId),
            { vote_type: voteType },
            {
              preserveScroll: true,
              onError: () => {
                // Rollback on second failure
                setCurrentVote(previousVote);
                toast.error('Failed to submit vote. Please try again.');
              }
            }
          );
        }, 500);
      }
    }
  );
};
```

**Alternatives Considered**:
- No optimistic updates: Rejected due to poor perceived performance
- Infinite retry queue: Rejected as it could mask persistent errors
- Manual AJAX with separate state management: Rejected because Inertia handles this cleanly

**Error Recovery Strategy**:
1. First attempt fails → automatic retry after 500ms
2. Second attempt fails → rollback UI and show error toast
3. User can manually retry by clicking vote button again

---

### 5. Rate Limiting Strategy

**Decision**: Use Laravel's built-in throttle middleware with IP-based limiting

**Rationale**:
- Laravel RateLimiter provides Redis-backed or cache-backed throttling
- 60 votes per hour per IP prevents automated abuse
- Transparent to legitimate users (unlikely to hit limit)
- Returns 429 Too Many Requests with Retry-After header

**Implementation Pattern**:
```php
// In routes/web.php
Route::post('/gallery/{photoSubmission}/vote', [PublicGalleryController::class, 'vote'])
    ->middleware(['throttle:votes'])
    ->name('gallery.vote');

// In bootstrap/app.php (or RouteServiceProvider)
RateLimiter::for('votes', function (Request $request) {
    return Limit::perHour(60)->by($request->ip());
});
```

**Why IP-based**:
- Cookie (fwb_id) is user-controlled and can be regenerated
- IP provides defense-in-depth against cookie manipulation
- Shared IPs (NAT) will share the limit, which is acceptable trade-off

**Alternatives Considered**:
- Cookie-based limiting: Rejected because cookies can be deleted/regenerated
- Per-user account limiting: Not applicable (anonymous voting)
- CAPTCHA on rate limit: Deferred to future enhancement if abuse occurs

**User Impact**:
- Average voter rates 20-30 photos in contest (~30 minutes)
- 60 votes/hour limit = 1 vote per minute average
- Legitimate users should never hit this limit

---

### 6. Database Schema Design

**Decision**: Two-table normalized design with foreign key cascade delete

**Rationale**:
- Normalized design prevents data duplication
- Foreign key constraints maintain referential integrity
- Cascade delete automatically cleans up orphaned votes
- Unique constraint on (photo_submission_id, fwb_id) enforces one-vote-per-photo

**Schema**:

**photo_submissions** (existing, add column):
```sql
ALTER TABLE photo_submissions ADD COLUMN rate INTEGER UNSIGNED NOT NULL DEFAULT 0;
CREATE INDEX idx_photo_submissions_created_at ON photo_submissions(created_at);
```

**photo_votes** (new table):
```sql
CREATE TABLE photo_votes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    photo_submission_id BIGINT UNSIGNED NOT NULL,
    fwb_id VARCHAR(36) NOT NULL, -- UUID format
    vote_type BOOLEAN NOT NULL,  -- true=thumbs up, false=thumbs down
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    FOREIGN KEY (photo_submission_id)
        REFERENCES photo_submissions(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_vote_per_photo (photo_submission_id, fwb_id),
    INDEX idx_fwb_id (fwb_id)
);
```

**Index Strategy**:
- Primary key (id): Auto-created, used for relationships
- Unique key (photo_submission_id, fwb_id): Enforces business rule + accelerates vote lookups
- Index (fwb_id): Accelerates "find all votes by user" queries for progress tracking
- Index (created_at) on photo_submissions: Accelerates navigation queries

**Alternatives Considered**:
- Denormalized vote count cache: Rejected because rate column serves this purpose
- Separate tables for thumbs up/down: Rejected as unnecessary complexity
- NoSQL for votes: Rejected because relational integrity is critical

---

### 7. Frontend Component Architecture

**Decision**: Composition-based React components with shared state via Inertia props

**Rationale**:
- Inertia passes server state as props (no separate API calls needed)
- Component composition promotes reusability
- Tailwind CSS v4 for styling (matches project standards)
- Radix UI primitives for accessibility

**Component Structure**:
```
Gallery.tsx (page)
├── PhotoViewer.tsx (photo display)
├── VotingButtons.tsx (thumbs up/down)
├── PhotoNavigation.tsx (prev/next arrows)
└── ProgressIndicator.tsx (X of Y rated)
```

**State Management**:
- Server-rendered state from Inertia props (photo, userVote, nextPhoto, previousPhoto, progress)
- Local React state for optimistic updates (currentVote)
- No Redux/Zustand needed (Inertia manages state sync)

**Accessibility**:
- Radix UI Button primitives for keyboard navigation
- ARIA labels for screen readers
- Focus management for keyboard users
- Touch targets ≥44x44px for mobile

**Alternatives Considered**:
- Single monolithic component: Rejected for poor testability and reusability
- Separate API calls from frontend: Rejected because Inertia handles data fetching
- Context API for state: Rejected as unnecessary with Inertia's prop-based architecture

---

### 8. Photo Display Strategy

**Decision**: CSS-based responsive sizing with object-fit: contain

**Rationale**:
- Prevents upscaling beyond original dimensions (maintains quality)
- Responsive down to 320px mobile screens
- Works across all modern browsers
- No JavaScript resize calculations needed

**Implementation Pattern**:
```css
.photo-viewer {
  max-width: 100vw;
  max-height: 80vh;
  object-fit: contain;
  object-position: center;
}
```

**Responsive Breakpoints**:
- Mobile (320px-768px): Full width, reduced height for controls
- Tablet (768px-1024px): Centered with padding
- Desktop (1024px+): Max width 1200px, centered

**Alternatives Considered**:
- Fixed dimensions: Rejected because photos vary in aspect ratio
- JavaScript-based sizing: Rejected as CSS handles this more efficiently
- Progressive image loading: Deferred to future optimization

---

### 9. Logging and Observability

**Decision**: Use Laravel's built-in logging with structured context

**Rationale**:
- Laravel Log facade supports multiple channels (stack, daily, syslog)
- Structured logging with context enables log aggregation
- Essential events only (vote operations, rate limits, errors)
- No performance impact on happy path

**Events to Log**:
```php
// Vote submitted successfully
Log::info('vote_submitted', [
    'photo_id' => $photoSubmission->id,
    'fwb_id' => $fwbId,
    'vote_type' => $voteType,
    'previous_vote' => $existingVote?->vote_type,
    'rate_change' => $adjustment,
]);

// Vote failed
Log::error('vote_failed', [
    'photo_id' => $photoId,
    'fwb_id' => $fwbId,
    'error' => $exception->getMessage(),
]);

// Rate limit hit
Log::warning('rate_limit_exceeded', [
    'ip' => $request->ip(),
    'fwb_id' => $fwbId,
]);
```

**Alternatives Considered**:
- Verbose logging (every page view): Rejected due to storage costs
- No logging: Rejected because debugging production issues requires logs
- Third-party monitoring (Sentry, Bugsnag): Deferred to future enhancement

---

### 10. Empty State Handling

**Decision**: Server-side empty state detection with Inertia conditional rendering

**Rationale**:
- Controller logic determines empty state before rendering
- Inertia passes empty state flag to React
- Consistent with Laravel-first architecture
- No client-side loading flicker

**Implementation Pattern**:
```php
// In PublicGalleryController::index()
$approvedPhotos = PhotoSubmission::approved()->count();

if ($approvedPhotos === 0) {
    return Inertia::render('Gallery', [
        'empty' => true,
        'message' => 'No photos available for voting yet.',
    ]);
}
```

**Empty States**:
1. No approved photos: "No photos available for voting yet."
2. All photos voted: Show first photo with "You've voted on all photos!" message
3. Photo deleted while viewing: Redirect to gallery index with error toast

**Alternatives Considered**:
- Client-side empty detection: Rejected because requires extra data fetching
- Separate empty state page: Rejected as inconsistent with SPA patterns

---

## Technology Stack Summary

### Backend
- **Framework**: Laravel 12 (PHP 8.4)
- **ORM**: Eloquent with explicit relationship types
- **Rendering**: Inertia.js v2 server-side rendering
- **Rate Limiting**: Laravel RateLimiter (throttle middleware)
- **Cookie Management**: Laravel Cookie facade
- **Validation**: Laravel Form Requests
- **Database**: SQLite (dev), MySQL/PostgreSQL (production)
- **Testing**: PHPUnit 11

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: Laravel Wayfinder (type-safe routes)
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **State Management**: Inertia props + local React state
- **Build Tool**: Vite with Laravel Vite Plugin

### Infrastructure
- **Web Server**: Laravel development server (dev), Nginx/Apache (production)
- **Process Manager**: Supervisor for queue workers (if needed)
- **Caching**: File-based cache (dev), Redis (production recommended)

---

## Best Practices Applied

### Laravel Best Practices
1. ✅ Use Eloquent ORM (avoid raw SQL)
2. ✅ Form Request classes for validation
3. ✅ Database transactions for atomic operations
4. ✅ Middleware for cross-cutting concerns (cookie management, rate limiting)
5. ✅ Resource controllers for RESTful actions
6. ✅ Explicit return type declarations
7. ✅ Query scopes for reusable query logic
8. ✅ Factories for testing data
9. ✅ Feature tests for user flows
10. ✅ Route model binding for clean controller methods

### React/TypeScript Best Practices
1. ✅ Functional components with hooks
2. ✅ Explicit prop type definitions
3. ✅ Component composition over inheritance
4. ✅ Accessibility-first with Radix UI
5. ✅ Optimistic UI updates for perceived performance
6. ✅ Error boundaries for graceful degradation
7. ✅ Loading states for async operations
8. ✅ Responsive design with mobile-first approach
9. ✅ Dark mode support
10. ✅ Keyboard navigation support

### Inertia.js Best Practices
1. ✅ `Inertia::render()` for all routes
2. ✅ Preserve scroll on mutations
3. ✅ Use `<Form>` component for forms
4. ✅ Deferred props for heavy data (not needed here)
5. ✅ Share common data via `HandleInertiaRequests` middleware
6. ✅ Type-safe routes via Wayfinder
7. ✅ Progressive enhancement (works without JS for basic navigation)

### Security Best Practices
1. ✅ CSRF protection (automatic with Inertia forms)
2. ✅ Input validation (Form Requests)
3. ✅ SQL injection prevention (Eloquent ORM)
4. ✅ XSS prevention (React escapes by default)
5. ✅ Rate limiting (prevent abuse)
6. ✅ Secure cookies (httpOnly, secure, sameSite)
7. ✅ Database transactions (prevent race conditions)
8. ✅ No sensitive data in cookies (UUID only)

---

## Risk Mitigation

### Performance Risks
- **Risk**: Slow navigation queries with many photos
- **Mitigation**: Database indexes on created_at, eager loading relationships, query optimization

### Security Risks
- **Risk**: Cookie manipulation for duplicate voting
- **Mitigation**: Rate limiting by IP, server-side vote validation, unique database constraint

### Scalability Risks
- **Risk**: High concurrent vote submissions
- **Mitigation**: Database transactions with row-level locking, connection pooling, Redis cache for rate limiting

### UX Risks
- **Risk**: Network failures causing lost votes
- **Mitigation**: Automatic retry with rollback, optimistic UI updates, clear error messages

---

## Open Questions

None. All technical unknowns have been resolved. Ready to proceed to Phase 1 (Design & Contracts).

---

**Phase 0 Status**: ✅ COMPLETE

**Next Phase**: Phase 1 - Design & Contracts (data-model.md, contracts/, quickstart.md)
