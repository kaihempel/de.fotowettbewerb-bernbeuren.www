<?php

namespace App\Jobs;

use App\Models\PhotoSubmission;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class GeneratePhotoThumbnail implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public PhotoSubmission $photoSubmission
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Refresh the model to get the latest database state
        // This is crucial when the job is queued during approval,
        // as the model needs the updated status and file_path
        $this->photoSubmission->refresh();

        // Read the original image from storage
        $originalPath = $this->photoSubmission->file_path;

        // Determine which disk the original file is on based on status
        $sourceDisk = $this->photoSubmission->status === 'approved' ? 'public' : 'local';

        // Check if file exists on the determined disk
        if (! Storage::disk($sourceDisk)->exists($originalPath)) {
            // Fallback: try the other disk
            $sourceDisk = $sourceDisk === 'public' ? 'local' : 'public';
            if (! Storage::disk($sourceDisk)->exists($originalPath)) {
                logger()->error('Original image not found for thumbnail generation', [
                    'photo_submission_id' => $this->photoSubmission->id,
                    'file_path' => $originalPath,
                ]);

                return;
            }
        }

        $imageContent = Storage::disk($sourceDisk)->get($originalPath);

        // Generate thumbnail (500px width, maintain aspect ratio, 80% quality)
        // Apply EXIF orientation correction before resizing to ensure proper display
        $thumbnail = Image::read($imageContent)
            ->orient()
            ->scaleDown(width: 500)
            ->toJpeg(quality: 80);

        // Generate thumbnail path
        $thumbnailPath = 'thumbnails/'.basename($originalPath);

        // Save thumbnail to public disk for approved photos, local disk for others
        $targetDisk = $this->photoSubmission->status === 'approved' ? 'public' : 'local';
        Storage::disk($targetDisk)->put($thumbnailPath, $thumbnail);

        // Delete old thumbnail from wrong disk if it exists
        $oldDisk = $targetDisk === 'public' ? 'local' : 'public';
        if (Storage::disk($oldDisk)->exists($thumbnailPath)) {
            Storage::disk($oldDisk)->delete($thumbnailPath);
        }

        // Update photo submission with thumbnail path
        $this->photoSubmission->update([
            'thumbnail_path' => $thumbnailPath,
        ]);
    }
}
