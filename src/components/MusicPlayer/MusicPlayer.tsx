'use client';

import React from 'react';
import { MusicPlayer as DesignSystemMusicPlayer, colors } from 'spotify-design-system';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';

interface MusicPlayerProps {
  style?: React.CSSProperties;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ style }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    duration,
    togglePlayPause,
    seek,
    setVolume,
    next,
    previous,
  } = useMusicPlayerContext();

  // Convert duration from milliseconds to seconds for the design system component
  // The design system expects duration in seconds, but we store it in ms
  const durationInSeconds = Math.floor(duration / 1000);
  const currentTimeInSeconds = Math.floor(currentTime / 1000);

  // Placeholder handlers for additional features
  const handleAddToPlaylist = () => {
    console.log('Add to playlist');
  };

  const handleCast = () => {
    console.log('Cast');
  };

  const handleFullscreen = () => {
    console.log('Fullscreen');
  };

  const handleLyrics = () => {
    console.log('Lyrics');
  };

  const handleQueue = () => {
    console.log('Queue');
  };

  const handleRepeat = () => {
    console.log('Repeat');
  };

  const handleShuffle = () => {
    console.log('Shuffle');
  };

  return (
    <DesignSystemMusicPlayer
      currentTime={currentTimeInSeconds}
      currentTrack={
        currentTrack
          ? {
              album: currentTrack.album,
              artist: currentTrack.artist,
              coverUrl: currentTrack.coverUrl,
              title: currentTrack.title,
            }
          : {
              album: '',
              artist: '',
              coverUrl: '',
              title: '',
            }
      }
      duration={durationInSeconds}
      isPlaying={isPlaying}
      onAddToPlaylist={handleAddToPlaylist}
      onCast={handleCast}
      onFullscreen={handleFullscreen}
      onLyrics={handleLyrics}
      onNext={next}
      onPlayPause={togglePlayPause}
      onPrevious={previous}
      onQueue={handleQueue}
      onRepeat={handleRepeat}
      onSeek={(timeInSeconds: number) => {
        // Convert seconds to milliseconds for our hook
        seek(timeInSeconds * 1000);
      }}
      onShuffle={handleShuffle}
      onVolumeChange={setVolume}
      volume={volume}
      style={{
        borderRadius: '8px',
        bottom: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        left: 'auto',
        position: 'relative',
        right: 'auto',
        width: '100%',
        ...style,
      }}
    />
  );
};

