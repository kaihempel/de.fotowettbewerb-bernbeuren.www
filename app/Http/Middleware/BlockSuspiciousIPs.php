<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class BlockSuspiciousIPs
{
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();

        // Check if IP is blocked
        if ($this->isBlocked($ip)) {
            abort(403, 'Access denied due to suspicious activity.');
        }

        return $next($request);
    }

    private function isBlocked(string $ip): bool
    {
        // Check cache for blocked IPs (can be set manually or automatically)
        return Cache::has("blocked-ip:{$ip}");
    }

    public static function blockIp(string $ip, int $hours = 24): void
    {
        Cache::put("blocked-ip:{$ip}", true, now()->addHours($hours));

        logger()->warning('IP blocked', [
            'ip' => $ip,
            'duration_hours' => $hours,
        ]);
    }
}
