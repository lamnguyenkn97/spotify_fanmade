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
  playTrack: (uri: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
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
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Note: Script is loaded in layout.tsx, so we don't need to load it here
  // Just ensure the callback is set if it wasn't already set
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Only set callback if it doesn't exist (it should be set in layout.tsx)
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('Spotify Web Playback SDK ready (from hook)');
      };
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
      console.error('Failed to initialize Spotify player:', message);
    });

    newPlayer.addListener('authentication_error', ({ message }: { message: string }) => {
      console.error('Failed to authenticate with Spotify:', message);
    });

    newPlayer.addListener('account_error', ({ message }: { message: string }) => {
      console.error('Account error:', message);
    });

    // Ready event - player is ready
    newPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Spotify player is ready with device ID:', device_id);
      setDeviceId(device_id);
      setIsReady(true);
    });

    // Not ready event
    newPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Spotify player is not ready:', device_id);
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
    });

    // Connect to player
    newPlayer.connect().then((success) => {
      if (success) {
        console.log('Successfully connected to Spotify player');
        setPlayer(newPlayer);
        playerRef.current = newPlayer;
      } else {
        console.error('Failed to connect to Spotify player');
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
        console.error('Error getting playback state:', error);
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
      if (!accessToken || !deviceId) {
        console.error('Cannot play track: missing access token or device ID');
        return;
      }

      try {
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
          const error = await response.json();
          console.error('Error playing track:', error);
          throw new Error('Failed to play track');
        }
      } catch (error) {
        console.error('Error in playTrack:', error);
      }
    },
    [accessToken, deviceId]
  );

  // Pause playback
  const pause = useCallback(async () => {
    if (!player) return;
    try {
      await player.pause();
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }, [player]);

  // Resume playback
  const resume = useCallback(async () => {
    if (!player) return;
    try {
      await player.resume();
    } catch (error) {
      console.error('Error resuming:', error);
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
        console.error('Error seeking:', error);
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
        console.error('Error setting volume:', error);
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
      console.error('Error going to next track:', error);
    }
  }, [player]);

  // Previous track
  const previousTrack = useCallback(async () => {
    if (!player) return;
    try {
      await player.previousTrack();
    } catch (error) {
      console.error('Error going to previous track:', error);
    }
  }, [player]);

  return {
    player,
    isReady,
    deviceId,
    isPlaying,
    currentTrack,
    position,
    duration,
    playTrack,
    pause,
    resume,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
  };
};

