# Context for Issue #9

## Issue Summary  
- **Title**: Improve start page with dynamic header and photo gallery
- **Type**: Feature (Enhancement)
- **Priority**: P1 (High)
- **Status**: Open
- **Assignee**: kaihempel
- **Created**: 2025-11-16T11:42:21Z
- **Labels**: enhancement, needs-qa

## Requirements Analysis

### Core Objective
Transform the current default Laravel start page ("/") into a modern, functional landing page with:
1. Dynamic header with scroll-responsive behavior
2. Burger menu navigation system
3. Integrated photo gallery display
4. Smooth transitions and responsive design across all devices

### Acceptance Criteria  

**Header Functionality:**
- Initial header displays at 20vh height on page load
- Logo placeholder visible on left side
- Burger menu icon visible on right side
- Burger menu opens/closes on click
- Menu contains 4 navigation items: Gallery, Upload, Login, Impressum
- Menu items navigate to correct routes

**Gallery Integration:**
- Photo gallery displayed below header
- Gallery loads photos from existing PublicGalleryController
- Proper spacing and layout maintained

**Scroll Behavior:**
- Header smoothly transitions to 80px sticky bar on scroll
- Transition threshold: ~50-100px scroll position
- Sticky header remains pinned at top during scrolling
- Logo scales appropriately in sticky state
- All transitions are smooth (300-400ms recommended)

**Responsive & Accessibility:**
- Works on mobile (320px+) and desktop (1024px+)
- Uses Radix UI components where applicable
- Dark mode support functional
- Keyboard navigation works for menu
- Proper ARIA labels for accessibility

### Technical Constraints

**Technology Stack:**
- Laravel 12 + React 19 with Inertia.js v2
- TypeScript with strict typing
- Tailwind CSS v4 (CSS-first with @theme directive)
- Radix UI components (use Sheet for mobile menu)
- Laravel Wayfinder for type-safe routing

**Performance Requirements:**
- Use CSS transforms for scroll animations (not position/height changes)
- Implement scroll throttling to prevent excessive re-renders
- Lazy load gallery images
- Consider IntersectionObserver for efficient scroll detection

**Files Affected:**
- Primary: `resources/js/Pages/welcome.tsx` (complete rewrite)
- Controller: `app/Http/Controllers/PublicGalleryController.php` (may need data adjustments)
- Routes: `routes/web.php` (already configured, no changes needed)

**Recommended New Components:**
- `resources/js/components/public-header.tsx` (header with scroll logic)
- `resources/js/components/burger-menu.tsx` (navigation menu)

## Implementation Strategy

### Complexity Assessment
- **Effort**: M (Medium - 4-8 hours)
- **Risk Level**: Low
  - Existing gallery controller and routes in place
  - Well-defined requirements
  - Standard React patterns for scroll behavior
  - Main risk: ensuring smooth performance on low-end devices
- **Dependencies**: None (all required packages already installed)

### Agent Assignments
Based on issue type (Feature/Enhancement) and priority (P1):
- **Primary Agent**: Frontend Development Agent
  - Responsible for React component creation
  - TypeScript implementation
  - Tailwind CSS styling
  - Responsive design implementation
- **Supporting Agents**: 
  - Backend Agent (verify controller data flow)
  - Testing Agent (cross-browser and device testing)
- **Review Agent**: Code Review Agent (always assigned)

### Context Distribution
- **Planning Context** (500 tokens): 
  - Core objective: Dynamic header + gallery integration
  - Priority: P1 (High)
  - Effort: Medium (4-8 hours)
  
- **Implementation Context** (600 tokens):
  - Header: 20vh initial → 80px sticky on scroll
  - Menu: 4 items (Gallery, Upload, Login, Impressum)
  - Use React hooks (useState, useEffect) for scroll detection
  - Use Radix Sheet component for mobile menu
  - Tailwind CSS v4 for responsive breakpoints
  - CSS transforms for performance
  
- **Review Context** (400 tokens):
  - Smooth transitions (300-400ms)
  - Responsive: 320px mobile to 1024px+ desktop
  - Dark mode support
  - Keyboard navigation + ARIA labels
  - Cross-browser compatibility (Chrome, Firefox, Safari)
  - Performance on mobile devices

## Progress Tracking

### Milestones
- **Created**: 2025-11-16T11:42:21Z
- **Planning Complete**: [ ]
- **Implementation Started**: [ ]  
- **Testing Complete**: [ ]
- **Review Complete**: [ ]
- **Closed**: [ ]

### Implementation Checklist

**Phase 1: Component Structure**
- [ ] Create public-header component with scroll detection
- [ ] Create burger-menu component with Radix Sheet
- [ ] Update welcome.tsx to use new components
- [ ] Implement scroll event listener with throttling

**Phase 2: Styling & Behavior**
- [ ] Implement 20vh initial header height
- [ ] Implement 80px sticky header on scroll
- [ ] Add smooth CSS transitions
- [ ] Style logo and burger menu icon
- [ ] Implement menu open/close functionality

**Phase 3: Gallery Integration**
- [ ] Ensure PublicGalleryController passes necessary data
- [ ] Render gallery below header
- [ ] Implement responsive grid layout
- [ ] Add loading states if needed

**Phase 4: Responsive & Accessibility**
- [ ] Test on mobile (320px, 375px, 414px widths)
- [ ] Test on tablet (768px, 1024px widths)
- [ ] Test on desktop (1280px, 1920px widths)
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels
- [ ] Test dark mode

**Phase 5: Testing & QA**
- [ ] Desktop browsers: Chrome, Firefox, Safari
- [ ] Mobile browsers: iOS Safari, Chrome Mobile
- [ ] Performance testing on low-end devices
- [ ] Accessibility audit
- [ ] Cross-browser compatibility check

## Technical Notes

### Scroll Detection Pattern (React)
```typescript
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 100);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### Recommended Tailwind Classes
- Initial header: `h-[20vh] transition-all duration-300`
- Sticky header: `fixed top-0 h-20 transition-all duration-300`
- Logo: `transition-transform duration-300`

### Radix UI Components to Use
- Sheet: For mobile menu overlay
- Navigation Menu: Optional for structured navigation
- Button: For burger menu icon

### Performance Optimization
- Use `transform: translateY()` instead of changing `top` property
- Use `will-change: transform` sparingly
- Implement `requestAnimationFrame` for scroll callbacks if needed
- Debounce/throttle scroll events (recommend 16ms for 60fps)

## Agent Communication Log
<!-- Updates from assigned agents will be appended here -->

**2025-11-16T11:42:21Z - Planning Agent**: Issue created and context file initialized. Ready for assignment to frontend development agent.
