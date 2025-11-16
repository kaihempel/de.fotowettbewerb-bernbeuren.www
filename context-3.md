# Context for Issue #3

## Issue Summary  
- **Title**: Feature: Public Photo Voting System with Navigation and Cookie-Based Tracking
- **Type**: Feature
- **Priority**: P1 (High)
- **Status**: Open
- **Issue URL**: https://github.com/kaihempel/de.fotowettbewerb-bernbeuren.www/issues/3
- **Created**: 2025-11-15

## Requirements Analysis

### Core Objective
Implement a public-facing anonymous photo voting system that allows users to rate submitted photos using thumbs up/down mechanism, tracked via cookies (fwb_id), with intelligent navigation between rated and unrated photos.

### Key User Stories
1. Contest visitors can browse and rate photos anonymously without account creation
2. Users can navigate efficiently between rated and unrated photos
3. Users can change their vote if they reconsider their rating

### Acceptance Criteria Summary

**Backend** (15 criteria):
- Database schema: PhotoVote model, rate column in PhotoSubmission
- Cookie middleware: Generate and manage fwb_id UUID cookies
- Voting logic: Correct rate calculations (+1, -1, +2, -2)
- Rate constraints: Minimum value 0, atomic transactions
- Navigation: Correct next unrated / previous rated photo logic
- Security: Rate limiting (60/hour), CSRF protection, unique constraints
- Testing: Feature and unit tests with >80% coverage

**Frontend** (15 criteria):
- Gallery page: Full-screen centered photo display
- Components: PhotoViewer, VotingButtons, PhotoNavigation
- Responsive: Mobile-first, scales down (never up), min 44x44px touch targets
- Interaction: Optimistic UI, keyboard navigation, visual feedback
- State management: Active vote highlighting, loading states
- Integration: Wayfinder routes, error handling

**User Experience** (9 criteria):
- Smooth transitions, intuitive controls
- No authentication required
- Cross-browser and device compatibility
- Accessible keyboard and touch navigation

### Technical Constraints
- Depends on Issue #2 (Photo Management Dashboard) completion
- Must use Laravel 12 conventions (bootstrap/app.php for middleware)
- TypeScript strict mode required
- Cookie-based tracking (fwb_id) for anonymity
- Database transactions for vote atomicity
- Unique constraint: one vote per photo per user
- Rate limiting to prevent abuse

## Implementation Strategy

### Complexity Assessment
- **Effort**: L (Large) - 18-26 hours total
  - Backend: 8-12 hours
  - Frontend: 6-8 hours  
  - Testing: 4-6 hours
- **Risk Level**: Medium
  - Complex voting logic with edge cases
  - Navigation state management
  - Cookie lifecycle management
  - Requires comprehensive testing

### Dependencies
**Blocking**:
- Issue #2: Photo Management Dashboard
  - PhotoSubmission model must exist
  - Photo approval workflow required
  - Approved photos needed for voting

**Technical Stack** (All installed):
- Laravel 12, PHP 8.4
- Inertia.js v2, React 19
- Wayfinder, Tailwind CSS v4

### Recommended Implementation Phases

**Phase 1: Backend Foundation** (Days 1-2)
- PhotoVote migration and model
- Add rate column to PhotoSubmission
- Model relationships and vote methods
- Unit tests for models

**Phase 2: Cookie & Middleware** (Day 2)
- EnsureFwbId middleware
- Register in bootstrap/app.php
- Share fwb_id via HandleInertiaRequests
- Feature tests for cookie generation

**Phase 3: Voting Logic** (Days 3-4)
- VoteRequest form request
- PublicGalleryController (index, show, vote)
- Routes registration
- Transactional voting logic
- Rate limiting
- Feature tests for voting scenarios

**Phase 4: Navigation Logic** (Day 4)
- getNextUnratedFor() method
- getPreviousRatedFor() method
- Controller navigation integration
- Navigation tests

**Phase 5: Frontend Components** (Days 5-6)
- PhotoViewer component (centered, responsive)
- VotingButtons component (thumb up/down)
- PhotoNavigation component (arrows)
- Tailwind CSS v4 styling
- Loading states

**Phase 6: Gallery Page** (Day 7)
- gallery.tsx page creation
- Component integration
- Wayfinder route integration
- Optimistic UI updates
- Keyboard navigation
- Responsive testing

**Phase 7: Testing & Polish** (Day 8)
- Full test suite execution
- Bug fixes
- Multi-device/browser testing
- Laravel Pint and ESLint
- Performance optimization
- Documentation

### Agent Assignments
**Primary Agents**:
- Backend Development Agent: Database, models, middleware, controller
- Frontend Development Agent: React components, page, styling
- Testing Agent: PHPUnit tests, feature tests, edge cases

**Supporting Agents**:
- Security Agent: Rate limiting, CSRF, cookie security
- Performance Agent: Database indexing, query optimization

**Review Agent**: Code review, acceptance criteria validation

### Context Distribution

**Planning Context** (500 tokens):
- Issue overview and requirements
- Implementation phases
- Dependencies

**Implementation Context** (600 tokens):
- Database schema details
- Voting logic algorithms
- Component interfaces
- Wayfinder integration examples

**Review Context** (400 tokens):
- Acceptance criteria checklist
- Test coverage requirements
- Security and performance validations

## Progress Tracking

- **Created**: 2025-11-15
- **Planning Complete**: [ ]
- **Phase 1 Complete (Backend Foundation)**: [ ]
- **Phase 2 Complete (Middleware)**: [ ]
- **Phase 3 Complete (Voting Logic)**: [ ]
- **Phase 4 Complete (Navigation)**: [ ]
- **Phase 5 Complete (Frontend Components)**: [ ]
- **Phase 6 Complete (Gallery Page)**: [ ]
- **Phase 7 Complete (Testing & Polish)**: [ ]
- **Review Complete**: [ ]
- **Closed**: [ ]

## Key Technical Details

### Database Schema

**photo_votes table**:
```sql
id (primary key)
photo_submission_id (foreign key, cascade delete)
fwb_id (string/uuid, indexed)
vote_type (boolean: true=up, false=down)
timestamps
UNIQUE(photo_submission_id, fwb_id)
```

**photo_submissions.rate**:
- Integer, unsigned, default 0
- Cumulative vote score
- Minimum value: 0 (enforced in model)

### Voting Algorithm
```
New vote (up):   +1 to rate, create PhotoVote
New vote (down): -1 to rate, create PhotoVote
Change (up→down): -2 to rate, update PhotoVote
Change (down→up): +2 to rate, update PhotoVote
Same vote:       No change
Rate = max(0, rate + adjustment)
```

### Navigation Logic
- Order: created_at ASC (oldest first)
- Next unrated: First approved photo without user vote, after current
- Previous rated: Last approved photo with user vote, before current
- Disable navigation when no photos available

### Cookie Specification
- Name: fwb_id
- Value: UUID v4
- Expiration: 365 days
- Flags: httpOnly, secure (production), sameSite=lax
- Generated by: EnsureFwbId middleware
- Shared globally via HandleInertiaRequests

## Files to Create/Modify

**New Files**:
- `/app/Models/PhotoVote.php`
- `/app/Http/Controllers/PublicGalleryController.php`
- `/app/Http/Middleware/EnsureFwbId.php`
- `/app/Http/Requests/VoteRequest.php`
- `/database/migrations/*_create_photo_votes_table.php`
- `/database/migrations/*_add_rate_to_photo_submissions.php`
- `/resources/js/Pages/gallery.tsx`
- `/resources/js/components/PhotoViewer.tsx`
- `/resources/js/components/VotingButtons.tsx`
- `/resources/js/components/PhotoNavigation.tsx`
- `/tests/Feature/PublicGalleryTest.php`
- `/tests/Feature/PhotoVotingTest.php`
- `/tests/Unit/PhotoSubmissionTest.php`

**Modified Files**:
- `/app/Models/PhotoSubmission.php` (add vote methods)
- `/app/Http/Middleware/HandleInertiaRequests.php` (share fwb_id)
- `/bootstrap/app.php` (register EnsureFwbId middleware)
- `/routes/web.php` (add gallery routes)

## Agent Communication Log

<!-- Updates from assigned agents will be appended here -->

---

**Last Updated**: 2025-11-15  
**Status**: Ready for implementation  
**Next Action**: Confirm Issue #2 completion, then begin Phase 1
