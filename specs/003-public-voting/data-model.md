# Data Model: Public Photo Voting System

**Feature**: 003-public-voting
**Date**: 2025-11-15
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data model for the public photo voting system, including entity relationships, validation rules, and state transitions.

## Entity Relationship Diagram

```
┌─────────────────────────┐
│   PhotoSubmission       │
│  (existing, enhanced)   │
├─────────────────────────┤
│ id: bigint (PK)         │
│ user_id: bigint (FK)    │
│ image_path: string      │
│ title: string?          │
│ approval_status: enum   │
│ reviewed_at: timestamp? │
│ reviewer_id: bigint?    │
│ rate: unsigned int      │◄──┐
│ created_at: timestamp   │   │
│ updated_at: timestamp   │   │
└─────────────────────────┘   │
                              │ 1:N
                              │
┌─────────────────────────┐   │
│      PhotoVote          │   │
│        (new)            │   │
├─────────────────────────┤   │
│ id: bigint (PK)         │   │
│ photo_submission_id ────┼───┘
│ fwb_id: string(36)      │
│ vote_type: boolean      │
│ created_at: timestamp   │
│ updated_at: timestamp   │
└─────────────────────────┘
     │
     │ Unique constraint:
     │ (photo_submission_id, fwb_id)
     │
     │ Indexes:
     │ - fwb_id
     │ - photo_submission_id (part of FK)
```

## Entities

### PhotoSubmission (Enhanced)

**Purpose**: Represents a photo submitted to the contest. Enhanced with cumulative rating from public votes.

**Table**: `photo_submissions`

**Columns**:
- `id` (bigint, unsigned, auto-increment, PK): Unique identifier
- `user_id` (bigint, unsigned, FK → users.id): Submitter (existing)
- `image_path` (varchar(255)): Storage path to photo file (existing)
- `title` (varchar(255), nullable): Optional photo title (existing)
- `approval_status` (enum: 'pending', 'approved', 'rejected'): Review status (existing)
- `reviewed_at` (timestamp, nullable): When review completed (existing)
- `reviewer_id` (bigint, unsigned, nullable, FK → users.id): Admin who reviewed (existing)
- **`rate` (unsigned int, default 0, NEW)**: Cumulative rating (sum of all votes, minimum 0)
- `created_at` (timestamp): Submission time (existing)
- `updated_at` (timestamp): Last modification (existing)

**Indexes** (existing + new):
- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- INDEX (`approval_status`)
- **INDEX (`created_at`) - NEW**: For chronological navigation queries

**Validation Rules**:
- `rate` must be ≥ 0 (database constraint + application logic)
- `approval_status` must be approved for photo to appear in public gallery
- All existing validation rules from feature #2 still apply

**Relationships**:
- `belongsTo(User::class, 'user_id')` - Submitter (existing)
- `belongsTo(User::class, 'reviewer_id')` - Reviewer (existing)
- **`hasMany(PhotoVote::class)` - Votes (NEW)**

**Scopes**:
- `approved()`: WHERE approval_status = 'approved' (existing, reused)

**Methods (NEW)**:
```php
public function getNextUnratedFor(string $fwbId): ?PhotoSubmission
public function getPreviousRatedFor(string $fwbId): ?PhotoSubmission
public function updateRate(int $adjustment): void
public function getUserVote(string $fwbId): ?PhotoVote
```

**State Transitions**:
- Rate increases when thumbs up vote cast (+1)
- Rate decreases when thumbs down vote cast (-1, minimum 0)
- Rate adjusts when vote changed (±2)
- Rate resets to 0 if photo unapproved (via cascade delete of votes)

---

### PhotoVote (New)

**Purpose**: Represents a single vote cast by an anonymous visitor on a photo.

**Table**: `photo_votes`

**Columns**:
- `id` (bigint, unsigned, auto-increment, PK): Unique identifier
- `photo_submission_id` (bigint, unsigned, FK → photo_submissions.id): Photo being voted on
- `fwb_id` (varchar(36), NOT NULL): Anonymous visitor identifier (UUID from cookie)
- `vote_type` (boolean, NOT NULL): true = thumbs up (+1), false = thumbs down (-1)
- `created_at` (timestamp): When vote first cast
- `updated_at` (timestamp): When vote last changed

**Indexes**:
- PRIMARY KEY (`id`)
- UNIQUE KEY `unique_vote_per_photo` (`photo_submission_id`, `fwb_id`): Enforces one vote per photo per visitor
- INDEX (`fwb_id`): For "find all votes by visitor" queries (progress tracking)

**Foreign Keys**:
- `photo_submission_id` REFERENCES `photo_submissions(id)` ON DELETE CASCADE
  - Automatically deletes votes when photo deleted/unapproved

**Validation Rules**:
- `photo_submission_id` must reference an existing approved photo
- `fwb_id` must be valid UUID v4 format (validated via middleware)
- `vote_type` must be boolean (true/false)
- Unique constraint prevents duplicate votes per photo per visitor

**Relationships**:
- `belongsTo(PhotoSubmission::class, 'photo_submission_id')`

**Casts**:
```php
protected function casts(): array
{
    return [
        'vote_type' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
```

**Constants**:
```php
public const VOTE_UP = true;
public const VOTE_DOWN = false;
```

**State Transitions**:
- Created: Visitor casts first vote on a photo
- Updated: Visitor changes vote on same photo (vote_type toggled, updated_at changed)
- Deleted: Photo is deleted or unapproved (cascade delete)

---

### Visitor Identity (Cookie)

**Purpose**: Represents an anonymous visitor's identity for vote tracking across sessions.

**Storage**: Browser cookie (not database table)

**Cookie Properties**:
- **Name**: `fwb_id`
- **Value**: UUID v4 string (36 characters with hyphens, e.g., `550e8400-e29b-41d4-a716-446655440000`)
- **Expiration**: 1 year (525,600 minutes)
- **Flags**:
  - `httpOnly: true` - Not accessible via JavaScript (XSS protection)
  - `secure: true` - HTTPS only (production)
  - `sameSite: 'lax'` - CSRF protection while allowing normal navigation
  - `encrypted: true` - Laravel encrypts cookie value automatically

**Generation**:
- Created by `EnsureFwbId` middleware on first request
- Persisted across browser sessions until expiration or manual deletion
- Not stored in database (ephemeral, regenerated on expiration)

**Validation**:
- Format: UUID v4 (validated server-side)
- Cannot be empty or null
- Automatically regenerated if invalid or missing

**Privacy**:
- No personally identifiable information (PII)
- Random UUID prevents tracking across domains
- Expires after 1 year (contest duration)

---

## Vote Rate Calculation

### Algorithm

```
Initial state: photo.rate = 0, no votes exist

Action: New thumbs up vote
  → Create PhotoVote(vote_type=true)
  → photo.rate += 1

Action: New thumbs down vote
  → Create PhotoVote(vote_type=false)
  → photo.rate -= 1 (minimum 0)

Action: Change vote from up to down
  → Update PhotoVote(vote_type=false)
  → photo.rate -= 2 (remove +1, add -1)

Action: Change vote from down to up
  → Update PhotoVote(vote_type=true)
  → photo.rate += 2 (remove -1, add +1)

Action: Vote same type again (no-op)
  → No changes

Action: Photo deleted/unapproved
  → Cascade delete all PhotoVotes
  → photo.rate reset to 0 (if photo restored)
```

### Atomic Transaction

All vote operations wrapped in database transaction:

```php
DB::transaction(function () {
    // 1. Lock photo row for update
    $photo = PhotoSubmission::lockForUpdate()->find($photoId);

    // 2. Find existing vote (if any)
    $existingVote = $photo->votes()
        ->where('fwb_id', $fwbId)
        ->first();

    // 3. Calculate rate adjustment
    $adjustment = calculateAdjustment($existingVote, $newVoteType);

    // 4. Create or update vote
    if ($existingVote) {
        $existingVote->update(['vote_type' => $newVoteType]);
    } else {
        PhotoVote::create([...]);
    }

    // 5. Update rate (enforce minimum 0)
    $photo->update([
        'rate' => max(0, $photo->rate + $adjustment)
    ]);
});
```

**Consistency Guarantees**:
- ACID transaction ensures all-or-nothing update
- Row-level locking prevents concurrent vote conflicts
- Minimum constraint enforced both in database and application
- Cascade delete maintains referential integrity

---

## Navigation Queries

### Next Unrated Photo

**Query**: Find the chronologically next photo that the visitor hasn't voted on.

```sql
SELECT *
FROM photo_submissions
WHERE approval_status = 'approved'
  AND created_at > :current_photo_created_at
  AND NOT EXISTS (
      SELECT 1
      FROM photo_votes
      WHERE photo_votes.photo_submission_id = photo_submissions.id
        AND photo_votes.fwb_id = :visitor_fwb_id
  )
ORDER BY created_at ASC
LIMIT 1;
```

**Eloquent** (via PhotoSubmission model method):
```php
public function getNextUnratedFor(string $fwbId): ?PhotoSubmission
{
    return static::approved()
        ->where('created_at', '>', $this->created_at)
        ->whereDoesntHave('votes', fn($q) => $q->where('fwb_id', $fwbId))
        ->orderBy('created_at', 'asc')
        ->first();
}
```

**Index Usage**: `photo_submissions(created_at)`, `photo_votes(photo_submission_id, fwb_id)`

---

### Previous Rated Photo

**Query**: Find the chronologically previous photo that the visitor has voted on.

```sql
SELECT *
FROM photo_submissions
WHERE approval_status = 'approved'
  AND created_at < :current_photo_created_at
  AND EXISTS (
      SELECT 1
      FROM photo_votes
      WHERE photo_votes.photo_submission_id = photo_submissions.id
        AND photo_votes.fwb_id = :visitor_fwb_id
  )
ORDER BY created_at DESC
LIMIT 1;
```

**Eloquent** (via PhotoSubmission model method):
```php
public function getPreviousRatedFor(string $fwbId): ?PhotoSubmission
{
    return static::approved()
        ->where('created_at', '<', $this->created_at)
        ->whereHas('votes', fn($q) => $q->where('fwb_id', $fwbId))
        ->orderBy('created_at', 'desc')
        ->first();
}
```

**Index Usage**: `photo_submissions(created_at)`, `photo_votes(photo_submission_id, fwb_id)`

---

### Progress Tracking

**Query**: Count total approved photos and photos voted by visitor.

```sql
-- Total approved photos
SELECT COUNT(*) FROM photo_submissions WHERE approval_status = 'approved';

-- Photos voted by visitor
SELECT COUNT(DISTINCT photo_submission_id)
FROM photo_votes
WHERE fwb_id = :visitor_fwb_id;
```

**Eloquent**:
```php
$total = PhotoSubmission::approved()->count();
$rated = PhotoVote::where('fwb_id', $fwbId)
    ->distinct('photo_submission_id')
    ->count();
```

**Index Usage**: `photo_votes(fwb_id)`

---

## Migration Order

1. **Migration**: Add `rate` column to existing `photo_submissions` table
   - File: `YYYY_MM_DD_HHMMSS_add_rate_to_photo_submissions_table.php`
   - Actions:
     - Add column: `rate UNSIGNED INT DEFAULT 0`
     - Add index: `created_at`

2. **Migration**: Create `photo_votes` table
   - File: `YYYY_MM_DD_HHMMSS_create_photo_votes_table.php`
   - Actions:
     - Create table with all columns
     - Add unique constraint: `(photo_submission_id, fwb_id)`
     - Add index: `fwb_id`
     - Add foreign key: `photo_submission_id` → `photo_submissions(id)` ON DELETE CASCADE

---

## Data Integrity Rules

### Database Constraints
1. `photo_votes.photo_submission_id` must reference existing `photo_submissions.id`
2. Unique constraint on `(photo_submission_id, fwb_id)` prevents duplicate votes
3. Foreign key cascade delete removes votes when photo deleted
4. `rate` column unsigned prevents negative values at database level

### Application Logic
1. Only approved photos accessible in public gallery
2. `rate` cannot go below 0 (enforced via `max(0, ...)` in updateRate method)
3. Vote changes recalculate rate correctly (±2 adjustments)
4. fwb_id validated as UUID v4 format via middleware

### Concurrency Control
1. Database transactions wrap all vote operations
2. Row-level locking (`lockForUpdate()`) prevents race conditions
3. Optimistic UI updates with server reconciliation
4. Retry logic handles transient failures

---

## Factory Definitions

### PhotoVoteFactory

```php
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

---

## Testing Data Scenarios

### Scenario 1: No Votes
- Photo: rate = 0, no PhotoVote records
- Visitor: No votes cast
- Expected: Photo shows as unrated, rate = 0

### Scenario 2: Mixed Votes
- Photo: rate = 5, votes = [+1, +1, +1, +1, +1, +1, -1]
- Expected: 7 total votes, net rate = 5

### Scenario 3: Vote Change
- Initial: PhotoVote(vote_type=true), rate = 1
- Action: Change to thumbs down
- Expected: PhotoVote(vote_type=false), rate = 0 (1 - 2 = -1, clamped to 0)

### Scenario 4: Cascade Delete
- Photo: 10 votes, rate = 8
- Action: Photo deleted or unapproved
- Expected: All 10 PhotoVote records deleted, rate reset to 0 (if photo restored)

### Scenario 5: Concurrent Votes
- Two visitors vote on same photo simultaneously
- Expected: Both votes recorded, rate = sum of both votes (transaction isolation)

---

## Performance Considerations

### Query Optimization
- Index on `created_at` for chronological ordering
- Composite unique index `(photo_submission_id, fwb_id)` serves dual purpose: constraint + query optimization
- Index on `fwb_id` for progress tracking queries

### Caching Strategy
- Cache approved photo count (invalidate on photo approval/unapproval)
- Cache visitor vote count (invalidate on vote cast/changed)
- Use Laravel cache tags for grouped invalidation

### Scaling Considerations
- Vote rate calculation is O(1) (single row update)
- Navigation queries are O(log N) with indexes
- Database transactions minimal lock time
- Read-heavy queries can use read replicas

---

**Phase 1 Status**: Data model complete, proceeding to API contracts.
