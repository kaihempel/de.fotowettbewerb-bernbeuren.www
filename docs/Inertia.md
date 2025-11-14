# Inertia.js

Inertia.js is a modern framework that allows developers to build single-page applications using classic server-side routing and controllers. It bridges the gap between traditional server-rendered applications and modern JavaScript frameworks by eliminating the need for building APIs. Instead of creating separate frontend and backend applications, Inertia lets you use server-side controllers to return page data, which is then rendered client-side using React, Vue, or Svelte components without full page reloads.

The framework provides a seamless development experience by maintaining the simplicity of server-side routing while delivering the dynamic user experience of single-page applications. Inertia handles navigation, form submissions, and state management through a unified router that works across all supported frontend frameworks. It includes built-in support for features like infinite scrolling, polling, prefetching, client-side validation, and shared state management, making it a complete solution for building modern web applications.

## Core Router API

### router.visit() - Navigate to a new page

Performs an Inertia navigation to a specified URL with configurable options for state preservation, method selection, and callback handling.

```javascript
import { router } from '@inertiajs/react'

// Basic GET navigation
router.visit('/users')

// POST request with data
router.visit('/users', {
  method: 'post',
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  preserveState: true,
  preserveScroll: true,
  onSuccess: (page) => {
    console.log('User created:', page.props.user)
  },
  onError: (errors) => {
    console.log('Validation errors:', errors)
  }
})

// Partial reload with only specific props
router.visit('/dashboard', {
  only: ['stats', 'notifications'],
  preserveState: true,
  onFinish: () => console.log('Navigation complete')
})
```

### router.get() / post() / put() / patch() / delete() - HTTP method helpers

Convenience methods for making requests with specific HTTP verbs, automatically setting the method and preserving state for mutations.

```javascript
import { router } from '@inertiajs/react'

// GET request with query parameters
router.get('/search', { q: 'inertia', filter: 'active' })

// POST with form data
router.post('/articles', {
  title: 'Getting Started with Inertia',
  body: 'Inertia.js makes building SPAs easy...',
  published: true
}, {
  onSuccess: () => router.visit('/articles'),
  onError: (errors) => console.log(errors)
})

// PUT for full updates
router.put(`/users/${userId}`, {
  name: 'Jane Smith',
  email: 'jane@example.com'
})

// PATCH for partial updates
router.patch(`/articles/${articleId}`, { published: true })

// DELETE with confirmation
router.delete(`/users/${userId}`, {
  onBefore: () => confirm('Are you sure?'),
  onSuccess: () => console.log('User deleted')
})
```

### router.reload() - Refresh current page data

Reloads the current page without navigating away, useful for refreshing data after background operations.

```javascript
import { router } from '@inertiajs/react'

// Full page reload
router.reload()

// Partial reload with specific props
router.reload({
  only: ['posts', 'comments'],
  onSuccess: (page) => {
    console.log('Data refreshed:', page.props)
  }
})

// Reload with preserved scroll position
router.reload({
  preserveScroll: true,
  preserveState: true
})
```

### router.on() - Listen to navigation events

Registers event listeners for various navigation lifecycle events, returning a cleanup function.

```javascript
import { router } from '@inertiajs/react'

// Listen for navigation start
const removeListener = router.on('start', (event) => {
  console.log('Navigating to:', event.detail.visit.url)
  // Return false to cancel navigation
  // return false
})

// Listen for errors
router.on('error', (event) => {
  console.log('Error occurred:', event.detail.errors)
})

// Listen for successful navigation
router.on('success', (event) => {
  console.log('Page loaded:', event.detail.page)
})

// Progress events
router.on('progress', (event) => {
  if (event.detail.progress) {
    console.log(`Upload: ${event.detail.progress.percentage}%`)
  }
})

// Navigation lifecycle: before, start, progress, error, success, invalid, exception, finish
router.on('finish', (event) => {
  console.log('Navigation finished')
})

// Cleanup when component unmounts
return () => removeListener()
```

## React Components

### Link - Navigation component

A component for creating Inertia-powered links that navigate without full page reloads, with support for prefetching and custom methods.

```jsx
import { Link } from '@inertiajs/react'

// Basic link
<Link href="/users">View Users</Link>

// POST link as button
<Link href="/logout" method="post" as="button">
  Logout
</Link>

// Link with data payload
<Link
  href="/search"
  data={{ query: 'inertia', category: 'tutorials' }}
  preserveScroll
>
  Search
</Link>

// Prefetch on hover
<Link
  href="/dashboard"
  prefetch="hover"
  cacheFor={60000}
>
  Dashboard
</Link>

// Link with callbacks
<Link
  href="/delete-account"
  method="delete"
  onBefore={() => confirm('Are you sure?')}
  onSuccess={() => alert('Account deleted')}
  onError={(errors) => console.log(errors)}
>
  Delete Account
</Link>

// Partial reload link
<Link
  href="/notifications"
  only={['notifications', 'unread_count']}
  preserveState
>
  Notifications
</Link>
```

### Head - Document head management

Manages document head elements like title, meta tags, and links for SEO and social sharing.

```jsx
import { Head } from '@inertiajs/react'

function UserProfile({ user }) {
  return (
    <>
      <Head>
        <title>{user.name} - User Profile</title>
        <meta name="description" content={user.bio} />
        <meta property="og:title" content={user.name} />
        <meta property="og:image" content={user.avatar} />
        <meta property="og:type" content="profile" />
        <link rel="canonical" href={`https://example.com/users/${user.id}`} />
      </Head>

      <div>
        <h1>{user.name}</h1>
        <p>{user.bio}</p>
      </div>
    </>
  )
}

// Multiple Head components merge (last wins for duplicates)
function Article({ article }) {
  return (
    <>
      <Head title={article.title} />
      <Head>
        <meta name="author" content={article.author} />
        <meta name="published" content={article.published_at} />
      </Head>

      <article>{article.content}</article>
    </>
  )
}
```

### InfiniteScroll - Paginated content loading

Component for implementing infinite scrolling with automatic or manual loading, supporting both forward and reverse pagination.

```jsx
import { InfiniteScroll } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'

function MessageList() {
  const { messages } = usePage().props

  return (
    <InfiniteScroll
      data={messages}
      as="ul"
      className="message-list"
    >
      {messages.data.map((message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </InfiniteScroll>
  )
}

// Manual mode with load buttons
function CustomInfiniteScroll() {
  const { posts } = usePage().props

  return (
    <InfiniteScroll
      data={posts}
      manual
      previous={({ fetch, loading, hasMore }) => (
        hasMore && (
          <button onClick={fetch} disabled={loading}>
            {loading ? 'Loading...' : 'Load Previous'}
          </button>
        )
      )}
      next={({ fetch, loading, hasMore }) => (
        hasMore && (
          <button onClick={fetch} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )
      )}
    >
      {posts.data.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </InfiniteScroll>
  )
}

// Reverse mode (chat/messaging)
function ChatMessages() {
  const { messages } = usePage().props

  return (
    <InfiniteScroll
      data={messages}
      reverse
      autoScroll
      buffer={100}
      manualAfter={3}
    >
      {({ loading }) => (
        <>
          {loading && <div>Loading messages...</div>}
          {messages.data.map((msg) => (
            <div key={msg.id}>{msg.content}</div>
          ))}
        </>
      )}
    </InfiniteScroll>
  )
}
```

### Form - Form submission component

Component wrapper that provides Inertia navigation for form submissions with automatic state management.

```jsx
import { Form } from '@inertiajs/react'

function CreateUser() {
  return (
    <Form
      action="/users"
      method="post"
      onSuccess={() => alert('User created!')}
      onError={(errors) => console.log(errors)}
    >
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Create User</button>
    </Form>
  )
}

// With file uploads
function UploadAvatar() {
  return (
    <Form
      action="/profile/avatar"
      method="post"
      encType="multipart/form-data"
    >
      <input name="avatar" type="file" accept="image/*" />
      <button type="submit">Upload</button>
    </Form>
  )
}
```

## React Hooks

### useForm() - Form state management

Hook for managing form state, validation errors, and submission with automatic state preservation and error handling.

```javascript
import { useForm } from '@inertiajs/react'

function CreateArticle() {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    body: '',
    published: false
  })

  function submit(e) {
    e.preventDefault()
    post('/articles', {
      onSuccess: () => reset(),
      onError: (errors) => console.log('Validation failed:', errors)
    })
  }

  return (
    <form onSubmit={submit}>
      <input
        value={data.title}
        onChange={e => setData('title', e.target.value)}
      />
      {errors.title && <div>{errors.title}</div>}

      <textarea
        value={data.body}
        onChange={e => setData('body', e.target.value)}
      />
      {errors.body && <div>{errors.body}</div>}

      <label>
        <input
          type="checkbox"
          checked={data.published}
          onChange={e => setData('published', e.target.checked)}
        />
        Published
      </label>

      <button type="submit" disabled={processing}>
        {processing ? 'Saving...' : 'Save Article'}
      </button>
    </form>
  )
}

// With transform and file uploads
function EditProfile() {
  const { data, setData, post, progress } = useForm({
    name: 'John Doe',
    avatar: null
  })

  // Transform data before submission
  data.transform((data) => ({
    ...data,
    name: data.name.trim()
  }))

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      post('/profile')
    }}>
      <input
        value={data.name}
        onChange={e => setData('name', e.target.value)}
      />

      <input
        type="file"
        onChange={e => setData('avatar', e.target.files[0])}
      />

      {progress && (
        <progress value={progress.percentage} max="100">
          {progress.percentage}%
        </progress>
      )}

      <button type="submit">Update Profile</button>
    </form>
  )
}

// Persistent form with remember key
function DraftPost() {
  const { data, setData, post, isDirty } = useForm('create-post', {
    title: '',
    body: ''
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); post('/posts') }}>
      <input
        value={data.title}
        onChange={e => setData('title', e.target.value)}
      />
      <textarea
        value={data.body}
        onChange={e => setData('body', e.target.value)}
      />
      <button type="submit">Publish</button>
      {isDirty && <span>Unsaved changes</span>}
    </form>
  )
}
```

### usePage() - Access page data

Hook to access the current page object containing props, URL, component name, and version information.

```javascript
import { usePage } from '@inertiajs/react'

function Navigation() {
  const { props, url, component } = usePage()

  // Access shared props from all pages
  const { auth, flash } = props

  return (
    <nav>
      {auth.user ? (
        <>
          <span>Welcome, {auth.user.name}</span>
          <Link href="/logout" method="post">Logout</Link>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}

      {flash.success && <div className="alert">{flash.success}</div>}
      {flash.error && <div className="error">{flash.error}</div>}

      <span>Current: {url}</span>
    </nav>
  )
}

// Type-safe page props
function UserDashboard() {
  const { props } = usePage<{
    user: { name: string; email: string }
    stats: { posts: number; followers: number }
  }>()

  return (
    <div>
      <h1>{props.user.name}</h1>
      <p>{props.stats.posts} posts</p>
      <p>{props.stats.followers} followers</p>
    </div>
  )
}
```

### usePoll() - Automatic page refreshing

Hook for polling the current page at regular intervals to keep data fresh.

```javascript
import { usePoll } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'

function LiveDashboard() {
  const { stats } = usePage().props

  // Poll every 5 seconds
  usePoll(5000)

  return (
    <div>
      <h2>Live Statistics</h2>
      <p>Active users: {stats.active_users}</p>
      <p>Revenue today: ${stats.revenue}</p>
    </div>
  )
}

// Conditional polling with controls
function MonitoringPanel() {
  const { data } = usePage().props

  const { start, stop } = usePoll(
    3000,
    { only: ['data', 'alerts'] },
    { autoStart: false, keepAlive: true }
  )

  return (
    <div>
      <button onClick={start}>Start Monitoring</button>
      <button onClick={stop}>Stop Monitoring</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### usePrefetch() - Prefetch status tracking

Hook for monitoring prefetch status of the current page, useful for cache management and loading indicators.

```javascript
import { usePrefetch } from '@inertiajs/react'

function DashboardLink() {
  const { isPrefetched, isPrefetching, lastUpdatedAt, flush } = usePrefetch({
    only: ['stats']
  })

  return (
    <div>
      <Link href="/dashboard" prefetch="hover">
        Dashboard
        {isPrefetching && ' (prefetching...)'}
        {isPrefetched && ' (cached)'}
      </Link>

      {lastUpdatedAt && (
        <small>Cached at: {new Date(lastUpdatedAt).toLocaleString()}</small>
      )}

      {isPrefetched && (
        <button onClick={flush}>Clear Cache</button>
      )}
    </div>
  )
}
```

### useRemember() - Persistent state across visits

Hook for preserving component state across page navigation, useful for maintaining scroll positions, form inputs, or UI state.

```javascript
import { useRemember } from '@inertiajs/react'

function SearchFilters() {
  const [filters, setFilters] = useRemember({
    query: '',
    category: 'all',
    sort: 'recent'
  }, 'search-filters')

  return (
    <div>
      <input
        value={filters.query}
        onChange={e => setFilters({ ...filters, query: e.target.value })}
        placeholder="Search..."
      />

      <select
        value={filters.category}
        onChange={e => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="all">All Categories</option>
        <option value="tutorials">Tutorials</option>
        <option value="news">News</option>
      </select>

      <Link
        href="/search"
        data={filters}
      >
        Search
      </Link>
    </div>
  )
}

// Remember accordion state
function Accordion({ items }) {
  const [openItems, setOpenItems] = useRemember([], 'accordion-state')

  const toggle = (id) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <button onClick={() => toggle(item.id)}>
            {item.title}
          </button>
          {openItems.includes(item.id) && (
            <div>{item.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}
```

## Application Setup

### createInertiaApp() - Initialize Inertia application

Function for bootstrapping an Inertia application with proper configuration for client-side or server-side rendering.

```javascript
// Client-side setup (React + Vite)
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
  progress: {
    color: '#29d',
    showSpinner: true,
  },
  title: (title) => `${title} - My App`,
})

// Server-side rendering setup
import { createInertiaApp } from '@inertiajs/react'
import { renderToString } from 'react-dom/server'

export default function render(page) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
      return pages[`./Pages/${name}.jsx`]
    },
    setup({ App, props }) {
      return <App {...props} />
    },
  })
}

// Advanced setup with custom App component
import { createInertiaApp } from '@inertiajs/react'

createInertiaApp({
  resolve: async (name) => {
    const page = await import(`./Pages/${name}.jsx`)
    return page.default
  },
  setup({ el, App, props }) {
    const CustomApp = ({ children }) => (
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    )

    createRoot(el).render(
      <App {...props}>
        {({ Component, key, props }) => (
          <CustomApp key={key}>
            <Component {...props} />
          </CustomApp>
        )}
      </App>
    )
  },
  title: (title) => title ? `${title} - App` : 'App',
})
```

## TypeScript Configuration

### Type definitions for shared props and errors

Define global types for enhanced TypeScript support across your Inertia application.

```typescript
// types.d.ts
import '@inertiajs/core'

declare module '@inertiajs/core' {
  export interface InertiaConfig {
    errorValueType: string | string[]
    sharedPageProps: {
      auth: {
        user: {
          id: number
          name: string
          email: string
          avatar?: string
        } | null
      }
      flash: {
        success?: string
        error?: string
        warning?: string
      }
      errors: Record<string, string>
    }
  }
}

// Using typed page props in components
import { usePage } from '@inertiajs/react'
import { PageProps } from '@inertiajs/core'

interface UserPageProps extends PageProps {
  users: Array<{
    id: number
    name: string
    email: string
  }>
  pagination: {
    current_page: number
    last_page: number
  }
}

function UserIndex() {
  const { users, pagination, auth, flash } = usePage<UserPageProps>().props

  return (
    <div>
      {auth.user && <h1>Welcome, {auth.user.name}</h1>}
      {flash.success && <div>{flash.success}</div>}

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <p>Page {pagination.current_page} of {pagination.last_page}</p>
    </div>
  )
}
```

## Summary

Inertia.js serves as a powerful bridge between server-side and client-side rendering paradigms, enabling developers to build modern single-page applications without the complexity of maintaining separate API endpoints. By leveraging familiar server-side patterns like controllers and routing while delivering the responsive user experience of SPAs, Inertia reduces architectural overhead and accelerates development. The framework's core router handles all navigation, form submissions, and state management automatically, while providing fine-grained control through callbacks and options when needed. Built-in features like infinite scrolling, real-time polling, link prefetching, and persistent state make it straightforward to implement complex UI patterns.

The library provides consistent APIs across React, Vue, and Svelte adapters, with comprehensive TypeScript support for type-safe development. Common use cases include building admin panels, dashboards, content management systems, e-commerce platforms, and social networks where traditional server-side frameworks like Laravel, Rails, or Django want to provide modern frontend experiences without building separate API layers. Integration patterns typically involve installing both server-side and client-side adapters, configuring page resolution for your component structure, and using the provided components and hooks to handle navigation, forms, and data fetching declaratively within your chosen frontend framework.
