<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class UploadFileHandler
{
    /**
     * Handle file upload with EXIF correction and date-based storage.
     *
     * @param  UploadedFile  $file  The uploaded file
     * @param  int  $userId  The user ID for logging purposes
     * @return array{filename: string, storage_path: string, file_hash: string, mime_type: string, file_size: int, original_filename: string}
     *
     * @throws \RuntimeException If file storage fails
     */
    public function handleUpload(UploadedFile $file, int $userId): array
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

        // Generate date-based storage path (YYYY/MM/DD)
        $now = Carbon::now();
        $datePath = $now->format('Y/m/d');
        $relativePath = "photo-submissions/new/{$datePath}/{$filename}";
        $storagePath = storage_path("app/{$relativePath}");

        // Calculate SHA-256 hash for duplicate detection
        $fileHash = hash_file('sha256', $file->getRealPath());

        // Process image with EXIF orientation correction
        try {
            $image = Image::read($file->getRealPath());
            $image->orient();

            // Save the corrected image to storage
            $fileStored = Storage::put($storagePath, (string) $image->encode());

            if (! $fileStored) {
                throw new \RuntimeException('Failed to store uploaded image.');
            }
        } catch (\Throwable $e) {
            // Log the error for debugging
            logger()->error('EXIF orientation correction failed', [
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName(),
                'user_id' => $userId,
            ]);

            // Fallback: store without orientation correction
            $result = Storage::putFileAs(
                storage_path("app/photo-submissions/new/{$datePath}"),
                $file,
                $filename
            );

            if (! $result) {
                throw new \RuntimeException('Failed to store uploaded image. Please try again.');
            }

            $fileStored = true;
        }

        // Verify file was actually stored before returning
        if (! $fileStored || ! Storage::exists($storagePath)) {
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
        if (! Storage::exists($currentPath)) {
            throw new \RuntimeException("Source file not found: {$currentPath}");
        }

        // Extract filename from current path
        $filename = basename($currentPath);

        // Generate date-based path using submission date
        $datePath = $submissionDate->format('Y/m/d');
        $relativePath = "photo-submissions/{$newFolder}/{$datePath}/{$filename}";
        $newPath = storage_path("app/{$relativePath}");

        // Move the file to the new location
        try {
            $moved = Storage::move($currentPath, $newPath);

            if (! $moved) {
                throw new \RuntimeException("Failed to move file from {$currentPath} to {$newPath}");
            }

            // Verify the file exists at new location
            if (! Storage::exists($newPath)) {
                throw new \RuntimeException("File not found at new location: {$newPath}");
            }

            return $newPath;
        } catch (\Throwable $e) {
            logger()->error('File move failed', [
                'error' => $e->getMessage(),
                'source' => $currentPath,
                'destination' => $newPath,
            ]);

            throw new \RuntimeException("Failed to move file: {$e->getMessage()}");
        }
    }
}
