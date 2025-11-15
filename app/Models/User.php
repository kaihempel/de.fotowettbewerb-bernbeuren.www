<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the photo submissions for the user.
     */
    public function photoSubmissions(): HasMany
    {
        return $this->hasMany(PhotoSubmission::class);
    }

    /**
     * Get the photo submissions reviewed by the user.
     */
    public function reviewedSubmissions(): HasMany
    {
        return $this->hasMany(PhotoSubmission::class, 'reviewed_by');
    }

    /**
     * Get the number of remaining submission slots (out of 3).
     */
    protected function remainingSubmissionSlots(): Attribute
    {
        return Attribute::make(
            get: fn () => 3 - $this->photoSubmissions()->active()->count()
        );
    }
}
