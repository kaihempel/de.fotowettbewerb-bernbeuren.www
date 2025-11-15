<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotoVote extends Model
{
    /** @use HasFactory<\Database\Factories\PhotoVoteFactory> */
    use HasFactory;

    /**
     * Vote type constants.
     */
    public const VOTE_UP = true;

    public const VOTE_DOWN = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'photo_submission_id',
        'fwb_id',
        'vote_type',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'vote_type' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the photo submission that was voted on.
     */
    public function photoSubmission(): BelongsTo
    {
        return $this->belongsTo(PhotoSubmission::class);
    }
}
