# Data Model: Photo Review Dashboard

**Phase**: 1 (Design & Contracts)
**Date**: 2025-11-15
**Feature**: Photo Review Dashboard with Review Actions and Filtering

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the Photo Review Dashboard feature. The dashboard enables authorized reviewers to view pending photo submissions and approve or decline them with full audit trail support.

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS TABLE                           │
├─────────────────────────────────────────────────────────────┤
│ id (PK)                                                     │
│ name                                                        │
│ email                                                       │
│ password                                                    │
│ role (NEW) [user|reviewer|admin]                           │
│ email_verified_at                                           │
│ remember_token                                              │
│ created_at                                                  │
│ updated_at                                                  │
└────────────────────────┬──────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        │ (1)            │ (1)            │ (1)
        │ has many       │ has many       │ has many
        │                │                │
        v                v                v
┌───────────────────────────────────────────────────────────────────┐
│               PHOTO_SUBMISSIONS TABLE                             │
├───────────────────────────────────────────────────────────────────┤
│ id (PK)                                                           │
│ fwb_id (UNIQUE)                                                  │
│ user_id (FK → users.id)                          [submitter]     │
│ original_filename                                               │
│ stored_filename                                                 │
│ file_path                                                       │
│ file_size                                                       │
│ file_hash                                                       │
│ mime_type                                                       │
│ status [new|approved|declined]                                  │
│ rate (nullable)                                                 │
│ thumbnail_path (NEW, nullable)                    [400-600px]   │
│ submitted_at                                                    │
│ reviewed_at (nullable)                                          │
│ reviewed_by (FK → users.id, nullable)             [reviewer]    │
│ created_at                                                      │
│ updated_at                                                      │
└───────────────┬──────────────────────┬────────────────────────┘
                │                      │
                │ many to one          │ many to one
                │ (submitter)          │ (reviewer)
                v                      v
            reviews    authors

        (when reviewed)
        │
        └──────────────────────────────────────────┐
                                                   │
                                                   v
                                    ┌──────────────────────────────┐
                                    │   AUDIT_LOGS TABLE (NEW)     │
                                    ├──────────────────────────────┤
                                    │ id (PK)                      │
                                    │ auditable_type               │
                                    │ auditable_id                 │
                                    │ action_type                  │
                                    │   [approved|declined]        │
                                    │ user_id (FK → users.id)      │
                                    │ changes (JSON)               │
                                    │   {                          │
                                    │     "from": "new",           │
                                    │     "to": "approved",        │
                                    │     "previous_reviewer": null│
                                    │   }                          │
                                    │ ip_address (nullable)        │
                                    │ created_at                   │
                                    │ updated_at                   │
                                    └──────────────────────────────┘
```

**Relationship Summary**:
- **User → PhotoSubmission** (1:N) - User submits many photos
- **User → PhotoSubmission (reviewer)** (1:N) - Reviewer reviews many photos
- **PhotoSubmission → AuditLog** (1:N) - Each photo may have multiple review history entries
- **User → AuditLog** (1:N) - Each reviewer action creates an audit log entry

---

## Entity Schemas

### User (Updated)

Represents a system user who can submit photos (user role) or review submissions (reviewer/admin roles).

**Table Name**: `users`

**Existing Fields**:

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | AUTO_INCREMENT | Primary key |
| `name` | string(255) | NO | - | User's full name |
| `email` | string(255) | NO | UNIQUE | User's email address |
| `email_verified_at` | timestamp | YES | NULL | Email verification timestamp |
| `password` | string(255) | NO | - | Hashed password |
| `remember_token` | string(100) | YES | NULL | Remember me token |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | Account creation time |
| `updated_at` | timestamp | NO | CURRENT_TIMESTAMP | Last update time |

**New Fields** (added by Photo Review Dashboard):

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `role` | enum | NO | 'user' | User role: 'user', 'reviewer', or 'admin' |

**Indexes**:
- Primary key: `id`
- Unique: `email`

**New Methods**:

```php
/**
 * Check if user has reviewer role.
 */
public function isReviewer(): bool
{
    return in_array($this->role, ['reviewer', 'admin']);
}

/**
 * Check if user has admin role.
 */
public function isAdmin(): bool
{
    return $this->role === 'admin';
}
```

**Relationships**:

```php
/**
 * Get the photo submissions submitted by this user.
 */
public function photoSubmissions(): HasMany
{
    return $this->hasMany(PhotoSubmission::class);
}

/**
 * Get the photo submissions reviewed by this user.
 */
public function reviewedSubmissions(): HasMany
{
    return $this->hasMany(PhotoSubmission::class, 'reviewed_by');
}

/**
 * Get the audit log entries for actions taken by this user.
 */
public function auditLogs(): HasMany
{
    return $this->hasMany(AuditLog::class);
}
```

**Casts**:

```php
protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'two_factor_confirmed_at' => 'datetime',
    ];
}
```

---

### PhotoSubmission (Updated)

Represents a single photograph uploaded by a user, with review status and audit trail.

**Table Name**: `photo_submissions`

**Existing Fields**:

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | AUTO_INCREMENT | Primary key |
| `fwb_id` | string(20) | NO | UNIQUE | Contest submission ID |
| `user_id` | bigint unsigned | NO | - | Foreign key to users (submitter) |
| `original_filename` | string(255) | NO | - | Original filename as uploaded |
| `stored_filename` | string(255) | NO | - | System-generated unique filename |
| `file_path` | string(500) | NO | - | Storage path relative to disk |
| `file_size` | integer | NO | - | File size in bytes |
| `file_hash` | string(64) | YES | NULL | SHA-256 hash for duplicate detection |
| `mime_type` | string(50) | NO | - | MIME type (image/jpeg, etc.) |
| `status` | enum | NO | 'new' | Status: 'new', 'approved', 'declined' |
| `rate` | decimal(3,2) | YES | NULL | Rating/score for approved submissions |
| `submitted_at` | timestamp | NO | CURRENT_TIMESTAMP | Submission timestamp |
| `reviewed_at` | timestamp | YES | NULL | Review timestamp |
| `reviewed_by` | bigint unsigned | YES | NULL | Foreign key to users (reviewer) |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | timestamp | NO | CURRENT_TIMESTAMP | Record update time |

**New Fields** (added by Photo Review Dashboard):

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `thumbnail_path` | string(500) | YES | NULL | Path to thumbnail image (400-600px width) |

**Indexes**:
- Primary key: `id`
- Unique: `fwb_id`
- Index: `user_id` (for user submissions lookup)
- Index: `status` (for filtering by status)
- Index: `reviewed_by` (for reviewer activity)
- Index: `file_hash` (for duplicate detection)
- Composite index: `(user_id, status)` (for active submission counting)

**Foreign Keys**:
- `user_id` → `users.id` (ON DELETE CASCADE)
- `reviewed_by` → `users.id` (ON DELETE SET NULL)

**Relationships**:

```php
/**
 * Get the user who submitted this photo.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

/**
 * Get the user who reviewed this photo.
 */
public function reviewer(): BelongsTo
{
    return $this->belongsTo(User::class, 'reviewed_by');
}

/**
 * Get the audit log entries for this submission.
 */
public function auditLogs(): MorphMany
{
    return $this->morphMany(AuditLog::class, 'auditable');
}
```

**Scopes**:

```php
/**
 * Scope to filter submissions by status.
 */
public function scopeByStatus(Builder $query, string $status): Builder
{
    return $query->where('status', $status);
}

/**
 * Scope to filter submissions with 'new' status.
 */
public function scopeNew(Builder $query): Builder
{
    return $query->where('status', 'new');
}

/**
 * Scope to filter active submissions (new or approved).
 */
public function scopeActive(Builder $query): Builder
{
    return $query->whereIn('status', ['new', 'approved']);
}

/**
 * Scope to filter submissions for a specific user.
 */
public function scopeForUser(Builder $query, int $userId): Builder
{
    return $query->where('user_id', $userId);
}

/**
 * Scope to order submissions by newest first.
 */
public function scopeRecent(Builder $query): Builder
{
    return $query->orderBy('submitted_at', 'desc');
}
```

**Methods**:

```php
/**
 * Approve a photo submission.
 */
public function approve(User $reviewer): void
{
    $previousStatus = $this->status;

    $this->update([
        'status' => 'approved',
        'reviewed_at' => now(),
        'reviewed_by' => $reviewer->id,
    ]);

    event(new PhotoApproved($this, $reviewer, $previousStatus));
}

/**
 * Decline a photo submission.
 */
public function decline(User $reviewer): void
{
    $previousStatus = $this->status;

    $this->update([
        'status' => 'declined',
        'reviewed_at' => now(),
        'reviewed_by' => $reviewer->id,
    ]);

    event(new PhotoDeclined($this, $reviewer, $previousStatus));
}

/**
 * Get the number of times this submission has been reviewed.
 */
public function reviewCount(): int
{
    return $this->auditLogs()
        ->whereIn('action_type', ['approved', 'declined'])
        ->count();
}
```

**Casts**:

```php
protected function casts(): array
{
    return [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'rate' => 'decimal:2',
    ];
}
```

---

### AuditLog (New)

Represents a record of review actions taken on photo submissions, providing complete audit trail.

**Table Name**: `audit_logs`

**Fields**:

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | AUTO_INCREMENT | Primary key |
| `auditable_type` | string(255) | NO | - | Polymorphic: 'App\Models\PhotoSubmission' |
| `auditable_id` | bigint unsigned | NO | - | Polymorphic: ID of the photo submission |
| `action_type` | enum | NO | - | Action type: 'approved' or 'declined' |
| `user_id` | bigint unsigned | NO | - | Foreign key to users (reviewer) |
| `changes` | json | NO | - | JSON object with state changes |
| `ip_address` | string(45) | YES | NULL | IP address of reviewer |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | Timestamp of action |
| `updated_at` | timestamp | NO | CURRENT_TIMESTAMP | Record update time |

**Example `changes` JSON structure**:

```json
{
  "from": "new",
  "to": "approved",
  "previous_reviewer": null,
  "previous_reviewed_at": null
}
```

Or when re-reviewing:

```json
{
  "from": "declined",
  "to": "approved",
  "previous_reviewer": "John Admin",
  "previous_reviewed_at": "2025-11-14 10:30:00"
}
```

**Indexes**:
- Primary key: `id`
- Composite index: `(auditable_type, auditable_id)` (polymorphic lookup)
- Index: `user_id` (reviewer's actions)
- Index: `action_type` (action filtering)
- Index: `created_at` (chronological queries)

**Foreign Keys**:
- `user_id` → `users.id` (ON DELETE RESTRICT - preserve audit trail)

**Relationships**:

```php
/**
 * Get the auditable model (polymorphic).
 */
public function auditable(): MorphTo
{
    return $this->morphTo();
}

/**
 * Get the user who performed this action.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

**Methods**:

```php
/**
 * Check if this is an approval action.
 */
public function isApproval(): bool
{
    return $this->action_type === 'approved';
}

/**
 * Check if this is a decline action.
 */
public function isDecline(): bool
{
    return $this->action_type === 'declined';
}

/**
 * Get a human-readable description of the change.
 */
public function description(): string
{
    $from = $this->changes['from'] ?? 'unknown';
    $to = $this->changes['to'] ?? 'unknown';

    return "Changed from {$from} to {$to}";
}
```

**Casts**:

```php
protected function casts(): array
{
    return [
        'changes' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
```

---

## Validation Rules

### Photo Submission Review Actions

#### Approve Photo Request

**Validation Rules**:

```php
[
    // No request data required for approve action
    // Authorization checked via Policy
]
```

**Business Rules**:
- Only users with 'reviewer' or 'admin' role can approve
- Only submissions with 'new' status can be approved
- User must have view access to the photo (Policy)

**Error Responses**:
- `403 Forbidden` - User is not authorized to review
- `409 Conflict` - Photo has already been reviewed by another user (but allow with last-write-wins)
- `422 Unprocessable Entity` - Photo is not in 'new' status

#### Decline Photo Request

**Validation Rules**:

```php
[
    // No request data required for decline action
    // Authorization checked via Policy
]
```

**Business Rules**:
- Only users with 'reviewer' or 'admin' role can decline
- Only submissions with 'new' status can be declined
- User must have view access to the photo (Policy)

**Error Responses**:
- `403 Forbidden` - User is not authorized to review
- `409 Conflict` - Photo has already been reviewed by another user (but allow with last-write-wins)
- `422 Unprocessable Entity` - Photo is not in 'new' status

#### Filter/List Photos Request

**Validation Rules**:

```php
[
    'status' => 'nullable|in:new,approved,declined',
    'page' => 'nullable|integer|min:1',
    'per_page' => 'nullable|integer|min:5|max:100',
]
```

**Business Rules**:
- Default status filter: 'new' (pending reviews only)
- Default pagination: 15 items per page
- Filter state preserved in URL query parameters
- User must have 'reviewer' or 'admin' role

---

## Database Migrations

### Migration 1: Add Role Column to Users Table

**File**: `database/migrations/YYYY_MM_DD_HHMMSS_add_role_to_users_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'reviewer', 'admin'])
                ->default('user')
                ->after('password');

            // Index for fast role-based queries
            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });
    }
};
```

**Rollback Strategy**: Safe to rollback - sets all users to default 'user' role on revert.

---

### Migration 2: Add Thumbnail Path to Photo Submissions

**File**: `database/migrations/YYYY_MM_DD_HHMMSS_add_thumbnail_path_to_photo_submissions_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            $table->string('thumbnail_path', 500)
                ->nullable()
                ->after('file_path')
                ->comment('Path to thumbnail image (400-600px width)');

            // Index for thumbnail queries (optional)
            $table->index('thumbnail_path');
        });
    }

    public function down(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            $table->dropIndex(['thumbnail_path']);
            $table->dropColumn('thumbnail_path');
        });
    }
};
```

**Rollback Strategy**: Safe to rollback - existing photos will fall back to full-resolution display.

---

### Migration 3: Create Audit Logs Table

**File**: `database/migrations/YYYY_MM_DD_HHMMSS_create_audit_logs_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Polymorphic relationship
            $table->string('auditable_type', 255);
            $table->unsignedBigInteger('auditable_id');

            // Action type
            $table->enum('action_type', ['approved', 'declined']);

            // Reviewer information
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('restrict');

            // Change tracking
            $table->json('changes');

            // Request context
            $table->ipAddress('ip_address')->nullable();

            // Timestamps
            $table->timestamps();

            // Indexes for query performance
            $table->index(['auditable_type', 'auditable_id']);
            $table->index('user_id');
            $table->index('action_type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
```

**Rollback Strategy**: Safe to rollback - audit logs are queryable from database dump if needed.

---

## State Transitions

### Photo Submission Status Lifecycle

```
                    ┌──────────────────┐
                    │ UPLOAD COMPLETE  │
                    │   (user action)  │
                    └────────┬─────────┘
                             │
                             v
                    ┌────────────────────┐
          ┌────────▶│ NEW (pending)      │◀────────┐
          │         │ awaiting review    │         │
          │         └──────┬─────────────┘         │
          │                │                       │
          │   ┌────────────┼────────────┐          │
          │   │            │            │          │
          │   v            v            v          │
          │ ┌─────────────────────────┐           │
          │ │ APPROVED               │           │
          │ │ accepted to gallery    │           │
          │ │ reviewed_by set        │           │
          │ │ reviewed_at set        │           │
          │ └─────────────────────────┘           │
          │                                       │
          │        (reviewer changes mind)        │
          └───────────────────────────────────────┘

┌──────────┐
│ DECLINED │
│ rejected │
│ from     │
│ gallery  │
│ reviewed │
│ _by set  │
│ reviewed │
│ _at set  │
└──────────┘
     ^
     │ (reviewer changes mind)
     │
     └─────────────────────────────┘
              (new → declined)
              (approved → declined)
```

**Status Definitions**:

| Status | Description | Reviewer Can Change | Audit Trail |
|--------|-------------|-------------------|-------------|
| `new` | Awaiting review | Yes (to approved or declined) | Initial creation recorded in history |
| `approved` | Accepted into gallery | Yes (to declined, reversible) | Each change logged with reviewer info |
| `declined` | Rejected from gallery | Yes (to approved, reversible) | Each change logged with reviewer info |

**Transition Rules**:

1. **New submissions always start with status = 'new'**
   - Set by upload process
   - No audit log entry on creation

2. **Transitions allowed**:
   - `new` → `approved` ✓ (initial review)
   - `new` → `declined` ✓ (initial review)
   - `approved` → `declined` ✓ (re-review, allowed)
   - `declined` → `approved` ✓ (re-review, allowed)
   - `approved` → `new` ✗ (NOT allowed)
   - `declined` → `new` ✗ (NOT allowed)

3. **Last-write-wins policy**:
   - When two reviewers approve/decline simultaneously, last submission wins
   - Previous reviewer info is preserved in audit log
   - Visual indicator shows "Already reviewed by X at time Y"

4. **Automatic actions on status transition**:
   - Set `reviewed_at` = `now()`
   - Set `reviewed_by` = current reviewer's user ID
   - Fire `PhotoApproved` or `PhotoDeclined` event
   - Create `AuditLog` entry with transition details
   - Update UI to show new status (via Inertia)

**Audit Trail Recording**:

On every status change:

```php
AuditLog::create([
    'auditable_type' => PhotoSubmission::class,
    'auditable_id' => $submission->id,
    'action_type' => 'approved', // or 'declined'
    'user_id' => auth()->id(),
    'changes' => [
        'from' => $previousStatus,
        'to' => $newStatus,
        'previous_reviewer' => optional($oldReviewer)->name,
        'previous_reviewed_at' => $oldReviewedAt,
    ],
    'ip_address' => request()->ip(),
]);
```

---

## Query Performance Optimization

### Eager Loading Strategy

**Dashboard List Query**:

```php
PhotoSubmission::query()
    ->with([
        'user:id,name,email',           // Submitter info
        'reviewer:id,name,email',       // Reviewer info (if reviewed)
        'auditLogs'                     // Audit history
    ])
    ->byStatus($status)
    ->recent()
    ->paginate(15);
```

**Expected Queries**:
1. Count total submissions matching filter
2. Fetch paginated submissions with selected columns
3. Batch load related users (submitters)
4. Batch load related users (reviewers)
5. Batch load audit logs for displayed submissions

**Total**: 5 queries regardless of page size (0 N+1 issues)

### Index Strategy

**For filtering by status**:
- Index: `status` (supports WHERE status = ?)
- Performance: O(1) lookup to index, O(n) scan of matching records

**For counting active submissions**:
- Composite index: `(user_id, status)` (supports WHERE user_id = ? AND status IN (...))
- Performance: Fast for remaining_submission_slots calculation

**For audit trail**:
- Composite index: `(auditable_type, auditable_id)` (polymorphic lookups)
- Performance: Fast retrieval of review history

**For reviewer activity**:
- Index: `reviewed_by` (supports WHERE reviewed_by = ?)
- Index: `user_id` on audit_logs (supports WHERE user_id = ?)

---

## Data Integrity Constraints

### Referential Integrity

**User deletion**:
```
users.id (deleted)
  → photo_submissions.user_id: CASCADE DELETE (delete all submissions)
  → photo_submissions.reviewed_by: SET NULL (preserve review history)
  → audit_logs.user_id: RESTRICT (cannot delete user with audit trail)
```

**Reviewer deletion**:
```
users.id (deleted)
  → photo_submissions.reviewed_by: SET NULL (preserve history, show "Deleted Reviewer")
  → audit_logs.user_id: RESTRICT (audit trail is immutable)
```

### Unique Constraints

- `users.email` - Unique email addresses
- `photo_submissions.fwb_id` - Unique contest IDs
- `photo_submissions.file_hash` per `user_id` - No exact duplicates per user (optional, warning only)

### Check Constraints (Database-Level Validation)

```sql
ALTER TABLE photo_submissions
ADD CONSTRAINT check_status
CHECK (status IN ('new', 'approved', 'declined'));

ALTER TABLE users
ADD CONSTRAINT check_role
CHECK (role IN ('user', 'reviewer', 'admin'));

ALTER TABLE audit_logs
ADD CONSTRAINT check_action_type
CHECK (action_type IN ('approved', 'declined'));

ALTER TABLE photo_submissions
ADD CONSTRAINT check_rate
CHECK (rate IS NULL OR (rate >= 0 AND rate <= 10));
```

---

## Security Considerations

### Authorization Gates

**Access Control**:
- `can-review-photos`: User must have 'reviewer' or 'admin' role
- `can-view-dashboard`: User must have 'reviewer' or 'admin' role

**Model Policy** (`PhotoSubmissionPolicy`):
```php
public function approve(User $user, PhotoSubmission $submission): bool
{
    return $user->isReviewer() && $submission->status === 'new';
}

public function decline(User $user, PhotoSubmission $submission): bool
{
    return $user->isReviewer() && $submission->status === 'new';
}
```

### Data Privacy

- Declined photos not exposed in public API/gallery
- Reviewer names visible only to authorized users
- Audit logs restricted to admins/system only (future enhancement)
- File paths never exposed directly (always via controller with auth check)

### Audit Logging

- Every review action creates immutable audit log entry
- IP address recorded for forensics
- Cannot delete audit logs (RESTRICT constraint)
- Reviewer cannot be deleted if they have audit entries

---

## Factory & Seeder Definitions

### PhotoSubmissionFactory

**States**:

```php
public function new(): static
{
    return $this->state([
        'status' => 'new',
        'reviewed_at' => null,
        'reviewed_by' => null,
    ]);
}

public function approved(User $reviewer = null): static
{
    return $this->state([
        'status' => 'approved',
        'reviewed_at' => now(),
        'reviewed_by' => $reviewer?->id ?? User::factory()->create(['role' => 'reviewer'])->id,
    ]);
}

public function declined(User $reviewer = null): static
{
    return $this->state([
        'status' => 'declined',
        'reviewed_at' => now(),
        'reviewed_by' => $reviewer?->id ?? User::factory()->create(['role' => 'reviewer'])->id,
    ]);
}

public function withThumbnail(): static
{
    return $this->state([
        'thumbnail_path' => 'thumbnails/photo-' . \Str::uuid() . '.jpg',
    ]);
}
```

**Usage Examples**:

```php
// Create 5 new submissions awaiting review
PhotoSubmission::factory()->count(5)->new()->create();

// Create 3 approved submissions
PhotoSubmission::factory()->count(3)->approved()->create();

// Create 2 declined submissions
PhotoSubmission::factory()->count(2)->declined()->create();

// Create submission with specific submitter and reviewer
$user = User::factory()->create(['role' => 'user']);
$reviewer = User::factory()->create(['role' => 'reviewer']);
PhotoSubmission::factory()
    ->for($user)
    ->approved($reviewer)
    ->create();
```

### Test Seeder

For local development/testing:

```php
public function run(): void
{
    // Create test users with different roles
    $users = [
        User::factory()->create([
            'name' => 'John User',
            'email' => 'user@test.local',
            'role' => 'user',
        ]),
        User::factory()->count(3)->create(['role' => 'user']),
    ];

    $reviewers = User::factory()
        ->count(2)
        ->create(['role' => 'reviewer']);

    $admin = User::factory()->create([
        'name' => 'Admin User',
        'email' => 'admin@test.local',
        'role' => 'admin',
    ]);

    // Create test submissions with mixed statuses
    foreach ($users as $user) {
        PhotoSubmission::factory()
            ->count(2)
            ->new()
            ->for($user)
            ->create();

        PhotoSubmission::factory()
            ->count(1)
            ->approved($reviewers->random())
            ->for($user)
            ->create();

        PhotoSubmission::factory()
            ->count(1)
            ->declined($reviewers->random())
            ->for($user)
            ->create();
    }
}
```

---

## Testing Strategy

### Unit Tests

**PhotoSubmission Model**:
```php
public function testApproveUpdatesStatus(): void
public function testDeclineUpdatesStatus(): void
public function testApproveRecordsReviewInfo(): void
public function testDeclineRecordsReviewInfo(): void
public function testReviewCountReturnsCorrectNumber(): void
public function testScopeByStatusFiltersCorrectly(): void
public function testScopeNewFiltersNewSubmissions(): void
```

**User Model**:
```php
public function testIsReviewerReturnsTrueForReviewers(): void
public function testIsReviewerReturnsFalseForUsers(): void
public function testIsAdminReturnsTrueForAdmins(): void
public function testIsAdminReturnsFalseForNonAdmins(): void
public function testReviewedSubmissionsReturnsOnlyReviewedPhotos(): void
```

**AuditLog Model**:
```php
public function testIsApprovalReturnsTrueForApprovals(): void
public function testIsDeclineReturnsTrueForDeclines(): void
public function testDescriptionFormatsChangeCorrectly(): void
```

### Feature Tests

**PhotoSubmissionController**:
```php
public function testUnauthorizedUserCannotAccessDashboard(): void
public function testReviewerCanAccessDashboard(): void
public function testDashboardPaginatesResults(): void
public function testFilterByStatusWorksCorrectly(): void
public function testApproveActionUpdatesStatus(): void
public function testDeclineActionUpdatesStatus(): void
public function testApproveCreatesAuditLog(): void
public function testDeclineCreatesAuditLog(): void
public function testConcurrentApprovalHandlesLastWriteWins(): void
```

**Authorization Policy**:
```php
public function testUnauthorizedUserCannotApprove(): void
public function testReviewerCanApproveNewSubmission(): void
public function testReviewerCannotApproveAlreadyReviewedSubmission(): void
public function testAdminCanApproveAnySubmission(): void
public function testUserCannotApproveAnySubmission(): void
```

### Performance Tests

```php
public function testDashboardLoadsWithoutNPlusOneQueries(): void
{
    // Use Laravel Debugbar or QueryLogger
    // Verify: 5 queries max regardless of pagination size
}

public function testDashboardLoadsInUnderOneSecond(): void
public function testApproveActionCompletesInUnderTenSeconds(): void
public function testHandles1000SubmissionsWithoutDegradation(): void
```

---

## Migration Checklist

- [x] Entity schemas defined
- [x] Relationships documented
- [x] Validation rules specified
- [x] State transitions mapped
- [x] Query performance analyzed
- [x] Security constraints identified
- [x] Factory/seeder patterns defined
- [x] Testing strategy outlined
- [x] Migration SQL provided
- [x] Rollback strategy documented

**Next Phase**: Generate API contracts and implementation tasks

---

**Data Model Version**: 1.0
**Last Updated**: 2025-11-15
**Status**: Ready for implementation
