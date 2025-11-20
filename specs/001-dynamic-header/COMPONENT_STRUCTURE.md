# Component Structure: Dynamic Header with Photo Gallery

## Component Hierarchy

```
landing.tsx (Page)
│
├── PublicHeader (Component)
│   ├── <header> (Fixed, dynamic height)
│   │   ├── Logo (Link to /)
│   │   └── Menu Button (Burger icon)
│   │
│   ├── Spacer <div> (Prevents content hiding)
│   │
│   └── Sheet (Radix UI - Mobile Menu)
│       └── Navigation Links
│           ├── Gallery → /
│           ├── Upload → /photos
│           ├── Login → /login
│           └── Impressum → /impressum
│
├── <main>
│   ├── Page Title & Description
│   └── LandingPhotoGrid (Component)
│       ├── Empty State (if no photos)
│       └── Photo Grid (if photos exist)
│           └── Photo Cards (Link to /gallery/{id})
│               ├── Image (lazy loaded)
│               ├── Hover Overlay
│               └── Rating Badge (if rated)
│
└── <footer>
    └── Copyright Notice
```

## Data Flow

```
Backend (PublicGalleryController)
    │
    └── Returns: Inertia::render('landing', ['photos' => $photos])
         │
         ├── photos: GalleryPhoto[]
         │    ├── id: number
         │    ├── thumbnail_url: string
         │    ├── full_image_url: string
         │    ├── rate: number | null
         │    └── created_at: string
         │
         └── landing.tsx (Page Component)
              │
              ├── Props: { photos }
              │
              ├── PublicHeader
              │   └── Uses: useScrollPosition({ threshold: 100 })
              │        └── Returns: isScrolled (boolean)
              │             └── Triggers: Header height transition
              │
              └── LandingPhotoGrid
                   └── Props: { photos }
                        └── Renders: Photo cards
                             └── onClick: Navigate to /gallery/{id}
```

## Scroll Animation Flow

```
User scrolls page
    │
    └── window.addEventListener('scroll')
         │
         └── requestAnimationFrame
              │
              ├── Check: scrollY > threshold (100px)
              │
              └── Update state: isScrolled = true
                   │
                   └── Re-render PublicHeader
                        │
                        ├── Header height: 20vh → 80px
                        ├── Logo width: w-16/w-24 → w-12/w-16
                        └── Transition: duration-[350ms]
```

## Responsive Breakpoints

```
Screen Width          Photo Grid Layout    Header Logo Size
────────────────────  ───────────────────  ─────────────────
< 768px (Mobile)      1 column             12px (scrolled)
                                           16px (expanded)

768px - 1024px        3 columns            12px (scrolled)
(Tablet)                                   16px (expanded)

≥ 1024px (Desktop)    4 columns            16px (scrolled)
                                           24px (expanded)
```

## State Management

```
PublicHeader Component State
    │
    ├── menuOpen: boolean
    │   ├── Default: false
    │   ├── Set by: onClick (menu button)
    │   ├── Reset by: onClick (menu item), onOpenChange, Escape key
    │   └── Controls: Sheet open/close state
    │
    └── isScrolled: boolean (from useScrollPosition hook)
        ├── Default: false (scroll < 100px)
        ├── Updated: true (scroll > 100px)
        └── Triggers: CSS class changes for header and logo
```

## CSS Transitions

```css
/* Header Height Transition */
transition-all duration-[350ms] ease-in-out

From: h-[20vh]   (20% viewport height)
To:   h-20       (80px fixed)

/* Logo Size Transition */
transition-all duration-[350ms] ease-in-out

Mobile:
  From: w-16 (64px)
  To:   w-12 (48px)

Desktop:
  From: w-24 (96px)
  To:   w-16 (64px)

/* Smooth scroll-triggered animation */
GPU-accelerated properties:
- height
- width
- transform
- opacity
```

## Event Handlers

```typescript
PublicHeader
│
├── onClick (Menu Button)
│   └── setMenuOpen(true)
│
├── onOpenChange (Sheet)
│   └── setMenuOpen(newValue)
│
├── onClick (Menu Item)
│   └── setMenuOpen(false) → Navigate via Inertia Link
│
└── onKeyDown (Sheet Content)
    └── if (event.key === 'Escape') → setMenuOpen(false)
```

## Performance Optimizations

```
Scroll Event Handling
    │
    └── useScrollPosition hook
         │
         ├── requestAnimationFrame (throttling)
         │    └── Limits to ~60fps
         │
         └── Passive event listener
              └── { passive: true }
                   └── Improves scroll performance

Image Loading Strategy
    │
    ├── First 12 images: loading="eager"
    │    └── Above the fold content
    │
    └── Remaining images: loading="lazy"
         └── Below the fold content
              └── Loaded when approaching viewport
```

## Accessibility Tree

```
<header role="banner" aria-label="Site header">
    │
    ├── <Link aria-label="Home">
    │    └── <img alt="Logo">
    │
    └── <Button aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                aria-controls="navigation-menu">
         └── <Menu> icon

<Sheet>
    │
    └── <SheetContent>
         │
         ├── <SheetTitle> "Navigation"
         │
         └── <nav id="navigation-menu"
                  aria-label="Main navigation">
              │
              └── Links (focusable, keyboard navigable)

<main role="main">
    │
    └── <div role="list" aria-label="Photo gallery">
         │
         └── <Link role="listitem">
              └── <img alt="Contest photo {id}">
```

## Dark Mode Classes

```css
Light Mode (default)
    bg-white/80
    text-gray-900
    border-gray-200

Dark Mode (dark: prefix)
    dark:bg-gray-900/80
    dark:text-gray-100
    dark:border-gray-800

Applied to:
    - Header background
    - Main background
    - Text colors
    - Borders
    - Cards
    - Empty state
    - Footer
```

## Integration Points

```
Frontend Components
    │
    ├── Wayfinder Routes (Type-safe)
    │   ├── import { login } from "@/routes"
    │   └── login.url() → "/login"
    │
    ├── Radix UI Components
    │   ├── Sheet (from @/components/ui/sheet)
    │   └── Button (from @/components/ui/button)
    │
    ├── Inertia.js
    │   ├── <Link> component
    │   ├── <Head> component
    │   └── router (for navigation)
    │
    └── TypeScript Types
        └── GalleryPhoto (from @/types/index.d)
```

## Error Handling

```
Photo Grid
    │
    ├── if (photos.length === 0)
    │    └── Render: Empty State
    │         ├── Icon (camera/image)
    │         ├── Title: "No photos available yet"
    │         └── Message: "Check back soon!"
    │
    └── if (photos.length > 0)
         └── Render: Photo Grid
              └── for each photo
                   ├── if (image fails to load)
                   │    └── Browser default broken image
                   │
                   └── if (photo.rate !== null)
                        └── Show rating badge
```

## Navigation Flow

```
User Journey
    │
    ├── Lands on / (root)
    │    └── Sees: landing.tsx
    │         ├── PublicHeader
    │         └── Photo Gallery Grid
    │              └── Clicks photo
    │                   └── Navigate to /gallery/{id}
    │                        └── gallery.tsx (voting page)
    │                             └── Vote on photo
    │                                  └── Navigate to next photo
    │
    ├── Clicks "Upload" (menu)
    │    └── Navigate to /photos
    │         └── photo-upload.tsx
    │
    ├── Clicks "Login" (menu)
    │    └── Navigate to /login
    │         └── auth/login.tsx
    │
    └── Clicks "Impressum" (menu)
         └── Navigate to /impressum
              └── impressum.tsx (to be created)
```
