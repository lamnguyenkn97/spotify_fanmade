'use client';

import React from 'react';
import { Stack, Typography, colors } from 'spotify-design-system';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { CurrentTrack } from '@/hooks/useMusicPlayer';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { currentTrack, queue, playTrack } = useMusicPlayerContext();

  if (!isOpen) return null;

  // Find the current track index in the queue
  const currentIndex = currentTrack ? queue.findIndex((t) => t.id === currentTrack.id) : -1;

  // Separate current track and upcoming tracks
  const upcomingTracks = currentIndex >= 0 ? queue.slice(currentIndex + 1) : queue;

  const handleTrackClick = async (track: CurrentTrack) => {
    await playTrack(track);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[1100]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-[#121212] z-[1101] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#121212] border-b border-[#282828] px-6 py-4 z-10">
          <Stack direction="row" align="center" justify="space-between">
            <Typography variant="heading" size="lg" color="primary">
              Queue
            </Typography>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#282828] rounded-full transition-colors"
              aria-label="Close queue"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.grey.grey3}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </Stack>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Now Playing Section */}
          {currentTrack && (
            <div className="mb-8">
              <Typography
                variant="heading"
                size="sm"
                color="primary"
                className="mb-4 font-bold"
              >
                Now playing
              </Typography>
              <div className="flex items-center gap-3 p-2 rounded-md">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-sm"
                />
                <div className="flex-1 min-w-0">
                  <Typography
                    variant="body"
                    size="md"
                    color="primary"
                    className="font-medium truncate"
                    style={{ color: colors.primary.brand }}
                  >
                    {currentTrack.title}
                  </Typography>
                  <Typography
                    variant="body"
                    size="sm"
                    color="secondary"
                    className="truncate"
                  >
                    {currentTrack.artist}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Next from Section */}
          {upcomingTracks.length > 0 && (
            <div>
              <Typography
                variant="heading"
                size="sm"
                color="primary"
                className="mb-4 font-bold"
              >
                Next from: Queue
              </Typography>
              <div className="space-y-1">
                {upcomingTracks.map((track, index) => (
                  <div
                    key={`${track.id}-${index}`}
                    onClick={() => handleTrackClick(track)}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] transition-colors cursor-pointer group"
                  >
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-12 h-12 rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <Typography
                        variant="body"
                        size="md"
                        color="primary"
                        className="font-medium truncate group-hover:text-white"
                      >
                        {track.title}
                      </Typography>
                      <Typography
                        variant="body"
                        size="sm"
                        color="secondary"
                        className="truncate"
                      >
                        {track.artist}
                      </Typography>
                    </div>
                    <Typography
                      variant="body"
                      size="sm"
                      color="secondary"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {Math.floor(track.duration / 60000)}:
                      {String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!currentTrack && upcomingTracks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.grey.grey2}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <Typography variant="heading" size="md" color="primary" className="mb-2">
                No tracks in queue
              </Typography>
              <Typography variant="body" size="sm" color="secondary" className="text-center">
                Add some tracks to your queue to see them here
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

