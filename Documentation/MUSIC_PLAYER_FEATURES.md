# Music Player Features

## Overview

The music player supports shuffle, repeat, and queue navigation features with seamless integration between Premium (Web Playback SDK) and non-Premium (preview URLs) users.

## Architecture

```
useMusicPlayer (Main Orchestrator)
├── useQueue (Queue & Shuffle Management)
├── useRepeat (Repeat Mode Logic)
├── useSpotifyWebPlayback (Spotify Web Playback SDK)
└── useAccessToken (Authentication)
```

## Features

### Shuffle
- Randomize queue order while keeping current track in place
- Works for both Premium and non-Premium users
- UI stays in sync between playlist header and audio player
- See [SHUFFLE_FEATURE.md](./SHUFFLE_FEATURE.md) for detailed documentation

### Repeat
- Toggle between 'off' and 'one' (repeat current track)
- Integrated with queue navigation
- Supports both Web Playback SDK and preview URLs

### Queue Navigation
- Next/Previous track navigation
- Respects shuffle and repeat modes
- Handles edge cases (first/last track, empty queue)

## Key Design Decisions

1. **Current Track Preservation**: When shuffling, the current track stays in place to avoid interrupting playback
2. **Queue State Management**: Original queue is saved when shuffle is enabled, automatically restored when disabled
3. **Dual Playback Support**: Seamless experience for both Premium and non-Premium users
4. **State Synchronization**: Race condition protection for Premium users to keep UI in sync

## Files

- `src/hooks/useMusicPlayer.ts` - Main orchestrator
- `src/hooks/useQueue.ts` - Queue and shuffle management
- `src/hooks/useRepeat.ts` - Repeat mode logic
- `src/hooks/useSpotifyWebPlayback.ts` - Spotify Web Playback SDK integration
- `src/components/MusicPlayer/MusicPlayer.tsx` - Audio player UI
- `src/components/PlaylistHeader/PlaylistHeader.tsx` - Playlist header with shuffle button

## Related Documentation

- [AUDIO_PLAYER.md](./AUDIO_PLAYER.md) - Audio player implementation details
- [SHUFFLE_FEATURE.md](./SHUFFLE_FEATURE.md) - Shuffle feature documentation


