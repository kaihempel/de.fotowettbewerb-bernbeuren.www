# Data Model: i18n/Internationalization Support

**Feature**: 001-i18n-support
**Date**: 2025-11-26

## Entity Changes

### User (Modified)

Adds locale preference to existing User model.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| locale | string(5) | nullable | User's preferred language (e.g., 'de', 'en'). Null means use system default. |

**Migration**:
```sql
ALTER TABLE users ADD COLUMN locale VARCHAR(5) NULL DEFAULT NULL;
```

**Validation Rules**:
- Must be one of configured available locales: `['de', 'en']`
- Null is valid (falls back to system default)

**Relationships**: No new relationships

## New Entities

### Translation Namespace (Conceptual - No Database)

Translation namespaces are file-based, not database entities.

| Namespace | Purpose | Approximate String Count |
|-----------|---------|--------------------------|
| common | Shared UI elements (buttons, navigation, labels) | ~50 |
| auth | Authentication pages (login, register, 2FA, password) | ~60 |
| dashboard | Admin dashboard, photo review | ~40 |
| gallery | Public gallery, voting | ~30 |
| submissions | Photo submission pages | ~35 |
| settings | User settings pages | ~45 |
| validation | Form validation messages | ~40 |
| content | Static pages (About, Imprint, Project) | ~50 |

**Total**: ~350 strings per locale

### Locale (Conceptual - Configuration)

Supported locales are defined in configuration, not database.

| Locale Code | Name | Direction | Default |
|-------------|------|-----------|---------|
| de | German | LTR | Yes (fallback) |
| en | English | LTR | No |

**Configuration Location**: `config/app.php`
```php
'locale' => 'de',
'fallback_locale' => 'de',
'available_locales' => ['de', 'en'],
```

## State Transitions

### User Locale Preference

```
┌─────────────────┐
│  null (default) │
└────────┬────────┘
         │ User selects locale
         ▼
┌─────────────────┐
│  'de' or 'en'   │
└────────┬────────┘
         │ User changes locale
         ▼
┌─────────────────┐
│  'en' or 'de'   │
└─────────────────┘
```

**Transitions**:
1. New user: `null` → Inherits system locale (de)
2. User selects language: `null` → `'de'` or `'en'`
3. User changes language: `'de'` ↔ `'en'`
4. Reset to default: `'de'/'en'` → `null` (optional, not currently in scope)

### Anonymous User Locale (localStorage)

```
┌─────────────────────────┐
│  No localStorage entry  │
└───────────┬─────────────┘
            │ First visit, detect from browser
            ▼
┌─────────────────────────┐
│  localStorage['i18n']   │
│  = 'de' or 'en'         │
└───────────┬─────────────┘
            │ User switches language
            ▼
┌─────────────────────────┐
│  localStorage updated   │
└─────────────────────────┘
```

## Data Volume Assumptions

| Metric | Expected Value |
|--------|----------------|
| Users with locale preference set | ~30% of registered users |
| Translation string count | ~350 per locale |
| Translation file size | ~50-100KB per locale (JSON) |
| Language switches per session | 0-1 (most users don't switch) |

## Indexes

No new indexes required. The `locale` column on users is rarely queried directly (it's loaded with user data on authentication).

## Constraints Summary

| Entity | Constraint | Rule |
|--------|------------|------|
| User.locale | Enum validation | Must be in `['de', 'en']` or null |
| Translation keys | Uniqueness | Unique within namespace per locale |
| Fallback behavior | Required | Missing keys fall back to German (de) |
