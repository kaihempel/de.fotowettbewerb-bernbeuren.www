<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CaptchaService
{
    /**
     * Verify hCaptcha token with hCaptcha API.
     */
    public function verify(string $token, ?string $ip = null): bool
    {
        $response = Http::asForm()->post(config('services.hcaptcha.verify_url'), [
            'secret' => config('services.hcaptcha.secret_key'),
            'response' => $token,
            'remoteip' => $ip,
        ]);

        if (! $response->successful()) {
            return false;
        }

        $data = $response->json();

        return $data['success'] ?? false;
    }
}
