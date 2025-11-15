<?php

namespace App\Listeners;

use App\Events\PhotoApproved;
use App\Events\PhotoDeclined;
use App\Models\AuditLog;

class LogPhotoReviewAction
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
    public function handle(PhotoApproved|PhotoDeclined $event): void
    {
        $actionType = match (true) {
            $event instanceof PhotoApproved => 'approved',
            $event instanceof PhotoDeclined => 'declined',
        };

        $previousReviewer = $event->photoSubmission->reviewer?->name;
        $previousReviewedAt = $event->photoSubmission->reviewed_at;

        AuditLog::create([
            'auditable_type' => get_class($event->photoSubmission),
            'auditable_id' => $event->photoSubmission->id,
            'action_type' => $actionType,
            'user_id' => $event->reviewer->id,
            'changes' => [
                'from' => $event->previousStatus,
                'to' => $event->photoSubmission->status,
                'previous_reviewer' => $previousReviewer,
                'previous_reviewed_at' => $previousReviewedAt?->toDateTimeString(),
            ],
            'ip_address' => request()->ip(),
        ]);
    }
}
