<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadFileHandler
{
    /**
     * Handle file upload with date-based storage (preserves original image untouched).
     *
     * @param  UploadedFile  $file  The uploaded file
     * @param  int|null  $userId  The user ID for logging purposes (null for public uploads)
     * @return array{filename: string, storage_path: string, file_hash: string, mime_type: string, file_size: int, original_filename: string}
     *
     * @throws \RuntimeException If file storage fails
     */
    public function handleUpload(UploadedFile $file, ?int $userId): array
    {
        // Verify MIME type using magic bytes (extra security)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $actualMimeType = finfo_file($finfo, $file->getRealPath());
        finfo_close($finfo);

        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/heic'];
        if (! in_array($actualMimeType, $allowedMimeTypes)) {
            throw new \RuntimeException('Invalid file type detected. Only JPG, PNG, and HEIC images are accepted.');
        }

        // Generate unique filename using UUID
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();

        // Generate date-based storage path (YYYY/MM/DD) - relative path for Storage facade
        $now = Carbon::now();
        $datePath = $now->format('Y/m/d');
        $storagePath = "photo-submissions/new/{$datePath}/{$filename}";

        // Calculate SHA-256 hash for duplicate detection
        $fileHash = hash_file('sha256', $file->getRealPath());

        // Store original image WITHOUT modification to preserve EXIF metadata
        // Orientation correction is applied to thumbnails only (see GeneratePhotoThumbnail job)
        // This ensures:
        // - Original contest entries remain exactly as uploaded
        // - EXIF metadata (camera, date, location, orientation) is preserved
        // - Files can be re-processed later if needed
        // - Thumbnails display correctly (via orient() in GeneratePhotoThumbnail)
        $result = Storage::putFileAs(
            "photo-submissions/new/{$datePath}",
            $file,
            $filename
        );

        if (! $result) {
            throw new \RuntimeException('Failed to store uploaded image. Please try again.');
        }

        // Verify file was actually stored before returning
        if (! Storage::exists($storagePath)) {
            throw new \RuntimeException('Failed to store uploaded image. Please try again.');
        }

        return [
            'filename' => $filename,
            'storage_path' => $storagePath,
            'file_hash' => $fileHash,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'original_filename' => $file->getClientOriginalName(),
        ];
    }

    /**
     * Move a file to a new status folder with date-based structure.
     *
     * @param  string  $currentPath  Current storage path
     * @param  string  $newFolder  New folder name ('approved' or 'declined')
     * @param  Carbon  $submissionDate  Original submission date for path structure
     * @return string New storage path
     *
     * @throws \RuntimeException If file move fails
     */
    public function moveFile(string $currentPath, string $newFolder, Carbon $submissionDate): string
    {
        if (! Storage::disk('local')->exists($currentPath)) {
            throw new \RuntimeException("Source file not found: {$currentPath}");
        }

        // Extract filename from current path
        $filename = basename($currentPath);

        // Generate date-based path using submission date (relative path for Storage facade)
        $datePath = $submissionDate->format('Y/m/d');
        $newPath = "photo-submissions/{$newFolder}/{$datePath}/{$filename}";

        // Determine target disk: 'public' for approved, 'local' for declined
        $targetDisk = $newFolder === 'approved' ? 'public' : 'local';

        // Move the file to the new location
        try {
            // Get file content from source (local disk)
            $fileContent = Storage::disk('local')->get($currentPath);

            // Save to target disk with public visibility for approved photos
            $stored = Storage::disk($targetDisk)->put($newPath, $fileContent);

            if (! $stored) {
                throw new \RuntimeException("Failed to store file to {$targetDisk} disk at {$newPath}");
            }

            // Delete original file from local disk
            Storage::disk('local')->delete($currentPath);

            // Verify the file exists at new location
            if (! Storage::disk($targetDisk)->exists($newPath)) {
                throw new \RuntimeException("File not found at new location: {$newPath}");
            }

            return $newPath;
        } catch (\Throwable $e) {
            logger()->error('File move failed', [
                'error' => $e->getMessage(),
                'source' => $currentPath,
                'destination' => $newPath,
                'target_disk' => $targetDisk ?? 'unknown',
            ]);

            throw new \RuntimeException("Failed to move file: {$e->getMessage()}");
        }
    }
}
