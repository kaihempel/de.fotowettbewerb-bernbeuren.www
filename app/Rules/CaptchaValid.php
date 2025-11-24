<?php

namespace App\Rules;

use App\Services\CaptchaService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CaptchaValid implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $captcha = app(CaptchaService::class);

        if (! $captcha->verify($value, request()->ip())) {
            $fail('The CAPTCHA verification failed. Please try again.');
        }
    }
}
