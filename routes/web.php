<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Public gallery routes (no authentication required)
Route::get('/', [App\Http\Controllers\PublicGalleryController::class, 'gallery'])->name('home');
Route::get('gallery', [App\Http\Controllers\PublicGalleryController::class, 'gallery'])->name('gallery');
Route::get('gallery/list', [App\Http\Controllers\PublicGalleryController::class, 'index'])->name('gallery.index');
Route::get('gallery/{photoSubmission}', [App\Http\Controllers\PublicGalleryController::class, 'show'])->name('gallery.show');
Route::post('gallery/{photoSubmission}/vote', [App\Http\Controllers\PublicGalleryController::class, 'vote'])
    ->middleware('throttle:votes')
    ->name('gallery.vote');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Photo submission routes
    Route::get('photos', [App\Http\Controllers\PhotoSubmissionController::class, 'index'])->name('photos.index');
    Route::get('photos/submissions', [App\Http\Controllers\PhotoSubmissionController::class, 'submissions'])->name('photos.submissions');
    Route::post('photos/upload', [App\Http\Controllers\PhotoSubmissionController::class, 'store'])->name('photos.upload');
    Route::get('photos/{submission}/download', [App\Http\Controllers\PhotoSubmissionController::class, 'download'])->name('photos.download');

    // Photo review dashboard routes (for reviewers/admins)
    Route::get('dashboard/photos', [App\Http\Controllers\PhotoSubmissionController::class, 'dashboard'])->name('photos.dashboard');
    Route::patch('photos/{submission}/approve', [App\Http\Controllers\PhotoSubmissionController::class, 'approve'])->name('photos.approve');
    Route::patch('photos/{submission}/decline', [App\Http\Controllers\PhotoSubmissionController::class, 'decline'])->name('photos.decline');
});


require __DIR__.'/settings.php';
