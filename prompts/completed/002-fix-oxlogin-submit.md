<objective>
Refactor the login.tsx page to properly submit login credentials via the OxLogin component to Laravel's authentication endpoint.

Currently the `onSubmit` handler is empty. This needs to integrate with Inertia.js and Laravel Fortify for authentication.
</objective>

<context>
This is a Laravel 12 + React 19 application using:
- Inertia.js v2 for SPA navigation
- Laravel Fortify for authentication
- Laravel Wayfinder for type-safe routes
- @noxickon/onyx components

The login page already uses OxLogin but has an empty onSubmit handler that needs to send credentials to the backend.

Read CLAUDE.md for project conventions.
Examine:
- resources/js/pages/auth/login.tsx (current implementation)
- resources/js/routes/login.ts (Wayfinder login routes)
</context>

<requirements>
1. **Implement proper form submission**:
   - Use Inertia's router to POST to the login endpoint
   - Extract email and password from OxLogin's onSubmit response
   - Handle the form submission correctly per Inertia patterns

2. **Integrate with Wayfinder routes**:
   - Use the imported `store` from `@/routes/login` for the login POST endpoint
   - Follow the Wayfinder usage patterns from CLAUDE.md

3. **Handle authentication state**:
   - The OxLogin component provides the form data via its onSubmit callback
   - Pass this data to Inertia for server-side authentication

4. **Maintain existing features**:
   - Keep canResetPassword and canRegister links working
   - Preserve status message display
</requirements>

<implementation>
Use Inertia's router for form submission:

```typescript
import { router } from '@inertiajs/react';

// In onSubmit handler:
onSubmit={(data) => {
  router.post(store.url(), {
    email: data.email,
    password: data.password,
    remember: data.remember, // if OxLogin supports this
  });
}}
```

Research the OxLogin component's onSubmit callback signature to understand what data it provides.

Constraints:
- Must use Inertia router (not fetch/axios) for proper SPA behavior
- Must use Wayfinder routes for type safety
- Keep TypeScript strict typing
</implementation>

<output>
Update the file:
- `./resources/js/pages/auth/login.tsx` - Implement the onSubmit handler
</output>

<verification>
Before declaring complete:

1. Run TypeScript check: `npm run types`
2. Run linter: `npm run lint`
3. Build the project: `npm run build`
4. Test login in browser - form should submit and redirect on success

All checks must pass.
</verification>

<success_criteria>
- OxLogin onSubmit properly sends credentials to Laravel
- Uses Inertia router for form submission
- Uses Wayfinder store route
- TypeScript compiles without errors
- Build succeeds
</success_criteria>
