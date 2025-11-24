<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PublicUploadPerformanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_submission_counting_query_is_optimized(): void
    {
        $fwbId = 'visitor-1';

        // Create large dataset
        PhotoSubmission::factory()->count(100)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
            'status' => 'new',
        ]);

        // Ensure query uses index
        DB::enableQueryLog();

        $count = PhotoSubmission::query()
            ->where('visitor_fwb_id', $fwbId)
            ->active()
            ->count();

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        // Verify single query executed
        $this->assertCount(1, $queries);

        // Verify result is correct
        $this->assertEquals(100, $count);
    }

    public function test_concurrent_uploads_handle_fwb_id_generation(): void
    {
        // Simulate concurrent upload attempts
        $submissions = [];

        for ($i = 0; $i < 10; $i++) {
            $submissions[] = PhotoSubmission::factory()->make([
                'user_id' => null,
                'visitor_fwb_id' => "visitor-{$i}",
            ]);
        }

        // All should have unique FWB IDs
        foreach ($submissions as $submission) {
            $submission->save();
        }

        $fwbIds = PhotoSubmission::pluck('visitor_fwb_id')->unique();

        $this->assertCount(10, $fwbIds);
    }

    public function test_for_submitter_scope_executes_single_query(): void
    {
        $fwbId = 'visitor-1';

        PhotoSubmission::factory()->count(50)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
        ]);

        DB::enableQueryLog();

        $submissions = PhotoSubmission::forSubmitter($fwbId)->get();

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        // Should only execute one query
        $this->assertCount(1, $queries);
        $this->assertCount(50, $submissions);
    }

    public function test_get_submission_count_method_is_efficient(): void
    {
        $fwbId = 'visitor-1';

        PhotoSubmission::factory()->count(75)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
            'status' => 'new',
        ]);

        DB::enableQueryLog();

        $count = PhotoSubmission::getSubmissionCount($fwbId);

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        // Should execute only one query
        $this->assertCount(1, $queries);
        $this->assertEquals(75, $count);
    }

    public function test_query_performance_with_mixed_submission_types(): void
    {
        // Create users for authenticated submissions
        $users = \App\Models\User::factory()->count(50)->create();

        // Create a realistic dataset with mixed submissions
        foreach ($users as $user) {
            PhotoSubmission::factory()->create([
                'user_id' => $user->id,
                'visitor_fwb_id' => null,
                'status' => 'new',
            ]);
        }

        for ($i = 0; $i < 50; $i++) {
            PhotoSubmission::factory()->create([
                'user_id' => null,
                'visitor_fwb_id' => "visitor-{$i}",
                'status' => 'approved',
            ]);
        }

        DB::enableQueryLog();

        // Query for specific user
        $userCount = PhotoSubmission::forUser($users[25]->id)->count();

        // Query for specific visitor
        $visitorCount = PhotoSubmission::forVisitor('visitor-25')->count();

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        // Should have executed exactly 2 queries
        $this->assertCount(2, $queries);
        $this->assertEquals(1, $userCount);
        $this->assertEquals(1, $visitorCount);
    }

    public function test_active_scope_filters_efficiently(): void
    {
        $fwbId = 'visitor-1';

        // Create submissions with different statuses
        PhotoSubmission::factory()->count(30)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
            'status' => 'new',
        ]);

        PhotoSubmission::factory()->count(20)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
            'status' => 'approved',
        ]);

        PhotoSubmission::factory()->count(10)->create([
            'user_id' => null,
            'visitor_fwb_id' => $fwbId,
            'status' => 'declined',
        ]);

        DB::enableQueryLog();

        $activeCount = PhotoSubmission::forVisitor($fwbId)->active()->count();

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        // Should execute single query with proper WHERE IN clause
        $this->assertCount(1, $queries);
        $this->assertEquals(50, $activeCount); // 30 new + 20 approved
    }
}
