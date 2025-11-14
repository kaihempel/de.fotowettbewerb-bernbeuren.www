# Fotowettbewerb Bernbeuren

A modern photo contest platform built with Laravel 12 and React 19, powered by Inertia.js.

## Overview

This application provides a complete foundation for running photo contests with features like user authentication, profile management, two-factor authentication, and a modern responsive UI with dark mode support.

## Technology Stack

### Backend
- **Laravel 12** - Latest PHP framework with streamlined structure
- **PHP 8.4** - Modern PHP features
- **Inertia.js v2** - Modern monolithic architecture
- **Laravel Fortify** - Headless authentication backend
- **Laravel Wayfinder** - Type-safe route generation for frontend

### Frontend
- **React 19** - With React Compiler enabled
- **TypeScript** - Strict type checking
- **Tailwind CSS v4** - CSS-first configuration
- **Radix UI** - Accessible component primitives
- **Vite** - Lightning-fast build tool

### Development Tools
- **PHPUnit 11** - Backend testing
- **Laravel Pint** - PHP code formatting
- **ESLint & Prettier** - JavaScript/TypeScript formatting
- **Laravel Pail** - Beautiful log viewer

## Quick Start

### Prerequisites
- PHP 8.4 or higher
- Composer
- Node.js 18+ and npm
- SQLite (for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd de.fotowettbewerb-bernbeuren.www

# Run the setup script (installs dependencies, generates key, runs migrations)
composer run setup
```

This will:
1. Install PHP dependencies
2. Copy `.env.example` to `.env`
3. Generate application key
4. Run database migrations
5. Install npm dependencies
6. Build frontend assets

### Development

Start the development server (runs Laravel server, queue worker, logs, and Vite):

```bash
composer run dev
```

This starts:
- Laravel development server on http://localhost:8000
- Queue worker for background jobs
- Laravel Pail for live logs
- Vite dev server for hot module replacement

Visit http://localhost:8000 to see the application.

### Development with SSR

For server-side rendering support:

```bash
composer run dev:ssr
```

## Features

### Authentication
- User registration with email verification
- Secure login with "remember me" option
- Password reset via email
- Two-factor authentication (2FA) with QR codes
- Password confirmation for sensitive actions
- Account deletion

### User Settings
- Profile information management
- Email change (triggers re-verification)
- Password updates
- Two-factor authentication setup/removal
- Appearance preferences (light/dark/system theme)

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode support with system preference detection
- Accessible components built on Radix UI
- Sidebar navigation with breadcrumbs
- Loading states and error handling
- Toast notifications

## Project Structure

```
app/
├── Actions/Fortify/          # Authentication actions
├── Http/
│   ├── Controllers/
│   │   └── Settings/         # Settings controllers
│   ├── Middleware/           # Custom middleware
│   └── Requests/
│       └── Settings/         # Form request validation
├── Models/                   # Eloquent models
└── Providers/                # Service providers

resources/
├── css/
│   └── app.css              # Tailwind CSS entry point
└── js/
    ├── components/          # React components
    │   └── ui/             # Radix UI components
    ├── hooks/              # Custom React hooks
    ├── layouts/            # Page layouts
    ├── Pages/              # Inertia pages
    │   ├── auth/          # Authentication pages
    │   └── settings/      # Settings pages
    └── wayfinder/         # Auto-generated route helpers

routes/
├── web.php                 # Main web routes
└── settings.php           # Settings routes

tests/
├── Feature/               # Feature tests
└── Unit/                 # Unit tests
```

## Available Commands

### Development
```bash
composer run dev          # Start all dev services
composer run dev:ssr      # Start dev with SSR
npm run dev               # Vite dev server only
```

### Building
```bash
npm run build             # Build for production
npm run build:ssr         # Build with SSR support
```

### Code Quality
```bash
vendor/bin/pint --dirty   # Format PHP code
npm run lint              # Lint and fix JS/TS
npm run format            # Format JS/TS files
npm run format:check      # Check formatting
npm run types             # TypeScript type checking
```

### Testing
```bash
composer run test                              # Run all tests
php artisan test                               # Run PHPUnit tests
php artisan test tests/Feature/ExampleTest.php # Run specific test
php artisan test --filter=testName             # Run by name
```

### Database
```bash
php artisan migrate                    # Run migrations
php artisan migrate:fresh --seed       # Fresh start with seeders
php artisan db:seed                    # Run seeders only
```

## Key Features Explained

### Wayfinder Integration

Type-safe route generation for the frontend:

```typescript
// Import controller actions
import { update } from '@/actions/App/Http/Controllers/Settings/ProfileController'

// Use with Inertia Form component
<Form {...update.form()}>
  <input name="name" />
</Form>

// Or get URLs
update.url() // "/settings/profile"
```

### Theme Management

The application includes a sophisticated theme system:

```typescript
import { useAppearance } from '@/hooks/use-appearance'

const { appearance, setAppearance } = useAppearance()
// appearance: 'light' | 'dark' | 'system'
```

Theme preference is stored in a cookie and persists across sessions.

### Custom Hooks

- `use-appearance` - Theme management with system preference detection
- `use-clipboard` - Copy text to clipboard with feedback
- `use-initials` - Generate user initials for avatars
- `use-mobile` - Responsive breakpoint detection
- `use-mobile-navigation` - Mobile menu state management
- `use-two-factor-auth` - 2FA QR code and recovery code management

### UI Components

25+ pre-built, accessible components:
- Forms: Button, Checkbox, Input-OTP, Label, Toggle
- Layout: Card, Separator, Sheet, Sidebar
- Navigation: Breadcrumb, Navigation-Menu
- Overlays: Alert, Dialog, Tooltip
- Data: Avatar, Badge, Spinner

All components support dark mode and follow accessibility best practices.

## Configuration

### Environment Variables

Key environment variables in `.env`:

```env
APP_NAME="Fotowettbewerb Bernbeuren"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

MAIL_MAILER=smtp
# ... mail configuration for password resets and email verification
```

### Fortify Configuration

Authentication features are configured in `config/fortify.php`:

```php
'features' => [
    Features::registration(),
    Features::emailVerification(),
    Features::resetPasswords(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

## Documentation

Additional documentation is available in the `docs/` directory:

- `eloquent.md` - Eloquent ORM guide
- `events.md` - Event system documentation
- `Inertia.md` - Inertia.js integration details
- `migration.md` - Database migration guide

See `CLAUDE.md` for development guidelines and conventions.

## Contributing

### Code Style

Before committing:

1. Format PHP code: `vendor/bin/pint --dirty`
2. Format JS/TS code: `npm run lint`
3. Run tests: `php artisan test`
4. Check TypeScript: `npm run types`

### Conventions

- Use `php artisan make:` commands for Laravel files
- Follow existing file structures and naming patterns
- Add tests for new features
- Use explicit type declarations in PHP and TypeScript
- Prefer existing UI components over creating new ones

## License

MIT

## Support

For issues and feature requests, please create an issue in the repository.
