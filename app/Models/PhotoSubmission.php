<?php

namespace App\Models;

use App\Events\PhotoApproved;
use App\Events\PhotoDeclined;
use App\Services\UploadFileHandler;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PhotoSubmission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'fwb_id',
        'user_id',
        'visitor_fwb_id',
        'original_filename',
        'stored_filename',
        'file_path',
        'thumbnail_path',
        'file_size',
        'file_hash',
        'mime_type',
        'photographer_name',
        'photographer_email',
        'disclaimer_accepted_at',
        'status',
        'rate',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = ['file_url', 'thumbnail_url', 'full_image_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'disclaimer_accepted_at' => 'datetime',
            'rate' => 'integer',
        ];
    }

    /**
     * Get the user who submitted the photo.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who reviewed the photo.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope query to active submissions (new or approved).
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', ['new', 'approved']);
    }

    /**
     * Scope query to submissions for a specific user.
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope query to submissions for a specific visitor (by cookie).
     */
    public function scopeForVisitor(Builder $query, string $fwbId): Builder
    {
        return $query->where('visitor_fwb_id', $fwbId);
    }

    /**
     * Scope query to active submissions for a user OR visitor.
     *
     * @param  int|string  $identifier  User ID (int) or Visitor FWB ID (string)
     */
    public function scopeForSubmitter(Builder $query, int|string $identifier): Builder
    {
        if (is_int($identifier)) {
            return $query->where('user_id', $identifier);
        }

        return $query->where('visitor_fwb_id', $identifier);
    }

    /**
     * Scope query to submissions by status.
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope query to recent submissions (newest first).
     */
    public function scopeRecent(Builder $query): Builder
    {
        return $query->orderBy('submitted_at', 'desc');
    }

    /**
     * Scope query to submissions with 'new' status.
     */
    public function scopeNew(Builder $query): Builder
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope query to approved submissions.
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    /**
     * Get the audit log entries for this submission.
     */
    public function auditLogs(): MorphMany
    {
        return $this->morphMany(AuditLog::class, 'auditable')->latest();
    }

    /**
     * Get all votes for this photo submission.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(PhotoVote::class);
    }

    /**
     * Approve a photo submission.
     */
    public function approve(User $reviewer): void
    {
        $previousStatus = $this->status;
        $previousReviewer = $this->reviewer;
        $previousReviewedAt = $this->reviewed_at?->toDateTimeString();

        DB::transaction(function () use ($reviewer) {
            $uploadHandler = new UploadFileHandler;

            // Move file to approved folder with date-based structure
            try {
                $newPath = $uploadHandler->moveFile(
                    $this->file_path,
                    'approved',
                    $this->submitted_at
                );

                // Update database with new path and approval status
                $this->update([
                    'status' => 'approved',
                    'file_path' => $newPath,
                    'reviewed_at' => now(),
                    'reviewed_by' => $reviewer->id,
                ]);
            } catch (\RuntimeException $e) {
                logger()->error('Failed to move file during approval', [
                    'submission_id' => $this->id,
                    'error' => $e->getMessage(),
                ]);

                // Fallback: update status without moving file
                $this->update([
                    'status' => 'approved',
                    'reviewed_at' => now(),
                    'reviewed_by' => $reviewer->id,
                ]);
            }
        });

        event(new PhotoApproved($this, $reviewer, $previousStatus, $previousReviewer, $previousReviewedAt));
    }

    /**
     * Decline a photo submission.
     */
    public function decline(User $reviewer): void
    {
        $previousStatus = $this->status;
        $previousReviewer = $this->reviewer;
        $previousReviewedAt = $this->reviewed_at?->toDateTimeString();

        DB::transaction(function () use ($reviewer) {
            $uploadHandler = new UploadFileHandler;

            // Move file to declined folder with date-based structure
            try {
                $newPath = $uploadHandler->moveFile(
                    $this->file_path,
                    'declined',
                    $this->submitted_at
                );

                // Update database with new path and declined status
                $this->update([
                    'status' => 'declined',
                    'file_path' => $newPath,
                    'reviewed_at' => now(),
                    'reviewed_by' => $reviewer->id,
                ]);
            } catch (\RuntimeException $e) {
                logger()->error('Failed to move file during decline', [
                    'submission_id' => $this->id,
                    'error' => $e->getMessage(),
                ]);

                // Fallback: update status without moving file
                $this->update([
                    'status' => 'declined',
                    'reviewed_at' => now(),
                    'reviewed_by' => $reviewer->id,
                ]);
            }
        });

        event(new PhotoDeclined($this, $reviewer, $previousStatus, $previousReviewer, $previousReviewedAt));
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

    /**
     * Check if submission is from authenticated user.
     */
    public function isAuthenticatedSubmission(): bool
    {
        return $this->user_id !== null;
    }

    /**
     * Check if submission is from public visitor.
     */
    public function isPublicSubmission(): bool
    {
        return $this->visitor_fwb_id !== null;
    }

    /**
     * Get submission count for identifier (user or visitor).
     *
     * @param  int|string  $identifier  User ID (int) or Visitor FWB ID (string)
     */
    public static function getSubmissionCount(int|string $identifier): int
    {
        return static::query()
            ->forSubmitter($identifier)
            ->active()
            ->count();
    }

    /**
     * Get remaining slots for identifier.
     *
     * @param  int|string  $identifier  User ID (int) or Visitor FWB ID (string)
     */
    public static function getRemainingSlots(int|string $identifier): int
    {
        $count = static::getSubmissionCount($identifier);

        return max(0, 3 - $count);
    }

    /**
     * Get the next photo for a visitor (prefers unrated, but allows any).
     */
    public function getNextUnratedFor(?string $fwbId): ?self
    {
        // First try to get next unrated photo
        $nextUnrated = static::approved()
            ->where('created_at', '>', $this->created_at)
            ->whereDoesntHave('votes', fn ($q) => $q->where('fwb_id', $fwbId))
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc')
            ->first();

        if ($nextUnrated) {
            return $nextUnrated;
        }

        // If no unrated photos, get any next photo
        return static::approved()
            ->where('created_at', '>', $this->created_at)
            ->orWhere(function ($query) {
                $query->where('created_at', '=', $this->created_at)
                    ->where('id', '>', $this->id);
            })
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc')
            ->first();
    }

    /**
     * Get the previous photo for a visitor (prefers rated, but allows any).
     */
    public function getPreviousRatedFor(?string $fwbId): ?self
    {
        // First try to get previous rated photo
        $previousRated = static::approved()
            ->where('created_at', '<', $this->created_at)
            ->whereHas('votes', fn ($q) => $q->where('fwb_id', $fwbId))
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->first();

        if ($previousRated) {
            return $previousRated;
        }

        // If no rated photos, get any previous photo
        return static::approved()
            ->where('created_at', '<', $this->created_at)
            ->orWhere(function ($query) {
                $query->where('created_at', '=', $this->created_at)
                    ->where('id', '<', $this->id);
            })
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->first();
    }

    /**
     * Update the photo's rating by adjusting with the given value.
     * Ensures the rate never goes below 0.
     */
    public function updateRate(int $adjustment): void
    {
        $this->update([
            'rate' => max(0, $this->rate + $adjustment),
        ]);
    }

    /**
     * Get the user's vote for this photo.
     */
    public function getUserVote(?string $fwbId): ?PhotoVote
    {
        return $this->votes()
            ->where('fwb_id', $fwbId)
            ->first();
    }

    /**
     * Get the URL for downloading the photo file.
     */
    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('photos.download', $this->id)
        );
    }

    /**
     * Get the URL for the thumbnail image.
     */
    protected function thumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->thumbnail_path
                ? Storage::disk($this->getStorageDisk())->url($this->thumbnail_path)
                : null
        );
    }

    /**
     * Get the URL for the full-size image.
     */
    protected function fullImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->file_path
                ? Storage::disk($this->getStorageDisk())->url($this->file_path)
                : null
        );
    }

    /**
     * Determine which disk to use based on photo status.
     * Approved photos are on the public disk, others on local.
     */
    protected function getStorageDisk(): string
    {
        return $this->status === 'approved' ? 'public' : 'local';
    }
}
