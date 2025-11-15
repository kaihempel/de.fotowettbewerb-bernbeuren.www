<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('photo_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('fwb_id', 20)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('original_filename', 255);
            $table->string('stored_filename', 255);
            $table->string('file_path', 500);
            $table->integer('file_size');
            $table->string('file_hash', 64)->nullable()->index();
            $table->string('mime_type', 50);
            $table->enum('status', ['new', 'approved', 'declined'])->default('new');
            $table->decimal('rate', 3, 2)->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Composite index for active submission counting
            $table->index(['user_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photo_submissions');
    }
};
