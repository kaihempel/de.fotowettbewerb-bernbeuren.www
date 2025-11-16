# Context for Issue #10

## Issue Summary  
- **Title**: Enhance Dashboard: Add Photo Statistics Widgets and Photo Table
- **Type**: Enhancement
- **Priority**: P1 (High)
- **Status**: Open
- **Assignee**: Repository owner
- **Created**: 2025-11-16
- **URL**: https://github.com/kaihempel/de.fotowettbewerb-bernbeuren.www/issues/10

## Requirements Analysis

### Core Objective
Transform the currently blank dashboard page (`/dashboard`) into a functional admin interface featuring:
1. Three statistical widgets in a responsive row layout
2. A comprehensive photo management table with sorting and pagination
3. Visual trend analytics for uploads and ratings over 7-day periods

### Acceptance Criteria  

**Critical Requirements (Must Have):**
- [ ] Dashboard renders content instead of blank black page
- [ ] Widget 1: Photo statistics (total, accepted, declined counts)
- [ ] Widget 2: Upload trend chart (7-day line/bar graph)
- [ ] Widget 3: Rating trend chart (7-day line/bar graph)
- [ ] Photo table with columns: thumbnail, title, status, upload date, votes
- [ ] Table headers display even with empty database
- [ ] Responsive layout (3-column grid on desktop, stacked on mobile)
- [ ] Dark mode compatibility
- [ ] Data loaded via Inertia props from backend

**Quality Requirements:**
- [ ] Loading skeleton states during data fetch
- [ ] Chart tooltips with exact values on hover
- [ ] Sortable table columns
- [ ] Pagination for photo table (10 items per page)
- [ ] Status badges with color coding (pending/accepted/declined)
- [ ] Empty state messaging for zero photos

**Performance Requirements:**
- [ ] Database indexes on `photos.status` and `photos.created_at`
- [ ] Eager loading for photo relationships
- [ ] Efficient aggregation queries for trends
- [ ] Lazy loading for photo thumbnails

### Technical Constraints

**Backend Constraints:**
- Must use Laravel 12 conventions (no `app/Http/Middleware/` route middleware files)
- Models must use `casts()` method instead of `$casts` property
- All methods require explicit return type hints
- Follow Laravel Pint code style
- Queries must support SQLite (development database)

**Frontend Constraints:**
- TypeScript with strict typing required
- Must use existing Radix UI components (Card, Badge, Spinner)
- Tailwind CSS v4 with `@theme` directive syntax
- React 19 functional components only
- Inertia.js v2 for data loading (no REST API calls)
- Must follow ESLint and Prettier configurations

**Technology Stack:**
- Backend: PHP 8.4, Laravel 12, Inertia.js v2
- Frontend: React 19, TypeScript, Recharts (to be installed)
- Styling: Tailwind CSS v4, Radix UI components
- Database: SQLite (dev), supports PostgreSQL/MySQL (production)

## Implementation Strategy

### Complexity Assessment
- **Effort**: L (Large - ~10 hours total)
  - Backend: 3-4 hours (models, migrations, controller, queries)
  - Frontend: 4-5 hours (components, charts, table, responsive design)
  - Testing: 2 hours (PHPUnit tests, manual testing)
- **Risk Level**: Medium
  - Chart library integration may require learning curve
  - Trend data aggregation queries need optimization
  - Responsive design testing across devices
- **Dependencies**: 
  - Photo upload functionality (may not exist yet)
  - Voting/rating system (may not exist yet - can show placeholder)
  - Recharts npm package installation

### Agent Assignments

**Based on issue type (Enhancement) and priority (High):**

- **Primary Agent**: Full-Stack Development Agent
  - Responsible for coordinating backend and frontend implementation
  - Ensures consistent data flow between Laravel and React components
  
- **Supporting Agents**:
  - **Backend Agent**: Database schema, models, migrations, controller logic
  - **Frontend Agent**: React components, charts, table, responsive design
  - **Testing Agent**: PHPUnit tests for controller, manual testing across devices
  
- **Review Agent**: Always assigned
  - Code quality review (Pint, ESLint, TypeScript)
  - Performance review (query efficiency, component rendering)
  - Accessibility and UX review

### Context Distribution

**Planning Context** (500 tokens):
- Issue objectives and acceptance criteria
- Technology stack and constraints
- Implementation order and dependencies

**Implementation Context** (600 tokens):
- Detailed technical requirements (models, migrations, queries)
- Component structure and props interfaces
- Database schema and relationships
- Code examples for queries and components

**Review Context** (400 tokens):
- Acceptance criteria checklist
- Testing requirements (PHPUnit, manual)
- Code quality standards (Pint, ESLint, TypeScript)
- Performance metrics (query execution, component render times)

### Implementation Order

**Phase 1: Backend Foundation (3-4 hours)**
1. Create Photo model with eloquent scopes
2. Create photos migration (if not exists)
3. Create Vote model and migration (if not exists)
4. Create/update DashboardController with data queries
5. Define Inertia props structure
6. Write PHPUnit tests for controller

**Phase 2: Frontend Components (4-5 hours)**
7. Install Recharts: `npm install recharts`
8. Create StatisticsCard component (Widget 1)
9. Create ChartCard component (Widgets 2 & 3)
10. Create PhotoTable component with pagination
11. Update `dashboard.tsx` to integrate all components
12. Add responsive grid layout and dark mode support

**Phase 3: Testing & Polish (2 hours)**
13. Run PHPUnit tests: `php artisan test --filter=Dashboard`
14. Manual testing: responsive design, dark mode, empty states
15. Run code quality: `vendor/bin/pint --dirty` and `npm run lint`
16. Performance testing: query execution times, chart rendering

## Database Schema Requirements

### Photos Table
```php
Schema::create('photos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->string('file_path');
    $table->enum('status', ['pending', 'accepted', 'declined'])->default('pending');
    $table->timestamps();
    
    // Performance indexes
    $table->index('status');
    $table->index('created_at');
});
```

### Votes Table (if not exists)
```php
Schema::create('votes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('photo_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->string('ip_address')->nullable(); // For anonymous voting
    $table->timestamps();
    
    // Prevent duplicate votes
    $table->unique(['photo_id', 'user_id']);
    $table->index('created_at');
});
```

## Component Structure

### Dashboard Page Props Interface
```typescript
interface DashboardProps {
  statistics: {
    total: number;
    accepted: number;
    declined: number;
  };
  uploadTrend: Array<{
    date: string;
    count: number;
  }>;
  ratingTrend: Array<{
    date: string;
    count: number;
  }>;
  photos: {
    data: Array<{
      id: number;
      title: string;
      file_path: string;
      status: 'pending' | 'accepted' | 'declined';
      created_at: string;
      votes_count: number;
      user: {
        name: string;
      };
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
```

## Progress Tracking
- **Created**: 2025-11-16
- **Planning Complete**: [x]
- **Implementation Started**: [ ]
- **Backend Complete**: [ ]
- **Frontend Complete**: [ ]
- **Testing Complete**: [ ]
- **Review Complete**: [ ]
- **Closed**: [ ]

## Agent Communication Log

### 2025-11-16 - Planning Agent
- Issue created: #10
- Context file initialized
- Agent assignments distributed
- Implementation strategy defined
- Awaiting development agent to begin Phase 1 (Backend Foundation)

### Dependencies Status
- [ ] Verify Photo model exists (check `app/Models/Photo.php`)
- [ ] Verify Vote model exists (check `app/Models/Vote.php`)
- [ ] Verify photo upload routes exist (check `routes/web.php`)
- [ ] Verify voting routes exist (may need to implement)
- [ ] Install Recharts: `npm install recharts`

### Blockers
- None identified at planning stage
- If voting system doesn't exist, Widget 3 should display placeholder message

### Notes
- This is a high-priority enhancement that transforms a blank page into core functionality
- Consider implementing photo upload and voting features in parallel if not already present
- Dashboard should gracefully handle missing data (empty states, zero counts)
- Follow Laravel 12 modern structure (no Kernel files, use bootstrap/app.php)

---

**Next Steps:**
1. Development agent should verify existing models and routes
2. Begin Phase 1: Backend Foundation
3. Update this context file with progress after each phase
