# Component Architecture: Photo Upload System

## Component Hierarchy

```
AppLayout (wrapper)
│
├── PhotoUpload Page (/photos)
│   ├── Header Card
│   │   ├── Title & Description
│   │   └── Submission Counter (X/3)
│   │
│   ├── Flash Messages
│   │   ├── Success Alert (green)
│   │   ├── Error Alert (red)
│   │   └── Warning Alert (yellow)
│   │
│   ├── PhotoUpload Component
│   │   ├── Drop Zone (or Preview)
│   │   │   ├── Drag & Drop Area
│   │   │   ├── File Input (hidden)
│   │   │   └── Icon & Instructions
│   │   │
│   │   ├── Image Preview (when selected)
│   │   │   ├── Filename & Size
│   │   │   ├── Preview Image
│   │   │   └── Remove Button
│   │   │
│   │   └── Error/Warning Alerts
│   │
│   ├── Upload Form Actions
│   │   ├── Remaining Slots Info
│   │   └── Upload Button
│   │
│   └── Recent Submissions Preview (3 items)
│
└── MySubmissions Page (/photos/submissions)
    ├── Header Card
    │   ├── Title & Description
    │   └── Remaining Slots + Upload Button
    │
    ├── Submissions Grid (responsive)
    │   └── Submission Card (foreach)
    │       ├── Card Header
    │       │   ├── Filename & FWB ID
    │       │   └── Status Badge
    │       │
    │       ├── Card Content
    │       │   ├── Metadata (size, dates)
    │       │   ├── Download Button
    │       │   └── Status Description
    │       │
    │       └── Card Footer (optional)
    │
    ├── Empty State (if no submissions)
    │   ├── Icon Placeholder
    │   ├── Message
    │   └── Upload CTA Button
    │
    └── Pagination Controls (if >20 items)
```

---

## Data Flow

### PhotoUpload Page

```
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Laravel)                        │
│                                                              │
│  PhotoSubmissionController::index()                         │
│    ├─> Calculate remainingSlots                             │
│    ├─> Fetch recent submissions (limit 3)                   │
│    └─> Render Inertia('photo-upload', [...])               │
└─────────────────────────────────────┬───────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  PhotoUpload Page (React)                    │
│                                                              │
│  Props:                                                      │
│    - remainingSlots: number                                 │
│    - submissions: { data: PhotoSubmission[] }               │
│    - flash?: { success?, error?, warning? }                 │
│                                                              │
│  State:                                                      │
│    - selectedFile: File | null                              │
│    - preview: string | null                                 │
│    - isUploading: boolean                                   │
│    - uploadError: string | null                             │
│                                                              │
│  Handlers:                                                   │
│    - handleFileSelect(file) -> setSelectedFile()            │
│    - handleClearFile() -> reset state                       │
│    - handleUpload() -> router.post('/photos/upload')        │
└─────────────────────────────────────┬───────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────┐
│              PhotoUpload Component (React)                   │
│                                                              │
│  Props:                                                      │
│    - selectedFile: File | null                              │
│    - onFileSelect: (file) => void                           │
│    - onClearFile: () => void                                │
│    - isUploading: boolean                                   │
│    - preview: string | null                                 │
│    - error: string | null                                   │
│    - warning: string | null                                 │
│                                                              │
│  Internal:                                                   │
│    - useDropzone({ accept, maxSize, onDrop })               │
│    - Client-side validation                                 │
│    - Visual feedback (drag states)                          │
└─────────────────────────────────────────────────────────────┘
```

### Upload Flow

```
User Action                 Component                Backend
─────────────────────────────────────────────────────────────

1. Select file           PhotoUpload Component
   (drag/click)          └─> validate client-side
                         └─> trigger onFileSelect()
                                   │
                                   ▼
2. Preview generated     PhotoUpload Page
                         └─> FileReader.readAsDataURL()
                         └─> setPreview(dataUrl)
                                   │
                                   ▼
3. Click "Upload"        PhotoUpload Page
                         └─> NProgress.start()
                         └─> router.post('/photos/upload', formData)
                                   │
                                   ▼
4. Server processes                          PhotoSubmissionController
                                             └─> validate server-side
                                             └─> save file
                                             └─> create DB record
                                             └─> return flash message
                                   │
                                   ▼
5. Success redirect      PhotoUpload Page
                         └─> NProgress.done()
                         └─> display flash.success
                         └─> reset form
```

---

## Component Props & Types

### PhotoUpload Component

```typescript
interface PhotoUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isUploading: boolean;
  preview: string | null;
  error: string | null;
  warning: string | null;
}
```

**Purpose**: Presentational component for file upload UI
**Responsibility**: Display drop zone, preview, and validation errors
**State**: None (all managed by parent)

---

### PhotoUpload Page

```typescript
interface PhotoUploadPageProps {
  remainingSlots: number;
  submissions: {
    data: PhotoSubmission[];
  };
  flash?: {
    success?: string;
    error?: string;
    warning?: string;
  };
}
```

**Purpose**: Page container for photo upload feature
**Responsibility**: State management, API calls, form submission
**State**:
- `selectedFile`: Currently selected file
- `preview`: Base64 preview URL
- `isUploading`: Upload in progress flag
- `uploadError`: Client-side error message

---

### MySubmissions Page

```typescript
interface MySubmissionsPageProps {
  submissions: PaginatedResponse<PhotoSubmission>;
  remainingSlots: number;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
```

**Purpose**: Page to display user's photo submissions
**Responsibility**: Display submission cards, pagination, download
**State**: None (all data from props)

---

## State Management Strategy

### Component vs Page State

**PhotoUpload Component** (Stateless):
- No internal state
- All state passed via props
- Pure presentational component
- Reusable in other contexts

**PhotoUpload Page** (Stateful):
- Manages upload lifecycle state
- Handles form submission
- Generates image preview
- Coordinates with backend

**MySubmissions Page** (Stateless):
- All data from server
- No client state needed
- Simple display logic

---

## Styling Strategy

### Tailwind Utility Classes

**Layout**:
- Container: `mx-auto max-w-4xl space-y-6 p-4`
- Grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- Flex: `flex items-center justify-between`

**Responsive**:
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Conditional columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

**Dark Mode**:
- All colors have `dark:` variants
- Semantic tokens: `bg-card`, `text-foreground`
- Border colors: `border-sidebar-border dark:border-sidebar-border`

**Interactive States**:
- Hover: `hover:bg-accent hover:shadow-lg`
- Focus: `focus-visible:ring-ring focus-visible:ring-[3px]`
- Disabled: `disabled:opacity-60 disabled:pointer-events-none`

---

## Accessibility Implementation

### ARIA Attributes

```typescript
// File input
<input {...getInputProps()} aria-label="Photo file input" />

// Remove button
<Button aria-label="Remove selected image">
  <X className="size-4" />
</Button>

// Alert regions
<Alert role="alert">
  <AlertTitle>Upload Error</AlertTitle>
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

### Keyboard Navigation

1. **Tab Order**:
   - Drop zone → Remove button → Upload button
   - All interactive elements focusable
   - Skip links where appropriate

2. **Focus Indicators**:
   - Visible focus ring on all interactive elements
   - High contrast for visibility
   - Works in light and dark mode

3. **Enter/Space**:
   - All buttons respond to Enter and Space
   - File input accessible via keyboard

### Screen Reader Support

1. **Semantic HTML**:
   - `<button>` for actions
   - `<form>` for submissions
   - `<img>` with alt text

2. **Descriptive Text**:
   - Button labels explain action
   - Error messages clear and actionable
   - Status changes announced

3. **Live Regions**:
   - Upload progress announced
   - Success/error messages announced via alerts
   - Status changes in submission list

---

## Performance Optimizations

### Image Preview

```typescript
useEffect(() => {
  if (!selectedFile) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setPreview(reader.result as string);
  };
  reader.readAsDataURL(selectedFile);
}, [selectedFile]);
```

**Why FileReader over URL.createObjectURL**:
- Works with all file types
- No memory cleanup needed for data URLs
- Compatible with server-sent images

### Upload Progress

```typescript
useEffect(() => {
  NProgress.configure({ showSpinner: false });
}, []);

// In upload handler
NProgress.start();
router.post('/photos/upload', formData, {
  onFinish: () => NProgress.done()
});
```

**Benefits**:
- Visual feedback without blocking UI
- Lightweight (2KB gzipped)
- Accessible (CSS-based, no JS animations)

### React Optimizations

```typescript
const handleFileSelect = useCallback((file: File) => {
  setSelectedFile(file);
  setUploadError(null);
}, []);

const handleClearFile = useCallback(() => {
  setSelectedFile(null);
  setPreview(null);
  setUploadError(null);
}, []);
```

**Why useCallback**:
- Prevents unnecessary re-renders of PhotoUpload component
- Stable function references
- React Compiler will optimize further

---

## Error Handling Strategy

### Client-Side Errors

```typescript
// File validation (react-dropzone)
onDrop: (acceptedFiles, fileRejections) => {
  if (fileRejections.length > 0) {
    const errorCode = fileRejections[0].errors[0]?.code;

    if (errorCode === 'file-too-large') {
      setRejectionError("Photo must not exceed 15MB...");
    } else if (errorCode === 'file-invalid-type') {
      setRejectionError("Only JPG, PNG, and HEIC images...");
    }
  }
}

// Empty file check
if (!selectedFile) {
  setUploadError("Please select a photo to upload.");
  return;
}
```

### Server-Side Errors

```typescript
router.post('/photos/upload', formData, {
  onError: (errors) => {
    const errorMessage = errors.photo ||
                        errors.general ||
                        "Upload failed. Please try again.";
    setUploadError(errorMessage);
  }
});
```

### Network Errors

```typescript
// Navigation warning during upload
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isUploading) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isUploading]);
```

---

## Testing Strategy

### Unit Testing (Recommended)

```typescript
// PhotoUpload.test.tsx
describe('PhotoUpload Component', () => {
  it('displays drop zone when no file selected', () => {
    // Test initial state
  });

  it('shows error for oversized file', () => {
    // Test validation
  });

  it('displays preview when file selected', () => {
    // Test preview generation
  });

  it('calls onClearFile when remove button clicked', () => {
    // Test callbacks
  });
});
```

### Integration Testing

```typescript
// PhotoUploadPage.test.tsx
describe('PhotoUpload Page', () => {
  it('uploads file successfully', async () => {
    // Test full upload flow
  });

  it('prevents upload when limit reached', () => {
    // Test 3-photo limit
  });

  it('displays flash messages', () => {
    // Test message display
  });
});
```

### E2E Testing (Recommended)

```typescript
// cypress/e2e/photo-upload.cy.ts
describe('Photo Upload Flow', () => {
  it('complete upload workflow', () => {
    cy.visit('/photos');
    cy.get('[data-testid="drop-zone"]').attachFile('test-photo.jpg');
    cy.get('[data-testid="upload-button"]').click();
    cy.contains('Photo uploaded successfully');
  });
});
```

---

## Browser Compatibility

### Supported Browsers

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | HEIC preview supported |
| Edge | 90+ | Full support |
| Mobile Safari | iOS 14+ | Touch optimized |
| Chrome Mobile | Android 10+ | Touch optimized |

### Polyfills Required

None. All APIs used are widely supported:
- FileReader API (IE10+)
- FormData (IE10+)
- Drag and Drop API (IE11+)
- CSS Grid (IE11+ with -ms prefix)

### Progressive Enhancement

1. **No JavaScript**: Form still submits (basic file input)
2. **No Drag-and-Drop**: Click to browse works
3. **Older Browsers**: Graceful degradation to basic form

---

## Deployment Checklist

Before deploying to production:

- [ ] Install npm dependencies: `npm install react-dropzone nprogress @types/nprogress`
- [ ] Run build: `npm run build`
- [ ] Verify TypeScript types: `npm run types`
- [ ] Run linter: `npm run lint`
- [ ] Test in all supported browsers
- [ ] Verify mobile responsiveness
- [ ] Test dark mode
- [ ] Run accessibility audit (Lighthouse)
- [ ] Test upload with 15MB file
- [ ] Test upload with invalid file types
- [ ] Verify 3-photo limit enforcement
- [ ] Test pagination (if >20 submissions)
- [ ] Verify download functionality
- [ ] Test error scenarios (network failure, server error)
- [ ] Check console for errors/warnings
- [ ] Verify CSRF token included in requests

---

## Maintenance Guide

### Adding New File Types

1. Update `ACCEPTED_TYPES` in PhotoUpload component:
```typescript
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/heic": [".heic"],
  "image/webp": [".webp"], // Add new type
};
```

2. Update validation message to include new type

3. Update backend validation rules

### Changing File Size Limit

1. Update `MAX_FILE_SIZE` constant:
```typescript
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
```

2. Update error message text

3. Update backend validation rules

4. Update documentation ("Maximum 15MB" → "Maximum 20MB")

### Adding New Status Types

1. Update TypeScript type:
```typescript
status: "new" | "approved" | "declined" | "pending_review"
```

2. Add color mapping in `getStatusColor()`:
```typescript
case "pending_review":
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/30...";
```

3. Add status description in MySubmissions page

4. Update backend enum

---

## Future Considerations

### Potential Improvements

1. **Optimistic UI Updates**:
   - Show submission in list immediately
   - Update when server confirms

2. **Drag Reordering**:
   - Allow users to reorder submissions
   - Update priority server-side

3. **Inline Editing**:
   - Edit filename/metadata
   - Auto-save changes

4. **Bulk Actions**:
   - Select multiple submissions
   - Download all as ZIP

5. **Advanced Preview**:
   - Zoom/pan image
   - Show EXIF data
   - Compare before/after EXIF correction

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Maintained By**: Frontend Team
