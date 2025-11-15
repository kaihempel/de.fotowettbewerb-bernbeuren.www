# Implementation Tasks: High-Quality Photo Upload System

**Feature Branch**: `001-photo-upload`
**Date**: 2025-11-15
**Status**: Ready for Implementation

## Overview

This document provides dependency-ordered implementation tasks for the photo upload feature, organized by user story to enable independent development and testing. Each user story represents a complete, testable increment of functionality.

**Total Estimated Time**: 6-8 hours
**MVP Scope**: User Story 1 only (core upload functionality)
**Tech Stack**: Laravel 12, React 19, Inertia.js v2, Intervention Image

## Task Legend

- `[P]` = Parallelizable (can run concurrently with other [P] tasks)
- `[US1]`, `[US2]`, `[US3]` = User Story association
- Task IDs are sequential (T001, T002, etc.) in recommended execution order

## Phase 1: Setup & Dependencies

**Goal**: Install required packages and configure environment for photo upload feature.

**Duration**: ~30 minutes

### Tasks

- [ ] T001 Install Intervention Image package via composer require intervention/image-laravel
- [ ] T002 [P] Install react-dropzone via npm install react-dropzone
- [ ] T003 [P] Install nprogress for upload progress via npm install nprogress @types/nprogress
- [ ] T004 [P] Create storage directories: storage/app/photo-submissions/{new,approved,declined}
- [ ] T005 Publish Intervention Image config (optional) via php artisan vendor:publish --provider="Intervention\Image\Laravel\ServiceProvider"

**Verification**: Run `composer show intervention/image-laravel` and `npm list react-dropzone nprogress` to confirm installations.

---

## Phase 2: Foundational (Database & Model)

**Goal**: Create database schema and base model that all user stories depend on.

**Duration**: ~45 minutes

**Blocking**: These tasks MUST complete before any user story implementation.

### Tasks

- [ ] T006 Create migration via php artisan make:migration create_photo_submissions_table --no-interaction
- [ ] T007 Define photo_submissions table schema in database/migrations/YYYY_MM_DD_*_create_photo_submissions_table.php with fields: id, fwb_id, user_id, original_filename, stored_filename, file_path, file_size, file_hash, mime_type, status, rate, submitted_at, reviewed_at, reviewed_by, timestamps
- [ ] T008 Add indexes to migration: unique(fwb_id), index(user_id), index(status), index(file_hash), composite index(user_id, status)
- [ ] T009 Add foreign keys to migration: user_id→users(cascade), reviewed_by→users(set null)
- [ ] T010 Run migration via php artisan migrate
- [ ] T011 Create PhotoSubmission model via php artisan make:model PhotoSubmission --no-interaction
- [ ] T012 Define fillable fields in app/Models/PhotoSubmission.php
- [ ] T013 Define casts() method in app/Models/PhotoSubmission.php for submitted_at, reviewed_at (datetime), rate (decimal:2)
- [ ] T014 [P] Add photoSubmissions() relationship to app/Models/User.php (hasMany)
- [ ] T015 [P] Add reviewedSubmissions() relationship to app/Models/User.php (hasMany with reviewed_by)
- [ ] T016 [P] Add remainingSubmissionSlots accessor to app/Models/User.php
- [ ] T017 Create PhotoSubmissionFactory via php artisan make:factory PhotoSubmissionFactory --no-interaction
- [ ] T018 Define factory definition in database/factories/PhotoSubmissionFactory.php with default values
- [ ] T019 [P] Add approved() state to PhotoSubmissionFactory
- [ ] T020 [P] Add declined() state to PhotoSubmissionFactory

**Verification**: Run `php artisan tinker` and execute `App\Models\PhotoSubmission::factory()->create()` to confirm model and factory work.

---

## Phase 3: User Story 1 - Submit Contest Photo (P1)

**Goal**: Enable authenticated users to upload photos via drag-and-drop or file picker, with preview, progress indicator, and 3-submission limit enforcement.

**Duration**: ~2.5 hours

**Independent Test**: Log in as authenticated user, select valid image (JPG/PNG/HEIC <15MB), upload via drag-drop or click, verify photo stored with status "new" and associated with user. Confirm 3-photo limit enforced.

### Backend Tasks

- [ ] T021 [US1] Create PhotoSubmissionRequest via php artisan make:request PhotoSubmissionRequest --no-interaction
- [ ] T022 [US1] Define validation rules in app/Http/Requests/PhotoSubmissionRequest.php: required, file, mimes:jpg,jpeg,png,heic, max:15360
- [ ] T023 [US1] Add custom validation messages in PhotoSubmissionRequest
- [ ] T024 [US1] Add scopeActive() to app/Models/PhotoSubmission.php: whereIn('status', ['new', 'approved'])
- [ ] T025 [US1] Add scopeForUser() to app/Models/PhotoSubmission.php: where('user_id', $userId)
- [ ] T026 [US1] Add withValidator() method to PhotoSubmissionRequest to check 3-photo limit (uses active() and forUser() scopes)
- [ ] T027 [US1] Create PhotoSubmissionController via php artisan make:controller PhotoSubmissionController --no-interaction
- [ ] T028 [US1] Implement index() method in app/Http/Controllers/PhotoSubmissionController.php to render upload page with Inertia
- [ ] T029 [US1] Implement store() method in PhotoSubmissionController: handle file upload, generate UUID filename, calculate SHA-256 hash
- [ ] T030 [US1] Add EXIF orientation correction in store() using Intervention Image: Image::read()->orientate()->save()
- [ ] T031 [US1] Add file storage logic in store(): Storage::put() to photo-submissions/new/ directory
- [ ] T032 [US1] Add FWB ID generation in store(): format "FWB-YYYY-NNNNN" with sequential counter
- [ ] T033 [US1] Create PhotoSubmission record in store() with all required fields, status "new"
- [ ] T034 [US1] Add redirect to photos.index with success flash message
- [ ] T035 [US1] Add user() relationship (belongsTo) to app/Models/PhotoSubmission.php
- [ ] T036 [US1] Add reviewer() relationship (belongsTo) to PhotoSubmission model
- [ ] T037 [US1] Add fileUrl() accessor to PhotoSubmission: route('photos.download', $this->id)
- [ ] T038 [US1] Add routes to routes/web.php: GET /photos, POST /photos/upload, GET /photos/{submission}/download
- [ ] T039 [US1] Wrap routes in auth middleware group

### Frontend Tasks

- [ ] T040 [P] [US1] Create PhotoUpload component in resources/js/components/photo-upload.tsx
- [ ] T041 [P] [US1] Implement useDropzone hook in PhotoUpload with accept types and maxSize 15MB
- [ ] T042 [P] [US1] Add drag-and-drop area with isDragActive styling in PhotoUpload
- [ ] T043 [P] [US1] Add file preview generation using FileReader API in PhotoUpload
- [ ] T044 [P] [US1] Add client-side error display for file type and size validation in PhotoUpload
- [ ] T045 [P] [US1] Add upload spinner/loading state in PhotoUpload
- [ ] T046 [US1] Create PhotoUpload page in resources/js/Pages/PhotoUpload.tsx
- [ ] T047 [US1] Import Wayfinder store action from @/actions/App/Http/Controllers/PhotoSubmissionController
- [ ] T048 [US1] Add state management in PhotoUpload page: selectedFile, isUploading
- [ ] T049 [US1] Implement handleUpload function using FormData and store.post()
- [ ] T050 [US1] Add error/success/warning flash message display using Alert component
- [ ] T051 [US1] Display remaining submission slots (3 minus active count)
- [ ] T052 [US1] Show "limit reached" message when user has 3 active submissions
- [ ] T053 [US1] Add upload button (disabled when no file or uploading)
- [ ] T054 [US1] Wrap page in AppLayout component
- [ ] T055 [P] [US1] Configure NProgress for upload progress in PhotoUpload page

### Test Tasks

- [ ] T056 [US1] Create PhotoSubmissionTest via php artisan make:test PhotoSubmissionTest --no-interaction
- [ ] T057 [US1] Write test_authenticated_user_can_access_upload_page in tests/Feature/PhotoSubmissionTest.php
- [ ] T058 [US1] Write test_user_can_upload_valid_photo using Storage::fake() and UploadedFile::fake()
- [ ] T059 [US1] Write test_upload_stores_photo_with_correct_metadata (filename, size, mime_type, status)
- [ ] T060 [US1] Write test_user_cannot_upload_more_than_three_active_submissions
- [ ] T061 [US1] Write test_fwb_id_is_generated_correctly
- [ ] T062 [US1] Run tests via php artisan test --filter=PhotoSubmission

**User Story 1 Completion Criteria**:
- ✅ User can drag-drop or click to select image file
- ✅ Image preview displays after selection
- ✅ Upload progress shown during submission
- ✅ Photo stored in storage/app/photo-submissions/new/ with UUID filename
- ✅ Database record created with status "new", linked to user
- ✅ 3-photo limit enforced (error if 3 active submissions exist)
- ✅ Success message shown after upload
- ✅ All tests pass

---

## Phase 4: User Story 2 - Upload Validation and Error Handling (P2)

**Goal**: Provide clear, actionable error messages for validation failures (invalid file type, oversized file, network errors, duplicate detection).

**Duration**: ~1.5 hours

**Dependencies**: User Story 1 must be complete (requires upload functionality).

**Independent Test**: Attempt uploads with PDF (invalid type), 20MB file (oversized), same file twice (duplicate warning). Verify appropriate error messages display without server submission where applicable.

### Backend Tasks

- [ ] T063 [US2] Add MIME type verification in PhotoSubmissionController store(): verify $_FILES mime_type matches allowed types
- [ ] T064 [US2] Add magic bytes validation using finfo_file() in store() for extra security
- [ ] T065 [US2] Add duplicate detection in store(): check file_hash against user's existing submissions
- [ ] T066 [US2] Return warning flash message (not error) when duplicate detected: "This photo may already be uploaded."
- [ ] T067 [US2] Allow upload to proceed even with duplicate warning (user choice)

### Frontend Tasks

- [ ] T068 [P] [US2] Add onDrop rejection handling in PhotoUpload component for file-too-large error
- [ ] T069 [P] [US2] Add onDrop rejection handling in PhotoUpload for file-invalid-type error
- [ ] T070 [P] [US2] Display error state in PhotoUpload when rejections occur
- [ ] T071 [US2] Add warning alert display in PhotoUpload page for duplicate detection
- [ ] T072 [US2] Add network error handling in handleUpload: catch failed requests, show retry option
- [ ] T073 [US2] Add navigation warning when upload in progress: confirm before leaving page

### Test Tasks

- [ ] T074 [US2] Write test_upload_rejects_invalid_file_type in PhotoSubmissionTest
- [ ] T075 [US2] Write test_upload_rejects_oversized_file
- [ ] T076 [US2] Write test_duplicate_photo_shows_warning_but_allows_upload
- [ ] T077 [US2] Write test_mime_type_validated_server_side (attempt spoofed mime type)
- [ ] T078 [US2] Write test_cannot_submit_without_file_selected (FR-018 coverage)
- [ ] T079 [US2] Run validation tests via php artisan test --filter=PhotoSubmission

**User Story 2 Completion Criteria**:
- ✅ Invalid file types show error: "Only JPG, PNG, and HEIC images are accepted"
- ✅ Oversized files show error: "Photo must not exceed 15MB"
- ✅ Duplicate files show warning but allow upload if user proceeds
- ✅ Network errors show retry option
- ✅ Navigation away during upload shows confirmation warning
- ✅ All validation tests pass

---

## Phase 5: User Story 3 - Submission Status Tracking (P3)

**Goal**: Display user's submission history with status (new, approved, declined) and remaining submission slots.

**Duration**: ~1.5 hours

**Dependencies**: User Story 1 must be complete (requires stored submissions).

**Independent Test**: Upload 3 photos (or seed test data), view submissions list showing status for each. Have admin change one to "declined", verify remaining slots increases from 0 to 1.

### Backend Tasks

- [ ] T080 [US3] Update index() method in PhotoSubmissionController to load user's submissions with pagination
- [ ] T081 [US3] Add with('reviewer') eager loading to avoid N+1 queries
- [ ] T082 [US3] Pass remainingSlots to Inertia: auth()->user()->remaining_submission_slots
- [ ] T083 [US3] Implement download() method in PhotoSubmissionController for file downloads
- [ ] T084 [US3] Add authorization check in download(): user owns submission OR status is approved
- [ ] T085 [US3] Return Storage::download() with original filename
- [ ] T086 [US3] Add scopeByStatus() to PhotoSubmission model: where('status', $status)
- [ ] T087 [US3] Add scopeRecent() to PhotoSubmission: orderBy('submitted_at', 'desc')

### Frontend Tasks

- [ ] T088 [P] [US3] Add submissions list display in PhotoUpload page below upload form
- [ ] T089 [P] [US3] Map over submissions.data and render Card for each submission
- [ ] T090 [P] [US3] Display submission metadata: original_filename, fwb_id, status
- [ ] T091 [P] [US3] Add status badges with color coding: new (yellow), approved (green), declined (red)
- [ ] T092 [P] [US3] Add download link for each submission pointing to file_url
- [ ] T093 [US3] Display remaining slots counter prominently: "X of 3 slots remaining"
- [ ] T094 [US3] Show different message when 0 slots: "Maximum submissions reached"
- [ ] T095 [US3] Add pagination controls if submissions > 20

### Test Tasks

- [ ] T096 [US3] Write test_user_can_view_their_submissions_list
- [ ] T097 [US3] Write test_declined_submissions_do_not_count_toward_limit
- [ ] T098 [US3] Write test_remaining_slots_calculated_correctly (2 approved + 1 declined = 1 slot)
- [ ] T099 [US3] Write test_user_can_download_their_own_submission
- [ ] T100 [US3] Write test_user_cannot_download_others_submissions
- [ ] T101 [US3] Run status tracking tests via php artisan test --filter=PhotoSubmission

**User Story 3 Completion Criteria**:
- ✅ Submissions list shows all user's photos with status
- ✅ Status clearly indicated: new (awaiting review), approved, declined
- ✅ Remaining slots calculated correctly (3 minus new/approved count)
- ✅ Download links work for user's own submissions
- ✅ Declined photos free up submission slot
- ✅ All status tracking tests pass

---

## Phase 6: Polish & Integration

**Goal**: Code quality, formatting, final testing, and deployment preparation.

**Duration**: ~30-45 minutes

### Tasks

- [ ] T102 Format PHP code via vendor/bin/pint --dirty
- [ ] T103 Format TypeScript code via npm run lint
- [ ] T104 Check TypeScript types via npm run types
- [ ] T105 Run full test suite via php artisan test
- [ ] T106 Build production assets via npm run build
- [ ] T107 Verify all routes registered: php artisan route:list | grep photos
- [ ] T108 Test upload flow manually: login, upload photo, verify storage, check database
- [ ] T109 Test validation manually: try PDF, 20MB file, duplicate, verify errors
- [ ] T110 Test status display manually: upload 3 photos, verify limit, check remaining slots
- [ ] T111 Test mobile responsiveness: verify drag-drop falls back to file picker on mobile
- [ ] T112 Test dark mode: verify upload UI respects theme (light/dark/system)
- [ ] T113 Review security: confirm files stored outside public/, CSRF protection active
- [ ] T114 Manual test SC-003: Verify image preview generates in <2 seconds for 15MB file
- [ ] T115 Update CLAUDE.md if any deviations from plan (optional)

**Phase 6 Completion Criteria**:
- ✅ All code formatted (Pint, ESLint, Prettier)
- ✅ TypeScript compiles with no errors
- ✅ Full test suite passes (100% tests green)
- ✅ Production build succeeds
- ✅ Manual testing complete (upload, validation, status)
- ✅ Mobile and dark mode verified
- ✅ Security checklist complete

---

## Dependency Graph

```
Phase 1 (Setup)
    │
    v
Phase 2 (Foundational: Database & Model)
    │
    ├─────────────────┬────────────────┐
    │                 │                │
    v                 v                v
User Story 1    User Story 2    User Story 3
(Submit)        (Validation)    (Status)
    │                 │                │
    │                 v                │
    │           (depends on US1)       │
    │                 │                │
    │                 v                v
    └─────────────> (depends on US1) <─┘
                      │
                      v
                Phase 6 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → User Story 1 → Phase 6

**Parallel Opportunities**:
- User Story 2 and User Story 3 can be developed in parallel AFTER User Story 1 completes
- Within each phase, tasks marked [P] can run concurrently
- Frontend and backend tasks within same user story can run in parallel if developers coordinate

---

## Parallel Execution Examples

### Phase 2 (Foundational) Parallelization

**Group A** (Database):
- T006-T010: Migration creation and execution

**Group B** (Model - can start after T010):
- T011-T013: PhotoSubmission model
- T014-T016: User model relationships (parallel)

**Group C** (Factory - can start after T011):
- T017-T020: Factory creation and states

### User Story 1 Parallelization

**Group A** (Backend):
- T021-T039: All backend tasks (sequential dependencies within group)

**Group B** (Frontend - parallel with Group A):
- T040-T045: PhotoUpload component
- T046-T055: PhotoUpload page (requires component, so partial dependency)

**Group C** (Tests - after Groups A & B):
- T056-T062: All test tasks

### User Story 2 Parallelization

**Group A** (Backend):
- T063-T067: Validation enhancements

**Group B** (Frontend - parallel with Group A):
- T068-T073: Error handling UI

**Group C** (Tests - after Groups A & B):
- T074-T078: Validation tests

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Include**:
- Phase 1: Setup
- Phase 2: Foundational
- User Story 1 ONLY: Submit Contest Photo

**Why**: User Story 1 delivers core value (photo upload) and is independently testable. Validation (US2) and status display (US3) are enhancements that can follow.

**MVP Duration**: ~4 hours
**MVP Tests**: T056-T062 (6 tests)

### Incremental Delivery

**Release 1** (MVP):
- User Story 1 complete
- Basic upload functionality live
- Users can participate in contest

**Release 2** (Validation):
- Add User Story 2
- Enhanced error handling and duplicate detection
- Improved user experience

**Release 3** (Status Tracking):
- Add User Story 3
- Submission history and status visibility
- Complete feature set

### Testing Strategy

**Unit Tests**: Automatically run after each task group completion
**Integration Tests**: Run after each user story phase
**Manual Testing**: Final verification in Phase 6

**Test Execution**:
```bash
# After each user story
php artisan test --filter=PhotoSubmission

# Before finalizing
php artisan test
```

---

## Task Summary

| Phase | Tasks | Duration | Parallelizable |
|-------|-------|----------|----------------|
| Phase 1: Setup | T001-T005 | 30 min | 3 tasks |
| Phase 2: Foundational | T006-T020 | 45 min | 6 tasks |
| Phase 3: User Story 1 | T021-T062 | 2.5 hrs | 18 tasks |
| Phase 4: User Story 2 | T063-T078 | 1.5 hrs | 5 tasks |
| Phase 5: User Story 3 | T079-T100 | 1.5 hrs | 8 tasks |
| Phase 6: Polish | T101-T113 | 45 min | 0 tasks |
| **TOTAL** | **115 tasks** | **7 hrs** | **40 parallel** |

**MVP (User Story 1 only)**: 62 tasks, ~4 hours

---

## Notes

### TDD Approach

Tests are included for all user stories following the project's TDD mandate. Each user story phase includes test tasks at the end after implementation tasks complete.

### Constitution Compliance

All tasks align with project constitution:
- ✅ Laravel-First: Uses artisan make commands
- ✅ Type Safety: Explicit return types required (verified in code review)
- ✅ TDD: Tests included for all user stories
- ✅ Component Reusability: Reuses Radix UI components
- ✅ Inertia Patterns: Uses Inertia::render() and Form component
- ✅ Accessibility: react-dropzone provides accessible file input
- ✅ Code Quality: Formatting tasks in Phase 6
- ✅ Security: Multi-layer validation, files outside public/

### File Paths Reference

**Backend**:
- Migration: `database/migrations/YYYY_MM_DD_*_create_photo_submissions_table.php`
- Model: `app/Models/PhotoSubmission.php`
- Controller: `app/Http/Controllers/PhotoSubmissionController.php`
- Request: `app/Http/Requests/PhotoSubmissionRequest.php`
- Factory: `database/factories/PhotoSubmissionFactory.php`
- Tests: `tests/Feature/PhotoSubmissionTest.php`
- Routes: `routes/web.php`

**Frontend**:
- Component: `resources/js/components/photo-upload.tsx`
- Page: `resources/js/Pages/PhotoUpload.tsx`
- Wayfinder Actions: `resources/js/wayfinder/` (auto-generated)

**Storage**:
- Photos: `storage/app/photo-submissions/{new,approved,declined}/`

---

**Last Updated**: 2025-11-15
**Ready for Implementation**: ✅ YES
