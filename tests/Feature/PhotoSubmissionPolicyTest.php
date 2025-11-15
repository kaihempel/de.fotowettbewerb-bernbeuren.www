<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhotoSubmissionPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_user_cannot_view_any_submissions(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->assertFalse($user->can('viewAny', PhotoSubmission::class));
    }

    public function test_reviewer_can_view_any_submissions(): void
    {
        $reviewer = User::factory()->reviewer()->create();

        $this->assertTrue($reviewer->can('viewAny', PhotoSubmission::class));
    }

    public function test_admin_can_view_any_submissions(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue($admin->can('viewAny', PhotoSubmission::class));
    }

    public function test_reviewer_can_approve_submission(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->assertTrue($reviewer->can('approve', $submission));
    }

    public function test_regular_user_cannot_approve_submission(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->assertFalse($user->can('approve', $submission));
    }

    public function test_reviewer_can_decline_submission(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->assertTrue($reviewer->can('decline', $submission));
    }

    public function test_regular_user_cannot_decline_submission(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->assertFalse($user->can('decline', $submission));
    }

    public function test_admin_can_approve_submission(): void
    {
        $admin = User::factory()->admin()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->assertTrue($admin->can('approve', $submission));
    }

    public function test_admin_can_decline_submission(): void
    {
        $admin = User::factory()->admin()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $this->assertTrue($admin->can('decline', $submission));
    }
}
