<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckHoneypot
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if honeypot field was filled (bots often fill all fields)
        if ($request->filled('website')) {
            logger()->warning('Honeypot triggered - potential bot submission', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'fwb_id' => $request->cookie('fwb_id'),
            ]);

            // Silently redirect without error (don't let bot know)
            return redirect()->back()
                ->with('success', 'Photo uploaded successfully!');
        }

        return $next($request);
    }
}
