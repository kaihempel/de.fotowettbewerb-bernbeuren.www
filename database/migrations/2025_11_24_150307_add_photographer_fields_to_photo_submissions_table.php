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
            $table->string('photographer_name', 255)->nullable()->after('mime_type');
            $table->string('photographer_email', 255)->nullable()->after('photographer_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            $table->dropColumn(['photographer_name', 'photographer_email']);
        });
    }
};
