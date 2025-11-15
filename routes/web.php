<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Photo submission routes
    Route::get('photos', [App\Http\Controllers\PhotoSubmissionController::class, 'index'])->name('photos.index');
    Route::get('photos/submissions', [App\Http\Controllers\PhotoSubmissionController::class, 'submissions'])->name('photos.submissions');
    Route::post('photos/upload', [App\Http\Controllers\PhotoSubmissionController::class, 'store'])->name('photos.upload');
    Route::get('photos/{submission}/download', [App\Http\Controllers\PhotoSubmissionController::class, 'download'])->name('photos.download');
});

require __DIR__.'/settings.php';
