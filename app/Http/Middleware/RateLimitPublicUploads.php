<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RateLimitPublicUploads
{
    public function __construct(
        protected RateLimiter $limiter
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $fwbId = $request->cookie('fwb_id');
        $ip = $request->ip();

        // Combined key: cookie + IP for stronger rate limiting
        $key = "public-upload:{$fwbId}:{$ip}";

        // Hourly limit: 5 uploads
        $hourlyKey = "{$key}:hourly";
        if ($this->limiter->tooManyAttempts($hourlyKey, 5)) {
            $seconds = $this->limiter->availableIn($hourlyKey);

            return redirect()->back()
                ->withErrors(['photo' => "Too many uploads. Please try again in {$this->formatTime($seconds)}."]);
        }

        // Daily limit: 15 uploads
        $dailyKey = "{$key}:daily";
        if ($this->limiter->tooManyAttempts($dailyKey, 15)) {
            return redirect()->back()
                ->withErrors(['photo' => 'Daily upload limit reached. Please try again tomorrow.']);
        }

        // Increment counters
        $this->limiter->hit($hourlyKey, 3600); // 1 hour
        $this->limiter->hit($dailyKey, 86400); // 24 hours

        return $next($request);
    }

    private function formatTime(int $seconds): string
    {
        if ($seconds < 60) {
            return "{$seconds} seconds";
        }

        $minutes = ceil($seconds / 60);

        return "{$minutes} minutes";
    }
}
