# Tasks: Public Photo Voting System with Navigation and Cookie-Based Tracking

**Input**: Design documents from `/specs/003-public-voting/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are REQUIRED (TDD is non-negotiable per constitution Principle III)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Laravel 12 web application structure:
- **Backend**: `app/` (Models, Controllers, Middleware, Requests)
- **Database**: `database/migrations/`, `database/factories/`
- **Frontend**: `resources/js/` (Pages, components)
- **Configuration**: `bootstrap/app.php`, `routes/web.php`
- **Tests**: `tests/Feature/`, `tests/Unit/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification that base structure exists

- [ ] T001 Verify Laravel 12 project structure is ready (app/, resources/, routes/, tests/)
- [ ] T002 [P] Verify PhotoSubmission model exists from feature #2 (app/Models/PhotoSubmission.php)
- [ ] T003 [P] Verify photo approval workflow is functional from feature #2

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Schema (Foundational)

- [ ] T004 Create migration to add rate column to photo_submissions table in database/migrations/YYYY_MM_DD_HHMMSS_add_rate_to_photo_submissions_table.php
- [ ] T005 Create migration for photo_votes table in database/migrations/YYYY_MM_DD_HHMMSS_create_photo_votes_table.php
- [ ] T006 Run migrations to create database schema (php artisan migrate)

### Core Models (Foundational)

- [ ] T007 [P] Create PhotoVote model in app/Models/PhotoVote.php with relationships, casts, and constants
- [ ] T008 [P] Create PhotoVoteFactory in database/factories/PhotoVoteFactory.php with thumbsUp(), thumbsDown(), and forVisitor() states
- [ ] T009 Enhance PhotoSubmission model in app/Models/PhotoSubmission.php with votes() relationship

### Middleware & Cookie Infrastructure (Foundational)

- [ ] T010 Create EnsureFwbId middleware in app/Http/Middleware/EnsureFwbId.php for cookie generation
- [ ] T011 Register EnsureFwbId middleware in bootstrap/app.php web middleware group
- [ ] T012 Share fwb_id with Inertia pages in app/Http/Middleware/HandleInertiaRequests.php

### Rate Limiting Configuration (Foundational)

- [ ] T013 Configure rate limiter for votes (60/hour per IP) in bootstrap/app.php using RateLimiter facade

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Anonymous Photo Rating (Priority: P1) 🎯 MVP

**Goal**: Enable anonymous visitors to vote thumbs up/down on photos with persistent cookie tracking

**Independent Test**: Display a single photo with voting buttons, allow a vote to be cast, verify the vote is recorded and reflected in the photo's total rating

### Tests for User Story 1 (Write these FIRST, ensure they FAIL)

- [ ] T014 [P] [US1] Create PublicGalleryTest in tests/Feature/PublicGalleryTest.php with test_fwb_id_cookie_generated_on_first_request()
- [ ] T015 [P] [US1] Add test_can_view_approved_photo() to tests/Feature/PublicGalleryTest.php
- [ ] T016 [P] [US1] Create PhotoVotingTest in tests/Feature/PhotoVotingTest.php with test_can_vote_thumbs_up_on_photo()
- [ ] T017 [P] [US1] Add test_can_vote_thumbs_down_on_photo() to tests/Feature/PhotoVotingTest.php
- [ ] T018 [P] [US1] Add test_can_change_vote_from_up_to_down() to tests/Feature/PhotoVotingTest.php
- [ ] T019 [P] [US1] Add test_can_change_vote_from_down_to_up() to tests/Feature/PhotoVotingTest.php
- [ ] T020 [P] [US1] Add test_same_vote_twice_does_not_change_rate() to tests/Feature/PhotoVotingTest.php
- [ ] T021 [P] [US1] Add test_rate_never_goes_below_zero() to tests/Feature/PhotoVotingTest.php
- [ ] T022 [P] [US1] Add test_unique_constraint_prevents_duplicate_votes() to tests/Feature/PhotoVotingTest.php
- [ ] T023 [P] [US1] Add test_unapproved_photos_not_accessible() to tests/Feature/PublicGalleryTest.php

### Implementation for User Story 1

- [ ] T024 [US1] Add getNextUnratedFor() method to PhotoSubmission model in app/Models/PhotoSubmission.php
- [ ] T025 [US1] Add getPreviousRatedFor() method to PhotoSubmission model in app/Models/PhotoSubmission.php
- [ ] T026 [US1] Add updateRate() method to PhotoSubmission model in app/Models/PhotoSubmission.php
- [ ] T027 [US1] Add getUserVote() method to PhotoSubmission model in app/Models/PhotoSubmission.php
- [ ] T028 Create VoteRequest form request in app/Http/Requests/VoteRequest.php with vote_type validation
- [ ] T029 Create PublicGalleryController in app/Http/Controllers/PublicGalleryController.php with index(), show(), vote() methods
- [ ] T030 [US1] Implement vote() method with database transaction logic in app/Http/Controllers/PublicGalleryController.php
- [ ] T031 [US1] Add logging for vote operations (success/fail) in app/Http/Controllers/PublicGalleryController.php
- [ ] T032 Add gallery routes to routes/web.php (GET /gallery, GET /gallery/{photoSubmission}, POST /gallery/{photoSubmission}/vote)
- [ ] T033 Apply throttle:votes middleware to vote route in routes/web.php
- [ ] T034 [P] [US1] Create Gallery.tsx page in resources/js/Pages/Gallery.tsx with photo display and vote submission logic
- [ ] T035 [P] [US1] Create PhotoViewer.tsx component in resources/js/components/PhotoViewer.tsx for full-screen photo display
- [ ] T036 [P] [US1] Create VotingButtons.tsx component in resources/js/components/VotingButtons.tsx with thumbs up/down buttons
- [ ] T037 [US1] Implement optimistic UI updates with retry/rollback logic in resources/js/Pages/Gallery.tsx
- [ ] T038 [US1] Run tests for User Story 1 (php artisan test tests/Feature/PublicGalleryTest.php tests/Feature/PhotoVotingTest.php)
- [ ] T039 [US1] Fix any failing tests until all User Story 1 tests pass

**Checkpoint**: User Story 1 should be fully functional - visitors can vote on photos with persistent cookie tracking

---

## Phase 4: User Story 4 - Persistent Voting Identity (Priority: P1)

**Goal**: Ensure visitor voting history persists across browser sessions via secure 1-year cookie

**Independent Test**: Vote on photos, close browser, reopen it, verify voted photos still show previous votes and prevent duplicate voting

**Note**: This story's infrastructure was built in Foundational phase (EnsureFwbId middleware). These tasks validate and test the persistence behavior.

### Tests for User Story 4 (Write these FIRST)

- [ ] T040 [P] [US4] Add test_cookie_persists_across_requests() to tests/Feature/PublicGalleryTest.php
- [ ] T041 [P] [US4] Add test_cookie_expires_after_one_year() to tests/Feature/PublicGalleryTest.php
- [ ] T042 [P] [US4] Add test_votes_persist_across_sessions() to tests/Feature/PhotoVotingTest.php
- [ ] T043 [P] [US4] Add test_expired_cookie_allows_revoting() to tests/Feature/PhotoVotingTest.php

### Implementation for User Story 4

- [ ] T044 [US4] Verify cookie security flags (httpOnly, secure in prod, sameSite=lax) in app/Http/Middleware/EnsureFwbId.php
- [ ] T045 [US4] Test cookie persistence manually (vote, close browser, reopen, verify)
- [ ] T046 [US4] Run tests for User Story 4 (php artisan test --filter="test_cookie|test_votes_persist")
- [ ] T047 [US4] Fix any failing tests until all User Story 4 tests pass

**Checkpoint**: User Story 4 should be fully functional - votes persist across browser sessions for 1 year

---

## Phase 5: User Story 2 - Efficient Photo Navigation (Priority: P2)

**Goal**: Provide intuitive navigation to next unrated photo (forward) and previous rated photo (backward)

**Independent Test**: Create multiple approved photos, vote on some, verify navigation buttons correctly identify and navigate to next unrated/previous rated photos

### Tests for User Story 2 (Write these FIRST)

- [ ] T048 [P] [US2] Add test_gallery_index_shows_first_unrated_photo() to tests/Feature/PublicGalleryTest.php
- [ ] T049 [P] [US2] Add test_next_button_navigates_to_next_unrated_photo() to tests/Feature/PublicGalleryTest.php
- [ ] T050 [P] [US2] Add test_previous_button_navigates_to_previous_rated_photo() to tests/Feature/PublicGalleryTest.php
- [ ] T051 [P] [US2] Add test_next_button_disabled_when_all_photos_rated() to tests/Feature/PublicGalleryTest.php
- [ ] T052 [P] [US2] Add test_previous_button_disabled_when_no_photos_rated_before_current() to tests/Feature/PublicGalleryTest.php
- [ ] T053 [P] [US2] Create PhotoSubmissionTest in tests/Unit/PhotoSubmissionTest.php with test_get_next_unrated_for_returns_correct_photo()
- [ ] T054 [P] [US2] Add test_get_previous_rated_for_returns_correct_photo() to tests/Unit/PhotoSubmissionTest.php

### Implementation for User Story 2

- [ ] T055 [US2] Update PublicGalleryController::index() to find and display first unrated photo in app/Http/Controllers/PublicGalleryController.php
- [ ] T056 [US2] Update PublicGalleryController::show() to include nextPhoto and previousPhoto in Inertia props in app/Http/Controllers/PublicGalleryController.php
- [ ] T057 [P] [US2] Create PhotoNavigation.tsx component in resources/js/components/PhotoNavigation.tsx with prev/next arrows
- [ ] T058 [US2] Integrate PhotoNavigation into Gallery.tsx in resources/js/Pages/Gallery.tsx
- [ ] T059 [US2] Implement disabled states for navigation buttons in resources/js/components/PhotoNavigation.tsx
- [ ] T060 [US2] Add navigation logic using router.visit() in resources/js/components/PhotoNavigation.tsx
- [ ] T061 [US2] Run tests for User Story 2 (php artisan test --filter="test_gallery|test_next|test_previous|test_get_next|test_get_previous")
- [ ] T062 [US2] Fix any failing tests until all User Story 2 tests pass

**Checkpoint**: User Story 2 should be fully functional - visitors can efficiently navigate between rated and unrated photos

---

## Phase 6: User Story 3 - Progress Tracking and Completion (Priority: P3)

**Goal**: Display progress indicator (X of Y photos rated) and completion message when all photos are rated

**Independent Test**: Display progress indicator showing "X of Y photos rated", verify it updates after each vote, show completion message when all photos rated

### Tests for User Story 3 (Write these FIRST)

- [ ] T063 [P] [US3] Add test_progress_indicator_shows_correct_counts() to tests/Feature/PublicGalleryTest.php
- [ ] T064 [P] [US3] Add test_progress_updates_after_voting() to tests/Feature/PublicGalleryTest.php
- [ ] T065 [P] [US3] Add test_completion_message_shown_when_all_rated() to tests/Feature/PublicGalleryTest.php
- [ ] T066 [P] [US3] Add test_can_still_navigate_and_vote_after_completion() to tests/Feature/PublicGalleryTest.php

### Implementation for User Story 3

- [ ] T067 [US3] Add progress data to PublicGalleryController::renderPhoto() method in app/Http/Controllers/PublicGalleryController.php
- [ ] T068 [US3] Calculate rated and total photo counts in app/Http/Controllers/PublicGalleryController.php
- [ ] T069 [US3] Update Gallery.tsx to display progress indicator in resources/js/Pages/Gallery.tsx
- [ ] T070 [US3] Add completion message when progress.rated === progress.total in resources/js/Pages/Gallery.tsx
- [ ] T071 [US3] Ensure navigation and voting remain functional in completion state in resources/js/Pages/Gallery.tsx
- [ ] T072 [US3] Run tests for User Story 3 (php artisan test --filter="test_progress|test_completion")
- [ ] T073 [US3] Fix any failing tests until all User Story 3 tests pass

**Checkpoint**: User Story 3 should be fully functional - visitors see their progress and completion status

---

## Phase 7: User Story 5 - Keyboard and Touch Navigation (Priority: P3)

**Goal**: Enable keyboard shortcuts (arrow keys) and touch gestures for photo navigation

**Independent Test**: Use arrow keys to navigate between photos and verify same navigation logic as clicking buttons; on mobile, test swipe gestures

### Tests for User Story 5 (Write these FIRST)

- [ ] T074 [P] [US5] Add test_arrow_keys_navigate_photos() to tests/Feature/PublicGalleryTest.php (if feasible with Laravel Dusk)
- [ ] T075 [P] [US5] Document keyboard navigation behavior in tests/Feature/PublicGalleryTest.php comments

### Implementation for User Story 5

- [ ] T076 [P] [US5] Add keyboard event listeners for arrow keys in resources/js/Pages/Gallery.tsx
- [ ] T077 [P] [US5] Implement useEffect hook for arrow key navigation in resources/js/Pages/Gallery.tsx
- [ ] T078 [P] [US5] Add touch event listeners for swipe gestures in resources/js/Pages/Gallery.tsx (optional, can defer)
- [ ] T079 [US5] Ensure keyboard navigation respects disabled states in resources/js/Pages/Gallery.tsx
- [ ] T080 [US5] Manual testing of keyboard navigation (left/right arrows)
- [ ] T081 [US5] Manual testing of touch gestures on mobile device (if implemented)

**Checkpoint**: User Story 5 should be fully functional - keyboard and touch navigation enhance accessibility

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

### Code Quality

- [ ] T082 [P] Run Laravel Pint on all PHP files (vendor/bin/pint --dirty)
- [ ] T083 [P] Run ESLint on all TypeScript/React files (npm run lint)
- [ ] T084 [P] Run TypeScript type checking (npm run types)
- [ ] T085 [P] Fix any code quality issues identified by linters

### Performance & Optimization

- [ ] T086 [P] Verify database indexes exist (created_at on photo_submissions, composite on photo_votes)
- [ ] T087 [P] Test vote submission performance (should be < 3 seconds from page load)
- [ ] T088 [P] Test navigation performance (should be < 1 second)
- [ ] T089 [P] Test with 100 concurrent simulated visitors (artillery or similar tool)

### Security Review

- [ ] T090 [P] Verify CSRF protection on vote submission (automatic with Inertia forms)
- [ ] T091 [P] Verify rate limiting works (try 61 votes in one hour, should get 429 response)
- [ ] T092 [P] Verify cookie security flags in production config
- [ ] T093 [P] Verify SQL injection protection (Eloquent ORM prevents this)
- [ ] T094 [P] Verify XSS protection (React escapes by default)

### Error Handling & Edge Cases

- [ ] T095 [P] Test empty state (no approved photos available)
- [ ] T096 [P] Test single photo scenario (both navigation buttons disabled)
- [ ] T097 [P] Test vote failure and retry logic
- [ ] T098 [P] Test cascade delete (delete photo with votes, verify votes deleted)
- [ ] T099 [P] Test network failure scenarios (slow connections, timeouts)

### Documentation & Final Testing

- [ ] T100 [P] Update CLAUDE.md with any new patterns or learnings
- [ ] T101 Run full test suite (php artisan test)
- [ ] T102 Verify all test coverage > 80% (php artisan test --coverage)
- [ ] T103 Manual end-to-end testing following quickstart.md verification steps
- [ ] T104 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] T105 Test responsive design on mobile (320px), tablet (768px), desktop (1920px)
- [ ] T106 [P] Test dark mode functionality
- [ ] T107 Final code review checklist from constitution principles

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verify existing structure
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase
- **User Story 4 (Phase 4)**: Depends on Foundational phase (infrastructure built there)
- **User Story 2 (Phase 5)**: Depends on Foundational phase + User Story 1 (uses same controller/models)
- **User Story 3 (Phase 6)**: Depends on Foundational phase + User Story 1 (enhances Gallery page)
- **User Story 5 (Phase 7)**: Depends on Foundational phase + User Story 2 (enhances navigation)
- **Polish (Phase 8)**: Depends on all desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Independent - Can start after Foundational - Core voting functionality
- **User Story 4 (P1)**: Independent - Can start after Foundational - Cookie persistence validation
- **User Story 2 (P2)**: Depends on US1 completion - Adds navigation to existing voting page
- **User Story 3 (P3)**: Depends on US1 completion - Adds progress tracking to existing voting page
- **User Story 5 (P3)**: Depends on US2 completion - Enhances existing navigation with keyboard/touch

### Within Each User Story

1. Tests MUST be written FIRST and FAIL before implementation
2. Models before services/controllers
3. Backend (controllers/requests) before frontend (pages/components)
4. Core implementation before integration
5. All tests for the story MUST pass before moving to next priority

### Parallel Opportunities

**Setup Phase**:
- T002 and T003 can run in parallel

**Foundational Phase**:
- T004 and T005 can run in parallel (different migrations)
- T007 and T008 can run in parallel (different models)
- After migrations run (T006): T009, T010, T011, T012, T013 can all run in parallel

**User Story 1**:
- All tests (T014-T023) can run in parallel
- T034, T035, T036 can run in parallel (different React components)

**User Story 4**:
- All tests (T040-T043) can run in parallel

**User Story 2**:
- All tests (T048-T054) can run in parallel
- T057 can run in parallel with T055, T056 (frontend/backend split)

**User Story 3**:
- All tests (T063-T066) can run in parallel

**User Story 5**:
- T076, T077, T078 can run in parallel (different event handlers)

**Polish Phase**:
- T082, T083, T084, T086-T099 can all run in parallel (independent checks)

**Cross-Story Parallelism**:
- Once Foundational is complete, US1 and US4 can be worked on in parallel (independent stories)
- After US1 is complete, US2 and US3 can be started in parallel (both extend US1)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create PublicGalleryTest with test_fwb_id_cookie_generated_on_first_request() in tests/Feature/PublicGalleryTest.php"
Task: "Add test_can_view_approved_photo() to tests/Feature/PublicGalleryTest.php"
Task: "Create PhotoVotingTest with test_can_vote_thumbs_up_on_photo() in tests/Feature/PhotoVotingTest.php"
Task: "Add test_can_vote_thumbs_down_on_photo() to tests/Feature/PhotoVotingTest.php"
# ... all US1 tests can run simultaneously

# Launch all frontend components for User Story 1 together:
Task: "Create Gallery.tsx page in resources/js/Pages/Gallery.tsx"
Task: "Create PhotoViewer.tsx component in resources/js/components/PhotoViewer.tsx"
Task: "Create VotingButtons.tsx component in resources/js/components/VotingButtons.tsx"
```

---

## Parallel Example: Foundational Phase

```bash
# After migrations are created and run, these can all execute in parallel:
Task: "Enhance PhotoSubmission model with votes() relationship in app/Models/PhotoSubmission.php"
Task: "Create EnsureFwbId middleware in app/Http/Middleware/EnsureFwbId.php"
Task: "Register EnsureFwbId middleware in bootstrap/app.php"
Task: "Share fwb_id with Inertia pages in app/Http/Middleware/HandleInertiaRequests.php"
Task: "Configure rate limiter for votes in bootstrap/app.php"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 4 Only)

1. Complete Phase 1: Setup (verify foundation)
2. Complete Phase 2: Foundational (CRITICAL - database, models, middleware)
3. Complete Phase 3: User Story 1 (anonymous voting)
4. Complete Phase 4: User Story 4 (persistent identity validation)
5. **STOP and VALIDATE**: Test US1 and US4 independently
6. Deploy/demo MVP (core voting with persistence)

**MVP Deliverable**: Anonymous visitors can vote on photos with thumbs up/down, votes persist across sessions

### Incremental Delivery

1. MVP (US1 + US4) → Test independently → Deploy/Demo
2. Add US2 (Navigation) → Test independently → Deploy/Demo
3. Add US3 (Progress Tracking) → Test independently → Deploy/Demo
4. Add US5 (Keyboard/Touch) → Test independently → Deploy/Demo
5. Each addition enhances UX without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (required for all)
2. Once Foundational done:
   - **Developer A**: User Story 1 (T014-T039)
   - **Developer B**: User Story 4 (T040-T047) - can run in parallel with US1
3. After US1 complete:
   - **Developer A**: User Story 2 (T048-T062)
   - **Developer B**: User Story 3 (T063-T073) - can run in parallel with US2
4. After US2 complete:
   - **Developer A**: User Story 5 (T074-T081)
5. Team completes Polish together (T082-T107)

---

## Notes

- **[P] tasks** = different files, no dependencies - can run simultaneously
- **[Story] label** = maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD Required**: Write tests first, verify they fail, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `php artisan test` frequently to catch regressions early
- Use `php artisan test --filter=testName` to run specific tests during development

## Task Summary

- **Total Tasks**: 107
- **Setup Phase**: 3 tasks
- **Foundational Phase**: 10 tasks (BLOCKS all user stories)
- **User Story 1 (P1)**: 26 tasks (10 tests + 16 implementation)
- **User Story 4 (P1)**: 8 tasks (4 tests + 4 implementation)
- **User Story 2 (P2)**: 15 tasks (7 tests + 8 implementation)
- **User Story 3 (P3)**: 11 tasks (4 tests + 7 implementation)
- **User Story 5 (P3)**: 8 tasks (2 tests + 6 implementation)
- **Polish Phase**: 26 tasks (quality, performance, security, testing)

**Parallel Opportunities**: 62 tasks marked [P] can run in parallel with other tasks
**Independent Stories**: US1 and US4 can run fully in parallel after Foundational phase

## Suggested MVP Scope

**Minimum Viable Product**: User Story 1 + User Story 4
- **Tasks**: T001-T047 (47 tasks total)
- **Deliverable**: Anonymous voting with persistent identity
- **Value**: Enables public participation in photo contest with fair vote tracking
- **Estimated Time**: 3-4 days for experienced Laravel/React developer

After MVP validation, incrementally add US2 (navigation), US3 (progress), US5 (keyboard/touch) in priority order.
