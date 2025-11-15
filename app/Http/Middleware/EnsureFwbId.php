<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureFwbId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->cookie('fwb_id')) {
            $fwbId = Str::uuid()->toString();
            cookie()->queue(cookie(
                name: 'fwb_id',
                value: $fwbId,
                minutes: 525600, // 1 year
                httpOnly: true,
                secure: config('app.env') === 'production',
                sameSite: 'lax'
            ));

            // Make the cookie available for this request
            $request->cookies->set('fwb_id', $fwbId);
        }

        return $next($request);
    }
}
