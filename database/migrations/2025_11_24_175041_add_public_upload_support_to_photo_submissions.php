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
            // Make user_id nullable to support public uploads
            $table->foreignId('user_id')->nullable()->change();

            // Add visitor tracking for public submissions
            $table->string('visitor_fwb_id', 36)->nullable()->after('user_id');

            // Index for efficient public submission counting
            $table->index(['visitor_fwb_id', 'status']);
        });
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
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};
