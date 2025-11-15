<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PhotoSubmissionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test authenticated user can access upload page.
     */
    public function test_authenticated_user_can_access_upload_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('photos.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('PhotoUpload', false)
            ->has('submissions')
            ->has('remainingSlots')
        );
    }

    /**
     * Test unauthenticated user cannot access upload page.
     */
    public function test_unauthenticated_user_cannot_access_upload_page(): void
    {
        $response = $this->get(route('photos.index'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test user can upload valid photo.
     */
    public function test_user_can_upload_valid_photo(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $photo = UploadedFile::fake()->image('test-photo.jpg', 800, 600)->size(5000);

        $response = $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $photo,
        ]);

        $response->assertRedirect(route('photos.index'));
        $response->assertSessionHas('success', 'Photo uploaded successfully!');

        $this->assertDatabaseHas('photo_submissions', [
            'user_id' => $user->id,
            'original_filename' => 'test-photo.jpg',
            'status' => 'new',
        ]);

        $submission = PhotoSubmission::first();
        Storage::disk('local')->assertExists($submission->file_path);
    }

    /**
     * Test upload stores photo with correct metadata.
     */
    public function test_upload_stores_photo_with_correct_metadata(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $photo = UploadedFile::fake()->image('sunset.jpg', 1920, 1080)->size(8000);

        $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $photo,
        ]);

        $submission = PhotoSubmission::first();

        $this->assertNotNull($submission->fwb_id);
        $this->assertMatchesRegularExpression('/^FWB-\d{4}-\d{5}$/', $submission->fwb_id);
        $this->assertEquals($user->id, $submission->user_id);
        $this->assertEquals('sunset.jpg', $submission->original_filename);
        $this->assertNotNull($submission->stored_filename);
        $this->assertNotNull($submission->file_path);
        $this->assertGreaterThan(0, $submission->file_size);
        $this->assertNotNull($submission->file_hash);
        $this->assertEquals('image/jpeg', $submission->mime_type);
        $this->assertEquals('new', $submission->status);
        $this->assertNotNull($submission->submitted_at);
        $this->assertNull($submission->reviewed_at);
        $this->assertNull($submission->reviewed_by);
    }

    /**
     * Test user cannot upload more than three active submissions.
     */
    public function test_user_cannot_upload_more_than_three_active_submissions(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        // Create 3 active submissions (2 new, 1 approved)
        PhotoSubmission::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'new']);
        PhotoSubmission::factory()->approved()->create(['user_id' => $user->id]);

        $photo = UploadedFile::fake()->image('fourth.jpg');

        $response = $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $photo,
        ]);

        $response->assertSessionHasErrors(['photo']);
        $response->assertSessionHasErrors(['photo' => 'You have reached the maximum of 3 submissions.']);
    }

    /**
     * Test declined submissions do not count toward limit.
     */
    public function test_declined_submissions_do_not_count_toward_limit(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        // Create 2 active submissions and 1 declined
        PhotoSubmission::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'new']);
        PhotoSubmission::factory()->declined()->create(['user_id' => $user->id]);

        $photo = UploadedFile::fake()->image('fourth.jpg');

        $response = $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $photo,
        ]);

        $response->assertRedirect(route('photos.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseCount('photo_submissions', 4);
    }

    /**
     * Test FWB ID is generated correctly.
     */
    public function test_fwb_id_is_generated_correctly(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $photo1 = UploadedFile::fake()->image('photo1.jpg');
        $this->actingAs($user)->post(route('photos.upload'), ['photo' => $photo1]);

        $submission1 = PhotoSubmission::first();
        $currentYear = now()->year;

        $this->assertEquals("FWB-{$currentYear}-00001", $submission1->fwb_id);

        // Upload another photo
        $photo2 = UploadedFile::fake()->image('photo2.jpg');
        $this->actingAs($user)->post(route('photos.upload'), ['photo' => $photo2]);

        $submission2 = PhotoSubmission::orderBy('id', 'desc')->first();
        $this->assertEquals("FWB-{$currentYear}-00002", $submission2->fwb_id);
    }

    /**
     * Test upload rejects invalid file type.
     */
    public function test_upload_rejects_invalid_file_type(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('document.pdf', 1000, 'application/pdf');

        $response = $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $file,
        ]);

        $response->assertSessionHasErrors(['photo']);
        $this->assertDatabaseCount('photo_submissions', 0);
    }

    /**
     * Test upload rejects oversized file.
     */
    public function test_upload_rejects_oversized_file(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        // Create a file larger than 15MB (15360 KB)
        $photo = UploadedFile::fake()->image('huge.jpg')->size(20000);

        $response = $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $photo,
        ]);

        $response->assertSessionHasErrors(['photo']);
        $this->assertDatabaseCount('photo_submissions', 0);
    }

    /**
     * Test cannot submit without file selected.
     */
    public function test_cannot_submit_without_file_selected(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('photos.upload'), []);

        $response->assertSessionHasErrors(['photo']);
        $this->assertDatabaseCount('photo_submissions', 0);
    }

    /**
     * Test duplicate photo shows warning but allows upload.
     */
    public function test_duplicate_photo_shows_warning_but_allows_upload(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $photo = UploadedFile::fake()->image('original.jpg', 800, 600)->size(5000);
        $photoContent = file_get_contents($photo->getRealPath());
        $fileHash = hash('sha256', $photoContent);

        // Create existing submission with same hash
        PhotoSubmission::factory()->create([
            'user_id' => $user->id,
            'file_hash' => $fileHash,
        ]);

        // Try to upload same photo again
        $photoDuplicate = UploadedFile::fake()->image('original.jpg', 800, 600)->size(5000);

        $response = $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $photoDuplicate,
        ]);

        $response->assertRedirect(route('photos.index'));
        $response->assertSessionHas('success');
        $response->assertSessionHas('warning', 'This photo may already be uploaded.');
        $this->assertDatabaseCount('photo_submissions', 2);
    }

    /**
     * Test MIME type validated server-side (attempt spoofed mime type).
     */
    public function test_mime_type_validated_server_side(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        // Create a fake text file disguised as an image
        $fakeImage = UploadedFile::fake()->create('malicious.jpg', 100, 'text/plain');

        $response = $this->actingAs($user)->post(route('photos.upload'), [
            'photo' => $fakeImage,
        ]);

        // Should reject due to magic bytes validation
        $response->assertSessionHasErrors(['photo']);
        $this->assertDatabaseCount('photo_submissions', 0);
    }

    /**
     * Test user can view their submissions list.
     */
    public function test_user_can_view_their_submissions_list(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        PhotoSubmission::factory()->count(3)->create(['user_id' => $user->id]);
        PhotoSubmission::factory()->count(2)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get(route('photos.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('PhotoUpload', false)
            ->has('submissions.data', 3)
        );
    }

    /**
     * Test remaining slots calculated correctly.
     */
    public function test_remaining_slots_calculated_correctly(): void
    {
        $user = User::factory()->create();

        // 2 approved + 1 declined = 1 slot remaining
        PhotoSubmission::factory()->approved()->count(2)->create(['user_id' => $user->id]);
        PhotoSubmission::factory()->declined()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('photos.index'));

        $response->assertInertia(fn ($page) => $page
            ->where('remainingSlots', 1)
        );
    }

    /**
     * Test user can download their own submission.
     */
    public function test_user_can_download_their_own_submission(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $photo = UploadedFile::fake()->image('download-test.jpg');
        $this->actingAs($user)->post(route('photos.upload'), ['photo' => $photo]);

        $submission = PhotoSubmission::first();

        $response = $this->actingAs($user)->get(route('photos.download', $submission));

        $response->assertStatus(200);
        $response->assertDownload($submission->original_filename);
    }

    /**
     * Test user cannot download others submissions.
     */
    public function test_user_cannot_download_others_submissions(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $submission = PhotoSubmission::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get(route('photos.download', $submission));

        $response->assertStatus(403);
    }

    /**
     * Test user can download approved submissions from others.
     */
    public function test_user_can_download_approved_submissions_from_others(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $submission = PhotoSubmission::factory()->approved()->create(['user_id' => $otherUser->id]);
        Storage::put($submission->file_path, 'fake content');

        $response = $this->actingAs($user)->get(route('photos.download', $submission));

        $response->assertStatus(200);
    }

    /**
     * Test photo submission has correct relationships.
     */
    public function test_photo_submission_has_correct_relationships(): void
    {
        $user = User::factory()->create();
        $reviewer = User::factory()->create();

        $submission = PhotoSubmission::factory()->approved()->create([
            'user_id' => $user->id,
            'reviewed_by' => $reviewer->id,
        ]);

        $this->assertEquals($user->id, $submission->user->id);
        $this->assertEquals($reviewer->id, $submission->reviewer->id);
    }

    /**
     * Test active scope returns only new and approved submissions.
     */
    public function test_active_scope_returns_only_new_and_approved_submissions(): void
    {
        $user = User::factory()->create();

        PhotoSubmission::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'new']);
        PhotoSubmission::factory()->approved()->count(2)->create(['user_id' => $user->id]);
        PhotoSubmission::factory()->declined()->count(3)->create(['user_id' => $user->id]);

        $activeCount = PhotoSubmission::active()->count();

        $this->assertEquals(4, $activeCount);
    }

    /**
     * Test for user scope filters by user.
     */
    public function test_for_user_scope_filters_by_user(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        PhotoSubmission::factory()->count(3)->create(['user_id' => $user1->id]);
        PhotoSubmission::factory()->count(2)->create(['user_id' => $user2->id]);

        $user1Submissions = PhotoSubmission::forUser($user1->id)->count();
        $user2Submissions = PhotoSubmission::forUser($user2->id)->count();

        $this->assertEquals(3, $user1Submissions);
        $this->assertEquals(2, $user2Submissions);
    }

    /**
     * Test file URL accessor generates correct route.
     */
    public function test_file_url_accessor_generates_correct_route(): void
    {
        $submission = PhotoSubmission::factory()->create();

        $expectedUrl = route('photos.download', $submission->id);

        $this->assertEquals($expectedUrl, $submission->file_url);
    }
}
