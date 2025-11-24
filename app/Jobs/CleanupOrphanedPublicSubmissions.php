<?php

namespace App\Jobs;

use App\Models\PhotoSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CleanupOrphanedPublicSubmissions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Clean up declined public submissions older than 30 days
        $cutoffDate = now()->subDays(30);

        $submissions = PhotoSubmission::query()
            ->whereNull('user_id') // Public submissions only
            ->where('status', 'declined')
            ->where('reviewed_at', '<', $cutoffDate)
            ->get();

        $deletedCount = 0;
        $freedSpace = 0;

        foreach ($submissions as $submission) {
            try {
                // Delete file from storage
                if (Storage::disk('local')->exists($submission->file_path)) {
                    $freedSpace += Storage::disk('local')->size($submission->file_path);
                    Storage::disk('local')->delete($submission->file_path);
                }

                // Delete thumbnail if exists
                if ($submission->thumbnail_path && Storage::disk('local')->exists($submission->thumbnail_path)) {
                    Storage::disk('local')->delete($submission->thumbnail_path);
                }

                // Delete database record
                $submission->delete();

                $deletedCount++;
            } catch (\Throwable $e) {
                Log::error('Failed to cleanup public submission', [
                    'submission_id' => $submission->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('Cleaned up orphaned public submissions', [
            'deleted_count' => $deletedCount,
            'freed_space_mb' => round($freedSpace / 1024 / 1024, 2),
        ]);
    }
}
