<?php

namespace Tests\Feature;

use App\Events\PhotoApproved;
use App\Events\PhotoDeclined;
use App\Models\AuditLog;
use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class PhotoSubmissionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthorized_user_cannot_access_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertRedirect(route('photos.submissions'));
    }

    public function test_reviewer_can_access_dashboard(): void
    {
        $reviewer = User::factory()->reviewer()->create();

        $response = $this->actingAs($reviewer)->get(route('dashboard'));

        $response->assertStatus(200);
    }

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('dashboard'));

        $response->assertStatus(200);
    }

    public function test_dashboard_paginates_results(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        PhotoSubmission::factory()->count(20)->create();

        $response = $this->actingAs($reviewer)->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('submissions.data', 15)
            ->has('submissions.links')
        );
    }

    public function test_filter_by_status_works_correctly(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        PhotoSubmission::factory()->pending()->count(5)->create();
        PhotoSubmission::factory()->approved()->count(3)->create();
        PhotoSubmission::factory()->declined()->count(2)->create();

        $response = $this->actingAs($reviewer)->get(route('dashboard').'?status=new');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('submissions.data', 5)
        );
    }

    public function test_approve_action_updates_status(): void
    {
        Event::fake();
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $response = $this->actingAs($reviewer)->patch("/photos/{$submission->id}/approve");

        $response->assertRedirect();
        $this->assertEquals('approved', $submission->fresh()->status);
        $this->assertEquals($reviewer->id, $submission->fresh()->reviewed_by);
        $this->assertNotNull($submission->fresh()->reviewed_at);
    }

    public function test_approve_fires_event(): void
    {
        Event::fake();
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->actingAs($reviewer)->patch("/photos/{$submission->id}/approve");

        Event::assertDispatched(PhotoApproved::class);
    }

    public function test_unauthorized_user_cannot_approve(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $submission = PhotoSubmission::factory()->pending()->create();

        $response = $this->actingAs($user)->patch("/photos/{$submission->id}/approve");

        $response->assertStatus(403);
        $this->assertEquals('new', $submission->fresh()->status);
    }

    public function test_decline_action_updates_status(): void
    {
        Event::fake();
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $response = $this->actingAs($reviewer)->patch("/photos/{$submission->id}/decline");

        $response->assertRedirect();
        $this->assertEquals('declined', $submission->fresh()->status);
        $this->assertEquals($reviewer->id, $submission->fresh()->reviewed_by);
        $this->assertNotNull($submission->fresh()->reviewed_at);
    }

    public function test_decline_fires_event(): void
    {
        Event::fake();
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->actingAs($reviewer)->patch("/photos/{$submission->id}/decline");

        Event::assertDispatched(PhotoDeclined::class);
    }

    public function test_unauthorized_user_cannot_decline(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $submission = PhotoSubmission::factory()->pending()->create();

        $response = $this->actingAs($user)->patch("/photos/{$submission->id}/decline");

        $response->assertStatus(403);
        $this->assertEquals('new', $submission->fresh()->status);
    }

    public function test_dashboard_loads_without_n_plus_one_queries(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        PhotoSubmission::factory()->count(10)->create();

        $this->actingAs($reviewer);

        // Initial query count baseline
        $this->resetQueryCount();

        $this->get('/dashboard/photos');

        // Should be <= 5 queries regardless of pagination size
        $queryCount = $this->getQueryCount();
        $this->assertLessThanOrEqual(5, $queryCount);
    }

    public function test_concurrent_review_handling_last_write_wins(): void
    {
        $reviewer1 = User::factory()->reviewer()->create(['name' => 'Reviewer One']);
        $reviewer2 = User::factory()->reviewer()->create(['name' => 'Reviewer Two']);
        $submission = PhotoSubmission::factory()->pending()->create();

        // First reviewer approves
        $this->actingAs($reviewer1)->patch("/photos/{$submission->id}/approve");

        // Second reviewer declines (last-write-wins)
        $this->actingAs($reviewer2)->patch("/photos/{$submission->id}/decline");

        $submission->refresh();
        $this->assertEquals('declined', $submission->status);
        $this->assertEquals($reviewer2->id, $submission->reviewed_by);

        // Both actions should be in audit log
        $this->assertEquals(2, AuditLog::where('auditable_id', $submission->id)->count());
    }

    protected function resetQueryCount(): void
    {
        \DB::enableQueryLog();
        \DB::flushQueryLog();
    }

    protected function getQueryCount(): int
    {
        return count(\DB::getQueryLog());
    }
}
