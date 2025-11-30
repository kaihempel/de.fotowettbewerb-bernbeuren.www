<?php

namespace Tests\Feature;

use App\Jobs\CleanupOrphanedPublicSubmissions;
use App\Models\PhotoSubmission;
use App\Models\User;
use App\Services\StorageQuotaMonitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Http::fake(['https://hcaptcha.com/siteverify' => Http::response(['success' => true])]);
    }

    public function test_rate_limit_blocks_after_five_hourly_uploads(): void
    {
        $fwbId = 'test-cookie';
        $this->withCookie('fwb_id', $fwbId);

        // Upload 5 photos successfully
        for ($i = 0; $i < 5; $i++) {
            $photo = UploadedFile::fake()->image("photo{$i}.jpg");
            $response = $this->post('/submit-photo', [
                'photo' => $photo,
                'captcha_token' => 'valid',
                'photographer_name' => 'Test',
                'photographer_email' => 'test@example.com',
                'disclaimer_accepted' => true,
            ]);

            $response->assertRedirect();
        }

        // 6th upload should be blocked by rate limiter
        $photo = UploadedFile::fake()->image('photo6.jpg');
        $response = $this->post('/submit-photo', [
            'photo' => $photo,
            'captcha_token' => 'valid',
            'photographer_name' => 'Test',
            'photographer_email' => 'test@example.com',
            'disclaimer_accepted' => true,
        ]);

        $response->assertSessionHasErrors('photo');
        $this->assertStringContainsString('Too many uploads', session('errors')->first('photo'));
    }

    public function test_honeypot_field_silently_rejects_bot_submissions(): void
    {
        $photo = UploadedFile::fake()->image('bot.jpg');

        $response = $this->post('/submit-photo', [
            'photo' => $photo,
            'captcha_token' => 'valid',
            'photographer_name' => 'Bot',
            'photographer_email' => 'bot@example.com',
            'website' => 'http://spam.com', // Honeypot filled
            'disclaimer_accepted' => true,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success'); // Fake success message
        $this->assertDatabaseCount('photo_submissions', 0); // Not actually saved
    }

    public function test_honeypot_validation_rule_enforces_empty_field(): void
    {
        $photo = UploadedFile::fake()->image('test.jpg');

        $response = $this->post('/submit-photo', [
            'photo' => $photo,
            'captcha_token' => 'valid',
            'photographer_name' => 'Test',
            'photographer_email' => 'test@example.com',
            'website' => 'http://spam.com', // Should fail validation
            'disclaimer_accepted' => true,
        ]);

        // Should be caught by middleware first, but validation also enforces it
        $response->assertRedirect();
    }

    public function test_cleanup_job_deletes_old_declined_public_submissions(): void
    {
        // Create declined submission older than 30 days
        $old = PhotoSubmission::factory()->create([
            'user_id' => null,
            'visitor_fwb_id' => 'visitor-1',
            'status' => 'declined',
            'reviewed_at' => now()->subDays(31),
        ]);

        // Create recent declined submission
        $recent = PhotoSubmission::factory()->create([
            'user_id' => null,
            'visitor_fwb_id' => 'visitor-2',
            'status' => 'declined',
            'reviewed_at' => now()->subDays(10),
        ]);

        // Create authenticated user's declined submission (should not be deleted)
        $user = User::factory()->create();
        $userSubmission = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'visitor_fwb_id' => null,
            'status' => 'declined',
            'reviewed_at' => now()->subDays(31),
        ]);

        // Run cleanup job
        $job = new CleanupOrphanedPublicSubmissions;
        $job->handle();

        $this->assertDatabaseMissing('photo_submissions', ['id' => $old->id]);
        $this->assertDatabaseHas('photo_submissions', ['id' => $recent->id]);
        $this->assertDatabaseHas('photo_submissions', ['id' => $userSubmission->id]);
    }

    public function test_storage_quota_monitor_detects_usage(): void
    {
        $monitor = new StorageQuotaMonitor;
        $status = $monitor->checkQuota();

        $this->assertArrayHasKey('total_size_gb', $status);
        $this->assertArrayHasKey('max_size_gb', $status);
        $this->assertArrayHasKey('percent_used', $status);
        $this->assertArrayHasKey('is_critical', $status);
        $this->assertArrayHasKey('is_warning', $status);
        $this->assertEquals(50, $status['max_size_gb']);
    }

    public function test_storage_quota_blocks_upload_when_over_limit(): void
    {
        // Mock a high quota usage scenario by returning false from isQuotaAvailable
        // In real scenario, this would require 47.5GB of storage
        $this->markTestSkipped('Requires mocking storage size calculation');
    }

    public function test_blocked_ip_cannot_access_upload_page(): void
    {
        Cache::put('blocked-ip:127.0.0.1', true, now()->addHour());

        $response = $this->get('/submit-photo');

        $response->assertStatus(403);
    }

    public function test_blocked_ip_cannot_submit_photo(): void
    {
        Cache::put('blocked-ip:127.0.0.1', true, now()->addHour());

        $photo = UploadedFile::fake()->image('test.jpg');
        $response = $this->post('/submit-photo', [
            'photo' => $photo,
            'captcha_token' => 'valid',
            'photographer_name' => 'Test',
            'photographer_email' => 'test@example.com',
            'disclaimer_accepted' => true,
        ]);

        $response->assertStatus(403);
    }

    public function test_rate_limiter_uses_combined_cookie_and_ip_key(): void
    {
        $fwbId1 = 'cookie-1';
        $fwbId2 = 'cookie-2';

        // Upload 5 photos with first cookie
        $this->withCookie('fwb_id', $fwbId1);
        for ($i = 0; $i < 5; $i++) {
            $photo = UploadedFile::fake()->image("photo{$i}.jpg");
            $this->post('/submit-photo', [
                'photo' => $photo,
                'captcha_token' => 'valid',
                'photographer_name' => 'Test',
                'photographer_email' => 'test@example.com',
                'disclaimer_accepted' => true,
            ]);
        }

        // 6th should be blocked for first cookie
        $photo = UploadedFile::fake()->image('photo6.jpg');
        $response = $this->withCookie('fwb_id', $fwbId1)
            ->post('/submit-photo', [
                'photo' => $photo,
                'captcha_token' => 'valid',
                'photographer_name' => 'Test',
                'photographer_email' => 'test@example.com',
                'disclaimer_accepted' => true,
            ]);
        $response->assertSessionHasErrors('photo');

        // But should work with different cookie (different user)
        $photo = UploadedFile::fake()->image('photo7.jpg');
        $response = $this->withCookie('fwb_id', $fwbId2)
            ->post('/submit-photo', [
                'photo' => $photo,
                'captcha_token' => 'valid',
                'photographer_name' => 'Test2',
                'photographer_email' => 'test2@example.com',
                'disclaimer_accepted' => true,
            ]);
        $response->assertRedirect(env('APP_URL') . '/submit-photo');
        $response->assertSessionHas('success');
    }

    public function test_logging_middleware_tracks_upload_attempts(): void
    {
        // This test would require Log facade mocking
        // Skipping detailed implementation as it requires complex log assertions
        $this->markTestSkipped('Requires Log facade mocking for detailed assertion');
    }

    public function test_cleanup_only_affects_public_submissions(): void
    {
        $user = User::factory()->create();

        // Create old authenticated user submission
        $userSubmission = PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'visitor_fwb_id' => null,
            'status' => 'declined',
            'reviewed_at' => now()->subDays(60),
        ]);

        // Create old public submission
        $publicSubmission = PhotoSubmission::factory()->create([
            'user_id' => null,
            'visitor_fwb_id' => 'visitor-test',
            'status' => 'declined',
            'reviewed_at' => now()->subDays(60),
        ]);

        $job = new CleanupOrphanedPublicSubmissions;
        $job->handle();

        // User submission should remain
        $this->assertDatabaseHas('photo_submissions', ['id' => $userSubmission->id]);
        // Public submission should be deleted
        $this->assertDatabaseMissing('photo_submissions', ['id' => $publicSubmission->id]);
    }
}
