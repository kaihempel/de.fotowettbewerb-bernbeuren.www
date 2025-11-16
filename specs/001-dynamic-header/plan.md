# Implementation Plan: Dynamic Header with Photo Gallery Landing Page

**Branch**: `001-dynamic-header` | **Date**: 2025-11-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dynamic-header/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Transform the Laravel start page into a modern landing page featuring a dynamic header that transitions from 20vh to 80px on scroll (100px threshold), a burger menu navigation system, and an integrated photo gallery displaying contest photos in a responsive grid (1 column mobile, 3-4 columns desktop). Photos preserve original aspect ratios and link to dedicated rating pages. The page must achieve 5s load time on 3G and 2s on broadband while supporting light/dark modes and WCAG AA accessibility standards.

## Technical Context

**Language/Version**: PHP 8.4 (backend), TypeScript (frontend)
**Primary Dependencies**: Laravel 12, React 19, Inertia.js v2, Tailwind CSS v4, Radix UI components, Laravel Wayfinder
**Storage**: Laravel filesystem (local disk for photos), SQLite database (development)
**Testing**: PHPUnit 11 (backend), Vitest (frontend - if required)
**Target Platform**: Web (responsive: 320px mobile to 1024px+ desktop)
**Project Type**: Web application (Laravel + React via Inertia)
**Performance Goals**:
- Initial page load: 5s on 3G, 2s on broadband (SC-009)
- Header transitions: 300-400ms smooth animations at 60fps (FR-012, SC-003)
- Responsive grid rendering without layout shifts
**Constraints**:
- WCAG AA compliance (4.5:1 contrast ratio) - FR-019, SC-006
- Keyboard navigation support - FR-018
- Preserve photo aspect ratios without cropping - FR-022
- JavaScript disabled graceful degradation (edge case)
**Scale/Scope**:
- Single landing page component
- Integration with existing PublicGalleryController
- Support for unlimited contest photos with lazy loading

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Pre-Implementation Gates

**I. Laravel-First Architecture**
- ✅ Using existing `PublicGalleryController` (FR-009)
- ✅ Inertia rendering for `/` route (already configured in `routes/web.php` line 7)
- ✅ No new Laravel files needed beyond potential view component updates
- ✅ Environment variables handled via Laravel config

**II. Type Safety & Modern Standards**
- ✅ TypeScript strict mode for React components
- ✅ Functional React components with explicit prop types
- ✅ Wayfinder for type-safe route generation
- ✅ React 19 features available

**III. Test-Driven Development (TDD)**
- ⚠️ **ACTION REQUIRED**: Tests must be written for:
  - Photo gallery rendering (different aspect ratios)
  - Header scroll behavior
  - Menu navigation functionality
  - Responsive layout breakpoints
  - Dark mode theme switching
  - Performance metrics (load time targets)

**IV. Component Reusability**
- ✅ Check existing Radix UI components before creating new ones:
  - Sheet component for mobile menu (overlay)
  - Button for menu items
  - Navigation-Menu (if applicable for desktop)
  - Existing theme hooks (`use-appearance`)
- ⚠️ **ACTION REQUIRED**: Verify no duplicate header/menu components exist

**V. Inertia Best Practices**
- ✅ Replace `welcome.tsx` with gallery-focused page component
- ✅ Use `<Link>` component for navigation
- ✅ Consider deferred props for photo loading (performance optimization)
- ✅ Skeleton loading states for slow photo loads

**VI. Accessibility & User Experience**
- ✅ ARIA labels required (FR-019)
- ✅ Keyboard navigation (FR-018)
- ✅ Theme support via `use-appearance` hook (FR-017)
- ✅ Responsive design 320px-1024px+ (FR-016)
- ✅ Loading states for photos

**VII. Code Quality & Formatting**
- ⚠️ **ACTION REQUIRED**: Run before finalizing:
  - `vendor/bin/pint --dirty` (PHP)
  - `npm run lint` (TypeScript/React)
  - `npm run types` (type checking)

**VIII. Security & Authentication**
- ✅ No authentication required for public gallery viewing
- ✅ Photo rating page navigation uses Wayfinder (type-safe routes)
- ✅ No form submissions on landing page (menu navigation only)
- ⚠️ **ACTION REQUIRED**: Ensure photo URLs are properly sanitized from PublicGalleryController

### Constitution Compliance: ✅ PASSES (with action items for implementation phase)

**Non-Negotiable Principles Status**:
- Type Safety: ✅ Required for React components and TypeScript
- TDD: ⚠️ Tests required before PR
- Code Quality: ⚠️ Formatting required before PR

---

## Post-Design Constitution Re-Check

**Date**: 2025-11-16 (after Phase 1 design completion)

### ✅ Design Validation

**I. Laravel-First Architecture**
- ✅ Data model reuses existing `Photo` model
- ✅ No new migrations required
- ✅ PublicGalleryController provides data via Inertia
- ✅ Routes configured in `routes/web.php`

**II. Type Safety & Modern Standards**
- ✅ All TypeScript interfaces defined in `data-model.md`
- ✅ Props explicitly typed (`GalleryPageProps`, `Photo`, `PhotoGridProps`)
- ✅ Wayfinder routes type-safe (`route('photo.show', photo.id)`)
- ✅ Functional components with explicit types

**III. Test-Driven Development (TDD)**
- ✅ Test structure defined in `quickstart.md` (Step 1)
- ✅ Feature tests: `LandingPageTest` with 2 scenarios
- ⚠️ **IMPLEMENTATION REQUIREMENT**: Write tests BEFORE implementing components
- ✅ Test checklist covers all FRs and SCs

**IV. Component Reusability**
- ✅ Reuses Radix UI Sheet component (no custom overlay)
- ✅ Reuses `use-appearance` hook (no new theme management)
- ✅ New components (`PublicHeader`, `PhotoGrid`) are reusable
- ✅ Follows existing component patterns

**V. Inertia Best Practices**
- ✅ Uses `Inertia::render('Gallery', ...)` pattern
- ✅ Deferred props for photo loading (optional optimization)
- ✅ `<Link>` component for navigation
- ✅ Proper page component structure

**VI. Accessibility & User Experience**
- ✅ ARIA labels defined (`aria-label="Open navigation menu"`)
- ✅ Keyboard navigation via Radix UI patterns
- ✅ `use-appearance` hook for theme management
- ✅ Responsive breakpoints documented (320px-1024px+)
- ✅ Loading states and empty state handling

**VII. Code Quality & Formatting**
- ✅ Quickstart includes formatting steps (Step 11)
- ✅ `vendor/bin/pint --dirty` for PHP
- ✅ `npm run lint` for TypeScript
- ✅ `npm run types` for type checking

**VIII. Security & Authentication**
- ✅ No authentication on public gallery (correct for feature)
- ✅ Photo URLs validated server-side (assumed existing validation)
- ✅ XSS prevention via React automatic escaping
- ✅ No forms, no CSRF tokens needed

### Final Compliance: ✅ PASSES ALL GATES

**Design Quality**:
- All technical unknowns resolved in `research.md`
- Data model uses existing entities (no new database schema)
- API contract defines type-safe Inertia props
- Quickstart provides TDD implementation path
- Performance targets documented and achievable

**Ready for Implementation**: Yes (`/speckit.tasks` can be run next)

## Project Structure

### Documentation (this feature)

```text
specs/001-dynamic-header/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
resources/js/
├── Pages/
│   ├── welcome.tsx              # REPLACE with Gallery.tsx or GalleryLanding.tsx
│   └── [other pages]
├── components/
│   ├── ui/                      # Radix UI components (reuse)
│   ├── public-header.tsx        # NEW: Dynamic header component with scroll behavior and integrated burger menu (uses Radix Sheet)
│   └── photo-grid.tsx           # NEW: Responsive photo grid component
├── hooks/
│   ├── use-appearance.tsx       # EXISTING: Theme management (reuse)
│   ├── use-scroll-position.ts   # NEW: Scroll detection hook for header transitions
│   └── [other hooks]
├── layouts/
│   └── public-layout.tsx        # NEW (optional): Layout for public pages
└── wayfinder/                   # AUTO-GENERATED: Route helpers

resources/css/
└── app.css                      # Tailwind CSS v4 styles (update for header/grid)

routes/
└── web.php                      # EXISTING: "/" route already configured (line 7)

app/Http/Controllers/
└── PublicGalleryController.php  # EXISTING: Provides photo data (FR-009)

tests/Feature/
└── LandingPageTest.php          # NEW: Feature tests for landing page

tests/Browser/                   # OPTIONAL: Dusk tests for scroll behavior
└── HeaderScrollTest.php         # NEW: Browser tests for animations
```

**Structure Decision**: Web application using Laravel backend with React frontend via Inertia.js. The landing page is a single-page component (`resources/js/Pages/`) that replaces the existing `welcome.tsx`. New reusable components for the header, menu, and photo grid will be created in `resources/js/components/`. The existing `PublicGalleryController` provides photo data without modification.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations requiring justification**. All constitution principles are satisfied or have clear action items for the implementation phase. The feature leverages existing infrastructure (PublicGalleryController, Radix UI components, Inertia, Wayfinder) without introducing unnecessary complexity.
