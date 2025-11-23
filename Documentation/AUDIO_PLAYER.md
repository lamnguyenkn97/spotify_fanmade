# 🎵 Audio Player

## Overview

The app supports two playback methods with automatic fallback:

1. **Web Playback SDK** - Full song playback (requires Premium)
2. **Preview URLs** - 30-second previews (no Premium required)

## Architecture

```
MusicPlayerProvider (Context)
    ↓
useMusicPlayer Hook
    ↓
├── Web Playback SDK (if Premium + ready)
└── HTML5 Audio (preview URLs fallback)
```

### Key Components

- `src/hooks/useMusicPlayer.ts` - Core player logic
- `src/hooks/useSpotifyWebPlayback.ts` - Web Playback SDK integration
- `src/hooks/useAccessToken.ts` - Get access token for SDK
- `src/contexts/MusicPlayerContext.tsx` - React Context provider
- `src/components/MusicPlayer/MusicPlayer.tsx` - UI component
- `src/utils/trackHelpers.ts` - Track format conversion

## Usage

### Basic Usage

```typescript
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { convertTrackToCurrentTrack } from '@/utils/trackHelpers';

function MyComponent() {
  const { playTrack, isPlaying, currentTrack, pause, resume } = useMusicPlayerContext();

  const handlePlay = (spotifyTrack: SpotifyTrack) => {
    const currentTrack = convertTrackToCurrentTrack(spotifyTrack);
    playTrack(currentTrack);
  };

  return (
    <button onClick={handlePlay}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}
```

### TrackTable Integration

The `TrackTable` component automatically handles playback:

```typescript
<TrackTable 
  tracks={playlistTracks} 
  onTrackClick={(track) => {
    // Track is already playing via context
    console.log('Playing:', track.name);
  }}
/>
```

## Web Playback SDK (Premium)

### Setup Requirements

1. **Re-authenticate** - Log out and back in to grant `streaming` scope
2. **Premium Account** - Required for full playback
3. **SDK Loaded** - Automatically loaded in `src/app/layout.tsx`

### How It Works

1. SDK script loads from `https://sdk.scdn.co/spotify-player.js`
2. Player initializes with access token from `/api/auth/token`
3. Player connects and receives device ID
4. Tracks play via Spotify URI format: `spotify:track:TRACK_ID`
5. Falls back to preview URLs if SDK unavailable

### Features

- ✅ Full song playback (not just previews)
- ✅ Seek to any position in track
- ✅ Volume control (0-100)
- ✅ Next/Previous track navigation
- ✅ Syncs with Spotify app on other devices
- ✅ Better audio quality

### Implementation Details

```typescript
// Player initialization
const player = new window.Spotify.Player({
  name: 'Spotify Fanmade Web Player',
  getOAuthToken: (cb) => cb(accessToken),
});

// Play track
await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${accessToken}` },
  body: JSON.stringify({ uris: [trackUri] }),
});
```

## Preview URLs (Fallback)

### How It Works

- Spotify API provides `preview_url` field for most tracks
- 30-second MP3 preview clips
- No Premium account required
- Works immediately with any Spotify account

### Limitations

- Only 30 seconds of audio per track
- Not all tracks have preview URLs (especially older/obscure tracks)
- Cannot play full songs

### Implementation

```typescript
const audio = new Audio(track.previewUrl);
audio.play();
```

## Player State Management

### Available State

```typescript
const {
  currentTrack,      // Currently playing track
  isPlaying,         // Playback state
  currentTime,       // Current position (ms)
  volume,            // Volume (0-100)
  duration,          // Track duration (ms)
  queue,             // Current queue
  playTrack,         // Play a track
  pause,             // Pause playback
  resume,            // Resume playback
  togglePlayPause,  // Toggle play/pause
  seek,              // Seek to time (ms)
  setVolume,         // Set volume (0-100)
  next,              // Next track
  previous,          // Previous track
  setQueue,          // Set queue
} = useMusicPlayerContext();
```

## Troubleshooting

### "Player not ready" or "Device ID not found"

**Causes:**
- Haven't re-authenticated with new `streaming` scope
- Web Playback SDK hasn't loaded yet
- Browser doesn't support Web Playback SDK

**Solutions:**
1. Log out and log back in to grant streaming scope
2. Check browser console for errors
3. Wait a few seconds for SDK to initialize
4. Refresh the page

### "No preview URL available"

**Causes:**
- Track doesn't have a preview URL
- Track is very old or obscure

**Solutions:**
- Try Web Playback SDK (if Premium)
- Try a different track
- Check if track has `preview_url` in API response

### No sound / Player connects but silent

**Causes:**
- Volume is muted
- Browser audio permissions
- Spotify account issue

**Solutions:**
1. Check volume slider in player
2. Check browser audio settings
3. Verify Premium account is active (for Web Playback SDK)
4. Try playing in Spotify app to verify account

## Additional Features

### Shuffle
- Toggle shuffle on/off to randomize queue order
- Works for both Premium and non-Premium users
- See [SHUFFLE_FEATURE.md](./SHUFFLE_FEATURE.md) for details

### Repeat
- Toggle between 'off' and 'one' (repeat current track)
- Integrated with queue navigation
- See `src/hooks/useRepeat.ts` for implementation

## Integration Points

The player is integrated in:

- `src/components/AppLayout/AppLayout.tsx` - Wraps app with `MusicPlayerProvider` and renders player at bottom
- `src/components/TrackTable/TrackTable.tsx` - Automatically plays tracks when clicked
- `src/app/playlist/[id]/page.tsx` - Playlist page with track playback
- `src/app/search/page.tsx` - Search results with track playback
