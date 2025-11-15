# Photo Review Dashboard - Implementation Quickstart

This guide provides step-by-step instructions to implement the Photo Review Dashboard feature in the Fotowettbewerb Bernbeuren application. Follow each phase sequentially for a complete implementation.

## Prerequisites

Before starting, verify you have:

- **PHP 8.4+** - Check with `php --version`
- **Laravel 12** - Already installed in this project
- **Node.js 18+** - Check with `node --version`
- **Composer** - Check with `composer --version`
- **Development server running** - Use `composer run dev` in a separate terminal

### Verify Existing Setup

Run the following commands to verify prerequisites:

```bash
# Verify migrations have run and database is initialized
php artisan migrate:status

# Verify User model exists
php artisan tinker
>>> User::count()
>>> exit

# Verify queue system is configured
grep -A 5 "QUEUE_CONNECTION" .env
```

## Implementation Phases

### Phase 1: Database Setup

#### Step 1.1: Create PhotoSubmission Migration

```bash
php artisan make:migration create_photo_submissions_table --no-interaction
```

Edit the generated migration file (`database/migrations/YYYY_MM_DD_HHMMSS_create_photo_submissions_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('set null');

            // File information
            $table->string('original_filename');
            $table->string('file_path');
            $table->string('thumbnail_path')->nullable();

            // Review status
            $table->enum('status', ['new', 'approved', 'declined'])->default('new');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('declined_at')->nullable();

            // Review feedback
            $table->text('notes')->nullable();
            $table->text('decline_reason')->nullable();

            $table->timestamps();

            // Indexes for filtering and sorting
            $table->index('user_id');
            $table->index('reviewer_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_submissions');
    }
};
```

#### Step 1.2: Run Migration

```bash
php artisan migrate
```

Verify the table was created:

```bash
php artisan tinker
>>> Schema::hasTable('photo_submissions')
>>> exit
```

#### Step 1.3: Create PhotoSubmission Model

```bash
php artisan make:model PhotoSubmission --no-interaction
```

Edit `app/Models/PhotoSubmission.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotoSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewer_id',
        'original_filename',
        'file_path',
        'thumbnail_path',
        'status',
        'reviewed_at',
        'approved_at',
        'declined_at',
        'notes',
        'decline_reason',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'declined_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function isNew(): bool
    {
        return $this->status === 'new';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isDeclined(): bool
    {
        return $this->status === 'declined';
    }

    public function isReviewed(): bool
    {
        return !$this->isNew();
    }
}
```

#### Step 1.4: Update User Model

Edit `app/Models/User.php` and add relationship:

```php
// Add this method to the User class
public function photoSubmissions(): HasMany
{
    return $this->hasMany(PhotoSubmission::class);
}

public function reviewedPhotos(): HasMany
{
    return $this->hasMany(PhotoSubmission::class, 'reviewer_id');
}

public function isReviewer(): bool
{
    return in_array($this->role, ['reviewer', 'admin']);
}
```

Add the import at the top:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;
```

#### Step 1.5: Create PhotoSubmission Factory

```bash
php artisan make:factory PhotoSubmissionFactory --model=PhotoSubmission --no-interaction
```

Edit `database/factories/PhotoSubmissionFactory.php`:

```php
<?php

namespace Database\Factories;

use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PhotoSubmissionFactory extends Factory
{
    protected $model = PhotoSubmission::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['new', 'approved', 'declined']);

        return [
            'user_id' => User::factory(),
            'reviewer_id' => $status !== 'new' ? User::factory() : null,
            'original_filename' => $this->faker->words(2, true) . '.jpg',
            'file_path' => 'photos/submissions/' . $this->faker->slug() . '.jpg',
            'thumbnail_path' => 'photos/submissions/thumbs/' . $this->faker->slug() . '_thumb.jpg',
            'status' => $status,
            'reviewed_at' => $status !== 'new' ? now()->subHours($this->faker->numberBetween(1, 48)) : null,
            'approved_at' => $status === 'approved' ? now()->subHours($this->faker->numberBetween(1, 48)) : null,
            'declined_at' => $status === 'declined' ? now()->subHours($this->faker->numberBetween(1, 48)) : null,
            'notes' => $status === 'approved' ? $this->faker->sentence() : null,
            'decline_reason' => $status === 'declined' ? $this->faker->paragraph() : null,
        ];
    }

    public function new(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
            'reviewer_id' => null,
            'reviewed_at' => null,
            'approved_at' => null,
            'declined_at' => null,
            'notes' => null,
            'decline_reason' => null,
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'reviewer_id' => User::factory(),
            'reviewed_at' => now()->subHours(12),
            'approved_at' => now()->subHours(12),
            'declined_at' => null,
            'notes' => $this->faker->sentence(),
            'decline_reason' => null,
        ]);
    }

    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'declined',
            'reviewer_id' => User::factory(),
            'reviewed_at' => now()->subHours(24),
            'approved_at' => null,
            'declined_at' => now()->subHours(24),
            'notes' => null,
            'decline_reason' => $this->faker->paragraph(),
        ]);
    }
}
```

#### Step 1.6: Create and Run Seeder

```bash
php artisan make:seeder PhotoSubmissionSeeder --no-interaction
```

Edit `database/seeders/PhotoSubmissionSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\PhotoSubmission;
use Illuminate\Database\Seeder;

class PhotoSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create new submissions (not yet reviewed)
        PhotoSubmission::factory()
            ->new()
            ->count(8)
            ->create();

        // Create approved submissions
        PhotoSubmission::factory()
            ->approved()
            ->count(15)
            ->create();

        // Create declined submissions
        PhotoSubmission::factory()
            ->declined()
            ->count(5)
            ->create();
    }
}
```

Register the seeder in `database/seeders/DatabaseSeeder.php`:

```php
public function run(): void
{
    // ... existing code ...
    $this->call([
        PhotoSubmissionSeeder::class,
    ]);
}
```

#### Step 1.7: Run Seeders

```bash
# Option 1: Fresh migrations with all seeders
php artisan migrate:fresh --seed

# Option 2: Run specific seeder only
php artisan db:seed --class=PhotoSubmissionSeeder
```

### Phase 2: Backend Implementation

#### Step 2.1: Create PhotoSubmissionPolicy

```bash
php artisan make:policy PhotoSubmissionPolicy --no-interaction
```

Edit `app/Policies/PhotoSubmissionPolicy.php`:

```php
<?php

namespace App\Policies;

use App\Models\PhotoSubmission;
use App\Models\User;

class PhotoSubmissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isReviewer();
    }

    public function view(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->isReviewer();
    }

    public function approve(User $user, PhotoSubmission $photoSubmission): bool
    {
        // Can only approve if user is reviewer/admin and photo is not yet reviewed
        return $user->isReviewer() && $photoSubmission->isNew();
    }

    public function decline(User $user, PhotoSubmission $photoSubmission): bool
    {
        // Can only decline if user is reviewer/admin and photo is not yet reviewed
        return $user->isReviewer() && $photoSubmission->isNew();
    }
}
```

#### Step 2.2: Create Events

Create `app/Events/PhotoApproved.php`:

```bash
php artisan make:event PhotoApproved --no-interaction
```

```php
<?php

namespace App\Events;

use App\Models\PhotoSubmission;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PhotoApproved
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public PhotoSubmission $photoSubmission,
    ) {}
}
```

Create `app/Events/PhotoDeclined.php`:

```bash
php artisan make:event PhotoDeclined --no-interaction
```

```php
<?php

namespace App\Events;

use App\Models\PhotoSubmission;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PhotoDeclined
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public PhotoSubmission $photoSubmission,
    ) {}
}
```

#### Step 2.3: Create Listeners

Create `app/Listeners/SendPhotoApprovedNotification.php`:

```bash
php artisan make:listener SendPhotoApprovedNotification --no-interaction
```

```php
<?php

namespace App\Listeners;

use App\Events\PhotoApproved;

class SendPhotoApprovedNotification
{
    public function handle(PhotoApproved $event): void
    {
        // TODO: Implement email notification to user
        // $event->photoSubmission->user->notify(new PhotoApprovedNotification($event->photoSubmission));
    }
}
```

Create `app/Listeners/SendPhotoDeclinedNotification.php`:

```bash
php artisan make:listener SendPhotoDeclinedNotification --no-interaction
```

```php
<?php

namespace App\Listeners;

use App\Events\PhotoDeclined;

class SendPhotoDeclinedNotification
{
    public function handle(PhotoDeclined $event): void
    {
        // TODO: Implement email notification to user with decline reason
        // $event->photoSubmission->user->notify(new PhotoDeclinedNotification($event->photoSubmission));
    }
}
```

#### Step 2.4: Create Queue Job for Thumbnails

```bash
php artisan make:job GeneratePhotoThumbnail --no-interaction
```

Edit `app/Jobs/GeneratePhotoThumbnail.php`:

```php
<?php

namespace App\Jobs;

use App\Models\PhotoSubmission;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class GeneratePhotoThumbnail implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public PhotoSubmission $photoSubmission,
    ) {}

    public function handle(): void
    {
        try {
            $imagePath = Storage::disk('local')->path($this->photoSubmission->file_path);

            // Generate thumbnail (400x300px)
            $thumbnail = Image::read($imagePath)
                ->scaleDown(400, 300)
                ->toWebp(80);

            // Store thumbnail
            $thumbnailPath = str_replace('.jpg', '_thumb.webp', $this->photoSubmission->file_path);
            Storage::disk('local')->put($thumbnailPath, $thumbnail);

            // Update submission with thumbnail path
            $this->photoSubmission->update([
                'thumbnail_path' => $thumbnailPath,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to generate thumbnail', [
                'submission_id' => $this->photoSubmission->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
```

#### Step 2.5: Create PhotoReviewController

```bash
php artisan make:controller PhotoReviewController --no-interaction
```

Edit `app/Http/Controllers/PhotoReviewController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Events\PhotoApproved;
use App\Events\PhotoDeclined;
use App\Models\PhotoSubmission;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PhotoReviewController extends AuthorizesRequests
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', PhotoSubmission::class);

        $status = $request->query('status', 'all');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 15);

        $query = PhotoSubmission::with(['user', 'reviewer'])
            ->orderByDesc('created_at');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $submissions = $query->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('Dashboard/PhotoReview', [
            'submissions' => $submissions,
            'currentStatus' => $status,
        ]);
    }

    public function approve(Request $request, PhotoSubmission $photoSubmission)
    {
        $this->authorize('approve', $photoSubmission);

        if (!$photoSubmission->isNew()) {
            return response()->json([
                'message' => 'This photo submission has already been reviewed',
                'errors' => [
                    'status' => 'Photo is already in approved or declined status',
                ],
            ], 409);
        }

        $photoSubmission->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'approved_at' => now(),
            'reviewer_id' => auth()->id(),
            'notes' => $request->input('notes'),
        ]);

        PhotoApproved::dispatch($photoSubmission);

        return response()->json([
            'data' => $photoSubmission->load(['user', 'reviewer']),
            'message' => 'Photo submission approved successfully',
        ]);
    }

    public function decline(Request $request, PhotoSubmission $photoSubmission)
    {
        $this->authorize('decline', $photoSubmission);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:500'],
        ], [
            'reason.required' => 'The decline reason field is required',
            'reason.min' => 'The reason must be at least 10 characters',
            'reason.max' => 'The reason must not exceed 500 characters',
        ]);

        if (!$photoSubmission->isNew()) {
            return response()->json([
                'message' => 'This photo submission has already been reviewed',
                'errors' => [
                    'status' => 'Photo is already in approved or declined status',
                ],
            ], 409);
        }

        $photoSubmission->update([
            'status' => 'declined',
            'reviewed_at' => now(),
            'declined_at' => now(),
            'reviewer_id' => auth()->id(),
            'decline_reason' => $validated['reason'],
        ]);

        PhotoDeclined::dispatch($photoSubmission);

        return response()->json([
            'data' => $photoSubmission->load(['user', 'reviewer']),
            'message' => 'Photo submission declined successfully',
        ]);
    }
}
```

#### Step 2.6: Register Policy in bootstrap/app.php

Edit `bootstrap/app.php` and add to the withPolicies section:

```php
->withPolicies()
```

Make sure the file contains (or add if missing):

```php
->withPolicies([
    PhotoSubmission::class => PhotoSubmissionPolicy::class,
])
```

Full example of the relevant section:

```php
use App\Models\PhotoSubmission;
use App\Policies\PhotoSubmissionPolicy;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders()
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ... middleware config ...
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ... exception config ...
    })
    ->withPolicies([
        PhotoSubmission::class => PhotoSubmissionPolicy::class,
    ])
    ->create();
```

#### Step 2.7: Add Routes

Edit `routes/web.php` and add the photo review routes:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    // ... existing routes ...

    // Photo Review Dashboard
    Route::get('/dashboard/photos', [PhotoReviewController::class, 'index'])->name('photos.dashboard');
    Route::patch('/photos/{photoSubmission}/approve', [PhotoReviewController::class, 'approve'])->name('photos.approve');
    Route::patch('/photos/{photoSubmission}/decline', [PhotoReviewController::class, 'decline'])->name('photos.decline');
});
```

### Phase 3: Frontend Implementation

#### Step 3.1: Create TypeScript Types

Create `resources/js/types/photo-submission.ts`:

```typescript
export interface PhotoSubmission {
  id: number;
  user: User;
  original_filename: string;
  file_path: string;
  thumbnail_path: string | null;
  status: 'new' | 'approved' | 'declined';
  reviewed_at: string | null;
  approved_at: string | null;
  declined_at: string | null;
  decline_reason: string | null;
  notes: string | null;
  reviewer: User | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'reviewer' | 'admin';
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PhotoSubmissionListResponse {
  data: PhotoSubmission[];
  meta: PaginationMeta;
  links: PaginationLinks;
}
```

#### Step 3.2: Create Custom Hook

Create `resources/js/hooks/use-photo-filters.ts`:

```typescript
import { useState, useCallback } from 'react';

export type PhotoStatus = 'all' | 'new' | 'approved' | 'declined';

interface PhotoFilters {
  status: PhotoStatus;
  page: number;
  perPage: number;
}

export function usePhotoFilters() {
  const [filters, setFilters] = useState<PhotoFilters>({
    status: 'all',
    page: 1,
    perPage: 15,
  });

  const setStatus = useCallback((status: PhotoStatus) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1, // Reset to first page when filter changes
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: 'all',
      page: 1,
      perPage: 15,
    });
  }, []);

  return {
    filters,
    setStatus,
    setPage,
    resetFilters,
  };
}
```

#### Step 3.3: Create React Components

Create `resources/js/components/photo-submission-card.tsx`:

```typescript
import { PhotoSubmission } from '@/types/photo-submission';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface PhotoSubmissionCardProps {
  submission: PhotoSubmission;
  onApproveClick: () => void;
  onDeclineClick: () => void;
}

export function PhotoSubmissionCard({
  submission,
  onApproveClick,
  onDeclineClick,
}: PhotoSubmissionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await router.patch(
        `/photos/${submission.id}/approve`,
        {},
        {
          onSuccess: () => {
            setIsLoading(false);
            onApproveClick();
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to approve photo:', error);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await router.patch(
        `/photos/${submission.id}/decline`,
        { reason: 'Declined by reviewer' },
        {
          onSuccess: () => {
            setIsLoading(false);
            onDeclineClick();
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to decline photo:', error);
    }
  };

  const statusBadgeVariant = {
    new: 'outline',
    approved: 'default',
    declined: 'destructive',
  }[submission.status];

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted relative">
        {submission.thumbnail_path && (
          <img
            src={submission.thumbnail_path}
            alt={submission.original_filename}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold truncate">
              {submission.original_filename}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {submission.user.name}
            </p>
          </div>
          <Badge variant={statusBadgeVariant} className="ml-2">
            {submission.status}
          </Badge>
        </div>

        {submission.status === 'new' && (
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecline}
              disabled={isLoading}
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        )}

        {submission.status === 'approved' && submission.approved_at && (
          <p className="text-xs text-muted-foreground mt-2">
            Approved on {new Date(submission.approved_at).toLocaleDateString()}
            {submission.reviewer && ` by ${submission.reviewer.name}`}
          </p>
        )}

        {submission.status === 'declined' && submission.decline_reason && (
          <p className="text-xs text-muted-foreground mt-2">
            Reason: {submission.decline_reason}
          </p>
        )}
      </div>
    </Card>
  );
}
```

Create `resources/js/components/photo-status-filter.tsx`:

```typescript
import { PhotoStatus } from '@/hooks/use-photo-filters';
import { Button } from '@/components/ui/button';

interface PhotoStatusFilterProps {
  currentStatus: PhotoStatus;
  onStatusChange: (status: PhotoStatus) => void;
}

const statuses: { value: PhotoStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
];

export function PhotoStatusFilter({
  currentStatus,
  onStatusChange,
}: PhotoStatusFilterProps) {
  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={currentStatus === status.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(status.value)}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
}
```

Create `resources/js/components/photo-submission-list.tsx`:

```typescript
import { PhotoSubmission, PhotoSubmissionListResponse } from '@/types/photo-submission';
import { PhotoSubmissionCard } from './photo-submission-card';
import { Pagination } from '@/components/ui/pagination';
import { useState } from 'react';

interface PhotoSubmissionListProps {
  response: PhotoSubmissionListResponse;
  onSubmissionsRefresh: () => void;
}

export function PhotoSubmissionList({
  response,
  onSubmissionsRefresh,
}: PhotoSubmissionListProps) {
  const { data: submissions, meta, links } = response;

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No photo submissions found in this view.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <PhotoSubmissionCard
            key={submission.id}
            submission={submission}
            onApproveClick={onSubmissionsRefresh}
            onDeclineClick={onSubmissionsRefresh}
          />
        ))}
      </div>

      {meta.last_page > 1 && (
        <Pagination
          current={meta.current_page}
          total={meta.last_page}
          onPageChange={(page) => {
            // Handle page change
            onSubmissionsRefresh();
          }}
        />
      )}
    </div>
  );
}
```

#### Step 3.4: Create Dashboard Page

Create `resources/js/Pages/Dashboard/PhotoReview.tsx`:

```typescript
import { Head } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { PhotoStatusFilter } from '@/components/photo-status-filter';
import { PhotoSubmissionList } from '@/components/photo-submission-list';
import { usePhotoFilters } from '@/hooks/use-photo-filters';
import { PhotoSubmissionListResponse } from '@/types/photo-submission';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface PhotoReviewPageProps {
  submissions: PhotoSubmissionListResponse;
  currentStatus: string;
}

export default function PhotoReviewPage({
  submissions: initialSubmissions,
  currentStatus,
}: PhotoReviewPageProps) {
  const { filters, setStatus } = usePhotoFilters();
  const [submissions, setSubmissions] = useState(initialSubmissions);

  const handleStatusChange = (status: 'all' | 'new' | 'approved' | 'declined') => {
    setStatus(status);
    router.get(
      '/dashboard/photos',
      { status },
      {
        preserveState: false,
        onSuccess: (page) => {
          if ('props' in page && 'submissions' in page.props) {
            setSubmissions(page.props.submissions as PhotoSubmissionListResponse);
          }
        },
      }
    );
  };

  const handleRefresh = () => {
    router.get(
      '/dashboard/photos',
      { status: currentStatus },
      {
        preserveState: false,
        onSuccess: (page) => {
          if ('props' in page && 'submissions' in page.props) {
            setSubmissions(page.props.submissions as PhotoSubmissionListResponse);
          }
        },
      }
    );
  };

  return (
    <AppLayout>
      <Head title="Photo Review Dashboard" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Photo Review Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and review contest photo submissions
            </p>
          </div>
        </div>

        <PhotoStatusFilter
          currentStatus={currentStatus as any}
          onStatusChange={handleStatusChange}
        />

        <PhotoSubmissionList
          response={submissions}
          onSubmissionsRefresh={handleRefresh}
        />
      </div>
    </AppLayout>
  );
}
```

#### Step 3.5: Update Navigation

Add link to photo review dashboard in your navigation component. Edit `resources/js/components/app-sidebar.tsx` and add:

```typescript
<SidebarMenuButton asChild>
  <Link href="/dashboard/photos">
    <ImageIcon className="h-4 w-4" />
    <span>Photo Review</span>
  </Link>
</SidebarMenuButton>
```

### Phase 4: Testing & Validation

#### Step 4.1: Create Feature Tests

```bash
php artisan make:test PhotoReviewTest --no-interaction
```

Edit `tests/Feature/PhotoReviewTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use App\Models\User;
use Tests\TestCase;

class PhotoReviewTest extends TestCase
{
    protected User $reviewer;
    protected User $admin;
    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reviewer = User::factory()->create(['role' => 'reviewer']);
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->regularUser = User::factory()->create(['role' => 'user']);
    }

    public function test_reviewer_can_view_dashboard()
    {
        PhotoSubmission::factory()->new()->count(5)->create();

        $response = $this->actingAs($this->reviewer)
            ->get('/dashboard/photos');

        $response->assertOk();
    }

    public function test_regular_user_cannot_view_dashboard()
    {
        $response = $this->actingAs($this->regularUser)
            ->get('/dashboard/photos');

        $response->assertForbidden();
    }

    public function test_can_approve_photo()
    {
        $submission = PhotoSubmission::factory()->new()->create();

        $response = $this->actingAs($this->reviewer)
            ->patch("/photos/{$submission->id}/approve", [
                'notes' => 'Great photo!',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('photo_submissions', [
            'id' => $submission->id,
            'status' => 'approved',
            'reviewer_id' => $this->reviewer->id,
        ]);
    }

    public function test_can_decline_photo()
    {
        $submission = PhotoSubmission::factory()->new()->create();

        $response = $this->actingAs($this->reviewer)
            ->patch("/photos/{$submission->id}/decline", [
                'reason' => 'Image quality is below standards',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('photo_submissions', [
            'id' => $submission->id,
            'status' => 'declined',
            'reviewer_id' => $this->reviewer->id,
        ]);
    }

    public function test_cannot_approve_already_reviewed_photo()
    {
        $submission = PhotoSubmission::factory()->approved()->create();

        $response = $this->actingAs($this->reviewer)
            ->patch("/photos/{$submission->id}/approve");

        $response->assertStatus(409);
    }

    public function test_decline_requires_reason()
    {
        $submission = PhotoSubmission::factory()->new()->create();

        $response = $this->actingAs($this->reviewer)
            ->patch("/photos/{$submission->id}/decline", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('reason');
    }

    public function test_pagination_works()
    {
        PhotoSubmission::factory()->count(30)->create();

        $response = $this->actingAs($this->reviewer)
            ->get('/dashboard/photos?page=2&per_page=15');

        $response->assertOk();
        $response->assertJsonPath('meta.current_page', 2);
    }

    public function test_status_filter_works()
    {
        PhotoSubmission::factory()->new()->count(5)->create();
        PhotoSubmission::factory()->approved()->count(10)->create();

        $response = $this->actingAs($this->reviewer)
            ->get('/dashboard/photos?status=new');

        $response->assertOk();
        $response->assertJsonPath('meta.total', 5);
    }
}
```

#### Step 4.2: Run Tests

```bash
# Run all photo review tests
php artisan test tests/Feature/PhotoReviewTest.php

# Run specific test
php artisan test tests/Feature/PhotoReviewTest.php --filter=test_reviewer_can_view_dashboard

# Run with verbose output
php artisan test tests/Feature/PhotoReviewTest.php --verbose
```

#### Step 4.3: Performance Verification

```bash
# Check for N+1 queries using Laravel Debugbar or add to test:
php artisan tinker
>>> PhotoSubmission::with(['user', 'reviewer'])->paginate();
>>> exit
```

#### Step 4.4: Verify Authorization

```bash
php artisan tinker
>>> $reviewer = User::where('role', 'reviewer')->first();
>>> $user = User::where('role', 'user')->first();
>>> $photo = PhotoSubmission::first();
>>> $reviewer->can('approve', $photo)
>>> $user->can('approve', $photo)
>>> exit
```

## Verification Steps

### 1. Verify Authorization Works

```bash
# In tinker or test:
php artisan tinker
>>> $reviewer = User::factory()->create(['role' => 'reviewer']);
>>> $user = User::factory()->create(['role' => 'user']);
>>> $photo = PhotoSubmission::factory()->new()->create();
>>>
>>> $reviewer->can('approve', $photo); // Should be true
>>> $user->can('approve', $photo);     // Should be false
>>> exit
```

### 2. Test Pagination and Filtering

Access the dashboard and verify:
- View list of submissions with pagination
- Filter by status (new, approved, declined)
- Navigate between pages
- Verify count matches meta.total

### 3. Check Audit Trail

Approved/declined submissions should have:
- `reviewed_at` timestamp
- `approved_at` or `declined_at` timestamp
- `reviewer_id` set to current user
- `notes` or `decline_reason` populated

### 4. Performance Benchmarks

Verify page loads quickly:
- Should handle 100+ submissions without slow queries
- N+1 queries should not be present (using with(['user', 'reviewer']))
- Pagination should be efficient

## Common Issues & Solutions

### Issue: Queue not processing background jobs

**Symptoms**: Thumbnails not generating, jobs stuck in queue

**Solution**:
```bash
# 1. Verify queue driver
grep QUEUE_CONNECTION .env

# 2. Start queue worker in development
php artisan queue:work

# 3. For production, use Supervisor
# Add this to /etc/supervisor/conf.d/fotowettbewerb.conf
[program:fotowettbewerb-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/artisan queue:work --tries=3 --timeout=90
numprocs=1
directory=/path/to/project
user=www-data
autostart=true
autorestart=true
```

### Issue: Authorization failing with 403

**Symptoms**: Users see 403 Forbidden even when they should have access

**Solution**:
```bash
# 1. Verify policy is registered in bootstrap/app.php
grep "PhotoSubmissionPolicy" bootstrap/app.php

# 2. Verify user role is set correctly
php artisan tinker
>>> User::find(1)->update(['role' => 'reviewer']);
>>> exit

# 3. Clear cache
php artisan cache:clear
php artisan config:cache
```

### Issue: N+1 queries detected in logs

**Symptoms**: Slow page loads, many database queries

**Solution**:
```php
// BAD - N+1 queries
$submissions = PhotoSubmission::all();
foreach ($submissions as $submission) {
    echo $submission->user->name; // Extra query for each submission
}

// GOOD - Eager loading
$submissions = PhotoSubmission::with(['user', 'reviewer'])->get();
foreach ($submissions as $submission) {
    echo $submission->user->name; // No extra queries
}
```

### Issue: Thumbnail generation failing

**Symptoms**: `thumbnail_path` is null after upload

**Solution**:
```bash
# 1. Install image processing library
composer require intervention/image

# 2. Verify storage permissions
chmod -R 755 storage/
chmod -R 755 storage/app/

# 3. Check job logs
tail -f storage/logs/laravel.log

# 4. Process queue manually
php artisan queue:work --once
```

## Development Commands Reference

### Artisan Commands

```bash
# Database
php artisan migrate                    # Run migrations
php artisan migrate:fresh --seed       # Fresh migrations with seeders
php artisan db:seed --class=PhotoSubmissionSeeder  # Run specific seeder

# Model/Controller Generation
php artisan make:model PhotoSubmission --no-interaction
php artisan make:controller PhotoReviewController --no-interaction
php artisan make:migration create_photo_submissions_table --no-interaction
php artisan make:policy PhotoSubmissionPolicy --no-interaction
php artisan make:event PhotoApproved --no-interaction
php artisan make:listener SendPhotoApprovedNotification --no-interaction
php artisan make:job GeneratePhotoThumbnail --no-interaction
php artisan make:test PhotoReviewTest --no-interaction

# Code Quality
vendor/bin/pint --dirty                # Format PHP code
php artisan types:publish              # Publish TypeScript types
vendor/bin/phpstan analyse app         # Static analysis

# Testing
php artisan test                       # Run all tests
php artisan test tests/Feature/PhotoReviewTest.php  # Run specific test file
php artisan test --filter=test_reviewer_can_view_dashboard  # Run specific test
php artisan test --parallel            # Run tests in parallel

# Queue & Jobs
php artisan queue:work                 # Start queue worker
php artisan queue:work --once          # Process one job and exit
php artisan queue:failed               # Show failed jobs
php artisan queue:retry all            # Retry all failed jobs
```

### NPM Commands

```bash
# Development
npm run dev                 # Start Vite dev server
npm run build               # Build for production
npm run build:ssr           # Build with SSR support

# Code Quality
npm run lint                # Lint and fix TypeScript/React
npm run format              # Format with Prettier
npm run format:check        # Check formatting without fixing
npm run types               # Run TypeScript type checking
```

### Composer Commands

```bash
# Setup
composer run setup          # Full setup (install, env, key, migrate, npm)
composer run dev            # Start dev server with all services
composer run dev:ssr        # Dev server with SSR enabled

# Testing
composer run test           # Run all tests
composer run test:watch     # Run tests in watch mode
```

### Useful Development Patterns

```bash
# Test while developing (watch mode)
php artisan test --watch

# Check specific authorization
php artisan tinker
>>> auth()->login(User::find(1));
>>> auth()->user()->can('approve', PhotoSubmission::first());

# Simulate queue processing
php artisan queue:work --once

# Clear all caches
php artisan cache:clear && php artisan config:cache && npm run build

# Fresh development environment
php artisan migrate:fresh --seed && npm run dev
```

## Next Steps After Implementation

1. **Add User Notifications** - Implement email notifications when photos are approved/declined
2. **Add Audit Logging** - Track all reviewer actions with timestamps and reasons
3. **Add Photo Gallery** - Create public gallery for approved photos
4. **Add Statistics** - Dashboard showing review statistics (total, approved rate, etc.)
5. **Add Export** - Export review results and statistics to CSV/PDF
6. **Add Bulk Actions** - Approve/decline multiple submissions at once
7. **Add Photo Comparison** - Side-by-side comparison of submissions
8. **Add Comments** - Allow reviewers to add detailed comments on submissions

## Files Summary

All files created during implementation:

- `app/Models/PhotoSubmission.php` - Model with relationships and helpers
- `app/Models/User.php` - Updated with reviewer relationships
- `app/Http/Controllers/PhotoReviewController.php` - Review endpoints
- `app/Policies/PhotoSubmissionPolicy.php` - Authorization logic
- `app/Events/PhotoApproved.php` - Event for approval
- `app/Events/PhotoDeclined.php` - Event for decline
- `app/Listeners/SendPhotoApprovedNotification.php` - Approval notification
- `app/Listeners/SendPhotoDeclinedNotification.php` - Decline notification
- `app/Jobs/GeneratePhotoThumbnail.php` - Thumbnail generation job
- `database/migrations/YYYY_MM_DD_create_photo_submissions_table.php` - Migration
- `database/factories/PhotoSubmissionFactory.php` - Factory for testing
- `database/seeders/PhotoSubmissionSeeder.php` - Seeder for test data
- `resources/js/types/photo-submission.ts` - TypeScript interfaces
- `resources/js/hooks/use-photo-filters.ts` - Filter state management
- `resources/js/components/photo-submission-card.tsx` - Submission card component
- `resources/js/components/photo-status-filter.tsx` - Status filter component
- `resources/js/components/photo-submission-list.tsx` - List component
- `resources/js/Pages/Dashboard/PhotoReview.tsx` - Dashboard page
- `tests/Feature/PhotoReviewTest.php` - Feature tests
- `bootstrap/app.php` - Updated with policy registration
- `routes/web.php` - Added photo review routes

## Support

For questions or issues:

1. Check the Common Issues section above
2. Review the generated OpenAPI specification at `contracts/photo-submission-api.yaml`
3. Check Laravel Telescope for query analysis
4. Review queue logs in `storage/logs/laravel.log`
5. Use `php artisan tinker` for interactive debugging
