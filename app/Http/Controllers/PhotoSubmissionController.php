<?php

namespace App\Http\Controllers;

use App\Models\PhotoSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PhotoSubmissionController extends Controller
{
    /**
     * Display the dashboard - shows review dashboard for reviewers/admins,
     * or user's own submissions for regular users.
     */
    public function dashboard(): InertiaResponse|RedirectResponse
    {
        $user = auth()->user();

        // Reviewers and admins see the full review dashboard
        if ($user->isReviewer()) {
            $status = request('status');

            $query = PhotoSubmission::query()
                ->with(['user:id,name,email', 'reviewer:id,name,email', 'auditLogs.user'])
                ->recent();

            if ($status && in_array($status, ['new', 'approved', 'declined'])) {
                $query->byStatus($status);
            }

            $submissions = $query->paginate(15)->withQueryString();

            // Calculate status counts for statistics cards using single query
            $counts = PhotoSubmission::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status');

            $statusCounts = [
                'all' => $counts->sum(),
                'new' => $counts->get('new', 0),
                'approved' => $counts->get('approved', 0),
                'declined' => $counts->get('declined', 0),
            ];

            return Inertia::render('dashboard', [
                'submissions' => $submissions,
                'statusCounts' => $statusCounts,
                'statusFilter' => $status ?? 'all',
            ]);
        }

        // Regular users see their own submissions
        return redirect()->route('photos.submissions');
    }

    /**
     * Approve a photo submission.
     */
    public function approve(PhotoSubmission $submission): RedirectResponse
    {
        $this->authorize('approve', $submission);

        $reviewer = auth()->user();
        $submission->approve($reviewer);

        return redirect()->back()->with('success', 'Photo approved successfully.');
    }

    /**
     * Decline a photo submission.
     */
    public function decline(PhotoSubmission $submission): RedirectResponse
    {
        $this->authorize('decline', $submission);

        $reviewer = auth()->user();
        $submission->decline($reviewer);

        return redirect()->back()->with('success', 'Photo declined successfully.');
    }

    /**
     * Display user's submissions page.
     */
    public function submissions(): InertiaResponse
    {
        $user = auth()->user();

        $submissions = PhotoSubmission::query()
            ->forUser($user->id)
            ->recent()
            ->with('reviewer')
            ->paginate(20);

        return Inertia::render('MySubmissions', [
            'submissions' => $submissions,
            'remainingSlots' => $user->remaining_submission_slots,
        ]);
    }

    /**
     * Download a photo submission.
     * All authenticated users can access all photo submissions.
     */
    public function download(PhotoSubmission $submission): StreamedResponse
    {
        // Determine which disk to use based on photo status
        // Approved photos are on the public disk, others on local
        $disk = $submission->status === 'approved' ? 'public' : 'local';

        // Verify file exists
        if (! Storage::disk($disk)->exists($submission->file_path)) {
            abort(404, 'Photo file not found.');
        }

        return Storage::disk($disk)->download(
            $submission->file_path,
            $submission->original_filename
        );
    }
}
