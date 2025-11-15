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
        // Read the original image from storage
        $originalPath = $this->photoSubmission->file_path;
        $imageContent = Storage::disk('local')->get($originalPath);

        // Generate thumbnail (500px width, maintain aspect ratio, 80% quality)
        $thumbnail = Image::read($imageContent)
            ->scaleDown(width: 500)
            ->encode(quality: 80);

        // Generate thumbnail path
        $thumbnailPath = 'thumbnails/'.basename($originalPath);

        // Save thumbnail to storage
        Storage::disk('local')->put($thumbnailPath, $thumbnail);

        // Update photo submission with thumbnail path
        $this->photoSubmission->update([
            'thumbnail_path' => $thumbnailPath,
        ]);
    }
}
