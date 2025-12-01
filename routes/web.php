<?php

use App\Http\Controllers\CookieConsentController;
use App\Http\Controllers\LocaleController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// Cookie consent (available to all users)
Route::post('cookie-consent/accept', [CookieConsentController::class, 'accept'])->name('cookie-consent.accept');

// Locale switching (available to all users)
Route::post('locale', [LocaleController::class, 'update'])->name('locale.update');

// Public gallery routes (no authentication required)
Route::get('/', [App\Http\Controllers\PublicGalleryController::class, 'gallery'])->name('home');
Route::get('gallery', [App\Http\Controllers\PublicGalleryController::class, 'gallery'])->name('gallery');
Route::get('gallery/list', [App\Http\Controllers\PublicGalleryController::class, 'index'])->name('gallery.index');
Route::get('gallery/{photoSubmission}', [App\Http\Controllers\PublicGalleryController::class, 'show'])->name('gallery.show');
Route::post('gallery/{photoSubmission}/vote', [App\Http\Controllers\PublicGalleryController::class, 'vote'])
    ->middleware('throttle:votes')
    ->name('gallery.vote');

// Static content pages
Route::get('impressum', [App\Http\Controllers\StaticPageController::class, 'imprint'])->name('imprint');
Route::get('about-us', [App\Http\Controllers\StaticPageController::class, 'aboutUs'])->name('about-us');
Route::get('project', [App\Http\Controllers\StaticPageController::class, 'project'])->name('project');

// Public photo submission (no authentication required)
Route::middleware([
    \App\Http\Middleware\EnsureFwbId::class,
    \App\Http\Middleware\BlockSuspiciousIPs::class,
])->group(function () {
    Route::get('submit-photo', [App\Http\Controllers\PublicPhotoController::class, 'index'])
        ->name('public.photos.index');

    Route::post('submit-photo', [App\Http\Controllers\PublicPhotoController::class, 'store'])
        ->name('public.photos.store')
        ->middleware([
            \App\Http\Middleware\CheckHoneypot::class,
            \App\Http\Middleware\LogPublicUploadAttempts::class,
            \App\Http\Middleware\RateLimitPublicUploads::class,
        ]);
});

// Serve public storage files (for approved photos and thumbnails)
Route::get('storage/{path}', function (string $path) {
    $disk = Storage::disk('public');

    if (! $disk->exists($path)) {
        abort(404);
    }

    // Stream large files efficiently to prevent buffering issues
    return response()->stream(function () use ($disk, $path) {
        $stream = $disk->readStream($path);
        if ($stream === false) {
            abort(500, 'Failed to read file');
        }

        fpassthru($stream);

        if (is_resource($stream)) {
            fclose($stream);
        }
    }, 200, [
        'Content-Type' => $disk->mimeType($path),
        'Content-Length' => $disk->size($path),
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*')->name('storage.public');

Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard route - shows photo review dashboard
    Route::get('dashboard', [App\Http\Controllers\PhotoSubmissionController::class, 'dashboard'])->name('dashboard');

    // Photo submission routes
    Route::get('photos/submissions', [App\Http\Controllers\PhotoSubmissionController::class, 'submissions'])->name('photos.submissions');
    Route::get('photos/{submission}/download', [App\Http\Controllers\PhotoSubmissionController::class, 'download'])->name('photos.download');

    // Photo review actions (for reviewers/admins)
    Route::patch('photos/{submission}/approve', [App\Http\Controllers\PhotoSubmissionController::class, 'approve'])->name('photos.approve');
    Route::patch('photos/{submission}/decline', [App\Http\Controllers\PhotoSubmissionController::class, 'decline'])->name('photos.decline');
});

require __DIR__.'/settings.php';
