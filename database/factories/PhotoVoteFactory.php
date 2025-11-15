<?php

namespace Database\Factories;

use App\Models\PhotoSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PhotoVote>
 */
class PhotoVoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'photo_submission_id' => PhotoSubmission::factory(),
            'fwb_id' => Str::uuid()->toString(),
            'vote_type' => $this->faker->boolean(),
        ];
    }

    /**
     * Indicate that the vote is a thumbs up.
     */
    public function thumbsUp(): static
    {
        return $this->state(fn () => ['vote_type' => true]);
    }

    /**
     * Indicate that the vote is a thumbs down.
     */
    public function thumbsDown(): static
    {
        return $this->state(fn () => ['vote_type' => false]);
    }

    /**
     * Set a specific visitor identifier for the vote.
     */
    public function forVisitor(string $fwbId): static
    {
        return $this->state(fn () => ['fwb_id' => $fwbId]);
    }
}
