# Context for Issue #1

## Issue Summary  
- **Title**: Feature: High-Quality Photo Upload System for Photo Contest
- **Type**: Feature
- **Priority**: P1 (High)
- **Status**: Open
- **Assignee**: TBD
- **Created**: 2025-11-15
- **URL**: https://github.com/kaihempel/de.fotowettbewerb-bernbeuren.www/issues/1

## Requirements Analysis

### Core Objective
Implement a complete photo upload system that allows authenticated users to submit high-quality photographs for the photo contest. The system must preserve image quality, provide seamless user experience across devices, and track submission status through a review workflow.

### Acceptance Criteria  

**Backend Requirements (12 criteria)**:
1. Database migration with proper schema (id, user_id, original_filename, stored_filename, file_path, file_size, mime_type, status, submitted_at, reviewed_at, reviewed_by, timestamps)
2. Foreign key relationships established
3. Status enum with values: 'new', 'approved', 'declined'
4. Storage disk configuration for photo submissions
5. PhotoSubmission model with relationships and type hints
6. Model scopes for status filtering
7. Model accessors for file URL generation
8. PhotoSubmissionController with store() method
9. Validation rules for image types (jpg, png, heic) and file size
10. File storage without compression
11. Database entry creation with 'new' status
12. POST /photos/submit route

**Frontend Requirements (10 criteria)**:
1. TypeScript PhotoUpload.tsx component
2. Mobile-first responsive design with Tailwind CSS v4
3. Drag & drop functionality
4. File input with preview
5. Client-side validation
6. Upload progress indicator
7. Success/error state handling
8. Inertia Form integration with Wayfinder
9. Use existing UI components
10. Theme-aware (light/dark mode support)

**Testing Requirements (6 criteria)**:
1. PHPUnit feature tests for upload endpoint
2. Successful upload test cases
3. Validation failure test cases
4. Database entry verification tests
5. File storage verification tests
6. Code quality checks (Pint, ESLint, TypeScript)

### Technical Constraints

**Framework Constraints**:
- Must follow Laravel 12 conventions (no middleware files in app/, use bootstrap/app.php)
- Use model casts() method, not $casts property
- Explicit return type hints required for all methods
- Follow React 19 patterns with TypeScript strict mode

**Security Constraints**:
- Server-side MIME type validation (don't trust client)
- Files stored outside public directory
- Authorization required for uploads
- Rate limiting for spam prevention
- Filename sanitization to prevent directory traversal

**Performance Constraints**:
- Configure PHP upload_max_filesize appropriately
- Handle large files without timeout
- Efficient client-side preview generation
- Database indexes on user_id, status, submitted_at, reviewed_by

**Storage Constraints**:
- No image compression (preserve quality)
- Organize by date or status to prevent directory bloat
- UUID-based naming to prevent conflicts
- Extensible to cloud storage (S3)

## Implementation Strategy

### Complexity Assessment
- **Effort**: L (Large) - 6-8 hours
- **Risk Level**: Medium
  - File upload handling can be tricky
  - Large file support requires proper configuration
  - Mobile drag & drop may have browser inconsistencies
- **Dependencies**: 
  - Authentication system (already implemented)
  - Storage configuration (available)
  - No blocking dependencies

### Recommended Implementation Phases

**Phase 1: Backend Foundation** (3 hours)
- Create migration and PhotoSubmission model
- Configure storage disk
- Create controller and validation request
- Add route
- Write PHPUnit tests

**Phase 2: Frontend Component** (3 hours)
- Build photo-upload.tsx with drag & drop
- Implement preview and validation
- Create or integrate PhotoUpload page
- Add progress indicator and error handling
- Mobile-first styling with dark mode

**Phase 3: Integration & Testing** (2 hours)
- End-to-end testing
- Cross-browser and device testing
- Code quality checks
- Documentation updates

### Agent Assignments

Based on feature complexity and full-stack nature:

**Primary Agents**:
- **Backend Development Agent**: Database, model, controller, validation, tests
- **Frontend Development Agent**: React component, upload UX, styling, client validation
- **Integration Agent**: Route configuration, Wayfinder integration, end-to-end flow

**Supporting Agents**:
- **Testing Agent**: PHPUnit tests, validation scenarios, edge cases
- **Review Agent**: Code quality, security review, performance optimization

**Agent Coordination**:
- Backend must complete model/controller before frontend can integrate
- Frontend can work on UI/UX in parallel using mocked endpoints
- Testing occurs continuously throughout both phases

### Context Distribution

**Backend Context** (600 tokens):
- Database schema requirements
- Model relationships and scopes
- Validation rules and file handling
- Storage configuration
- Laravel 12 conventions

**Frontend Context** (600 tokens):
- Component structure and props
- Drag & drop implementation
- Preview generation
- Wayfinder integration
- Mobile-first responsive design
- Existing UI component usage

**Testing Context** (400 tokens):
- Test scenarios (success, validation failures)
- Database and file verification
- Code quality requirements

**Review Context** (400 tokens):
- Security considerations
- Performance optimization
- Acceptance criteria validation

## Progress Tracking

- **Created**: 2025-11-15
- **Planning Complete**: [ ]
- **Backend Implementation Started**: [ ]
- **Frontend Implementation Started**: [ ]
- **Backend Complete**: [ ]
- **Frontend Complete**: [ ]
- **Integration Complete**: [ ]
- **Testing Complete**: [ ]
- **Code Quality Review Complete**: [ ]
- **Security Review Complete**: [ ]
- **Closed**: [ ]

## Technical Decision Log

### Storage Strategy
**Decision**: Use organized date-based folder structure
```
storage/app/photo-submissions/
├── 2025/
│   ├── 01/
│   │   ├── {uuid}.jpg
```
**Rationale**: Prevents directory bloat, easier to manage and backup, extensible to cloud

### File Naming
**Decision**: Use UUID v4 for stored filenames, preserve original in database
**Rationale**: Prevents collisions, improves security, allows original name retrieval

### Status Management
**Decision**: Use PHP 8 enum class for status values
**Rationale**: Type safety, IDE autocomplete, follows Laravel 12 best practices

### Upload Size
**Decision**: Start with 10MB limit, configurable via env
**Rationale**: Balances quality needs with server resources, extensible

## Agent Communication Log

<!-- Updates from assigned agents will be appended here -->

### 2025-11-15 - Issue Created
- Issue #1 created by Planning Agent
- All requirements documented
- Implementation phases defined
- Awaiting agent assignments

---

**Next Actions**:
1. Review and refine requirements if needed
2. Assign primary and supporting agents
3. Begin Phase 1 (Backend Foundation)
4. Update progress tracking as work progresses
