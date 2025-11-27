# Tasks: i18n/Internationalization Support

**Input**: Design documents from `/specs/001-i18n-support/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: PHPUnit tests included per constitution requirement (TDD principle).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7)
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, create i18n foundation, configure Laravel backend

- [ ] T001 Install npm dependencies: `npm install i18next react-i18next i18next-browser-languagedetector`
- [ ] T002 [P] Create i18n directory structure at `resources/js/i18n/`
- [ ] T003 [P] Create i18n configuration file at `resources/js/i18n/config.ts`
- [ ] T004 [P] Create TypeScript type declarations at `resources/js/i18n/types.d.ts`
- [ ] T005 Initialize i18n in application entry point at `resources/js/app.tsx`
- [ ] T006 [P] Add available_locales configuration to `config/app.php`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database migration, backend locale handling, Inertia integration

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create migration for users.locale column: `php artisan make:migration add_locale_to_users_table --table=users`
- [ ] T008 Run migration: `php artisan migrate`
- [ ] T009 [P] Update User model to add locale attribute in `app/Models/User.php`
- [ ] T010 [P] Create LocaleController at `app/Http/Controllers/LocaleController.php`
- [ ] T011 [P] Create UpdateLocaleRequest form request at `app/Http/Requests/UpdateLocaleRequest.php`
- [ ] T012 Update HandleInertiaRequests middleware to share locale data in `app/Http/Middleware/HandleInertiaRequests.php`
- [ ] T013 Add locale route to `routes/web.php`
- [ ] T014 [P] Create PHPUnit test for LocaleController at `tests/Feature/LocaleTest.php`
- [ ] T015 Run LocaleController tests: `php artisan test --filter=LocaleTest`

**Checkpoint**: Backend locale system ready - frontend translation work can begin

---

## Phase 3: User Story 1 - View Application in Preferred Language (Priority: P1) 🎯 MVP

**Goal**: Users see all interface text in their preferred language (German default, English available)

**Independent Test**: Visit any page, verify all visible text appears in German by default. Change APP_LOCALE to 'en', verify English displays.

### Translation Files for US1 - Common Namespace

- [ ] T016 [P] [US1] Create German common translations at `resources/js/i18n/locales/de/common.json`
- [ ] T017 [P] [US1] Create English common translations at `resources/js/i18n/locales/en/common.json`

### Implementation for US1 - Core Components

- [ ] T018 [US1] Create useLocale hook at `resources/js/hooks/use-locale.ts`
- [ ] T019 [US1] Migrate app-logo.tsx to use translations in `resources/js/components/app-logo.tsx`
- [ ] T020 [US1] Migrate app-sidebar.tsx to use translations in `resources/js/components/app-sidebar.tsx`
- [ ] T021 [US1] Migrate nav-main.tsx to use translations in `resources/js/components/nav-main.tsx`
- [ ] T022 [US1] Migrate user-menu-content.tsx to use translations in `resources/js/components/user-menu-content.tsx`
- [ ] T023 [US1] Migrate footer.tsx to use translations in `resources/js/components/footer.tsx`
- [ ] T024 [US1] Migrate public-header.tsx to use translations in `resources/js/components/public-header.tsx`
- [ ] T025 [US1] Migrate breadcrumbs.tsx to use translations in `resources/js/components/breadcrumbs.tsx`

### Implementation for US1 - Layouts

- [ ] T026 [US1] Migrate global-layout.tsx to use translations in `resources/js/layouts/global-layout.tsx`
- [ ] T027 [P] [US1] Migrate public-layout.tsx to use translations in `resources/js/layouts/public-layout.tsx`
- [ ] T028 [P] [US1] Migrate settings layout to use translations in `resources/js/layouts/settings/layout.tsx`

### Implementation for US1 - Landing Page

- [ ] T029 [US1] Migrate landing.tsx to use translations in `resources/js/pages/landing.tsx`
- [ ] T030 [P] [US1] Migrate landing-photo-grid.tsx to use translations in `resources/js/components/landing-photo-grid.tsx`

**Checkpoint**: Core application displays in German/English based on APP_LOCALE. MVP complete.

---

## Phase 4: User Story 2 - Switch Language Preference (Priority: P2)

**Goal**: Users can switch language via UI, preference persists across sessions

**Independent Test**: Click language switcher, select English, verify all content updates. Refresh page, verify preference persists.

### Implementation for US2 - Language Switcher

- [ ] T031 [US2] Create LanguageSwitcher component at `resources/js/components/language-switcher.tsx`
- [ ] T032 [US2] Integrate LanguageSwitcher into public-header.tsx in `resources/js/components/public-header.tsx`
- [ ] T033 [US2] Integrate LanguageSwitcher into user-menu-content.tsx in `resources/js/components/user-menu-content.tsx`
- [ ] T034 [US2] Implement localStorage persistence in useLocale hook at `resources/js/hooks/use-locale.ts`
- [ ] T035 [US2] Implement server sync for authenticated users in LanguageSwitcher

**Checkpoint**: Language switching works for all users, persists across sessions

---

## Phase 5: User Story 3 - Photo Submission Flow (Priority: P2)

**Goal**: Photo submission flow (upload, validation, success/error) fully localized

**Independent Test**: Navigate to photo submission page, complete upload flow, verify all labels and messages in selected language.

### Translation Files for US3

- [ ] T036 [P] [US3] Create German submissions translations at `resources/js/i18n/locales/de/submissions.json`
- [ ] T037 [P] [US3] Create English submissions translations at `resources/js/i18n/locales/en/submissions.json`
- [ ] T038 [P] [US3] Create German validation translations at `resources/js/i18n/locales/de/validation.json`
- [ ] T039 [P] [US3] Create English validation translations at `resources/js/i18n/locales/en/validation.json`

### Implementation for US3

- [ ] T040 [US3] Migrate photo-submit.tsx to use translations in `resources/js/pages/public/photo-submit.tsx`
- [ ] T041 [US3] Migrate photo-upload.tsx component to use translations in `resources/js/components/photo-upload.tsx`

**Checkpoint**: Photo submission flow fully localized

---

## Phase 6: User Story 4 - Voting with Localized Feedback (Priority: P2)

**Goal**: Gallery voting flow (instructions, vote counts, messages) fully localized

**Independent Test**: Browse gallery, cast votes, verify remaining votes message and feedback in selected language.

### Translation Files for US4

- [ ] T042 [P] [US4] Create German gallery translations at `resources/js/i18n/locales/de/gallery.json`
- [ ] T043 [P] [US4] Create English gallery translations at `resources/js/i18n/locales/en/gallery.json`

### Implementation for US4

- [ ] T044 [US4] Migrate gallery.tsx to use translations in `resources/js/pages/gallery.tsx`
- [ ] T045 [US4] Migrate voting-buttons.tsx to use translations in `resources/js/components/voting-buttons.tsx`
- [ ] T046 [US4] Migrate gallery-photo-card.tsx to use translations in `resources/js/components/gallery-photo-card.tsx`

**Checkpoint**: Voting flow fully localized with pluralization support

---

## Phase 7: User Story 5 - Authentication Flow (Priority: P3)

**Goal**: Login, registration, password reset, 2FA flows fully localized

**Independent Test**: Complete login/registration flow, verify all form labels and messages in selected language.

### Translation Files for US5

- [ ] T047 [P] [US5] Create German auth translations at `resources/js/i18n/locales/de/auth.json`
- [ ] T048 [P] [US5] Create English auth translations at `resources/js/i18n/locales/en/auth.json`

### Implementation for US5 - Auth Pages

- [ ] T049 [P] [US5] Migrate login.tsx to use translations in `resources/js/pages/auth/login.tsx`
- [ ] T050 [P] [US5] Migrate register.tsx to use translations in `resources/js/pages/auth/register.tsx`
- [ ] T051 [P] [US5] Migrate forgot-password.tsx to use translations in `resources/js/pages/auth/forgot-password.tsx`
- [ ] T052 [P] [US5] Migrate reset-password.tsx to use translations in `resources/js/pages/auth/reset-password.tsx`
- [ ] T053 [P] [US5] Migrate confirm-password.tsx to use translations in `resources/js/pages/auth/confirm-password.tsx`
- [ ] T054 [P] [US5] Migrate verify-email.tsx to use translations in `resources/js/pages/auth/verify-email.tsx`
- [ ] T055 [P] [US5] Migrate two-factor-challenge.tsx to use translations in `resources/js/pages/auth/two-factor-challenge.tsx`

### Implementation for US5 - Auth Components

- [ ] T056 [US5] Migrate two-factor-setup-modal.tsx to use translations in `resources/js/components/two-factor-setup-modal.tsx`
- [ ] T057 [US5] Migrate two-factor-recovery-codes.tsx to use translations in `resources/js/components/two-factor-recovery-codes.tsx`

**Checkpoint**: All authentication flows fully localized

---

## Phase 8: User Story 6 - Settings Pages (Priority: P3)

**Goal**: User settings pages (profile, password, appearance, 2FA) fully localized

**Independent Test**: Navigate through all settings pages, verify labels and instructions in selected language.

### Translation Files for US6

- [ ] T058 [P] [US6] Create German settings translations at `resources/js/i18n/locales/de/settings.json`
- [ ] T059 [P] [US6] Create English settings translations at `resources/js/i18n/locales/en/settings.json`

### Implementation for US6

- [ ] T060 [P] [US6] Migrate profile.tsx to use translations in `resources/js/pages/settings/profile.tsx`
- [ ] T061 [P] [US6] Migrate password.tsx to use translations in `resources/js/pages/settings/password.tsx`
- [ ] T062 [P] [US6] Migrate appearance.tsx to use translations in `resources/js/pages/settings/appearance.tsx`
- [ ] T063 [P] [US6] Migrate two-factor.tsx to use translations in `resources/js/pages/settings/two-factor.tsx`
- [ ] T064 [US6] Migrate delete-user.tsx component to use translations in `resources/js/components/delete-user.tsx`
- [ ] T065 [US6] Migrate appearance-tabs.tsx to use translations in `resources/js/components/appearance-tabs.tsx`
- [ ] T066 [US6] Migrate appearance-dropdown.tsx to use translations in `resources/js/components/appearance-dropdown.tsx`

**Checkpoint**: All settings pages fully localized

---

## Phase 9: User Story 7 - Admin Dashboard (Priority: P3)

**Goal**: Admin photo review dashboard fully localized

**Independent Test**: Login as admin, review submissions, verify all labels, filters, and actions in selected language.

### Translation Files for US7

- [ ] T067 [P] [US7] Create German dashboard translations at `resources/js/i18n/locales/de/dashboard.json`
- [ ] T068 [P] [US7] Create English dashboard translations at `resources/js/i18n/locales/en/dashboard.json`

### Implementation for US7

- [ ] T069 [US7] Migrate dashboard.tsx to use translations in `resources/js/pages/dashboard.tsx`
- [ ] T070 [US7] Migrate my-submissions.tsx to use translations in `resources/js/pages/my-submissions.tsx`
- [ ] T071 [US7] Migrate photo-status-filter.tsx to use translations in `resources/js/components/photo-status-filter.tsx`
- [ ] T072 [US7] Migrate photo-submission-list.tsx to use translations in `resources/js/components/photo-submission-list.tsx`
- [ ] T073 [US7] Migrate photo-submission-card.tsx to use translations in `resources/js/components/photo-submission-card.tsx`
- [ ] T074 [US7] Migrate photo-viewer.tsx to use translations in `resources/js/components/photo-viewer.tsx`
- [ ] T075 [US7] Migrate audit-trail-indicator.tsx to use translations in `resources/js/components/audit-trail-indicator.tsx`

**Checkpoint**: Admin dashboard fully localized

---

## Phase 10: Content Pages & Polish

**Purpose**: Static content pages and cross-cutting improvements

### Translation Files - Content

- [ ] T076 [P] Create German content translations at `resources/js/i18n/locales/de/content.json`
- [ ] T077 [P] Create English content translations at `resources/js/i18n/locales/en/content.json`

### Content Pages

- [ ] T078 [P] Migrate about-us.tsx to use translations in `resources/js/pages/about-us.tsx`
- [ ] T079 [P] Migrate imprint.tsx to use translations in `resources/js/pages/imprint.tsx`
- [ ] T080 [P] Migrate project.tsx to use translations in `resources/js/pages/project.tsx`

### Polish & Validation

- [ ] T081 Run TypeScript type checking: `npm run types`
- [ ] T082 Run ESLint and fix issues: `npm run lint`
- [ ] T083 Run PHP formatting: `vendor/bin/pint --dirty`
- [ ] T084 Run full test suite: `php artisan test`
- [ ] T085 Manual verification: Test all pages in German
- [ ] T086 Manual verification: Test all pages in English
- [ ] T087 Verify no raw translation keys visible in any page
- [ ] T088 Verify language switching < 500ms response time

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-9 (User Stories)**: All depend on Phase 2 completion
- **Phase 10 (Polish)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (P1) | Phase 2 | Phase 2 complete |
| US2 (P2) | US1 | US1 common translations exist |
| US3 (P2) | Phase 2 | Phase 2 complete (parallel with US1) |
| US4 (P2) | Phase 2 | Phase 2 complete (parallel with US1) |
| US5 (P3) | Phase 2 | Phase 2 complete (parallel with US1) |
| US6 (P3) | Phase 2 | Phase 2 complete (parallel with US1) |
| US7 (P3) | Phase 2 | Phase 2 complete (parallel with US1) |

### Parallel Opportunities

**Phase 1**: T002, T003, T004, T006 can run in parallel

**Phase 2**: T009, T010, T011, T014 can run in parallel

**User Stories**: Translation file creation (de/en) can run in parallel within each story

**Phase 10**: T076-T080 can all run in parallel

---

## Parallel Example: User Story 5 (Auth)

```bash
# Launch all translation files in parallel:
Task: "Create German auth translations at resources/js/i18n/locales/de/auth.json"
Task: "Create English auth translations at resources/js/i18n/locales/en/auth.json"

# Launch all auth pages in parallel (after translations):
Task: "Migrate login.tsx to use translations"
Task: "Migrate register.tsx to use translations"
Task: "Migrate forgot-password.tsx to use translations"
Task: "Migrate reset-password.tsx to use translations"
Task: "Migrate confirm-password.tsx to use translations"
Task: "Migrate verify-email.tsx to use translations"
Task: "Migrate two-factor-challenge.tsx to use translations"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~30 min)
2. Complete Phase 2: Foundational (~1 hour)
3. Complete Phase 3: User Story 1 (~2 hours)
4. **STOP and VALIDATE**: All core UI in German/English
5. Can deploy MVP with basic i18n working

### Incremental Delivery

1. Setup + Foundational → Backend ready
2. US1 (Core UI) → **MVP deployed**
3. US2 (Language Switcher) → Users can switch languages
4. US3-US4 (Submissions/Voting) → Core features localized
5. US5-US7 (Auth/Settings/Admin) → Complete localization
6. Polish → Production ready

### Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Setup | 6 | 30 min |
| Foundational | 9 | 1 hour |
| US1 - Core UI | 15 | 2 hours |
| US2 - Switcher | 5 | 1 hour |
| US3 - Submissions | 6 | 1 hour |
| US4 - Voting | 5 | 1 hour |
| US5 - Auth | 11 | 1.5 hours |
| US6 - Settings | 9 | 1.5 hours |
| US7 - Dashboard | 9 | 1.5 hours |
| Polish | 13 | 1 hour |
| **Total** | **88** | **~12 hours** |

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [USn] label maps task to specific user story
- Each user story independently completable and testable
- Commit after each task or logical group
- Run `npm run types` frequently to catch translation key typos
- German translations should be written first (primary language)
- English translations can be derived from existing hardcoded strings
