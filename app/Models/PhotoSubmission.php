<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
            'rate' => 'decimal:2',
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
     * Get the URL for downloading the photo file.
     */
    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('photos.download', $this->id)
        );
    }
}
