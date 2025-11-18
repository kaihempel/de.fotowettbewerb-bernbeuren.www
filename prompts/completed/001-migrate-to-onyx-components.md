<objective>
Audit all frontend components and migrate them to use @noxickon/onyx components wherever applicable.

This ensures UI consistency across the application and leverages the pre-built Onyx component library instead of custom implementations or Radix UI primitives.
</objective>

<context>
This is a Laravel 12 + React 19 application using Inertia.js. The project currently uses a mix of:
- Radix UI components (@radix-ui/*)
- Custom UI components in resources/js/components/ui/
- Onyx components (@noxickon/onyx) - partially adopted

Files already using Onyx (reference these for patterns):
- resources/js/pages/auth/login.tsx
- resources/js/components/public-header.tsx
- resources/js/pages/landing.tsx
- resources/js/components/landing-photo-grid.tsx
- resources/js/pages/gallery.tsx
- resources/js/layouts/auth/auth-simple-layout.tsx
- resources/js/layouts/app/app-header-layout.tsx
- resources/js/layouts/app/app-sidebar-layout.tsx

Read CLAUDE.md for project conventions and coding standards.
</context>

<research>
First, thoroughly explore the codebase to understand:

1. **Onyx component inventory**: Examine the existing Onyx imports to identify all available components (OxMainContent, OxButton, etc.)

2. **Current component usage**: Scan all files in resources/js/ for:
   - Radix UI imports (@radix-ui/*)
   - Custom UI components from ./components/ui/
   - Any UI patterns that could be replaced with Onyx equivalents

3. **Migration opportunities**: For each Radix/custom component, determine if an Onyx equivalent exists
</research>

<requirements>
1. **Identify all migration candidates**:
   - List every file using Radix UI or custom UI components
   - Map each to its Onyx equivalent (if one exists)

2. **Migrate components systematically**:
   - Replace Radix UI imports with Onyx equivalents
   - Update component usage to match Onyx API/props
   - Preserve existing functionality and styling
   - Maintain TypeScript type safety

3. **Prioritize by impact**:
   - Start with layouts and high-visibility components
   - Then move to forms and interactive elements
   - Finally, handle edge cases

4. **Handle cases where no Onyx equivalent exists**:
   - Document which components have no Onyx replacement
   - Keep existing implementation for those cases
</requirements>

<implementation>
Follow these patterns from existing Onyx usage:

```typescript
// Import pattern
import { OxMainContent, OxButton, OxCard } from '@noxickon/onyx';

// Usage pattern - check existing files for prop conventions
<OxMainContent>
  {/* content */}
</OxMainContent>
```

Constraints:
- Do NOT remove Radix UI packages from package.json yet (some components may not have Onyx equivalents)
- Preserve all existing functionality - this is a visual/component swap, not a feature change
- Maintain dark mode support and theme compatibility
- Keep TypeScript strict typing
</implementation>

<output>
For each migrated file:
1. Update imports to use Onyx components
2. Update component usage to match Onyx API
3. Remove unused Radix imports from that file

Create a summary document at `./docs/onyx-migration-report.md` containing:
- List of files migrated
- Components replaced (Radix → Onyx mapping)
- Components with no Onyx equivalent (kept as-is)
- Any issues encountered
</output>

<verification>
Before declaring complete:

1. Run TypeScript check: `npm run types`
2. Run linter: `npm run lint`
3. Build the project: `npm run build`
4. Verify no runtime errors in the browser

All checks must pass without errors.
</verification>

<success_criteria>
- All applicable frontend components use Onyx equivalents
- TypeScript compilation passes
- ESLint passes
- Build succeeds
- Migration report documents all changes and exceptions
</success_criteria>
