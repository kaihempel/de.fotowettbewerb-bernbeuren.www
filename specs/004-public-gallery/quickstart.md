# Quickstart Guide: Public Gallery Homepage

**Feature**: 004-public-gallery
**Date**: 2025-11-15

## Overview

This guide helps developers set up, test, and verify the public gallery homepage feature. Follow these steps to get the gallery running locally with test data.

---

## Prerequisites

Before starting, ensure you have completed the project setup:

```bash
# If first time setup
composer run setup

# Otherwise, ensure services are running
composer run dev
```

**Required Dependencies** (already installed):
- PHP 8.4
- Laravel 12
- Node.js (for Vite + React)
- SQLite (development database)

---

## Setup Steps

### 1. Verify Database Migration

Check that the `photo_submissions` table exists with the correct schema:

```bash
# Run migrations (if not already run)
php artisan migrate

# Verify table structure
php artisan tinker
>>> DB::select("PRAGMA table_info(photo_submissions)");
>>> exit
```

**Expected columns**:
- id, user_id, image_path, thumbnail_path, status, rate, created_at, updated_at

### 2. Verify Composite Index

Ensure the `(status, created_at)` composite index exists for optimal query performance:

```bash
php artisan tinker
>>> DB::select("PRAGMA index_list(photo_submissions)");
>>> exit
```

**Expected**: Index named `photo_submissions_status_created_at_index`

**If missing**, create it with a migration:

```bash
php artisan make:migration add_status_created_at_index_to_photo_submissions --no-interaction

# In the migration file:
public function up()
{
    Schema::table('photo_submissions', function (Blueprint $table) {
        $table->index(['status', 'created_at']);
    });
}

php artisan migrate
```

### 3. Seed Test Data

Create approved photos for testing the gallery:

```bash
# Using tinker for quick testing
php artisan tinker

# Create 50 approved photos
>>> \App\Models\PhotoSubmission::factory()
...     ->approved()
...     ->count(50)
...     ->create();

# Create some pending/rejected photos (should NOT appear in gallery)
>>> \App\Models\PhotoSubmission::factory()->count(10)->create(['status' => 'pending']);
>>> \App\Models\PhotoSubmission::factory()->count(5)->create(['status' => 'rejected']);

>>> exit
```

**Alternative**: Use a seeder class

```bash
# If PhotoSubmissionSeeder exists
php artisan db:seed --class=PhotoSubmissionSeeder
```

### 4. Verify Test Data

Confirm approved photos exist:

```bash
php artisan tinker
>>> \App\Models\PhotoSubmission::where('status', 'approved')->count();
# Should return 50

>>> \App\Models\PhotoSubmission::where('status', 'approved')->first();
# Should show a photo record

>>> exit
```

### 5. Start Development Server

```bash
# Start all development services (Laravel + Vite)
composer run dev

# Or start with SSR (optional)
composer run dev:ssr
```

**Services Started**:
- Laravel development server: `http://localhost:8000`
- Vite dev server: `http://localhost:5173`
- Queue worker (background jobs)
- Laravel Pail (logs)

---

## Testing the Gallery

### 1. View Gallery Homepage

Open your browser and navigate to:

```
http://localhost:8000/
```

**Expected Behavior**:
- See a responsive grid of photos (2-5 columns depending on screen width)
- First 20 approved photos displayed
- Skeleton loaders visible while images load
- Photos ordered by submission date (oldest first)

### 2. Test Infinite Scroll

**Steps**:
1. Scroll down to the bottom of the page
2. Watch for skeleton loaders to appear
3. Next batch of 20 photos automatically loads
4. Continue scrolling until all 50 photos loaded
5. See "You've reached the end!" message

**Verify**:
- No duplicate photos appear
- Loading is smooth without layout shift
- Scroll position preserved during load
- No JavaScript errors in browser console

### 3. Test Empty State

**Setup**:
```bash
php artisan tinker
>>> \App\Models\PhotoSubmission::where('status', 'approved')->delete();
>>> exit
```

**Expected**: "No photos available yet. Check back soon!" message displayed

**Restore test data**: Re-run seed commands from Step 3

### 4. Test Responsive Layout

Use browser dev tools to test different screen sizes:

**Mobile (375px)**:
- 2 columns
- Photos stacked vertically
- Touch-friendly spacing

**Tablet (768px)**:
- 3 columns
- Balanced layout

**Desktop (1280px)**:
- 4-5 columns
- Wide grid

**Large Desktop (1920px)**:
- Maximum 5 columns
- Consistent spacing

### 5. Test Navigation to Voting Page

**Steps**:
1. Click on any photo in the gallery
2. Should navigate to voting page: `/voting?photo={id}`
3. Use browser back button
4. Should return to gallery (scroll position may reset - acceptable for v1)

**Verify**:
- Correct photo ID passed to voting page
- Photo displayed on voting page
- Navigation works smoothly

### 6. Test Keyboard Navigation

**Steps**:
1. Press `Tab` key repeatedly
2. Focus should move through photos sequentially
3. Press `Enter` when photo focused
4. Should navigate to voting page

**Verify**:
- Visible focus indicators on photos
- Can reach all photos via keyboard
- Enter key activates navigation

---

## Running Tests

### Run Feature Tests

```bash
# Run all gallery tests
php artisan test --filter=PublicGallery

# Or run specific test file
php artisan test tests/Feature/PublicGalleryControllerTest.php
```

**Expected Tests**:
1. ✅ Gallery displays approved photos
2. ✅ Gallery paginates with 20 photos per page
3. ✅ Gallery uses cursor-based pagination
4. ✅ Gallery excludes pending/rejected photos
5. ✅ Gallery handles empty state
6. ✅ Gallery handles last page correctly
7. ✅ Gallery query is optimized (no N+1)

### Run All Tests

```bash
# Full test suite
php artisan test

# With coverage (optional)
php artisan test --coverage
```

---

## Verify Performance

### 1. Check Query Performance

Enable query logging to verify < 100ms query execution:

```bash
php artisan tinker

# Enable query log
>>> DB::enableQueryLog();

# Execute gallery query
>>> \App\Models\PhotoSubmission::query()
...     ->where('status', 'approved')
...     ->orderBy('created_at')
...     ->cursorPaginate(20);

# Check queries
>>> DB::getQueryLog();
# Should show single query with EXPLAIN showing index usage

>>> exit
```

### 2. Check Page Load Time

Use browser DevTools Network tab:

**First Load**:
- Total page load: < 2 seconds (per spec)
- Initial photos visible

**Subsequent Loads** (infinite scroll):
- Batch load: < 500ms (per spec)
- Smooth append to grid

### 3. Check Scroll Performance

Use browser DevTools Performance tab:

**Record Scrolling**:
1. Start recording
2. Scroll through gallery
3. Stop recording

**Verify**:
- Frame rate: 60fps (per spec)
- No long tasks during scroll
- Intersection Observer efficient

---

## Troubleshooting

### Photos Not Displaying

**Symptom**: Empty gallery despite seeded data

**Solutions**:
1. Verify photos are approved: `PhotoSubmission::where('status', 'approved')->count()`
2. Check Laravel filesystem config: `config/filesystems.php` → `'default' => 'public'`
3. Create storage symlink: `php artisan storage:link`
4. Check browser console for 404 errors on image URLs

### Infinite Scroll Not Working

**Symptom**: No new photos load when scrolling to bottom

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify `next_cursor` in API response (should be non-null if more photos)
3. Check Intersection Observer support (all modern browsers)
4. Inspect sentinel element exists in DOM

### Skeleton Loaders Not Showing

**Symptom**: No loading indicators during data fetch

**Solutions**:
1. Verify Tailwind CSS compiled: `npm run build` or `npm run dev`
2. Check `animate-pulse` utility available (Tailwind v4)
3. Inspect loading state in React DevTools

### Performance Issues

**Symptom**: Slow query or page load times

**Solutions**:
1. Verify composite index exists: `PRAGMA index_list(photo_submissions)`
2. Check query plan: `EXPLAIN SELECT ...`
3. Limit data in development: Use 20-50 photos for testing
4. Check image sizes: Thumbnails should be < 50KB

---

## Code Quality Checks

Before finalizing any changes, run these commands:

### 1. Format PHP Code

```bash
vendor/bin/pint --dirty
```

### 2. Lint TypeScript/React

```bash
npm run lint
```

### 3. Check TypeScript Types

```bash
npm run types
```

### 4. Run Tests

```bash
php artisan test --filter=PublicGallery
```

---

## Next Steps

After verifying the gallery works locally:

1. **Review Implementation**: Check all code follows Laravel/React best practices
2. **Test Edge Cases**: Empty gallery, single page, last page, large datasets
3. **Accessibility Audit**: Keyboard nav, screen readers, ARIA labels
4. **Performance Audit**: Query times, page load, scroll performance
5. **Create Pull Request**: Document changes, link to issue #4
6. **Deploy to Staging**: Test with real production-like data
7. **QA Testing**: Full user acceptance testing

---

## Useful Commands Reference

```bash
# Development
composer run dev              # Start all dev services
composer run dev:ssr          # Start dev with SSR
npm run build                 # Build for production

# Database
php artisan migrate           # Run migrations
php artisan db:seed           # Run seeders
php artisan migrate:fresh --seed  # Fresh DB with seed data

# Testing
php artisan test              # Run all tests
php artisan test --filter=PublicGallery  # Run specific tests
php artisan test --coverage   # With coverage report

# Code Quality
vendor/bin/pint --dirty       # Format PHP
npm run lint                  # Lint & fix JS/TS
npm run types                 # Check TypeScript

# Debugging
php artisan tinker            # Interactive shell
php artisan route:list        # List all routes
php artisan serve             # Start server (manual)
```

---

## Support & Documentation

- **Feature Spec**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contract**: [contracts/gallery-api.yml](./contracts/gallery-api.yml)
- **Project Docs**: `/docs/` directory
- **Laravel Docs**: https://laravel.com/docs/12.x
- **Inertia Docs**: https://inertiajs.com
- **React Docs**: https://react.dev

---

**Last Updated**: 2025-11-15
**Feature Branch**: 004-public-gallery
**Status**: Ready for Implementation
