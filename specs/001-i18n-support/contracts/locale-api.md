# API Contract: Locale Management

**Feature**: 001-i18n-support
**Date**: 2025-11-26

## Endpoints

### POST /locale

Update the current user's locale preference.

**Authentication**: Optional (works for both authenticated and anonymous users)

**Request Body**:
```json
{
  "locale": "en"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| locale | string | Yes | Must be one of: `de`, `en` |

**Response (Success - 302 Redirect)**:
- Redirects back to previous page
- Sets session locale for current request
- For authenticated users: Updates `users.locale` in database
- For anonymous users: Frontend handles localStorage update

**Response (Validation Error - 422)**:
```json
{
  "message": "The locale field must be one of: de, en.",
  "errors": {
    "locale": ["The locale field must be one of: de, en."]
  }
}
```

**Example cURL**:
```bash
curl -X POST https://example.com/locale \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: {token}" \
  -d '{"locale": "en"}'
```

## Inertia Shared Props

The following props are shared on every Inertia page request via `HandleInertiaRequests` middleware:

```typescript
interface SharedProps {
  locale: 'de' | 'en';        // Current active locale
  locales: ('de' | 'en')[];   // Available locales for switcher
  // ... other existing shared props
}
```

**Source**: `app/Http/Middleware/HandleInertiaRequests.php`

**Behavior**:
- `locale`: Determined by (in order): authenticated user's database preference → session locale → `APP_LOCALE` config
- `locales`: Always `['de', 'en']` from `config('app.available_locales')`

## Route Definition

```php
// routes/web.php
Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');
```

## Frontend Integration

### Language Switcher Component Usage

```typescript
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

function LanguageSwitcher() {
  const { locale, locales } = usePage().props;

  const switchLocale = (newLocale: string) => {
    // Update localStorage for persistence
    localStorage.setItem('i18n-locale', newLocale);

    // Update i18next immediately
    i18n.changeLanguage(newLocale);

    // Persist to server (for authenticated users)
    router.post('/locale', { locale: newLocale }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    // ... switcher UI
  );
}
```

### Initial Locale Detection

```typescript
// resources/js/i18n/config.ts
import { usePage } from '@inertiajs/react';

// On app initialization
const serverLocale = usePage().props.locale;
const storedLocale = localStorage.getItem('i18n-locale');

// For authenticated users: server wins
// For anonymous users: localStorage wins, then server fallback
const initialLocale = isAuthenticated
  ? serverLocale
  : (storedLocale || serverLocale);
```

## Security Considerations

1. **CSRF Protection**: All POST requests must include valid CSRF token (automatic with Inertia)
2. **Input Validation**: Locale value validated against allowed list server-side
3. **Rate Limiting**: Consider adding rate limiting if abuse detected (not initially required)
4. **No Sensitive Data**: Locale preference is non-sensitive, no special encryption needed
