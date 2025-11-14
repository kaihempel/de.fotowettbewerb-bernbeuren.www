# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 + React 19 application built with Inertia.js for creating a photo contest platform ("Fotowettbewerb Bernbeuren"). The application uses a modern Laravel stack with TypeScript, Tailwind CSS v4, and includes authentication features powered by Laravel Fortify.

## Technology Stack

- **Backend**: Laravel 12 (PHP 8.4), Inertia.js v2, Laravel Fortify, Laravel Wayfinder
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Radix UI components
- **Build Tools**: Vite, Laravel Vite Plugin, Wayfinder Vite Plugin
- **Testing**: PHPUnit 11
- **Code Quality**: Laravel Pint (PHP), ESLint & Prettier (JS/TS)

## Development Commands

### Initial Setup
```bash
composer run setup
# Runs: composer install, .env setup, key generation, migrations, npm install, npm run build
```

### Development Server
```bash
composer run dev
# Starts: Laravel server, queue worker, logs (Pail), and Vite dev server concurrently
```

### Development with SSR
```bash
composer run dev:ssr
# Same as dev but with Inertia SSR enabled
```

### Building Assets
```bash
npm run build          # Build for production
npm run build:ssr      # Build with SSR support
npm run dev            # Start Vite dev server only
```

### Code Quality
```bash
vendor/bin/pint --dirty    # Format PHP code (run before finalizing changes)
npm run lint               # Lint and fix TypeScript/React code
npm run format             # Format JS/TS files with Prettier
npm run format:check       # Check formatting without fixing
npm run types              # Run TypeScript type checking
```

### Testing
```bash
composer run test                              # Run all tests
php artisan test                               # Run all PHPUnit tests
php artisan test tests/Feature/ExampleTest.php # Run specific test file
php artisan test --filter=testName             # Run specific test by name
```

### Database
```bash
php artisan migrate              # Run migrations
php artisan migrate:fresh --seed # Fresh migration with seeders
php artisan db:seed              # Run database seeders
```

## Architecture & Code Structure

### Laravel 12 Modern Structure
This application uses Laravel 12's streamlined file structure:
- **No middleware files** in `app/Http/Middleware/` for route middleware - register them in `bootstrap/app.php`
- **No `app/Console/Kernel.php`** - commands in `app/Console/Commands/` auto-register
- **`bootstrap/app.php`** - Central configuration for middleware, exceptions, and routing
- **`bootstrap/providers.php`** - Application service providers

### Key Application Components

**Inertia Pages** (`resources/js/Pages/`)
- `welcome.tsx` - Landing page
- `dashboard.tsx` - Authenticated dashboard
- `auth/` - Authentication pages (login, register, verify email, two-factor)
- `settings/` - User settings pages (profile, password, two-factor)

**Controllers** (`app/Http/Controllers/`)
- Follow Laravel conventions with explicit return types
- Form validation handled via dedicated FormRequest classes in `app/Http/Requests/`
- Settings controllers in `Settings/` namespace

**Models** (`app/Models/`)
- Use `casts()` method for defining casts (not `$casts` property)
- Relationship methods must have explicit return type hints

**Middleware** (`app/Http/Middleware/`)
- `HandleInertiaRequests.php` - Shares global data with Inertia
- `HandleAppearance.php` - Manages appearance/theme settings
- Both registered in `bootstrap/app.php`

**Fortify Actions** (`app/Actions/Fortify/`)
- `CreateNewUser.php` - User registration logic
- `ResetUserPassword.php` - Password reset logic
- `PasswordValidationRules.php` - Shared validation trait

### Frontend Architecture

**React Components** (`resources/js/components/`)
- `ui/` - Radix UI-based components (Card, Button, Dialog, etc.)
- Application-specific components at root level
- TypeScript with strict typing enabled

**Wayfinder Integration**
- Auto-generated route helpers in `resources/js/wayfinder/`
- Use named imports from `@/actions/` for controller methods
- Use named imports from `@/routes/` for named routes
- Type-safe route generation with parameter validation

**Styling**
- Tailwind CSS v4 with CSS-first configuration using `@theme` directive
- Main styles in `resources/css/app.css`
- Uses `@import "tailwindcss"` (not `@tailwind` directives)
- Dark mode support with `dark:` variants

### Authentication Flow
- Powered by Laravel Fortify (configured in `config/fortify.php`)
- Features enabled: registration, email verification, password reset, profile updates, 2FA
- Custom Inertia views defined in `FortifyServiceProvider`
- 2FA implementation with QR codes and recovery codes

### Database
- SQLite for development (`:memory:` for testing)
- Migrations in `database/migrations/`
- Factories in `database/factories/`
- Seeders in `database/seeders/`

## Important Conventions

### PHP Code Style
- Always use curly braces for control structures
- Use PHP 8 constructor property promotion
- Explicit return type declarations required for all methods
- Follow Laravel Pint formatting (run before committing)

### TypeScript/React
- Use React 19 features (React Compiler enabled via Babel plugin)
- Functional components with TypeScript
- ESLint and Prettier configured - run `npm run lint` before committing
- Import from aliased paths: `@/` points to `resources/js/`

### Wayfinder Usage
- Prefer named imports for tree-shaking: `import { show } from '@/actions/...'`
- Use `.form()` with Inertia `<Form>` component: `<Form {...store.form()}>`
- Use `.url()` to get URL strings: `show.url(1)`
- Use `.get()`, `.post()`, `.patch()`, `.put()`, `.delete()` for specific HTTP methods

### Inertia Best Practices
- Use `Inertia::render()` in routes, not Blade views
- Navigate with `router.visit()` or `<Link>` component
- Prefer `<Form>` component for forms (not `useForm` hook)
- Use deferred props with skeleton loading states for async data

### Testing Requirements
- All changes must have corresponding PHPUnit tests
- Tests live in `tests/Feature/` (preferred) and `tests/Unit/`
- Run minimal tests needed after changes: `php artisan test --filter=testName`
- Use factories for model creation in tests

### Creating New Files
- Use `php artisan make:` commands for all Laravel files (models, controllers, migrations, etc.)
- Pass `--no-interaction` to Artisan commands
- Check sibling files for naming and structure conventions before creating new files
