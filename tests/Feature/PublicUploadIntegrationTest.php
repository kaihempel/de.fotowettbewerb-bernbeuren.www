<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicUploadIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Http::fake(['hcaptcha.com/*' => Http::response(['success' => true])]);
    }

    public function test_authenticated_and_public_uploads_tracked_separately(): void
    {
        $user = User::factory()->create();
        $fwbId = 'visitor-cookie';

        // User uploads 3 photos while authenticated
        $this->actingAs($user);
        for ($i = 0; $i < 3; $i++) {
            $photo = UploadedFile::fake()->image("auth{$i}.jpg");
            $this->post('/photos/upload', [
                'photo' => $photo,
                'photographer_name' => 'User',
                'photographer_email' => 'user@example.com',
            ]);
        }

        // Same person uploads 3 more as public visitor (different limit)
        auth()->logout();
        $this->withCookie('fwb_id', $fwbId);

        for ($i = 0; $i < 3; $i++) {
            $photo = UploadedFile::fake()->image("public{$i}.jpg");
            $response = $this->post('/submit-photo', [
                'photo' => $photo,
                'captcha_token' => 'valid',
                'photographer_name' => 'Public',
                'photographer_email' => 'public@example.com',
            ]);
            $response->assertRedirect();
        }

        // Verify 6 total submissions: 3 authenticated + 3 public
        $this->assertDatabaseCount('photo_submissions', 6);

        // Verify user submissions
        $this->assertEquals(3, PhotoSubmission::forUser($user->id)->count());

        // Verify public submissions
        $this->assertEquals(3, PhotoSubmission::forVisitor($fwbId)->count());
    }

    public function test_duplicate_detection_works_across_submission_types(): void
    {
        $this->markTestSkipped('Duplicate detection feature requires hash implementation');
    }

    public function test_admin_can_review_both_authenticated_and_public_submissions(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create mixed submissions
        PhotoSubmission::factory()->count(2)->create([
            'user_id' => User::factory(),
            'visitor_fwb_id' => null,
            'status' => 'new',
        ]);

        PhotoSubmission::factory()->count(3)->create([
            'user_id' => null,
            'visitor_fwb_id' => 'visitor-1',
            'status' => 'new',
        ]);

        // Admin views dashboard
        $this->actingAs($admin);
        $response = $this->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('dashboard')
            ->has('submissions.data', 5)
        );
    }

    public function test_photo_approval_works_for_public_submissions(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $submission = PhotoSubmission::factory()->create([
            'user_id' => null,
            'visitor_fwb_id' => 'visitor-1',
            'status' => 'new',
        ]);

        $this->actingAs($admin);
        $response = $this->patch("/photos/{$submission->id}/approve");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $submission->refresh();
        $this->assertEquals('approved', $submission->status);
        $this->assertEquals($admin->id, $submission->reviewed_by);
    }

    public function test_public_voting_works_with_approved_public_submissions(): void
    {
        $this->markTestSkipped('Voting route implementation pending');
    }

    public function test_submission_type_helper_methods_work_correctly(): void
    {
        $authenticatedSubmission = PhotoSubmission::factory()->create([
            'user_id' => User::factory(),
            'visitor_fwb_id' => null,
        ]);

        $publicSubmission = PhotoSubmission::factory()->create([
            'user_id' => null,
            'visitor_fwb_id' => 'visitor-1',
        ]);

        $this->assertTrue($authenticatedSubmission->isAuthenticatedSubmission());
        $this->assertFalse($authenticatedSubmission->isPublicSubmission());

        $this->assertFalse($publicSubmission->isAuthenticatedSubmission());
        $this->assertTrue($publicSubmission->isPublicSubmission());
    }

    public function test_submission_count_methods_work_for_both_types(): void
    {
        $user = User::factory()->create();
        $fwbId = 'visitor-1';

        // Create authenticated submissions
        PhotoSubmission::factory()->count(2)->create([
            'user_id' => $user->id,
            'visitor_fwb_id' => null,
            'status' => 'new',
        ]);

        // Create public submissions
        PhotoSubmission::factory()->count(3)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
            'status' => 'approved',
        ]);

        // Test user count
        $this->assertEquals(2, PhotoSubmission::getSubmissionCount($user->id));
        $this->assertEquals(1, PhotoSubmission::getRemainingSlots($user->id));

        // Test visitor count
        $this->assertEquals(3, PhotoSubmission::getSubmissionCount($fwbId));
        $this->assertEquals(0, PhotoSubmission::getRemainingSlots($fwbId));
    }

    public function test_for_submitter_scope_works_with_both_types(): void
    {
        $user = User::factory()->create();
        $fwbId = 'visitor-1';

        // Create submissions
        PhotoSubmission::factory()->count(2)->create([
            'user_id' => $user->id,
            'visitor_fwb_id' => null,
        ]);

        PhotoSubmission::factory()->count(3)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
        ]);

        // Test scope with user ID (int)
        $userSubmissions = PhotoSubmission::forSubmitter($user->id)->get();
        $this->assertCount(2, $userSubmissions);

        // Test scope with visitor FWB ID (string)
        $visitorSubmissions = PhotoSubmission::forSubmitter($fwbId)->get();
        $this->assertCount(3, $visitorSubmissions);
    }
}
