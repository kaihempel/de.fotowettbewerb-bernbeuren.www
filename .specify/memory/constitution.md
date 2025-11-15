<!--
Sync Impact Report
==================
Version Change: N/A → 1.0.0
- Initial constitution creation for Fotowettbewerb Bernbeuren project

Modified Principles: N/A (initial creation)

Added Sections:
- Core Principles (8 principles total)
  - I. Laravel-First Architecture
  - II. Type Safety & Modern Standards
  - III. Test-Driven Development (TDD)
  - IV. Component Reusability
  - V. Inertia Best Practices
  - VI. Accessibility & User Experience
  - VII. Code Quality & Formatting
  - VIII. Security & Authentication
- Technology Standards
- Development Workflow
- Governance

Removed Sections: N/A (initial creation)

Templates Requiring Updates:
✅ .specify/templates/plan-template.md - Constitution Check section aligned
✅ .specify/templates/spec-template.md - Requirements sections aligned
✅ .specify/templates/tasks-template.md - Task categorization aligned
✅ CLAUDE.md - References constitution principles for guidance
✅ AGENTS.md - Laravel Boost guidelines complement constitution

Follow-up TODOs: None
-->

# Fotowettbewerb Bernbeuren Constitution

## Core Principles

### I. Laravel-First Architecture

Every feature MUST leverage Laravel's ecosystem and conventions. The application uses Laravel 12's streamlined structure with modern PHP 8.4 features. New features MUST:

- Use `php artisan make:` commands for all Laravel files (models, controllers, migrations, etc.)
- Follow Laravel 12's bootstrap-centric structure (`bootstrap/app.php` for middleware/exceptions, no `app/Console/Kernel.php`)
- Leverage Eloquent ORM with explicit relationship return type hints before raw queries
- Register middleware, exceptions, and routing in `bootstrap/app.php` (not separate middleware files)
- Use environment variables only in configuration files (never `env()` directly in code)

**Rationale**: Laravel's conventions reduce boilerplate, prevent common mistakes, and ensure consistency across the codebase. The Laravel 12 structure simplifies maintenance by centralizing configuration.

### II. Type Safety & Modern Standards

All code MUST use explicit type declarations to catch errors early and improve IDE support. This principle is NON-NEGOTIABLE.

**PHP Requirements**:
- Explicit return type declarations for all methods and functions
- PHP 8 constructor property promotion
- Use `casts()` method on models (not `$casts` property)
- Always use curly braces for control structures, even single-line

**TypeScript/React Requirements**:
- Strict TypeScript typing enabled
- Functional components with explicit prop types
- Import from aliased paths (`@/` for `resources/js/`)
- Use React 19 features (React Compiler enabled)

**Wayfinder Requirements**:
- Prefer named imports for tree-shaking: `import { show } from '@/actions/...'`
- Type-safe route generation with parameter validation
- Use `.form()` with Inertia `<Form>` component for automatic action/method

**Rationale**: Type safety prevents runtime errors, improves refactoring confidence, and enhances developer experience through better autocomplete and documentation.

### III. Test-Driven Development (TDD)

All changes MUST have corresponding PHPUnit tests. Tests are NOT optional. This principle is NON-NEGOTIABLE.

**Testing Requirements**:
- All changes must include tests in `tests/Feature/` (preferred) or `tests/Unit/`
- Use factories for model creation in tests (check for custom states before manual setup)
- Run minimal tests after changes: `php artisan test --filter=testName`
- Tests must cover happy paths, failure paths, and edge cases
- Never remove tests without explicit approval

**Test Execution**:
- Run affected tests immediately after implementation
- Ask user if they want to run full test suite before finalizing
- Format: `php artisan test tests/Feature/ExampleTest.php` for specific files

**Rationale**: Tests catch regressions early, document expected behavior, and enable confident refactoring. TDD ensures features are testable and well-designed from the start.

### IV. Component Reusability

Always check for existing components before creating new ones. The application includes 25+ pre-built UI components from Radix UI.

**Component Guidelines**:
- Search `resources/js/components/ui/` for existing Radix UI components (Button, Card, Dialog, Sheet, Sidebar, Avatar, Checkbox, Toggle, Tooltip, etc.)
- Check sibling files for naming and structure conventions
- All components MUST support dark mode using `dark:` variants
- Components MUST be accessible (following Radix UI patterns)
- Extract repeated patterns into reusable components

**Available Component Categories**:
- Form controls: Button, Checkbox, Input-OTP, Label, Toggle, Toggle-Group
- Layout: Card, Separator, Sheet, Sidebar
- Navigation: Breadcrumb, Navigation-Menu
- Overlays: Alert, Dialog, Tooltip
- Data display: Avatar, Badge, Placeholder-Pattern, Spinner
- Interactive: Collapsible, Icon

**Rationale**: Reusing components ensures consistency, reduces bundle size, maintains accessibility standards, and accelerates development.

### V. Inertia Best Practices

Inertia.js v2 bridges Laravel and React. All server-side rendering MUST use Inertia patterns.

**Inertia Requirements**:
- Use `Inertia::render()` in routes (not Blade views)
- Navigate with `router.visit()` or `<Link>` component
- Prefer `<Form>` component for forms (not `useForm` hook)
- Use deferred props with skeleton loading states for async data
- Place pages in `resources/js/Pages/` directory

**Inertia v2 Features to Leverage**:
- Polling for real-time updates
- Prefetching for faster navigation
- Deferred props for progressive loading
- Infinite scrolling using merging props and `WhenVisible`
- Form helpers: `resetOnError`, `resetOnSuccess`, `setDefaultsOnSuccess`

**Rationale**: Inertia v2 provides modern SPA-like UX without API complexity. Following patterns ensures predictable data flow and optimal performance.

### VI. Accessibility & User Experience

All UI components MUST be accessible and provide excellent user experience across devices.

**Accessibility Requirements**:
- Follow Radix UI accessibility patterns (keyboard navigation, ARIA labels, focus management)
- Support light/dark/system themes via `use-appearance` hook
- Responsive design for mobile, tablet, desktop
- Loading states and error handling for all async operations
- Toast notifications for user feedback

**Theme Management**:
- Theme preference stored in cookies (persists across sessions)
- System preference detection for initial theme
- Support for light, dark, and system modes

**Rationale**: Accessibility is a legal requirement and improves UX for all users. Theme support and responsive design are user expectations for modern web applications.

### VII. Code Quality & Formatting

Code MUST be formatted consistently before finalizing changes. This principle is NON-NEGOTIABLE.

**PHP Formatting**:
- Run `vendor/bin/pint --dirty` before finalizing changes
- Follow Laravel Pint rules (configured for this project)
- Use PHPDoc blocks for complex arrays (array shape type definitions)

**JavaScript/TypeScript Formatting**:
- Run `npm run lint` before finalizing changes (ESLint + Prettier)
- Run `npm run types` to verify TypeScript compilation
- Follow existing code style in sibling files

**Code Style Requirements**:
- Descriptive variable and method names (e.g., `isRegisteredForDiscounts`, not `discount()`)
- No inline validation in controllers (use Form Request classes)
- Prefer Eloquent relationships over raw queries to prevent N+1 problems
- Use queued jobs for time-consuming operations (`ShouldQueue` interface)

**Rationale**: Consistent formatting eliminates style debates, improves readability, and prevents merge conflicts. Type checking catches errors before runtime.

### VIII. Security & Authentication

Security MUST be prioritized in all features. The application uses Laravel Fortify for authentication.

**Security Requirements**:
- Never introduce OWASP Top 10 vulnerabilities (XSS, SQL injection, command injection, etc.)
- Use Laravel's built-in authentication and authorization (gates, policies, Fortify)
- Use Form Request validation classes (never trust user input)
- Use CSRF protection for all forms (automatic with Inertia `<Form>`)
- Use named routes and `route()` function for URL generation

**Fortify Features Enabled**:
- User registration with email verification
- Password reset via email
- Profile information updates
- Password updates
- Two-factor authentication (2FA) with QR codes and recovery codes

**Authentication Flow**:
- Custom Inertia views defined in `FortifyServiceProvider`
- Actions in `app/Actions/Fortify/` for business logic
- Configuration in `config/fortify.php`

**Rationale**: Security breaches damage user trust and can have legal consequences. Laravel Fortify provides battle-tested authentication that's been vetted by the community.

## Technology Standards

**Required Technology Stack**:
- **Backend**: Laravel 12, PHP 8.4, Inertia.js v2, Laravel Fortify, Laravel Wayfinder
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Radix UI components
- **Build Tools**: Vite, Laravel Vite Plugin, Wayfinder Vite Plugin
- **Testing**: PHPUnit 11
- **Code Quality**: Laravel Pint (PHP), ESLint & Prettier (JS/TS)

**Tailwind CSS v4 Specifics**:
- Use CSS-first configuration with `@theme` directive (not `tailwind.config.js`)
- Import with `@import "tailwindcss"` (not `@tailwind` directives)
- Use gap utilities for spacing (not margins)
- Support dark mode with `dark:` variants
- Use v4 utilities only (no deprecated utilities like `bg-opacity-*`, `flex-shrink-*`, etc.)

**Database**:
- SQLite for development (`:memory:` for testing)
- Migrations in `database/migrations/`
- Factories in `database/factories/`
- Seeders in `database/seeders/`

**Technology changes require explicit approval**. Stick to the existing stack.

## Development Workflow

**Initial Setup**:
```bash
composer run setup  # Complete project setup
```

**Development Commands**:
```bash
composer run dev       # Start all dev services
composer run dev:ssr   # Start dev with SSR
npm run build          # Build for production
```

**Before Finalizing Changes**:
1. Format PHP: `vendor/bin/pint --dirty`
2. Format JS/TS: `npm run lint`
3. Run tests: `php artisan test --filter=testName`
4. Check types: `npm run types`

**Creating New Files**:
- Use `php artisan make:` commands for all Laravel files
- Pass `--no-interaction` to Artisan commands
- Check sibling files for conventions before creating new files

**Documentation Requirements**:
- NEVER proactively create documentation files (*.md) or README files
- Only create documentation if explicitly requested by the user
- Reference existing documentation in `docs/` directory for guidance

## Governance

This constitution supersedes all other practices and guidelines. All development MUST comply with the principles defined above.

**Amendment Process**:
1. Proposed changes must be documented with rationale
2. Constitution version must be incremented following semantic versioning:
   - MAJOR: Backward incompatible principle removals or redefinitions
   - MINOR: New principle added or materially expanded guidance
   - PATCH: Clarifications, wording, typo fixes, non-semantic refinements
3. All dependent templates and documentation must be updated to reflect changes
4. Changes must be approved before implementation

**Compliance Review**:
- All pull requests/code reviews must verify compliance with constitution
- Complexity that violates principles must be explicitly justified with simpler alternatives rejected in writing
- Constitution Check gates in `plan-template.md` enforce pre-implementation validation

**Runtime Development Guidance**:
- `CLAUDE.md` provides detailed implementation guidance for Claude Code
- `AGENTS.md` contains Laravel Boost guidelines and tooling instructions
- Both files MUST align with constitution principles

**Principle Priority**:
NON-NEGOTIABLE principles (marked as such) cannot be violated under any circumstances. Other principles may be temporarily relaxed with documented justification and plan to return to compliance.

**Version**: 1.0.0 | **Ratified**: 2025-11-15 | **Last Amended**: 2025-11-15
