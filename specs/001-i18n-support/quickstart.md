# Quickstart: i18n/Internationalization Support

**Feature**: 001-i18n-support
**Date**: 2025-11-26

## Prerequisites

- Node.js 18+ and npm
- PHP 8.4 with Composer
- Existing Laravel 12 + React 19 application running

## Quick Setup

### 1. Install Dependencies

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. Run Database Migration

```bash
php artisan migrate
```

This adds the `locale` column to the users table.

### 3. Build Assets

```bash
npm run build
```

### 4. Verify Installation

1. Start the development server: `composer run dev`
2. Visit any page - should display in German (default)
3. Click language switcher in header
4. Select English - page should update immediately
5. Refresh page - preference should persist

## Using Translations in Components

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');

  return (
    <button>{t('buttons.submit')}</button>
  );
}
```

### With Namespace

```tsx
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const { t } = useTranslation('auth');

  return (
    <h1>{t('login.title')}</h1>
  );
}
```

### With Interpolation

```tsx
const { t } = useTranslation('gallery');

// Translation: "You have {{count}} votes remaining"
<p>{t('votesRemaining', { count: 5 })}</p>
```

### With Pluralization

```tsx
const { t } = useTranslation('gallery');

// Translations:
// "vote": "{{count}} vote"
// "vote_plural": "{{count}} votes"
<p>{t('vote', { count: votes })}</p>
```

## Adding New Translations

### 1. Add to German file (primary)

```json
// resources/js/i18n/locales/de/common.json
{
  "myNewKey": "Mein neuer Text"
}
```

### 2. Add to English file

```json
// resources/js/i18n/locales/en/common.json
{
  "myNewKey": "My new text"
}
```

### 3. Use in component

```tsx
const { t } = useTranslation('common');
<span>{t('myNewKey')}</span>
```

## Translation Key Naming Convention

- Use dot notation for nested keys: `common.navigation.home`
- Group by feature: `auth.login.title`, `auth.login.email`
- Use descriptive names: `dashboard.stats.totalSubmissions`
- Keep keys in English (they're developer-facing)

## Namespace Reference

| Namespace | Use For |
|-----------|---------|
| `common` | Shared UI (buttons, navigation, labels) |
| `auth` | Login, register, password reset, 2FA |
| `dashboard` | Admin dashboard, photo review |
| `gallery` | Public gallery, voting |
| `submissions` | Photo upload and submission |
| `settings` | User settings pages |
| `validation` | Form validation messages |
| `content` | Static pages (About, Imprint, Project) |

## Testing Translations

### Manual Testing

1. Switch to each locale
2. Navigate through all pages
3. Check for:
   - Missing translations (shows key instead of text)
   - Truncated text (layout issues)
   - Incorrect pluralization

### Automated Check

```bash
# Check TypeScript types compile
npm run types

# Lint for any issues
npm run lint
```

## Troubleshooting

### Translation not appearing

1. Check key exists in both locale files
2. Verify namespace is correct in `useTranslation('namespace')`
3. Check browser console for i18next warnings

### Language not switching

1. Check browser console for errors
2. Verify `/locale` endpoint is accessible
3. Check localStorage has correct value: `localStorage.getItem('i18n-locale')`

### Server locale not applied

1. Check `HandleInertiaRequests` middleware is sharing locale
2. Verify `APP_LOCALE` is set in `.env`
3. For authenticated users, check `users.locale` column value
