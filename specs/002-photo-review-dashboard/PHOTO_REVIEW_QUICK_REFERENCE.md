# Photo Review Dashboard - Quick Reference Guide

**Location of Full Documentation:** `/PHOTO_REVIEW_DASHBOARD_RESEARCH.md`

---

## DECISION MATRIX

### 1. Image Thumbnails
- **Decision:** Generate during upload with queued background job
- **Library:** Intervention Image (already installed)
- **Folder:** `storage/app/private/photo-submissions/thumbnails/`
- **Size:** 500px width, 80% quality
- **When:** On upload completion + fire event
- **Queue Job:** `App\Jobs\GeneratePhotoThumbnails`

### 2. Role-Based Authorization
- **Decision:** Policy + Roles Column + Gates
- **Roles:** `user`, `reviewer`, `admin` (enum on users table)
- **Policy:** `App\Policies\PhotoSubmissionPolicy`
- **Methods:** `view()`, `review()`, `update()`
- **Gate:** `access-review-dashboard`
- **Middleware:** `RequireReviewer` (optional)

### 3. Pagination with Filtering
- **Decision:** `withQueryString()` + URL params + Inertia state preservation
- **Method:** `->withQueryString()` on paginate()
- **React Hook:** `useFilters()` (custom hook)
- **Option:** `preserveState: true` in router.visit()
- **Filters:** Status, Search, Sort (query string)
- **Per Page:** 15 items

### 4. Audit Trail
- **Decision:** Custom solution with Events + Dedicated table
- **Model:** `App\Models\AuditLog`
- **Table:** `audit_logs` (polymorphic)
- **Events:** `PhotoSubmissionReviewed`, `PhotoSubmissionRated`
- **Listener:** `LogPhotoSubmissionAudit`
- **Track:** Action, User, Changes, Timestamp, IP

### 5. N+1 Query Prevention
- **Decision:** Eager loading with column selection + lazy load prevention
- **Method:** `with(['user:id,name', 'reviewer:id,name'])`
- **Development:** `Model::preventLazyLoading()`
- **Detection:** Laravel Debugbar in dev
- **Target:** 2-4 queries per request
- **Indexes:** Foreign keys, status, submitted_at

---

## CODE SNIPPETS - COPY & PASTE

### Migration: Add Role to Users
```php
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['user', 'reviewer', 'admin'])
        ->default('user')
        ->after('password');
});
```

### User Model: Role Methods
```php
public function isReviewer(): bool {
    return in_array($this->role, ['reviewer', 'admin']);
}

public function isAdmin(): bool {
    return $this->role === 'admin';
}
```

### PhotoSubmissionPolicy: Create File
```php
<?php
namespace App\Policies;

use App\Models\PhotoSubmission;
use App\Models\User;

class PhotoSubmissionPolicy {
    public function view(User $user, PhotoSubmission $submission): bool {
        return $user->id === $submission->user_id || $user->isReviewer();
    }

    public function review(User $user, PhotoSubmission $submission): bool {
        return $user->isReviewer() && $submission->status === 'new';
    }

    public function update(User $user, PhotoSubmission $submission): bool {
        return $user->isAdmin();
    }
}
```

### AppServiceProvider: Register Policy
```php
public function boot(): void {
    Gate::policy(PhotoSubmission::class, PhotoSubmissionPolicy::class);

    Gate::define('access-review-dashboard', function (User $user) {
        return $user->isReviewer();
    });

    if ($this->app->isLocal()) {
        Model::preventLazyLoading();
    }
}
```

### Controller: Eager Loading + Pagination
```php
$submissions = PhotoSubmission::query()
    ->with([
        'user:id,name,email',
        'reviewer:id,name,email',
    ])
    ->when($request->string('status'), fn ($q) => $q->byStatus($request->string('status')))
    ->orderBy($request->string('sort', 'submitted_at'), 'desc')
    ->paginate(15)
    ->withQueryString();
```

### React: useFilters Hook
```typescript
function useFilters(initialFilters) {
    const [filters, setFilters] = useState(initialFilters);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        router.get(route('review.dashboard'),
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true }
        );
    };

    return [filters, updateFilter];
}
```

### AuditLog Model
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model {
    protected $fillable = ['action', 'user_id', 'auditable_type', 'auditable_id', 'changes', 'ip_address', 'user_agent'];

    protected function casts(): array {
        return ['changes' => 'array'];
    }

    public function auditable() {
        return $this->morphTo();
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
```

### Event: PhotoSubmissionReviewed
```php
<?php
namespace App\Events;

use App\Models\PhotoSubmission;
use App\Models\User;

class PhotoSubmissionReviewed {
    public function __construct(
        public PhotoSubmission $submission,
        public User $reviewer,
        public array $changes,
    ) {}
}
```

### Listener: Log Audit
```php
<?php
namespace App\Listeners;

use App\Events\PhotoSubmissionReviewed;
use App\Models\AuditLog;
use App\Models\PhotoSubmission;

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
```

---

## MIGRATION CHECKLIST

```bash
# 1. Create role column
php artisan make:migration add_role_to_users_table

# 2. Create audit logs table
php artisan make:migration create_audit_logs_table

# 3. Create policy
php artisan make:policy PhotoSubmissionPolicy --model=PhotoSubmission

# 4. Create events
php artisan make:event PhotoSubmissionReviewed
php artisan make:event PhotoSubmissionRated

# 5. Create listeners
php artisan make:listener LogPhotoSubmissionAudit
php artisan make:listener LogPhotoRating

# 6. Create job for thumbnails
php artisan make:job GeneratePhotoThumbnails

# 7. Create controller (optional)
php artisan make:controller ReviewDashboardController

# 8. Run migrations
php artisan migrate
```

---

## TESTING COMMANDS

```bash
# Test a specific feature
php artisan test tests/Feature/ReviewDashboardControllerTest.php

# Test with query logging
php artisan test --filter=testDashboardAvoidsNPlusOne

# Run all tests
composer run test

# Check N+1 queries manually
php artisan tinker
> DB::enableQueryLog();
> $submissions = PhotoSubmission::with('user')->paginate(15);
> DB::getQueryLog()
```

---

## COMMON GOTCHAS

### Gotcha 1: Forgot `with()`
```php
// ❌ Wrong: Will cause N+1 if you access $submission->user in loop
$submissions = PhotoSubmission::paginate(15);

// ✓ Right: Load relationship upfront
$submissions = PhotoSubmission::with('user')->paginate(15);
```

### Gotcha 2: Policy Not Registered
```php
// ❌ Wrong: Policy methods not available
// (forgot to register in AppServiceProvider)

// ✓ Right: In AppServiceProvider->boot()
Gate::policy(PhotoSubmission::class, PhotoSubmissionPolicy::class);
```

### Gotcha 3: Filter State Lost on Pagination
```typescript
// ❌ Wrong: Pagination links don't include filter params
<Pagination links={submissions.links} />

// ✓ Right: Use withQueryString() in controller
.paginate(15)->withQueryString()
// Now links include ?status=new&page=2
```

### Gotcha 4: Lazy Loading Not Caught in Tests
```php
// ❌ Wrong: Tests don't enable lazy load prevention by default
public function test_something() { }

// ✓ Right: Enable in test setup (or in test config)
protected function setUp(): void {
    parent::setUp();
    Model::preventLazyLoading();
}
```

### Gotcha 5: Audit Log Not Triggered
```php
// ❌ Wrong: Event not dispatched
$submission->update(['status' => 'approved']);

// ✓ Right: Dispatch event after update
$submission->update(['status' => 'approved']);
PhotoSubmissionReviewed::dispatch($submission, auth()->user(), [...]);
```

---

## FILE STRUCTURE AFTER IMPLEMENTATION

```
app/
├── Events/
│   ├── PhotoSubmissionReviewed.php
│   └── PhotoSubmissionRated.php
├── Listeners/
│   ├── LogPhotoSubmissionAudit.php
│   └── LogPhotoRating.php
├── Policies/
│   └── PhotoSubmissionPolicy.php
├── Jobs/
│   └── GeneratePhotoThumbnails.php
├── Http/
│   └── Controllers/
│       └── ReviewDashboardController.php
├── Models/
│   ├── AuditLog.php
│   └── PhotoSubmission.php (updated)
└── Providers/
    └── AppServiceProvider.php (updated)

resources/js/
├── Pages/
│   └── ReviewDashboard.tsx
├── components/
│   ├── ReviewTable.tsx
│   ├── FilterBar.tsx
│   ├── Pagination.tsx
│   └── AuditTrail.tsx
├── hooks/
│   └── useFilters.ts
└── types/
    └── index.ts

database/
├── migrations/
│   ├── 2025_XX_XX_add_role_to_users_table.php
│   └── 2025_XX_XX_create_audit_logs_table.php
└── factories/
    └── PhotoSubmissionFactory.php (already exists)

tests/Feature/
├── ReviewDashboardControllerTest.php
├── PhotoReviewActionTest.php
└── AuditLogTest.php
```

---

## DEPLOYMENT CHECKLIST

- [ ] Run migrations: `php artisan migrate`
- [ ] Clear config cache: `php artisan config:clear`
- [ ] Set up queue worker: `php artisan queue:work`
- [ ] Create symlink for storage: `php artisan storage:link`
- [ ] Run tests: `composer run test`
- [ ] Check N+1 queries with Debugbar locally
- [ ] Verify audit logs being created
- [ ] Test pagination with filters
- [ ] Confirm thumbnails generating in queue
- [ ] Update documentation with new endpoints

---

## PERFORMANCE TARGETS

| Metric | Target | How to Verify |
|--------|--------|--------------|
| Dashboard Load | < 200ms | Debugbar "Timeline" tab |
| Query Count | 2-4 queries | Debugbar "Queries" tab |
| Thumbnail Generation | < 5s (async) | Check queue worker logs |
| Pagination Links | All include filters | Check HTML source of pagination |
| Audit Log Retrieval | < 100ms (100 items) | Tinker test query |

---

## USEFUL COMMANDS

```bash
# Monitor queue processing
php artisan queue:listen

# Check migrations status
php artisan migrate:status

# Test policy directly
php artisan tinker
> $user = User::find(1);
> $submission = PhotoSubmission::find(1);
> Auth::login($user);
> Auth::user()->can('review', $submission)

# Clear all caches
php artisan cache:clear && php artisan config:clear

# Reset database (development only)
php artisan migrate:fresh --seed

# Check storage space for thumbnails
df -h storage/app/private
```

---

## SUPPORT & DEBUGGING

### "N+1 Query Error in Development"
```php
// Turn off lazy load prevention temporarily
Model::preventLazyLoading(false);
```

### "Audit Log Not Recording"
```bash
# Check if event listener is registered
php artisan tinker
> Event::listen(PhotoSubmissionReviewed::class, [...])
> Event::getListeners()
```

### "Thumbnails Not Generating"
```bash
# Check queue is running
ps aux | grep queue

# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

### "Policy Authorization Failing"
```php
// Debug: Check if policy is registered
php artisan tinker
> $user = User::find(1);
> Gate::getPolicies()
```

---

**For detailed implementation guides, see `/PHOTO_REVIEW_DASHBOARD_RESEARCH.md`**
