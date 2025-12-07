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

## 🎬 Demo Access

### Automated Request System

**How to Get Access:**

1. 🌐 Visit [spotify-fanmade.vercel.app](https://spotify-fanmade.vercel.app)
2. Click **"Request Demo"** button
3. Enter your Spotify account email + optional message
4. System automatically emails me your request via Resend
5. I add you to both:
   - Spotify Developer Dashboard (User Management)
   - App's approved users list (`src/config/approvedUsers.ts`)
6. You receive confirmation within 24 hours
7. Login with Spotify OAuth - auto-approved users bypass the request modal

**Watch Demo Instead:**
- 🎥 **[View Full Demo Video](#)** *(Coming soon)*
- See all authenticated features without login

**Direct Email (Backup):**
- 📧 [lamnguyen.hcmut@gmail.com](mailto:lamnguyen.hcmut@gmail.com)
- Include your Spotify account email

### Why Login is Restricted

This app uses Spotify's Web API in **Development Mode** due to their [Extended Quota Mode requirements](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) (250k+ MAUs, registered business entity). Development mode limits access to 25 users maximum.

**This doesn't affect the technical implementation** - the code is identical to production-approved apps and demonstrates:
- OAuth 2.0 authentication flow
- Secure session management (HTTP-only cookies)
- Real-time API integration
- Professional frontend architecture

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

### 🎵 Playback
- Spotify Web Playback SDK integration with automatic fallback to preview URLs
- Full player controls: play/pause, skip, seek, volume, shuffle, repeat
- Queue management with drag-and-drop reordering
- Real-time position tracking

### 📊 Listening Insights (NEW)
Personal analytics dashboard with interactive data visualizations and time-range filtering (Last Month, 6 Months, All Time).

**Key Features:**
- **Interactive Stat Cards**: Click to navigate to Top Tracks, Artists, Genres, or Estimated Listening Time sections
- **Champion Artist**: Spotlight with trophy badge, avatar, listening time, and follower stats
- **Top Artists Chart**: Horizontal bar chart with estimated listening time per artist (uses actual track durations from Spotify API)
- **Top Tracks List**: Clickable list showing album art, track info, and popularity scores. Click any track to view detailed modal
- **Track Detail Modal**: Comprehensive track information with album artwork, metadata, popularity, duration, and "Open in Spotify" link
- **Genre Distribution**: Interactive donut chart + progress bars with circular icons showing genre breakdown
- **Audio Features**: Radar chart displaying music taste profile (Energy, Danceability, Valence, etc.)
- **Track Popularity**: Bar chart of Spotify popularity scores (0-100)

**Technical Highlights:**
- Accurate listening time calculations using real track durations and weighted play estimation
- Time range multipliers (1x, 6x, 24x) for different periods
- Built with Chart.js (Donut, Radar, Bar charts)
- 100% Design System compliance
- NEW badge with pulse animation in header

### 📚 Library & Content
- User library: saved tracks, playlists, albums, artists, podcasts
- Recently played history and top artists
- Multi-entity search (tracks, artists, albums, playlists, podcasts)
- Filter system for library items

### 🔐 Access Control
- Automated demo request system with email notifications
- Approved users bypass request modal for seamless OAuth login
- Configurable user allowlist for development mode compliance

### 🎨 UI/UX
- Dynamic gradient backgrounds extracted from album artwork
- Skeleton loading screens for all async content
- Toast notifications for user feedback
- Error boundaries for graceful error handling
- Fully responsive design (mobile, tablet, desktop)
- Dark theme with Spotify aesthetic
- Custom circular icon badges with unique colors per category
- Smooth scroll navigation to page sections
- Hover effects with scale transforms and color transitions
- Modal system for focused content viewing
- Interactive stat cards with click handlers
- Pulsing animations for NEW features
- Nested modals (Track List → Track Detail)
- 100% Design System compliance (no raw HTML elements)

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

**3. Add yourself to User Management:**
- In your Spotify app dashboard, go to **Settings**
- Find **User Management** section
- Add your Spotify account email
- Click **Save**

**4. Configure environment:**
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
APPROVED_USERS="your.email@example.com"
```

**5. Run:**
```bash
npm run dev
# Open http://127.0.0.1:3010
```

**Note:** Your Spotify Developer App will be in Development Mode by default, which limits access to 25 users. This is sufficient for development and portfolio demonstration.

---

## Deployment (Vercel)

**1. Set environment variables in Vercel:**
```env
# Required
SPOTIFY_CLIENT_ID             # From Spotify Developer Dashboard
SPOTIFY_CLIENT_SECRET         # From Spotify Developer Dashboard
SPOTIFY_REDIRECT_URI          # https://your-app.vercel.app/api/auth/callback
NEXT_PUBLIC_APP_URL           # https://your-app.vercel.app
SESSION_SECRET                # Generate: openssl rand -base64 32

# Approved Users (comma-separated)
APPROVED_USERS                # "user1@example.com,user2@example.com"

# Optional - Demo Request Emails
RESEND_API_KEY                # From resend.com (enables email notifications)
```

**2. Update Spotify redirect URIs:**
- Go to your app in [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Settings → Redirect URIs
- Add: `https://your-app.vercel.app/api/auth/callback`
- Click **Save**

**3. Configure demo request email (Optional):**
```env
RESEND_API_KEY                # From resend.com (free tier: 3k emails/month)
```
- Sign up at [resend.com](https://resend.com)
- Get API key from dashboard
- Enables automated email notifications for demo requests
- Without this, requests are logged to console only

**4. Add users to allowlist:**

**Method 1: Spotify Developer Dashboard**
- Settings → User Management
- Add Spotify email addresses
- Required for OAuth access

**Method 2: Auto-approved Users (Bypass Request Modal)**
- Add to environment variable (no code changes needed!)
- These users skip the "Request Demo" modal and go straight to OAuth login
```env
APPROVED_USERS="admin@example.com,user@example.com,recruiter@company.com"
```
- In Vercel: Settings → Environment Variables → Edit `APPROVED_USERS`
- Locally: Add to `.env.local`

**5. Deploy from GitHub:**
- Vercel auto-deploys on push to main branch

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

**Data Visualization:**
- `chart.js` (charts and graphs)
- `react-chartjs-2` (React wrapper)

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
