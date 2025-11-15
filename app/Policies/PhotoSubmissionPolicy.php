<?php

namespace App\Policies;

use App\Models\PhotoSubmission;
use App\Models\User;

class PhotoSubmissionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isReviewer();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->isReviewer();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->id === $photoSubmission->user_id;
    }

    /**
     * Determine whether the user can approve the model.
     */
    public function approve(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->isReviewer();
    }

    /**
     * Determine whether the user can decline the model.
     */
    public function decline(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->isReviewer();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->id === $photoSubmission->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PhotoSubmission $photoSubmission): bool
    {
        return $user->isAdmin();
    }
}
