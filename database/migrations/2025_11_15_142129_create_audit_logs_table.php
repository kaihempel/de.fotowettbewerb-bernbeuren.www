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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Polymorphic relationship
            $table->string('auditable_type', 255);
            $table->unsignedBigInteger('auditable_id');

            // Action type
            $table->enum('action_type', ['approved', 'declined']);

            // Reviewer information
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('restrict');

            // Change tracking
            $table->json('changes');

            // Request context
            $table->ipAddress('ip_address')->nullable();

            // Timestamps
            $table->timestamps();

            // Indexes for query performance
            $table->index(['auditable_type', 'auditable_id']);
            $table->index('user_id');
            $table->index('action_type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
