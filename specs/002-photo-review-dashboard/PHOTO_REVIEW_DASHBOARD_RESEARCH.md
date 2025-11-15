# Photo Review Dashboard - Best Practices Research
## Laravel 12 + Inertia.js v2 + React 19 Implementation Guide

**Project Context:** Fotowettbewerb Bernbeuren photo contest platform
**Technology Stack:** Laravel 12 (PHP 8.4), Inertia.js v2, React 19, TypeScript, Tailwind CSS v4
**Existing Setup:** `intervention/image-laravel` already installed in `composer.json`

---

## 1. IMAGE THUMBNAIL GENERATION

### Decision: Generate Thumbnails During Upload with Queued Job Processing

**Recommended Approach:**
- Generate original-sized image immediately on upload (already implemented with EXIF orientation)
- Queue thumbnail generation (400-600px width) as background job for non-blocking user experience
- Store original and thumbnail in separate disk paths
- Use Intervention Image (already installed: `intervention/image-laravel`) for image manipulation

### Rationale:
1. **Performance:** Pre-generated thumbnails load faster than on-demand resizing
2. **Scalability:** Queue system prevents blocking upload requests
3. **Consistency:** Thumbnails are generated once with consistent quality
4. **Existing Package:** Your project already has `intervention/image-laravel` v1.x+ installed
5. **User Experience:** Upload completes immediately while thumbnails process in background
6. **Storage:** Thumbnail subdirectories separate originals from previews for easy management

### Alternatives Considered:
- **On-demand thumbnail generation:** Would require image processing on every request, causing latency for first view. Rejected for dashboard use case.
- **Spatie/Image package:** Functional equivalent to Intervention Image but with different API. Stick with Intervention since it's already integrated.
- **GD vs Imagick:** Intervention Image supports both. Use system default (usually GD on most servers); Imagick for production if higher quality needed.

### Implementation Notes:

**Folder Structure (Recommended):**
```
storage/app/private/
├── photo-submissions/
│   ├── new/
│   │   └── {uuid}.jpg          (original)
│   ├── thumbnails/
│   │   └── {uuid}_500w.jpg     (400-600px width thumbnail)
│   └── approved/
│       ├── {uuid}.jpg          (approved originals)
│       └── {uuid}_500w.jpg     (approved thumbnails)
```

**Thumbnail Specifications:**
- **Width:** 500px (standard dashboard thumbnail size)
- **Height:** Auto (maintain aspect ratio)
- **Format:** Same as original (preserve JPEG/PNG/HEIC)
- **Quality:** 80% (balance between file size and visual quality)
- **Storage:** Private disk for security (require authentication to serve)

**Implementation Pattern:**
```php
// 1. In PhotoSubmissionController->store()
// Generate original (already done), then dispatch job
PhotoCreated::dispatch($submission);

// 2. Create App/Jobs/GeneratePhotoThumbnails.php
class GeneratePhotoThumbnails implements ShouldQueue {
    public function handle(PhotoSubmission $submission) {
        $image = Image::read(Storage::disk('local')->path($submission->file_path));
        $thumbnail = $image->scaleDown(width: 500);

        $thumbnailPath = "photo-submissions/thumbnails/{$submission->stored_filename}";
        Storage::disk('local')->put($thumbnailPath, $thumbnail->encode());

        $submission->update(['thumbnail_path' => $thumbnailPath]);
    }
}

// 3. Add to PhotoSubmission model
protected $fillable = [..., 'thumbnail_path'];
```

**Route Serving (Private Downloads):**
- Thumbnails served via `photos.thumbnail` route (requires authentication)
- Use `Storage::download()` to serve with authorization checks
- Cache headers for repeated requests: `Cache-Control: public, max-age=2592000`

---

## 2. ROLE-BASED AUTHORIZATION

### Decision: Use Laravel Policies (Model-Based) + Gates (Simple Checks) + Role Column on Users Table

**Recommended Approach:**
1. Add `role` enum column to users table (`admin`, `reviewer`, `user`)
2. Create `PhotoSubmissionPolicy` for model-specific authorization
3. Use Gates for simple checks (e.g., `can('access-review-dashboard')`)
4. Middleware to restrict routes to specific roles
5. Leverage Inertia `can()` helper in React components for UI visibility

### Rationale:
1. **Policies Better Than Gates:** You're authorizing specific model instances (PhotoSubmission). Policies scale better and follow object-oriented patterns.
2. **Database Roles:** Simple column faster than junction table for 3 roles; no complex permission matrix needed for photo review dashboard.
3. **Mixed Approach:** Gates for dashboard access check, Policies for individual submission actions (review, rate, etc.)
4. **Laravel 12 Native:** No additional package needed; built-in authorization system is sufficient.
5. **Inertia Integration:** React components can check permissions via `$page.props.auth.user.permissions` prop.

### Alternatives Considered:
- **Spatie/Laravel-Permission package:** Overkill for simple 3-role system. Recommended for complex multi-permission hierarchies. Rejected.
- **Gates only:** Possible but difficult to enforce per-model authorization (e.g., "can only review submissions in pending status"). Rejected.
- **Database junction table:** Unnecessary complexity for fixed roles. Rejected.

### Implementation Notes:

**1. Add Role Column to Users Table (Migration):**
```php
// database/migrations/YYYY_MM_DD_add_role_to_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['user', 'reviewer', 'admin'])->default('user')->after('password');
});
```

**2. Update User Model:**
```php
// app/Models/User.php
class User extends Authenticatable {
    protected function casts(): array {
        return [
            // ... existing casts
            'role' => 'string',
        ];
    }

    public function isAdmin(): bool {
        return $this->role === 'admin';
    }

    public function isReviewer(): bool {
        return in_array($this->role, ['reviewer', 'admin']);
    }
}
```

**3. Create PhotoSubmissionPolicy:**
```php
// app/Policies/PhotoSubmissionPolicy.php
class PhotoSubmissionPolicy {
    public function view(User $user, PhotoSubmission $submission): bool {
        // User can view their own, or reviewer/admin can view all
        return $user->id === $submission->user_id || $user->isReviewer();
    }

    public function review(User $user, PhotoSubmission $submission): bool {
        // Only reviewers/admins can review, and submission must be "new"
        return $user->isReviewer() && $submission->status === 'new';
    }

    public function update(User $user, PhotoSubmission $submission): bool {
        // Only admins can update submission status
        return $user->isAdmin();
    }
}
```

**4. Register Policy in AppServiceProvider:**
```php
// app/Providers/AppServiceProvider.php
public function boot(): void {
    Gate::policy(PhotoSubmission::class, PhotoSubmissionPolicy::class);

    // Simple Gate for dashboard access
    Gate::define('access-review-dashboard', function (User $user) {
        return $user->isReviewer();
    });
}
```

**5. Protect Routes:**
```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('can:access-review-dashboard')->group(function () {
        Route::get('/dashboard/review', [ReviewDashboardController::class, 'index'])
            ->name('review.dashboard');
    });
});
```

**6. Use in React Components (via Inertia):**
```typescript
// resources/js/Pages/ReviewDashboard.tsx
export default function ReviewDashboard({ submissions, auth }) {
    // auth.user.role available from HandleInertiaRequests middleware
    const canReview = auth.user?.role === 'reviewer' || auth.user?.role === 'admin';

    return canReview ? (
        <ReviewTable submissions={submissions} />
    ) : (
        <AccessDenied />
    );
}
```

**7. Middleware for Role Checking (Optional):**
```php
// app/Http/Middleware/RequireReviewer.php
class RequireReviewer {
    public function handle(Request $request, Closure $next) {
        if (!auth()->user()?->isReviewer()) {
            abort(403, 'Only reviewers can access this resource.');
        }
        return $next($request);
    }
}

// Register in bootstrap/app.php
$middleware->web(append: [RequireReviewer::class]);
```

---

## 3. PAGINATION WITH FILTERING

### Decision: Use Laravel's `withQueryString()` + URL Query Parameters + Inertia Preserved State

**Recommended Approach:**
1. Preserve query parameters in pagination links with `withQueryString()`
2. Use URL query parameters for filters (`?status=new&sort=submitted`)
3. Use Inertia `preserveState` option to maintain React state during pagination
4. Store filter preferences in React state (not URL) for instant UI feedback
5. Sync React state to URL on filter change for bookmarkable URLs

### Rationale:
1. **Query String Preservation:** Laravel's `withQueryString()` automatically appends all current request params to pagination links.
2. **URL as Source of Truth:** Filter state in URL allows bookmarking, sharing, browser back/forward.
3. **Inertia State Preservation:** `preserveState: true` prevents full page reload, keeping scroll position and form state intact.
4. **React State for UX:** Form inputs stay responsive (instant visual feedback) while URL updates happen via `router.visit()`.
5. **Tested Pattern:** Follows Laravel + Inertia best practices from the framework authors.

### Alternatives Considered:
- **FormHelper with `appends()`:** Only works for specific parameters. Rejected in favor of `withQueryString()` for flexibility.
- **Client-side filtering (React):** Impossible with paginated data from server; defeats purpose of pagination. Rejected.
- **Session-stored filters:** Fragile for multi-tab browsers, breaks bookmarking. Rejected.

### Implementation Notes:

**1. Controller Implementation:**
```php
// app/Http/Controllers/ReviewDashboardController.php
class ReviewDashboardController {
    public function index(Request $request): InertiaResponse {
        $query = PhotoSubmission::with(['user', 'reviewer'])
            ->when($request->string('status'), fn ($q) => $q->byStatus($request->string('status')))
            ->when($request->string('search'), fn ($q) => $q->whereHas('user', fn ($u) =>
                $u->where('name', 'like', "%{$request->string('search')}%")
            ))
            ->orderBy($request->string('sort', 'submitted_at'), 'desc');

        $submissions = $query->paginate(15)
            ->withQueryString();  // ← Preserves ?status=new&search=foo when paginating

        return Inertia::render('ReviewDashboard', [
            'submissions' => $submissions,
            'filters' => [
                'status' => $request->string('status'),
                'search' => $request->string('search'),
                'sort' => $request->string('sort', 'submitted_at'),
            ],
        ]);
    }
}
```

**2. React Component with Filter State:**
```typescript
// resources/js/Pages/ReviewDashboard.tsx
import { useMemo, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

interface FilterState {
    status: string;
    search: string;
    sort: string;
}

export default function ReviewDashboard({ submissions, filters }) {
    const { props } = usePage();
    const [filterState, setFilterState] = useState<FilterState>(filters);

    // Debounced filter submission
    const applyFilters = useMemo(() => {
        const timeout = setTimeout(() => {
            router.get(route('review.dashboard'), filterState, {
                preserveState: true,  // ← Keeps form state, prevents re-render
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [filterState]);

    const handleStatusChange = (status: string) => {
        setFilterState(prev => ({ ...prev, status }));
    };

    return (
        <div>
            <FilterBar
                status={filterState.status}
                onStatusChange={handleStatusChange}
            />

            <SubmissionsTable submissions={submissions.data} />

            {/* Pagination links already include ?status=new&search=foo */}
            <Pagination links={submissions.links} />
        </div>
    );
}
```

**3. Pagination Component (Reusable):**
```typescript
// resources/js/components/pagination.tsx
import { Link } from '@inertiajs/react';

export function Pagination({ links }) {
    return (
        <nav className="flex gap-1">
            {links.map(link => (
                link.url ? (
                    <Link
                        key={link.label}
                        href={link.url}  // Already includes ?status=new&page=2
                        className={`px-3 py-1 rounded ${
                            link.active ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        {link.label}
                    </Link>
                ) : (
                    <span key={link.label} className="px-3 py-1 text-gray-400">
                        {link.label}
                    </span>
                )
            ))}
        </nav>
    );
}
```

**4. URL Query Preservation in Filters:**
```typescript
// resources/js/hooks/useFilters.ts
import { router, usePage } from '@inertiajs/react';
import { useState, useCallback } from 'react';

export function useFilters(initialFilters: Record<string, string>) {
    const [filters, setFilters] = useState(initialFilters);

    const updateFilter = useCallback((key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value || undefined }));

        // Update URL with new filters
        router.get(route('review.dashboard'), {
            ...filters,
            [key]: value,
            page: 1,  // Reset to first page when filtering
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters]);

    return [filters, updateFilter] as const;
}
```

**5. Inertia Configuration (Already in place):**
```typescript
// resources/js/app.tsx
// Inertia automatically preserves form state and scroll position
// when you use preserveState: true in router.visit() or Link preserveState
```

**6. Scopes in Model (Support Filtering):**
```php
// app/Models/PhotoSubmission.php
class PhotoSubmission extends Model {
    public function scopeByStatus(Builder $query, ?string $status): Builder {
        return $status ? $query->where('status', $status) : $query;
    }

    public function scopeSearch(Builder $query, ?string $search): Builder {
        return $search ? $query->whereHas('user', fn ($q) =>
            $q->where('name', 'like', "%{$search}%")
        ) : $query;
    }
}
```

**Key Benefits:**
- Query parameters survive pagination: `?status=new&search=test&page=2`
- Browser back/forward button works correctly
- Bookmarkable filtered states: `https://app.local/review?status=approved`
- No session bloat from storing filters
- React form inputs stay responsive

---

## 4. AUDIT TRAIL IMPLEMENTATION

### Decision: Use Custom Solution with Dedicated `audit_logs` Table + Event-Driven Architecture

**Recommended Approach:**
1. Create custom `AuditLog` model with polymorphic relationship
2. Implement via Laravel Events (already familiar pattern from photo upload)
3. Track only critical review actions: status change, rating, comments
4. Log automatically via Model Events (created/updated) + custom events
5. Store: action type, user, timestamp, before/after values, IP address

### Rationale:
1. **Lightweight:** Custom solution is simpler than Spatie package for this dashboard use case
2. **Event-Driven:** Aligns with Laravel 12's event-driven architecture used in your upload system
3. **Audit Specifically Needed:** Photo review requires tracking approvals/rejections for contest compliance
4. **No Third-Party Dependency:** Reduces vendor lock-in and bundle size
5. **Performance:** Simple table with indexed columns (user_id, auditable_id, action) = fast queries
6. **Compliance:** Meets basic audit requirements without excessive overhead

### Alternatives Considered:
- **Spatie/Laravel-Activitylog:** Adds ~5KB package code for what you need in ~100 lines. Over-engineered.
- **Laravel Auditing (owen-it/laravel-auditing):** Better for detailed change tracking (all attributes). Not needed for review dashboard.
- **No auditing:** Risky for contest platform; need proof of who approved/rejected photos.

### Implementation Notes:

**1. Create Audit Logs Table (Migration):**
```php
// database/migrations/YYYY_MM_DD_create_audit_logs_table.php
Schema::create('audit_logs', function (Blueprint $table) {
    $table->id();
    $table->string('action');  // 'review.approve', 'review.decline', 'review.rate'
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('auditable_type');  // 'App\\Models\\PhotoSubmission'
    $table->unsignedBigInteger('auditable_id');
    $table->json('changes')->nullable();  // { old: { status: 'new' }, new: { status: 'approved' } }
    $table->ipAddress('ip_address')->nullable();
    $table->string('user_agent')->nullable();
    $table->timestamps();

    // Indexes for common queries
    $table->index(['auditable_type', 'auditable_id']);
    $table->index(['user_id', 'created_at']);
    $table->index('action');
});
```

**2. Create AuditLog Model:**
```php
// app/Models/AuditLog.php
class AuditLog extends Model {
    protected $fillable = ['action', 'user_id', 'auditable_type', 'auditable_id', 'changes', 'ip_address', 'user_agent'];

    protected function casts(): array {
        return [
            'changes' => 'array',
            'created_at' => 'datetime',
        ];
    }

    // Polymorphic relationship to any model
    public function auditable() {
        return $this->morphTo();
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeForSubmission(Builder $query, PhotoSubmission $submission): Builder {
        return $query->where([
            'auditable_type' => PhotoSubmission::class,
            'auditable_id' => $submission->id,
        ])->orderBy('created_at', 'desc');
    }
}
```

**3. Add Audit Relationship to PhotoSubmission:**
```php
// app/Models/PhotoSubmission.php
class PhotoSubmission extends Model {
    public function auditLogs() {
        return $this->morphMany(AuditLog::class, 'auditable');
    }
}
```

**4. Create Events for Review Actions:**
```php
// app/Events/PhotoSubmissionReviewed.php
class PhotoSubmissionReviewed {
    public function __construct(
        public PhotoSubmission $submission,
        public User $reviewer,
        public array $changes,
    ) {}
}

// app/Events/PhotoSubmissionRated.php
class PhotoSubmissionRated {
    public function __construct(
        public PhotoSubmission $submission,
        public User $reviewer,
        public float $rating,
    ) {}
}
```

**5. Create Event Listener for Audit Logging:**
```php
// app/Listeners/LogPhotoSubmissionAudit.php
class LogPhotoSubmissionAudit {
    public function handle(PhotoSubmissionReviewed $event) {
        AuditLog::create([
            'action' => 'review.status_change',
            'user_id' => $event->reviewer->id,
            'auditable_type' => PhotoSubmission::class,
            'auditable_id' => $event->submission->id,
            'changes' => $event->changes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
        ]);
    }
}

class LogPhotoRating {
    public function handle(PhotoSubmissionRated $event) {
        AuditLog::create([
            'action' => 'review.rating',
            'user_id' => $event->reviewer->id,
            'auditable_type' => PhotoSubmission::class,
            'auditable_id' => $event->submission->id,
            'changes' => ['rate' => $event->rating],
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
        ]);
    }
}
```

**6. Register Events in EventServiceProvider (or AppServiceProvider):**
```php
// app/Providers/AppServiceProvider.php (or create EventServiceProvider)
public function boot(): void {
    Event::listen(
        PhotoSubmissionReviewed::class,
        LogPhotoSubmissionAudit::class,
    );

    Event::listen(
        PhotoSubmissionRated::class,
        LogPhotoRating::class,
    );
}
```

**7. Use in Review Controller:**
```php
// app/Http/Controllers/ReviewDashboardController.php
public function approve(PhotoSubmission $submission): RedirectResponse {
    $this->authorize('review', $submission);

    $oldStatus = $submission->status;
    $submission->update(['status' => 'approved', 'reviewed_at' => now(), 'reviewed_by' => auth()->id()]);

    // Dispatch event to trigger audit logging
    PhotoSubmissionReviewed::dispatch($submission, auth()->user(), [
        'old' => ['status' => $oldStatus],
        'new' => ['status' => 'approved'],
    ]);

    return redirect()->back()->with('success', 'Photo approved');
}

public function rate(PhotoSubmission $submission, Request $request): RedirectResponse {
    $this->authorize('review', $submission);

    $validated = $request->validate(['rate' => 'required|numeric|min:1|max:10']);
    $submission->update(['rate' => $validated['rate']]);

    PhotoSubmissionRated::dispatch($submission, auth()->user(), $validated['rate']);

    return redirect()->back();
}
```

**8. Display Audit Trail in React Component:**
```typescript
// resources/js/Pages/ReviewDashboard/SubmissionDetail.tsx
export function SubmissionAuditTrail({ submission }) {
    return (
        <div className="space-y-4 mt-6">
            <h3 className="font-bold">Audit Trail</h3>
            {submission.audit_logs.map(log => (
                <div key={log.id} className="text-sm border-l-2 border-gray-200 pl-4">
                    <div className="font-semibold">{log.user.name}</div>
                    <div className="text-gray-600">{log.action}</div>
                    {log.changes && (
                        <div className="text-gray-500 mt-1">
                            {JSON.stringify(log.changes, null, 2)}
                        </div>
                    )}
                    <div className="text-xs text-gray-400">
                        {new Date(log.created_at).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
```

**Key Advantages:**
- **Simple:** ~150 lines of code vs 5KB+ for package
- **Flexible:** Easy to add new action types
- **Fast:** Indexed queries for audit history
- **Compliant:** Proves who approved/rejected photos with timestamps
- **Lightweight:** No extra service providers or config files

---

## 5. N+1 QUERY PREVENTION

### Decision: Use Eager Loading with Automatic Detection in Development + Query Builder Optimization

**Recommended Approach:**
1. Use `with()` for all relationships in list queries (Eager Loading)
2. Use `preventLazyLoading()` in development to catch N+1 issues
3. Use Laravel Debugbar to visualize and verify query counts
4. Implement column selection (select specific columns instead of `*`)
5. Use composite indexes on foreign keys + status columns
6. Consider `when()` method for conditional relationships

### Rationale:
1. **Eager Loading:** Standard Laravel pattern; explicitly load related data upfront
2. **Lazy Load Prevention:** Catches bugs during development; throws exception if you forget `with()`
3. **Debugbar:** Visual confirmation of query count; immediate feedback during feature development
4. **Column Selection:** Reduces data transfer and memory; especially important for images (file_path, file_hash)
5. **Database Indexes:** Your migration already has some (`index(['user_id', 'status'])`); ensure all foreign keys indexed
6. **Already Installed:** Debugbar not in your stack yet, but lightweight to add for dev

### Alternatives Considered:
- **Automatic Eager Loading (Laravel 12.8+):** New feature that auto-loads relationships. Good but not in your current version; manual approach is fine.
- **Query Caching:** Premature optimization; use only after profiling shows cache benefit.
- **Raw SQL Queries:** Defeats the purpose; harder to maintain. Stick with Eloquent.

### Implementation Notes:

**1. Update PhotoSubmissionController Index Method:**
```php
// app/Http/Controllers/PhotoSubmissionController.php
public function index(): InertiaResponse {
    $user = auth()->user();

    // ✓ Good: Explicitly eager load relationships
    $submissions = PhotoSubmission::query()
        ->with([
            'user:id,name,email',  // Select specific columns
            'reviewer:id,name,email',
        ])
        ->forUser($user->id)
        ->recent()
        ->paginate(20);

    return Inertia::render('PhotoUpload', [
        'submissions' => $submissions,
        'remainingSlots' => $user->remaining_submission_slots,
    ]);
}
```

**2. Create ReviewDashboardController with Eager Loading:**
```php
// app/Http/Controllers/ReviewDashboardController.php
class ReviewDashboardController {
    public function index(Request $request): InertiaResponse {
        $this->authorize('access-review-dashboard');

        // ✓ Eager load with specific columns to avoid unnecessary data
        $submissions = PhotoSubmission::query()
            ->with([
                'user:id,name,email',
                'reviewer:id,name,email',  // For who last reviewed it
                'auditLogs' => function ($q) {
                    $q->latest()->limit(5);  // Only last 5 audit entries
                },
            ])
            ->when($request->string('status'), fn ($q) => $q->byStatus($request->string('status')))
            ->when($request->string('search'), fn ($q) =>
                $q->whereHas('user', fn ($u) =>
                    $u->where('name', 'like', "%{$request->string('search')}%")
                )
            )
            ->orderBy($request->string('sort', 'submitted_at'), 'desc')
            ->paginate(15)
            ->withQueryString();

        // ✓ Calculate permissions once, not per-item
        $userCanReview = auth()->user()->isReviewer();

        return Inertia::render('ReviewDashboard', [
            'submissions' => $submissions,
            'userCanReview' => $userCanReview,
            'filters' => [
                'status' => $request->string('status'),
                'search' => $request->string('search'),
            ],
        ]);
    }
}
```

**3. Prevent Lazy Loading in Development (AppServiceProvider):**
```php
// app/Providers/AppServiceProvider.php
public function boot(): void {
    // Throw exception if lazy loading happens in development
    if ($this->app->isLocal()) {
        Model::preventLazyLoading();
    }

    // ... rest of service provider
}
```

**4. Add Proper Database Indexes (Migration):**
```php
// Create if not exists: database/migrations/YYYY_MM_DD_optimize_photo_submissions_indexes.php
Schema::table('photo_submissions', function (Blueprint $table) {
    // Add if missing (your migration already has some)
    $table->index('status');  // For status filtering
    $table->index(['user_id', 'status']);  // For per-user active submissions
    $table->index(['reviewed_by', 'reviewed_at']);  // For reviewer dashboards
    $table->index('submitted_at');  // For sorting by submission date
    $table->index('file_hash');  // For duplicate detection
});
```

**5. Model Scopes for Eager Loading (Best Practice):**
```php
// app/Models/PhotoSubmission.php
class PhotoSubmission extends Model {
    // ✓ Scope that includes eager loading
    public function scopeWithReviewer(Builder $query): Builder {
        return $query->with('reviewer:id,name,email');
    }

    public function scopeWithUserAndReviewer(Builder $query): Builder {
        return $query->with([
            'user:id,name,email',
            'reviewer:id,name,email',
        ]);
    }
}

// Then in controller:
// ✓ Cleaner, more reusable
$submissions = PhotoSubmission::withUserAndReviewer()
    ->paginate(20);
```

**6. Install and Use Laravel Debugbar (For Development):**
```bash
# Add to composer.json dev dependencies
composer require --dev barryvdh/laravel-debugbar

# Run migrations (Debugbar uses DB storage)
php artisan migrate
```

```php
// resources/js/app.tsx - Add in development only
if (import.meta.env.DEV) {
    import('https://cdn.jsdelivr.net/npm/laravel-debugbar');
}
```

**Debugbar Usage:**
- View at bottom of page in development
- "Queries" tab shows count, time, and query details
- Red warning if N+1 pattern detected
- Click query to see stack trace

**7. Query Optimization Checklist:**
```php
// ❌ Bad: N+1 Query Problem
$submissions = PhotoSubmission::all();  // 1 query
foreach ($submissions as $submission) {
    echo $submission->user->name;  // N queries
}

// ✓ Good: Eager Loading
$submissions = PhotoSubmission::with('user')->get();  // 2 queries (1 for submissions, 1 for users)

// ✓ Better: Column Selection
$submissions = PhotoSubmission::with('user:id,name')->get();  // Smaller result set

// ✓ Best: Selective Relationship Loading
$submissions = PhotoSubmission::query()
    ->with('user:id,name')
    ->with('reviewer:id,name')
    ->when(auth()->user()->isReviewer(), fn ($q) =>
        $q->with('auditLogs')  // Only load if reviewer
    )
    ->get();
```

**8. Performance Testing in Tests:**
```php
// tests/Feature/ReviewDashboardTest.php
use Illuminate\Support\Facades\DB;

public function test_review_dashboard_avoids_n_plus_one_queries(): void {
    $user = User::factory()->create(['role' => 'reviewer']);
    PhotoSubmission::factory()->count(20)->create();

    DB::flushQueryLog();
    DB::enableQueryLog();

    $this->actingAs($user)->get(route('review.dashboard'));

    // Should be ~3 queries: submissions, users, reviewers
    $this->assertLessThan(5, count(DB::getQueryLog()));
}
```

**Key Query Counts (Target):**
- Dashboard list (20 items): 2-3 queries (submissions + users + optional reviewers)
- Submission detail: 1-2 queries (submission + relationships)
- Save submission: 2-3 queries (update + audit log + fire event)

---

## INERTIA.JS V2 + REACT 19 INTEGRATION

### Frontend Patterns for Review Dashboard

**1. Type-Safe Props (TypeScript):**
```typescript
// resources/js/types/index.ts
export interface PhotoSubmission {
    id: number;
    fwb_id: string;
    user_id: number;
    user: { id: number; name: string; email: string };
    status: 'new' | 'approved' | 'declined';
    rate: number | null;
    submitted_at: string;
    reviewed_at: string | null;
    reviewed_by: number | null;
    reviewer?: { id: number; name: string } | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
```

**2. Inertia Link with Preserved State:**
```typescript
// Preserve query parameters and form state during navigation
<Link
    href={route('photos.show', submission.id)}
    preserveState={true}
    preserveScroll={true}
>
    View Details
</Link>
```

**3. Form Submission with Validation:**
```typescript
import { useForm } from '@inertiajs/react';

export function ReviewForm({ submission }) {
    const { data, setData, post, errors, processing } = useForm({
        status: submission.status,
        rate: submission.rate || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('submissions.review', submission.id));
    };

    return (
        <form onSubmit={handleSubmit}>
            <select
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
            >
                <option value="new">New</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
            </select>
            {errors.status && <span className="text-red-500">{errors.status}</span>}

            <button disabled={processing} type="submit">
                {processing ? 'Saving...' : 'Save Review'}
            </button>
        </form>
    );
}
```

---

## IMPLEMENTATION TIMELINE & DEPENDENCIES

### Phase 1: Authorization & Basic Dashboard (Week 1)
1. Add `role` column to users table
2. Create `PhotoSubmissionPolicy` and register
3. Create basic `ReviewDashboard` page with authorization
4. Create `ReviewDashboardController` with eager loading

### Phase 2: Thumbnails & Storage (Week 2)
1. Create `GeneratePhotoThumbnails` job
2. Update `PhotoSubmissionController::store()` to dispatch job
3. Add thumbnail route and serving logic
4. Create database migration for `thumbnail_path` column

### Phase 3: Pagination & Filtering (Week 2-3)
1. Update `ReviewDashboardController` with filtering
2. Create filter components in React
3. Add `withQueryString()` to pagination
4. Test filter persistence across pagination

### Phase 4: Audit Logging (Week 3)
1. Create `AuditLog` model and migration
2. Create Events and Listeners
3. Update review actions to dispatch events
4. Create audit trail display component

### Phase 5: Testing & Optimization (Week 4)
1. Add N+1 query tests
2. Install and verify Debugbar
3. Performance testing under load
4. Write comprehensive feature tests

---

## DATABASE MIGRATION CHECKLIST

```bash
# Run before implementation starts
php artisan migrate --fresh --seed

# Migrations to create:
1. Add 'role' to users table
2. Create 'audit_logs' table
3. Add 'thumbnail_path' to photo_submissions table
4. Add review-related indexes to photo_submissions table

# Verify indexes:
php artisan tinker
>>> Schema::getConnection()->getSchemaBuilder()->getIndexes('photo_submissions')
```

---

## TESTING REQUIREMENTS (PHPUnit)

**Test Classes to Create:**
1. `ReviewDashboardControllerTest` - Authorization, filtering, pagination
2. `PhotoReviewActionTest` - Approve, decline, rate actions
3. `AuditLogTest` - Audit trail creation and display
4. `N+1QueryDetectionTest` - Verify query counts

**Test Patterns:**
```php
// Authorization tests
public function test_only_reviewers_can_access_dashboard() { }
public function test_admin_can_see_all_submissions() { }

// Filtering tests
public function test_status_filter_works() { }
public function test_search_filter_works() { }
public function test_filters_preserved_in_pagination() { }

// Action tests
public function test_reviewer_can_approve_submission() { }
public function test_approval_creates_audit_log() { }

// N+1 tests
public function test_dashboard_query_count_below_5() { }
```

---

## SECURITY CONSIDERATIONS

1. **File Serving:** Always check authorization before serving thumbnails/originals
2. **Role Spoofing:** Verify role in policy, not just in frontend
3. **Audit Trail:** Log all sensitive actions; include IP and user agent
4. **Query Safety:** Use `where()` binding instead of string interpolation
5. **MIME Type:** Validate server-side (already done in upload)
6. **Pagination:** Verify user can access page (Eloquent pagination handles this)

---

## PERFORMANCE TARGETS

- **Dashboard Load:** < 200ms (with 15 items)
- **Query Count:** 2-4 queries (submissions + users + reviewers)
- **Page Size:** 15-20 submissions per page
- **Thumbnail Size:** 50-100KB per image
- **Audit Log Search:** < 100ms for 1000s of entries

---

## REFERENCES & DOCUMENTATION LINKS

- **Intervention Image:** https://image.intervention.io/ (already in composer.json)
- **Laravel Policies:** https://laravel.com/docs/12.x/authorization (built-in)
- **Eager Loading:** https://laravel.com/docs/12.x/eloquent-relationships#eager-loading
- **Pagination:** https://laravel.com/docs/12.x/pagination
- **Inertia.js v2:** https://inertiajs.com/
- **Laravel Events:** https://laravel.com/docs/12.x/events
- **Query Optimization:** https://laravel.com/docs/12.x/queries

---

## SUMMARY TABLE

| Aspect | Decision | Tool | Complexity | Testing |
|--------|----------|------|-----------|---------|
| **Thumbnails** | Queue + Intervention | Job Queue | Medium | Unit test job |
| **Authorization** | Policy + Role Column | Gates/Policies | Low | Authorization tests |
| **Pagination** | `withQueryString()` + React State | Laravel + Inertia | Low | Filter tests |
| **Audit Trail** | Custom Events + Table | Event Listeners | Medium | Event tests |
| **N+1 Prevention** | Eager Loading + Debugbar | `with()` method | Low | Query count tests |

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Prepared For:** Photo Review Dashboard Implementation
**Target Audience:** Development Team
