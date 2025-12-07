'use client';

import React from 'react';
import { Modal, ModalSize, Stack, Typography, Image, Icon, TextLink } from 'spotify-design-system';
import { SpotifyTrack } from '@/types';
import { faMusic, faClock, faFire, faCalendar, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { getBestImageUrl } from '@/utils/imageHelpers';

interface TrackDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: SpotifyTrack | null;
}

export const TrackDetailModal: React.FC<TrackDetailModalProps> = ({ isOpen, onClose, track }) => {
  if (!track) {
    return (
      <Modal
        open={false}
        onClose={onClose}
        size={ModalSize.Medium}
        showCloseButton={true}
        closeOnBackdropClick={true}
        closeOnEscape={true}
      >
        <Stack direction="column" spacing="lg" className="p-6">
          <Typography variant="body" color="secondary">No track selected</Typography>
        </Stack>
      </Modal>
    );
  }

  const albumImage = getBestImageUrl(track.album?.images);
  const duration = track.duration_ms ? Math.floor(track.duration_ms / 1000) : 0;
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const releaseYear = track.album?.release_date ? new Date(track.album.release_date).getFullYear() : null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size={ModalSize.Medium}
      showCloseButton={true}
      closeOnBackdropClick={true}
      closeOnEscape={true}
    >
      <Stack direction="column" spacing="lg" className="p-6">
        {/* Album Art and Basic Info */}
        <Stack direction="row" spacing="lg" align="start">
          {albumImage && (
            <Image
              src={albumImage}
              alt={track.name}
              variant="default"
              className="w-48 h-48 rounded-lg shadow-xl flex-shrink-0"
            />
          )}
          
          <Stack direction="column" spacing="md" className="flex-1 min-w-0">
            <Stack direction="column" spacing="xs">
              <Typography variant="heading" size="xl" weight="bold" color="primary">
                {track.name}
              </Typography>
              <Typography variant="body" size="lg" color="secondary">
                {track.artists.map(a => a.name).join(', ')}
              </Typography>
              {track.album && (
                <Typography variant="body" size="md" color="secondary">
                  {track.album.name}
                </Typography>
              )}
            </Stack>

            {/* Quick Stats */}
            <Stack direction="row" spacing="md" className="flex-wrap">
              {track.popularity !== undefined && (
                <Stack direction="row" spacing="xs" align="center">
                  <Icon icon={faFire} size="sm" color="#FF6B9D" />
                  <Typography variant="body" size="sm" color="secondary">
                    {track.popularity}/100 popularity
                  </Typography>
                </Stack>
              )}
              
              <Stack direction="row" spacing="xs" align="center">
                <Icon icon={faClock} size="sm" color="#4ECDC4" />
                <Typography variant="body" size="sm" color="secondary">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Detailed Information */}
        <Stack direction="column" spacing="md" className="pt-4 border-t border-surface-base">
          <Typography variant="heading" size="md" weight="bold" color="primary">
            Track Details
          </Typography>

          <Stack direction="column" spacing="sm">
            {/* Album Info */}
            {track.album && (
              <Stack direction="row" spacing="sm" align="center">
                <Icon icon={faCompactDisc} size="sm" color="#95E1D3" />
                <Stack direction="column" spacing="xs" className="flex-1">
                  <Typography variant="body" size="sm" color="secondary">
                    Album
                  </Typography>
                  <Typography variant="body" size="md" color="primary">
                    {track.album.name}
                  </Typography>
                </Stack>
              </Stack>
            )}

            {/* Release Date */}
            {releaseYear && (
              <Stack direction="row" spacing="sm" align="center">
                <Icon icon={faCalendar} size="sm" color="#FFA07A" />
                <Stack direction="column" spacing="xs" className="flex-1">
                  <Typography variant="body" size="sm" color="secondary">
                    Release Year
                  </Typography>
                  <Typography variant="body" size="md" color="primary">
                    {releaseYear}
                  </Typography>
                </Stack>
              </Stack>
            )}

            {/* Track Number */}
            {track.track_number && (
              <Stack direction="row" spacing="sm" align="center">
                <Icon icon={faMusic} size="sm" color="#C77DFF" />
                <Stack direction="column" spacing="xs" className="flex-1">
                  <Typography variant="body" size="sm" color="secondary">
                    Track Number
                  </Typography>
                  <Typography variant="body" size="md" color="primary">
                    {track.track_number} of {track.album?.total_tracks || '?'}
                  </Typography>
                </Stack>
              </Stack>
            )}

            {/* Explicit */}
            {track.explicit !== undefined && (
              <Stack direction="row" spacing="sm" align="center">
                <Stack direction="column" spacing="xs" className="flex-1">
                  <Typography variant="body" size="sm" color="secondary">
                    Content Rating
                  </Typography>
                  <Typography variant="body" size="md" color="primary">
                    {track.explicit ? 'Explicit' : 'Clean'}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* External Links */}
        {track.external_urls?.spotify && (
          <Stack direction="row" spacing="sm" justify="end" className="pt-4">
            <TextLink
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              variant="default"
              weight="bold"
              className="px-4 py-2 bg-spotify-green text-black rounded-full hover:scale-105 transition-transform"
            >
              Open in Spotify
            </TextLink>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

