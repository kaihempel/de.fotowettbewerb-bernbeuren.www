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
        Schema::table('photo_submissions', function (Blueprint $table) {
            // Composite index for efficient gallery queries (approved photos, ordered by creation date)
            $table->index(['status', 'created_at'], 'photo_submissions_status_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            $table->dropIndex('photo_submissions_status_created_at_index');
        });
    }
};
