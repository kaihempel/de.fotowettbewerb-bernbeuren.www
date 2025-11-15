# Feature Specification: Public Photo Voting System with Navigation and Cookie-Based Tracking

**Feature Branch**: `003-public-voting`
**Created**: 2025-11-15
**Status**: Draft
**Input**: User description: "Public Photo Voting System with Navigation and Cookie-Based Tracking"

## Clarifications

### Session 2025-11-15

- Q: When a visitor first accesses the voting gallery (e.g., `/gallery`), what should be displayed? → A: Show the first unrated photo automatically (chronologically oldest unrated photo)
- Q: When a vote submission fails after showing an optimistic UI update, what should happen? → A: Retry automatically once, then rollback UI and show error if still fails
- Q: When a visitor has rated all photos and views the completion state, can they still navigate and change their votes? → A: Yes, navigation and vote changes remain fully functional with completion message displayed
- Q: What key metrics and events should be logged/monitored for operational visibility? → A: Essential logging: vote operations (success/fail), rate limit hits, system errors only
- Q: When a photo is deleted or unapproved after receiving votes, what happens to those votes? → A: Votes are permanently deleted (cascade delete) when photo is removed

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Anonymous Photo Rating (Priority: P1)

A contest visitor wants to rate photos in the contest without creating an account. They can browse approved photos one at a time and give each photo either a thumbs up (positive rating) or thumbs down (negative rating). The system remembers their votes using a browser cookie, allowing them to change their mind and update their rating for any photo.

**Why this priority**: This is the core functionality of the voting system. Without the ability to vote on photos, the feature has no value. This story represents the minimum viable product that delivers immediate value to both visitors and contest organizers.

**Independent Test**: Can be fully tested by displaying a single photo with voting buttons, allowing a vote to be cast, and verifying the vote is recorded and reflected in the photo's total rating. Delivers value by enabling public participation in the contest.

**Acceptance Scenarios**:

1. **Given** a visitor views an approved photo they haven't rated, **When** they click the thumbs up button, **Then** the photo's rating increases by 1 and their vote is recorded
2. **Given** a visitor views an approved photo they haven't rated, **When** they click the thumbs down button, **Then** the photo's rating decreases by 1 and their vote is recorded
3. **Given** a visitor has voted thumbs up on a photo, **When** they click the thumbs down button on the same photo, **Then** the photo's rating decreases by 2 (removing the +1 and adding -1) and their vote is updated
4. **Given** a visitor has voted thumbs down on a photo, **When** they click the thumbs up button on the same photo, **Then** the photo's rating increases by 2 (removing the -1 and adding +1) and their vote is updated
5. **Given** a visitor has voted on a photo, **When** they click the same vote button again, **Then** nothing changes (vote remains the same)
6. **Given** a photo's rating would go below 0, **When** a calculation is performed, **Then** the rating is set to 0 (minimum constraint enforced)

---

### User Story 2 - Efficient Photo Navigation (Priority: P2)

A contest visitor wants to efficiently navigate through photos, focusing on ones they haven't rated yet while being able to review photos they've already rated. The system provides intuitive navigation that takes them to the next unrated photo or back to previously rated photos, helping them complete the voting process without confusion.

**Why this priority**: This significantly improves the user experience by making the voting process efficient and intuitive. While visitors could still vote without navigation (by manually browsing), this feature makes the process much more enjoyable and likely to be completed. It's essential for good UX but not for basic functionality.

**Independent Test**: Can be tested by creating multiple approved photos, voting on some, and verifying that navigation buttons correctly identify and navigate to the next unrated photo (forward) and previously rated photos (backward). Delivers value by reducing friction in the voting process.

**Acceptance Scenarios**:

1. **Given** a visitor accesses the gallery index without specifying a photo, **When** the page loads, **Then** they are automatically shown the first unrated photo (chronologically oldest unrated photo)
2. **Given** a visitor is viewing a photo and there are unrated photos after it, **When** they click the next button, **Then** they are taken to the next unrated photo in chronological order
3. **Given** a visitor is viewing a photo and there are photos they've rated before it, **When** they click the previous button, **Then** they are taken to the most recent previously rated photo
4. **Given** a visitor has rated all photos, **When** they view any photo, **Then** the next button is disabled
5. **Given** a visitor hasn't rated any photos before the current one, **When** they view a photo, **Then** the previous button is disabled
6. **Given** a visitor is viewing the first photo and hasn't rated anything, **When** they click next, **Then** they are taken to the first unrated photo (the current one if unrated, or the next one)

---

### User Story 3 - Progress Tracking and Completion (Priority: P3)

A contest visitor wants to see their progress through the voting process, knowing how many photos they've rated out of the total number of photos. When they've rated all photos, they receive clear feedback that they've completed the voting process.

**Why this priority**: This enhances the user experience by providing a sense of accomplishment and clear feedback about progress. While nice to have, visitors can still vote effectively without seeing explicit progress indicators. This is a polish feature that improves engagement.

**Independent Test**: Can be tested by displaying a progress indicator showing "X of Y photos rated", verifying it updates after each vote, and showing a completion message when all photos are rated. Delivers value by encouraging completion and providing positive reinforcement.

**Acceptance Scenarios**:

1. **Given** a visitor has voted on 5 out of 20 photos, **When** they view any photo, **Then** they see "5/20 photos rated" displayed
2. **Given** a visitor votes on a new photo, **When** the vote is recorded, **Then** the progress counter increases by 1
3. **Given** a visitor has rated all available photos, **When** they view any photo, **Then** they see a completion message indicating they've voted on all photos
4. **Given** a visitor has rated all available photos, **When** they view the completion state, **Then** they can still navigate between photos and change their votes
5. **Given** a visitor is viewing photos, **When** the progress indicator is displayed, **Then** it updates in real-time without requiring a page refresh

---

### User Story 4 - Persistent Voting Identity (Priority: P1)

A contest visitor's voting history is preserved across browser sessions using a secure cookie. When they return to the site hours or days later, they can see which photos they've already rated and their previous votes are still counted in the photo ratings. The cookie persists for one year.

**Why this priority**: This is critical for vote integrity and user experience. Without persistent identity, users could vote multiple times on the same photo by refreshing the page, or they would lose track of which photos they've rated. This is essential infrastructure for the core voting functionality.

**Independent Test**: Can be tested by voting on photos, closing the browser, reopening it, and verifying that the voted photos still show the user's previous votes and prevent duplicate voting. Delivers value by ensuring fair voting and seamless user experience across sessions.

**Acceptance Scenarios**:

1. **Given** a visitor has never visited the site, **When** they load any page, **Then** a unique identifier cookie is created and set to expire in 1 year
2. **Given** a visitor has an existing identifier cookie, **When** they return to the site, **Then** their previous votes are loaded and displayed
3. **Given** a visitor votes on a photo, **When** they close and reopen their browser, **Then** the photo still shows their vote
4. **Given** a visitor's cookie expires after 1 year, **When** they return to the site, **Then** a new identifier is created and they can vote on all photos again

---

### User Story 5 - Keyboard and Touch Navigation (Priority: P3)

A contest visitor can navigate between photos using keyboard shortcuts (arrow keys) or touch gestures on mobile devices, making the voting experience faster and more accessible for power users and mobile visitors.

**Why this priority**: This is a quality-of-life enhancement that improves accessibility and efficiency for certain user segments. Most users will be satisfied with button-based navigation, making this a nice-to-have feature that can be added later without affecting core functionality.

**Independent Test**: Can be tested by using arrow keys to navigate between photos and verifying the same navigation logic is followed as clicking buttons. On mobile, test swipe gestures trigger navigation. Delivers value by improving accessibility and user efficiency.

**Acceptance Scenarios**:

1. **Given** a visitor is viewing a photo, **When** they press the right arrow key, **Then** they navigate to the next unrated photo (same behavior as clicking next button)
2. **Given** a visitor is viewing a photo, **When** they press the left arrow key, **Then** they navigate to the previous rated photo (same behavior as clicking previous button)
3. **Given** a mobile visitor is viewing a photo, **When** they swipe left, **Then** they navigate to the next photo
4. **Given** a mobile visitor is viewing a photo, **When** they swipe right, **Then** they navigate to the previous photo
5. **Given** navigation is disabled (no next/previous photos), **When** the visitor presses arrow keys, **Then** nothing happens (same as disabled buttons)

---

### Edge Cases

- What happens when a visitor tries to vote on a photo that hasn't been approved yet? (Should not be accessible - only approved photos shown)
- What happens when a visitor tries to vote on a photo that has been deleted? (Should show error and redirect to gallery)
- What happens to existing votes when a photo is deleted or unapproved by administrators? (All votes for that photo are permanently deleted via cascade delete)
- What happens when a visitor clears their cookies? (They receive a new identifier and can vote on all photos again as a new visitor)
- What happens when a visitor tries to vote too many times in a short period? (Rate limiting prevents abuse - 60 votes per hour per IP address)
- What happens when two visitors are on the same network (same IP)? (Each has unique cookie identifier, so they can both vote, but rate limiting applies to the shared IP)
- What happens when there are no approved photos? (Gallery shows empty state message)
- What happens when a visitor has already rated all approved photos and accesses the gallery index? (Show the first photo chronologically, with completion message displayed; navigation and vote changes remain fully functional)
- What happens when a visitor changes a vote after completing all photos? (Vote change is processed normally, completion message remains visible, progress stays at 100%)
- What happens when there is only one approved photo? (Both navigation buttons are disabled after voting on it)
- What happens when a visitor tries to manipulate the cookie identifier? (Votes are associated with the cookie value, but rate limiting by IP prevents mass fraud)
- What happens on slow network connections? (Optimistic UI updates show vote immediately, system retries once if initial submission fails, then rollbacks UI and shows error if retry also fails)
- What happens when a vote submission fails after optimistic update? (System retries automatically once, if still fails the UI reverts to previous vote state and error message is displayed to visitor)
- What happens when the same photo receives many downvotes? (Rating stays at 0 minimum, cannot go negative)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display only approved photos in the voting gallery
- **FR-001a**: System MUST automatically display the first unrated photo (chronologically oldest) when visitor accesses the gallery index without specifying a photo
- **FR-002**: System MUST generate a unique identifier cookie (fwb_id) for visitors who don't have one
- **FR-003**: System MUST set the identifier cookie to expire after 1 year
- **FR-004**: System MUST allow visitors to vote thumbs up (+1) or thumbs down (-1) on any approved photo
- **FR-005**: System MUST allow visitors to change their vote on a photo they've previously voted on
- **FR-006**: System MUST update the photo's total rating when a vote is cast or changed
- **FR-007**: System MUST calculate vote changes correctly: new up vote (+1), new down vote (-1), up to down (-2), down to up (+2), same vote (0)
- **FR-008**: System MUST enforce minimum rating of 0 (ratings cannot be negative)
- **FR-009**: System MUST prevent duplicate votes (one vote per photo per visitor identifier)
- **FR-010**: System MUST persist votes in a database associated with photo ID and visitor identifier
- **FR-011**: System MUST display photos in chronological order (oldest first) based on submission date
- **FR-012**: System MUST provide navigation to the next unrated photo (first unrated photo created after the current one)
- **FR-013**: System MUST provide navigation to the previous rated photo (last rated photo created before the current one)
- **FR-014**: System MUST disable next navigation when all photos have been rated or no unrated photos exist after the current one
- **FR-015**: System MUST disable previous navigation when no photos have been rated before the current one
- **FR-016**: System MUST display the visitor's current vote status on each photo (up, down, or unrated)
- **FR-017**: System MUST show a progress indicator displaying number of photos rated out of total approved photos
- **FR-018**: System MUST show a completion message when all photos have been rated; navigation and vote changes MUST remain fully functional in completion state
- **FR-019**: System MUST apply rate limiting of 60 votes per hour per IP address
- **FR-020**: System MUST handle vote submissions atomically using database transactions
- **FR-021**: System MUST provide optimistic UI updates (show vote immediately before server confirmation)
- **FR-022**: System MUST handle errors gracefully and provide user feedback for failed operations; when vote submission fails, system MUST retry automatically once, then rollback the optimistic UI update and display an error message if the retry also fails
- **FR-023**: System MUST support keyboard navigation using arrow keys (left = previous, right = next)
- **FR-024**: System MUST display photos at full quality while fitting within viewport constraints
- **FR-025**: System MUST prevent photos from being upscaled beyond their original dimensions
- **FR-026**: System MUST ensure voting buttons are touch-friendly on mobile devices (minimum 44x44 pixels)
- **FR-027**: System MUST work on mobile and desktop browsers
- **FR-028**: System MUST secure cookies with appropriate flags (httpOnly, secure in production, sameSite=lax)
- **FR-029**: System MUST return 404 error when visitor attempts to access a non-existent photo
- **FR-030**: System MUST return 404 error when visitor attempts to access an unapproved photo
- **FR-031**: System MUST log essential operational events including vote operations (with success/failure status), rate limit enforcement events, and system errors for monitoring and debugging
- **FR-032**: System MUST automatically delete all associated votes (cascade delete) when a photo is deleted or its approval status is revoked

### Key Entities

- **Photo Submission**: Represents a photo submitted to the contest with properties including unique identifier, image file reference, submission timestamp, approval status, and cumulative rating value (sum of all votes, minimum 0)

- **Photo Vote**: Represents a single vote cast by a visitor on a photo, with properties including unique identifier, associated photo identifier, visitor identifier (from cookie), vote type (thumbs up or thumbs down), and timestamp of when vote was cast or last updated. Votes are automatically deleted (cascade delete) when the associated photo is deleted or unapproved.

- **Visitor Identity**: Represented by a browser cookie containing a unique identifier (UUID), used to track votes across sessions, expires after 1 year, stored as "fwb_id"

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can cast a vote on a photo in under 3 seconds from page load
- **SC-002**: Visitors can navigate to the next photo in under 1 second
- **SC-003**: Vote updates are reflected in the UI immediately (optimistic updates) with server confirmation within 2 seconds
- **SC-004**: System supports at least 100 concurrent visitors voting without performance degradation
- **SC-005**: 90% of visitors who start voting rate at least 10 photos before leaving
- **SC-006**: Vote completion rate (visitors who rate all photos) reaches at least 60% among engaged visitors
- **SC-007**: Photo viewing interface works on screen sizes from 320px to 2560px width
- **SC-008**: Less than 5% of vote submissions result in errors or failures
- **SC-009**: Visitors can identify which photos they've rated without reading instructions (intuitive visual feedback)
- **SC-010**: Mobile visitors can complete voting using touch only (no keyboard required)
- **SC-011**: Navigation buttons clearly indicate when disabled (no confusion about available actions)
- **SC-012**: System prevents duplicate voting with 100% accuracy (one vote per photo per visitor)
- **SC-013**: All vote operations, rate limit events, and system errors are captured in logs for monitoring and troubleshooting

## Assumptions

- Visitors have JavaScript enabled (required for optimistic UI updates and navigation)
- Visitors accept cookies (required for persistent identity)
- Photos are pre-approved by administrators before appearing in voting gallery
- Photo quality is sufficient for full-screen display (handled by upload validation in previous feature)
- Internet connection is stable enough for modern web applications
- Visitors use modern browsers (last 2 versions of major browsers)
- Rate limiting by IP address is acceptable for preventing abuse (acknowledging that shared IPs may be limited as a group)
- One year cookie duration is appropriate for contest timeline
- Voting is anonymous (no user accounts required)
- Vote changes are allowed (visitors can reconsider their ratings)
- Chronological order (oldest first) is the preferred display order for photos
- Negative ratings are not desired (0 is the minimum)
- Contest administrators want cumulative rating scores (not averages or other metrics)

## Dependencies

- Photo Management Dashboard feature must be completed (provides photo approval workflow and PhotoSubmission model)
- Photo uploads must be functional (provides photos to vote on)
- Photo approval process must be functional (ensures only approved photos appear in voting gallery)
- Browser cookie support must be enabled
- Database must support transactions (for atomic vote updates)

## Scope

### In Scope

- Anonymous voting with cookie-based identity
- Thumbs up/down voting mechanism
- Vote creation and modification
- Cumulative rating calculation
- Sequential photo navigation (next unrated, previous rated)
- Progress tracking (X of Y photos rated)
- Completion feedback
- Full-screen photo viewer
- Responsive mobile design
- Keyboard navigation (arrow keys)
- Touch-friendly mobile buttons
- Optimistic UI updates
- Error handling and user feedback
- Rate limiting (60 votes per hour per IP)
- Cookie security (httpOnly, secure, sameSite)
- Database transactions for vote integrity

### Out of Scope

- User account creation or authentication
- Social sharing of photos
- Comments on photos
- Reporting inappropriate photos
- Sorting photos by rating
- Filtering photos by category
- Search functionality
- Photo metadata display (photographer name, description)
- Vote analytics dashboard
- Export of voting results
- Email notifications
- Photo download functionality
- Vote deletion or retraction (only vote changes allowed)
- Multi-language support
- Accessibility features beyond basic keyboard navigation (screen reader optimization, ARIA labels - these could be added later)
- Advanced touch gestures (swipe to navigate - listed as P3 user story, may be deferred)
- Vote reasoning or feedback collection
- Leaderboard or ranking display
