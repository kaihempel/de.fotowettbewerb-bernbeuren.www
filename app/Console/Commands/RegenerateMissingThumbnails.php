<?php

namespace App\Console\Commands;

use App\Jobs\GeneratePhotoThumbnail;
use App\Models\PhotoSubmission;
use Illuminate\Console\Command;

class RegenerateMissingThumbnails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'photos:regenerate-thumbnails {--all : Regenerate all thumbnails, not just missing ones}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate missing thumbnails for approved photos';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Finding photos with missing thumbnails...');

        $query = PhotoSubmission::approved();

        if (! $this->option('all')) {
            $query->whereNull('thumbnail_path');
        }

        $photos = $query->get();

        if ($photos->isEmpty()) {
            $this->info('No photos need thumbnail regeneration.');

            return self::SUCCESS;
        }

        $this->info("Found {$photos->count()} photo(s) that need thumbnails.");

        $progressBar = $this->output->createProgressBar($photos->count());
        $progressBar->start();

        foreach ($photos as $photo) {
            // Dispatch the thumbnail generation job
            GeneratePhotoThumbnail::dispatch($photo);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('Thumbnail generation jobs have been dispatched to the queue.');
        $this->info('Run "php artisan queue:work" to process the jobs.');

        return self::SUCCESS;
    }
}
