<?php

namespace App\Listeners;

use App\Events\PhotoApproved;
use App\Jobs\GeneratePhotoThumbnail;

class GeneratePhotoThumbnailOnApproval
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the PhotoApproved event.
     */
    public function handle(PhotoApproved $event): void
    {
        // Dispatch the thumbnail generation job
        GeneratePhotoThumbnail::dispatch($event->photoSubmission);
    }
}
