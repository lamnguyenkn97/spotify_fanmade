import { useEffect, useRef, useState, useCallback } from 'react';

// Type definitions for Spotify Web Playback SDK
declare global {
  interface Window {
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
}

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (state: any) => void) => void;
  removeListener: (event: string, callback?: (state: any) => void) => void;
  getCurrentState: () => Promise<SpotifyPlaybackState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

interface SpotifyPlaybackState {
  context: {
    uri: string | null;
    metadata: any;
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyTrack;
    next_tracks: SpotifyTrack[];
    previous_tracks: SpotifyTrack[];
  };
}

interface SpotifyTrack {
  album: {
    images: Array<{ url: string }>;
    name: string;
  };
  artists: Array<{ name: string }>;
  duration_ms: number;
  id: string;
  name: string;
  uri: string;
}

interface UseSpotifyWebPlaybackReturn {
  player: SpotifyPlayer | null;
  isReady: boolean;
  deviceId: string | null;
  isPlaying: boolean;
  currentTrack: SpotifyTrack | null;
  position: number;
  duration: number;
  shuffle: boolean;
  repeatMode: number; // 0 = off, 1 = context, 2 = track
  playTrack: (uri: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  setShuffle: (state: boolean) => Promise<void>;
  setRepeatMode: (state: 'off' | 'context' | 'track') => Promise<void>;
}

export const useSpotifyWebPlayback = (
  accessToken: string | null
): UseSpotifyWebPlaybackReturn => {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffleState] = useState(false);
  const [repeatMode, setRepeatModeState] = useState<number>(0); // 0 = off, 1 = context, 2 = track
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Track pending shuffle state to prevent race conditions with player_state_changed events
  const pendingShuffleStateRef = useRef<boolean | null>(null);
  const shuffleUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Note: Script is loaded in layout.tsx, so we don't need to load it here
  // Just ensure the callback is set if it wasn't already set
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {};
    }
  }, []);

  // Initialize player when SDK is ready and we have an access token
  useEffect(() => {
    if (!accessToken || !window.Spotify || playerRef.current) {
      return;
    }

    const newPlayer = new window.Spotify.Player({
      name: 'Spotify Fanmade Web Player',
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
      volume: 1.0,
    });

    // Error handling
    newPlayer.addListener('initialization_error', ({ message }: { message: string }) => {

    });

    newPlayer.addListener('authentication_error', ({ message }: { message: string }) => {

    });

    newPlayer.addListener('account_error', ({ message }: { message: string }) => {

    });

    newPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
      setDeviceId(device_id);
      setIsReady(true);
    });

    newPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      setIsReady(false);
    });

    // Playback state updates
    newPlayer.addListener('player_state_changed', (state: SpotifyPlaybackState | null) => {
      if (!state) {
        return;
      }

      setIsPlaying(!state.paused);
      setPosition(state.position);
      setCurrentTrack(state.track_window.current_track);
      setDuration(state.track_window.current_track.duration_ms);
      
      // Handle shuffle state updates with race condition protection
      if (pendingShuffleStateRef.current === null) {
        // No pending update, accept the event state
        setShuffleState(state.shuffle);
      } else {
        // We have a pending update - check if event matches
        if (state.shuffle === pendingShuffleStateRef.current) {
          // Event matches our pending state - this is the confirmation we were waiting for
          pendingShuffleStateRef.current = null;
          if (shuffleUpdateTimeoutRef.current) {
            clearTimeout(shuffleUpdateTimeoutRef.current);
            shuffleUpdateTimeoutRef.current = null;
          }
          setShuffleState(state.shuffle);
        } else {
          // Event doesn't match - this is likely a stale event from before our update
          // Keep our optimistic state, but don't update from the stale event
          // The pending flag will clear after timeout, and fresh events will be accepted
        }
      }
      
      setRepeatModeState(state.repeat_mode);
    });

    newPlayer.connect().then((success) => {
      if (success) {
        setPlayer(newPlayer);
        playerRef.current = newPlayer;
      } else {

      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [accessToken]);

  // Update position periodically
  useEffect(() => {
    if (!isPlaying || !player) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(async () => {
      try {
        const state = await player.getCurrentState();
        if (state) {
          setPosition(state.position);
        }
      } catch (error) {

      }
    }, 1000); // Update every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, player]);

  // Play track by URI
  const playTrack = useCallback(
    async (uri: string) => {
      if (!accessToken || !deviceId || !player) {
        throw new Error('Player not ready');
      }

      try {
        // Use the Spotify Web API to start playback on this device
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [uri],
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to play: ${response.status}`);
        }
      } catch (error) {

        throw error;
      }
    },
    [accessToken, deviceId, player]
  );

  // Pause playback
  const pause = useCallback(async () => {
    if (!player) return;
    try {
      await player.pause();
    } catch (error) {

    }
  }, [player]);

  // Resume playback
  const resume = useCallback(async () => {
    if (!player) return;
    try {
      await player.resume();
    } catch (error) {

    }
  }, [player]);

  // Seek to position
  const seek = useCallback(
    async (positionMs: number) => {
      if (!player) return;
      try {
        await player.seek(positionMs);
        setPosition(positionMs);
      } catch (error) {

      }
    },
    [player]
  );

  // Set volume
  const setVolume = useCallback(
    async (volume: number) => {
      if (!player) return;
      try {
        const clampedVolume = Math.max(0, Math.min(1, volume / 100)); // Convert 0-100 to 0-1
        await player.setVolume(clampedVolume);
      } catch (error) {

      }
    },
    [player]
  );

  // Next track
  const nextTrack = useCallback(async () => {
    if (!player) return;
    try {
      await player.nextTrack();
    } catch (error) {

    }
  }, [player]);

  // Previous track
  const previousTrack = useCallback(async () => {
    if (!player) return;
    try {
      await player.previousTrack();
    } catch (error) {

    }
  }, [player]);

  // Set shuffle state via Spotify API
  const setShuffle = useCallback(
    async (state: boolean) => {
      if (!accessToken || !deviceId) {

        return;
      }

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/shuffle?state=${state}&device_id=${deviceId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();

          throw new Error('Failed to set shuffle');
        }
        
        // Set pending state to prevent race conditions with player_state_changed events
        // This ensures we don't accept stale events that fire before Spotify processes our request
        pendingShuffleStateRef.current = state;
        setShuffleState(state);
        
        // Clear pending state after 3 seconds - by then, Spotify should have processed our request
        // and sent a fresh player_state_changed event
        if (shuffleUpdateTimeoutRef.current) {
          clearTimeout(shuffleUpdateTimeoutRef.current);
        }
        shuffleUpdateTimeoutRef.current = setTimeout(() => {
          // After timeout, clear pending flag to allow normal event processing
          // If we haven't received a matching event by now, our optimistic update stands
          pendingShuffleStateRef.current = null;
          shuffleUpdateTimeoutRef.current = null;
        }, 3000);
      } catch (error) {

      }
    },
    [accessToken, deviceId]
  );

  // Set repeat mode via Spotify API
  const setRepeatMode = useCallback(
    async (state: 'off' | 'context' | 'track') => {
      if (!accessToken || !deviceId) {

        return;
      }

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${deviceId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();

          throw new Error('Failed to set repeat mode');
        }
        // Map state to number: 'off' = 0, 'context' = 1, 'track' = 2
        const repeatModeNum = state === 'off' ? 0 : state === 'context' ? 1 : 2;
        setRepeatModeState(repeatModeNum);
      } catch (error) {

      }
    },
    [accessToken, deviceId]
  );

  return {
    player,
    isReady,
    deviceId,
    isPlaying,
    currentTrack,
    position,
    duration,
    shuffle,
    repeatMode,
    playTrack,
    pause,
    resume,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    setShuffle,
    setRepeatMode,
  };
};

