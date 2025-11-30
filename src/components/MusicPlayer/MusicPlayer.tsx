'use client';

import React from 'react';
import { MusicPlayer as DesignSystemMusicPlayer } from 'spotify-design-system';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';

interface MusicPlayerProps {
  className?: string;
  onQueueClick?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ className, onQueueClick }) => {
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
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = useMusicPlayerContext();

  // Don't render if there's no track
  if (!currentTrack) {
    return null;
  }

  // Convert duration from milliseconds to seconds for the design system component
  // The design system expects duration in seconds, but we store it in ms
  const durationInSeconds = Math.floor(duration / 1000);
  const currentTimeInSeconds = Math.floor(currentTime / 1000);

  const handleLyrics = () => {
    // TODO: Implement lyrics feature
  };

  const handleRepeat = async () => {
    try {
      await toggleRepeat();
    } catch (error) {

    }
  };

  const handleShuffle = async () => {
    try {
      await toggleShuffle();
    } catch (error) {

    }
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
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        // Note: The design system component should apply brand color (colors.primary.brand)
        // to shuffle icon when isShuffled=true
        // and to repeat icon when repeatMode !== 'off'
        // If the design system doesn't handle this, we may need to pass color props directly
        onLyrics={handleLyrics}
        onNext={next}
        onPlayPause={togglePlayPause}
        onPrevious={previous}
        onRepeat={handleRepeat}
        onSeek={(timeInSeconds: number) => {
          seek(timeInSeconds * 1000);
        }}
        onShuffle={handleShuffle}
        onVolumeChange={setVolume}
        volume={volume}
        onQueue={onQueueClick}
        className="rounded-lg w-full min-h-[74px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
};
