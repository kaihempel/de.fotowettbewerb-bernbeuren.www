<?php

namespace App\Http\Controllers;

use App\Http\Requests\PhotoSubmissionRequest;
use App\Models\PhotoSubmission;
use App\Services\UploadFileHandler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PhotoSubmissionController extends Controller
{
    /**
     * Display the photo upload page.
     */
    public function index(): InertiaResponse
    {
        $user = auth()->user();

        $submissions = PhotoSubmission::query()
            ->forUser($user->id)
            ->recent()
            ->with('reviewer')
            ->paginate(20);

        return Inertia::render('photo-upload', [
            'submissions' => $submissions,
            'remainingSlots' => $user->remaining_submission_slots,
        ]);
    }

    /**
     * Display the photo review dashboard (for reviewers/admins).
     */
    public function dashboard(): InertiaResponse
    {
        $this->authorize('viewAny', PhotoSubmission::class);

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
            'total' => $counts->sum(),
            'new' => $counts->get('new', 0),
            'approved' => $counts->get('approved', 0),
            'declined' => $counts->get('declined', 0),
        ];

        return Inertia::render('dashboard', [
            'submissions' => $submissions,
            'statusCounts' => $statusCounts,
            'currentStatus' => $status,
        ]);
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
     * Store a new photo submission.
     */
    public function store(PhotoSubmissionRequest $request): RedirectResponse
    {
        $user = $request->user();
        $photo = $request->file('photo');
        $uploadHandler = new UploadFileHandler;

        // Handle file upload with EXIF correction and date-based storage
        try {
            $fileData = $uploadHandler->handleUpload($photo, $user->id);
        } catch (\RuntimeException $e) {
            return redirect()->route('photos.index')
                ->withErrors(['photo' => $e->getMessage()]);
        }

        // Check for duplicate uploads (warning only)
        $duplicateExists = PhotoSubmission::query()
            ->forUser($user->id)
            ->where('file_hash', $fileData['file_hash'])
            ->exists();

        // Generate FWB ID
        $fwbId = $this->generateFwbId();

        // Create photo submission record only after successful file storage
        try {
            PhotoSubmission::create([
                'fwb_id' => $fwbId,
                'user_id' => $user->id,
                'original_filename' => $fileData['original_filename'],
                'stored_filename' => $fileData['filename'],
                'file_path' => $fileData['storage_path'],
                'file_size' => $fileData['file_size'],
                'file_hash' => $fileData['file_hash'],
                'mime_type' => $fileData['mime_type'],
                'status' => 'new',
                'submitted_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // If database creation fails, clean up the stored file
            Storage::delete($fileData['storage_path']);

            logger()->error('Failed to create photo submission record', [
                'error' => $e->getMessage(),
                'file' => $fileData['original_filename'],
            ]);

            return redirect()->route('photos.index')
                ->withErrors(['photo' => 'Failed to save submission. Please try again.']);
        }

        $message = 'Photo uploaded successfully!';

        if ($duplicateExists) {
            return redirect()->route('photos.index')
                ->with('success', $message)
                ->with('warning', 'This photo may already be uploaded.');
        }

        return redirect()->route('photos.index')
            ->with('success', $message);
    }

    /**
     * Download a photo submission.
     */
    public function download(PhotoSubmission $submission): StreamedResponse
    {
        $user = auth()->user();

        // Authorization: user owns submission OR status is approved
        if ($submission->user_id !== $user->id && $submission->status !== 'approved') {
            abort(403, 'This action is unauthorized.');
        }

        return Storage::download(
            $submission->file_path,
            $submission->original_filename
        );
    }

    /**
     * Generate a unique FWB ID in format FWB-YYYY-NNNNN.
     */
    private function generateFwbId(): string
    {
        return DB::transaction(function () {
            $year = now()->year;

            // Get the highest sequential number for this year with exclusive lock
            $lastSubmission = PhotoSubmission::query()
                ->where('fwb_id', 'like', "FWB-{$year}-%")
                ->lockForUpdate()
                ->orderByDesc('fwb_id')
                ->first();

            if ($lastSubmission) {
                $lastNumber = (int) substr($lastSubmission->fwb_id, -5);
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            return sprintf('FWB-%d-%05d', $year, $nextNumber);
        });
    }
}
