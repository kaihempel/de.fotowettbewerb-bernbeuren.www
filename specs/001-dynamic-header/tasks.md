# Implementation Tasks: Dynamic Header with Photo Gallery Landing Page

**Feature Branch**: `001-dynamic-header`
**Date**: 2025-11-16
**Total Tasks**: 28
**Estimated Time**: 2.5-3 hours

## Task Format

```
- [ ] [TaskID] [P] [Story] Description with file path
```

- **TaskID**: Sequential number (T001, T002, etc.)
- **[P]**: Parallelizable task (can run concurrently with other [P] tasks in same phase)
- **[Story]**: User story label ([US1], [US2], etc.) for story-specific tasks
- **Description**: Clear action with exact file path

---

## Phase 1: Setup & Prerequisites (5 tasks, ~15 minutes)

**Goal**: Prepare development environment and verify existing infrastructure

### Tasks

- [ ] T001 Verify PublicGalleryController exists and returns approved photos in app/Http/Controllers/PublicGalleryController.php
- [ ] T002 [P] Verify route configuration for "/" in routes/web.php (should already point to PublicGalleryController@gallery)
- [ ] T003 [P] Verify Photo model exists with approval_status field in app/Models/Photo.php
- [ ] T004 [P] Check existing Radix UI components in resources/js/components/ui/ (Sheet, Button, etc.)
- [ ] T005 [P] Verify use-appearance hook exists in resources/js/hooks/use-appearance.tsx

---

## Phase 2: Foundation - Test Infrastructure (Priority: P1) (3 tasks, ~20 minutes)

**Goal**: Set up TDD infrastructure before implementing any features

**Independent Test**: Tests can be run without implementation

### Tasks

- [ ] T006 Create LandingPageTest feature test in tests/Feature/LandingPageTest.php
- [ ] T007 [P] Write test for approved photos display scenario in tests/Feature/LandingPageTest.php
- [ ] T008 [P] Write test for empty state scenario in tests/Feature/LandingPageTest.php

**Test Validation**: Run `php artisan test --filter=LandingPageTest` (should fail - red phase)

---

## Phase 3: User Story 1 - View Photo Gallery on Landing Page (Priority: P1) (7 tasks, ~45 minutes)

**Goal**: Display contest photos in responsive grid layout on landing page

**Independent Test Criteria**:
- Navigate to "/" and verify photos from PublicGalleryController are visible
- Verify 1 column layout on mobile (320px-768px)
- Verify 3-4 column layout on desktop (1024px+)
- Verify photos preserve aspect ratios without cropping
- Verify clicking photo navigates to rating page
- Verify empty state when no photos exist

### Tasks

- [ ] T009 [US1] Create use-scroll-position custom hook in resources/js/hooks/use-scroll-position.ts (with requestAnimationFrame throttling for 60fps)
- [ ] T010 [P] [US1] Create PhotoGrid component with responsive grid (1 col mobile, 3-4 cols desktop) in resources/js/components/photo-grid.tsx
- [ ] T011 [P] [US1] Implement aspect ratio preservation (object-contain, aspect-auto) in resources/js/components/photo-grid.tsx
- [ ] T012 [P] [US1] Add photo click navigation to rating page using Wayfinder in resources/js/components/photo-grid.tsx
- [ ] T013 [P] [US1] Add lazy loading (loading="lazy") for below-fold images in resources/js/components/photo-grid.tsx
- [ ] T014 [US1] Create Gallery page component replacing welcome.tsx in resources/js/Pages/Gallery.tsx
- [ ] T015 [US1] Implement empty state handling ("No photos available yet") in resources/js/Pages/Gallery.tsx

**Test Validation**: Run `php artisan test --filter=LandingPageTest` (should pass - green phase)

**MVP Checkpoint**: At this point, you have a working photo gallery landing page!

---

## Phase 4: User Story 2 - Navigate via Responsive Header Menu (Priority: P1) (5 tasks, ~30 minutes)

**Goal**: Implement burger menu navigation with keyboard accessibility

**Independent Test Criteria**:
- Click burger menu icon and verify menu opens with 4 items
- Verify menu items navigate to correct routes (Gallery, Upload, Login, Impressum)
- Verify menu closes on outside click or Escape key
- Verify keyboard Tab navigation through all menu items
- Verify ARIA labels present for screen readers

### Tasks

- [ ] T016 [US2] Create PublicHeader component with logo and burger menu icon in resources/js/components/public-header.tsx
- [ ] T017 [P] [US2] Integrate Radix UI Sheet component for mobile menu in resources/js/components/public-header.tsx
- [ ] T018 [P] [US2] Add 4 navigation menu items (Gallery, Upload, Login, Impressum) using Wayfinder routes in resources/js/components/public-header.tsx
- [ ] T019 [P] [US2] Implement menu close on item selection, outside click, and Escape key in resources/js/components/public-header.tsx
- [ ] T020 [US2] Add ARIA labels (aria-label="Open navigation menu") and keyboard navigation support in resources/js/components/public-header.tsx

**Integration**: Update Gallery.tsx to include PublicHeader component

**Test Validation**: Manual test - open menu, navigate through items with Tab key, verify routes

---

## Phase 5: User Story 3 - Experience Smooth Header Transitions on Scroll (Priority: P2) (4 tasks, ~25 minutes)

**Goal**: Implement dynamic header that transitions from 20vh to 80px on scroll

**Independent Test Criteria**:
- Verify header is 20vh height at scroll position 0
- Scroll down 100px and verify smooth transition to 80px over 350ms
- Verify header remains sticky at top after transition
- Verify logo scales down proportionally in compact mode
- Verify smooth expand animation when scrolling back to top

### Tasks

- [ ] T021 [US3] Integrate use-scroll-position hook with 100px threshold in resources/js/components/public-header.tsx
- [ ] T022 [P] [US3] Implement header height transition (20vh → 80px) using Tailwind classes and transition-all duration-[350ms] in resources/js/components/public-header.tsx
- [ ] T023 [P] [US3] Implement logo scaling animation in resources/js/components/public-header.tsx
- [ ] T024 [US3] Add fixed positioning with backdrop blur (bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg) in resources/js/components/public-header.tsx

**Test Validation**: Manual test - scroll page and verify smooth 350ms transition at 100px threshold

---

## Phase 6: User Story 4 - Access Site on Mobile and Desktop Devices (Priority: P1) (3 tasks, ~20 minutes)

**Goal**: Ensure responsive layouts work correctly across all device sizes

**Independent Test Criteria**:
- Load page on mobile (320px) and verify 1 column photo grid, properly sized header
- Load page on tablet (768px) and verify 3 column grid
- Load page on desktop (1024px+) and verify 4 column grid
- Rotate device and verify layout adjusts smoothly

### Tasks

- [ ] T025 [US4] Add responsive breakpoints to PhotoGrid (grid-cols-1 md:grid-cols-3 lg:grid-cols-4) in resources/js/components/photo-grid.tsx
- [ ] T026 [P] [US4] Add responsive header sizing for mobile/tablet/desktop in resources/js/components/public-header.tsx
- [ ] T027 [US4] Add spacer div (h-[20vh]) to prevent content hiding under fixed header in resources/js/Pages/Gallery.tsx

**Test Validation**: Manual test with DevTools responsive mode (320px, 768px, 1024px widths)

---

## Phase 7: User Story 5 - View Site in Light or Dark Mode (Priority: P3) (1 task, ~10 minutes)

**Goal**: Support light/dark mode theming with WCAG AA contrast

**Independent Test Criteria**:
- Toggle system to dark mode and verify header background changes
- Verify text maintains 4.5:1 contrast ratio in both modes
- Verify no layout shifts when switching themes

### Tasks

- [ ] T028 [US5] Add dark mode Tailwind classes (dark:bg-gray-900/80 dark:text-gray-100) to PublicHeader and PhotoGrid components in resources/js/components/public-header.tsx and resources/js/components/photo-grid.tsx

**Test Validation**: Manual test - toggle OS theme and verify contrast with browser DevTools

---

## Phase 8: Polish & Quality Assurance (Non-blocking) (6 tasks, ~15 minutes)

**Goal**: Code quality, formatting, and performance verification

### Tasks

- [ ] T029 Format PHP code using vendor/bin/pint --dirty
- [ ] T030 [P] Format TypeScript/React code using npm run lint
- [ ] T031 [P] Run TypeScript type checking using npm run types
- [ ] T032 [P] Build production assets using npm run build
- [ ] T033 Run full test suite using php artisan test
- [ ] T034 Verify performance targets (5s on 3G, 2s broadband) using Chrome DevTools Network throttling and Lighthouse audit

---

## Dependency Graph

### Story Completion Order

```
Phase 1 (Setup) → Phase 2 (Tests) → Phase 3 (US1) → MVP ✅

Then independently (any order):
├─ Phase 4 (US2) - Navigation
├─ Phase 5 (US3) - Header Scroll
├─ Phase 6 (US4) - Responsive
└─ Phase 7 (US5) - Dark Mode

Finally: Phase 8 (Polish)
```

### User Story Dependencies

- **US1** (Photo Gallery): No dependencies - can be implemented first
- **US2** (Navigation): Independent - can be implemented in parallel with US3-US5
- **US3** (Header Scroll): Depends on US2 (needs header component) - implement after US2
- **US4** (Responsive): Depends on US1 and US2 (needs grid and header) - implement after both
- **US5** (Dark Mode): Independent - can be implemented anytime after components exist

**Recommended Order**: US1 → US2 → US3 → US4 → US5

---

## Parallel Execution Examples

### Phase 3 (US1) - Photo Gallery

**Parallel Group 1** (can work simultaneously):
- T010: Create PhotoGrid component
- T014: Create Gallery page component

**Parallel Group 2** (after components exist):
- T011: Add aspect ratio preservation
- T012: Add photo click navigation
- T013: Add lazy loading
- T015: Add empty state

### Phase 4 (US2) - Navigation

**Parallel Group** (after header component created):
- T017: Integrate Sheet component
- T018: Add menu items
- T019: Implement menu close logic
- T020: Add ARIA labels

### Phase 5 (US3) - Header Scroll

**Parallel Group** (after hook integration):
- T022: Implement height transition
- T023: Implement logo scaling
- T024: Add backdrop blur

---

## Implementation Strategy

### Minimum Viable Product (MVP)

**MVP Scope**: User Story 1 only (Phase 3)
- Tasks: T001-T015 (15 tasks)
- Time: ~1.5 hours
- Value: Users can browse photo gallery immediately

**MVP Deliverable**:
- Landing page displays approved photos in responsive grid
- Photos preserve aspect ratios
- Photos clickable (navigate to rating page)
- Empty state handled
- Tests passing

### Incremental Delivery

**Iteration 1**: MVP (US1) - Photo gallery working
**Iteration 2**: +US2 (Navigation) - Menu navigation working
**Iteration 3**: +US3 (Header Scroll) - Dynamic header animation
**Iteration 4**: +US4 (Responsive) - Full responsive support
**Iteration 5**: +US5 (Dark Mode) - Theme support complete

Each iteration delivers independently testable value!

---

## Testing Checklist

### Automated Tests (PHPUnit)

- [ ] Landing page returns 200 status code
- [ ] Only approved photos are displayed (not pending/rejected)
- [ ] Empty state when no approved photos exist
- [ ] Photo data includes required fields (id, title, url, etc.)

### Manual Tests

**User Story 1**:
- [ ] Navigate to "/" and photos are visible
- [ ] Mobile (320px): 1 column grid
- [ ] Desktop (1024px): 3-4 column grid
- [ ] Photos maintain aspect ratios (no cropping)
- [ ] Click photo navigates to /photos/{id}
- [ ] Empty state displays when no photos

**User Story 2**:
- [ ] Burger menu icon visible
- [ ] Click menu opens overlay with 4 items
- [ ] Each menu item navigates correctly
- [ ] Menu closes on outside click
- [ ] Menu closes on Escape key
- [ ] Tab key navigates through menu items
- [ ] Screen reader announces menu items

**User Story 3**:
- [ ] Header 20vh height at top (scroll = 0)
- [ ] Scroll 100px triggers transition
- [ ] Transition completes in 350ms
- [ ] Header 80px height after transition
- [ ] Header sticky at top
- [ ] Logo scales down smoothly
- [ ] Scroll up expands header back

**User Story 4**:
- [ ] Mobile (320px): correct layout
- [ ] Tablet (768px): correct layout
- [ ] Desktop (1024px+): correct layout
- [ ] Rotate device: layout adjusts

**User Story 5**:
- [ ] Dark mode colors applied
- [ ] Light mode colors applied
- [ ] 4.5:1 contrast ratio (DevTools check)
- [ ] No layout shifts on theme change

### Performance Tests

- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score = 100
- [ ] Time to Interactive (TTI) < 5s on 3G
- [ ] Time to Interactive (TTI) < 2s on broadband
- [ ] No layout shifts (CLS = 0)

---

## File Manifest

### New Files Created (6)

1. `tests/Feature/LandingPageTest.php` - PHPUnit feature tests
2. `resources/js/hooks/use-scroll-position.ts` - Scroll detection hook
3. `resources/js/components/public-header.tsx` - Dynamic header component
4. `resources/js/components/photo-grid.tsx` - Responsive photo grid
5. `resources/js/Pages/Gallery.tsx` - Main landing page (replaces welcome.tsx)
6. `resources/js/Pages/welcome.tsx` - DELETE or rename to Gallery.tsx

### Files Modified (0)

All existing files remain unchanged. PublicGalleryController and routes/web.php should already be configured correctly.

---

## Success Criteria Validation

After completing all tasks, verify these success criteria:

- **SC-001**: ✅ Photos visible immediately on "/"
- **SC-002**: ✅ Menu accessible within 2 clicks
- **SC-003**: ✅ Header transitions within 400ms
- **SC-004**: ✅ Works on 320px mobile and 1024px+ desktop
- **SC-005**: ✅ Keyboard navigation functional
- **SC-006**: ✅ 4.5:1 contrast ratio maintained
- **SC-007**: ✅ No layout shifts on theme change
- **SC-008**: ✅ Navigation success rate (measure with analytics after deploy)
- **SC-009**: ✅ Load time targets met (5s/3G, 2s/broadband)

---

## Troubleshooting Guide

### Issue: Tests failing

**Symptom**: LandingPageTest returns errors
**Solutions**:
1. Verify Photo factory exists (`database/factories/PhotoFactory.php`)
2. Run `php artisan migrate:fresh` to reset test database
3. Check PublicGalleryController returns Inertia response

### Issue: Header doesn't scroll

**Symptom**: Header remains 20vh height when scrolling
**Solutions**:
1. Verify use-scroll-position hook threshold is 100
2. Check console for JavaScript errors
3. Verify `isScrolled` state is changing in React DevTools

### Issue: Photos not loading

**Symptom**: Empty state shows even with approved photos
**Solutions**:
1. Check database: `Photo::where('approval_status', 'approved')->count()`
2. Verify PublicGalleryController returns photos in Inertia props
3. Check browser Network tab for Inertia response JSON

### Issue: Menu doesn't close

**Symptom**: Sheet stays open after clicking item
**Solutions**:
1. Add `onOpenChange` handler to Sheet component
2. Use state to control Sheet open/close: `const [open, setOpen] = useState(false)`
3. Call `setOpen(false)` onClick for each Link

---

## Estimated Timeline

| Phase | Tasks | Time | Cumulative |
|-------|-------|------|------------|
| 1: Setup | T001-T005 | 15 min | 15 min |
| 2: Tests | T006-T008 | 20 min | 35 min |
| 3: US1 (Gallery) | T009-T015 | 45 min | 1h 20min |
| **MVP Complete** | | | **1h 20min** |
| 4: US2 (Navigation) | T016-T020 | 30 min | 1h 50min |
| 5: US3 (Scroll) | T021-T024 | 25 min | 2h 15min |
| 6: US4 (Responsive) | T025-T027 | 20 min | 2h 35min |
| 7: US5 (Dark Mode) | T028 | 10 min | 2h 45min |
| 8: Polish | T029-T034 | 15 min | 3h |

**Total**: ~3 hours for complete feature implementation

---

Ready to implement! Start with Phase 1 (Setup) to verify prerequisites, then proceed to Phase 2 (Tests) following TDD approach. 🚀
