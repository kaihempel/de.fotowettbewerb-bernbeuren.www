# Data Model: Photo Upload System

**Phase**: 1 (Design & Contracts)
**Date**: 2025-11-15
**Feature**: Photo Upload System

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the photo upload feature.

## Entities

### PhotoSubmission

Represents a single photograph uploaded by a user for contest entry.

**Table Name**: `photo_submissions`

**Fields**:

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | AUTO_INCREMENT | Primary key |
| `fwb_id` | string(20) | NO | UNIQUE | Contest submission ID (e.g., "FWB-2025-00001") |
| `user_id` | bigint unsigned | NO | - | Foreign key to users table (submitter) |
| `original_filename` | string(255) | NO | - | Original filename as uploaded by user |
| `stored_filename` | string(255) | NO | - | System-generated unique filename |
| `file_path` | string(500) | NO | - | Storage path relative to disk root |
| `file_size` | integer | NO | - | File size in bytes |
| `file_hash` | string(64) | YES | NULL | SHA-256 hash for duplicate detection |
| `mime_type` | string(50) | NO | - | MIME type (image/jpeg, image/png, image/heic) |
| `status` | enum | NO | 'new' | Submission status: new, approved, declined |
| `rate` | decimal(3,2) | YES | NULL | Rating/score (0.00 to 10.00) for approved submissions |
| `submitted_at` | timestamp | NO | CURRENT_TIMESTAMP | When photo was submitted |
| `reviewed_at` | timestamp | YES | NULL | When photo was reviewed (status changed from new) |
| `reviewed_by` | bigint unsigned | YES | NULL | Foreign key to users table (reviewer) |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | timestamp | NO | CURRENT_TIMESTAMP ON UPDATE | Record last update timestamp |

**Indexes**:
- Primary key: `id`
- Unique: `fwb_id`
- Index: `user_id` (for user's submissions lookup)
- Index: `status` (for filtering by status)
- Index: `reviewed_by` (for reviewer's activity)
- Index: `file_hash` (for duplicate detection)
- Composite index: `(user_id, status)` (for counting active submissions)

**Foreign Keys**:
- `user_id` → `users.id` (ON DELETE CASCADE - if user deleted, remove their submissions)
- `reviewed_by` → `users.id` (ON DELETE SET NULL - preserve review history even if reviewer deleted)

---

### User (Existing)

Contest participant who submits photos. This entity already exists in the authentication system.

**Table Name**: `users`

**Relevant Fields** (existing):
- `id` - Primary key
- `name` - User's full name
- `email` - User's email address
- `created_at` - Account creation timestamp

**New Relationships** (added by this feature):
- One-to-many with PhotoSubmission (as submitter)
- One-to-many with PhotoSubmission (as reviewer)

## Relationships

### PhotoSubmission → User (Submitter)

**Type**: Many-to-One (BelongsTo)

**Implementation** (PhotoSubmission model):
```php
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

**Usage**: Access the user who submitted a photo
```php
$submission->user->name // "John Doe"
```

---

### PhotoSubmission → User (Reviewer)

**Type**: Many-to-One (BelongsTo)

**Implementation** (PhotoSubmission model):
```php
public function reviewer(): BelongsTo
{
    return $this->belongsTo(User::class, 'reviewed_by');
}
```

**Usage**: Access the admin/reviewer who approved/declined a photo
```php
$submission->reviewer?->name // "Admin User" or null if not reviewed
```

---

### User → PhotoSubmission (Submissions)

**Type**: One-to-Many (HasMany)

**Implementation** (User model):
```php
public function photoSubmissions(): HasMany
{
    return $this->hasMany(PhotoSubmission::class);
}
```

**Usage**: Access all submissions by a user
```php
$user->photoSubmissions()->where('status', 'approved')->get();
```

---

### User → PhotoSubmission (Reviews)

**Type**: One-to-Many (HasMany)

**Implementation** (User model):
```php
public function reviewedSubmissions(): HasMany
{
    return $this->hasMany(PhotoSubmission::class, 'reviewed_by');
}
```

**Usage**: Access all submissions reviewed by an admin
```php
$admin->reviewedSubmissions()->count(); // Number of photos reviewed
```

## Validation Rules

### File Upload Validation

**Field**: `photo` (UploadedFile)

**Rules**:
```php
[
    'photo' => [
        'required',
        'file',
        'mimes:jpg,jpeg,png,heic',
        'max:15360', // 15MB in kilobytes
    ]
]
```

**Custom Validation**:
- MIME type verification (server-side check)
- File hash uniqueness check (duplicate warning, not blocking)
- Active submission count <= 3 (per user)

**Error Messages**:
```php
[
    'photo.required' => 'Please select a photo to upload.',
    'photo.file' => 'The uploaded file is invalid.',
    'photo.mimes' => 'Only JPG, PNG, and HEIC images are accepted.',
    'photo.max' => 'Photo must not exceed 15MB.',
]
```

### Database Validation

**Field Constraints**:
- `fwb_id`: Unique, format "FWB-YYYY-NNNNN" (e.g., "FWB-2025-00001")
- `status`: Must be one of: 'new', 'approved', 'declined'
- `mime_type`: Must be one of: 'image/jpeg', 'image/png', 'image/heic'
- `file_size`: Must be > 0 and <= 15,728,640 bytes (15MB)
- `rate`: If not null, must be between 0.00 and 10.00

## State Transitions

### Submission Lifecycle

```
┌─────────┐
│  User   │
│ Uploads │
└────┬────┘
     │
     v
┌─────────┐
│   NEW   │ ← Initial status upon upload
└────┬────┘
     │
     ├─────────> APPROVED (by reviewer)
     │           - Sets reviewed_at timestamp
     │           - Sets reviewed_by user_id
     │           - May set rate (optional)
     │
     └─────────> DECLINED (by reviewer)
                 - Sets reviewed_at timestamp
                 - Sets reviewed_by user_id
                 - Frees up user's submission slot
```

**Status Definitions**:

| Status | Description | User Can Upload More? | Counts Toward Limit? |
|--------|-------------|----------------------|---------------------|
| `new` | Awaiting review | If < 3 total active | YES |
| `approved` | Accepted into contest | If < 3 total active | YES |
| `declined` | Rejected by reviewer | YES (slot freed) | NO |

**Transition Rules**:
1. New submission always starts with status = 'new'
2. Only reviewers can change status from 'new' to 'approved' or 'declined'
3. Status cannot be changed back to 'new' once reviewed
4. Approved → Declined transition is allowed (re-review scenario)
5. Declined → Approved transition is allowed (reviewer reversal)

**Automatic Actions on Transition**:
- When status changes from 'new': Set `reviewed_at` = NOW()
- When status changes from 'new': Set `reviewed_by` = current admin user ID
- When status changes to 'declined': User's active submission count decreases by 1

## Query Scopes

### Active Submissions

Returns submissions with status 'new' or 'approved' (count toward user's 3-submission limit).

**Implementation**:
```php
public function scopeActive(Builder $query): Builder
{
    return $query->whereIn('status', ['new', 'approved']);
}
```

**Usage**:
```php
PhotoSubmission::active()->count(); // Total active submissions in system
```

---

### For User

Returns submissions for a specific user.

**Implementation**:
```php
public function scopeForUser(Builder $query, int $userId): Builder
{
    return $query->where('user_id', $userId);
}
```

**Usage**:
```php
PhotoSubmission::forUser(auth()->id())->get(); // Current user's submissions
```

---

### By Status

Returns submissions filtered by status.

**Implementation**:
```php
public function scopeByStatus(Builder $query, string $status): Builder
{
    return $query->where('status', $status);
}
```

**Usage**:
```php
PhotoSubmission::byStatus('new')->get(); // All pending reviews
```

---

### Recent

Returns submissions ordered by newest first.

**Implementation**:
```php
public function scopeRecent(Builder $query): Builder
{
    return $query->orderBy('submitted_at', 'desc');
}
```

**Usage**:
```php
PhotoSubmission::recent()->limit(10)->get(); // 10 most recent submissions
```

## Accessors

### File URL

Generates a secure URL to access the uploaded photo.

**Implementation**:
```php
protected function fileUrl(): Attribute
{
    return Attribute::make(
        get: fn () => Storage::url($this->file_path)
    );
}
```

**Usage**:
```php
$submission->file_url // "http://localhost/storage/photo-submissions/new/abc123.jpg"
```

---

### Remaining Slots

Calculates how many submission slots the user has remaining (out of 3).

**Note**: This would be implemented on the User model, not PhotoSubmission.

**Implementation** (User model):
```php
protected function remainingSubmissionSlots(): Attribute
{
    return Attribute::make(
        get: fn () => 3 - $this->photoSubmissions()->active()->count()
    );
}
```

**Usage**:
```php
$user->remaining_submission_slots // 1 (if user has 2 active submissions)
```

## Casts

**Implementation** (PhotoSubmission model):
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

**Effect**:
- `submitted_at` and `reviewed_at` become Carbon instances for easy date manipulation
- `rate` maintains 2 decimal precision (e.g., 8.75)

## Factories & Seeders

### PhotoSubmissionFactory

**Purpose**: Generate test data for unit/feature tests.

**States**:
- `new()` - Submission with status 'new' (default)
- `approved()` - Submission with status 'approved', reviewed_at set, reviewed_by set
- `declined()` - Submission with status 'declined', reviewed_at set, reviewed_by set

**Example**:
```php
PhotoSubmission::factory()->count(3)->create(['user_id' => $user->id]);
PhotoSubmission::factory()->approved()->create();
```

### DatabaseSeeder (Optional)

**Purpose**: Populate database with sample submissions for development.

**Approach**:
- Create 5 test users
- Each user has 1-3 photo submissions
- Mix of 'new', 'approved', 'declined' statuses
- Use sample image files from `database/seeders/sample-photos/`

## Migration Strategy

### Initial Migration

**File**: `YYYY_MM_DD_HHMMSS_create_photo_submissions_table.php`

**Up Method**:
```php
Schema::create('photo_submissions', function (Blueprint $table) {
    $table->id();
    $table->string('fwb_id', 20)->unique();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('original_filename', 255);
    $table->string('stored_filename', 255);
    $table->string('file_path', 500);
    $table->integer('file_size');
    $table->string('file_hash', 64)->nullable()->index();
    $table->string('mime_type', 50);
    $table->enum('status', ['new', 'approved', 'declined'])->default('new');
    $table->decimal('rate', 3, 2)->nullable();
    $table->timestamp('submitted_at')->useCurrent();
    $table->timestamp('reviewed_at')->nullable();
    $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
    $table->timestamps();

    // Composite index for active submission counting
    $table->index(['user_id', 'status']);
});
```

**Down Method**:
```php
Schema::dropIfExists('photo_submissions');
```

### Future Migrations (Potential)

- Add `rejected_reason` text field (for declined explanations)
- Add `public_vote_count` integer (for public voting feature)
- Add `display_order` integer (for contest gallery sorting)

## Data Integrity

### Constraints

1. **User deletion**: When a user is deleted, all their submissions are deleted (CASCADE)
2. **Reviewer deletion**: When a reviewer is deleted, their review history is preserved (SET NULL)
3. **Unique contest ID**: Each submission gets a unique FWB ID
4. **File hash uniqueness per user**: Prevent exact duplicate uploads (warning only, not enforced)

### Triggers (Future Enhancement)

- **Auto-generate FWB ID**: Use database trigger or model observer to generate sequential contest ID
- **Audit log**: Track all status changes (who changed, when, from/to)

## Performance Considerations

### Indexes

- `user_id, status` composite index enables fast counting of active submissions per user
- `file_hash` index enables fast duplicate detection
- `status` index enables fast filtering for admin review queue

### Query Optimization

- Use `->with('user')` to eager load submitter when displaying submissions list (avoid N+1)
- Use `->withCount('photoSubmissions')` when loading users to show submission counts
- Paginate submissions list (20 per page) to avoid loading all records

### Storage Optimization

- Store files in subdirectories by status (new/, approved/, declined/) to prevent directory bloat
- Alternative: Store by date (YYYY/MM/DD/filename.jpg) for better organization
- Consider S3/cloud storage for production with CDN for approved photos

## Security Considerations

### File Storage

- Store uploaded files outside `public/` directory (in `storage/app/`)
- Generate URLs via controller action with authorization check
- Sanitize `original_filename` before storing in database (prevent XSS in admin panel)

### Access Control

- Users can only upload if authenticated
- Users can only view their own submissions (unless approved photos are public)
- Only admins/reviewers can change status or assign ratings
- File download requires authentication and ownership verification

### Data Privacy

- EXIF metadata (GPS, camera info) stripped or corrected during processing
- User's email/contact info not exposed in public contest gallery
- Declined photos not accessible via public URLs

## Testing Strategy

### Unit Tests

- Model relationships (user → submissions, submission → reviewer)
- Query scopes (active, forUser, byStatus)
- Accessors (file_url, remaining_submission_slots)
- State transitions (new → approved, new → declined)

### Feature Tests

- Upload validation (file type, size, authenticated user)
- Duplicate detection (same file hash warning)
- Submission counting (3-photo limit enforcement)
- Status transitions (reviewer actions)
- File storage (correct path, filename, permissions)

### Integration Tests

- End-to-end upload flow (select file → upload → preview → confirm)
- EXIF orientation correction (upload rotated image → verify correct orientation)
- Concurrent uploads (race condition testing for submission counting)

## Data Model Readiness

✅ Entity structure defined
✅ Relationships documented
✅ Validation rules specified
✅ State transitions mapped
✅ Query scopes planned
✅ Migration strategy outlined
✅ Security considerations addressed

**Next**: Generate API contracts (`contracts/photo-submission-api.yaml`)
