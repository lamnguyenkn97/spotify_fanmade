# Spotify Web Client - Frontend Implementation

<div align="center">

**A Spotify web player built with Next.js 15, TypeScript, and a custom design system published to NPM.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NPM Package](https://img.shields.io/badge/NPM_Published-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/spotify-design-system)

[Live Demo](https://spotify-fanmade.vercel.app) • [NPM Package](https://www.npmjs.com/package/spotify-design-system) • [Storybook](https://spotify-storybook.vercel.app)

</div>

---

## Legal Disclaimer

**This is an independent educational project for portfolio demonstration.**

- Not affiliated with, endorsed by, or connected to Spotify AB
- "Spotify" is a registered trademark of Spotify AB (EU008355043)
- Uses official Spotify Web API per [Developer Terms](https://developer.spotify.com/terms)
- No music files stored or distributed - all playback through official Spotify infrastructure
- Users must authenticate with their own Spotify accounts
- Code provided under MIT License for learning purposes

For Spotify AB representatives: Contact me directly with any concerns.

---

## Overview

A frontend implementation of Spotify's web player featuring:
- Custom design system (published to NPM as `spotify-design-system`)
- Real-time music playback via Spotify Web Playback SDK
- OAuth 2.0 authentication with Spotify
- Server state management using SWR
- TypeScript strict mode throughout

**Tech Stack:** Next.js 15 (App Router), React 18, TypeScript 5.3, Tailwind CSS, SWR

**Stats:** 8,500+ lines of code, 90+ TypeScript files, 100% type coverage, zero build errors

---

## Features

### Playback
- Spotify Web Playback SDK integration (Premium users get full tracks)
- Automatic fallback to 30-second preview URLs (free tier)
- Full player controls: play/pause, skip, seek, volume, shuffle, repeat
- Queue management with drag-and-drop reordering
- Real-time playback position tracking

### Library & Content
- User library: saved tracks, playlists, albums, artists, podcasts
- Recently played history
- Top artists and albums
- Multi-entity search (tracks, artists, albums, playlists, podcasts)
- Filter system for library items

### UI/UX
- Dynamic gradient backgrounds extracted from album artwork
- Skeleton loading screens (reusable components)
- Toast notifications for user feedback
- Error boundaries for graceful error handling
- Responsive design (mobile, tablet, desktop)
- Dark theme matching Spotify aesthetic

---

## Design System

Built and published `spotify-design-system` to NPM:

```bash
npm install spotify-design-system
```

**Architecture:**
- 23 components organized by Atomic Design (Atoms, Molecules, Organisms)
- TypeScript with full type definitions
- 70+ test cases (Jest + React Testing Library)
- [Live Storybook documentation](https://spotify-storybook.vercel.app)
- Design token system (spacing, colors, typography, shadows, border radius)
- Tree-shakeable exports

**Components:**
```typescript
// Atoms (15)
Button, Icon, Typography, Input, Image, Skeleton, Pill, TextLink, etc.

// Molecules (5)
Card, Drawer, Banner, SearchBar, Toast, Modal, etc.

// Organisms (3)
Sidebar, MusicPlayer, AppHeader
```

**Repository:** [github.com/lamnguyenkn97/spotify_design_system](https://github.com/lamnguyenkn97/spotify_design_system)

---

## Technical Implementation

### State Management

**Layered approach using 4 React Contexts + SWR:**

```typescript
// Layer 1: Server State (SWR)
useSavedTracks()      // Liked songs with caching
useMyPlaylists()      // User playlists
useRecentlyPlayed()   // Listen history
useTopArtists()       // Most played artists
// ... 15+ API endpoints

// Layer 2: Global UI State (React Context)
MusicPlayerContext    // Playback state, queue, controls (400+ lines)
ModalContext          // Unified modal management (150 lines)
ToastContext          // Notification system (100 lines)
QueueDrawerContext    // Queue UI visibility (50 lines)

// Layer 3: Local State
useState()            // Component-specific state

// Layer 4: Session State
HTTP-only cookies     // Secure token storage
```

**Custom Hooks (12 total):**
- `useMusicPlayer()` - 404 lines, orchestrates player logic
- `useQueue()` - 120 lines, queue management
- `useSpotifyWebPlayback()` - SDK integration
- `usePlaybackStrategy()` - Strategy pattern for preview vs SDK
- `useAccessToken()` - Token auto-refresh (50min interval)
- `useRepeat()` - Repeat mode state machine
- Plus 6 more for specific features

**Performance optimizations:**
- 25+ `useCallback` hooks (prevent re-renders)
- 15+ `useMemo` hooks (cache expensive computations)
- SWR caching (automatic request deduplication)
- Code splitting (per route)

---

### Design Patterns

**1. Strategy Pattern (Playback)**
```typescript
interface PlaybackStrategy {
  play: (track: CurrentTrack) => Promise<void>;
  canPlay: (track: CurrentTrack) => boolean;
  isActive: boolean;
}

// Automatically switches between:
// - WebPlaybackStrategy (Premium, full tracks via SDK)
// - PreviewPlaybackStrategy (Free, 30s previews via HTML5 Audio)
```

**2. Provider Pattern (Contexts)**
```typescript
<ToastProvider>
  <ModalProvider>
    <MusicPlayerProvider>
      <App />
```

**3. Adapter Pattern (Data Transformation)**
```typescript
// Unified LibraryItem interface from different Spotify types
const libraryItems = useMemo(() => {
  return playlists.map(playlist => ({
    id: playlist.id,
    title: playlist.name,
    type: 'playlist',
    // ... unified shape
  }));
}, [playlists]);
```

---

### API Layer

**26 Next.js API routes:**
```
/api/auth/              OAuth flow (login, callback, logout, token refresh)
/api/spotify/
  ├── my-playlists      User playlists
  ├── my-saved-tracks   Liked songs
  ├── recently-played   Listen history
  ├── top-artists       Most played artists
  ├── search            Universal search
  ├── playlist/[id]     Playlist details + tracks
  ├── artist/[id]       Artist profile + discography
  ├── album/[id]        Album details
  └── show/[id]         Podcast show + episodes
```

**Features:**
- Server-side token management
- Error handling with proper status codes
- Response caching headers
- TypeScript request/response types

---

### Security

**Implementation:**
- OAuth 2.0 PKCE flow for authentication
- HTTP-only cookies (tokens never exposed to JavaScript)
- Content Security Policy headers
- Strict Transport Security (HSTS)
- SameSite cookies for CSRF protection
- Next.js 15.5.7 (CVE-2025-55182 patched)

**next.config.js headers:**
```javascript
'X-Frame-Options': 'DENY'
'X-Content-Type-Options': 'nosniff'
'Content-Security-Policy': "frame-src 'self' https://accounts.spotify.com https://sdk.scdn.co"
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (26 endpoints)
│   ├── artist/[id]/              # Artist pages
│   ├── playlist/[id]/            # Playlist pages
│   ├── show/[id]/                # Podcast pages
│   ├── library/                  # Library page
│   ├── search/                   # Search page
│   └── page.tsx                  # Homepage
│
├── components/                   # React components (40+)
│   ├── AppLayout/                # Main application shell
│   ├── MusicPlayer/              # Fixed player bar
│   ├── QueueDrawer/              # Queue sidebar
│   ├── TrackTable/               # Track lists with sorting
│   ├── PlaylistHeader/           # Playlist metadata display
│   ├── LibrarySideBar/           # Library navigation
│   ├── Skeletons/                # Loading state components
│   └── ErrorBoundary/            # Error handling
│
├── hooks/                        # Custom React hooks (12)
│   ├── api/                      # SWR hooks for data fetching
│   ├── useMusicPlayer.ts         # Player orchestration
│   ├── useQueue.ts               # Queue management
│   ├── useSpotifyWebPlayback.ts  # SDK integration
│   ├── usePlaybackStrategy.ts    # Strategy pattern
│   └── useAccessToken.ts         # Token refresh
│
├── contexts/                     # React Context providers (4)
│   ├── MusicPlayerContext.tsx    # Global player state
│   ├── ModalContext.tsx          # Modal management
│   ├── ToastContext.tsx          # Notifications
│   └── QueueDrawerContext.tsx    # Queue UI state
│
├── lib/                          # Core libraries
│   ├── api-client.ts             # HTTP client + SWR fetchers
│   ├── spotify.ts                # Spotify API wrapper
│   └── fontawesome.tsx           # Icon configuration
│
├── types/                        # TypeScript definitions
│   ├── spotify.ts                # Spotify API types (500+ lines)
│   ├── ui.ts                     # Component prop types
│   └── enums.ts                  # Shared enums
│
├── utils/                        # Helper functions
│   ├── imageHelpers.ts           # Image URL selection
│   ├── formatHelpers.ts          # Duration, date formatting
│   ├── colorExtractor.ts         # Album art color extraction
│   └── trackHelpers.ts           # Track transformations
│
└── config/                       # Configuration
    └── footerData.ts             # Footer links
```

---

## Metrics

### Codebase
| Metric | Value |
|--------|-------|
| Total Files | 90+ TypeScript files |
| Lines of Code | 8,500+ |
| Components | 70 (40 custom + 30 design system) |
| API Routes | 26 endpoints |
| Custom Hooks | 12 hooks |
| React Contexts | 4 providers |
| TypeScript Coverage | 100% |
| Build Errors | 0 |
| Security Vulnerabilities | 0 |

### Performance
| Metric | Value |
|--------|-------|
| Shared JS | 102 KB |
| Homepage (First Load) | 202 KB |
| Search Page | 166 KB |
| Playlist Page | 205 KB |
| Build Time | ~45 seconds |

All pages under 210KB first load JS.

---

## Setup

### Prerequisites
- Node.js 18+, npm 9+
- Spotify account (Premium for full playback)
- [Spotify Developer App](https://developer.spotify.com/dashboard)

### Local Development

**1. Clone and install:**
```bash
git clone https://github.com/lamnguyenkn97/spotify_fanmade.git
cd spotify_fanmade
npm install
```

**2. Spotify Developer setup:**
- Create app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
- Add redirect URI: `http://127.0.0.1:3010/api/auth/callback`
- Copy Client ID and Client Secret

**3. Configure environment:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3010/api/auth/callback
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3010
SESSION_SECRET=generate_with_openssl_rand_base64_32
```

**4. Run development server:**
```bash
npm run dev
# Open http://127.0.0.1:3010
```

---

## Deployment

### Vercel

**1. Environment variables (required):**
```env
SPOTIFY_CLIENT_ID          # Spotify app client ID
SPOTIFY_CLIENT_SECRET      # Spotify app client secret
SPOTIFY_REDIRECT_URI       # https://your-app.vercel.app/api/auth/callback
NEXT_PUBLIC_APP_URL        # https://your-app.vercel.app
SESSION_SECRET             # openssl rand -base64 32
```

**2. Update Spotify redirect URIs:**
- Add production callback URL in Spotify Developer Dashboard

**3. Deploy:**
```bash
git push origin main
# Vercel auto-deploys from GitHub
```

---

## Available Scripts

```bash
npm run dev          # Development server (http://127.0.0.1:3010)
npm run build        # Production build
npm start            # Production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting
npm run type-check   # TypeScript validation
npm run format       # Format with Prettier
```

---

## Code Quality

### TypeScript Configuration
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

### Build Output
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (26/26)
✓ Build completed in ~45 seconds
```

### ESLint
- Next.js recommended rules
- React hooks rules
- Accessibility rules (WCAG AA)
- TypeScript rules
- Prettier integration

---

## Technical Notes

### Color Extraction
Uses `fast-average-color` library to extract dominant colors from album artwork for gradient backgrounds:

```typescript
import { FastAverageColor } from 'fast-average-color';

const { color1, color2 } = await extractColorsFromImage(albumArtUrl);
// Applied as: background: linear-gradient(180deg, color1 0%, color2 100%)
```

### Skeleton Components
Reusable loading state components extracted from hardcoded implementations:

```typescript
<PlaylistHeaderSkeleton gradientColors={colors} />
<ActionButtonsSkeleton buttonCount={4} />
<TrackListSkeleton rowCount={8} showAlbumColumn={true} />
```

### Shared Types
Consolidated type definitions to eliminate duplication:

```
src/types/
├── spotify.ts    # 15+ Spotify API interfaces
├── ui.ts         # Component prop types
└── index.ts      # Central exports
```

### Utility Functions
Extracted duplicated code into shared utilities:

```
src/utils/
├── imageHelpers.ts   # getBestImageUrl (used 10+ times)
├── formatHelpers.ts  # formatDuration (used 8+ times)
└── colorExtractor.ts # Album art color analysis
```

---

## Dependencies

**Core:**
- `next` 15.5.7 - React framework
- `react` 18 - UI library
- `typescript` 5.3 - Type system
- `spotify-design-system` - Custom component library
- `spotify-web-api-node` - Spotify API client
- `swr` - Server state management

**Utilities:**
- `fast-average-color` - Color extraction (3KB)
- `dayjs` - Date formatting (2KB)
- `styled-components` - CSS-in-JS
- `@fortawesome/react-fontawesome` - Icons

**Dev:**
- `eslint` - Code linting
- `prettier` - Code formatting
- `tailwindcss` - Utility CSS

Total: 20 direct dependencies, 416 total

---

## Resources

| Resource | Link |
|----------|------|
| Live Application | [spotify-fanmade.vercel.app](https://spotify-fanmade.vercel.app) |
| NPM Package | [npmjs.com/package/spotify-design-system](https://www.npmjs.com/package/spotify-design-system) |
| Storybook Docs | [spotify-storybook.vercel.app](https://spotify-storybook.vercel.app) |
| Design System Repo | [github.com/lamnguyenkn97/spotify_design_system](https://github.com/lamnguyenkn97/spotify_design_system) |
| GitHub | [github.com/lamnguyenkn97/spotify_fanmade](https://github.com/lamnguyenkn97/spotify_fanmade) |

---

## License

MIT License - Copyright (c) 2025 Lam Nguyen

This license applies to the code only. It does not grant rights to use Spotify's trademarks or copyrighted materials. Users must comply with [Spotify's Developer Terms](https://developer.spotify.com/terms).

---

## Acknowledgments

- **Spotify AB** - Official Web API
- **Next.js Team** - React framework
- **Vercel** - Deployment platform
- **Open Source Community** - Tools and libraries

UI/UX design inspired by Spotify's web player as a frontend development exercise.

---

<div align="center">

Built by [Lam Nguyen](https://github.com/lamnguyenkn97)

Not affiliated with Spotify AB • Educational Project • © 2025

</div>
