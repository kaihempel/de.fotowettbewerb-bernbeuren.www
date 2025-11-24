# GitHub Issue #12: Remove obsolete React components and layouts

## Issue Summary
Remove unused React components and layouts from the codebase following migration to GlobalLayout pattern and Onyx UI components.

## Priority
High (P1) - Enhancement

## Context
The application has migrated to:
- `GlobalLayout` for all pages (instead of separate app-layout/auth-layout wrappers)
- Onyx UI components (`OxCard`, `OxButton`, etc.) instead of Radix UI components
- Inline layouts rather than separate layout wrapper components

## Files to Delete

### Phase 1: Zero-Risk Deletions (11 files)

**Duplicate/Unused Components (3 files):**
- `resources/js/components/ui/icon.tsx`
- `resources/js/components/alert-error.tsx`
- `resources/js/components/app-content.tsx`

**Unused UI Components (4 files):**
- `resources/js/components/ui/placeholder-pattern.tsx`
- `resources/js/components/ui/collapsible.tsx`
- `resources/js/components/ui/toggle-group.tsx`
- `resources/js/components/ui/select.tsx`

**Obsolete Layouts (4 files):**
- `resources/js/layouts/app-layout.tsx`
- `resources/js/layouts/auth-layout.tsx`
- `resources/js/layouts/auth/auth-card-layout.tsx`
- `resources/js/layouts/auth/auth-split-layout.tsx`

### Phase 2: Conditional Deletions (3 files)
- `resources/js/layouts/app/app-header-layout.tsx`
- `resources/js/components/app-header.tsx`
- `resources/js/components/ui/navigation-menu.tsx`

## Expected Benefits
- Reduced bundle size: 50-100KB (gzipped)
- LOC reduction: 1,500-2,000 lines
- Faster builds
- Clearer architecture

## Verification Steps
1. Delete files
2. Run `npm run build`
3. Run `npm run lint`
4. Run `npm run types`
5. Test authentication flows
6. Test main application pages
