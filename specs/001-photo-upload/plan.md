# Implementation Plan: High-Quality Photo Upload System

**Branch**: `001-photo-upload` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-photo-upload/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a high-quality photo upload system that allows authenticated users to submit up to 3 photographs for the photo contest. The system will accept JPG, PNG, and HEIC formats (max 15MB), preserve original image quality without compression, automatically correct EXIF orientation, and track submission status through a review workflow (new, approved, declined). Users will upload via drag-and-drop on desktop or photo library access on mobile, with real-time progress indicators, client and server-side validation, and duplicate photo warnings.

## Technical Context

**Language/Version**: PHP 8.4, TypeScript (React 19)
**Primary Dependencies**: Laravel 12, Inertia.js v2, Laravel Fortify, Laravel Wayfinder, Radix UI components, Tailwind CSS v4
**Storage**: Laravel filesystem (local disk for development, extensible to S3/cloud for production)
**Testing**: PHPUnit 11, React Testing Library
**Target Platform**: Web application (desktop and mobile browsers, iOS 11+, Android 8+)
**Project Type**: Web (Laravel backend + React frontend via Inertia.js)
**Performance Goals**:
- Upload completion in <3 minutes for 15MB files on broadband
- Image preview generation <2 seconds
- Validation error feedback <1 second
- 95% upload success rate
**Constraints**:
- 15MB maximum file size per upload
- 3 active submissions per user (new + approved count)
- Original image quality preservation (no compression)
- Server-side EXIF orientation correction without quality loss
**Scale/Scope**:
- Initial release: 100-500 expected participants
- Storage planning: ~300-1500 photos (3 per user)
- Concurrent uploads: ~10-20 simultaneous
- Database: photo_submissions table with ~1500 rows maximum initial scale

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: Laravel-First Architecture ✅ PASS

**Requirement**: Every feature MUST leverage Laravel's ecosystem and conventions.

**Compliance**:
- ✅ Migration created via `php artisan make:migration`
- ✅ Model created via `php artisan make:model`
- ✅ Controller created via `php artisan make:controller`
- ✅ Form Request created via `php artisan make:request`
- ✅ Route registered in `routes/web.php`
- ✅ Storage configured via Laravel filesystem (config/filesystems.php)
- ✅ Uses Eloquent ORM with explicit relationship return types
- ✅ No middleware files (will use existing HandleInertiaRequests for shared data)

**Verdict**: NO VIOLATIONS

### Gate 2: Type Safety & Modern Standards ✅ PASS

**Requirement**: All code MUST use explicit type declarations (NON-NEGOTIABLE).

**Compliance**:
- ✅ PHP: All methods will have explicit return types
- ✅ PHP: Model will use `casts()` method (not `$casts` property)
- ✅ PHP: Constructor property promotion used
- ✅ TypeScript: Strict typing enabled for React components
- ✅ TypeScript: Functional components with explicit prop types
- ✅ Wayfinder: Named imports for tree-shaking
- ✅ Wayfinder: `.form()` pattern with Inertia `<Form>` component

**Verdict**: NO VIOLATIONS

### Gate 3: Test-Driven Development ✅ PASS

**Requirement**: All changes MUST have corresponding PHPUnit tests (NON-NEGOTIABLE).

**Compliance**:
- ✅ Feature tests will be created in `tests/Feature/PhotoSubmissionTest.php`
- ✅ Tests will cover: successful upload, validation failures, file type validation, size limits, submission counting, EXIF handling
- ✅ Factory will be created for PhotoSubmission model
- ✅ Tests will run before finalizing: `php artisan test --filter=PhotoSubmission`

**Verdict**: NO VIOLATIONS

### Gate 4: Component Reusability ✅ PASS

**Requirement**: Always check for existing components before creating new ones.

**Compliance**:
- ✅ Will use existing Radix UI components: Button, Card, Spinner, Alert
- ✅ Will use existing `use-appearance` hook for theme support
- ✅ Will check `resources/js/components/` before creating upload component
- ✅ Dark mode support via existing `dark:` variants in Tailwind v4
- ✅ Mobile-first responsive design with existing Tailwind utilities

**Verdict**: NO VIOLATIONS

### Gate 5: Inertia Best Practices ✅ PASS

**Requirement**: All server-side rendering MUST use Inertia patterns.

**Compliance**:
- ✅ Controller returns `Inertia::render()` for upload page
- ✅ Form submission uses Inertia `<Form>` component (not `useForm` hook)
- ✅ Page placed in `resources/js/Pages/PhotoUpload.tsx`
- ✅ Progress indicator handled via Inertia progress events
- ✅ Deferred props for submissions list (if applicable)

**Verdict**: NO VIOLATIONS

### Gate 6: Accessibility & User Experience ✅ PASS

**Requirement**: All UI components MUST be accessible and provide excellent UX across devices.

**Compliance**:
- ✅ Radix UI accessibility patterns followed (keyboard navigation, ARIA labels)
- ✅ Theme support via `use-appearance` hook (light/dark/system)
- ✅ Mobile-first responsive design
- ✅ Loading states for upload progress
- ✅ Error handling with clear messaging
- ✅ Success feedback via toast/alert

**Verdict**: NO VIOLATIONS

### Gate 7: Code Quality & Formatting ✅ PASS

**Requirement**: Code MUST be formatted consistently before finalizing (NON-NEGOTIABLE).

**Compliance**:
- ✅ PHP formatted via `vendor/bin/pint --dirty`
- ✅ TypeScript formatted via `npm run lint`
- ✅ Type checking via `npm run types`
- ✅ Form Request class for validation (no inline validation)
- ✅ Eloquent relationships for user association

**Verdict**: NO VIOLATIONS

### Gate 8: Security & Authentication ✅ PASS

**Requirement**: Security MUST be prioritized in all features.

**Compliance**:
- ✅ Authentication via existing Laravel Fortify
- ✅ Form Request validation (server-side file type, size, MIME type validation)
- ✅ CSRF protection automatic with Inertia `<Form>`
- ✅ File storage outside public directory
- ✅ Filename sanitization to prevent directory traversal
- ✅ Authorization: only authenticated users can upload
- ✅ Authorization: users can only view their own submissions
- ✅ No OWASP Top 10 vulnerabilities (XSS, SQL injection, command injection)

**Verdict**: NO VIOLATIONS

### Constitution Check Summary

**Overall Status**: ✅ **ALL GATES PASSED**

**Violations Requiring Justification**: NONE

**Pre-Implementation Readiness**: ✅ APPROVED - Proceed to Phase 0 (Research)

## Project Structure

### Documentation (this feature)

```text
specs/001-photo-upload/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── photo-submission-api.yaml
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (Laravel + React)

# Backend (Laravel)
app/
├── Models/
│   └── PhotoSubmission.php                    # NEW - Photo submission model
├── Http/
│   ├── Controllers/
│   │   └── PhotoSubmissionController.php      # NEW - Upload & status endpoints
│   └── Requests/
│       └── PhotoSubmissionRequest.php         # NEW - Upload validation rules
└── Actions/                                    # (Fortify actions already exist)

database/
├── migrations/
│   └── YYYY_MM_DD_create_photo_submissions_table.php  # NEW - Photo submissions schema
└── factories/
    └── PhotoSubmissionFactory.php              # NEW - Test factory

tests/
└── Feature/
    └── PhotoSubmissionTest.php                 # NEW - Upload feature tests

routes/
└── web.php                                     # MODIFIED - Add upload routes

config/
└── filesystems.php                             # MODIFIED - Photo storage disk

# Frontend (React)
resources/
├── js/
│   ├── Pages/
│   │   └── PhotoUpload.tsx                    # NEW - Upload page
│   ├── components/
│   │   └── photo-upload.tsx                   # NEW - Upload component
│   └── wayfinder/                              # AUTO-GENERATED - Route helpers
└── css/
    └── app.css                                 # (Existing styles)

# Storage
storage/
└── app/
    └── photo-submissions/                      # NEW - Photo storage directory
        ├── new/                                # Organized by status (or by date)
        ├── approved/
        └── declined/
```

**Structure Decision**: This feature follows Laravel 12's standard web application structure with Inertia.js bridging backend and frontend. The photo upload feature adds:
- **Backend**: Model, Controller, Request, Migration, Factory, Tests
- **Frontend**: Page component, Upload component (leveraging existing UI components)
- **Storage**: Dedicated photo-submissions directory in Laravel storage
- **Routes**: RESTful routes in web.php for upload and status retrieval

All new files follow existing conventions established in `CLAUDE.md` and align with the Laravel-First Architecture principle.

## Complexity Tracking

**No violations detected** - Constitution Check passed all gates. This section is intentionally left empty as there are no complexity justifications required.

---

## Post-Design Constitution Re-Check

*GATE: Re-check after Phase 1 design completed*

### Re-Evaluation Results

**Date**: 2025-11-15 (Post-Phase 1 Design)

**Artifacts Reviewed**:
- ✅ research.md - Technology decisions documented
- ✅ data-model.md - Entity structure and relationships defined
- ✅ contracts/photo-submission-api.yaml - API contracts specified
- ✅ quickstart.md - Implementation guide created

### Gate Re-Validation

All 8 constitution gates have been re-evaluated against the design artifacts:

1. **Laravel-First Architecture** ✅ CONFIRMED
   - Migration, Model, Controller, Request all use Laravel conventions
   - Eloquent relationships properly typed
   - Filesystem abstraction for storage

2. **Type Safety & Modern Standards** ✅ CONFIRMED
   - All PHP methods have explicit return types in quickstart examples
   - TypeScript components properly typed
   - Wayfinder integration follows patterns

3. **Test-Driven Development** ✅ CONFIRMED
   - Comprehensive test suite outlined in quickstart
   - Factory created for test data
   - Feature tests cover all scenarios

4. **Component Reusability** ✅ CONFIRMED
   - Reuses existing Radix UI components (Button, Card, Alert, Spinner)
   - Leverages existing hooks (use-appearance)
   - No unnecessary custom components

5. **Inertia Best Practices** ✅ CONFIRMED
   - Uses Inertia::render() in controller
   - Form submission via Inertia Form component
   - Proper prop passing and flash messages

6. **Accessibility & User Experience** ✅ CONFIRMED
   - react-dropzone provides accessible file input
   - Radix UI patterns maintained
   - Theme support via existing hooks
   - Mobile-responsive design

7. **Code Quality & Formatting** ✅ CONFIRMED
   - Formatting commands documented in quickstart
   - Form Request for validation (no inline validation)
   - Eloquent relationships for data access

8. **Security & Authentication** ✅ CONFIRMED
   - Multi-layer file validation (extension + MIME + hash)
   - Files stored outside public directory
   - Authorization checks in controller
   - CSRF protection via Inertia

### Post-Design Status

**Overall Status**: ✅ **ALL GATES STILL PASSING**

**New Violations**: NONE

**Design Deviations**: NONE

**Implementation Readiness**: ✅ APPROVED - Ready for `/speckit.tasks` (Phase 2)
