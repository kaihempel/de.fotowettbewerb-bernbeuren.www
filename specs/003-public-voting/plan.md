# Implementation Plan: Public Photo Voting System with Navigation and Cookie-Based Tracking

**Branch**: `003-public-voting` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-public-voting/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a public-facing photo voting system that allows anonymous users to rate submitted contest photos using a thumbs up/down mechanism. The system tracks users via cookies (fwb_id) to ensure one vote per photo per user, supports vote changes, and provides intuitive navigation between rated and unrated photos. The solution uses Laravel 12 backend with Inertia.js v2 for rendering React 19 pages, implementing cookie-based user identification, database-persisted votes with atomic transactions, and a responsive full-screen photo viewer with optimistic UI updates.

## Technical Context

**Language/Version**: PHP 8.4 (backend), TypeScript (frontend)
**Primary Dependencies**: Laravel 12, Inertia.js v2, React 19, Laravel Fortify, Laravel Wayfinder, Radix UI components
**Storage**: SQLite (development), Laravel filesystem for photos, database for votes
**Testing**: PHPUnit 11 for backend tests
**Target Platform**: Web application (mobile and desktop browsers, 320px-2560px width)
**Project Type**: Web application with backend (Laravel) and frontend (React via Inertia)
**Performance Goals**:
- Vote submission < 3 seconds from page load
- Navigation < 1 second
- Optimistic UI updates immediate, server confirmation < 2 seconds
- Support 100 concurrent visitors without degradation
- < 5% vote submission error rate

**Constraints**:
- Rate limiting: 60 votes per hour per IP address
- Minimum photo rating: 0 (no negative ratings)
- Cookie expiration: 1 year
- Touch targets: minimum 44x44px on mobile
- Responsive: 320px to 2560px screen widths

**Scale/Scope**:
- Expected concurrent users: 100+
- Vote tracking per visitor via browser cookie
- Photos ordered chronologically (oldest first)
- Navigation: next unrated, previous rated
- Progress tracking: X of Y photos rated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Laravel-First Architecture
- **Compliance**: PASS
- Uses `php artisan make:` for all Laravel files (migrations, models, controllers, middleware, requests)
- Middleware registration in `bootstrap/app.php` following Laravel 12 structure
- Eloquent ORM for all database operations with explicit relationship return types
- No direct `env()` calls (configuration files only)

### ✅ II. Type Safety & Modern Standards
- **Compliance**: PASS
- PHP: Explicit return type declarations, constructor property promotion, `casts()` method
- TypeScript: Strict typing enabled, functional components with explicit prop types
- Wayfinder: Named imports for tree-shaking, type-safe route generation
- All control structures use curly braces

### ✅ III. Test-Driven Development (TDD)
- **Compliance**: PASS
- Feature tests for voting logic, navigation, cookie generation, rate limiting
- Unit tests for model methods (getNextUnratedFor, getPreviousRatedFor, updateRate)
- Tests cover happy paths, failure paths, edge cases
- All new functionality has corresponding tests

### ✅ IV. Component Reusability
- **Compliance**: PASS
- Uses existing Radix UI components (Button, Card, Spinner, etc.)
- Check existing components before creating new ones
- All components support dark mode
- Follows Radix UI accessibility patterns

### ✅ V. Inertia Best Practices
- **Compliance**: PASS
- Uses `Inertia::render()` for all routes
- Navigation via `router.visit()` and `<Link>` component
- Uses `<Form>` component for vote submissions (not `useForm` hook)
- Pages in `resources/js/Pages/` directory
- Optimistic UI updates leveraging Inertia v2 features

### ✅ VI. Accessibility & User Experience
- **Compliance**: PASS
- Radix UI patterns for keyboard navigation
- Theme support via `use-appearance` hook
- Responsive design for mobile/tablet/desktop
- Loading states and error handling for async operations
- Toast notifications for user feedback
- Touch-friendly button sizes (44x44px minimum)

### ✅ VII. Code Quality & Formatting
- **Compliance**: PASS
- `vendor/bin/pint --dirty` before finalizing PHP changes
- `npm run lint` before finalizing TypeScript/React changes
- `npm run types` to verify TypeScript compilation
- Form Request classes for validation (no inline validation)
- Eloquent relationships to prevent N+1 queries

### ✅ VIII. Security & Authentication
- **Compliance**: PASS
- Cookie security flags: httpOnly, secure (production), sameSite=lax
- Form Request validation for all user input
- CSRF protection via Inertia `<Form>` component
- Rate limiting to prevent abuse (60 votes/hour per IP)
- Database transactions for atomic vote updates
- No OWASP Top 10 vulnerabilities

**Gate Status**: ✅ ALL GATES PASSED - Proceed to Phase 0

## Post-Design Constitution Re-check

*Performed after Phase 1 design artifacts completion*

### ✅ I. Laravel-First Architecture
- **Re-validated**: PASS
- Migrations use Laravel Schema builder (add_rate_to_photo_submissions, create_photo_votes)
- Models use Eloquent relationships (PhotoSubmission::votes(), PhotoVote::photoSubmission())
- Middleware follows Laravel 12 patterns (EnsureFwbId registered in bootstrap/app.php)
- Form Request validation (VoteRequest)
- No raw SQL queries (all Eloquent)

### ✅ II. Type Safety & Modern Standards
- **Re-validated**: PASS
- All model methods have explicit return types (see data-model.md)
- React components use TypeScript with strict typing (gallery.tsx props interface)
- Wayfinder routes for type-safe navigation
- `casts()` method used in PhotoVote model
- Boolean type for vote_type field

### ✅ III. Test-Driven Development (TDD)
- **Re-validated**: PASS
- Feature tests defined (PublicGalleryTest, PhotoVotingTest)
- Unit tests defined (PhotoSubmissionTest for navigation methods)
- Test factories created (PhotoVoteFactory with states)
- Quickstart includes test-first approach

### ✅ IV. Component Reusability
- **Re-validated**: PASS
- Uses existing Radix UI components (Button, Card referenced in quickstart)
- Component composition (Gallery → PhotoViewer + VotingButtons + PhotoNavigation)
- Dark mode support via existing theme system

### ✅ V. Inertia Best Practices
- **Re-validated**: PASS
- All routes use Inertia::render() (see PublicGalleryController)
- Props-based state management (photo, nextPhoto, previousPhoto, progress)
- Preserves scroll on mutations
- Navigation via router.visit() and router.post()

### ✅ VI. Accessibility & User Experience
- **Re-validated**: PASS
- Keyboard navigation defined (arrow keys in user story)
- Touch-friendly button sizes (44x44px minimum in constraints)
- Responsive design (320px-2560px in technical context)
- Loading states and error handling (optimistic UI with rollback)
- Theme support (existing use-appearance hook)

### ✅ VII. Code Quality & Formatting
- **Re-validated**: PASS
- Quickstart includes formatting steps (pint --dirty, npm run lint)
- Explicit return types in all method signatures
- Form Request classes for validation (VoteRequest)
- Eloquent relationships prevent N+1 (eager loading in research.md)

### ✅ VIII. Security & Authentication
- **Re-validated**: PASS
- Cookie security flags defined (httpOnly, secure, sameSite=lax in research.md)
- CSRF protection (automatic with Inertia forms)
- Form Request validation (VoteRequest)
- Rate limiting (60 votes/hour per IP in routes)
- Database transactions prevent race conditions
- No SQL injection (Eloquent ORM)
- Cascade delete maintains referential integrity

**Final Gate Status**: ✅ ALL GATES PASSED - Design validated, ready for Phase 2 (Tasks)

## Project Structure

### Documentation (this feature)

```text
specs/003-public-voting/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── api.yaml         # OpenAPI specification for voting endpoints
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec quality checklist (already created)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Laravel 12 Web Application Structure

# Backend (Laravel)
app/
├── Http/
│   ├── Controllers/
│   │   └── PublicGalleryController.php    # Gallery display, photo view, vote submission
│   ├── Middleware/
│   │   └── EnsureFwbId.php                 # Cookie-based user identification
│   └── Requests/
│       └── VoteRequest.php                 # Vote validation
├── Models/
│   ├── PhotoSubmission.php                 # Enhanced with vote relationships and navigation methods
│   └── PhotoVote.php                       # New model for tracking votes
└── Actions/
    └── Fortify/
        └── [existing authentication actions]

# Database
database/
├── migrations/
│   ├── [existing]_create_photo_submissions_table.php  # Already exists from feature #2
│   ├── [new]_add_rate_to_photo_submissions.php        # Add rate column
│   └── [new]_create_photo_votes_table.php             # Vote tracking table
└── factories/
    ├── PhotoSubmissionFactory.php          # Already exists
    └── PhotoVoteFactory.php                # New factory for testing

# Frontend (React via Inertia)
resources/
├── js/
│   ├── Pages/
│   │   └── gallery.tsx                     # Main voting page (new)
│   ├── components/
│   │   ├── PhotoViewer.tsx                 # Full-screen photo display (new)
│   │   ├── VotingButtons.tsx               # Thumbs up/down buttons (new)
│   │   ├── PhotoNavigation.tsx             # Previous/next navigation (new)
│   │   └── ui/
│   │       └── [existing Radix UI components]
│   └── wayfinder/
│       └── [auto-generated route helpers]
└── css/
    └── app.css                              # Tailwind CSS v4 styles (existing)

# Configuration
bootstrap/
└── app.php                                  # Middleware registration, routing (updated)

# Routes
routes/
└── web.php                                  # Gallery routes (updated)

# Tests
tests/
├── Feature/
│   ├── PublicGalleryTest.php               # Gallery access, cookie generation, navigation
│   └── PhotoVotingTest.php                 # Voting logic, rate limiting, edge cases
└── Unit/
    └── PhotoSubmissionTest.php             # Model method tests (navigation, rate updates)
```

**Structure Decision**: This is a Laravel 12 web application using Inertia.js v2 to bridge the backend and frontend. The structure follows Laravel 12's streamlined approach with middleware registered in `bootstrap/app.php`, controllers for HTTP logic, models for business logic, and React pages rendered via Inertia. All new files integrate into the existing project structure established by features #1 (photo upload) and #2 (photo review dashboard).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution gates passed.
