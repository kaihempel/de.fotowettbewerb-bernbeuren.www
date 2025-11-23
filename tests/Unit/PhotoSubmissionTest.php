<?php

namespace Tests\Unit;

use App\Models\PhotoSubmission;
use App\Models\PhotoVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhotoSubmissionTest extends TestCase
{
    use RefreshDatabase;

    // US2: Navigation method unit tests

    public function test_get_next_unrated_for_returns_correct_photo(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        $photo1 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(3),
        ]);

        $photo2 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(2),
        ]);

        $photo3 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(1),
        ]);

        // Vote on photo2
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo2->id,
        ]);

        // From photo1, next unrated should be photo3 (photo2 is rated)
        $nextPhoto = $photo1->getNextUnratedFor($fwbId);

        $this->assertNotNull($nextPhoto);
        $this->assertEquals($photo3->id, $nextPhoto->id);
    }

    public function test_get_next_unrated_for_returns_next_photo_even_when_rated(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        $photo1 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(2),
        ]);

        $photo2 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(1),
        ]);

        // Vote on both photos
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo1->id,
        ]);
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo2->id,
        ]);

        // From photo1, should still get photo2 as fallback (even though it's rated)
        $nextPhoto = $photo1->getNextUnratedFor($fwbId);

        $this->assertNotNull($nextPhoto);
        $this->assertEquals($photo2->id, $nextPhoto->id);
    }

    public function test_get_next_unrated_for_skips_unapproved_photos(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        $photo1 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(3),
        ]);

        $photo2 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'new', // Not approved
            'created_at' => now()->subDays(2),
        ]);

        $photo3 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(1),
        ]);

        // From photo1, next unrated should be photo3 (skipping photo2)
        $nextPhoto = $photo1->getNextUnratedFor($fwbId);

        $this->assertNotNull($nextPhoto);
        $this->assertEquals($photo3->id, $nextPhoto->id);
    }

    public function test_get_previous_rated_for_returns_correct_photo(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        $photo1 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(3),
        ]);

        $photo2 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(2),
        ]);

        $photo3 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(1),
        ]);

        // Vote on photo1 and photo2
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo1->id,
        ]);
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo2->id,
        ]);

        // From photo3, previous rated should be photo2
        $previousPhoto = $photo3->getPreviousRatedFor($fwbId);

        $this->assertNotNull($previousPhoto);
        $this->assertEquals($photo2->id, $previousPhoto->id);
    }

    public function test_get_previous_rated_for_returns_null_when_first_photo(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        // Create only one photo - should be null since there's no previous photo at all
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now(),
        ]);

        // No previous photos at all
        $previousPhoto = $photo->getPreviousRatedFor($fwbId);

        $this->assertNull($previousPhoto);
    }

    public function test_get_previous_rated_for_returns_previous_photo_even_when_unrated(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        $photo1 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(2),
        ]);

        $photo2 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'created_at' => now()->subDays(1),
        ]);

        // No votes on either photo
        // From photo2, should still get photo1 as fallback (even though it's unrated)
        $previousPhoto = $photo2->getPreviousRatedFor($fwbId);

        $this->assertNotNull($previousPhoto);
        $this->assertEquals($photo1->id, $previousPhoto->id);
    }

    public function test_update_rate_adjusts_correctly(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 5,
        ]);

        $photo->updateRate(3);
        $photo->refresh();

        $this->assertEquals(8, $photo->rate);
    }

    public function test_update_rate_enforces_minimum_zero(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 2,
        ]);

        $photo->updateRate(-5);
        $photo->refresh();

        $this->assertEquals(0, $photo->rate);
    }

    public function test_get_user_vote_returns_vote_when_exists(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $vote = PhotoVote::factory()->forVisitor($fwbId)->thumbsUp()->create([
            'photo_submission_id' => $photo->id,
        ]);

        $userVote = $photo->getUserVote($fwbId);

        $this->assertNotNull($userVote);
        $this->assertEquals($vote->id, $userVote->id);
        $this->assertTrue($userVote->vote_type);
    }

    public function test_get_user_vote_returns_null_when_no_vote(): void
    {
        $user = User::factory()->create();
        $fwbId = 'test-visitor-uuid';

        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $userVote = $photo->getUserVote($fwbId);

        $this->assertNull($userVote);
    }
}
