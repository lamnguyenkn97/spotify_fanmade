# Strategy Pattern Implementation

## Overview

The Spotify Fanmade app uses the **Strategy Pattern** to abstract playback logic between different playback methods. This allows the music player to seamlessly switch between Web Playback SDK (Premium users) and Preview URLs (all users) without conditional logic scattered throughout the codebase.

## What is the Strategy Pattern?

The Strategy Pattern is a **behavioral design pattern** that:
- Defines a family of algorithms (strategies)
- Encapsulates each one in a separate class/object
- Makes them interchangeable at runtime
- Allows the algorithm to vary independently from clients that use it

## Our Implementation

### File Structure

```
src/hooks/
├── useMusicPlayer.ts           # Main music player hook (uses strategy)
├── usePlaybackStrategy.ts      # Strategy selector and implementation
├── useSpotifyWebPlayback.ts    # Web Playback SDK integration
├── useQueue.ts                 # Queue management
└── useRepeat.ts                # Repeat mode management
```

## Architecture

```
┌─────────────────────────────────────┐
│       useMusicPlayer (Client)        │
│  - State management (useState)       │
│  - Lifecycle (useEffect)             │
│  - Event listeners                   │
│  - Queue management                  │
│  - Calls strategy methods            │
└─────────────────┬───────────────────┘
                  │
                  │ strategy.play()
                  │ strategy.pause()
                  │ strategy.resume()
                  │ strategy.seek()
                  │ etc.
                  ▼
┌─────────────────────────────────────┐
│    usePlaybackStrategy (Selector)    │
│  - Chooses appropriate strategy      │
│  - Handles fallback logic            │
│  - No side effects                   │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────────┐ ┌──────────────────┐
│ Web Playback SDK │ │  Preview URLs    │
│    (Strategy 1)  │ │   (Strategy 2)   │
│ - Full playback  │ │ - 30s previews   │
│ - Premium users  │ │ - All users      │
└──────────────────┘ └──────────────────┘
```

## Strategy Interface

All strategies implement the same interface:

```typescript
interface PlaybackStrategy {
  // Check if strategy can play this track
  canPlay: (track: CurrentTrack) => boolean;
  
  // Playback control methods
  play: (track: CurrentTrack) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  
  // Strategy state
  isReady: boolean;
  isActive: boolean;
}
```

## Two Strategies

### Strategy 1: Web Playback SDK (Premium)

**Purpose**: Full track playback for Spotify Premium users

**Features**:
- ✅ Full-length tracks
- ✅ Skip forward/backward
- ✅ Shuffle and repeat
- ✅ Volume control
- ✅ Integrates with Spotify ecosystem

**Implementation**: `createWebPlaybackStrategy()`

**Requirements**:
- Spotify Premium account
- Valid access token with `streaming` scope
- Web Playback SDK initialized and ready

**Use Case**:
```typescript
if (webPlayback.isReady && track.spotifyUri) {
  await webPlaybackStrategy.play(track);
}
```

### Strategy 2: Preview URLs (Fallback)

**Purpose**: 30-second preview playback for all users

**Features**:
- ✅ 30-second track previews
- ✅ Works without Premium
- ✅ Basic controls (play/pause/seek)
- ✅ Volume control
- ❌ No skip forward/backward (throws error)

**Implementation**: `createPreviewStrategy()`

**Requirements**:
- Track must have `preview_url` from Spotify API
- HTML5 Audio element

**Use Case**:
```typescript
if (track.previewUrl && audioRef.current) {
  await previewStrategy.play(track);
}
```

## How It Works

### 1. Strategy Selection

The `usePlaybackStrategy` hook automatically selects the appropriate strategy:

```typescript
const strategy = useMemo(() => {
  // Primary: Web Playback SDK if ready
  const primaryStrategy = webPlayback.isReady 
    ? webPlaybackStrategy 
    : previewStrategy;
    
  // Fallback: Always preview strategy
  const fallbackStrategy = previewStrategy;
  
  // Return strategy with automatic fallback
  return {
    ...primaryStrategy,
    play: async (track) => {
      // Try primary strategy
      if (primaryStrategy.canPlay(track)) {
        try {
          await primaryStrategy.play(track);
          return;
        } catch (error) {
          console.error('Primary strategy failed');
        }
      }
      
      // Fallback to preview
      if (fallbackStrategy.canPlay(track)) {
        await fallbackStrategy.play(track);
      }
    }
  };
}, [webPlayback.isReady]);
```

### 2. Usage in useMusicPlayer

The music player uses the strategy without knowing implementation details:

```typescript
// Before (Scattered conditionals) ❌
const playTrack = async (track) => {
  if (webPlayback.isReady && track.spotifyUri) {
    await webPlayback.playTrack(track.spotifyUri);
  } else if (track.previewUrl && audioRef.current) {
    audioRef.current.src = track.previewUrl;
    await audioRef.current.play();
  }
};

// After (Clean abstraction) ✅
const playTrack = async (track) => {
  await strategy.play(track);
};
```

### 3. Automatic Fallback

The strategy handles fallback logic internally:

1. **Try Web Playback SDK** (if ready and track has Spotify URI)
2. **If fails** → Automatically try Preview URL
3. **If no preview** → Throw error

This ensures maximum compatibility across user types and track availability.

## Key Benefits

### 1. **Clean Code**
- No scattered `if/else` conditionals
- Single method call: `strategy.play(track)`
- Easy to read and maintain

### 2. **Extensible**
Adding a new playback method (e.g., Spotify Connect):

```typescript
// 1. Create new strategy
const createSpotifyConnectStrategy = (...) => ({
  canPlay: (track) => hasActiveDevice && track.spotifyUri,
  play: async (track) => { /* Spotify Connect logic */ },
  // ... other methods
});

// 2. Add to strategy selector
const strategy = useMemo(() => {
  if (spotifyConnect.isActive) return spotifyConnectStrategy;
  if (webPlayback.isReady) return webPlaybackStrategy;
  return previewStrategy;
}, [spotifyConnect.isActive, webPlayback.isReady]);

// 3. No changes needed in useMusicPlayer! ✅
```

### 3. **Testable**
Each strategy can be tested independently:

```typescript
// Test Web Playback SDK strategy
const mockWebPlayback = { playTrack: jest.fn() };
const strategy = createWebPlaybackStrategy(mockWebPlayback, true);
await strategy.play(mockTrack);
expect(mockWebPlayback.playTrack).toHaveBeenCalledWith(mockTrack.spotifyUri);

// Test Preview URL strategy
const mockAudioRef = { current: new Audio() };
const strategy = createPreviewStrategy(mockAudioRef, jest.fn(), jest.fn());
await strategy.play(mockTrack);
expect(mockAudioRef.current.src).toBe(mockTrack.previewUrl);
```

### 4. **Single Responsibility**
- **Strategy**: How to play (algorithm)
- **Component**: When to play (orchestration)
- Clear separation of concerns

## Important Design Decisions

### ✅ DO: Keep Strategies Pure

Strategies contain **pure logic only**:
- No `useState`, `useEffect`, or React hooks
- No DOM manipulation
- No event listeners
- Just algorithms and methods

### ✅ DO: Keep React Lifecycle in Component

The component (`useMusicPlayer`) handles:
- State management
- React lifecycle (`useEffect`)
- Event listeners
- Calling strategy methods at appropriate times

### ❌ DON'T: Move useEffects to Strategy

```typescript
// ❌ BAD - Strategy with React hooks
const createStrategy = () => {
  useEffect(() => {
    // This violates Strategy Pattern!
  }, []);
};

// ✅ GOOD - Component handles lifecycle
const useMusicPlayer = () => {
  useEffect(() => {
    // Component decides WHEN to use strategy
    strategy.play(track);
  }, [track]);
};
```

### ✅ DO: Share SDK Instance

```typescript
// ✅ GOOD - Single instance
const webPlayback = useSpotifyWebPlayback(accessToken);
const strategy = usePlaybackStrategy(audioRef, ..., webPlayback);

// ❌ BAD - Duplicate instances (causes conflicts)
const webPlayback1 = useSpotifyWebPlayback(accessToken);
// Inside strategy:
const webPlayback2 = useSpotifyWebPlayback(accessToken); // Conflict!
```

## Common Pitfalls & Solutions

### Issue 1: Duplicate Web Playback SDK Instances

**Problem**: Creating multiple instances of Web Playback SDK causes device conflicts

**Solution**: Pass the SDK instance to the strategy instead of creating a new one

```typescript
// ❌ BAD
export const usePlaybackStrategy = (audioRef, ...) => {
  const webPlayback = useSpotifyWebPlayback(accessToken); // Duplicate!
};

// ✅ GOOD
export const usePlaybackStrategy = (audioRef, ..., webPlayback) => {
  // Use passed instance
};
```

### Issue 2: Bypassing Strategy for Fallback

**Problem**: Handling fallback outside the strategy breaks encapsulation

**Solution**: Build fallback logic into the strategy

```typescript
// ❌ BAD - Fallback outside strategy
const playTrack = async (track) => {
  try {
    await strategy.play(track);
  } catch (error) {
    // Manual fallback
    audioRef.current.src = track.previewUrl;
  }
};

// ✅ GOOD - Fallback inside strategy
const strategy = {
  play: async (track) => {
    try {
      await primaryStrategy.play(track);
    } catch (error) {
      await fallbackStrategy.play(track);
    }
  }
};
```

### Issue 3: Inconsistent Usage

**Problem**: Using strategy for some methods but not others

**Solution**: Use strategy for ALL playback methods consistently

```typescript
// ❌ BAD - Inconsistent
await webPlayback.playTrack(uri);  // Direct call
await strategy.pause();            // Strategy call

// ✅ GOOD - Consistent
await strategy.play(track);   // Strategy call
await strategy.pause();       // Strategy call
```

## Real-World Example

### User Scenario 1: Premium User

```
User clicks play on "Song A"
  ↓
useMusicPlayer calls strategy.play(track)
  ↓
Strategy checks: webPlayback.isReady = true ✅
  ↓
Uses Web Playback SDK strategy
  ↓
Plays full track via Spotify SDK ✅
```

### User Scenario 2: Non-Premium User

```
User clicks play on "Song B"
  ↓
useMusicPlayer calls strategy.play(track)
  ↓
Strategy checks: webPlayback.isReady = false ❌
  ↓
Uses Preview URL strategy
  ↓
Plays 30-second preview via HTML5 Audio ✅
```

### User Scenario 3: Premium with Device Not Ready

```
User clicks play on "Song C"
  ↓
useMusicPlayer calls strategy.play(track)
  ↓
Strategy tries: Web Playback SDK
  ↓
Web Playback SDK fails (404 error) ❌
  ↓
Strategy automatically tries: Preview URL
  ↓
Plays 30-second preview as fallback ✅
```

## Conclusion

The Strategy Pattern provides:
- ✅ Clean, maintainable code
- ✅ Easy to extend with new playback methods
- ✅ Automatic fallback handling
- ✅ Testable components
- ✅ Clear separation of concerns

This is a **textbook implementation** of the Strategy Pattern that makes the music player flexible, reliable, and easy to maintain.

## Related Documentation

- [AUDIO_PLAYER.md](./AUDIO_PLAYER.md) - Audio player implementation details
- [MUSIC_PLAYER_FEATURES.md](./MUSIC_PLAYER_FEATURES.md) - Music player features
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall application architecture

