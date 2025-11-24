<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogPublicUploadAttempts
{
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $fwbId = $request->cookie('fwb_id');
        $userAgent = $request->userAgent();

        // Log upload attempt
        Log::channel('public_uploads')->info('Public upload attempt', [
            'ip' => $ip,
            'fwb_id' => $fwbId,
            'user_agent' => $userAgent,
            'file_size' => $request->file('photo')?->getSize(),
            'photographer_email' => $request->input('photographer_email'),
        ]);

        // Track failed CAPTCHA attempts
        $response = $next($request);

        if ($response->getStatusCode() === 302 && session()->has('errors')) {
            $errors = session()->get('errors');
            if ($errors->has('captcha_token')) {
                $this->trackFailedCaptcha($ip, $fwbId);
            }
        }

        return $response;
    }

    private function trackFailedCaptcha(string $ip, ?string $fwbId): void
    {
        $key = "failed-captcha:{$ip}";
        $count = Cache::increment($key);

        if ($count === 1) {
            Cache::put($key, 1, now()->addHour());
        }

        // Alert if too many failed CAPTCHAs (potential bot attack)
        if ($count >= 10) {
            Log::channel('security')->warning('Excessive failed CAPTCHA attempts', [
                'ip' => $ip,
                'fwb_id' => $fwbId,
                'count' => $count,
            ]);
        }
    }
}
