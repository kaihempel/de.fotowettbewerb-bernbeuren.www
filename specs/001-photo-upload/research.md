# Research: High-Quality Photo Upload System

**Phase**: 0 (Outline & Research)
**Date**: 2025-11-15
**Feature**: Photo Upload System

## Overview

This document consolidates research findings for implementing the photo upload feature, focusing on Laravel file upload best practices, EXIF handling, file validation, and React drag-and-drop patterns.

## Research Areas

### 1. Laravel File Upload Best Practices

**Decision**: Use Laravel's `UploadedFile` validation with strict MIME type checking and file content validation.

**Rationale**:
- Laravel provides built-in validation rules (`file`, `mimes`, `max`) that handle both extension and MIME type checking
- The `UploadedFile` class offers methods like `store()`, `storeAs()`, and `hashName()` for secure storage
- Stream-based handling prevents memory exhaustion with large files
- Integration with filesystem disks allows easy migration from local to cloud storage

**Implementation Approach**:
```php
// In PhotoSubmissionRequest
'photo' => [
    'required',
    'file',
    'mimes:jpg,jpeg,png,heic',
    'max:15360', // 15MB in kilobytes
]

// In PhotoSubmissionController
$path = $request->file('photo')->store('photo-submissions/new', 'local');
```

**Alternatives Considered**:
- **Manual file handling with `move_uploaded_file()`**: Rejected because Laravel's abstraction provides better security, validation, and testability
- **Direct S3 upload from frontend**: Rejected for initial version to maintain server-side validation control; can be added as optimization later

**References**:
- Laravel 12 File Storage: https://laravel.com/docs/12.x/filesystem
- Laravel Validation (File Rules): https://laravel.com/docs/12.x/validation#available-validation-rules

---

### 2. EXIF Orientation Correction

**Decision**: Use Intervention Image v3 for EXIF orientation correction without quality loss.

**Rationale**:
- Intervention Image is the de facto standard for image manipulation in Laravel
- Version 3 supports PHP 8.4 and provides driver abstraction (GD or Imagick)
- Automatic EXIF orientation correction via `orientate()` method
- Preserves image quality when using Imagick driver with appropriate quality settings
- Well-tested and actively maintained

**Implementation Approach**:
```php
use Intervention\Image\Laravel\Facades\Image;

// After file upload
$image = Image::read($uploadedFile->getRealPath());
$image->orientate(); // Auto-correct EXIF orientation
$image->save($storagePath, quality: 100); // Preserve original quality
```

**Package Installation**:
```bash
composer require intervention/image-laravel
```

**Configuration**:
- Configure Imagick driver in `config/image.php` for better quality preservation
- Fallback to GD driver if Imagick not available

**Alternatives Considered**:
- **Manual EXIF reading with `exif_read_data()`**: Rejected because requires manual rotation logic, error-prone
- **Client-side orientation correction**: Rejected because not all browsers handle EXIF consistently; server-side ensures consistency
- **Spatie Media Library**: Rejected as overkill for this feature; Intervention Image is lighter and sufficient

**References**:
- Intervention Image v3: https://image.intervention.io/v3
- EXIF Orientation Standard: https://www.impulseadventure.com/photo/exif-orientation.html

---

### 3. File Type Validation & Security

**Decision**: Implement multi-layer validation (extension + MIME type + magic bytes) to prevent malicious uploads.

**Rationale**:
- File extensions can be easily spoofed
- MIME types from `$_FILES` can be manipulated by clients
- Magic bytes (file signature) provide cryptographic-level verification
- Defense-in-depth prevents XSS, RCE, and storage exploits

**Implementation Approach**:
```php
// Layer 1: Laravel validation rules (extension + MIME)
'photo' => 'required|file|mimes:jpg,jpeg,png,heic|max:15360'

// Layer 2: Manual MIME type verification
$mimeType = $uploadedFile->getMimeType();
$allowedMimes = ['image/jpeg', 'image/png', 'image/heic'];
if (!in_array($mimeType, $allowedMimes, true)) {
    throw ValidationException::withMessages(['photo' => 'Invalid file type.']);
}

// Layer 3: Magic bytes verification (optional but recommended)
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedMime = finfo_file($finfo, $uploadedFile->getRealPath());
finfo_close($finfo);
```

**Security Considerations**:
- Store files outside web root (`storage/app/` not `public/`)
- Generate unique filenames using UUID or hash to prevent overwrites
- Sanitize original filename before storing metadata
- Prevent directory traversal by validating paths

**Alternatives Considered**:
- **Client-side validation only**: Rejected as trivially bypassable
- **Extension-only validation**: Rejected as insecure (easily spoofed)
- **Third-party virus scanning**: Deferred to future enhancement; requires external service

**References**:
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- PHP file upload security: https://www.php.net/manual/en/features.file-upload.php

---

### 4. React Drag-and-Drop Implementation

**Decision**: Use native HTML5 drag-and-drop API with `react-dropzone` library for enhanced UX.

**Rationale**:
- `react-dropzone` provides accessible, keyboard-navigable file input
- Handles drag-and-drop, click-to-upload, and paste events uniformly
- Built-in file validation (size, type) before upload
- TypeScript support with proper type definitions
- Mobile-friendly (falls back to file input on touch devices)
- Small bundle size (~10KB gzipped)

**Implementation Approach**:
```tsx
import { useDropzone } from 'react-dropzone';

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/heic': ['.heic']
  },
  maxSize: 15 * 1024 * 1024, // 15MB
  multiple: false,
  onDrop: (acceptedFiles) => {
    // Handle file upload
  }
});
```

**Package Installation**:
```bash
npm install react-dropzone
```

**Alternatives Considered**:
- **Native HTML5 drag-and-drop only**: Rejected due to poor mobile support and accessibility gaps
- **Uppy file uploader**: Rejected as overkill (includes UI, chunking, resumable uploads); we need simpler solution
- **Custom drag-and-drop implementation**: Rejected to avoid reinventing the wheel; `react-dropzone` is battle-tested

**References**:
- react-dropzone: https://react-dropzone.js.org/
- MDN Drag and Drop API: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

---

### 5. Duplicate Photo Detection

**Decision**: Implement SHA-256 file hash comparison for duplicate detection with user override.

**Rationale**:
- SHA-256 provides reliable file content comparison (detects identical files even with different names)
- Hash generation is fast even for 15MB files (<100ms)
- Database index on hash column enables efficient lookups
- User can override warning if intentional duplicate (respects user choice)

**Implementation Approach**:
```php
// In PhotoSubmissionController
$fileHash = hash_file('sha256', $uploadedFile->getRealPath());

$existingSubmission = PhotoSubmission::where('user_id', auth()->id())
    ->where('file_hash', $fileHash)
    ->whereIn('status', ['new', 'approved'])
    ->first();

if ($existingSubmission) {
    // Return warning to frontend
    return back()->with('warning', 'This photo may already be uploaded.');
}
```

**Database Schema Addition**:
```php
$table->string('file_hash', 64)->nullable()->index();
```

**Alternatives Considered**:
- **Filename comparison**: Rejected as unreliable (users can rename files)
- **Image perceptual hashing (pHash)**: Rejected as overkill for exact duplicate detection; useful for similar image detection but not required
- **MD5 hashing**: Rejected due to collision vulnerabilities; SHA-256 is industry standard

**References**:
- PHP hash_file(): https://www.php.net/manual/en/function.hash-file.php
- SHA-256 collision resistance: https://en.wikipedia.org/wiki/SHA-2

---

### 6. Upload Progress Tracking

**Decision**: Use Inertia.js built-in progress events with NProgress for visual feedback.

**Rationale**:
- Inertia.js automatically fires `progress` events during file uploads
- NProgress (already used in many Laravel/Inertia apps) provides lightweight progress bar
- No additional backend configuration required
- Works seamlessly with Inertia `<Form>` component

**Implementation Approach**:
```tsx
import { router } from '@inertiajs/react';
import NProgress from 'nprogress';

router.on('progress', (event) => {
  if (event.detail.progress.percentage) {
    NProgress.set(event.detail.progress.percentage / 100);
  }
});

router.on('finish', () => {
  NProgress.done();
});
```

**Alternatives Considered**:
- **Custom XHR progress events**: Rejected because Inertia abstracts this away; would bypass Inertia benefits
- **WebSocket progress updates**: Rejected as overly complex for this use case
- **Chunked upload with progress**: Deferred to future enhancement; not required for 15MB files

**References**:
- Inertia.js Progress Events: https://inertiajs.com/progress-indicators
- NProgress: https://ricostacruz.com/nprogress/

---

### 7. Submission Counting Logic

**Decision**: Use Eloquent query scopes to count active submissions (status: new or approved) per user.

**Rationale**:
- Eloquent scopes encapsulate business logic in the model layer
- Reusable across controllers and tests
- Database-level counting is more efficient than loading all submissions
- Type-safe with return type hints

**Implementation Approach**:
```php
// In PhotoSubmission model
public function scopeActive(Builder $query): Builder
{
    return $query->whereIn('status', ['new', 'approved']);
}

public function scopeForUser(Builder $query, int $userId): Builder
{
    return $query->where('user_id', $userId);
}

// In PhotoSubmissionController
$activeCount = PhotoSubmission::active()->forUser(auth()->id())->count();

if ($activeCount >= 3) {
    throw ValidationException::withMessages([
        'photo' => 'You have reached the maximum of 3 submissions.'
    ]);
}
```

**Alternatives Considered**:
- **Count in controller**: Rejected to avoid scattering business logic
- **Accessor on User model**: Rejected because counting logic belongs on PhotoSubmission
- **Cache submission count**: Deferred to optimization phase; database count is fast enough for initial scale

**References**:
- Eloquent Query Scopes: https://laravel.com/docs/12.x/eloquent#query-scopes

---

### 8. Error Handling & User Feedback

**Decision**: Use Laravel's ValidationException for validation errors and Inertia flash messages for success/info feedback.

**Rationale**:
- ValidationException automatically formats errors for Inertia's error bag
- Flash messages persist across redirects
- Inertia automatically passes `errors` and `flash` props to React components
- Consistent with Laravel/Inertia patterns

**Implementation Approach**:
```php
// Validation errors (automatic via FormRequest)
// In PhotoSubmissionRequest

// Success message
return redirect()->route('photo-upload.index')->with('success', 'Photo uploaded successfully!');

// Warning message (duplicate)
return back()->with('warning', 'This photo may already be uploaded. Upload anyway?');

// React component
const { errors, flash } = usePage().props;
```

**Frontend Display**:
```tsx
import { Alert } from '@/components/ui/alert';

{flash.success && <Alert variant="success">{flash.success}</Alert>}
{flash.warning && <Alert variant="warning">{flash.warning}</Alert>}
{errors.photo && <Alert variant="error">{errors.photo}</Alert>}
```

**Alternatives Considered**:
- **Toast notifications library**: Deferred to future; Alert component sufficient for MVP
- **API-style JSON responses**: Rejected because Inertia handles this elegantly
- **Custom error formatting**: Rejected to maintain Laravel conventions

**References**:
- Laravel Validation: https://laravel.com/docs/12.x/validation#working-with-error-messages
- Inertia.js Flash Messages: https://inertiajs.com/shared-data#flash-messages

---

## Technology Stack Summary

### Backend
- **Laravel 12** (PHP 8.4) - Web framework
- **Intervention Image v3** - EXIF orientation and image processing
- **Laravel Filesystem** - File storage abstraction
- **SQLite** (dev) / **MySQL/PostgreSQL** (production) - Database

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Inertia.js v2** - Server-driven SPA
- **react-dropzone** - Drag-and-drop file upload
- **NProgress** - Upload progress indicator
- **Radix UI** - Accessible UI components
- **Tailwind CSS v4** - Styling

### Testing
- **PHPUnit 11** - Backend tests
- **Laravel HTTP Tests** - Upload endpoint testing
- **Factories** - Test data generation

## Implementation Readiness

✅ All research areas completed
✅ Technology decisions made with rationale
✅ No blocking unknowns remaining
✅ Ready to proceed to Phase 1 (Design & Contracts)

## Next Steps

1. Generate data model (`data-model.md`)
2. Define API contracts (`contracts/photo-submission-api.yaml`)
3. Create quickstart guide (`quickstart.md`)
4. Update agent context files
