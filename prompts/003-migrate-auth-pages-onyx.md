<objective>
Migrate all authentication pages in resources/js/pages/auth/ to use Onyx simple components (OxButton, OxCard, OxAlert, OxInput, etc.) instead of Radix UI or custom UI components.

This ensures UI consistency across the authentication flow while maintaining Inertia.js form handling.
</objective>

<context>
This is a Laravel 12 + React 19 application using:
- Inertia.js v2 for SPA navigation
- Laravel Fortify for authentication
- @noxickon/onyx components

Files to migrate:
- resources/js/pages/auth/confirm-password.tsx
- resources/js/pages/auth/forgot-password.tsx
- resources/js/pages/auth/register.tsx
- resources/js/pages/auth/reset-password.tsx
- resources/js/pages/auth/two-factor-challenge.tsx
- resources/js/pages/auth/verify-email.tsx

**DO NOT modify login.tsx** - it already uses OxLogin which requires GraphQL.

Read CLAUDE.md for project conventions.
Reference existing Onyx usage in:
- resources/js/pages/auth/login.tsx (for OxCard patterns)
- resources/js/components/ (for other Onyx component patterns)
</context>

<requirements>
1. **Replace UI components with Onyx equivalents**:
   - Button → OxButton
   - Card → OxCard (with OxCard.Header, OxCard.Body, OxCard.Footer)
   - Alert → OxAlert
   - Input/Label → OxInput, OxLabel (if available) or keep existing
   - Spinner → OxSpinner

2. **Preserve Inertia form handling**:
   - Keep existing `useForm` or `<Form>` usage
   - Maintain all form fields and validation
   - Preserve error display patterns

3. **Maintain functionality**:
   - All forms must submit correctly
   - Links and navigation must work
   - Error messages must display properly
   - Loading states must be preserved

4. **Apply consistent patterns**:
   - Use OxButton variant mappings: default→primary, destructive→danger, outline→secondary
   - Use OxCard compound components for card layouts
   - Use OxAlert with type prop for status messages
</requirements>

<implementation>
Follow these Onyx patterns:

```typescript
import { OxButton, OxCard, OxAlert, OxSpinner } from '@noxickon/onyx';

// Card with sections
<OxCard>
  <OxCard.Header>
    <h2>Title</h2>
  </OxCard.Header>
  <OxCard.Body>
    {/* Form content */}
  </OxCard.Body>
  <OxCard.Footer>
    <OxButton type="submit">Submit</OxButton>
  </OxCard.Footer>
</OxCard>

// Alert for status messages
<OxAlert type="success">
  <OxAlert.Icon path={mdiCheckCircle} />
  Message here
</OxAlert>

// Button variants
<OxButton variant="primary">Primary</OxButton>
<OxButton variant="secondary">Secondary</OxButton>
<OxButton variant="danger">Danger</OxButton>
```

Constraints:
- Keep existing form field components (Input, Label, Checkbox) if no direct Onyx equivalent
- Preserve all TypeScript types
- Maintain dark mode compatibility
</implementation>

<output>
Update these files:
- `./resources/js/pages/auth/confirm-password.tsx`
- `./resources/js/pages/auth/forgot-password.tsx`
- `./resources/js/pages/auth/register.tsx`
- `./resources/js/pages/auth/reset-password.tsx`
- `./resources/js/pages/auth/two-factor-challenge.tsx`
- `./resources/js/pages/auth/verify-email.tsx`
</output>

<verification>
Before declaring complete:

1. Run TypeScript check: `npm run types`
2. Run linter: `npm run lint`
3. Build the project: `npm run build`

All checks must pass without errors.
</verification>

<success_criteria>
- All 6 auth pages use Onyx components where applicable
- Forms still submit correctly via Inertia
- TypeScript compilation passes
- ESLint passes
- Build succeeds
- No visual regressions in card/button/alert rendering
</success_criteria>
