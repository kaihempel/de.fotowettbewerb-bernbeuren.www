<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PhotoSubmission>
 */
class PhotoSubmissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = fake()->uuid().'.jpg';

        return [
            'fwb_id' => 'FWB-'.now()->year.'-'.str_pad((string) fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'user_id' => \App\Models\User::factory(),
            'original_filename' => fake()->word().'.jpg',
            'stored_filename' => $filename,
            'file_path' => 'photo-submissions/new/'.$filename,
            'thumbnail_path' => null,
            'file_size' => fake()->numberBetween(1000000, 15728640),
            'file_hash' => hash('sha256', fake()->uuid()),
            'mime_type' => 'image/jpeg',
            'status' => 'new',
            'rate' => 0,
            'submitted_at' => now(),
            'reviewed_at' => null,
            'reviewed_by' => null,
        ];
    }

    /**
     * Indicate that the submission is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'file_path' => str_replace('/new/', '/approved/', $attributes['file_path']),
            'thumbnail_path' => 'thumbnails/'.$attributes['stored_filename'],
            'reviewed_at' => now(),
            'reviewed_by' => \App\Models\User::factory(),
            'rate' => fake()->numberBetween(0, 100),
        ]);
    }

    /**
     * Indicate that the submission is declined.
     */
    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'declined',
            'file_path' => str_replace('/new/', '/declined/', $attributes['file_path']),
            'reviewed_at' => now(),
            'reviewed_by' => \App\Models\User::factory(),
            'rate' => 0,
        ]);
    }

    /**
     * Indicate that the submission is pending review.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
            'reviewed_at' => null,
            'reviewed_by' => null,
        ]);
    }

    /**
     * Indicate that the submission has a thumbnail.
     */
    public function withThumbnail(): static
    {
        return $this->state(fn (array $attributes) => [
            'thumbnail_path' => 'thumbnails/'.$attributes['stored_filename'],
        ]);
    }
}
