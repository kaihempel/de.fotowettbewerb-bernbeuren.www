# Research: i18n/Internationalization Support

**Feature**: 001-i18n-support
**Date**: 2025-11-26

## Research Tasks

### 1. i18next Integration with React 19

**Decision**: Use i18next v24+ with react-i18next v15+ for React 19 compatibility

**Rationale**:
- i18next is the most widely adopted i18n solution for React applications
- react-i18next v15 fully supports React 19 and the new React Compiler
- Provides hooks-based API (`useTranslation`) aligned with functional component patterns
- Supports namespaces, pluralization, and interpolation out of the box
- Active maintenance and large community

**Alternatives Considered**:
- **react-intl (FormatJS)**: More verbose API, heavier bundle, less flexible namespace support
- **lingui**: Excellent but smaller community, less mature tooling
- **Custom solution**: Too much effort for standard i18n needs

### 2. Translation File Structure

**Decision**: JSON files organized by namespace in `resources/js/i18n/locales/{locale}/`

**Rationale**:
- JSON is natively supported by i18next without additional parsers
- Namespace-based organization (8 namespaces) enables:
  - Logical grouping by feature area
  - Potential future code-splitting per namespace
  - Easier maintenance and team collaboration
- Directory structure mirrors the application's feature areas

**Alternatives Considered**:
- **Single large file per locale**: Harder to maintain, no code-splitting potential
- **YAML/PO files**: Require additional parsers, more complex tooling
- **TypeScript files with objects**: Lose JSON tooling benefits, harder to edit

### 3. Language Detection Strategy

**Decision**: Layered detection: Server locale (Inertia prop) → User database preference → Browser storage → Browser language

**Rationale**:
- Server locale from `APP_LOCALE` provides consistent initial state
- Authenticated users get their saved preference from database (syncs across devices)
- Anonymous users' preference stored in localStorage (persists across sessions)
- Browser language as final fallback ensures graceful degradation

**Detection Order**:
1. Server-provided locale via Inertia shared props (authoritative for authenticated users)
2. localStorage for anonymous returning visitors
3. Browser `navigator.language` for first-time visitors
4. Fallback to German (de) as default

**Alternatives Considered**:
- **Cookie-based detection**: Less reliable, server roundtrip needed
- **URL-based (e.g., /en/page)**: Requires routing changes, SEO complexity
- **Accept-Language header only**: Ignores user preference, no persistence

### 4. Laravel Backend Integration Pattern

**Decision**: Share locale via `HandleInertiaRequests` middleware, update via `LocaleController`

**Rationale**:
- Follows Inertia best practices for global data sharing
- Single source of truth for current locale
- Laravel's built-in localization handles backend validation messages
- Minimal backend code required

**Implementation Pattern**:
```php
// HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'locale' => app()->getLocale(),
        'locales' => config('app.available_locales', ['de', 'en']),
    ]);
}
```

**Alternatives Considered**:
- **API endpoint for locale data**: Unnecessary extra request
- **SSR-only locale setting**: Loses client-side reactivity
- **Session-only storage**: Doesn't persist for authenticated users across devices

### 5. User Preference Persistence

**Decision**: Database `locale` column for authenticated users, localStorage for anonymous users

**Rationale**:
- Authenticated users expect preferences to follow them across devices
- Anonymous users need session persistence without account creation
- Simple migration adds `locale` nullable string column to users table
- Conflict resolution: Server preference wins on login, updates browser storage

**Implementation**:
- Database: `users.locale` VARCHAR(5) nullable, default null
- Browser: `localStorage.setItem('i18n-locale', 'de')`
- Sync: On login, user's database locale overrides localStorage

**Alternatives Considered**:
- **Separate preferences table**: Overcomplicated for single setting
- **Cookie storage**: Size limits, server-side complexity
- **No anonymous persistence**: Poor UX for returning visitors

### 6. TypeScript Type Safety for Translations

**Decision**: Use i18next's built-in TypeScript support with custom type declarations

**Rationale**:
- i18next v24+ has improved TypeScript support
- Type-safe `t()` function calls prevent typos in translation keys
- IDE autocomplete for translation keys improves developer experience
- Can generate types from JSON files if needed

**Implementation**:
```typescript
// i18n/types.d.ts
import 'i18next';
import common from './locales/de/common.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      // ... other namespaces
    };
  }
}
```

**Alternatives Considered**:
- **No type safety**: Leads to runtime errors from typos
- **Code generation tools**: Additional build complexity
- **Wrapper functions**: Verbose, duplicates i18next functionality

### 7. Performance Optimization

**Decision**: Bundle all translations at build time, no lazy loading for 2 locales

**Rationale**:
- With only 2 locales and ~350 strings each, total size is minimal (~50-100KB)
- Bundling eliminates network requests for translations
- Instant language switching without loading states
- Complexity of lazy loading not justified for this scale

**Alternatives Considered**:
- **Lazy load per namespace**: Overhead exceeds benefit for small translation sets
- **Lazy load per locale**: Adds loading delay on language switch
- **CDN-hosted translations**: Unnecessary complexity, adds external dependency

### 8. Pluralization and Interpolation

**Decision**: Use i18next's built-in pluralization with ICU-like syntax

**Rationale**:
- German and English have similar plural rules (1 vs many)
- i18next handles both languages correctly out of the box
- Interpolation syntax `{{count}}` is clear and maintainable

**Examples**:
```json
{
  "vote": "{{count}} Stimme",
  "vote_plural": "{{count}} Stimmen"
}
```

**Alternatives Considered**:
- **ICU MessageFormat**: More powerful but more complex for simple cases
- **Custom plural functions**: Unnecessary when i18next handles it

## Dependencies to Install

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

**Version Requirements**:
- `i18next`: ^24.2.0 (React 19 compatible)
- `react-i18next`: ^15.3.0 (React 19 compatible)
- `i18next-browser-languagedetector`: ^8.0.2 (optional, for initial detection)

## Open Questions Resolved

All NEEDS CLARIFICATION items from Technical Context have been resolved through this research.

| Question | Resolution |
|----------|------------|
| i18n library choice | i18next + react-i18next |
| Translation file format | JSON with namespace organization |
| Language detection | Server → Database → localStorage → Browser |
| Backend integration | Inertia shared props via HandleInertiaRequests |
| User preference storage | Database for auth users, localStorage for anonymous |
| Type safety approach | i18next TypeScript declarations |
