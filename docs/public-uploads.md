# Public Photo Upload System

## Overview

The public upload system allows anonymous users to submit photos for the contest without creating an account. This feature is designed to lower the barrier to entry while maintaining security and preventing abuse.

## Architecture

### Visitor Identification

**Cookie-based System:**
- Cookie name: `fwb_id`
- Format: UUID (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- Expiration: 1 year
- Set by: `EnsureFwbId` middleware
- Shared with: Voting system (same cookie for both features)

**Middleware Flow:**
1. Request arrives at public upload endpoint
2. `EnsureFwbId` middleware checks for `fwb_id` cookie
3. If missing, generates new UUID and sets cookie
4. Cookie value passed to controller for tracking

### Database Schema

**PhotoSubmission Model Fields:**

```php
'user_id'         // NULL for public submissions (int for authenticated)
'visitor_fwb_id'  // UUID from cookie (NULL for authenticated)
'status'          // 'new', 'approved', 'declined'
```

**Constraints:**
- Either `user_id` OR `visitor_fwb_id` must be present (not both)
- Both types use the same `photo_submissions` table
- Same approval workflow for both submission types

**Indexes:**
- `visitor_fwb_id` - For fast lookups by visitor
- `(visitor_fwb_id, status)` - Composite index for active submission queries

### Security Layers

**1. hCaptcha Verification**
- Server-side validation via hCaptcha API
- Site key exposed to frontend
- Secret key kept server-side
- Failed validation blocks submission

**2. Rate Limiting**
- IP-based: 5 uploads/hour, 15 uploads/day
- Cookie-based: 5 uploads/hour, 15 uploads/day
- Both limits must be satisfied
- Implemented via Laravel's rate limiter

**3. Honeypot Field**
- Hidden field in form: `website`
- Should remain empty (bots typically fill it)
- If filled, submission silently rejected
- No error message shown to attacker

**4. Storage Quota Monitoring**
- Disk space checks before upload
- Configurable limits via environment
- Graceful degradation if full

**5. Request Logging**
- All upload attempts logged
- Includes IP, timestamp, success/failure
- Failed CAPTCHA attempts flagged
- Log file: `storage/logs/public-uploads.log`

## Flow Diagrams

### Upload Process

```
User → /submit-photo (GET)
  ↓
EnsureFwbId middleware sets cookie
  ↓
Show upload form with CAPTCHA
  ↓
User submits photo → /submit-photo (POST)
  ↓
ValidatePublicPhotoUpload request
  ├─ Check honeypot
  ├─ Verify CAPTCHA (server-side)
  ├─ Check rate limits (IP + Cookie)
  ├─ Validate file (size, type, dimensions)
  └─ Check submission count (3 max)
  ↓
Store photo (pending/new folder)
  ↓
Create PhotoSubmission record
  ├─ user_id: NULL
  ├─ visitor_fwb_id: from cookie
  └─ status: 'new'
  ↓
Redirect with success message
```

### Admin Review

```
Admin → /dashboard
  ↓
PhotoSubmission::new()->recent()->paginate()
  ├─ Shows authenticated submissions (user_id != NULL)
  └─ Shows public submissions (visitor_fwb_id != NULL)
  ↓
Admin clicks Approve/Decline
  ↓
Photo moved to approved/declined folder
  ↓
Status updated, reviewed_by set
  ↓
Audit log entry created
  ↓
Event dispatched (PhotoApproved/PhotoDeclined)
```

## Model Methods

### Helper Methods

```php
// Check submission type
$submission->isAuthenticatedSubmission(); // bool
$submission->isPublicSubmission();        // bool

// Get submission counts
PhotoSubmission::getSubmissionCount($userId);    // int (for user)
PhotoSubmission::getSubmissionCount($fwbId);     // int (for visitor)

// Get remaining upload slots
PhotoSubmission::getRemainingSlots($userId);     // int (0-3)
PhotoSubmission::getRemainingSlots($fwbId);      // int (0-3)
```

### Scopes

```php
// Filter by submission type
PhotoSubmission::forUser($userId)->get();
PhotoSubmission::forVisitor($fwbId)->get();

// Universal scope (works with both)
PhotoSubmission::forSubmitter($userId)->get();   // int = user
PhotoSubmission::forSubmitter($fwbId)->get();    // string = visitor

// Active submissions (new or approved)
PhotoSubmission::active()->get();

// Combine scopes
PhotoSubmission::forVisitor($fwbId)->active()->count();
```

## Testing

### Run Test Suite

```bash
# All public upload tests
php artisan test --filter=PublicUpload

# Integration tests only
php artisan test --filter=PublicUploadIntegration

# Performance tests only
php artisan test --filter=PublicUploadPerformance

# Specific test method
php artisan test --filter=test_authenticated_and_public_uploads_tracked_separately
```

### Test Coverage

**Integration Tests** (`PublicUploadIntegrationTest.php`):
- Authenticated vs public upload tracking
- Duplicate detection across submission types
- Admin review of both types
- Photo approval for public submissions
- Public voting with approved public photos
- Helper methods validation
- Submission count methods
- Scope query methods

**Performance Tests** (`PublicUploadPerformanceTest.php`):
- Query optimization for submission counting
- Concurrent upload handling
- Index usage verification
- Single-query efficiency
- Mixed submission type performance

### Manual Testing Checklist

**Public Upload Flow:**
- [ ] Visit `/submit-photo` without login
- [ ] Select photo (valid format: JPG, PNG)
- [ ] Fill photographer name and email
- [ ] Complete CAPTCHA
- [ ] Submit successfully
- [ ] Upload 3 photos total (reach limit)
- [ ] Attempt 4th upload (should be blocked)

**Security Testing:**
- [ ] Attempt upload without CAPTCHA (blocked)
- [ ] Attempt 6 uploads in 1 hour (rate limited)
- [ ] Fill honeypot field (silently rejected)
- [ ] Upload oversized file (rejected)
- [ ] Upload invalid format (rejected)

**Admin Flow:**
- [ ] Login as admin
- [ ] View dashboard (see both submission types)
- [ ] Approve public submission
- [ ] Decline public submission
- [ ] Verify audit log entries

**Voting Integration:**
- [ ] Public submission approved
- [ ] Appears in gallery
- [ ] Can be voted on
- [ ] Vote counted correctly

## Monitoring

### Log Files

**public-uploads.log:**
```
[2025-01-15 14:32:15] Upload attempt - IP: 192.168.1.1, FWB: 550e8400-..., Status: success
[2025-01-15 14:35:22] Upload attempt - IP: 10.0.0.5, FWB: 660f9511-..., Status: captcha_failed
[2025-01-15 14:40:18] Upload attempt - IP: 192.168.1.1, FWB: 550e8400-..., Status: rate_limited
```

**security.log:**
```
[2025-01-15 14:45:30] Honeypot triggered - IP: 203.0.113.0
[2025-01-15 15:12:45] Storage quota exceeded - Available: 512MB
```

### Metrics to Monitor

**Upload Success Rate:**
- Total attempts vs successful uploads
- Target: >90% success rate
- Low rate indicates issues (CAPTCHA too hard, bugs)

**CAPTCHA Failure Rate:**
- Failed CAPTCHA verifications
- Target: <5% of attempts
- High rate may indicate bot attacks

**Rate Limit Hits:**
- Requests blocked by rate limiter
- Target: <1% of attempts
- Spike indicates abuse or misconfiguration

**Storage Usage:**
- Disk space for photos
- Set alerts at 80% capacity
- Plan for cleanup/archival

### Database Queries

**Monitor These Queries:**

```sql
-- Submission count for visitor (should use index)
SELECT COUNT(*) FROM photo_submissions
WHERE visitor_fwb_id = ? AND status IN ('new', 'approved');

-- Mixed submission types on dashboard
SELECT * FROM photo_submissions
WHERE status = 'new'
ORDER BY submitted_at DESC
LIMIT 20;
```

**Performance Targets:**
- Submission count query: <10ms
- Dashboard query: <50ms
- All queries should use indexes

## Deployment

### Pre-Deployment Checklist

**Environment:**
- [ ] `HCAPTCHA_SITE_KEY` set in `.env`
- [ ] `HCAPTCHA_SECRET_KEY` set in `.env`
- [ ] `VITE_HCAPTCHA_SITE_KEY` set in `.env`
- [ ] Storage disk configured and writable
- [ ] Database backup completed

**Code:**
- [ ] All tests passing
- [ ] Migrations run successfully
- [ ] Frontend built (`npm run build`)
- [ ] PHP linting passed (`vendor/bin/pint`)

**Infrastructure:**
- [ ] Sufficient disk space (recommend 10GB minimum)
- [ ] HTTPS enabled (required for cookies to work properly)
- [ ] Rate limiting configured in production

### Post-Deployment Verification

```bash
# Test public upload page loads
curl -I https://yourdomain.com/submit-photo

# Verify CAPTCHA widget appears
# (Check browser console for errors)

# Submit test photo
# (Use actual browser, not curl)

# Check logs for entries
tail -f storage/logs/public-uploads.log
```

### Rollback Procedure

If issues occur:

1. **Database rollback:**
   ```bash
   php artisan migrate:rollback --step=1
   ```

2. **Code rollback:**
   ```bash
   git revert HEAD
   composer install --no-dev
   npm run build
   ```

3. **Clear caches:**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

## Configuration

### Environment Variables

```env
# hCaptcha (required)
HCAPTCHA_SITE_KEY=your_site_key_here
HCAPTCHA_SECRET_KEY=your_secret_key_here
VITE_HCAPTCHA_SITE_KEY=your_site_key_here

# Rate Limiting (optional, defaults shown)
PUBLIC_UPLOAD_HOURLY_LIMIT=5
PUBLIC_UPLOAD_DAILY_LIMIT=15

# Storage (optional)
MAX_UPLOAD_SIZE=10240  # in KB (10MB)
```

### Customization

**Adjust Upload Limits:**

Edit `app/Http/Requests/ValidatePublicPhotoUpload.php`:

```php
// Change submission limit (default: 3)
if ($existingCount >= 5) {  // Change to 5
    // ...
}
```

**Adjust Rate Limits:**

Edit `bootstrap/app.php`:

```php
RateLimiter::for('public-uploads', function (Request $request) {
    return [
        Limit::perHour(10)->by($request->ip()),      // Change to 10
        Limit::perDay(30)->by($request->ip()),       // Change to 30
    ];
});
```

**Change CAPTCHA Provider:**

Replace hCaptcha with reCAPTCHA:

1. Install package: `composer require anhskohbo/no-captcha`
2. Update form to use reCAPTCHA widget
3. Update validation to use reCAPTCHA API
4. Update environment variables

## Troubleshooting

### Issue: Uploads fail with "CAPTCHA verification failed"

**Causes:**
- Invalid hCaptcha keys
- Network issues reaching hCaptcha API
- Client-side JavaScript errors

**Solutions:**
- Verify keys in `.env` match hCaptcha dashboard
- Check server can reach `https://hcaptcha.com/siteverify`
- Check browser console for JavaScript errors

### Issue: Rate limit triggered too frequently

**Causes:**
- Limits set too low
- Users behind shared IP (NAT)
- Testing without clearing limits

**Solutions:**
- Increase limits in rate limiter configuration
- Consider cookie-only limiting for shared IPs
- Clear rate limiter cache: `php artisan cache:forget` with key pattern

### Issue: Photos not appearing in admin dashboard

**Causes:**
- Query filtering out public submissions
- Database index not used
- Wrong status filter

**Solutions:**
- Verify query doesn't filter by `user_id IS NOT NULL`
- Check indexes exist: `php artisan migrate:status`
- Review PhotoSubmission scopes in use

## Future Enhancements

**Potential Improvements:**
- Email notification when photo approved/declined
- Progress indicator for multi-photo uploads
- Drag-and-drop upload interface
- Image preview before submission
- EXIF data extraction and display
- Automatic orientation correction
- WebP format support
- Visitor dashboard to view own submissions

## API Reference

### Routes

```php
// Public routes (no auth required)
GET  /submit-photo              - Show upload form
POST /submit-photo              - Handle upload submission

// Authenticated routes
GET  /photos                    - View own submissions
POST /photos/upload             - Upload (authenticated)
GET  /dashboard                 - Admin dashboard (all submissions)
PATCH /photos/{id}/approve      - Approve submission (admin)
PATCH /photos/{id}/decline      - Decline submission (admin)
```

### Request Validation

**ValidatePublicPhotoUpload:**

```php
[
    'photo' => 'required|image|mimes:jpeg,jpg,png|max:10240|dimensions:min_width=800,min_height=600',
    'photographer_name' => 'required|string|max:255',
    'photographer_email' => 'required|email|max:255',
    'captcha_token' => 'required|string',
    'website' => 'nullable|string|max:0',  // Honeypot
]
```

### Response Codes

- `200` - Form displayed successfully
- `302` - Upload successful (redirect to success page)
- `422` - Validation failed (form errors)
- `429` - Rate limit exceeded
- `500` - Server error

## Security Considerations

### Data Privacy

**PII Storage:**
- Photographer name and email stored in database
- No user account created
- Data retained until submission deleted
- Cookie tracks submissions across time

**GDPR Compliance:**
- Cookie notice required (inform users)
- Right to deletion (manual process for now)
- Data retention policy needed
- Consider adding "delete my data" form

### Attack Vectors

**Bot Submissions:**
- Mitigated by CAPTCHA + honeypot
- Monitor for patterns in logs
- Adjust difficulty if needed

**Rate Limit Bypass:**
- Cookie can be cleared (new FWB ID)
- IP can be changed (VPN)
- Both limits required to slow abuse

**Storage DoS:**
- Quota monitoring prevents disk fill
- Rate limiting slows attack
- Consider max total storage per visitor

**Duplicate Uploads:**
- File hash prevents exact duplicates
- Slight modifications bypass (rotate, crop)
- Consider perceptual hashing for similarity

## Best Practices

1. **Monitor logs regularly** - Catch issues early
2. **Test rate limits** - Ensure they work as expected
3. **Backup database frequently** - Before major events
4. **Set storage alerts** - Don't run out of space
5. **Review uploads daily** - Catch inappropriate content
6. **Update CAPTCHA keys** - Rotate periodically
7. **Document customizations** - Track config changes
8. **Load test before launch** - Verify performance under load
