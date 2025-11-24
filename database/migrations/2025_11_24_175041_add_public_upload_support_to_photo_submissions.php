<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            // SQLite doesn't support modifying foreign keys in place
            // So we need to check if the column exists before attempting changes
            if (! Schema::hasColumn('photo_submissions', 'visitor_fwb_id')) {
                // Add visitor tracking for public submissions
                $table->string('visitor_fwb_id', 36)->nullable()->after('user_id');

                // Index for efficient public submission counting
                $table->index(['visitor_fwb_id', 'status']);
            }
        });

        // For SQLite, we'll need to recreate the table to make user_id nullable
        // This is handled by doctrine/dbal for MySQL but SQLite needs special handling
        DB::statement('PRAGMA foreign_keys = OFF');

        // Get existing data
        $submissions = DB::table('photo_submissions')->get();

        // Drop and recreate with proper schema
        Schema::dropIfExists('photo_submissions');

        Schema::create('photo_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('fwb_id', 20)->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('visitor_fwb_id', 36)->nullable();
            $table->string('original_filename', 255);
            $table->string('stored_filename', 255);
            $table->string('file_path', 500);
            $table->string('thumbnail_path', 500)->nullable();
            $table->integer('file_size');
            $table->string('file_hash', 64)->nullable()->index();
            $table->string('mime_type', 50);
            $table->string('photographer_name', 255)->nullable();
            $table->string('photographer_email', 255)->nullable();
            $table->enum('status', ['new', 'approved', 'declined'])->default('new');
            $table->unsignedInteger('rate')->default(0);
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Composite indices
            $table->index(['user_id', 'status']);
            $table->index(['visitor_fwb_id', 'status']);
            $table->index('status');
            $table->index(['fwb_id', 'status']);
        });

        // Restore data
        foreach ($submissions as $submission) {
            DB::table('photo_submissions')->insert((array) $submission);
        }

        DB::statement('PRAGMA foreign_keys = ON');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            // Reverse changes - note: this will fail if null user_ids exist
            $table->dropIndex(['visitor_fwb_id', 'status']);
            $table->dropColumn('visitor_fwb_id');
            $table->foreignId('user_id')->nullable(false)->constrained()->onDelete('cascade')->change();
        });
    }
};
