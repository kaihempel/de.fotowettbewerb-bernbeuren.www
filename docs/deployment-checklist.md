# Public Upload Deployment Checklist

This checklist ensures a safe and successful deployment of the public photo upload feature.

## Pre-Deployment

### Database

- [ ] **Backup production database**
  ```bash
  # Create timestamped backup
  php artisan backup:run
  # Or manual backup
  sqlite3 database/database.sqlite ".backup 'database/backup-$(date +%Y%m%d-%H%M%S).sqlite'"
  ```

- [ ] **Test migration in staging environment**
  ```bash
  # Run migrations on staging first
  php artisan migrate --pretend  # Preview SQL
  php artisan migrate            # Execute
  ```

- [ ] **Verify indexes exist**
  ```bash
  # Check migration status
  php artisan migrate:status

  # Verify in database
  sqlite3 database/database.sqlite "PRAGMA index_list('photo_submissions');"
  ```

  Expected indexes:
  - `visitor_fwb_id`
  - `(visitor_fwb_id, status)` composite

### Configuration

- [ ] **hCaptcha keys configured in `.env`**
  ```env
  HCAPTCHA_SITE_KEY=0x1234567890abcdef1234567890abcdef12345678
  HCAPTCHA_SECRET_KEY=0xABCDEF1234567890ABCDEF1234567890ABCDEF12
  ```

  Verify keys work:
  - Go to https://www.hcaptcha.com/ → Dashboard
  - Copy site key (public)
  - Copy secret key (keep secure)

- [ ] **Frontend environment variable set**
  ```env
  VITE_HCAPTCHA_SITE_KEY=0x1234567890abcdef1234567890abcdef12345678
  ```

  Note: Must match `HCAPTCHA_SITE_KEY`

- [ ] **Rate limiting configured**

  Check `bootstrap/app.php`:
  ```php
  RateLimiter::for('public-uploads', function (Request $request) {
      return [
          Limit::perHour(5)->by($request->ip()),
          Limit::perDay(15)->by($request->ip()),
          Limit::perHour(5)->by($request->cookie('fwb_id')),
          Limit::perDay(15)->by($request->cookie('fwb_id')),
      ];
  });
  ```

- [ ] **Storage quota limits set**

  Check `config/filesystems.php` or `.env`:
  ```env
  MAX_UPLOAD_SIZE=10240  # 10MB in KB
  ```

### Testing

- [ ] **All PHPUnit tests passing**
  ```bash
  php artisan test
  # Should show: Tests: X passed
  ```

- [ ] **Frontend tests passing** (if applicable)
  ```bash
  npm run test
  ```

- [ ] **Integration tests verified**
  ```bash
  php artisan test --filter=PublicUploadIntegration
  # All integration scenarios should pass
  ```

- [ ] **Performance tests completed**
  ```bash
  php artisan test --filter=PublicUploadPerformance
  # Query performance should meet targets
  ```

- [ ] **Security audit completed**

  Verify:
  - CAPTCHA verification is server-side
  - Honeypot field present
  - Rate limits enforced
  - File validation strict
  - No XSS vulnerabilities in photo display

### Code Quality

- [ ] **PHP code formatted**
  ```bash
  vendor/bin/pint --dirty
  # Should show: No changes required
  ```

- [ ] **TypeScript/JavaScript formatted**
  ```bash
  npm run format:check
  # Should show: All files formatted correctly
  ```

- [ ] **TypeScript type checking**
  ```bash
  npm run types
  # Should show: No type errors
  ```

## Deployment Steps

### 1. Backup

```bash
# Create full backup (database + files)
php artisan backup:run --only-db
tar -czf storage-backup-$(date +%Y%m%d).tar.gz storage/app/photos
```

- [ ] Database backup created
- [ ] Photo storage backup created
- [ ] Backups stored in safe location

### 2. Deploy Code

```bash
# Pull latest code
git pull origin main

# Install dependencies (production)
composer install --no-dev --optimize-autoloader

# Install and build frontend assets
npm install
npm run build
```

- [ ] Code pulled successfully
- [ ] Composer dependencies installed
- [ ] Frontend assets built
- [ ] No build errors

### 3. Run Migrations

```bash
# Preview SQL that will be executed
php artisan migrate --pretend

# Run migrations
php artisan migrate --force
```

- [ ] Migrations previewed
- [ ] Migrations executed successfully
- [ ] Database schema updated

### 4. Clear Caches

```bash
# Clear and rebuild all caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

- [ ] Configuration cached
- [ ] Routes cached
- [ ] Views cached
- [ ] Application optimized

### 5. Set Permissions

```bash
# Ensure writable directories
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

- [ ] Storage writable
- [ ] Bootstrap cache writable
- [ ] Correct ownership

### 6. Schedule Cleanup Job

```bash
# Verify cron entry exists
crontab -l | grep schedule:run

# If missing, add:
# * * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

- [ ] Cron job scheduled
- [ ] Cleanup job will run daily
- [ ] Logs rotation configured

## Post-Deployment

### Verification

- [ ] **Public upload page accessible**
  ```bash
  curl -I https://yourdomain.com/submit-photo
  # Should return: HTTP/2 200
  ```

- [ ] **CAPTCHA widget loads correctly**

  Browser test:
  1. Visit `/submit-photo`
  2. Open DevTools Console
  3. Look for hCaptcha widget
  4. No JavaScript errors

- [ ] **Test upload as public user**

  Manual test:
  1. Open incognito window
  2. Navigate to `/submit-photo`
  3. Select valid photo
  4. Fill photographer info
  5. Complete CAPTCHA
  6. Submit
  7. Verify success message
  8. Check database for new record

- [ ] **Verify authenticated uploads still work**

  Test:
  1. Login as regular user
  2. Navigate to `/photos`
  3. Upload photo
  4. Verify success

- [ ] **Check admin dashboard shows both submission types**

  Test:
  1. Login as admin
  2. Navigate to `/dashboard`
  3. Verify public submissions visible
  4. Verify authenticated submissions visible
  5. Both have correct labels/indicators

### Monitoring

- [ ] **Check public-uploads.log for errors**
  ```bash
  tail -f storage/logs/public-uploads.log
  # Upload a test photo, verify log entry appears
  ```

- [ ] **Monitor storage usage**
  ```bash
  df -h /path/to/storage
  # Ensure sufficient space available
  ```

- [ ] **Verify rate limiting works**

  Test:
  1. Attempt 6 uploads in 1 hour
  2. 6th attempt should be blocked
  3. Error message: "Too Many Attempts"

- [ ] **Check CAPTCHA success rate**

  Review logs:
  - Successful uploads vs CAPTCHA failures
  - Target: >95% success rate
  - High failure rate indicates issues

### Health Checks

- [ ] **Application responding**
  ```bash
  curl https://yourdomain.com/submit-photo
  # Should return HTML with CAPTCHA widget
  ```

- [ ] **Database connections working**
  ```bash
  php artisan tinker
  > \App\Models\PhotoSubmission::count()
  # Should return number without error
  ```

- [ ] **Queue workers running** (if using queues)
  ```bash
  php artisan queue:work --once
  # Should process jobs successfully
  ```

- [ ] **Scheduled tasks running**
  ```bash
  php artisan schedule:list
  # Should show cleanup job scheduled
  ```

## Rollback Plan

If critical issues occur, follow this rollback procedure:

### Step 1: Assess Impact

- [ ] Identify what's broken
- [ ] Determine if rollback necessary
- [ ] Notify stakeholders

### Step 2: Database Rollback

```bash
# Rollback last migration
php artisan migrate:rollback --step=1

# Verify rollback successful
php artisan migrate:status
```

- [ ] Migration rolled back
- [ ] Database in previous state
- [ ] Data integrity verified

### Step 3: Code Rollback

```bash
# Find last working commit
git log --oneline -10

# Revert to previous version
git revert HEAD
# Or hard reset (destructive):
# git reset --hard <previous-commit-hash>

# Reinstall dependencies
composer install --no-dev
npm install
npm run build
```

- [ ] Code reverted
- [ ] Dependencies reinstalled
- [ ] Assets rebuilt

### Step 4: Clear Caches

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
```

- [ ] Caches cleared
- [ ] Configuration reset
- [ ] Routes regenerated

### Step 5: Restore Database (if needed)

```bash
# Restore from backup
cp database/backup-YYYYMMDD-HHMMSS.sqlite database/database.sqlite

# Or import:
sqlite3 database/database.sqlite < backup.sql
```

- [ ] Database restored
- [ ] Data verified
- [ ] Application functional

### Step 6: Verify Rollback

- [ ] Application loads
- [ ] Previous features work
- [ ] No errors in logs
- [ ] Users can access site

## Communication Plan

### Pre-Deployment

- [ ] Notify team of deployment window
- [ ] Schedule during low-traffic period
- [ ] Prepare support team for inquiries

### During Deployment

- [ ] Update status page (if applicable)
- [ ] Monitor error logs in real-time
- [ ] Keep team on standby

### Post-Deployment

- [ ] Announce new feature to users
- [ ] Update documentation
- [ ] Monitor for 24 hours
- [ ] Collect user feedback

## Success Criteria

Deployment is successful when:

- [x] All pre-deployment checks passed
- [x] Migration completed without errors
- [x] All tests passing in production
- [x] Public upload page accessible
- [x] CAPTCHA working correctly
- [x] Uploads succeed for test users
- [x] Admin dashboard shows all submissions
- [x] Rate limiting enforced
- [x] No errors in logs (24h monitoring)
- [x] Zero regressions in existing features
- [x] Performance metrics within targets

## Troubleshooting

### Issue: CAPTCHA not loading

**Check:**
- Frontend environment variable set: `VITE_HCAPTCHA_SITE_KEY`
- Assets rebuilt after env change: `npm run build`
- Browser console for errors
- Network tab for failed requests to hCaptcha

**Fix:**
```bash
# Rebuild assets
npm run build
# Clear cache
php artisan optimize:clear
```

### Issue: Uploads fail silently

**Check:**
- `storage/logs/public-uploads.log` for errors
- File permissions on storage directory
- Disk space available
- PHP upload limits

**Fix:**
```bash
# Check permissions
ls -la storage/app/photos
# Set correct permissions
chmod -R 775 storage
# Check disk space
df -h
```

### Issue: Rate limit not working

**Check:**
- Cache driver configured (Redis/Memcached recommended)
- Rate limiter keys not expired prematurely
- Multiple servers using shared cache

**Fix:**
```bash
# Clear rate limiter cache
php artisan cache:forget rate-limit:public-uploads*
# Restart cache driver
sudo systemctl restart redis
```

### Issue: Database deadlocks

**Check:**
- Concurrent uploads causing locks
- Long-running transactions
- Missing indexes

**Fix:**
```bash
# Check indexes
sqlite3 database/database.sqlite "PRAGMA index_list('photo_submissions');"
# Analyze query performance
php artisan db:show
```

## Post-Deployment Monitoring (24-48 Hours)

### Metrics to Track

- [ ] **Upload success rate**
  - Target: >90%
  - Alert if <80%

- [ ] **Average upload time**
  - Target: <5 seconds
  - Alert if >10 seconds

- [ ] **CAPTCHA failure rate**
  - Target: <5%
  - Alert if >10%

- [ ] **Rate limit hits**
  - Target: <1% of requests
  - Alert if >5%

- [ ] **Storage growth**
  - Monitor disk usage
  - Project when cleanup needed

- [ ] **Error rate**
  - Target: <0.1%
  - Alert on any 500 errors

### Review Schedule

- **Hour 1:** Check every 15 minutes
- **Hours 2-6:** Check every hour
- **Hours 7-24:** Check every 4 hours
- **Days 2-7:** Check daily

## Sign-Off

- [ ] Technical lead approval
- [ ] QA verification complete
- [ ] Security review passed
- [ ] Stakeholder informed
- [ ] Documentation updated
- [ ] Runbook created

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Verified By:** _________________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
