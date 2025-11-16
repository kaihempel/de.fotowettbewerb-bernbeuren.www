<?php

namespace App\Http\Controllers;

use App\Http\Requests\VoteRequest;
use App\Models\PhotoSubmission;
use App\Models\PhotoVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PublicGalleryController extends Controller
{
    /**
     * Display the gallery list with cursor pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $paginator = PhotoSubmission::query()
            ->approved()
            ->whereNotNull('file_path')
            ->whereNotNull('thumbnail_path')
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc')
            ->cursorPaginate(20);

        return response()->json([
            'photos' => $paginator->items(),
            'next_cursor' => $paginator->nextCursor()?->encode(),
            'has_more' => $paginator->hasMorePages(),
        ]);
    }

    /**
     * Display the gallery entry point, redirecting to the first unrated photo.
     */
    public function gallery(Request $request): RedirectResponse|Response
    {
        $fwbId = $request->cookie('fwb_id');

        // Get the first unrated photo
        $firstUnratedPhoto = PhotoSubmission::approved()
            ->whereDoesntHave('votes', fn ($q) => $q->where('fwb_id', $fwbId))
            ->orderBy('created_at', 'asc')
            ->first();

        if ($firstUnratedPhoto) {
            return redirect()->route('gallery.show', $firstUnratedPhoto);
        }

        // If all photos are rated, show the first photo chronologically
        $firstPhoto = PhotoSubmission::approved()
            ->orderBy('created_at', 'asc')
            ->first();

        if ($firstPhoto) {
            return redirect()->route('gallery.show', $firstPhoto);
        }

        // No approved photos available - render welcome page
        return Inertia::render('welcome');
    }

    /**
     * Display a specific photo in the gallery.
     */
    public function show(PhotoSubmission $photoSubmission, Request $request): Response
    {
        // Ensure the photo is approved
        if ($photoSubmission->status !== 'approved') {
            abort(404);
        }

        $fwbId = $request->cookie('fwb_id');

        // Get navigation photos
        $nextPhoto = $photoSubmission->getNextUnratedFor($fwbId);
        $previousPhoto = $photoSubmission->getPreviousRatedFor($fwbId);

        // Get user's vote for this photo
        $userVote = $photoSubmission->getUserVote($fwbId);

        // Calculate progress
        $totalPhotos = PhotoSubmission::approved()->count();
        $ratedPhotos = PhotoVote::where('fwb_id', $fwbId)
            ->distinct('photo_submission_id')
            ->count('photo_submission_id');

        return Inertia::render('Gallery', [
            'photo' => $photoSubmission,
            'nextPhoto' => $nextPhoto,
            'previousPhoto' => $previousPhoto,
            'userVote' => $userVote,
            'progress' => [
                'rated' => $ratedPhotos,
                'total' => $totalPhotos,
            ],
        ]);
    }

    /**
     * Cast or update a vote on a photo.
     */
    public function vote(PhotoSubmission $photoSubmission, VoteRequest $request): RedirectResponse
    {
        // Ensure the photo is approved
        if ($photoSubmission->status !== 'approved') {
            abort(404);
        }

        $fwbId = $request->cookie('fwb_id');
        $voteType = $request->input('vote_type') === 'up';

        try {
            DB::transaction(function () use ($photoSubmission, $fwbId, $voteType) {
                // Lock the photo row for update
                $photo = PhotoSubmission::lockForUpdate()->find($photoSubmission->id);

                // Find existing vote
                $existingVote = $photo->votes()
                    ->where('fwb_id', $fwbId)
                    ->first();

                // Calculate rate adjustment
                $adjustment = $this->calculateRateAdjustment($existingVote, $voteType);

                // Create or update vote
                if ($existingVote) {
                    $existingVote->update(['vote_type' => $voteType]);
                } else {
                    PhotoVote::create([
                        'photo_submission_id' => $photo->id,
                        'fwb_id' => $fwbId,
                        'vote_type' => $voteType,
                    ]);
                }

                // Update photo rate
                $photo->updateRate($adjustment);

                // Log successful vote operation
                Log::info('Vote recorded', [
                    'photo_id' => $photo->id,
                    'fwb_id' => $fwbId,
                    'vote_type' => $voteType ? 'up' : 'down',
                    'adjustment' => $adjustment,
                    'new_rate' => $photo->fresh()->rate,
                ]);
            });

            return redirect()->back()->with('success', 'Vote recorded successfully.');
        } catch (\Exception $e) {
            Log::error('Vote operation failed', [
                'photo_id' => $photoSubmission->id,
                'fwb_id' => $fwbId,
                'error' => $e->getMessage(),
            ]);

            return redirect()->back()->with('error', 'Failed to record vote. Please try again.');
        }
    }

    /**
     * Calculate the rate adjustment based on vote change.
     */
    private function calculateRateAdjustment(?PhotoVote $existingVote, bool $newVoteType): int
    {
        if (! $existingVote) {
            // New vote: +1 for up, -1 for down
            return $newVoteType ? 1 : -1;
        }

        if ($existingVote->vote_type === $newVoteType) {
            // Same vote: no change
            return 0;
        }

        // Vote changed: up to down (-2) or down to up (+2)
        return $newVoteType ? 2 : -2;
    }
}
