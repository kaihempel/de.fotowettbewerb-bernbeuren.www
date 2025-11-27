<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLocaleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;

class LocaleController extends Controller
{
    /**
     * Update the user's locale preference.
     *
     * For authenticated users, the locale is persisted to the database.
     * For all users, the locale is stored in the session.
     */
    public function update(UpdateLocaleRequest $request): RedirectResponse
    {
        $locale = $request->validated('locale');

        // Set the application locale
        App::setLocale($locale);

        // Store in session for current request and subsequent requests
        session(['locale' => $locale]);

        // For authenticated users, persist to database
        if ($request->user()) {
            $request->user()->update(['locale' => $locale]);
        }

        return back();
    }
}
