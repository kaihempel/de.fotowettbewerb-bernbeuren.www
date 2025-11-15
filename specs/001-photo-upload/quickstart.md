# Quickstart: Photo Upload System Implementation

**Feature**: High-Quality Photo Upload System
**Branch**: `001-photo-upload`
**Date**: 2025-11-15

## Overview

This guide provides a step-by-step implementation workflow for the photo upload feature. Follow these steps sequentially to build the feature according to the specification and design artifacts.

## Prerequisites

- ✅ Laravel 12 application set up and running
- ✅ Authentication working (Laravel Fortify configured)
- ✅ React 19 + Inertia.js v2 configured
- ✅ Wayfinder installed and generating route helpers
- ✅ Tailwind CSS v4 and Radix UI components available
- ✅ Development environment running (`composer run dev`)

## Implementation Checklist

### Phase 1: Backend Foundation (2-3 hours)

#### Step 1.1: Install Dependencies

```bash
# Install Intervention Image for EXIF handling
composer require intervention/image-laravel

# Publish config (optional, for Imagick driver configuration)
php artisan vendor:publish --provider="Intervention\Image\Laravel\ServiceProvider"
```

#### Step 1.2: Create Database Migration

```bash
php artisan make:migration create_photo_submissions_table --no-interaction
```

**Edit the migration file** (`database/migrations/YYYY_MM_DD_*_create_photo_submissions_table.php`):

```php
public function up(): void
{
    Schema::create('photo_submissions', function (Blueprint $table) {
        $table->id();
        $table->string('fwb_id', 20)->unique();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('original_filename', 255);
        $table->string('stored_filename', 255);
        $table->string('file_path', 500);
        $table->integer('file_size');
        $table->string('file_hash', 64)->nullable()->index();
        $table->string('mime_type', 50);
        $table->enum('status', ['new', 'approved', 'declined'])->default('new');
        $table->decimal('rate', 3, 2)->nullable();
        $table->timestamp('submitted_at')->useCurrent();
        $table->timestamp('reviewed_at')->nullable();
        $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
        $table->timestamps();

        // Indexes
        $table->index(['user_id', 'status']);
    });
}

public function down(): void
{
    Schema::dropIfExists('photo_submissions');
}
```

**Run the migration**:

```bash
php artisan migrate
```

#### Step 1.3: Create PhotoSubmission Model

```bash
php artisan make:model PhotoSubmission --no-interaction
```

**Edit the model** (`app/Models/PhotoSubmission.php`):

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class PhotoSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'fwb_id',
        'user_id',
        'original_filename',
        'stored_filename',
        'file_path',
        'file_size',
        'file_hash',
        'mime_type',
        'status',
        'rate',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'rate' => 'decimal:2',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', ['new', 'approved']);
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->orderBy('submitted_at', 'desc');
    }

    // Accessors
    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => route('photos.download', $this->id)
        );
    }
}
```

**Update User model** (`app/Models/User.php`) to add relationships:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

public function photoSubmissions(): HasMany
{
    return $this->hasMany(PhotoSubmission::class);
}

public function reviewedSubmissions(): HasMany
{
    return $this->hasMany(PhotoSubmission::class, 'reviewed_by');
}

protected function remainingSubmissionSlots(): Attribute
{
    return Attribute::make(
        get: fn () => 3 - $this->photoSubmissions()->active()->count()
    );
}
```

#### Step 1.4: Create Form Request for Validation

```bash
php artisan make:request PhotoSubmissionRequest --no-interaction
```

**Edit the request** (`app/Http/Requests/PhotoSubmissionRequest.php`):

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use App\Models\PhotoSubmission;

class PhotoSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'photo' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,heic',
                'max:15360', // 15MB in kilobytes
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'photo.required' => 'Please select a photo to upload.',
            'photo.file' => 'The uploaded file is invalid.',
            'photo.mimes' => 'Only JPG, PNG, and HEIC images are accepted.',
            'photo.max' => 'Photo must not exceed 15MB.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Check submission limit
            $activeCount = PhotoSubmission::active()
                ->forUser(auth()->id())
                ->count();

            if ($activeCount >= 3) {
                $validator->errors()->add(
                    'photo',
                    'You have reached the maximum of 3 submissions.'
                );
            }
        });
    }
}
```

#### Step 1.5: Create Controller

```bash
php artisan make:controller PhotoSubmissionController --no-interaction
```

**Edit the controller** (`app/Http/Controllers/PhotoSubmissionController.php`):

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\PhotoSubmissionRequest;
use App\Models\PhotoSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Laravel\Facades\Image;

class PhotoSubmissionController extends Controller
{
    public function index(): Response
    {
        $submissions = PhotoSubmission::with('reviewer')
            ->forUser(auth()->id())
            ->recent()
            ->paginate(20);

        $remainingSlots = auth()->user()->remaining_submission_slots;

        return Inertia::render('PhotoUpload', [
            'submissions' => $submissions,
            'remainingSlots' => $remainingSlots,
        ]);
    }

    public function store(PhotoSubmissionRequest $request): RedirectResponse
    {
        $uploadedFile = $request->file('photo');

        // Generate unique filenames
        $storedFilename = Str::uuid() . '.' . $uploadedFile->getClientOriginalExtension();
        $filePath = 'photo-submissions/new/' . $storedFilename;

        // Calculate file hash for duplicate detection
        $fileHash = hash_file('sha256', $uploadedFile->getRealPath());

        // Check for duplicate
        $duplicate = PhotoSubmission::where('user_id', auth()->id())
            ->where('file_hash', $fileHash)
            ->whereIn('status', ['new', 'approved'])
            ->first();

        if ($duplicate) {
            return back()->with('warning', 'This photo may already be uploaded.');
        }

        // Process image (EXIF orientation correction)
        $image = Image::read($uploadedFile->getRealPath());
        $image->orientate();

        // Save to storage with original quality
        Storage::put($filePath, (string) $image->encode(quality: 100));

        // Generate FWB ID
        $fwbId = 'FWB-' . now()->year . '-' . str_pad(
            PhotoSubmission::count() + 1,
            5,
            '0',
            STR_PAD_LEFT
        );

        // Create submission record
        PhotoSubmission::create([
            'fwb_id' => $fwbId,
            'user_id' => auth()->id(),
            'original_filename' => $uploadedFile->getClientOriginalName(),
            'stored_filename' => $storedFilename,
            'file_path' => $filePath,
            'file_size' => $uploadedFile->getSize(),
            'file_hash' => $fileHash,
            'mime_type' => $uploadedFile->getMimeType(),
            'status' => 'new',
            'submitted_at' => now(),
        ]);

        return redirect()->route('photos.index')
            ->with('success', 'Photo uploaded successfully!');
    }

    public function download(PhotoSubmission $submission)
    {
        // Authorization check
        if ($submission->user_id !== auth()->id() && $submission->status !== 'approved') {
            abort(403, 'Unauthorized access to this photo.');
        }

        return Storage::download($submission->file_path, $submission->original_filename);
    }
}
```

#### Step 1.6: Add Routes

**Edit** `routes/web.php`:

```php
use App\Http\Controllers\PhotoSubmissionController;

Route::middleware('auth')->group(function () {
    Route::get('/photos', [PhotoSubmissionController::class, 'index'])->name('photos.index');
    Route::post('/photos/upload', [PhotoSubmissionController::class, 'store'])->name('photos.store');
    Route::get('/photos/{submission}/download', [PhotoSubmissionController::class, 'download'])->name('photos.download');
});
```

#### Step 1.7: Configure Storage

**Edit** `config/filesystems.php` (if needed):

```php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
        'throw' => false,
    ],
    // ... other disks
],
```

**Create storage directories**:

```bash
mkdir -p storage/app/photo-submissions/{new,approved,declined}
```

---

### Phase 2: Frontend Component (2-3 hours)

#### Step 2.1: Install Frontend Dependencies

```bash
npm install react-dropzone nprogress
npm install --save-dev @types/nprogress
```

#### Step 2.2: Create Upload Component

**Create** `resources/js/components/photo-upload.tsx`:

```tsx
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

interface PhotoUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function PhotoUpload({ onFileSelect, isUploading }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic']
    },
    maxSize: 15 * 1024 * 1024, // 15MB
    multiple: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File must not exceed 15MB.');
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Only JPG, PNG, and HEIC images are accepted.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);

        // Generate preview
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  });

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click or drag to replace photo
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop photo here' : 'Drag & drop photo here'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              or click to browse
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              JPG, PNG, or HEIC (max 15MB)
            </p>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <Spinner />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Uploading...</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="error" className="mt-4">{error}</Alert>
      )}
    </Card>
  );
}
```

#### Step 2.3: Create Photo Upload Page

**Create** `resources/js/Pages/PhotoUpload.tsx`:

```tsx
import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/PhotoSubmissionController';
import AppLayout from '@/layouts/app-layout';
import { PhotoUpload } from '@/components/photo-upload';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

interface PhotoUploadPageProps {
  submissions: {
    data: Array<{
      id: number;
      fwb_id: string;
      original_filename: string;
      status: string;
      submitted_at: string;
      file_url: string;
    }>;
  };
  remainingSlots: number;
}

export default function PhotoUploadPage({ submissions, remainingSlots }: PhotoUploadPageProps) {
  const { errors, flash } = usePage().props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('photo', selectedFile);

    store.post(formData, {
      onFinish: () => {
        setIsUploading(false);
        setSelectedFile(null);
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Upload Photo" />

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Photo Contest Submission</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You have {remainingSlots} of 3 submission slots remaining
          </p>
        </div>

        {flash.success && <Alert variant="success">{flash.success}</Alert>}
        {flash.warning && <Alert variant="warning">{flash.warning}</Alert>}
        {errors.photo && <Alert variant="error">{errors.photo}</Alert>}

        {remainingSlots > 0 ? (
          <div className="space-y-4">
            <PhotoUpload
              onFileSelect={setSelectedFile}
              isUploading={isUploading}
            />

            {selectedFile && !isUploading && (
              <Button onClick={handleUpload} className="w-full">
                Upload Photo
              </Button>
            )}
          </div>
        ) : (
          <Alert variant="info">
            You have reached the maximum of 3 submissions. Wait for review or contact support.
          </Alert>
        )}

        {submissions.data.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Submissions</h2>
            <div className="space-y-4">
              {submissions.data.map((submission) => (
                <Card key={submission.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{submission.original_filename}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {submission.fwb_id} - Status: {submission.status}
                    </p>
                  </div>
                  <a href={submission.file_url} className="text-primary hover:underline">
                    Download
                  </a>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
```

---

### Phase 3: Testing (1-2 hours)

#### Step 3.1: Create Model Factory

```bash
php artisan make:factory PhotoSubmissionFactory --no-interaction
```

**Edit** `database/factories/PhotoSubmissionFactory.php`:

```php
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PhotoSubmissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'fwb_id' => 'FWB-' . now()->year . '-' . str_pad(fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'user_id' => User::factory(),
            'original_filename' => fake()->word() . '.jpg',
            'stored_filename' => fake()->uuid() . '.jpg',
            'file_path' => 'photo-submissions/new/' . fake()->uuid() . '.jpg',
            'file_size' => fake()->numberBetween(1000000, 15000000),
            'file_hash' => hash('sha256', fake()->uuid()),
            'mime_type' => 'image/jpeg',
            'status' => 'new',
            'submitted_at' => now(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => User::factory(),
            'rate' => fake()->randomFloat(2, 5, 10),
        ]);
    }

    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'declined',
            'reviewed_at' => now(),
            'reviewed_by' => User::factory(),
        ]);
    }
}
```

#### Step 3.2: Create Feature Tests

```bash
php artisan make:test PhotoSubmissionTest --no-interaction
```

**Edit** `tests/Feature/PhotoSubmissionTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\PhotoSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PhotoSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_upload_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('photos.index'));

        $response->assertOk();
    }

    public function test_user_can_upload_valid_photo(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('test.jpg')->size(5000); // 5MB

        $response = $this->actingAs($user)->post(route('photos.store'), [
            'photo' => $file,
        ]);

        $response->assertRedirect(route('photos.index'));
        $this->assertDatabaseHas('photo_submissions', [
            'user_id' => $user->id,
            'original_filename' => 'test.jpg',
            'mime_type' => 'image/jpeg',
            'status' => 'new',
        ]);
    }

    public function test_upload_rejects_invalid_file_type(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->actingAs($user)->post(route('photos.store'), [
            'photo' => $file,
        ]);

        $response->assertSessionHasErrors('photo');
    }

    public function test_upload_rejects_oversized_file(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('huge.jpg')->size(20000); // 20MB

        $response = $this->actingAs($user)->post(route('photos.store'), [
            'photo' => $file,
        ]);

        $response->assertSessionHasErrors('photo');
    }

    public function test_user_cannot_upload_more_than_three_active_submissions(): void
    {
        $user = User::factory()->create();

        // Create 3 active submissions
        PhotoSubmission::factory()->count(3)->create(['user_id' => $user->id, 'status' => 'new']);

        $file = UploadedFile::fake()->image('fourth.jpg');

        $response = $this->actingAs($user)->post(route('photos.store'), [
            'photo' => $file,
        ]);

        $response->assertSessionHasErrors('photo');
    }

    public function test_declined_submissions_do_not_count_toward_limit(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        // Create 2 approved and 1 declined
        PhotoSubmission::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'approved']);
        PhotoSubmission::factory()->declined()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->image('new.jpg');

        $response = $this->actingAs($user)->post(route('photos.store'), [
            'photo' => $file,
        ]);

        $response->assertRedirect(route('photos.index'));
        $this->assertDatabaseCount('photo_submissions', 4); // 2 approved + 1 declined + 1 new
    }
}
```

#### Step 3.3: Run Tests

```bash
php artisan test --filter=PhotoSubmission
```

---

### Phase 4: Code Quality & Finalization (30 minutes)

#### Step 4.1: Format Code

```bash
# Format PHP code
vendor/bin/pint --dirty

# Format TypeScript code
npm run lint

# Check TypeScript types
npm run types
```

#### Step 4.2: Run Full Test Suite

```bash
php artisan test
```

#### Step 4.3: Build Assets

```bash
npm run build
```

---

## Testing the Feature

### Manual Testing Checklist

1. **Upload Flow**:
   - [ ] Navigate to `/photos`
   - [ ] Drag and drop a valid image (JPG/PNG)
   - [ ] Verify image preview appears
   - [ ] Click "Upload Photo"
   - [ ] Verify success message and redirect
   - [ ] Check submission appears in "Your Submissions" list

2. **Validation**:
   - [ ] Try uploading PDF → should show error
   - [ ] Try uploading 20MB file → should show error
   - [ ] Upload 3 photos → 4th should be blocked

3. **Submission Status**:
   - [ ] Verify new submissions show status "new"
   - [ ] Verify remaining slots display correctly (3, 2, 1, 0)

4. **EXIF Orientation**:
   - [ ] Upload photo with EXIF rotation metadata
   - [ ] Download and verify orientation is corrected

5. **Duplicate Detection**:
   - [ ] Upload same photo twice
   - [ ] Verify warning message appears

6. **Mobile Testing**:
   - [ ] Test drag-and-drop on mobile (should show file picker)
   - [ ] Verify responsive layout
   - [ ] Test camera access (if applicable)

---

## Troubleshooting

### Issue: "Class 'Intervention\Image\Facades\Image' not found"

**Solution**: Ensure Intervention Image is installed and service provider is registered.

```bash
composer require intervention/image-laravel
php artisan config:clear
```

### Issue: "Storage directory not found"

**Solution**: Create storage directories.

```bash
mkdir -p storage/app/photo-submissions/{new,approved,declined}
php artisan storage:link
```

### Issue: "413 Payload Too Large"

**Solution**: Increase PHP upload limits in `php.ini`:

```ini
upload_max_filesize = 20M
post_max_size = 20M
```

Restart web server after changing `php.ini`.

### Issue: Wayfinder route helpers not found

**Solution**: Rebuild Wayfinder routes.

```bash
npm run build
```

---

## Next Steps

After completing this quickstart:

1. **Review Code**: Run code review checklist
2. **Update Documentation**: Document any deviations from plan
3. **Deploy to Staging**: Test in staging environment
4. **User Acceptance Testing**: Get feedback from stakeholders
5. **Admin Panel**: Implement photo review workflow (separate feature)

---

## Resources

- **Specification**: `specs/001-photo-upload/spec.md`
- **Data Model**: `specs/001-photo-upload/data-model.md`
- **API Contracts**: `specs/001-photo-upload/contracts/photo-submission-api.yaml`
- **Research**: `specs/001-photo-upload/research.md`
- **Laravel Docs**: https://laravel.com/docs/12.x
- **Inertia.js Docs**: https://inertiajs.com
- **Intervention Image**: https://image.intervention.io/v3

---

**Last Updated**: 2025-11-15
**Author**: Automated Planning System
