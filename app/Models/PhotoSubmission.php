<?php

namespace App\Models;

use App\Events\PhotoApproved;
use App\Events\PhotoDeclined;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

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
        'original_filename',
        'stored_filename',
        'file_path',
        'thumbnail_path',
        'file_size',
        'file_hash',
        'mime_type',
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
    protected $appends = ['file_url'];

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

        $this->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer->id,
        ]);

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

        $this->update([
            'status' => 'declined',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer->id,
        ]);

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
     * Get the next unrated photo for a visitor.
     */
    public function getNextUnratedFor(string $fwbId): ?self
    {
        return static::approved()
            ->where('created_at', '>', $this->created_at)
            ->whereDoesntHave('votes', fn ($q) => $q->where('fwb_id', $fwbId))
            ->orderBy('created_at', 'asc')
            ->first();
    }

    /**
     * Get the previous rated photo for a visitor.
     */
    public function getPreviousRatedFor(string $fwbId): ?self
    {
        return static::approved()
            ->where('created_at', '<', $this->created_at)
            ->whereHas('votes', fn ($q) => $q->where('fwb_id', $fwbId))
            ->orderBy('created_at', 'desc')
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
    public function getUserVote(string $fwbId): ?PhotoVote
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
}
