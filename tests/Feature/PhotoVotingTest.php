<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use App\Models\PhotoVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhotoVotingTest extends TestCase
{
    use RefreshDatabase;

    // US1: Vote operations

    public function test_can_vote_thumbs_up_on_photo(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 0,
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        $response = $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'up']);

        $response->assertRedirect();

        $photo->refresh();
        $this->assertEquals(1, $photo->rate);

        $this->assertDatabaseHas('photo_votes', [
            'photo_submission_id' => $photo->id,
            'fwb_id' => $fwbId,
            'vote_type' => true,
        ]);
    }

    public function test_can_vote_thumbs_down_on_photo(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 10,
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        $response = $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'down']);

        $response->assertRedirect();

        $photo->refresh();
        $this->assertEquals(9, $photo->rate);

        $this->assertDatabaseHas('photo_votes', [
            'photo_submission_id' => $photo->id,
            'fwb_id' => $fwbId,
            'vote_type' => false,
        ]);
    }

    public function test_can_change_vote_from_up_to_down(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 5,
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // First vote: thumbs up
        PhotoVote::factory()->forVisitor($fwbId)->thumbsUp()->create([
            'photo_submission_id' => $photo->id,
        ]);
        $photo->update(['rate' => 6]);

        // Change to thumbs down
        $response = $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'down']);

        $response->assertRedirect();

        $photo->refresh();
        $this->assertEquals(4, $photo->rate); // 6 - 2 = 4

        $this->assertDatabaseHas('photo_votes', [
            'photo_submission_id' => $photo->id,
            'fwb_id' => $fwbId,
            'vote_type' => false,
        ]);

        // Should only have one vote record
        $this->assertEquals(1, PhotoVote::where('photo_submission_id', $photo->id)
            ->where('fwb_id', $fwbId)
            ->count());
    }

    public function test_can_change_vote_from_down_to_up(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 5,
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // First vote: thumbs down
        PhotoVote::factory()->forVisitor($fwbId)->thumbsDown()->create([
            'photo_submission_id' => $photo->id,
        ]);
        $photo->update(['rate' => 4]);

        // Change to thumbs up
        $response = $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'up']);

        $response->assertRedirect();

        $photo->refresh();
        $this->assertEquals(6, $photo->rate); // 4 + 2 = 6

        $this->assertDatabaseHas('photo_votes', [
            'photo_submission_id' => $photo->id,
            'fwb_id' => $fwbId,
            'vote_type' => true,
        ]);

        // Should only have one vote record
        $this->assertEquals(1, PhotoVote::where('photo_submission_id', $photo->id)
            ->where('fwb_id', $fwbId)
            ->count());
    }

    public function test_same_vote_twice_does_not_change_rate(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 5,
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // First vote: thumbs up
        PhotoVote::factory()->forVisitor($fwbId)->thumbsUp()->create([
            'photo_submission_id' => $photo->id,
        ]);
        $photo->update(['rate' => 6]);

        // Same vote again
        $response = $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'up']);

        $response->assertRedirect();

        $photo->refresh();
        $this->assertEquals(6, $photo->rate); // No change

        // Should only have one vote record
        $this->assertEquals(1, PhotoVote::where('photo_submission_id', $photo->id)
            ->where('fwb_id', $fwbId)
            ->count());
    }

    public function test_rate_never_goes_below_zero(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 0,
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Try to vote down when rate is already 0
        $response = $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'down']);

        $response->assertRedirect();

        $photo->refresh();
        $this->assertEquals(0, $photo->rate); // Should not go negative
    }

    public function test_unique_constraint_prevents_duplicate_votes(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $fwbId = 'test-uuid-12345';

        // First vote
        PhotoVote::create([
            'photo_submission_id' => $photo->id,
            'fwb_id' => $fwbId,
            'vote_type' => true,
        ]);

        // Try to create duplicate vote directly
        $this->expectException(\Illuminate\Database\UniqueConstraintViolationException::class);

        PhotoVote::create([
            'photo_submission_id' => $photo->id,
            'fwb_id' => $fwbId,
            'vote_type' => false,
        ]);
    }

    // US4: Vote persistence tests

    public function test_votes_persist_across_sessions(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 0,
        ]);

        // First session: cast vote
        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'up']);

        // Simulate new session with same cookie
        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.show', $photo));

        $response->assertInertia(fn ($page) => $page
            ->where('userVote.vote_type', true)
        );
    }

    public function test_expired_cookie_allows_revoting(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
            'rate' => 1,
        ]);

        $oldFwbId = 'old-expired-uuid';

        // Old vote with expired cookie
        PhotoVote::factory()->forVisitor($oldFwbId)->thumbsUp()->create([
            'photo_submission_id' => $photo->id,
        ]);

        // New session without cookie (simulating expiration)
        $response = $this->get(route('gallery.show', $photo));
        $newFwbId = $response->getCookie('fwb_id')->getValue();

        $this->assertNotEquals($oldFwbId, $newFwbId);

        // Should be able to vote again
        $response = $this->withCookie('fwb_id', $newFwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'up']);

        $response->assertRedirect();

        // Should have two separate vote records
        $this->assertEquals(2, PhotoVote::where('photo_submission_id', $photo->id)->count());
    }
}
