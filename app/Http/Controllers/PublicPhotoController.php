<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublicPhotoSubmissionRequest;
use App\Jobs\GeneratePhotoThumbnail;
use App\Models\PhotoSubmission;
use App\Services\UploadFileHandler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PublicPhotoController extends Controller
{
    /**
     * Display the public photo submission page.
     */
    public function index(): InertiaResponse
    {
        $fwbId = request()->cookie('fwb_id');

        $submissions = PhotoSubmission::query()
            ->where('visitor_fwb_id', $fwbId)
            ->recent()
            ->paginate(20);

        $remainingSlots = $this->calculateRemainingSlots($fwbId);

        return Inertia::render('public/photo-submit', [
            'submissions' => $submissions,
            'remainingSlots' => $remainingSlots,
        ]);
    }

    /**
     * Store a new public photo submission.
     */
    public function store(PublicPhotoSubmissionRequest $request): RedirectResponse
    {
        $fwbId = $request->cookie('fwb_id');
        $photo = $request->file('photo');
        $uploadHandler = new UploadFileHandler;

        // Handle file upload with EXIF correction and date-based storage
        try {
            $fileData = $uploadHandler->handleUpload($photo, null);
        } catch (\RuntimeException $e) {
            return redirect()->route('public.photos.index')
                ->withErrors(['photo' => $e->getMessage()]);
        }

        // Check for duplicate uploads (warning only)
        $duplicateExists = PhotoSubmission::query()
            ->where('visitor_fwb_id', $fwbId)
            ->where('file_hash', $fileData['file_hash'])
            ->exists();

        // Generate FWB ID
        $photoFwbId = $this->generateFwbId();

        // Create photo submission record
        try {
            $submission = PhotoSubmission::create([
                'fwb_id' => $photoFwbId,
                'user_id' => null,
                'visitor_fwb_id' => $fwbId,
                'original_filename' => $fileData['original_filename'],
                'stored_filename' => $fileData['filename'],
                'file_path' => $fileData['storage_path'],
                'file_size' => $fileData['file_size'],
                'file_hash' => $fileData['file_hash'],
                'mime_type' => $fileData['mime_type'],
                'photographer_name' => $request->input('photographer_name'),
                'photographer_email' => $request->input('photographer_email'),
                'status' => 'new',
                'submitted_at' => now(),
            ]);

            // Dispatch thumbnail generation job
            GeneratePhotoThumbnail::dispatch($submission);
        } catch (\Throwable $e) {
            // Clean up stored file on failure
            Storage::delete($fileData['storage_path']);

            logger()->error('Failed to create public photo submission', [
                'error' => $e->getMessage(),
                'file' => $fileData['original_filename'],
                'fwb_id' => $fwbId,
            ]);

            return redirect()->route('public.photos.index')
                ->withErrors(['photo' => 'Failed to save submission. Please try again.']);
        }

        $message = 'Photo uploaded successfully!';

        if ($duplicateExists) {
            return redirect()->route('public.photos.index')
                ->with('success', $message)
                ->with('warning', 'This photo may already be uploaded.');
        }

        return redirect()->route('public.photos.index')
            ->with('success', $message);
    }

    /**
     * Calculate remaining submission slots for a visitor.
     */
    private function calculateRemainingSlots(string $fwbId): int
    {
        $activeCount = PhotoSubmission::query()
            ->where('visitor_fwb_id', $fwbId)
            ->active()
            ->count();

        return max(0, 3 - $activeCount);
    }

    /**
     * Generate a unique FWB ID in format FWB-YYYY-NNNNN.
     */
    private function generateFwbId(): string
    {
        return DB::transaction(function () {
            $year = now()->year;

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
