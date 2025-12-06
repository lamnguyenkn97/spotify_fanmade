# Spotify Web Client

<div align="center">

**Frontend implementation of Spotify's web player with custom design system published to NPM.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NPM Package](https://img.shields.io/badge/NPM_Published-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/spotify-design-system)

[Live Demo](https://spotify-fanmade.vercel.app) • [NPM Package](https://www.npmjs.com/package/spotify-design-system) • [Storybook](https://spotify-storybook.vercel.app)

</div>

---

## Legal Disclaimer

This is an independent educational project for portfolio demonstration.

- Not affiliated with, endorsed by, or connected to Spotify AB
- "Spotify" is a registered trademark of Spotify AB
- Uses official Spotify Web API per [Developer Terms](https://developer.spotify.com/terms)
- No music files stored or distributed
- Code provided under MIT License

---

## Tech Stack

**Frontend:** Next.js 15 (App Router) • React 18 • TypeScript 5.3 • Tailwind CSS

**State:** React Context API • SWR (server state)

**APIs:** Spotify Web API • Spotify Web Playback SDK

**Design:** Custom design system ([spotify-design-system](https://www.npmjs.com/package/spotify-design-system))

---

## Features

### Playback
- Spotify Web Playback SDK integration with automatic fallback to preview URLs
- Full player controls: play/pause, skip, seek, volume, shuffle, repeat
- Queue management with drag-and-drop reordering
- Real-time position tracking

### Library & Content
- User library: saved tracks, playlists, albums, artists, podcasts
- Recently played history and top artists
- Multi-entity search (tracks, artists, albums, playlists, podcasts)
- Filter system for library items

### UI/UX
- Dynamic gradient backgrounds extracted from album artwork
- Skeleton loading screens
- Toast notifications
- Error boundaries
- Responsive design
- Dark theme

---

## Design System

Published `spotify-design-system` to NPM:

```bash
npm install spotify-design-system
```

**Features:**
- 23 components organized by Atomic Design methodology
- TypeScript with full type definitions
- [Live Storybook documentation](https://spotify-storybook.vercel.app)
- Design token system (spacing, colors, typography, shadows)
- Tree-shakeable exports

**Repository:** [github.com/lamnguyenkn97/spotify_design_system](https://github.com/lamnguyenkn97/spotify_design_system)

---

## Architecture

### State Management

**4 React Contexts + SWR for server state:**

```typescript
// Server State (SWR - automatic caching & deduplication)
useSavedTracks()
useMyPlaylists()
useRecentlyPlayed()
useTopArtists()
// ... more API hooks

// Global UI State (React Context)
MusicPlayerContext    // Playback state, queue, controls
ModalContext          // Modal management
ToastContext          // Notifications
QueueDrawerContext    // Queue UI visibility
```

**Custom Hooks:**
- `useMusicPlayer()` - Player orchestration
- `useQueue()` - Queue management
- `useSpotifyWebPlayback()` - SDK integration
- `usePlaybackStrategy()` - Strategy pattern (SDK vs preview)
- `useAccessToken()` - Token auto-refresh
- Plus more for specific features

### Design Patterns

**Strategy Pattern (Playback):**
```typescript
interface PlaybackStrategy {
  play: (track: CurrentTrack) => Promise<void>;
  canPlay: (track: CurrentTrack) => boolean;
  isActive: boolean;
}

// Automatically switches between:
// - WebPlaybackStrategy (Premium users, full tracks via SDK)
// - PreviewPlaybackStrategy (Free users, 30s previews)
```

**Adapter Pattern (Data Transformation):**
```typescript
// Unified interface from different Spotify API types
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

## Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── api/                   # API routes (OAuth, Spotify endpoints)
│   ├── [pages]/               # Dynamic routes (artist, playlist, show)
│   └── page.tsx               # Homepage
│
├── components/                # React components
│   ├── MusicPlayer/           # Player bar
│   ├── QueueDrawer/           # Queue sidebar
│   ├── TrackTable/            # Track lists
│   └── Skeletons/             # Loading states
│
├── hooks/                     # Custom React hooks
│   ├── api/                   # SWR data fetching hooks
│   └── [logic hooks]/         # Player, queue, SDK integration
│
├── contexts/                  # React Context providers
│   ├── MusicPlayerContext/    # Player state
│   ├── ModalContext/          # Modals
│   └── ToastContext/          # Notifications
│
├── types/                     # TypeScript definitions
│   ├── spotify.ts             # Spotify API types
│   └── ui.ts                  # Component types
│
└── utils/                     # Helper functions
    ├── imageHelpers.ts        # Image selection
    ├── formatHelpers.ts       # Duration, date formatting
    └── colorExtractor.ts      # Album art colors
```

---

## Setup

### Prerequisites
- Node.js 18+
- Spotify account
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
SESSION_SECRET=generate_random_string
```

**4. Run:**
```bash
npm run dev
# Open http://127.0.0.1:3010
```

---

## Deployment (Vercel)

**Environment variables:**
```env
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_REDIRECT_URI          # https://your-app.vercel.app/api/auth/callback
NEXT_PUBLIC_APP_URL           # https://your-app.vercel.app
SESSION_SECRET
```

**Update Spotify redirect URIs** in Developer Dashboard, then deploy.

---

## Security

**Implementation:**
- OAuth 2.0 PKCE flow
- HTTP-only cookies (tokens not exposed to JS)
- Content Security Policy headers
- HSTS, SameSite cookies
- Next.js 15.5.7 (security patches applied)

**Headers configured in `next.config.js`:**
```javascript
'X-Frame-Options': 'DENY'
'X-Content-Type-Options': 'nosniff'
'Content-Security-Policy': "frame-src 'self' https://accounts.spotify.com https://sdk.scdn.co"
'Strict-Transport-Security': 'max-age=31536000'
```

---

## Code Quality

- TypeScript strict mode
- ESLint + Prettier
- Zero build errors
- 100% type coverage
- Performance optimizations: `useCallback`, `useMemo`, code splitting

---

## Key Dependencies

**Core:**
- `next` 15.5.7
- `react` 18
- `typescript` 5.3
- `spotify-design-system` (custom)
- `spotify-web-api-node`
- `swr`

**Utilities:**
- `fast-average-color` (color extraction)
- `dayjs` (date formatting)
- `styled-components`
- `@fortawesome/react-fontawesome`

---

## Resources

| Resource | Link |
|----------|------|
| Live Demo | [spotify-fanmade.vercel.app](https://spotify-fanmade.vercel.app) |
| NPM Package | [npmjs.com/package/spotify-design-system](https://www.npmjs.com/package/spotify-design-system) |
| Storybook | [spotify-storybook.vercel.app](https://spotify-storybook.vercel.app) |
| Design System | [github.com/lamnguyenkn97/spotify_design_system](https://github.com/lamnguyenkn97/spotify_design_system) |
| Repository | [github.com/lamnguyenkn97/spotify_fanmade](https://github.com/lamnguyenkn97/spotify_fanmade) |

---

## License

MIT License - Copyright (c) 2025 Lam Nguyen

This license applies to code only. Users must comply with [Spotify's Developer Terms](https://developer.spotify.com/terms).

---

<div align="center">

Built by [Lam Nguyen](https://github.com/lamnguyenkn97)

Not affiliated with Spotify AB • Educational Project

</div>
