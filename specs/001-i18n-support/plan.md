# Implementation Plan: i18n/Internationalization Support

**Branch**: `001-i18n-support` | **Date**: 2025-11-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-i18n-support/spec.md`

## Summary

Implement internationalization (i18n) support for the photo contest application using i18next and react-i18next, enabling German (primary) and English language support. The implementation includes:
- i18next library integration with React 19
- Translation files organized by namespace (8 namespaces for 350+ strings)
- Language switcher component in header and user menu
- User preference persistence (browser storage for anonymous, database for authenticated)
- Laravel backend integration via Inertia shared props

## Technical Context

**Language/Version**: PHP 8.4 (backend), TypeScript (frontend)
**Primary Dependencies**: Laravel 12, React 19, Inertia.js v2, i18next, react-i18next, i18next-browser-languagedetector
**Storage**: SQLite (development), users table for locale preference
**Testing**: PHPUnit 11 (backend), manual testing (frontend i18n)
**Target Platform**: Web application (modern browsers)
**Project Type**: Web application (Laravel + React/Inertia)
**Performance Goals**: Language switching < 500ms without page reload
**Constraints**: No external translation services, bundled translations only
**Scale/Scope**: 350+ strings, 19 pages, 55 components, 5 layouts, 2 locales (de, en)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Laravel-First Architecture | PASS | Uses Laravel middleware for locale sharing, Inertia for data flow |
| II. Type Safety & Modern Standards | PASS | TypeScript for translations, typed translation keys |
| III. Test-Driven Development (TDD) | PASS | PHPUnit tests for LocaleController, middleware changes |
| IV. Component Reusability | PASS | Single LanguageSwitcher component reused in header and user menu |
| V. Inertia Best Practices | PASS | Locale shared via HandleInertiaRequests middleware |
| VI. Accessibility & User Experience | PASS | Translated aria-labels, accessibility maintained |
| VII. Code Quality & Formatting | PASS | Will run Pint and ESLint before finalizing |
| VIII. Security & Authentication | PASS | Locale validation, CSRF protection on preference updates |

**Gate Result**: PASS - No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-i18n-support/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
# Existing Laravel + React structure (additions for i18n)

app/
├── Http/
│   ├── Controllers/
│   │   └── LocaleController.php       # NEW: Handle locale switching
│   └── Middleware/
│       └── HandleInertiaRequests.php  # MODIFY: Share locale data
└── Models/
    └── User.php                       # MODIFY: Add locale attribute

database/
└── migrations/
    └── xxxx_add_locale_to_users.php   # NEW: Add locale column

resources/
├── js/
│   ├── i18n/                          # NEW: i18n configuration
│   │   ├── config.ts                  # i18next setup
│   │   └── locales/
│   │       ├── de/                    # German translations
│   │       │   ├── common.json
│   │       │   ├── auth.json
│   │       │   ├── dashboard.json
│   │       │   ├── gallery.json
│   │       │   ├── submissions.json
│   │       │   ├── settings.json
│   │       │   ├── validation.json
│   │       │   └── content.json
│   │       └── en/                    # English translations
│   │           └── [same structure]
│   ├── components/
│   │   └── language-switcher.tsx      # NEW: Language switcher component
│   ├── hooks/
│   │   └── use-locale.ts              # NEW: Locale management hook
│   └── app.tsx                        # MODIFY: Initialize i18n
└── lang/
    ├── de/                            # Laravel backend translations
    └── en/

tests/
└── Feature/
    └── LocaleTest.php                 # NEW: Locale switching tests
```

**Structure Decision**: Extends existing Laravel + React web application structure. Translation files placed in `resources/js/i18n/locales/` following i18next conventions. Backend translations remain in Laravel's `resources/lang/` directory.

## Complexity Tracking

> No violations requiring justification. All principles satisfied.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
