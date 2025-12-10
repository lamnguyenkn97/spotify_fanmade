# Spotify Web Client

<div align="center">

**Full-stack Spotify web player with custom Design System published to NPM**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NPM Package](https://img.shields.io/badge/NPM_Published-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/spotify-design-system)

[Live Demo](https://spotify-fanmade.vercel.app) • [NPM Package](https://www.npmjs.com/package/spotify-design-system) • [Storybook](https://spotify-storybook.vercel.app)

</div>

---

## 🎯 Key Achievements

- **📦 Published Design System to NPM** - ~30 reusable components with TypeScript + Storybook documentation
- **📊 Listening Insights Dashboard** - Personal analytics with Chart.js (donut, radar, bar charts) and time-range filtering
- **🎵 Advanced Queue System** - Drag-and-drop reordering, add from anywhere, visual drawer with album artwork
- **🎨 100% Design System Compliance** - Zero raw HTML elements, all custom components
- **🏗️ Strategy Pattern** - Automatic playback switching (Spotify SDK for Premium, 30s preview for Free users)
- **🔐 OAuth 2.0 + Security** - PKCE flow, HTTP-only cookies, CSP headers, automated demo requests

---

## Tech Stack

**Frontend:** Next.js 15 (App Router) • React 18 • TypeScript 5.3 • Tailwind CSS

**State:** React Context API • SWR (server state)

**APIs:** Spotify Web API • Spotify Web Playback SDK

**Data Viz:** Chart.js • react-chartjs-2

**Design:** Custom Design System ([spotify-design-system](https://www.npmjs.com/package/spotify-design-system))

---

## Features

### 📦 NPM Design System
Published reusable component library to NPM:
```bash
npm install spotify-design-system
```
- 23 components (Atomic Design methodology)
- Full TypeScript definitions
- Live Storybook: [spotify-storybook.vercel.app](https://spotify-storybook.vercel.app)
- Tree-shakeable exports with design tokens

### 📊 Listening Insights (NEW)
Personal analytics dashboard with interactive visualizations:
- **Champion Artist** spotlight with trophy badge, avatar, and estimated listening time
- **Top Artists/Tracks** with clickable modals showing detailed info
- **Genre Distribution** via donut chart + progress bars
- **Audio Features** radar chart (Energy, Danceability, Valence, etc.)
- **Track Popularity** bar chart with Spotify scores
- Time-range filtering (Last Month, 6 Months, All Time)
- Uses actual track durations + weighted play estimation

### 🎵 Playback & Queue
- Spotify Web Playback SDK with automatic fallback to 30s previews
- Full player controls (play/pause, skip, seek, volume, shuffle, repeat)
- **Advanced Queue**: Drag-and-drop reordering, add from anywhere, visual drawer
- Real-time position tracking with progress bar

### 📚 Library & Content
- User library: saved tracks, playlists, albums, artists, podcasts
- Recently played history and top artists
- Multi-entity search (tracks, artists, albums, playlists, podcasts)
- Filter system for library items

### 🎨 UI/UX
- Dynamic backgrounds extracted from album artwork
- Responsive design (mobile, tablet, desktop)
- Skeleton loading states + toast notifications
- Smooth interactions (hover, scale, scroll, pulse animations)
- Nested modals for focused viewing
- Accessibility (ARIA labels, keyboard navigation)

### 🔐 Access Control
- Automated demo request system with email notifications
- Approved users bypass request modal
- OAuth 2.0 PKCE flow with HTTP-only cookies

---

## Architecture Highlights

### State Management
```typescript
// Server State (SWR - automatic caching)
useSavedTracks() | useMyPlaylists() | useTopArtists()

// Global UI State (React Context)
MusicPlayerContext    // Playback + queue
ModalContext          // Modals
ToastContext          // Notifications
QueueDrawerContext    // Queue UI
```

### Design Patterns

**Strategy Pattern (Playback):**
```typescript
interface PlaybackStrategy {
  play: (track: CurrentTrack) => Promise<void>;
  canPlay: (track: CurrentTrack) => boolean;
  isActive: boolean;
}
// Auto-switches: WebPlaybackStrategy (Premium) ↔ PreviewPlaybackStrategy (Free)
```

**Custom Hooks:**
- `useMusicPlayer()` - Player orchestration
- `useQueue()` - Queue management with drag-and-drop
- `useSpotifyWebPlayback()` - SDK integration
- `usePlaybackStrategy()` - Strategy pattern implementation
- `useAccessToken()` - Token auto-refresh

---

## Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── api/                   # OAuth + Spotify endpoints
│   └── insights/              # Analytics dashboard
├── components/                # Design System components
│   ├── MusicPlayer/           # Player bar
│   ├── QueueDrawer/           # Queue sidebar
│   └── InsightCard/           # Analytics cards
├── hooks/                     # Custom hooks
│   ├── api/                   # SWR data fetching
│   └── [logic]/               # Player, queue, SDK
├── contexts/                  # React Context providers
└── types/                     # TypeScript definitions
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Spotify Developer App ([create here](https://developer.spotify.com/dashboard))

### Local Setup

```bash
# 1. Clone and install
git clone https://github.com/lamnguyenkn97/spotify_fanmade.git
cd spotify_fanmade
npm install

# 2. Configure environment
cp .env.example .env.local
```

Edit `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3010/api/auth/callback
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3010
SESSION_SECRET=generate_random_string
APPROVED_USERS="your.email@example.com"
```

```bash
# 3. Run
npm run dev
# Open http://127.0.0.1:3010
```

**Important:** Add your email in Spotify Developer Dashboard → Settings → User Management

---

## Deployment

### Vercel Environment Variables
```env
SPOTIFY_CLIENT_ID              # From Spotify Dashboard
SPOTIFY_CLIENT_SECRET          # From Spotify Dashboard
SPOTIFY_REDIRECT_URI           # https://your-app.vercel.app/api/auth/callback
NEXT_PUBLIC_APP_URL            # https://your-app.vercel.app
SESSION_SECRET                 # openssl rand -base64 32
APPROVED_USERS                 # "user1@example.com,user2@example.com"
RESEND_API_KEY                 # Optional - for email notifications
```

**Update Spotify Redirect URIs:**
- Spotify Dashboard → Settings → Redirect URIs
- Add: `https://your-app.vercel.app/api/auth/callback`

---

## Security

- OAuth 2.0 PKCE flow
- HTTP-only cookies (tokens never exposed to JavaScript)
- Content Security Policy + HSTS headers
- SameSite cookies
- Next.js 15.5.7 with latest security patches

---

## Code Quality

- TypeScript strict mode
- ESLint + Prettier
- Zero build errors
- 100% type coverage
- Performance optimized (`useCallback`, `useMemo`, code splitting)

---

## 🎬 Demo Access

This app uses Spotify's Web API in **Development Mode** (25 user limit).

**Get Access:**
1. Visit [spotify-fanmade.vercel.app](https://spotify-fanmade.vercel.app)
2. Click **"Request Demo"**
3. Enter your Spotify email
4. Receive automated approval

**Backup:** Email [lamnguyen.hcmut@gmail.com](mailto:lamnguyen.hcmut@gmail.com)

---

## Resources

| Resource | Link |
|----------|------|
| Live Demo | [spotify-fanmade.vercel.app](https://spotify-fanmade.vercel.app) |
| NPM Package | [npmjs.com/package/spotify-design-system](https://www.npmjs.com/package/spotify-design-system) |
| Storybook | [spotify-storybook.vercel.app](https://spotify-storybook.vercel.app) |
| Design System Repo | [github.com/lamnguyenkn97/spotify_design_system](https://github.com/lamnguyenkn97/spotify_design_system) |
| Main Repo | [github.com/lamnguyenkn97/spotify_fanmade](https://github.com/lamnguyenkn97/spotify_fanmade) |

---

## Legal Disclaimer

Educational project for portfolio demonstration. Not affiliated with Spotify AB. Uses official Spotify Web API per [Developer Terms](https://developer.spotify.com/terms).

---

## License

MIT License - Copyright (c) 2025 Lam Nguyen

---

<div align="center">

Built by [Lam Nguyen](https://github.com/lamnguyenkn97)

Not affiliated with Spotify AB • Educational Project

</div>
