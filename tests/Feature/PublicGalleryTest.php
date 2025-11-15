<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use App\Models\PhotoVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicGalleryTest extends TestCase
{
    use RefreshDatabase;

    // US1 & US4: Cookie generation and persistence tests

    public function test_fwb_id_cookie_generated_on_first_request(): void
    {
        $response = $this->get(route('gallery.index'));

        $response->assertCookie('fwb_id');
        $cookie = $response->getCookie('fwb_id');
        $this->assertNotEmpty($cookie->getValue());
        $this->assertEquals(525600, $cookie->getExpiresTime() > 0);
        $this->assertTrue($cookie->isHttpOnly());
        $this->assertEquals('lax', $cookie->getSameSite());
    }

    public function test_cookie_persists_across_requests(): void
    {
        $firstResponse = $this->get(route('gallery.index'));
        $fwbId = $firstResponse->getCookie('fwb_id')->getValue();

        $secondResponse = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.index'));

        $this->assertEquals($fwbId, $secondResponse->getCookie('fwb_id')->getValue());
    }

    public function test_cookie_expires_after_one_year(): void
    {
        $response = $this->get(route('gallery.index'));

        $cookie = $response->getCookie('fwb_id');
        $expiryTime = $cookie->getExpiresTime();
        $oneYearFromNow = now()->addYear()->timestamp;

        // Allow 60 seconds tolerance for test execution time
        $this->assertEqualsWithDelta($oneYearFromNow, $expiryTime, 60);
    }

    // US1: View approved photos

    public function test_can_view_approved_photo(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $response = $this->get(route('gallery.show', $photo));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Gallery')
            ->has('photo')
            ->where('photo.id', $photo->id)
        );
    }

    public function test_unapproved_photos_not_accessible(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'new',
        ]);

        $response = $this->get(route('gallery.show', $photo));

        $response->assertNotFound();
    }

    // US2: Navigation tests

    public function test_gallery_index_shows_first_unrated_photo(): void
    {
        $user = User::factory()->create();
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

        $response = $this->get(route('gallery.index'));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Vote on photo1
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo1->id,
            'vote_type' => true,
        ]);

        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.index'));

        $response->assertRedirect(route('gallery.show', $photo2));
    }

    public function test_next_button_navigates_to_next_unrated_photo(): void
    {
        $user = User::factory()->create();
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

        $response = $this->get(route('gallery.show', $photo1));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Vote on photo2
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo2->id,
            'vote_type' => true,
        ]);

        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.show', $photo1));

        $response->assertInertia(fn ($page) => $page
            ->where('nextPhoto.id', $photo3->id)
        );
    }

    public function test_previous_button_navigates_to_previous_rated_photo(): void
    {
        $user = User::factory()->create();
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

        $response = $this->get(route('gallery.show', $photo3));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Vote on photo1 and photo2
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo1->id,
            'vote_type' => true,
        ]);
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo2->id,
            'vote_type' => true,
        ]);

        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.show', $photo3));

        $response->assertInertia(fn ($page) => $page
            ->where('previousPhoto.id', $photo2->id)
        );
    }

    public function test_next_button_disabled_when_all_photos_rated(): void
    {
        $user = User::factory()->create();
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

        $response = $this->get(route('gallery.show', $photo1));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Vote on both photos
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo1->id,
            'vote_type' => true,
        ]);
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo2->id,
            'vote_type' => true,
        ]);

        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.show', $photo2));

        $response->assertInertia(fn ($page) => $page
            ->where('nextPhoto', null)
        );
    }

    public function test_previous_button_disabled_when_no_photos_rated_before_current(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $response = $this->get(route('gallery.show', $photo));

        $response->assertInertia(fn ($page) => $page
            ->where('previousPhoto', null)
        );
    }

    // US3: Progress tracking tests

    public function test_progress_indicator_shows_correct_counts(): void
    {
        $user = User::factory()->create();
        $photo1 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);
        $photo2 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);
        $photo3 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $response = $this->get(route('gallery.show', $photo1));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Vote on photo1
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo1->id,
            'vote_type' => true,
        ]);

        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.show', $photo2));

        $response->assertInertia(fn ($page) => $page
            ->where('progress.rated', 1)
            ->where('progress.total', 3)
        );
    }

    public function test_progress_updates_after_voting(): void
    {
        $user = User::factory()->create();
        $photo1 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);
        $photo2 = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $response = $this->get(route('gallery.show', $photo1));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Initially 0 votes
        $response->assertInertia(fn ($page) => $page
            ->where('progress.rated', 0)
            ->where('progress.total', 2)
        );

        // Vote on photo1
        $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo1), ['vote_type' => 'up']);

        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.show', $photo1));

        $response->assertInertia(fn ($page) => $page
            ->where('progress.rated', 1)
        );
    }

    public function test_completion_message_shown_when_all_rated(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Vote on the only photo
        PhotoVote::factory()->forVisitor($fwbId)->create([
            'photo_submission_id' => $photo->id,
            'vote_type' => true,
        ]);

        $response = $this->withCookie('fwb_id', $fwbId)->get(route('gallery.show', $photo));

        $response->assertInertia(fn ($page) => $page
            ->where('progress.rated', 1)
            ->where('progress.total', 1)
        );
    }

    public function test_can_still_navigate_and_vote_after_completion(): void
    {
        $user = User::factory()->create();
        $photo = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        $response = $this->get(route('gallery.show', $photo));
        $fwbId = $response->getCookie('fwb_id')->getValue();

        // Vote on the only photo
        PhotoVote::factory()->forVisitor($fwbId)->thumbsUp()->create([
            'photo_submission_id' => $photo->id,
        ]);

        // Should still be able to change vote
        $response = $this->withCookie('fwb_id', $fwbId)
            ->post(route('gallery.vote', $photo), ['vote_type' => 'down']);

        $response->assertRedirect();

        // Verify vote was changed
        $photo->refresh();
        $this->assertEquals(0, $photo->rate);
    }
}
