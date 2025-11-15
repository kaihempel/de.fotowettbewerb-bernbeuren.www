# Quickstart: Public Photo Voting System

**Feature**: 003-public-voting
**Branch**: `003-public-voting`
**Date**: 2025-11-15

## Overview

This quickstart guide provides step-by-step instructions for implementing the public photo voting system. Follow these steps in order to build the feature incrementally with tests at each stage.

## Prerequisites

- Feature #2 (Photo Management Dashboard) completed
- `PhotoSubmission` model exists with approval workflow
- Laravel 12, PHP 8.4, Inertia.js v2, React 19 installed
- Development environment running (`composer run dev`)

## Implementation Roadmap

### Phase 1: Database Foundation (Day 1)

**Goal**: Create database structure for votes and ratings

#### Step 1.1: Add Rate Column to PhotoSubmissions

```bash
php artisan make:migration add_rate_to_photo_submissions_table --no-interaction
```

**Migration content**:
```php
public function up(): void
{
    Schema::table('photo_submissions', function (Blueprint $table) {
        $table->unsignedInteger('rate')->default(0)->after('reviewer_id');
        $table->index('created_at'); // For navigation queries
    });
}

public function down(): void
{
    Schema::table('photo_submissions', function (Blueprint $table) {
        $table->dropIndex(['created_at']);
        $table->dropColumn('rate');
    });
}
```

#### Step 1.2: Create PhotoVotes Table

```bash
php artisan make:migration create_photo_votes_table --no-interaction
```

**Migration content**:
```php
public function up(): void
{
    Schema::create('photo_votes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('photo_submission_id')
            ->constrained('photo_submissions')
            ->onDelete('cascade');
        $table->string('fwb_id', 36); // UUID v4
        $table->boolean('vote_type'); // true=up, false=down
        $table->timestamps();

        $table->unique(['photo_submission_id', 'fwb_id'], 'unique_vote_per_photo');
        $table->index('fwb_id');
    });
}
```

#### Step 1.3: Run Migrations

```bash
php artisan migrate
```

**Test**: Verify tables created correctly
```bash
php artisan tinker
>>> Schema::hasColumn('photo_submissions', 'rate') // Should return true
>>> Schema::hasTable('photo_votes') // Should return true
```

---

### Phase 2: Models & Business Logic (Day 1-2)

**Goal**: Create PhotoVote model and enhance PhotoSubmission model

#### Step 2.1: Create PhotoVote Model

```bash
php artisan make:model PhotoVote --factory --no-interaction
```

**Model content** (`app/Models/PhotoVote.php`):
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotoVote extends Model
{
    use HasFactory;

    public const VOTE_UP = true;
    public const VOTE_DOWN = false;

    protected $fillable = [
        'photo_submission_id',
        'fwb_id',
        'vote_type',
    ];

    protected function casts(): array
    {
        return [
            'vote_type' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function photoSubmission(): BelongsTo
    {
        return $this->belongsTo(PhotoSubmission::class);
    }
}
```

#### Step 2.2: Enhance PhotoSubmission Model

**Add to** `app/Models/PhotoSubmission.php`:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

// Add to existing class

public function votes(): HasMany
{
    return $this->hasMany(PhotoVote::class);
}

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

public function updateRate(int $adjustment): void
{
    $this->update([
        'rate' => max(0, $this->rate + $adjustment)
    ]);
}

public function getUserVote(string $fwbId): ?PhotoVote
{
    return $this->votes()->where('fwb_id', $fwbId)->first();
}
```

#### Step 2.3: Create PhotoVote Factory

**Edit** `database/factories/PhotoVoteFactory.php`:

```php
<?php

namespace Database\Factories;

use App\Models\PhotoSubmission;
use App\Models\PhotoVote;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PhotoVoteFactory extends Factory
{
    protected $model = PhotoVote::class;

    public function definition(): array
    {
        return [
            'photo_submission_id' => PhotoSubmission::factory(),
            'fwb_id' => Str::uuid()->toString(),
            'vote_type' => $this->faker->boolean(),
        ];
    }

    public function thumbsUp(): static
    {
        return $this->state(fn() => ['vote_type' => true]);
    }

    public function thumbsDown(): static
    {
        return $this->state(fn() => ['vote_type' => false]);
    }

    public function forVisitor(string $fwbId): static
    {
        return $this->state(fn() => ['fwb_id' => $fwbId]);
    }
}
```

#### Step 2.4: Write Unit Tests

```bash
php artisan make:test PhotoSubmissionTest --unit --no-interaction
```

**Test content**:
```php
public function test_get_next_unrated_for_returns_correct_photo(): void
{
    $fwbId = Str::uuid()->toString();
    $photo1 = PhotoSubmission::factory()->approved()->create(['created_at' => now()->subDays(3)]);
    $photo2 = PhotoSubmission::factory()->approved()->create(['created_at' => now()->subDays(2)]);
    $photo3 = PhotoSubmission::factory()->approved()->create(['created_at' => now()->subDays(1)]);

    // Vote on photo2
    PhotoVote::factory()->forVisitor($fwbId)->create(['photo_submission_id' => $photo2->id]);

    $next = $photo1->getNextUnratedFor($fwbId);

    $this->assertEquals($photo3->id, $next->id);
}

// Add more tests for getPreviousRatedFor, updateRate, getUserVote
```

**Run tests**:
```bash
php artisan test tests/Unit/PhotoSubmissionTest.php
```

---

### Phase 3: Middleware & Cookie Handling (Day 2)

**Goal**: Implement cookie-based user identification

#### Step 3.1: Create EnsureFwbId Middleware

```bash
php artisan make:middleware EnsureFwbId --no-interaction
```

**Middleware content** (`app/Http/Middleware/EnsureFwbId.php`):
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureFwbId
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->hasCookie('fwb_id')) {
            $fwbId = Str::uuid()->toString();
            Cookie::queue('fwb_id', $fwbId, 525600, '/', null, null, true, false, 'lax');
        }

        return $next($request);
    }
}
```

#### Step 3.2: Register Middleware

**Edit** `bootstrap/app.php`:

```php
use App\Http\Middleware\EnsureFwbId;

return Application::configure(basePath: dirname(__DIR__))
    // ... existing configuration ...
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            EnsureFwbId::class,
        ]);
    })
    // ... rest of configuration ...
```

#### Step 3.3: Share fwb_id with Inertia

**Edit** `app/Http/Middleware/HandleInertiaRequests.php`:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'fwbId' => $request->cookie('fwb_id'),
    ];
}
```

#### Step 3.4: Test Middleware

```bash
php artisan make:test PublicGalleryTest --no-interaction
```

**Test content**:
```php
public function test_fwb_id_cookie_generated_on_first_request(): void
{
    $response = $this->get('/gallery');

    $response->assertCookieHas('fwb_id');
    $this->assertMatchesRegularExpression(
        '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
        $response->getCookie('fwb_id')->getValue()
    );
}
```

---

### Phase 4: Controller & Routes (Day 3)

**Goal**: Implement voting endpoints

#### Step 4.1: Create VoteRequest

```bash
php artisan make:request VoteRequest --no-interaction
```

**Request content** (`app/Http/Requests/VoteRequest.php`):
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    public function rules(): array
    {
        return [
            'vote_type' => ['required', 'boolean'],
        ];
    }
}
```

#### Step 4.2: Create PublicGalleryController

```bash
php artisan make:controller PublicGalleryController --no-interaction
```

**Controller content** (`app/Http/Controllers/PublicGalleryController.php`):

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\VoteRequest;
use App\Models\PhotoSubmission;
use App\Models\PhotoVote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PublicGalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $fwbId = $request->cookie('fwb_id');

        // Find first unrated photo
        $photo = PhotoSubmission::approved()
            ->whereDoesntHave('votes', fn($q) => $q->where('fwb_id', $fwbId))
            ->orderBy('created_at', 'asc')
            ->first();

        // If all rated, show first photo
        if (!$photo) {
            $photo = PhotoSubmission::approved()
                ->orderBy('created_at', 'asc')
                ->first();
        }

        abort_if(!$photo, 404, 'No photos available for voting yet.');

        return $this->renderPhoto($photo, $fwbId);
    }

    public function show(PhotoSubmission $photoSubmission, Request $request): Response
    {
        abort_if($photoSubmission->approval_status !== 'approved', 404);

        return $this->renderPhoto($photoSubmission, $request->cookie('fwb_id'));
    }

    public function vote(PhotoSubmission $photoSubmission, VoteRequest $request): RedirectResponse
    {
        abort_if($photoSubmission->approval_status !== 'approved', 404);

        $fwbId = $request->cookie('fwb_id');
        $voteType = $request->boolean('vote_type');

        DB::transaction(function () use ($photoSubmission, $fwbId, $voteType) {
            $existingVote = $photoSubmission->votes()
                ->where('fwb_id', $fwbId)
                ->lockForUpdate()
                ->first();

            $adjustment = 0;

            if ($existingVote) {
                if ($existingVote->vote_type !== $voteType) {
                    $adjustment = $voteType ? 2 : -2;
                    $existingVote->update(['vote_type' => $voteType]);
                }
            } else {
                $adjustment = $voteType ? 1 : -1;
                PhotoVote::create([
                    'photo_submission_id' => $photoSubmission->id,
                    'fwb_id' => $fwbId,
                    'vote_type' => $voteType,
                ]);
            }

            if ($adjustment !== 0) {
                $photoSubmission->updateRate($adjustment);
            }
        });

        return redirect()->route('gallery.show', $photoSubmission);
    }

    private function renderPhoto(PhotoSubmission $photo, string $fwbId): Response
    {
        $userVote = $photo->getUserVote($fwbId);

        $totalPhotos = PhotoSubmission::approved()->count();
        $ratedPhotos = PhotoVote::where('fwb_id', $fwbId)
            ->distinct('photo_submission_id')
            ->count();

        return Inertia::render('Gallery', [
            'photo' => [
                'id' => $photo->id,
                'image_url' => asset('storage/' . $photo->image_path),
                'title' => $photo->title,
                'rate' => $photo->rate,
                'user_vote' => $userVote ? ($userVote->vote_type ? 'up' : 'down') : null,
            ],
            'nextPhoto' => $photo->getNextUnratedFor($fwbId)?->only('id'),
            'previousPhoto' => $photo->getPreviousRatedFor($fwbId)?->only('id'),
            'progress' => [
                'rated' => $ratedPhotos,
                'total' => $totalPhotos,
            ],
        ]);
    }
}
```

#### Step 4.3: Add Routes

**Edit** `routes/web.php`:

```php
use App\Http\Controllers\PublicGalleryController;

Route::get('/gallery', [PublicGalleryController::class, 'index'])
    ->name('gallery.index');

Route::get('/gallery/{photoSubmission}', [PublicGalleryController::class, 'show'])
    ->name('gallery.show');

Route::post('/gallery/{photoSubmission}/vote', [PublicGalleryController::class, 'vote'])
    ->middleware(['throttle:votes'])
    ->name('gallery.vote');
```

#### Step 4.4: Configure Rate Limiting

**Edit** `bootstrap/app.php`:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

return Application::configure(basePath: dirname(__DIR__))
    // ... existing configuration ...
    ->withMiddleware(function (Middleware $middleware) {
        RateLimiter::for('votes', function (Request $request) {
            return Limit::perHour(60)->by($request->ip());
        });
    })
    // ... rest of configuration ...
```

#### Step 4.5: Test Controller

**Add to** `tests/Feature/PublicGalleryTest.php`:

```php
public function test_can_vote_on_photo(): void
{
    $photo = PhotoSubmission::factory()->approved()->create();

    $response = $this->post(route('gallery.vote', $photo), [
        'vote_type' => true,
    ]);

    $response->assertRedirect(route('gallery.show', $photo));
    $this->assertDatabaseHas('photo_votes', [
        'photo_submission_id' => $photo->id,
        'vote_type' => true,
    ]);
    $photo->refresh();
    $this->assertEquals(1, $photo->rate);
}
```

**Run tests**:
```bash
php artisan test tests/Feature/PublicGalleryTest.php
```

---

### Phase 5: Frontend Components (Day 4-5)

**Goal**: Build React voting interface

#### Step 5.1: Create Gallery Page

**Create** `resources/js/Pages/Gallery.tsx`:

```typescript
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import PhotoViewer from '@/components/PhotoViewer';
import VotingButtons from '@/components/VotingButtons';
import PhotoNavigation from '@/components/PhotoNavigation';

interface GalleryProps extends PageProps {
  photo: {
    id: number;
    image_url: string;
    title?: string;
    rate: number;
    user_vote?: 'up' | 'down' | null;
  };
  nextPhoto?: { id: number } | null;
  previousPhoto?: { id: number } | null;
  progress: {
    rated: number;
    total: number;
  };
}

export default function Gallery({ photo, nextPhoto, previousPhoto, progress }: GalleryProps) {
  const [currentVote, setCurrentVote] = useState(photo.user_vote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = (voteType: 'up' | 'down') => {
    const previousVote = currentVote;
    setCurrentVote(voteType);
    setIsSubmitting(true);

    router.post(
      `/gallery/${photo.id}/vote`,
      { vote_type: voteType === 'up' },
      {
        preserveScroll: true,
        onError: () => {
          // Retry once
          setTimeout(() => {
            router.post(
              `/gallery/${photo.id}/vote`,
              { vote_type: voteType === 'up' },
              {
                preserveScroll: true,
                onError: () => {
                  setCurrentVote(previousVote);
                  toast.error('Failed to submit vote');
                },
                onFinish: () => setIsSubmitting(false),
              }
            );
          }, 500);
        },
        onFinish: () => setIsSubmitting(false),
      }
    );
  };

  return (
    <>
      <Head title="Photo Voting Gallery" />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <PhotoViewer imageUrl={photo.image_url} title={photo.title} />
        <VotingButtons
          currentVote={currentVote}
          onVote={handleVote}
          isSubmitting={isSubmitting}
        />
        <PhotoNavigation
          previousPhotoId={previousPhoto?.id}
          nextPhotoId={nextPhoto?.id}
        />
        <div className="text-sm text-muted-foreground mt-4">
          {progress.rated} of {progress.total} photos rated
        </div>
      </div>
    </>
  );
}
```

#### Step 5.2-5.4: Create Supporting Components

Follow similar patterns to create:
- `resources/js/components/PhotoViewer.tsx` (image display)
- `resources/js/components/VotingButtons.tsx` (thumbs up/down)
- `resources/js/components/PhotoNavigation.tsx` (prev/next arrows)

Use existing Radix UI components (Button, Card, etc.) from `resources/js/components/ui/`.

---

### Phase 6: Testing & Refinement (Day 6)

**Goal**: Comprehensive testing and polish

#### Step 6.1: Run Full Test Suite

```bash
php artisan test
```

#### Step 6.2: Manual Testing Checklist

- [ ] Cookie generated on first visit
- [ ] Vote buttons work (thumbs up/down)
- [ ] Vote changes update rating correctly
- [ ] Navigation works (next unrated, previous rated)
- [ ] Progress counter updates
- [ ] Completion message shows when all voted
- [ ] Rate limiting works (try 61 votes in hour)
- [ ] Responsive on mobile (320px width)
- [ ] Dark mode works
- [ ] Keyboard navigation (arrow keys)

#### Step 6.3: Code Quality

```bash
vendor/bin/pint --dirty
npm run lint
npm run types
```

---

## Verification Steps

### Database Verification
```bash
php artisan tinker
>>> PhotoSubmission::first()->votes()->count()
>>> PhotoVote::where('fwb_id', 'test-uuid')->get()
```

### Route Verification
```bash
php artisan route:list --path=gallery
```

### Test Coverage
```bash
php artisan test --coverage
```

---

## Common Issues & Solutions

### Issue: Cookie not persisting
**Solution**: Check `config/session.php` - ensure `secure` is false for local dev

### Issue: Rate not updating
**Solution**: Verify database transaction logic, check for exceptions in logs

### Issue: Navigation returns wrong photo
**Solution**: Verify index on `created_at` column exists

### Issue: Rate limiting too aggressive
**Solution**: Adjust `RateLimiter::for('votes')` in `bootstrap/app.php`

---

## Next Steps

After completing this quickstart:

1. Run `/speckit.tasks` to generate detailed task breakdown
2. Implement tasks in order (database → backend → frontend)
3. Test after each task completion
4. Run code formatters before committing
5. Create pull request when feature complete

---

**Status**: Ready for implementation
**Estimated Time**: 6-8 days for full implementation
