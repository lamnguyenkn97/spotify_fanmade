import { useState, useRef, useEffect, useCallback } from 'react';
import { useSpotifyWebPlayback } from './useSpotifyWebPlayback';
import { useAccessToken } from './useAccessToken';

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
}

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(100);
  const [queue, setQueue] = useState<CurrentTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [useWebPlayback, setUseWebPlayback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get access token for Web Playback SDK
  const accessToken = useAccessToken();

  // Initialize Web Playback SDK
  const webPlayback = useSpotifyWebPlayback(accessToken);

  // Play a track - defined early so it can be used in useEffect
  const playTrack = useCallback(
    async (track: CurrentTrack) => {
      console.log('playTrack called with:', track.title, 'URI:', track.spotifyUri);
      setCurrentTrack(track);
      setCurrentTime(0);

      // Prefer Web Playback SDK if available and track has Spotify URI
      if (useWebPlayback && track.spotifyUri && webPlayback.isReady) {
        console.log('Using Web Playback SDK to play track');
        try {
          await webPlayback.playTrack(track.spotifyUri);
          setIsPlaying(true);
          console.log('Web Playback SDK playTrack completed, currentTrack should be set');
          return;
        } catch (error) {
          console.error('Error playing with Web Playback SDK, falling back to preview:', error);
          // Fall through to preview URL
        }
      }

      // Fallback to preview URL
      if (!track.previewUrl) {
        console.warn('No preview URL or Spotify URI available for this track');
        return;
      }

      if (audioRef.current) {
        // Pause current track if playing
        audioRef.current.pause();

        // Set new track
        audioRef.current.src = track.previewUrl;
        audioRef.current.currentTime = 0;
        setCurrentTime(0);

        // Play
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing track:', error);
            setIsPlaying(false);
          });
      }
    },
    [useWebPlayback, webPlayback]
  );

  // Prefer Web Playback SDK if available and ready
  useEffect(() => {
    if (webPlayback.isReady && accessToken) {
      setUseWebPlayback(true);
      // Sync state from Web Playback SDK
      if (webPlayback.currentTrack) {
        setIsPlaying(webPlayback.isPlaying);
        setCurrentTime(webPlayback.position);
        // Update current track from Web Playback SDK
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
  }, [
    webPlayback.isReady,
    webPlayback.isPlaying,
    webPlayback.position,
    webPlayback.currentTrack,
    accessToken,
  ]);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;

      // Update current time as audio plays
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime * 1000); // Convert to ms
        }
      };

      // Handle track end
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        // Auto-play next track if available (only for preview URLs, Web Playback SDK handles this automatically)
        if (!useWebPlayback && currentIndex >= 0 && currentIndex < queue.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          playTrack(queue[nextIndex]);
        }
      };

      // Handle errors (e.g., preview URL not available)
      const handleError = () => {
        console.error('Error playing audio');
        setIsPlaying(false);
        // You could show a toast/notification here
      };

      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateTime);
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [useWebPlayback, currentIndex, queue, playTrack, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Pause playback
  const pause = useCallback(async () => {
    if (useWebPlayback && webPlayback.isReady) {
      await webPlayback.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [useWebPlayback, webPlayback]);

  // Resume playback
  const resume = useCallback(async () => {
    if (useWebPlayback && webPlayback.isReady) {
      await webPlayback.resume();
      setIsPlaying(true);
      return;
    }

    if (audioRef.current && currentTrack) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error resuming track:', error);
          setIsPlaying(false);
        });
    }
  }, [useWebPlayback, webPlayback, currentTrack]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
  }, [isPlaying, pause, resume]);

  // Seek to specific time
  const seek = useCallback(
    async (time: number) => {
      if (useWebPlayback && webPlayback.isReady) {
        await webPlayback.seek(time);
        setCurrentTime(time);
        return;
      }

      if (audioRef.current) {
        audioRef.current.currentTime = time / 1000; // Convert ms to seconds
        setCurrentTime(time);
      }
    },
    [useWebPlayback, webPlayback]
  );

  // Set volume (0-100)
  const setVolume = useCallback(
    async (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(100, newVolume));
      setVolumeState(clampedVolume);

      if (useWebPlayback && webPlayback.isReady) {
        await webPlayback.setVolume(clampedVolume);
      }
    },
    [useWebPlayback, webPlayback]
  );

  // Play next track in queue
  const next = useCallback(async () => {
    if (useWebPlayback && webPlayback.isReady) {
      await webPlayback.nextTrack();
      return;
    }

    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      await playTrack(queue[nextIndex]);
    }
  }, [useWebPlayback, webPlayback, currentIndex, queue, playTrack]);

  // Play previous track in queue
  const previous = useCallback(async () => {
    if (useWebPlayback && webPlayback.isReady) {
      await webPlayback.previousTrack();
      return;
    }

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      await playTrack(queue[prevIndex]);
    } else if (currentIndex === 0) {
      // Restart current track
      await seek(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [useWebPlayback, webPlayback, currentIndex, queue, playTrack, seek]);

  // Update current index when track changes
  useEffect(() => {
    if (currentTrack && queue.length > 0) {
      const index = queue.findIndex((t) => t.id === currentTrack.id);
      if (index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [currentTrack, queue]);

  // Sync time from Web Playback SDK (throttled to reduce re-renders)
  useEffect(() => {
    if (!useWebPlayback || !webPlayback.isReady) {
      return;
    }

    // Update playing state immediately
    setIsPlaying(webPlayback.isPlaying);

    // Throttle position updates to every 500ms to reduce re-renders
    const interval = setInterval(() => {
      if (useWebPlayback && webPlayback.isReady) {
        setCurrentTime(webPlayback.position);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [useWebPlayback, webPlayback.isReady, webPlayback.isPlaying, webPlayback.position]);

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
  };
};
