<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PublicUploadSchemaMigrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that user_id is nullable and visitor_fwb_id can be set.
     */
    public function test_user_id_is_nullable_and_visitor_fwb_id_can_be_set(): void
    {
        // Create submission without user_id but with visitor_fwb_id
        $visitorId = Str::uuid()->toString();
        $submission = PhotoSubmission::factory()->create([
            'user_id' => null,
            'visitor_fwb_id' => $visitorId,
        ]);

        $this->assertNull($submission->user_id);
        $this->assertNotNull($submission->visitor_fwb_id);
        $this->assertEquals($visitorId, $submission->visitor_fwb_id);
    }

    /**
     * Test that authenticated submissions can have user_id without visitor_fwb_id.
     */
    public function test_authenticated_submission_has_user_id(): void
    {
        $submission = PhotoSubmission::factory()->create([
            'visitor_fwb_id' => null,
        ]);

        $this->assertNotNull($submission->user_id);
        $this->assertNull($submission->visitor_fwb_id);
    }

    /**
     * Test that visitor_fwb_id is in the fillable array.
     */
    public function test_visitor_fwb_id_is_fillable(): void
    {
        $fillable = (new PhotoSubmission)->getFillable();

        $this->assertContains('visitor_fwb_id', $fillable);
    }
}
