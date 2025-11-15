# 🏗️ Spotify Fanmade - Architecture Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Key Technologies](#key-technologies)
4. [Project Structure](#project-structure)
5. [Important Concepts](#important-concepts)
6. [Tricky Points & Gotchas](#tricky-points--gotchas)
7. [Data Flow](#data-flow)
8. [Authentication Flow](#authentication-flow)

---

## Overview

**Spotify Fanmade** is a full-stack Next.js application that replicates Spotify's web interface using the official Spotify Web API. It's built with TypeScript, React, and a custom design system (`spotify-design-system`).

**Key Characteristics:**
- **Full-stack Next.js 14** with App Router
- **Server-side API routes** for secure Spotify API communication
- **Client-side React hooks** for state management
- **Cookie-based authentication** (HTTP-only cookies)
- **Design system integration** for consistent UI components

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Components (Pages, Components)                │   │
│  │  - useSpotify hook                                   │   │
│  │  - Design System Components                          │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │ HTTP Requests (fetch)                 │
└──────────────────────┼───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Server (Node.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/*)                                │   │
│  │  - Auth routes (login, callback, logout, me)        │   │
│  │  - Spotify proxy routes (playlists, search, etc.)   │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                        │
│  ┌───────────────────▼──────────────────────────────────┐   │
│  │  Spotify API Client (spotify-web-api-node)           │   │
│  │  - Token management                                  │   │
│  │  - API calls                                         │   │
│  └───────────────────┬──────────────────────────────────┘   │
└──────────────────────┼───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Spotify Web API                                │
│  - OAuth 2.0 Authentication                                │
│  - REST API endpoints                                       │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

1. **Separation of Concerns**
   - **Client**: UI logic, state management, user interactions
   - **Server**: Authentication, Spotify API calls, sensitive operations

2. **API Proxy Pattern**
   - All Spotify API calls go through Next.js API routes
   - Client never directly calls Spotify API
   - Tokens stored securely in HTTP-only cookies

3. **Component-Based Architecture**
   - Reusable components in `/src/components`
   - Design system components from `spotify-design-system`
   - Page-level components in `/src/app`

---

## Key Technologies

### Core Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.33 | React framework with App Router, SSR, API routes |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.3.3 | Type safety |
| **spotify-web-api-node** | 5.0.2 | Spotify API client library |
| **spotify-design-system** | 1.0.42 | Custom design system (UI components) |

### Styling

- **Tailwind CSS** (3.4.0) - Utility-first CSS framework
- **Styled Components** (6.1.19) - CSS-in-JS (used by design system)
- **Custom CSS** - Global styles, scrollbar styling

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Fonts & Icons

- **Inter Font** - Google Fonts (Spotify-like typography)
- **FontAwesome** - Icon library (`@fortawesome/react-fontawesome`)

---

## Project Structure

```
spotify_fanmade/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes (Backend)
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   │   ├── callback/         # OAuth callback handler
│   │   │   │   ├── login/            # Initiate login
│   │   │   │   ├── logout/           # Logout handler
│   │   │   │   └── me/               # Get current user
│   │   │   ├── playlists/            # Playlist endpoints
│   │   │   └── spotify/              # Spotify API proxy routes
│   │   │       ├── my-playlists/     # User's playlists
│   │   │       ├── my-artists/       # Followed artists
│   │   │       ├── my-albums/        # Saved albums
│   │   │       ├── my-shows/         # Saved podcasts/shows
│   │   │       ├── search/           # Search endpoint
│   │   │       ├── playlist/[id]/    # Playlist details
│   │   │       ├── artist/[id]/      # Artist details
│   │   │       └── show/[id]/        # Show/podcast details
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx                # Root layout
│   │   ├── playlist/[id]/           # Playlist detail page
│   │   ├── artist/[id]/              # Artist detail page
│   │   ├── show/[id]/                # Show/podcast detail page
│   │   ├── search/                    # Search results page
│   │   ├── library/                   # Library page
│   │   ├── podcasts/                  # Podcasts page
│   │   ├── data/                      # Static JSON data
│   │   └── globals.css                # Global styles
│   ├── components/                    # React components
│   │   ├── AppLayout/                 # Main app layout wrapper
│   │   ├── AuthenticatedHomePage/     # Home page (authenticated)
│   │   ├── UnauthenticatedHomePage/   # Home page (unauthenticated)
│   │   ├── LibrarySideBar/            # Sidebar (auth & unauth)
│   │   ├── TrackTable/                # Track table component
│   │   ├── PlaylistHeader/            # Playlist header component
│   │   └── ...                        # Other components
│   ├── hooks/                         # Custom React hooks
│   │   ├── useSpotify.ts              # Main Spotify hook
│   │   └── useCardModal.ts            # Modal state management
│   ├── lib/                           # Utility libraries
│   │   ├── spotify.ts                 # Spotify API helpers
│   │   ├── fontawesome.tsx            # FontAwesome setup
│   │   └── registry.tsx               # Styled Components registry
│   ├── types/                         # TypeScript type definitions
│   └── utils/                         # Utility functions
│       ├── cardHelpers.ts             # Card-related helpers
│       └── colorExtractor.ts          # Image color extraction
├── .env.local                         # Environment variables (not in git)
├── next.config.js                     # Next.js configuration
├── tailwind.config.js                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Dependencies
```

---

## Important Concepts

### 1. **Authentication Flow (OAuth 2.0)**

**Flow:**
1. User clicks "Log in" → Client calls `/api/auth/login`
2. Server generates Spotify OAuth URL → Returns to client
3. Client redirects to Spotify → User authorizes
4. Spotify redirects to `/api/auth/callback?code=...`
5. Server exchanges code for tokens → Sets HTTP-only cookies
6. Client redirects to home page → Authenticated

**Token Storage:**
- `spotify_access_token` - HTTP-only cookie (expires in ~1 hour)
- `spotify_refresh_token` - HTTP-only cookie (expires in 30 days)
- **Never exposed to client-side JavaScript**

### 2. **API Route Pattern**

All API routes follow this pattern:

```typescript
// src/app/api/spotify/[endpoint]/route.ts
export async function GET(request: NextRequest) {
  // 1. Get access token from cookies
  const accessToken = request.cookies.get('spotify_access_token')?.value;
  
  // 2. Validate authentication
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 3. Create authenticated Spotify API instance
  const spotifyApi = createSpotifyApi(accessToken);
  
  // 4. Call Spotify API
  const data = await spotifyApi.someMethod();
  
  // 5. Return response
  return NextResponse.json(data.body);
}
```

### 3. **Client-Server Communication**

**Pattern:**
- Client uses `useSpotify` hook → Calls `fetch('/api/...')`
- Server handles request → Calls Spotify API
- Server returns JSON → Client updates state

**Example:**
```typescript
// Client (useSpotify.ts)
const getPlaylists = async () => {
  const response = await fetch('/api/playlists');
  return await response.json();
};

// Server (api/playlists/route.ts)
export async function GET() {
  const spotifyApi = createSpotifyApi(accessToken);
  const playlists = await spotifyApi.getUserPlaylists();
  return NextResponse.json(playlists.body);
}
```

### 4. **Design System Integration**

The project uses a custom design system (`spotify-design-system`) that provides:
- **Components**: `Stack`, `Typography`, `Button`, `Card`, `Table`, `Sidebar`, `AppHeader`, etc.
- **Theming**: `ThemeProvider` wraps the app
- **Icons**: FontAwesome icons via `Icon` component
- **Colors**: Predefined color palette

**Usage Pattern:**
```typescript
import { Stack, Typography, Button, colors } from 'spotify-design-system';

<Stack direction="column" spacing="md">
  <Typography variant="heading" size="xl" color="primary">
    Title
  </Typography>
  <Button text="Click me" onClick={handleClick} />
</Stack>
```

### 5. **Routing (Next.js App Router)**

- **File-based routing**: `src/app/[path]/page.tsx` → `/path`
- **Dynamic routes**: `src/app/playlist/[id]/page.tsx` → `/playlist/123`
- **API routes**: `src/app/api/[endpoint]/route.ts` → `/api/endpoint`

---

## Tricky Points & Gotchas

### 1. **Token Refresh Not Implemented** ⚠️

**Issue:** The `refreshAccessToken` function exists in `lib/spotify.ts` but is **never called** in API routes.

**Current Behavior:**
- Access tokens expire after ~1 hour
- When expired, API calls fail with 401
- User must log in again

**What Should Happen:**
- API routes should check if token is expired
- If expired, use refresh token to get new access token
- Update cookie and retry request

**Impact:** Users will be logged out after 1 hour of inactivity.

### 2. **Cookie Access in Next.js 14**

**Issue:** In Next.js 14 App Router, cookies are accessed differently:

```typescript
// ❌ Old way (doesn't work in App Router)
const token = request.cookies.get('spotify_access_token')?.value;

// ✅ New way (App Router)
const cookieStore = await cookies();
const token = cookieStore.get('spotify_access_token')?.value;
```

**Note:** Some routes use the old pattern, which may cause issues.

### 3. **Type Mismatches with Design System**

**Issue:** The design system's `Sidebar` component expects specific types that don't match the app's types.

**Solution:** Type mapping/adapter pattern:
```typescript
// Map our LibraryItem to Sidebar's LibraryItem
const mappedItems: SidebarLibraryItem[] = items.map((item) => ({
  id: item.id,
  title: item.title,
  type: item.type === 'show' ? 'podcast' : item.type, // Type conversion
  image: item.image || '', // Required in Sidebar, optional in our type
  // ...
}));
```

### 4. **React Hooks Rules**

**Issue:** Hooks must be called in the same order every render.

**Example Error:**
```typescript
// ❌ Wrong - conditional hook
if (condition) {
  const [state, setState] = useState(null);
}

// ✅ Correct - always call hooks
const [state, setState] = useState(null);
```

**Fixed in:** `src/app/artist/[id]/page.tsx` - moved `hoveredIndex` state to top of component.

### 5. **Null Safety in Search Results**

**Issue:** Spotify API may return `null` values in arrays.

**Solution:** Always filter and provide fallbacks:
```typescript
results.tracks
  .filter((track) => track && track.id && track.name) // Filter nulls
  .map((track) => ({
    title: track.name || 'Unknown Track', // Fallback
    // ...
  }))
```

### 6. **Image URL Handling**

**Issue:** Spotify provides multiple image sizes, need to select best one.

**Pattern Used:**
```typescript
const getBestImageUrl = (images: Array<{ url: string }> | undefined): string => {
  if (!images || images.length === 0) return '';
  // Prefer larger images (width >= 300), fallback to first
  return images.find((img) => img.width && img.width >= 300)?.url || images[0]?.url || '';
};
```

### 7. **Client vs Server Components**

**Issue:** Next.js 14 App Router uses Server Components by default.

**Pattern:**
- **Server Components** (default): Can't use hooks, can't access browser APIs
- **Client Components** (`'use client'`): Can use hooks, state, browser APIs

**Files that need `'use client'`:**
- Any component using `useState`, `useEffect`, `useRouter`
- Components with event handlers
- Components using `useSpotify` hook

### 8. **Styled Components Registry**

**Issue:** Styled Components needs a registry wrapper for Next.js App Router.

**Solution:** `src/lib/registry.tsx` wraps the app:
```typescript
<StyledComponentsRegistry>
  <AppLayout>{children}</AppLayout>
</StyledComponentsRegistry>
```

### 9. **Search Input Duplication**

**Issue:** Search input was present in both `AppHeader` and `SearchPage`.

**Solution:** Removed from `SearchPage`, only `AppHeader` handles search. `SearchPage` reads query from URL params.

### 10. **Sidebar Width & Text Truncation**

**Issue:** Design system `Sidebar` component had fixed width causing content collapse.

**Solution:**
- Increased `width` and `minWidth` to `450px`
- Added CSS overrides in `globals.css` to prevent text truncation

---

## Data Flow

### Example: Fetching User Playlists

```
1. User visits page
   ↓
2. Component calls useSpotify().getPlaylists()
   ↓
3. Hook calls fetch('/api/playlists')
   ↓
4. Next.js routes to src/app/api/playlists/route.ts
   ↓
5. Route handler:
   - Reads access_token from cookie
   - Creates Spotify API instance
   - Calls spotifyApi.getUserPlaylists()
   ↓
6. Spotify API returns data
   ↓
7. Route handler returns NextResponse.json(data)
   ↓
8. Hook receives JSON, updates state
   ↓
9. Component re-renders with playlists
```

### Example: Search Flow

```
1. User types in AppHeader search input
   ↓
2. onSearch(query) called
   ↓
3. Router.push('/search?q=query')
   ↓
4. SearchPage component mounts
   ↓
5. useEffect reads 'q' from URL params
   ↓
6. Calls fetch('/api/spotify/search?q=query')
   ↓
7. API route calls Spotify search API
   ↓
8. Returns results (tracks, artists, albums, etc.)
   ↓
9. SearchPage displays results in sections
```

---

## Authentication Flow

### Detailed OAuth 2.0 Flow

```
┌─────────┐         ┌──────────┐         ┌─────────────┐
│ Client  │         │ Next.js   │         │   Spotify   │
│ Browser │         │  Server   │         │     API     │
└────┬────┘         └─────┬─────┘         └──────┬──────┘
     │                    │                       │
     │ 1. GET /api/auth/login                    │
     │───────────────────►│                       │
     │                    │                       │
     │                    │ 2. Generate auth URL  │
     │                    │──────────────────────►│
     │                    │                       │
     │                    │ 3. Return auth URL    │
     │                    │◄──────────────────────│
     │                    │                       │
     │ 4. { url: "..." }  │                       │
     │◄───────────────────│                       │
     │                    │                       │
     │ 5. Redirect to Spotify                     │
     │───────────────────────────────────────────►│
     │                    │                       │
     │                    │ 6. User authorizes    │
     │                    │                       │
     │ 7. Redirect with code                      │
     │◄───────────────────────────────────────────│
     │                    │                       │
     │ 8. GET /api/auth/callback?code=...        │
     │───────────────────►│                       │
     │                    │                       │
     │                    │ 9. Exchange code      │
     │                    │──────────────────────►│
     │                    │                       │
     │                    │ 10. Return tokens     │
     │                    │◄──────────────────────│
     │                    │                       │
     │                    │ 11. Set cookies       │
     │                    │                       │
     │ 12. Redirect to /   │                       │
     │◄───────────────────│                       │
     │                    │                       │
     │ 13. GET /api/auth/me                       │
     │───────────────────►│                       │
     │                    │                       │
     │                    │ 14. Get user info     │
     │                    │──────────────────────►│
     │                    │                       │
     │                    │ 15. Return user data   │
     │                    │◄──────────────────────│
     │                    │                       │
     │ 16. { user: {...} }│                       │
     │◄───────────────────│                       │
     │                    │                       │
```

### Token Management

**Access Token:**
- Stored in HTTP-only cookie: `spotify_access_token`
- Expires: ~3600 seconds (1 hour)
- Used for all API requests

**Refresh Token:**
- Stored in HTTP-only cookie: `spotify_refresh_token`
- Expires: 30 days
- **Currently not used** (see Tricky Point #1)

**Cookie Settings:**
```typescript
{
  httpOnly: true,                    // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'lax',                    // CSRF protection
  maxAge: expiresIn                   // Expiration time
}
```

---

## Environment Variables

Required in `.env.local`:

```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3010/api/auth/callback
```

---

## Development Workflow

1. **Start dev server**: `npm run dev` (runs on port 3010)
2. **Type checking**: `npm run type-check`
3. **Linting**: `npm run lint`
4. **Formatting**: `npm run format`

---

## Key Files to Understand

1. **`src/lib/spotify.ts`** - Spotify API configuration and helpers
2. **`src/hooks/useSpotify.ts`** - Main client-side hook
3. **`src/components/AppLayout/AppLayout.tsx`** - Root layout component
4. **`src/app/api/auth/callback/route.ts`** - OAuth callback handler
5. **`src/app/api/spotify/search/route.ts`** - Example API route

---

## Future Improvements

1. **Implement token refresh** - Auto-refresh expired tokens
2. **Error handling** - Better error messages and retry logic
3. **Loading states** - Skeleton loaders for better UX
4. **Caching** - Cache API responses to reduce calls
5. **Pagination** - Handle large result sets
6. **Offline support** - Service workers for offline functionality

---

**Last Updated:** Based on current codebase state
**Maintainer Notes:** This is a fan-made project for educational purposes.

