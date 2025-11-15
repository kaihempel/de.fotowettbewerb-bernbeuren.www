# Implementation Plan: Photo Review Dashboard

**Branch**: `002-photo-review-dashboard` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-photo-review-dashboard/spec.md`

## Summary

This feature implements a comprehensive Photo Management Dashboard that allows authorized reviewers (users with "reviewer" or "admin" role) to view, approve, and decline photo submissions for the photo contest. The dashboard provides paginated listing with status filtering, real-time status updates via Inertia.js, and complete audit trail for all review actions.

**Technical Approach**: Leverage Laravel 12's authorization system with Policies and Gates for role-based access control. Use Intervention Image (already installed) for thumbnail generation via queued background jobs. Implement audit trail using event-driven architecture with dedicated audit_logs table. Prevent N+1 queries through strategic eager loading with column selection. Maintain filter state in URL parameters using Laravel's `withQueryString()` combined with Inertia's state preservation.

## Technical Context

**Language/Version**: PHP 8.4
**Primary Dependencies**: Laravel 12, Inertia.js v2, Laravel Fortify, Laravel Wayfinder, Intervention Image (`intervention/image-laravel`)
**Frontend Stack**: React 19, TypeScript, Tailwind CSS v4, Radix UI components
**Storage**: SQLite (development), Laravel filesystem (local disk for photos, supports S3 for production)
**Testing**: PHPUnit 11
**Target Platform**: Web application (responsive design for mobile/tablet/desktop)
**Project Type**: Web application with Laravel backend + React frontend via Inertia.js
**Performance Goals**:
- Dashboard page load < 1 second
- Approve/decline actions < 10 seconds average
- Support 1000+ submissions without degradation
- Zero N+1 query issues (verified via Laravel Debugbar)

**Constraints**:
- Must use existing tech stack (no new major dependencies)
- Role-based authorization required ("reviewer" or "admin" roles)
- Last-write-wins for concurrent reviews with visual indicators
- Thumbnails 400-600px width for balance of quality/performance
- Indefinite data retention for audit purposes

**Scale/Scope**:
- Support 1000+ photo submissions
- 15-20 items per page pagination
- 3 status values (new, approved, declined)
- 3 user roles (user, reviewer, admin)
- Mobile usability score 90%+

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Laravel-First Architecture
- **Status**: PASS
- **Evidence**: Uses Laravel 12's Eloquent ORM, Policies, Gates, Events, Queues, and migrations
- **Actions**: Will use `php artisan make:` commands for all Laravel files
- **Compliance**: Fully aligned with Laravel 12 bootstrap structure

### ✅ II. Type Safety & Modern Standards
- **Status**: PASS
- **Evidence**:
  - PHP: Explicit return types, `casts()` method, constructor promotion
  - TypeScript: Strict typing, functional components, prop interfaces
  - Wayfinder: Named imports for type-safe routing
- **Actions**: All new code will maintain type safety standards
- **Compliance**: NON-NEGOTIABLE principle fully enforced

### ✅ III. Test-Driven Development (TDD)
- **Status**: PASS
- **Evidence**: Will include comprehensive PHPUnit tests for:
  - Authorization (PolicyTest)
  - Review actions (PhotoSubmissionControllerTest)
  - Audit logging (AuditLogTest)
  - N+1 query detection
- **Actions**: Tests will be written for all new features
- **Compliance**: NON-NEGOTIABLE principle fully enforced

### ✅ IV. Component Reusability
- **Status**: PASS
- **Evidence**: Will reuse existing Radix UI components:
  - Button, Badge, Card for UI
  - Dialog, Tooltip for interactions
  - Spinner for loading states
- **Actions**: Check `resources/js/components/ui/` before creating new components
- **Compliance**: Aligned with existing component library

### ✅ V. Inertia Best Practices
- **Status**: PASS
- **Evidence**:
  - Use `Inertia::render()` in controller
  - `<Form>` component for approve/decline actions
  - `router.visit()` for filter navigation with `preserveState: true`
  - Proper shared data via HandleInertiaRequests middleware
- **Actions**: Follow Inertia v2 patterns for all frontend interactions
- **Compliance**: Fully aligned with Inertia.js v2

### ✅ VI. Accessibility & User Experience
- **Status**: PASS
- **Evidence**:
  - Radix UI components provide ARIA labels and keyboard navigation
  - Responsive design (mobile-first approach)
  - Dark mode support via existing `use-appearance` hook
  - Loading states and error handling
  - Toast notifications for feedback
- **Actions**: Maintain accessibility in all new components
- **Compliance**: Aligned with accessibility requirements

### ✅ VII. Code Quality & Formatting
- **Status**: PASS
- **Evidence**: Will run before finalizing:
  - `vendor/bin/pint --dirty` for PHP
  - `npm run lint` for TypeScript/React
  - `npm run types` for type checking
- **Actions**: Format all code before commits
- **Compliance**: NON-NEGOTIABLE principle fully enforced

### ✅ VIII. Security & Authentication
- **Status**: PASS
- **Evidence**:
  - Laravel Fortify for authentication
  - Policies for authorization (prevent IDOR)
  - Form Request validation classes
  - CSRF protection via Inertia forms
  - No direct SQL injection vulnerabilities
- **Actions**: Follow security best practices for all features
- **Compliance**: Security requirements met

**Overall Constitution Compliance**: ✅ PASS - All principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-photo-review-dashboard/
├── spec.md                           # Feature specification
├── plan.md                           # This file (implementation plan)
├── research.md                       # Phase 0 research findings
├── data-model.md                     # Phase 1 data model design
├── quickstart.md                     # Phase 1 getting started guide
├── contracts/                        # Phase 1 API contracts
│   └── photo-submission-api.yaml     # OpenAPI spec for review endpoints
├── PHOTO_REVIEW_DASHBOARD_RESEARCH.md    # Detailed technical research
├── PHOTO_REVIEW_QUICK_REFERENCE.md       # Quick reference guide
└── PHOTO_REVIEW_RESEARCH_INDEX.md        # Research index/navigation
```

### Source Code (Laravel 12 application structure)

```text
app/
├── Http/
│   ├── Controllers/
│   │   └── PhotoSubmissionController.php    # Review dashboard controller (NEW)
│   ├── Middleware/
│   │   └── HandleInertiaRequests.php        # Shares auth user data (EXISTS)
│   └── Requests/
│       ├── ApprovePhotoRequest.php          # Validation for approve action (NEW)
│       └── DeclinePhotoRequest.php          # Validation for decline action (NEW)
├── Models/
│   ├── PhotoSubmission.php                  # Existing model (UPDATE)
│   ├── User.php                             # Existing model (UPDATE - add role)
│   └── AuditLog.php                         # Audit trail model (NEW)
├── Policies/
│   └── PhotoSubmissionPolicy.php            # Authorization policy (NEW)
├── Events/
│   ├── PhotoApproved.php                    # Event fired on approval (NEW)
│   └── PhotoDeclined.php                    # Event fired on decline (NEW)
├── Listeners/
│   └── LogPhotoReviewAction.php             # Audit log listener (NEW)
└── Jobs/
    └── GeneratePhotoThumbnail.php           # Background thumbnail generation (NEW)

database/
├── migrations/
│   ├── YYYY_MM_DD_add_role_to_users_table.php           # Add role column (NEW)
│   ├── YYYY_MM_DD_add_thumbnail_to_photo_submissions.php # Add thumbnail path (NEW)
│   └── YYYY_MM_DD_create_audit_logs_table.php           # Audit trail table (NEW)
└── factories/
    └── PhotoSubmissionFactory.php            # Existing factory (UPDATE - add states)

resources/
├── js/
│   ├── Pages/
│   │   └── dashboard.tsx                     # Existing dashboard (UPDATE)
│   ├── components/
│   │   ├── PhotoSubmissionList.tsx           # Submission list component (NEW)
│   │   ├── PhotoSubmissionCard.tsx           # Individual card component (NEW)
│   │   ├── PhotoStatusFilter.tsx             # Status filter component (NEW)
│   │   └── AuditTrailIndicator.tsx           # Shows review history (NEW)
│   └── hooks/
│       └── use-photo-filters.ts              # Filter state management (NEW)
└── css/
    └── app.css                                # Existing styles (no changes needed)

routes/
└── web.php                                    # Add dashboard routes (UPDATE)

tests/
├── Feature/
│   ├── PhotoSubmissionControllerTest.php     # Controller tests (NEW)
│   ├── PhotoSubmissionPolicyTest.php         # Policy tests (NEW)
│   └── AuditLogTest.php                      # Audit trail tests (NEW)
└── Unit/
    └── PhotoSubmissionTest.php                # Model unit tests (NEW)

bootstrap/
└── app.php                                    # Register policies and gates (UPDATE)

config/
└── filesystems.php                            # Existing config (verify photo disk)
```

**Structure Decision**: Laravel 12 web application structure leveraging existing Inertia.js + React frontend. New backend components (controller, policy, events, jobs) follow Laravel conventions. Frontend components extend existing React architecture with new dashboard-specific components. All files created using `php artisan make:` commands per constitution requirement.

## Complexity Tracking

**No violations** - All constitution requirements satisfied without exceptions.

---

## Phase 0: Research Findings

**Status**: ✅ COMPLETE

Comprehensive research completed covering 5 critical areas. All findings documented in `research.md` and supporting files.

### Key Research Decisions

1. **Image Thumbnail Generation**
   - Decision: Generate during upload with queued background job
   - Tool: Intervention Image (already installed: `intervention/image-laravel`)
   - Approach: Event-driven → Queue job → 500px width @ 80% quality
   - Rationale: Pre-generated thumbnails load faster, queue prevents blocking

2. **Role-Based Authorization**
   - Decision: Policies + Role Column (enum: user/reviewer/admin) + Gates
   - Approach: PhotoSubmissionPolicy for model rules, Gate for access checks
   - Rationale: Scalable, Laravel conventions, zero new packages

3. **Pagination with Filtering**
   - Decision: Laravel's `withQueryString()` + URL parameters + Inertia `preserveState`
   - Approach: Filters in URL for bookmarkability, React state for UX
   - Rationale: Browser back/forward works, shareable URLs, tested pattern

4. **Audit Trail Implementation**
   - Decision: Custom solution with Events + Dedicated `audit_logs` table
   - Approach: Event-driven architecture (PhotoApproved/Declined → LogPhotoReviewAction)
   - Rationale: Lightweight (~150 lines), flexible, aligns with existing patterns

5. **N+1 Query Prevention**
   - Decision: Eager loading with column selection + lazy load prevention
   - Approach: `with(['user:id,name', 'reviewer:id,name'])` on queries
   - Rationale: 2-4 queries per request, Debugbar catches mistakes, guaranteed performance

### Research Artifacts

- `research.md` - Executive summary of findings
- `PHOTO_REVIEW_DASHBOARD_RESEARCH.md` - Detailed technical documentation (36 KB, 1053 lines)
- `PHOTO_REVIEW_QUICK_REFERENCE.md` - Quick reference with code snippets (11 KB, 459 lines)
- `PHOTO_REVIEW_RESEARCH_INDEX.md` - Navigation guide for research docs

---

## Phase 1: Design & Contracts

**Status**: 🔄 IN PROGRESS

### Data Model Design

See `data-model.md` for complete entity relationship diagrams and schema definitions.

**Key Entities**:
1. **User** (existing, updated)
   - Add `role` enum column: user, reviewer, admin
   - Existing relationships: photoSubmissions(), reviewedSubmissions()

2. **PhotoSubmission** (existing, updated)
   - Add `thumbnail_path` column for generated thumbnails
   - Existing columns: status, reviewed_by, reviewed_at
   - Add scopes: byStatus(), new(), recent()
   - Add methods: approve(), decline()

3. **AuditLog** (new)
   - Polymorphic relationship to auditable models
   - Tracks: action_type, user_id, changes, ip_address, timestamp
   - Provides complete review history

### API Contracts

See `contracts/photo-submission-api.yaml` for full OpenAPI specification.

**Core Endpoints**:

```
GET    /dashboard/photos
       - List paginated submissions with filtering
       - Query params: status, page
       - Response: paginated photo submissions with user/reviewer data

PATCH  /photos/{id}/approve
       - Approve a photo submission
       - Authorization: reviewer or admin role required
       - Response: updated submission with success message

PATCH  /photos/{id}/decline
       - Decline a photo submission
       - Authorization: reviewer or admin role required
       - Response: updated submission with success message
```

### Quickstart Guide

See `quickstart.md` for step-by-step implementation instructions.

**Implementation Phases**:
1. Database setup (migrations, seeders)
2. Backend implementation (models, policies, controllers)
3. Frontend components (React/TypeScript)
4. Testing and validation

---

## Phase 2: Task Breakdown

**Status**: ⏸️ PENDING

Task breakdown will be generated using `/speckit.tasks` command after plan approval.

Expected task categories:
- Database migrations and schema updates
- Model updates and relationship definitions
- Policy and authorization implementation
- Controller and route setup
- Frontend component development
- Testing implementation
- Documentation updates

---

## Success Criteria Mapping

Each success criterion from the spec maps to specific implementation components:

- **SC-001** (1 second page load): Eager loading + pagination + thumbnail pre-generation
- **SC-002** (10 second review time): Inertia state preservation + optimistic UI updates
- **SC-003** (1000+ submissions): Pagination + query optimization + indexes
- **SC-004** (No page reloads): Inertia.js router with preserveState
- **SC-005** (90% mobile score): Radix UI + Tailwind responsive design
- **SC-006** (320px-2560px support): Mobile-first CSS + breakpoints
- **SC-007** (Zero N+1): Eager loading with column selection + Debugbar verification
- **SC-008** (100% auth success): Policy enforcement + middleware + gates
- **SC-009** (Filter persistence): URL query parameters + withQueryString()
- **SC-010** (Clear messages): Error handling + toast notifications
- **SC-011** (Complete audit trail): AuditLog model + event listeners

---

## Dependencies

### External Dependencies (already in project)
- `intervention/image-laravel` - Image manipulation and thumbnail generation
- Laravel Queue system (built-in) - Background job processing
- Laravel Events (built-in) - Event-driven audit logging
- Inertia.js v2 - Frontend/backend bridge
- React 19 - UI framework
- Radix UI - Component library

### Internal Dependencies
- **Blocks**: None
- **Blocked By**: Issue #1 - Photo Upload System (COMPLETED per CLAUDE.md)
- **Related**: PhotoSubmission model exists with basic status field
- **Requires**: User authentication system (Laravel Fortify - already configured)

### Database Dependencies
- `users` table exists with Fortify fields
- `photo_submissions` table exists from Issue #1
- Need to add: `role` column to users, `thumbnail_path` to photo_submissions, new `audit_logs` table

---

## Risk Assessment

### Technical Risks

1. **Queue System Setup** (Low Risk)
   - Mitigation: Document queue configuration, provide supervisor config
   - Fallback: Synchronous thumbnail generation if queue not available

2. **Concurrent Review Conflicts** (Medium Risk)
   - Mitigation: Last-write-wins with visual indicators (as specified)
   - Testing: Concurrent request tests to verify behavior

3. **N+1 Query Performance** (Low Risk)
   - Mitigation: Eager loading + Debugbar monitoring + automated tests
   - Validation: Performance tests verify < 5 queries per page load

### Implementation Risks

1. **Migration Conflicts** (Low Risk)
   - Mitigation: Test migrations on fresh database copy before production
   - Rollback: All migrations reversible with down() methods

2. **Authorization Edge Cases** (Low Risk)
   - Mitigation: Comprehensive policy tests covering all scenarios
   - Review: Policy tests must achieve 100% code coverage

---

## Next Steps

1. **Review this plan** - Validate technical approach and architecture
2. **Generate tasks** - Run `/speckit.tasks` to create detailed implementation tasks
3. **Begin implementation** - Start with Phase 1 database migrations
4. **Iterative testing** - Test each component as implemented per TDD principles

---

**Plan Version**: 1.0
**Last Updated**: 2025-11-15
**Status**: Ready for task generation
