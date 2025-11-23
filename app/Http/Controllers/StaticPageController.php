<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    /**
     * Display the imprint (impressum) page.
     */
    public function imprint(): Response
    {
        return Inertia::render('imprint', [
            'title' => 'Impressum',
        ]);
    }

    /**
     * Display the about us page.
     */
    public function aboutUs(): Response
    {
        return Inertia::render('about-us', [
            'title' => 'Über uns',
        ]);
    }

    /**
     * Display the project page.
     */
    public function project(): Response
    {
        return Inertia::render('project', [
            'title' => 'Das Projekt',
        ]);
    }
}
