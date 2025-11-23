import React, { useMemo } from 'react';
import { useSpotifyWebPlayback } from './useSpotifyWebPlayback';
import { CurrentTrack } from './useMusicPlayer';

interface PlaybackStrategy {
  canPlay: (track: CurrentTrack) => boolean;
  play: (track: CurrentTrack) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  isReady: boolean;
  isActive: boolean;
}

const createWebPlaybackStrategy = (
  webPlayback: ReturnType<typeof useSpotifyWebPlayback>,
  isReady: boolean
): PlaybackStrategy => ({
  canPlay: (track: CurrentTrack) => isReady && !!track.spotifyUri,
  play: async (track: CurrentTrack) => {
    if (!track.spotifyUri) {
      throw new Error('Track missing Spotify URI');
    }
    await webPlayback.playTrack(track.spotifyUri);
  },
  pause: async () => {
    await webPlayback.pause();
  },
  resume: async () => {
    await webPlayback.resume();
  },
  seek: async (time: number) => {
    await webPlayback.seek(time);
  },
  setVolume: async (volume: number) => {
    await webPlayback.setVolume(volume);
  },
  nextTrack: async () => {
    await webPlayback.nextTrack();
  },
  previousTrack: async () => {
    await webPlayback.previousTrack();
  },
  isReady,
  isActive: isReady,
});

const createPreviewStrategy = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setCurrentTime: (time: number) => void
): PlaybackStrategy => ({
  canPlay: (track: CurrentTrack) => !!track.previewUrl && !!audioRef.current,
  play: async (track: CurrentTrack) => {
    if (!track.previewUrl) throw new Error('Track missing preview URL');
    if (!audioRef.current) throw new Error('Audio element not available');

    audioRef.current.pause();
    audioRef.current.src = track.previewUrl;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);

    await audioRef.current.play();
    setIsPlaying(true);
  },
  pause: async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  },
  resume: async () => {
    if (audioRef.current) {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  },
  seek: async (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time / 1000; // Convert ms to seconds
      setCurrentTime(time);
    }
  },
  setVolume: async (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // Convert 0-100 to 0-1
    }
  },
  nextTrack: async () => {
    throw new Error('Next track not supported for preview URLs');
  },
  previousTrack: async () => {
    throw new Error('Previous track not supported for preview URLs');
  },
  isReady: true,
  isActive: true,
});

export const usePlaybackStrategy = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setCurrentTime: (time: number) => void,
  webPlayback: ReturnType<typeof useSpotifyWebPlayback>
): PlaybackStrategy => {
  const webPlaybackStrategy = useMemo(
    () => createWebPlaybackStrategy(webPlayback, webPlayback.isReady),
    [webPlayback, webPlayback.isReady]
  );

  const previewStrategy = useMemo(
    () => createPreviewStrategy(audioRef, setIsPlaying, setCurrentTime),
    [audioRef, setIsPlaying, setCurrentTime]
  );

  // Return strategy with fallback logic

  return useMemo(() => {
    const primaryStrategy = webPlayback.isReady ? webPlaybackStrategy : previewStrategy;
    const fallbackStrategy = previewStrategy;

    return {
      ...primaryStrategy,
      play: async (track: CurrentTrack) => {
        // Try primary strategy first
        if (primaryStrategy.canPlay(track)) {
          try {
            await primaryStrategy.play(track);
            return;
          } catch (error) {
            console.error('Primary strategy failed, trying fallback:', error);
          }
        }

        // Fallback to preview strategy
        if (fallbackStrategy.canPlay(track)) {
          await fallbackStrategy.play(track);
        } else {
          throw new Error('No playback method available for this track');
        }
      },
    };
  }, [webPlayback.isReady, webPlaybackStrategy, previewStrategy]);
};
