<?php

namespace Database\Seeders;

use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Database\Seeder;

class PublicGallerySeeder extends Seeder
{
    /**
     * Seed the database with approved photos for the public gallery.
     */
    public function run(): void
    {
        // Create a test user if one doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'gallery@test.com'],
            [
                'name' => 'Gallery Test User',
                'password' => bcrypt('password'),
            ]
        );

        // Create 55 approved photos for testing pagination
        PhotoSubmission::factory()
            ->count(55)
            ->approved()
            ->create([
                'user_id' => $user->id,
            ]);

        $this->command->info('Created 55 approved photos for public gallery testing.');
    }
}
