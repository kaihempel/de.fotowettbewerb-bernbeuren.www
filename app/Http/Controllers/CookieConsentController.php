<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CookieConsentController extends Controller
{
    /**
     * Accept cookie consent and store in session.
     */
    public function accept(Request $request): JsonResponse
    {
        session(['cookies_accepted' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Cookie consent accepted',
        ]);
    }
}
