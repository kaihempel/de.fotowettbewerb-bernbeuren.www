# Tasks: Photo Management Dashboard with Review Actions and Filtering

**Input**: Design documents from `/specs/002-photo-review-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per NON-NEGOTIABLE TDD principle in constitution. Test tasks are included for all user stories.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Laravel 12 application structure:
- **Backend**: `app/` at repository root
- **Frontend**: `resources/js/` at repository root
- **Tests**: `tests/Feature/`, `tests/Unit/`
- **Database**: `database/migrations/`, `database/factories/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. Verify existing Laravel setup is ready for new feature.

- [ ] T001 Verify existing PhotoSubmission model in app/Models/PhotoSubmission.php has required fields
- [ ] T002 Verify existing User model in app/Models/User.php has authentication setup
- [ ] T003 [P] Verify Intervention Image package installed by checking composer.json for intervention/image-laravel
- [ ] T004 [P] Verify queue system configured by checking config/queue.php connection settings
- [ ] T005 [P] Create feature branch 002-photo-review-dashboard if not already checked out

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database schema and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Migrations

- [ ] T006 Create migration to add role column to users table using php artisan make:migration add_role_to_users_table
- [ ] T007 Create migration to add thumbnail_path column to photo_submissions table using php artisan make:migration add_thumbnail_path_to_photo_submissions
- [ ] T008 Create migration to create audit_logs table using php artisan make:migration create_audit_logs_table
- [ ] T009 Run migrations to apply database changes using php artisan migrate

### Core Models and Policies

- [ ] T010 Create AuditLog model in app/Models/AuditLog.php using php artisan make:model AuditLog
- [ ] T011 Update User model in app/Models/User.php to add role field, is Reviewer(), isAdmin() methods, and auditLogs() relationship
- [ ] T012 Update PhotoSubmission model in app/Models/PhotoSubmission.php to add thumbnail_path, scopes (byStatus, new), and methods (approve, decline)
- [ ] T013 Create PhotoSubmissionPolicy in app/Policies/PhotoSubmissionPolicy.php using php artisan make:policy PhotoSubmissionPolicy --model=PhotoSubmission
- [ ] T014 Register PhotoSubmissionPolicy in bootstrap/app.php by adding policy mapping in withMiddleware callback

### Events and Listeners for Audit Trail

- [ ] T015 [P] Create PhotoApproved event in app/Events/PhotoApproved.php using php artisan make:event PhotoApproved
- [ ] T016 [P] Create PhotoDeclined event in app/Events/PhotoDeclined.php using php artisan make:event PhotoDeclined
- [ ] T017 Create LogPhotoReviewAction listener in app/Listeners/LogPhotoReviewAction.php using php artisan make:listener LogPhotoReviewAction
- [ ] T018 Register event listeners in App\Providers\EventServiceProvider or bootstrap/app.php

### Background Job for Thumbnails

- [ ] T019 Create GeneratePhotoThumbnail job in app/Jobs/GeneratePhotoThumbnail.php using php artisan make:job GeneratePhotoThumbnail
- [ ] T020 Implement thumbnail generation logic using Intervention Image in GeneratePhotoThumbnail job (500px width, 80% quality)

### Factory Updates

- [ ] T021 Update PhotoSubmissionFactory in database/factories/PhotoSubmissionFactory.php to add states for new(), approved(), declined() submissions
- [ ] T022 Update UserFactory in database/factories/UserFactory.php to add reviewer() and admin() states

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Review Pending Photo Submissions (Priority: P1) 🎯 MVP

**Goal**: Authorized reviewers can view a paginated list of all photo submissions with thumbnails, submitter info, and status badges. This is the core dashboard viewing functionality.

**Independent Test**: Log in as a reviewer (user with role='reviewer'), navigate to /dashboard/photos, verify paginated list displays with submissions sorted newest first, showing thumbnails, names, dates, and status badges.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T023 [P] [US1] Create PhotoSubmissionPolicyTest in tests/Feature/PhotoSubmissionPolicyTest.php to test access control (reviewer/admin can access, regular users cannot)
- [ ] T024 [P] [US1] Create PhotoSubmissionControllerTest for index() method in tests/Feature/PhotoSubmissionControllerTest.php to test pagination, authorization, and N+1 query prevention
- [ ] T025 [P] [US1] Create N+1 query detection test in PhotoSubmissionControllerTest to verify eager loading works correctly

### Backend Implementation for User Story 1

- [ ] T026 [US1] Create PhotoSubmissionController in app/Http/Controllers/PhotoSubmissionController.php using php artisan make:controller PhotoSubmissionController
- [ ] T027 [US1] Implement index() method in PhotoSubmissionController with pagination (15 items), eager loading (user, reviewer), and authorization check
- [ ] T028 [US1] Add route for GET /dashboard/photos in routes/web.php with auth middleware and PhotoSubmissionPolicy check
- [ ] T029 [US1] Update HandleInertiaRequests middleware in app/Http/Middleware/HandleInertiaRequests.php to share auth user role

### Frontend Implementation for User Story 1

- [ ] T030 [P] [US1] Create PhotoSubmission TypeScript interface in resources/js/types/index.d.ts for type safety
- [ ] T031 [P] [US1] Create PaginatedData TypeScript interface in resources/js/types/index.d.ts for Laravel pagination structure
- [ ] T032 [P] [US1] Create PhotoSubmissionCard component in resources/js/components/PhotoSubmissionCard.tsx with thumbnail, user info, date, and status badge
- [ ] T033 [US1] Create PhotoSubmissionList component in resources/js/components/PhotoSubmissionList.tsx to render paginated grid/list of cards
- [ ] T034 [US1] Update dashboard page in resources/js/Pages/dashboard.tsx to display PhotoSubmissionList with Inertia data

### Mobile Responsiveness for User Story 1

- [ ] T035 [US1] Add responsive styling to PhotoSubmissionCard component for mobile (vertical stack), tablet (2-column grid), and desktop (3-column grid)
- [ ] T036 [US1] Test mobile layout by resizing browser to 320px width and verifying vertical stack layout

**Checkpoint**: At this point, User Story 1 should be fully functional - reviewers can view paginated submissions with proper authorization

---

## Phase 4: User Story 2 - Approve Photo Submissions (Priority: P1)

**Goal**: Authorized reviewers can approve photo submissions by clicking an "Accept" button. Status changes to "approved" without page reload, reviewer ID and timestamp are recorded, audit log is created.

**Independent Test**: Log in as reviewer, navigate to dashboard, click "Accept" button on a "new" status photo, verify status badge changes to green "approved", action buttons disappear, and audit log entry is created.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T037 [P] [US2] Create test for approve action in PhotoSubmissionControllerTest (test authorization, status change, reviewer recording, timestamp)
- [ ] T038 [P] [US2] Create test for approve event firing in PhotoSubmissionControllerTest to verify PhotoApproved event is dispatched
- [ ] T039 [P] [US2] Create AuditLogTest in tests/Feature/AuditLogTest.php to verify audit log entry created when photo approved

### Backend Implementation for User Story 2

- [ ] T040 [US2] Create ApprovePhotoRequest validation class in app/Http/Requests/ApprovePhotoRequest.php using php artisan make:request ApprovePhotoRequest
- [ ] T041 [US2] Implement approve() method in PhotoSubmissionController with authorization, validation, status update, and event firing
- [ ] T042 [US2] Add route for PATCH /photos/{photoSubmission}/approve in routes/web.php with auth middleware
- [ ] T043 [US2] Implement LogPhotoReviewAction listener logic to create AuditLog entry when PhotoApproved event fires

### Frontend Implementation for User Story 2

- [ ] T044 [P] [US2] Add "Accept" button to PhotoSubmissionCard component (only visible for status="new")
- [ ] T045 [US2] Implement handleApprove function in PhotoSubmissionCard using Inertia Form component for PATCH request
- [ ] T046 [US2] Add success toast notification using existing toast system when approve succeeds
- [ ] T047 [US2] Add error handling and error toast when approve fails
- [ ] T048 [US2] Add loading spinner to Accept button during request using Inertia's processing state

### UI Polish for User Story 2

- [ ] T049 [US2] Update status badge in PhotoSubmissionCard to change color when status changes (green for approved)
- [ ] T050 [US2] Hide action buttons in PhotoSubmissionCard when status is no longer "new"

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - reviewers can view submissions AND approve them

---

## Phase 5: User Story 3 - Decline Photo Submissions (Priority: P1)

**Goal**: Authorized reviewers can decline photo submissions by clicking a "Decline" button. Status changes to "declined" without page reload, reviewer ID and timestamp are recorded, audit log is created.

**Independent Test**: Log in as reviewer, navigate to dashboard, click "Decline" button on a "new" status photo, verify status badge changes to red "declined", action buttons disappear, and audit log entry is created.

### Tests for User Story 3

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T051 [P] [US3] Create test for decline action in PhotoSubmissionControllerTest (test authorization, status change, reviewer recording, timestamp)
- [ ] T052 [P] [US3] Create test for decline event firing in PhotoSubmissionControllerTest to verify PhotoDeclined event is dispatched
- [ ] T053 [P] [US3] Extend AuditLogTest to verify audit log entry created when photo declined

### Backend Implementation for User Story 3

- [ ] T054 [US3] Create DeclinePhotoRequest validation class in app/Http/Requests/DeclinePhotoRequest.php using php artisan make:request DeclinePhotoRequest
- [ ] T055 [US3] Implement decline() method in PhotoSubmissionController with authorization, validation, status update, and event firing
- [ ] T056 [US3] Add route for PATCH /photos/{photoSubmission}/decline in routes/web.php with auth middleware
- [ ] T057 [US3] Update LogPhotoReviewAction listener to handle PhotoDeclined event and create AuditLog entry

### Frontend Implementation for User Story 3

- [ ] T058 [P] [US3] Add "Decline" button to PhotoSubmissionCard component (only visible for status="new")
- [ ] T059 [US3] Implement handleDecline function in PhotoSubmissionCard using Inertia Form component for PATCH request
- [ ] T060 [US3] Add success toast notification when decline succeeds
- [ ] T061 [US3] Add error handling and error toast when decline fails
- [ ] T062 [US3] Add loading spinner to Decline button during request using Inertia's processing state

### UI Polish for User Story 3

- [ ] T063 [US3] Update status badge colors to red for "declined" status in PhotoSubmissionCard
- [ ] T064 [US3] Verify action buttons hidden when status is "approved" or "declined"

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - complete review workflow (view, approve, decline)

---

## Phase 6: User Story 4 - Filter Submissions by Status (Priority: P2)

**Goal**: Reviewers can filter photo submissions by status (all, new, approved, declined) using filter controls. Filter state is preserved in URL parameters and restored when returning to the dashboard.

**Independent Test**: Navigate to dashboard, click "New" filter, verify only new submissions displayed and URL contains ?status=new. Navigate away and return, verify filter restored.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T065 [P] [US4] Create test for status filtering in PhotoSubmissionControllerTest (test ?status=new, ?status=approved, ?status=declined query parameters)
- [ ] T066 [P] [US4] Create test for filter persistence in URL in PhotoSubmissionControllerTest to verify withQueryString() works
- [ ] T067 [P] [US4] Create test for empty state handling when no submissions match filter

### Backend Implementation for User Story 4

- [ ] T068 [US4] Update index() method in PhotoSubmissionController to accept and apply status query parameter using byStatus() scope
- [ ] T069 [US4] Add withQueryString() to pagination call in PhotoSubmissionController index() method to preserve filter params
- [ ] T070 [US4] Add validation for status query parameter (must be null or one of: all, new, approved, declined)

### Frontend Implementation for User Story 4

- [ ] T071 [P] [US4] Create PhotoStatusFilter component in resources/js/components/PhotoStatusFilter.tsx with All/New/Approved/Declined buttons
- [ ] T072 [P] [US4] Create use-photo-filters custom hook in resources/js/hooks/use-photo-filters.ts for filter state management
- [ ] T073 [US4] Update dashboard page in resources/js/Pages/dashboard.tsx to include PhotoStatusFilter component
- [ ] T074 [US4] Implement filter button click handlers to navigate using router.get() with preserveState: true
- [ ] T075 [US4] Add active state styling to selected filter button in PhotoStatusFilter component

### Empty State for User Story 4

- [ ] T076 [US4] Create empty state component or message in PhotoSubmissionList to display when filtered list is empty
- [ ] T077 [US4] Add encouraging message in empty state (e.g., "No declined photos yet. Check back later!")

**Checkpoint**: At this point, filtering should work and integrate seamlessly with previous user stories

---

## Phase 7: User Story 5 - Navigate Through Paginated Results (Priority: P2)

**Goal**: Reviewers can navigate through pages of submissions using pagination controls (Previous, Next, page numbers). Filter state is maintained across page navigation, and scroll position is preserved.

**Independent Test**: Navigate to dashboard with 30+ submissions, verify pagination controls appear, click page 2, verify page 2 loads with correct submissions, verify filter persists across page changes.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T078 [P] [US5] Create test for pagination in PhotoSubmissionControllerTest (verify 15 items per page, meta data correct)
- [ ] T079 [P] [US5] Create test for pagination with filtering in PhotoSubmissionControllerTest (verify filter + pagination work together)
- [ ] T080 [P] [US5] Create test for invalid page parameters in PhotoSubmissionControllerTest (verify graceful handling)

### Backend Implementation for User Story 5

- [ ] T081 [US5] Verify pagination already implemented in index() method (completed in T027) - no changes needed
- [ ] T082 [US5] Verify withQueryString() preserves page parameter along with status filter - no changes needed

### Frontend Implementation for User Story 5

- [ ] T083 [US5] Add pagination controls to PhotoSubmissionList component using Inertia's pagination links
- [ ] T084 [US5] Style pagination controls with Radix UI components (Button for prev/next, active page indicator)
- [ ] T085 [US5] Implement page navigation using Inertia router.visit() with preserveState: true to maintain filter state
- [ ] T086 [US5] Add preserveScroll: true to pagination navigation to maintain scroll position
- [ ] T087 [US5] Test pagination on mobile devices to ensure touch-friendly button sizes

**Checkpoint**: All user stories complete - full photo review dashboard with viewing, approving, declining, filtering, and pagination

---

## Phase 8: Concurrent Review Indicators & Audit Trail Display

**Purpose**: Implement last-write-wins with visual indicators showing previous reviewers (as clarified in spec)

### Tests for Audit Trail Features

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T088 [P] Create test for concurrent review scenario in PhotoSubmissionControllerTest (two reviewers approve same photo)
- [ ] T089 [P] Create test for audit trail display in PhotoSubmissionControllerTest (verify review history returned with submissions)

### Backend Implementation

- [ ] T090 Include audit logs in index() response in PhotoSubmissionController using auditLogs() relationship with eager loading
- [ ] T091 Add auditLogs() relationship to PhotoSubmission model with latest() ordering

### Frontend Implementation

- [ ] T092 [P] Create AuditTrailIndicator component in resources/js/components/AuditTrailIndicator.tsx to show previous reviewer name and timestamp
- [ ] T093 Add AuditTrailIndicator to PhotoSubmissionCard component to display when photo has been previously reviewed
- [ ] T094 Style AuditTrailIndicator with subtle colors and Tooltip component to show full review history on hover

**Checkpoint**: Concurrent review handling complete with visual feedback

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, performance optimization, and final validation

### Code Quality & Formatting

- [ ] T095 [P] Run Laravel Pint on all PHP files using vendor/bin/pint --dirty to format code
- [ ] T096 [P] Run ESLint and Prettier on frontend files using npm run lint to fix TypeScript/React issues
- [ ] T097 [P] Run TypeScript type checker using npm run types to verify no type errors

### Performance Optimization

- [ ] T098 Verify N+1 queries prevented by running Laravel Debugbar and checking query count on dashboard page (should be ≤ 5 queries)
- [ ] T099 Add database indexes for status, created_at, reviewed_by columns in photo_submissions table if not already present
- [ ] T100 Verify thumbnail generation happens in background queue by checking queue:work processes GeneratePhotoThumbnail jobs

### Testing & Validation

- [ ] T101 Run full PHPUnit test suite using php artisan test to verify all tests pass
- [ ] T102 Test authorization edge cases (user without reviewer role cannot access dashboard, cannot approve/decline)
- [ ] T103 Test mobile responsiveness at 320px, 768px, 1024px, and 2560px widths
- [ ] T104 Test dark mode support using existing use-appearance hook to ensure proper contrast and readability

### Documentation

- [ ] T105 Update CLAUDE.md Active Technologies section with new feature components if needed
- [ ] T106 Verify quickstart.md instructions work by following step-by-step guide

### Final Validation Against Success Criteria

- [ ] T107 Verify SC-001: Dashboard loads in < 1 second (measure with browser DevTools)
- [ ] T108 Verify SC-002: Approve/decline actions complete in < 10 seconds on average
- [ ] T109 Verify SC-003: Dashboard handles 1000+ submissions without performance degradation (seed 1000 records and test)
- [ ] T110 Verify SC-004: Page navigation and filtering complete without full page reloads (check Inertia behavior)
- [ ] T111 Verify SC-005: Mobile usability score 90%+ using Lighthouse mobile audit
- [ ] T112 Verify SC-006: Dashboard displays correctly from 320px to 2560px width (manual testing)
- [ ] T113 Verify SC-007: Zero N+1 query issues using Laravel Debugbar (≤ 5 queries per page load)
- [ ] T114 Verify SC-008: Authorization prevents unauthorized access with 100% success rate (test as regular user)
- [ ] T115 Verify SC-009: Filter state persists via URL (bookmark ?status=new and revisit)
- [ ] T116 Verify SC-010: Empty states and error messages are clear and actionable
- [ ] T117 Verify SC-011: Audit trail records all review actions with reviewer info and timestamps

**Checkpoint**: Feature complete, tested, and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel if team capacity allows
  - Or sequentially in priority order: US1 (P1) → US2 (P1) → US3 (P1) → US4 (P2) → US5 (P2)
- **Concurrent Review (Phase 8)**: Depends on US1, US2, US3 completion
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Requires US1 dashboard for testing but independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Requires US1 dashboard for testing but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable

### Within Each User Story

Per TDD principle (NON-NEGOTIABLE):
1. **Tests FIRST** - Write tests and ensure they FAIL before implementing
2. **Models** - Create/update models and policies
3. **Backend** - Implement controller methods and routes
4. **Frontend** - Create React components and hooks
5. **Integration** - Connect frontend to backend
6. **Validation** - Verify story works independently

### Parallel Opportunities

- **Phase 1 (Setup)**: T003, T004 can run in parallel
- **Phase 2 (Foundational)**:
  - T015, T016 (events) can run in parallel
  - T021, T022 (factories) can run in parallel after models complete
- **Phase 3 (US1)**:
  - T023, T024, T025 (tests) can run in parallel
  - T030, T031, T032 (TypeScript types and components) can run in parallel after backend routes exist
- **Phase 4 (US2)**:
  - T037, T038, T039 (tests) can run in parallel
  - T044 (button UI) can run in parallel with backend work
- **Phase 5 (US3)**:
  - T051, T052, T053 (tests) can run in parallel
  - T058 (button UI) can run in parallel with backend work
- **Phase 6 (US4)**:
  - T065, T066, T067 (tests) can run in parallel
  - T071, T072 (filter UI components) can run in parallel
- **Phase 7 (US5)**:
  - T078, T079, T080 (tests) can run in parallel
- **Phase 8 (Concurrent Review)**:
  - T088, T089 (tests) can run in parallel
  - T092 (indicator component) can run in parallel with backend
- **Phase 9 (Polish)**:
  - T095, T096, T097 (code formatting) can run in parallel
  - Many validation tasks (T107-T117) can run in parallel

**Different user stories can be worked on in parallel by different team members after Phase 2 completes**

---

## Parallel Example: User Story 1

```bash
# Write all tests for User Story 1 together (FIRST):
parallel --jobs 3 ::: \
  "Task T023: Create PhotoSubmissionPolicyTest in tests/Feature/PhotoSubmissionPolicyTest.php" \
  "Task T024: Create PhotoSubmissionControllerTest in tests/Feature/PhotoSubmissionControllerTest.php" \
  "Task T025: Create N+1 query detection test in PhotoSubmissionControllerTest"

# After backend routes exist, create all TypeScript types/components together:
parallel --jobs 3 ::: \
  "Task T030: Create PhotoSubmission interface in resources/js/types/index.d.ts" \
  "Task T031: Create PaginatedData interface in resources/js/types/index.d.ts" \
  "Task T032: Create PhotoSubmissionCard component in resources/js/components/PhotoSubmissionCard.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Write all tests for User Story 2 together (FIRST):
parallel --jobs 3 ::: \
  "Task T037: Create test for approve action in PhotoSubmissionControllerTest" \
  "Task T038: Create test for approve event firing in PhotoSubmissionControllerTest" \
  "Task T039: Create AuditLogTest in tests/Feature/AuditLogTest.php"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T022) **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T023-T036)
4. **STOP and VALIDATE**: Test dashboard viewing as reviewer
5. Deploy/demo if ready (basic dashboard viewing works)

### Incremental Delivery (Recommended)

1. **Foundation** (Phases 1-2): Setup + Database + Core models → Foundation ready
2. **MVP** (Phase 3): User Story 1 → Test independently → Deploy/Demo
   - Reviewers can now view submissions in dashboard
3. **V1.1** (Phase 4): + User Story 2 → Test independently → Deploy/Demo
   - Reviewers can now view AND approve submissions
4. **V1.2** (Phase 5): + User Story 3 → Test independently → Deploy/Demo
   - Complete review workflow (view, approve, decline)
5. **V1.3** (Phase 6): + User Story 4 → Test independently → Deploy/Demo
   - Enhanced with filtering for efficiency
6. **V1.4** (Phase 7): + User Story 5 → Test independently → Deploy/Demo
   - Pagination for scalability
7. **V2.0** (Phases 8-9): Audit trail + Polish → Full production release

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers after Phase 2 completes:

- **Developer A**: User Story 1 (T023-T036) - Dashboard viewing
- **Developer B**: User Story 2 (T037-T050) - Approve functionality
- **Developer C**: User Story 3 (T051-T064) - Decline functionality

Stories complete independently, then integrate and test together.

---

## Task Summary

**Total Tasks**: 117
**Test Tasks**: 25 (TDD required per constitution)
**Parallelizable Tasks**: 35 (marked with [P])

### Tasks by User Story

- **Setup (Phase 1)**: 5 tasks
- **Foundational (Phase 2)**: 17 tasks (blocks all user stories)
- **User Story 1 (P1)**: 14 tasks (T023-T036) - View submissions
- **User Story 2 (P1)**: 14 tasks (T037-T050) - Approve submissions
- **User Story 3 (P1)**: 14 tasks (T051-T064) - Decline submissions
- **User Story 4 (P2)**: 13 tasks (T065-T077) - Filter by status
- **User Story 5 (P2)**: 10 tasks (T078-T087) - Pagination
- **Concurrent Review (Phase 8)**: 7 tasks (T088-T094) - Audit trail display
- **Polish (Phase 9)**: 23 tasks (T095-T117) - Code quality, performance, validation

### Independent Test Criteria

- **US1**: Log in as reviewer, navigate to /dashboard/photos, verify paginated list displays
- **US2**: Click "Accept" on new photo, verify status changes to approved, audit log created
- **US3**: Click "Decline" on new photo, verify status changes to declined, audit log created
- **US4**: Click filter buttons, verify list updates and URL preserves filter state
- **US5**: Navigate between pages, verify filter persists and scroll position preserved

### Suggested MVP Scope

**Minimum**: Phases 1, 2, 3 (User Story 1 only)
- Reviewers can view submissions in a dashboard
- 36 tasks total (Setup + Foundational + US1)

**Recommended**: Phases 1, 2, 3, 4, 5 (US1, US2, US3)
- Complete review workflow (view, approve, decline)
- 64 tasks total
- Delivers core value for photo moderation

---

## Notes

- [P] tasks = different files, no dependencies within same phase
- [Story] label maps task to specific user story for traceability and MVP scoping
- Each user story is independently completable and testable per spec requirements
- TDD approach required per NON-NEGOTIABLE constitution principle
- Verify tests fail before implementing (Red → Green → Refactor)
- Run `vendor/bin/pint --dirty` and `npm run lint` before committing
- Stop at any checkpoint to validate story works independently
- Constitution compliance verified in plan.md - all principles satisfied
