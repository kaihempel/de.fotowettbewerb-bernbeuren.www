<?php

namespace Tests\Feature;

use App\Events\PhotoApproved;
use App\Events\PhotoDeclined;
use App\Listeners\LogPhotoReviewAction;
use App\Models\AuditLog;
use App\Models\PhotoSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_log_created_when_photo_approved(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $submission->approve($reviewer);

        $this->assertDatabaseHas('audit_logs', [
            'auditable_type' => PhotoSubmission::class,
            'auditable_id' => $submission->id,
            'action_type' => 'approved',
            'user_id' => $reviewer->id,
        ]);
    }

    public function test_audit_log_created_when_photo_declined(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $submission->decline($reviewer);

        $this->assertDatabaseHas('audit_logs', [
            'auditable_type' => PhotoSubmission::class,
            'auditable_id' => $submission->id,
            'action_type' => 'declined',
            'user_id' => $reviewer->id,
        ]);
    }

    public function test_audit_log_records_status_changes(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $submission->approve($reviewer);

        $log = AuditLog::where('auditable_id', $submission->id)->first();
        $this->assertEquals('new', $log->changes['from']);
        $this->assertEquals('approved', $log->changes['to']);
    }

    public function test_audit_log_records_previous_reviewer(): void
    {
        $reviewer1 = User::factory()->reviewer()->create(['name' => 'First Reviewer']);
        $reviewer2 = User::factory()->reviewer()->create(['name' => 'Second Reviewer']);
        $submission = PhotoSubmission::factory()->pending()->create();

        // First approval
        $submission->approve($reviewer1);

        // Second review (decline)
        $submission = $submission->fresh();
        $submission->decline($reviewer2);

        $logs = AuditLog::where('auditable_id', $submission->id)->orderBy('created_at')->get();
        $this->assertCount(2, $logs);

        // Second log should record previous reviewer
        $secondLog = $logs->last();
        $this->assertEquals('First Reviewer', $secondLog->changes['previous_reviewer']);
        $this->assertNotNull($secondLog->changes['previous_reviewed_at']);
    }

    public function test_listener_handles_photo_approved_event(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $event = new PhotoApproved($submission, $reviewer, 'new');
        $listener = new LogPhotoReviewAction;

        $listener->handle($event);

        $this->assertDatabaseHas('audit_logs', [
            'auditable_type' => PhotoSubmission::class,
            'auditable_id' => $submission->id,
            'action_type' => 'approved',
            'user_id' => $reviewer->id,
        ]);
    }

    public function test_listener_handles_photo_declined_event(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $event = new PhotoDeclined($submission, $reviewer, 'new');
        $listener = new LogPhotoReviewAction;

        $listener->handle($event);

        $this->assertDatabaseHas('audit_logs', [
            'auditable_type' => PhotoSubmission::class,
            'auditable_id' => $submission->id,
            'action_type' => 'declined',
            'user_id' => $reviewer->id,
        ]);
    }

    public function test_audit_log_description_method(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $submission->approve($reviewer);

        $log = AuditLog::where('auditable_id', $submission->id)->first();
        $this->assertEquals('Changed from new to approved', $log->description());
    }

    public function test_is_approval_method_returns_true_for_approved(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $submission->approve($reviewer);

        $log = AuditLog::where('auditable_id', $submission->id)->first();
        $this->assertTrue($log->isApproval());
        $this->assertFalse($log->isDecline());
    }

    public function test_is_decline_method_returns_true_for_declined(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $submission = PhotoSubmission::factory()->pending()->create();

        $submission->decline($reviewer);

        $log = AuditLog::where('auditable_id', $submission->id)->first();
        $this->assertTrue($log->isDecline());
        $this->assertFalse($log->isApproval());
    }
}
