# 🎵 Spotify API Integration

## Quick Setup

### 1. Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create app → Set redirect URI: `http://localhost:3010/api/auth/callback`
3. Copy **Client ID** and **Client Secret**

### 2. Environment Variables

Create `.env.local`:

```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3010/api/auth/callback
```

### 3. Restart Server

```bash
npm run dev
```

## OAuth Scopes

The app requests these permissions:

- `user-read-private`, `user-read-email` - User profile
- `playlist-read-*`, `playlist-modify-*` - Playlist access
- `user-library-*` - Saved music
- `user-top-read` - Top artists/tracks
- `user-read-recently-played` - Recently played
- `streaming` - **Web Playback SDK (Premium only)**
- `user-read-playback-state`, `user-modify-playback-state` - Playback control

## Architecture

### API Connection Flow

```
Client (useSpotify hook)
    ↓ fetch('/api/...')
Next.js API Route
    ↓ Read token from cookie
Spotify API Client (spotify-web-api-node)
    ↓ Call Spotify API
Spotify Web API
    ↓ Return data
Client receives JSON
```

### Example Implementation

**Client (`src/hooks/useSpotify.ts`):**
```typescript
const getPlaylists = async () => {
  const response = await fetch('/api/playlists');
  return await response.json();
};
```

**Server (`src/app/api/playlists/route.ts`):**
```typescript
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const spotifyApi = createSpotifyApi(accessToken);
  const playlists = await spotifyApi.getUserPlaylists();
  return NextResponse.json(playlists.body);
}
```

## Authentication Flow

### OAuth 2.0 Flow

1. **Login**: User clicks "Log in" → `/api/auth/login`
2. **Authorization**: Server generates Spotify OAuth URL → Redirects to Spotify
3. **Callback**: User authorizes → Spotify redirects to `/api/auth/callback?code=...`
4. **Token Exchange**: Server exchanges code for tokens → Sets HTTP-only cookies
5. **Authenticated**: Client redirects to home → User is authenticated

### Token Management

- **Access Token**: HTTP-only cookie, expires ~1 hour
- **Refresh Token**: HTTP-only cookie, expires 30 days
- **⚠️ Note**: Token refresh not implemented (users must re-login after 1 hour)

### Cookie Security

```typescript
{
  httpOnly: true,                    // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'lax',                   // CSRF protection
  maxAge: expiresIn                  // Expiration time
}
```

## API Routes

### Authentication Routes (`/api/auth/`)

- `GET /api/auth/login` - Initiate OAuth login
- `GET /api/auth/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Clear authentication cookies
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/token` - Get access token (for Web Playback SDK)

### Spotify Proxy Routes (`/api/spotify/`)

- `GET /api/spotify/my-playlists` - User's playlists
- `GET /api/spotify/my-artists` - Followed artists
- `GET /api/spotify/my-albums` - Saved albums
- `GET /api/spotify/my-shows` - Saved podcasts/shows
- `GET /api/spotify/search` - Search (tracks, artists, albums, etc.)
- `GET /api/spotify/playlist/[id]` - Playlist details
- `GET /api/spotify/artist/[id]` - Artist details
- `GET /api/spotify/show/[id]` - Show/podcast details
- `GET /api/spotify/recently-played` - Recently played tracks

## Security Best Practices

- ✅ Tokens stored in HTTP-only cookies (not accessible via JavaScript)
- ✅ Client secret never exposed to client
- ✅ All API calls go through Next.js API routes (server-side)
- ✅ CORS protection via Next.js
- ✅ Token validation on every API request

## Key Files

- `src/lib/spotify.ts` - Spotify API configuration and helpers
- `src/hooks/useSpotify.ts` - Client-side hook for API calls
- `src/app/api/auth/*` - Authentication endpoints
- `src/app/api/spotify/*` - Spotify API proxy routes
