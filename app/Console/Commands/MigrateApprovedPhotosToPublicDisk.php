<?php

namespace App\Console\Commands;

use App\Jobs\GeneratePhotoThumbnail;
use App\Models\PhotoSubmission;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigrateApprovedPhotosToPublicDisk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'photos:migrate-to-public';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate approved photos and thumbnails from private disk to public disk';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting migration of approved photos to public disk...');

        $approvedPhotos = PhotoSubmission::approved()->get();

        if ($approvedPhotos->isEmpty()) {
            $this->info('No approved photos found to migrate.');

            return self::SUCCESS;
        }

        $this->info("Found {$approvedPhotos->count()} approved photos to migrate.");

        $bar = $this->output->createProgressBar($approvedPhotos->count());
        $bar->start();

        $migratedPhotos = 0;
        $migratedThumbnails = 0;
        $errors = [];

        foreach ($approvedPhotos as $photo) {
            try {
                // Migrate main photo file if not already on public disk
                if ($photo->file_path) {
                    if (Storage::disk('local')->exists($photo->file_path)) {
                        $fileContent = Storage::disk('local')->get($photo->file_path);
                        Storage::disk('public')->put($photo->file_path, $fileContent);
                        Storage::disk('local')->delete($photo->file_path);
                        $migratedPhotos++;
                    } elseif (! Storage::disk('public')->exists($photo->file_path)) {
                        $errors[] = "Photo ID {$photo->id}: File not found on any disk: {$photo->file_path}";
                    }
                }

                // Migrate thumbnail if it exists
                if ($photo->thumbnail_path) {
                    if (Storage::disk('local')->exists($photo->thumbnail_path)) {
                        $thumbnailContent = Storage::disk('local')->get($photo->thumbnail_path);
                        Storage::disk('public')->put($photo->thumbnail_path, $thumbnailContent);
                        Storage::disk('local')->delete($photo->thumbnail_path);
                        $migratedThumbnails++;
                    } elseif ($photo->file_path && Storage::disk('public')->exists($photo->file_path) && ! Storage::disk('public')->exists($photo->thumbnail_path)) {
                        // Regenerate thumbnail if missing
                        GeneratePhotoThumbnail::dispatch($photo);
                    }
                }

                $bar->advance();
            } catch (\Throwable $e) {
                $errors[] = "Photo ID {$photo->id}: {$e->getMessage()}";
                $bar->advance();
            }
        }

        $bar->finish();
        $this->newLine(2);

        $this->info('Migration completed!');
        $this->info("- Migrated {$migratedPhotos} photos");
        $this->info("- Migrated {$migratedThumbnails} thumbnails");

        if (! empty($errors)) {
            $this->newLine();
            $this->error('Encountered '.count($errors).' errors:');
            foreach ($errors as $error) {
                $this->error("  - {$error}");
            }

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
