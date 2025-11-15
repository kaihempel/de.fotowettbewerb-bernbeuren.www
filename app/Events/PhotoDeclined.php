<?php

namespace App\Events;

use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PhotoDeclined
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public PhotoSubmission $photoSubmission,
        public User $reviewer,
        public string $previousStatus,
        public ?User $previousReviewer = null,
        public ?string $previousReviewedAt = null
    ) {
        //
    }
}
