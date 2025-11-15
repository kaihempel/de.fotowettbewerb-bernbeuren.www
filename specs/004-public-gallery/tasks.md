# Tasks: Public Gallery Homepage with Infinite Scroll

**Input**: Design documents from `/specs/004-public-gallery/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: PHPUnit tests are REQUIRED per project constitution (TDD is NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `app/`, `resources/js/`, `tests/` at repository root
- Laravel backend code in `app/`
- React frontend code in `resources/js/`
- Tests in `tests/Feature/` and `tests/Unit/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and database schema are ready for gallery feature

- [ ] T001 Verify PhotoSubmission model exists in app/Models/PhotoSubmission.php
- [ ] T002 Verify photo_submissions table migration exists in database/migrations/
- [ ] T003 [P] Check if composite index (status, created_at) exists, add migration if missing
- [ ] T004 [P] Verify Laravel filesystem configuration in config/filesystems.php (public disk)
- [ ] T005 [P] Verify storage symlink exists: php artisan storage:link

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model enhancements that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Add scopeApproved() method to PhotoSubmission model in app/Models/PhotoSubmission.php
- [ ] T007 Add thumbnailUrl accessor to PhotoSubmission model in app/Models/PhotoSubmission.php
- [ ] T008 Add fullImageUrl accessor to PhotoSubmission model in app/Models/PhotoSubmission.php
- [ ] T009 Create PublicGalleryController using: php artisan make:controller PublicGalleryController --no-interaction
- [ ] T010 Register gallery route in routes/web.php (GET / or GET /gallery)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Approved Photos in Gallery (Priority: P1) 🎯 MVP

**Goal**: Display approved photos in responsive grid layout with first 20 photos, supporting mobile/tablet/desktop layouts

**Independent Test**: Seed database with 50 approved photos, visit /, verify 20 photos display in responsive grid (2/3/4-5 columns), empty state shows correct message

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Create PublicGalleryControllerTest in tests/Feature/PublicGalleryControllerTest.php
- [ ] T012 [P] [US1] Write test: gallery displays approved photos only (filters out pending/rejected)
- [ ] T013 [P] [US1] Write test: gallery paginates with exactly 20 photos per page
- [ ] T014 [P] [US1] Write test: gallery orders photos by created_at ascending (oldest first)
- [ ] T015 [P] [US1] Write test: empty gallery displays message "No photos available yet. Check back soon!"
- [ ] T016 [P] [US1] Write test: gallery excludes photos with null/invalid image paths
- [ ] T017 [P] [US1] Write test: gallery query uses composite index (no N+1 queries)

### Implementation for User Story 1

- [ ] T018 [US1] Implement PublicGalleryController@index() with cursor pagination in app/Http/Controllers/PublicGalleryController.php
- [ ] T019 [US1] Add cursor pagination logic: cursorPaginate(20) with approved scope
- [ ] T020 [US1] Transform photos to include thumbnail_url, full_image_url, rate, created_at
- [ ] T021 [US1] Create Gallery/Index.tsx page component in resources/js/Pages/Gallery/Index.tsx
- [ ] T022 [US1] Implement responsive grid layout (2 cols mobile, 3 tablet, 4-5 desktop) in Gallery/Index.tsx
- [ ] T023 [P] [US1] Create GalleryPhotoCard component in resources/js/components/GalleryPhotoCard.tsx
- [ ] T024 [US1] Add native lazy loading (loading="lazy") to GalleryPhotoCard component
- [ ] T025 [US1] Add empty state display with message in Gallery/Index.tsx
- [ ] T026 [US1] Add TypeScript interfaces for Photo and GalleryPage types
- [ ] T027 [US1] Run tests: php artisan test --filter=PublicGallery
- [ ] T028 [US1] Manually test: Visit /, verify 20 photos display, verify empty state

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Infinite Scroll Loading (Priority: P1)

**Goal**: Automatically load next batch of 20 photos when user scrolls near bottom, with skeleton loaders and end-of-content message

**Independent Test**: Seed 55 photos, visit /, scroll to bottom, verify next 20 load automatically, scroll again for final 15, see "You've reached the end!" message

### Tests for User Story 2

- [ ] T029 [P] [US2] Write test: cursor pagination returns correct next_cursor
- [ ] T030 [P] [US2] Write test: last page has next_cursor = null
- [ ] T031 [P] [US2] Write test: cursor pagination prevents duplicate photos
- [ ] T032 [P] [US2] Write test: exactly 20 photos boundary case (next_cursor null after load)

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create PhotoGrid component in resources/js/components/PhotoGrid.tsx
- [ ] T034 [US2] Implement infinite scroll with Intersection Observer in PhotoGrid component
- [ ] T035 [US2] Add state management: photos array, cursor, hasMore, isLoading
- [ ] T036 [US2] Implement loadMore function with preserveState and preserveScroll in PhotoGrid
- [ ] T037 [US2] Add sentinel element (loadMoreRef) for Intersection Observer
- [ ] T038 [P] [US2] Create SkeletonLoader component with Tailwind animation in resources/js/components/SkeletonLoader.tsx
- [ ] T039 [US2] Display skeleton loaders while isLoading is true
- [ ] T040 [US2] Display "You've reached the end!" message when hasMore is false
- [ ] T041 [US2] Prevent duplicate requests (check isLoading && hasMore before loading)
- [ ] T042 [US2] Implement useEffect cleanup to disconnect observer
- [ ] T043 [US2] Run tests: php artisan test --filter=PublicGallery
- [ ] T044 [US2] Manually test: Seed 55 photos, scroll through all batches, verify end message

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Navigate to Photo Voting Page (Priority: P1)

**Goal**: Click any photo to navigate to voting page with correct photo ID, with hover effects indicating clickability

**Independent Test**: Visit gallery, click photo, verify navigation to /voting?photo={id}, use browser back, verify return to gallery

### Tests for User Story 3

- [ ] T045 [P] [US3] Write test: photo card links to correct voting page URL
- [ ] T046 [P] [US3] Write test: photo ID parameter passed correctly to voting route
- [ ] T047 [P] [US3] Write test: verify Wayfinder route generation for voting page

### Implementation for User Story 3

- [ ] T048 [US3] Add Inertia Link to GalleryPhotoCard component in resources/js/components/GalleryPhotoCard.tsx
- [ ] T049 [US3] Import Wayfinder route helper for voting page (from @/routes/)
- [ ] T050 [US3] Pass photo.id to voting route: votingRoute.url({ photo: photo.id })
- [ ] T051 [P] [US3] Add hover effects (scale, shadow, or overlay) to GalleryPhotoCard
- [ ] T052 [P] [US3] Add CSS transitions for smooth hover animations
- [ ] T053 [P] [US3] Add cursor: pointer styling to photo cards
- [ ] T054 [US3] Run tests: php artisan test --filter=PublicGallery
- [ ] T055 [US3] Manually test: Click photo, verify voting page loads with correct photo

**Checkpoint**: All P1 user stories (1, 2, 3) should now be independently functional

---

## Phase 6: User Story 4 - Responsive Image Loading (Priority: P2)

**Goal**: Images lazy load as they enter viewport, with graceful error handling and placeholder states

**Independent Test**: Throttle network to slow 3G, scroll gallery, verify only visible images load, verify placeholders during load, verify error fallback for broken images

### Tests for User Story 4

- [ ] T056 [P] [US4] Write test: image URLs are valid and accessible
- [ ] T057 [P] [US4] Write test: thumbnail URLs return < 50KB images (performance check)

### Implementation for User Story 4

- [ ] T058 [US4] Add loading state to GalleryPhotoCard component (isLoaded, hasError)
- [ ] T059 [US4] Implement onLoad handler to set isLoaded = true
- [ ] T060 [US4] Implement onError handler to set hasError = true
- [ ] T061 [US4] Add opacity transition for fade-in effect when image loads
- [ ] T062 [P] [US4] Create error fallback UI (icon or "Failed to load" text)
- [ ] T063 [P] [US4] Add placeholder background while image loading
- [ ] T064 [US4] Ensure aspect-square container prevents layout shift
- [ ] T065 [US4] Run tests: php artisan test --filter=PublicGallery
- [ ] T066 [US4] Manually test: Throttle network, verify lazy loading, break image URL, verify error state

**Checkpoint**: User Story 4 complete and independently testable

---

## Phase 7: User Story 5 - Keyboard and Accessibility Navigation (Priority: P3)

**Goal**: Full keyboard navigation (Tab, Enter), screen reader support with ARIA labels and alt text, visible focus indicators

**Independent Test**: Use only keyboard (no mouse) to navigate gallery and click photo, use screen reader to verify announcements

### Tests for User Story 5

- [ ] T067 [P] [US5] Write test: all photos have descriptive alt text
- [ ] T068 [P] [US5] Write test: photo cards are keyboard accessible (tabindex, role)
- [ ] T069 [P] [US5] Write test: ARIA labels present for loading states

### Implementation for User Story 5

- [ ] T070 [US5] Add descriptive alt text to images in GalleryPhotoCard: alt={`Photo ${photo.id}`}
- [ ] T071 [US5] Add role="link" to photo card Links for screen readers
- [ ] T072 [US5] Add aria-label to Link components describing action
- [ ] T073 [P] [US5] Add focus-visible styling (ring, outline) to photo cards
- [ ] T074 [P] [US5] Ensure focus indicators meet WCAG 2.1 AA contrast requirements
- [ ] T075 [P] [US5] Add aria-live region for loading state announcements
- [ ] T076 [P] [US5] Add aria-label to skeleton loaders: "Loading more photos"
- [ ] T077 [US5] Ensure end-of-content message is screen reader accessible
- [ ] T078 [US5] Test keyboard navigation: Tab through photos, Enter to activate
- [ ] T079 [US5] Run tests: php artisan test --filter=PublicGallery
- [ ] T080 [US5] Manually test: Use screen reader (VoiceOver/NVDA), verify announcements

**Checkpoint**: All user stories (1-5) should now be independently functional and accessible

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, code quality, and deployment readiness

- [ ] T081 [P] Add database seeder for approved photos in database/seeders/PhotoSubmissionSeeder.php
- [ ] T082 [P] Add factory state for approved photos in database/factories/PhotoSubmissionFactory.php
- [ ] T083 [P] Run Laravel Pint: vendor/bin/pint --dirty
- [ ] T084 [P] Run ESLint: npm run lint
- [ ] T085 [P] Run TypeScript type check: npm run types
- [ ] T086 [P] Verify all tests pass: php artisan test
- [ ] T087 Performance audit: Verify query time < 100ms, page load < 2s
- [ ] T088 [P] Verify composite index is used (EXPLAIN SELECT query)
- [ ] T089 [P] Test responsive layouts on mobile (375px), tablet (768px), desktop (1280px)
- [ ] T090 [P] Test with 500+ photos to verify performance at scale
- [ ] T091 [P] Verify browser compatibility (Chrome, Firefox, Safari, Edge latest 2 versions)
- [ ] T092 Run quickstart.md validation: Follow all steps in specs/004-public-gallery/quickstart.md
- [ ] T093 Document any manual setup steps required in quickstart.md
- [ ] T094 Create pull request with feature description and testing instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - US1 (P1): Browse photos - No dependencies on other stories
  - US2 (P1): Infinite scroll - Depends on US1 (builds on gallery display)
  - US3 (P1): Navigation - Depends on US1 (requires photos to click)
  - US4 (P2): Responsive loading - Depends on US1 (enhances photo display)
  - US5 (P3): Accessibility - Depends on US1, US3 (enhances navigation)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ MVP
- **User Story 2 (P1)**: Depends on US1 complete - Builds infinite scroll on top of gallery
- **User Story 3 (P1)**: Depends on US1 complete - Requires photo cards to add navigation
- **User Story 4 (P2)**: Depends on US1 complete - Enhances photo loading performance
- **User Story 5 (P3)**: Depends on US1, US3 complete - Adds accessibility to navigation

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models/accessors before controller
- Controller before frontend components
- Frontend components: Core component → Enhancement components
- Story complete before moving to next priority

### Parallel Opportunities

#### Phase 1: Setup (All can run in parallel)
- T003, T004, T005 (checking different aspects)

#### Phase 2: Foundational (Sequential - model changes before controller)
- T006, T007, T008 can run in parallel (different methods on same model)
- T009, T010 must wait for model changes

#### User Story 1: Tests
- T011-T017 (all test creation tasks can run in parallel)

#### User Story 1: Implementation
- T023 (GalleryPhotoCard) can run in parallel with T021 (Gallery/Index.tsx)
- T026 (TypeScript interfaces) can run in parallel with components

#### User Story 2: Tests
- T029-T032 (all test creation tasks can run in parallel)

#### User Story 2: Implementation
- T033 (PhotoGrid) and T038 (SkeletonLoader) can run in parallel

#### User Story 3: Tests
- T045-T047 (all test creation tasks can run in parallel)

#### User Story 3: Implementation
- T051, T052, T053 (styling tasks can run in parallel)

#### User Story 4: Tests
- T056, T057 (all test creation tasks can run in parallel)

#### User Story 4: Implementation
- T062, T063 (fallback UI and placeholder can run in parallel)

#### User Story 5: Tests
- T067, T068, T069 (all test creation tasks can run in parallel)

#### User Story 5: Implementation
- T073, T074, T075, T076 (accessibility enhancements can run in parallel)

#### Phase 8: Polish
- T081-T091 (most polish tasks can run in parallel)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create PublicGalleryControllerTest in tests/Feature/PublicGalleryControllerTest.php"
Task: "Write test: gallery displays approved photos only"
Task: "Write test: gallery paginates with exactly 20 photos per page"
Task: "Write test: gallery orders photos by created_at ascending"
Task: "Write test: empty gallery displays message"
Task: "Write test: gallery excludes photos with null/invalid image paths"
Task: "Write test: gallery query uses composite index"

# Launch parallel components for User Story 1:
Task: "Create Gallery/Index.tsx page component"
Task: "Create GalleryPhotoCard component"
Task: "Add TypeScript interfaces"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Write test: cursor pagination returns correct next_cursor"
Task: "Write test: last page has next_cursor = null"
Task: "Write test: cursor pagination prevents duplicate photos"
Task: "Write test: exactly 20 photos boundary case"

# Launch parallel components for User Story 2:
Task: "Create PhotoGrid component"
Task: "Create SkeletonLoader component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T010) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T011-T028)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Seed 50 approved photos
   - Visit /
   - Verify 20 photos display in responsive grid
   - Verify empty state works
   - Run tests: php artisan test --filter=PublicGallery
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! Basic gallery works)
3. Add User Story 2 → Test independently → Deploy/Demo (Infinite scroll works)
4. Add User Story 3 → Test independently → Deploy/Demo (Navigation to voting works)
5. Add User Story 4 → Test independently → Deploy/Demo (Performance optimized)
6. Add User Story 5 → Test independently → Deploy/Demo (Fully accessible)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T010)
2. Once Foundational is done:
   - Developer A: User Story 1 (T011-T028)
   - Wait for US1 completion (other stories depend on it)
3. After US1 complete:
   - Developer A: User Story 2 (T029-T044)
   - Developer B: User Story 3 (T045-T055)
   - Developer C: User Story 4 (T056-T066)
4. After US2, US3, US4 complete:
   - Developer A or B or C: User Story 5 (T067-T080)
5. Team completes Polish together (T081-T094)

**Note**: US2, US3, US4 all depend on US1, so US1 must be complete first. However, US2, US3, US4 can then proceed in parallel if team capacity allows.

---

## Task Summary

**Total Tasks**: 94

**Task Count by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 5 tasks
- Phase 3 (US1 - Browse Photos): 18 tasks (7 tests + 11 implementation)
- Phase 4 (US2 - Infinite Scroll): 16 tasks (4 tests + 12 implementation)
- Phase 5 (US3 - Navigation): 11 tasks (3 tests + 8 implementation)
- Phase 6 (US4 - Responsive Loading): 11 tasks (2 tests + 9 implementation)
- Phase 7 (US5 - Accessibility): 14 tasks (3 tests + 11 implementation)
- Phase 8 (Polish): 14 tasks

**Parallel Opportunities Identified**: 45+ tasks marked with [P] can run in parallel within their phase

**Independent Test Criteria**:
- **US1**: Seed 50 photos, visit /, verify 20 display in grid, test empty state
- **US2**: Seed 55 photos, scroll to bottom twice, verify batches load, see end message
- **US3**: Visit gallery, click photo, verify voting page loads with photo ID
- **US4**: Throttle network, scroll, verify lazy loading, test error fallback
- **US5**: Use keyboard only, verify Tab/Enter navigation, test screen reader

**Suggested MVP Scope**: Complete through Phase 3 (User Story 1) = 28 tasks for functional gallery

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests MUST be written first and fail before implementation (TDD)
- Run `php artisan test --filter=PublicGallery` after each story completion
- Run `vendor/bin/pint --dirty` and `npm run lint` before finalizing
- Commit after each completed user story for incremental delivery
- Stop at any checkpoint to validate story independently
- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
