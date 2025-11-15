<?php

namespace App\Http\Controllers;

use App\Http\Requests\PhotoSubmissionRequest;
use App\Models\PhotoSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Intervention\Image\Laravel\Facades\Image;
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

        return Inertia::render('PhotoUpload', [
            'submissions' => $submissions,
            'remainingSlots' => $user->remaining_submission_slots,
        ]);
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

        // Generate unique filename using UUID
        $filename = Str::uuid().'.'.$photo->getClientOriginalExtension();
        $storagePath = 'photo-submissions/new/'.$filename;

        // Calculate SHA-256 hash for duplicate detection
        $fileHash = hash_file('sha256', $photo->getRealPath());

        // Check for duplicate uploads (warning only)
        $duplicateExists = PhotoSubmission::query()
            ->forUser($user->id)
            ->where('file_hash', $fileHash)
            ->exists();

        // Process image with EXIF orientation correction
        try {
            $image = Image::read($photo->getRealPath());
            $image->orient();

            // Save the corrected image to storage
            $success = Storage::put($storagePath, (string) $image->encode());

            if (! $success) {
                throw new \RuntimeException('Failed to store uploaded image.');
            }
        } catch (\Throwable $e) {
            // Log the error for debugging
            logger()->error('EXIF orientation correction failed', [
                'error' => $e->getMessage(),
                'file' => $photo->getClientOriginalName(),
            ]);

            // Fallback: store without orientation correction
            $storagePath = Storage::putFileAs(
                'photo-submissions/new',
                $photo,
                $filename
            );

            if (! $storagePath) {
                throw new \RuntimeException('Failed to store uploaded image.');
            }
        }

        // Generate FWB ID
        $fwbId = $this->generateFwbId();

        // Create photo submission record
        PhotoSubmission::create([
            'fwb_id' => $fwbId,
            'user_id' => $user->id,
            'original_filename' => $photo->getClientOriginalName(),
            'stored_filename' => $filename,
            'file_path' => $storagePath,
            'file_size' => $photo->getSize(),
            'file_hash' => $fileHash,
            'mime_type' => $photo->getMimeType(),
            'status' => 'new',
            'submitted_at' => now(),
        ]);

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
