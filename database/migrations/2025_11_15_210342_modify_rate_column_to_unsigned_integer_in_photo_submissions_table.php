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
            $table->unsignedInteger('rate')->default(0)->change();
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_submissions', function (Blueprint $table) {
            $table->decimal('rate', 3, 2)->nullable()->change();
            $table->dropIndex(['created_at']);
        });
    }
};
