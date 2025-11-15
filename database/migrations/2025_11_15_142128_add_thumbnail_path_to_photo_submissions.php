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
            $table->string('thumbnail_path', 500)
                ->nullable()
                ->after('file_path')
                ->comment('Path to thumbnail image (400-600px width)');

            // Index for thumbnail queries
            $table->index('thumbnail_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            $table->dropIndex(['thumbnail_path']);
            $table->dropColumn('thumbnail_path');
        });
    }
};
