# 🔀 Shuffle Feature

## Overview

The shuffle feature allows users to randomize the playback order of tracks in a queue. The implementation supports both Premium (Web Playback SDK) and non-Premium (preview URLs) users with different strategies.

## Architecture

```
useMusicPlayer (Orchestrator)
├── Premium Users: Spotify Web Playback SDK API
└── Non-Premium Users: Local Queue Shuffle (useQueue)
```

## Key Components

- **`src/hooks/useQueue.ts`** - Local queue shuffle management
- **`src/hooks/useMusicPlayer.ts`** - Shuffle toggle orchestration
- **`src/hooks/useSpotifyWebPlayback.ts`** - Spotify API integration

## How It Works

### Premium Users (Web Playback SDK)

- **Playback Control**: Spotify controls the actual playback order via their API
- **UI Sync**: Local queue is shuffled/restored to keep UI in sync
- **State Management**: Uses Spotify's shuffle state as source of truth
- **API**: Calls `PUT /v1/me/player/shuffle` to toggle shuffle on Spotify

### Non-Premium Users (Preview URLs)

- **Playback Control**: We control playback, so we shuffle the actual queue
- **State Management**: Local queue state (`isShuffled` flag)
- **Restoration**: Original queue order is preserved and restored when shuffle is turned off

## User Experience

### Shuffle On
- Queue order is randomized
- Current track stays in place (doesn't interrupt playback)
- Shuffle icon turns brand color (green)
- Next/previous buttons follow shuffled order

### Shuffle Off
- Queue restores to original order
- Current track position is preserved in original queue
- Shuffle icon returns to white
- Next/previous buttons follow original order

## State Synchronization

### Premium Users
- **Challenge**: Spotify's `player_state_changed` events can fire with stale data
- **Solution**: Optimistic updates with race condition protection
- **Mechanism**: Pending state tracking prevents stale events from overwriting updates

### Non-Premium Users
- **Simple**: Direct state management via `useQueue` hook
- **Restoration**: Clearing `shuffledIndices` automatically restores `originalQueue`

## UI Integration

Shuffle can be toggled from:
- **Playlist Header**: Shuffle icon in playlist banner
- **Audio Player**: Shuffle icon in bottom player bar

Both locations stay in sync via `useMusicPlayerContext()`.

## Technical Details

### Queue Restoration Logic

```typescript
// When shuffle is turned off:
1. Find current track's position in originalQueue
2. Clear shuffledIndices (sets to null)
3. Update currentIndex to match original position
4. Queue automatically returns to originalQueue (via useMemo)
```

### Race Condition Protection

For Premium users, we use a pending state mechanism:
- Set pending state when API call is made
- Ignore `player_state_changed` events that don't match pending state
- Clear pending state after timeout or matching event

## Files

- `src/hooks/useQueue.ts` - Queue and shuffle state management
- `src/hooks/useMusicPlayer.ts` - Shuffle toggle orchestration
- `src/hooks/useSpotifyWebPlayback.ts` - Spotify shuffle API integration
- `src/components/PlaylistHeader/PlaylistHeader.tsx` - Header shuffle button
- `src/components/MusicPlayer/MusicPlayer.tsx` - Audio player shuffle button


