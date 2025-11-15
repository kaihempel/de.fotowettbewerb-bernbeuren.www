# Context for Issue #2

## Issue Summary  
- **Title**: Photo Management Dashboard with Review Actions and Filtering
- **Type**: Feature (Enhancement)
- **Priority**: High (P1) - Important feature for photo contest platform
- **Status**: Open
- **Assignee**: Project Lead / Full-Stack Developer
- **Created**: 2025-11-15
- **GitHub URL**: https://github.com/kaihempel/de.fotowettbewerb-bernbeuren.www/issues/2

## Requirements Analysis

### Core Objective
Build a comprehensive photo management dashboard that enables authorized users to efficiently review, approve, and decline photo submissions with real-time filtering and pagination capabilities.

### Acceptance Criteria Overview
**Backend (11 criteria)**:
1. PhotoSubmissionController with index(), approve(), decline() methods
2. Query parameter filtering for status (all, new, approved, declined)
3. User relationship eager loading
4. Submissions sorted by creation date (DESC)
5. Status change tracking with reviewer ID and timestamp
6. Protected routes with authentication middleware
7. PhotoSubmissionPolicy for authorization
8. Model scopes: scopeStatus(), scopeNew()
9. Model methods: approve(), decline()
10. Proper Inertia responses
11. PHPUnit test coverage

**Frontend (14 criteria)**:
1. Paginated photo submission list display
2. Thumbnail preview, user info, date, status badge per photo
3. Color-coded status badges (new: yellow, approved: green, declined: red)
4. Conditional action buttons for "new" status
5. PhotoStatusFilter component with All/New/Approved/Declined options
6. URL query parameter reflection for filter state
7. Filter state persistence across navigation
8. PhotoSubmissionList responsive layout
9. PhotoSubmissionCard with complete metadata
10. Inertia router integration for actions
11. Optimistic UI updates
12. Loading states during async operations
13. Empty state handling
14. Mobile-first responsive design

**User Experience (6 criteria)**:
1. Accept/Decline actions without page reload
2. Success/error feedback after actions
3. Filter state preservation during pagination
4. Seamless pagination with filters
5. TypeScript strict typing
6. Code quality checks (Pint, ESLint, Prettier)

### Technical Constraints
1. **Database Dependency**: Requires photo_submissions table with columns: id, user_id, photo_path, status, created_at, reviewed_at, reviewed_by
2. **Authentication**: Laravel Fortify authentication required
3. **Authorization**: Must implement PhotoSubmissionPolicy
4. **Performance**: N+1 query prevention via eager loading mandatory
5. **Pagination**: 15-20 items per page recommended
6. **Image Optimization**: Thumbnail generation for list view performance
7. **Indexing**: Database indexes on status, created_at, reviewed_by columns
8. **Type Safety**: Wayfinder for route generation, strict TypeScript
9. **Framework Versions**: Laravel 12, React 19, Inertia.js v2, Tailwind CSS v4

## Implementation Strategy

### Complexity Assessment
- **Effort**: Large (L) - 8-12 hours total
  - Backend: 3-4 hours (controller, model updates, policy, routes, tests)
  - Frontend: 4-6 hours (3 new components + dashboard updates, styling, TypeScript)
  - Testing: 1-2 hours (PHPUnit tests for controller + authorization)
- **Risk Level**: Medium
  - Dependencies on Issue #1 (Photo Upload System)
  - Authorization logic complexity
  - Performance optimization requirements
  - Multiple new component interactions
- **Dependencies**: 
  - **Blocked By**: Issue #1 - Photo Upload System (must be completed first)
  - **Blocks**: Issue #3 - Public Photo Gallery Display (future)

### Agent Assignments

Based on issue type (feature) and priority (high):

**Primary Agent**: Full-Stack Development Agent
- Responsible for end-to-end implementation
- Backend controller, model, policy development
- Frontend component development
- Integration testing

**Supporting Agents**:
1. **Database Agent**: Schema validation, migration review, query optimization
2. **Frontend Agent**: Component structure, TypeScript types, UI/UX implementation
3. **Testing Agent**: PHPUnit test creation, authorization test coverage
4. **Performance Agent**: Query optimization, eager loading verification, image optimization

**Review Agent**: Code Review Agent (always assigned)
- Validates all acceptance criteria met
- Ensures code quality standards (Pint, ESLint, Prettier)
- Reviews test coverage
- Checks performance optimizations

### Context Distribution

**Planning Context** (500 tokens):
- Issue overview and acceptance criteria
- Backend/frontend split requirements
- Dependency tracking

**Implementation Context** (600 tokens):
- Technical requirements with code examples
- Model scopes and methods specification
- Component architecture and TypeScript types
- Wayfinder integration patterns
- Performance optimization guidelines

**Review Context** (400 tokens):
- Acceptance criteria checklist
- Code quality standards
- Test coverage requirements
- Performance metrics
- Success criteria validation

## Implementation Breakdown

### Phase 1: Backend Foundation (3-4 hours)

**Step 1.1**: Model Updates
- File: `app/Models/PhotoSubmission.php`
- Add scopes: `scopeStatus()`, `scopeNew()`
- Add methods: `approve()`, `decline()`
- Add relationships if not present
- Test with Tinker

**Step 1.2**: Policy Creation
- File: `app/Policies/PhotoSubmissionPolicy.php`
- Command: `php artisan make:policy PhotoSubmissionPolicy --model=PhotoSubmission --no-interaction`
- Implement: `review()` method for authorization
- Register in AuthServiceProvider if needed

**Step 1.3**: Controller Development
- File: `app/Http/Controllers/PhotoSubmissionController.php`
- Command: `php artisan make:controller PhotoSubmissionController --no-interaction`
- Implement: `index()`, `approve()`, `decline()` methods
- Add validation, authorization, eager loading
- Ensure Inertia responses

**Step 1.4**: Routes Definition
- File: `routes/web.php`
- Add authenticated routes group
- Define: dashboard.photos.index, photos.approve, photos.decline
- Apply middleware: auth, authorization

**Step 1.5**: Backend Testing
- File: `tests/Feature/PhotoSubmissionControllerTest.php`
- Command: `php artisan make:test PhotoSubmissionControllerTest --no-interaction`
- Test: index pagination, filtering, approve, decline, authorization
- File: `tests/Feature/PhotoSubmissionPolicyTest.php`
- Test: policy authorization rules

### Phase 2: Frontend Development (4-6 hours)

**Step 2.1**: TypeScript Type Definitions
- File: `resources/js/types/photo-submission.ts` (create if needed)
- Define: PhotoSubmission, PaginatedData<T> interfaces
- Export types for component usage

**Step 2.2**: PhotoStatusFilter Component
- File: `resources/js/components/PhotoStatusFilter.tsx`
- Props: currentStatus (optional string)
- Features: All/New/Approved/Declined filter tabs
- URL query parameter updates
- Mobile-first design using existing UI components

**Step 2.3**: PhotoSubmissionCard Component
- File: `resources/js/components/PhotoSubmissionCard.tsx`
- Props: submission (PhotoSubmission), onApprove, onDecline
- Display: thumbnail, user info, date, status badge
- Conditional action buttons for "new" status
- Responsive layout

**Step 2.4**: PhotoSubmissionList Component
- File: `resources/js/components/PhotoSubmissionList.tsx`
- Props: submissions (PaginatedData<PhotoSubmission>)
- Features: grid layout, pagination, empty state
- Loading states during actions
- Map PhotoSubmissionCard components

**Step 2.5**: Dashboard Page Updates
- File: `resources/js/Pages/dashboard.tsx`
- Add: photoSubmissions, filters props
- Integrate: PhotoStatusFilter, PhotoSubmissionList
- Wayfinder route imports
- Optimistic UI updates

**Step 2.6**: Wayfinder Integration
- Generate Wayfinder routes: `php artisan wayfinder:generate`
- Import actions in components
- Type-safe route usage

### Phase 3: Testing & Optimization (1-2 hours)

**Step 3.1**: Integration Testing
- Test full flow: filter → display → approve/decline
- Verify pagination with filters
- Test authorization scenarios
- Validate responsive design

**Step 3.2**: Performance Optimization
- Verify no N+1 queries (Laravel Debugbar)
- Check eager loading effectiveness
- Optimize image loading
- Test page load times

**Step 3.3**: Code Quality
- Run: `vendor/bin/pint --dirty`
- Run: `npm run lint`
- Run: `npm run types`
- Run: `php artisan test`
- Fix any issues

## Progress Tracking

- **Created**: 2025-11-15
- **Planning Complete**: [ ]
- **Backend Development**:
  - [ ] Model updates (scopes, methods)
  - [ ] Policy creation and implementation
  - [ ] Controller development
  - [ ] Routes definition
  - [ ] Backend tests written and passing
- **Frontend Development**:
  - [ ] TypeScript types defined
  - [ ] PhotoStatusFilter component
  - [ ] PhotoSubmissionCard component
  - [ ] PhotoSubmissionList component
  - [ ] Dashboard page updates
  - [ ] Wayfinder integration
- **Testing & Quality**:
  - [ ] Integration testing complete
  - [ ] Performance optimization verified
  - [ ] Code quality checks passed
  - [ ] All acceptance criteria met
- **Review Complete**: [ ]
- **Closed**: [ ]

## Agent Communication Log

### 2025-11-15 - Issue Created by Planning Agent
- Created comprehensive GitHub issue #2
- Generated initial context file
- Assigned priority: High (P1)
- Estimated effort: Large (L) - 8-12 hours
- Identified blocking dependency: Issue #1 (Photo Upload System)
- Context distributed to assigned agents

---

**Next Actions**:
1. Wait for Issue #1 completion
2. Database schema verification
3. Begin Phase 1: Backend Foundation
4. Full-Stack Development Agent to take lead
