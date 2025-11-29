import { useState, useRef, useEffect, useCallback } from 'react';
import { useSpotifyWebPlayback } from './useSpotifyWebPlayback';
import { useAccessToken } from './useAccessToken';
import { useQueue } from './useQueue';
import { useRepeat, RepeatMode } from './useRepeat';
import { usePlaybackStrategy } from './usePlaybackStrategy';

export interface CurrentTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl?: string | null;
  duration: number; // in milliseconds
  spotifyUri?: string; // For Web Playback SDK
}

// Re-export RepeatMode for backward compatibility
export type { RepeatMode };

export interface UseMusicPlayerReturn {
  currentTrack: CurrentTrack | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  duration: number;
  playTrack: (track: CurrentTrack) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  queue: CurrentTrack[];
  setQueue: (tracks: CurrentTrack[]) => void;
  addToQueue: (track: CurrentTrack) => void;
  removeFromQueue: (index: number) => void;
  audioElement: HTMLAudioElement | null;
  useWebPlayback: boolean;
  isShuffled: boolean;
  toggleShuffle: () => Promise<void>;
  repeatMode: RepeatMode;
  toggleRepeat: () => Promise<void>;
}

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(100);
  const [useWebPlayback, setUseWebPlayback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use queue management hook
  const {
    queue,
    currentIndex,
    isShuffled: localIsShuffled,
    setQueue,
    toggleShuffle: localToggleShuffle,
    getNextIndex,
    getPreviousIndex,
    setCurrentIndex,
  } = useQueue(currentTrack);

  // Use repeat management hook
  const { repeatMode: localRepeatMode, toggleRepeat: localToggleRepeat } = useRepeat();

  // Get access token for Web Playback SDK
  const accessToken = useAccessToken();

  // Initialize Web Playback SDK (only once!)
  const webPlayback = useSpotifyWebPlayback(accessToken);

  // Initialize playback strategy (pass the webPlayback instance to avoid creating duplicate)
  const strategy = usePlaybackStrategy(audioRef, setIsPlaying, setCurrentTime, webPlayback);

  // Helper: Get current repeat mode (abstracts Web Playback SDK vs local)
  const getCurrentRepeatMode = useCallback((): RepeatMode => {
    if (strategy.isActive) {
      return webPlayback.repeatMode === 0 ? 'off' : 'one';
    }
    return localRepeatMode;
  }, [strategy.isActive, webPlayback.repeatMode, localRepeatMode]);

  // Use Spotify's shuffle/repeat state when Web Playback SDK is active and ready
  // Otherwise, use local state for preview URLs
  // Spotify repeat modes: 0 = off, 1 = context (all), 2 = track (one)
  // We only support 'off' and 'one' modes now
  const isShuffled = strategy.isActive ? webPlayback.shuffle : localIsShuffled;
  const repeatMode: RepeatMode = strategy.isActive
    ? webPlayback.repeatMode === 0
      ? 'off'
      : 'one' // Map 0 to 'off', 1 or 2 to 'one'
    : localRepeatMode;

  // Store original queue before repeat one mode
  const queueBeforeRepeatOne = useRef<CurrentTrack[]>([]);
  const previousRepeatMode = useRef<RepeatMode>('off');

  // Apply repeat one mode: set queue to [currentTrack] when enabled
  // Only for preview URLs (not Web Playback SDK, which handles repeat natively)
  useEffect(() => {
    // Skip if using Web Playback SDK (Spotify handles repeat natively)
    if (strategy.isActive) {
      return;
    }

    // Use localRepeatMode for preview URLs
    // Only act when repeat mode actually changes
    if (previousRepeatMode.current === localRepeatMode) {
      return;
    }
    previousRepeatMode.current = localRepeatMode;

    if (localRepeatMode === 'one' && currentTrack) {
      // Save current queue before setting to [currentTrack] (only if not already saved and queue has more than 1 track)
      if (queueBeforeRepeatOne.current.length === 0 && queue.length > 1) {
        queueBeforeRepeatOne.current = [...queue];
      }
      // Set queue to just the current track
      setQueue([currentTrack]);
      setCurrentIndex(0);
    } else if (localRepeatMode !== 'one' && queueBeforeRepeatOne.current.length > 0) {
      // Restore original queue when repeat one is turned off
      setQueue(queueBeforeRepeatOne.current);
      // Find current track in restored queue
      const restoredIndex = queueBeforeRepeatOne.current.findIndex(
        (t) => t.id === currentTrack?.id
      );
      if (restoredIndex >= 0) {
        setCurrentIndex(restoredIndex);
      }
      queueBeforeRepeatOne.current = [];
    }
  }, [localRepeatMode, currentTrack, queue, setQueue, setCurrentIndex, strategy.isActive]);

  const playTrack = useCallback(
    async (track: CurrentTrack) => {
      setCurrentTrack(track);
      setCurrentTime(0);

      try {
        await strategy.play(track);
      } catch (error) {
        console.error('Error playing track:', error);
        setIsPlaying(false);
      }
    },
    [strategy]
  );

  useEffect(() => {
    if (webPlayback.isReady && accessToken) {
      setUseWebPlayback(true);
      if (webPlayback.currentTrack) {
        setIsPlaying(webPlayback.isPlaying);
        setCurrentTime(webPlayback.position);
        const track: CurrentTrack = {
          id: webPlayback.currentTrack.id,
          title: webPlayback.currentTrack.name,
          artist: webPlayback.currentTrack.artists.map((a) => a.name).join(', '),
          album: webPlayback.currentTrack.album.name,
          coverUrl: webPlayback.currentTrack.album.images[0]?.url || '',
          duration: webPlayback.currentTrack.duration_ms,
          spotifyUri: webPlayback.currentTrack.uri,
        };
        setCurrentTrack(track);
      }
    } else {
      setUseWebPlayback(false);
    }
  }, [webPlayback.isReady, webPlayback.isPlaying, webPlayback.position, webPlayback.currentTrack, accessToken]);

  // Initialize audio element (only once on mount)
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount/unmount

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime * 1000);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);

      if (!strategy.isActive) {
        if (localRepeatMode === 'one' && currentTrack) {
          playTrack(currentTrack);
          return;
        }

        const nextIndex = getNextIndex();
        if (nextIndex !== null) {
          setCurrentIndex(nextIndex);
          playTrack(queue[nextIndex]);
        }
      }
    };

    const handleError = () => {
      console.error('Error playing audio');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [strategy.isActive, currentIndex, queue, playTrack, localRepeatMode, getNextIndex, setCurrentIndex, currentTrack]);

  const pause = useCallback(async () => {
    try {
      await strategy.pause();
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }, [strategy]);

  const resume = useCallback(async () => {
    try {
      await strategy.resume();
    } catch (error) {
      console.error('Error resuming:', error);
      setIsPlaying(false);
    }
  }, [strategy]);

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
  }, [isPlaying, pause, resume]);

  const seek = useCallback(
    async (time: number) => {
      try {
        await strategy.seek(time);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    },
    [strategy]
  );

  const setVolume = useCallback(
    async (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(100, newVolume));
      setVolumeState(clampedVolume);

      try {
        await strategy.setVolume(clampedVolume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    },
    [strategy]
  );

  const next = useCallback(async () => {
    const currentRepeatMode = getCurrentRepeatMode();

    if (currentRepeatMode === 'one' && currentTrack) {
      await playTrack(currentTrack);
      return;
    }

    const nextIndex = getNextIndex();

    if (nextIndex !== null) {
      setCurrentIndex(nextIndex);
      await playTrack(queue[nextIndex]);
    } else if (strategy.isActive) {
      try {
        await strategy.nextTrack();
      } catch (error) {
        console.error('Error going to next track:', error);
      }
    }
  }, [strategy, queue, playTrack, getCurrentRepeatMode, getNextIndex, setCurrentIndex, currentTrack]);

  const previous = useCallback(async () => {
    const prevIndex = getPreviousIndex();

    if (prevIndex !== null) {
      setCurrentIndex(prevIndex);
      await playTrack(queue[prevIndex]);
    } else if (currentIndex === 0) {
      await seek(0);
    } else if (strategy.isActive) {
      try {
        await strategy.previousTrack();
      } catch (error) {
        console.error('Error going to previous track:', error);
      }
    }
  }, [strategy, currentIndex, queue, playTrack, seek, getPreviousIndex, setCurrentIndex]);

  useEffect(() => {
    if (!strategy.isActive) return;

    setIsPlaying(webPlayback.isPlaying);

    const interval = setInterval(() => {
      if (strategy.isActive) {
        setCurrentTime(webPlayback.position);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [strategy.isActive, webPlayback.isPlaying, webPlayback.position]);

  const toggleShuffle = useCallback(async () => {
    if (strategy.isActive) {
      const newShuffleState = !webPlayback.shuffle;
      await webPlayback.setShuffle(newShuffleState);
      localToggleShuffle();
    } else {
      localToggleShuffle();
    }
  }, [strategy.isActive, webPlayback, localToggleShuffle]);

  const toggleRepeat = useCallback(async () => {
    if (strategy.isActive) {
      const currentSpotifyRepeat = webPlayback.repeatMode;
      const nextState: 'off' | 'track' = currentSpotifyRepeat === 0 ? 'track' : 'off';
      await webPlayback.setRepeatMode(nextState);
    } else {
      localToggleRepeat();
    }
  }, [strategy.isActive, webPlayback, localToggleRepeat]);

  const addToQueue = useCallback(
    (track: CurrentTrack) => {
      // Add track to the end of the current queue
      const newQueue = [...queue, track];
      setQueue(newQueue);
    },
    [queue, setQueue]
  );

  const removeFromQueue = useCallback(
    (index: number) => {
      // Remove track at the specified index
      const newQueue = queue.filter((_, i) => i !== index);
      setQueue(newQueue);
    },
    [queue, setQueue]
  );

  return {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    duration: currentTrack?.duration || 0,
    playTrack,
    pause,
    resume,
    togglePlayPause,
    seek,
    setVolume,
    next,
    previous,
    queue,
    setQueue,
    addToQueue,
    removeFromQueue,
    audioElement: audioRef.current,
    useWebPlayback,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  };
};
