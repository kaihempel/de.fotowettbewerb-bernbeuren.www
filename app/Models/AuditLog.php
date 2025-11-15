<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    /** @use HasFactory<\Database\Factories\AuditLogFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'auditable_type',
        'auditable_id',
        'action_type',
        'user_id',
        'changes',
        'ip_address',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'changes' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the auditable model (polymorphic).
     */
    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who performed this action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if this is an approval action.
     */
    public function isApproval(): bool
    {
        return $this->action_type === 'approved';
    }

    /**
     * Check if this is a decline action.
     */
    public function isDecline(): bool
    {
        return $this->action_type === 'declined';
    }

    /**
     * Get a human-readable description of the change.
     */
    public function description(): string
    {
        $changes = $this->getAttribute('changes') ?? [];
        $from = $changes['from'] ?? 'unknown';
        $to = $changes['to'] ?? 'unknown';

        return "Changed from {$from} to {$to}";
    }
}
