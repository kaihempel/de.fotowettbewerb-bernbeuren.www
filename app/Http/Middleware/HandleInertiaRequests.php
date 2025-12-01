<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Determine the current locale (priority: session > user preference > app default)
        $locale = $this->determineLocale($request);
        app()->setLocale($locale);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'is_reviewer' => $request->user()->isReviewer(),
                    'is_admin' => $request->user()->isAdmin(),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'fwb_id' => $request->cookie('fwb_id'),
            'hcaptcha_sitekey' => config('services.hcaptcha.site_key'),
            'locale' => $locale,
            'locales' => config('app.available_locales', ['de', 'en']),
            'cookies_accepted' => session('cookies_accepted', false),
        ];
    }

    /**
     * Determine the current locale for the request.
     *
     * Priority:
     * 1. Session locale (for both authenticated and guest users)
     * 2. User's stored preference (for authenticated users)
     * 3. Application default
     */
    private function determineLocale(Request $request): string
    {
        $availableLocales = config('app.available_locales', ['de', 'en']);
        $defaultLocale = config('app.locale', 'de');

        // Check session first (most recent explicit choice)
        $sessionLocale = session('locale');
        if ($sessionLocale && in_array($sessionLocale, $availableLocales)) {
            return $sessionLocale;
        }

        // Check authenticated user's stored preference
        if ($request->user() && $request->user()->locale && in_array($request->user()->locale, $availableLocales)) {
            // Also sync to session for consistency
            session(['locale' => $request->user()->locale]);

            return $request->user()->locale;
        }

        return $defaultLocale;
    }
}
