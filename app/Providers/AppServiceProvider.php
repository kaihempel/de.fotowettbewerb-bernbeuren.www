<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force URL scheme to match APP_URL in production/Docker environments
        if (config('app.env') !== 'local' || config('app.url')) {
            URL::forceScheme(parse_url(config('app.url'), PHP_URL_SCHEME) ?? 'http');
        }

        // Configure rate limiter for votes
        RateLimiter::for('votes', function (Request $request) {
            return Limit::perHour(60)->by($request->ip());
        });
    }
}
