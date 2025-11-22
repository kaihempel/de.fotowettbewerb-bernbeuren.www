<?php

namespace App\Console\Commands;

use App\Models\PhotoSubmission;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class DiagnoseApprovedPhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'photos:diagnose-approved';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Diagnose approved photos and check for missing thumbnails or files';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('=== Checking Approved Photos ===');
        $this->newLine();

        $approvedPhotos = PhotoSubmission::where('status', 'approved')->get();

        $this->info("Total approved photos: {$approvedPhotos->count()}");
        $this->newLine();

        foreach ($approvedPhotos as $photo) {
            $this->line("Photo ID: {$photo->id}");
            $this->line("  Status: {$photo->status}");
            $this->line("  Original filename: {$photo->original_filename}");
            $this->line('  File path: '.($photo->file_path ?: 'NULL'));
            $this->line('  Thumbnail path: '.($photo->thumbnail_path ?: 'NULL'));

            // Check if file exists
            $fileExistsPublic = $photo->file_path && Storage::disk('public')->exists($photo->file_path);
            $this->line('  File exists on public disk: '.($fileExistsPublic ? '<info>YES</info>' : '<error>NO</error>'));

            // Check if file exists on local disk (fallback)
            $fileExistsLocal = $photo->file_path && Storage::disk('local')->exists($photo->file_path);
            $this->line('  File exists on local disk: '.($fileExistsLocal ? '<info>YES</info>' : '<error>NO</error>'));

            // Check if thumbnail exists
            $thumbExistsPublic = $photo->thumbnail_path && Storage::disk('public')->exists($photo->thumbnail_path);
            $this->line('  Thumbnail exists on public disk: '.($thumbExistsPublic ? '<info>YES</info>' : '<error>NO</error>'));

            // Check if thumbnail exists on local disk (fallback)
            $thumbExistsLocal = $photo->thumbnail_path && Storage::disk('local')->exists($photo->thumbnail_path);
            $this->line('  Thumbnail exists on local disk: '.($thumbExistsLocal ? '<info>YES</info>' : '<error>NO</error>'));

            $this->newLine();
        }

        $this->info('=== Photos that pass the gallery filter ===');
        $filteredPhotos = PhotoSubmission::approved()
            ->whereNotNull('file_path')
            ->whereNotNull('thumbnail_path')
            ->get();

        $this->info("Count: {$filteredPhotos->count()}");
        foreach ($filteredPhotos as $photo) {
            $this->line("  - ID: {$photo->id}, File: {$photo->original_filename}");
        }

        return self::SUCCESS;
    }
}
