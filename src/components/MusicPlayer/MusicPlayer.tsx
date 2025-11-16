'use client';

import React from 'react';
import { MusicPlayer as DesignSystemMusicPlayer } from 'spotify-design-system';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';

interface MusicPlayerProps {
  className?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ className }) => {
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

  // Don't render if there's no track
  if (!currentTrack) {
    return null;
  }

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
    <div
      className={`fixed bottom-0 left-0 right-0 z-[1000] flex items-center px-4 py-2 min-h-[90px] bg-spotify-black border-t border-spotify-grey2 ${className || ''}`}
    >
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
          seek(timeInSeconds * 1000);
        }}
        onShuffle={handleShuffle}
        onVolumeChange={setVolume}
        volume={volume}
        className="rounded-lg w-full min-h-[74px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
};

