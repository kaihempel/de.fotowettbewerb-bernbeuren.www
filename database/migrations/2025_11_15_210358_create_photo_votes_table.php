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
        Schema::create('photo_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photo_submission_id')
                ->constrained('photo_submissions')
                ->onDelete('cascade');
            $table->string('fwb_id', 36);
            $table->boolean('vote_type');
            $table->timestamps();

            // Unique constraint: one vote per photo per visitor
            $table->unique(['photo_submission_id', 'fwb_id'], 'unique_vote_per_photo');

            // Index for finding all votes by visitor
            $table->index('fwb_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photo_votes');
    }
};
