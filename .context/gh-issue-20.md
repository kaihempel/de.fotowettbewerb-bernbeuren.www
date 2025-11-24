# GitHub Issue #20: Testing & Integration - Comprehensive testing and cleanup for public uploads

## Overview
This issue focuses on comprehensive testing, integration verification, and cleanup tasks to ensure the public photo upload feature works seamlessly end-to-end. This includes updating existing authenticated upload logic, adding integration tests, updating documentation, and verifying all components work together.

## Priority
Medium (P2) - Enhancement

## Key Objectives
1. Update PhotoSubmission model with helper methods for submission type identification
2. Enhance model scopes to work with both authenticated (user_id) and public (visitor_fwb_id) submissions
3. Create comprehensive integration tests for full upload flow
4. Create performance tests for query optimization
5. Update README with public upload documentation
6. Create detailed API and deployment documentation
7. Verify all tests pass and no regressions in existing functionality

## Technical Requirements

### 1. Model Updates (PhotoSubmission.php)
- Add `isAuthenticatedSubmission()` and `isPublicSubmission()` helper methods
- Add `scopeForSubmitter()` to handle both user_id (int) and visitor_fwb_id (string)
- Add `getSubmissionCount()` and `getRemainingSlots()` static methods
- Ensure existing scopes work with both submission types

### 2. Integration Tests (PublicUploadIntegrationTest.php)
- Test authenticated and public uploads tracked separately
- Test duplicate detection across submission types
- Test admin review of both submission types
- Test photo approval for public submissions
- Test public voting with approved public submissions

### 3. Performance Tests (PublicUploadPerformanceTest.php)
- Test submission counting query optimization
- Test concurrent upload handling with FWB ID generation
- Verify database indexes are used correctly

### 4. Documentation Updates
- **README.md**: Add Public Photo Submission section with setup and security info
- **docs/public-uploads.md**: Comprehensive architecture, testing, and monitoring guide
- **docs/deployment-checklist.md**: Pre-deployment, deployment, post-deployment, and rollback procedures

## Acceptance Criteria
- [x] Model helper methods added and working
- [x] Model scopes updated for both submission types
- [x] Integration tests created and passing
- [x] Performance tests created and passing
- [x] README updated with public upload documentation
- [x] API documentation created (docs/public-uploads.md)
- [x] Deployment checklist created
- [x] All PHPUnit tests passing
- [x] Code passes linting (Pint)
- [x] TypeScript type checking passes

## Testing Strategy
1. Run existing tests to ensure no regressions
2. Run new integration tests
3. Run performance tests
4. Manual testing of both authenticated and public upload flows
5. Verify admin dashboard works with both submission types

## Files to Create/Update
- `app/Models/PhotoSubmission.php` (update)
- `tests/Feature/PublicUploadIntegrationTest.php` (new)
- `tests/Feature/PublicUploadPerformanceTest.php` (new)
- `README.md` (update)
- `docs/public-uploads.md` (new)
- `docs/deployment-checklist.md` (new)

## Dependencies
- Requires all previous issues completed (Issues #15-19)
- This is the final issue in the public upload feature set

## Success Metrics
- All unit and feature tests passing
- Integration tests verify end-to-end flow
- Performance tests show optimized queries
- Documentation complete and accurate
- Zero regressions in authenticated upload functionality
- Public upload accessible and working
