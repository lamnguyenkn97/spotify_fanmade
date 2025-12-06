'use client';

import React, { useState } from 'react';
import { Stack, Typography, Icon, Image, colors } from 'spotify-design-system';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface PlaylistItem {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
  index?: number;
}

interface PlaylistTableProps {
  playlists: PlaylistItem[];
  onPlaylistClick: (playlistId: string) => void;
}

const getBestImageUrl = (images: Array<{ url: string; height: number; width: number }>) => {
  if (!images || images.length === 0) return '';
  return (
    images.find((img) => img.height && img.height >= 200 && img.height <= 400)?.url ||
    images[0]?.url ||
    ''
  );
};

export const PlaylistTable: React.FC<PlaylistTableProps> = ({ playlists, onPlaylistClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tableData: PlaylistItem[] = playlists.map((playlist, idx) => ({
    ...playlist,
    index: idx + 1,
  }));

  return (
    <Stack direction="column" className="px-8 pb-8 bg-spotify-dark">
      {/* Custom Header Row */}
      <Stack
        direction="row"
        spacing="lg"
        align="center"
        className="px-2 py-2 border-b border-gray-800 grid"
        style={{ gridTemplateColumns: '40px 1fr 30% 150px' }}
      >
        <Stack direction="row" align="center">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            #
          </Typography>
        </Stack>
        <Stack direction="row" align="center">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            Title
          </Typography>
        </Stack>
        <Stack direction="row" align="center">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            Owner
          </Typography>
        </Stack>
        <Stack direction="row" align="center" justify="end" className="pr-4">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            Tracks
          </Typography>
        </Stack>
      </Stack>

      {/* Table Rows */}
      <Stack direction="column">
        {tableData.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing="lg"
            align="center"
            className="px-2 py-2 hover:bg-gray-800/50 rounded group cursor-pointer grid"
            style={{ gridTemplateColumns: '40px 1fr 30% 150px' }}
            onMouseEnter={() => setHoveredIndex(item.index!)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onPlaylistClick(item.id)}
          >
            {/* Index */}
            <Stack direction="row" align="center">
              {hoveredIndex === item.index ? (
                <Icon
                  icon={faPlay}
                  size="sm"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaylistClick(item.id);
                  }}
                />
              ) : (
                <Typography variant="body" size="sm" color="muted">
                  {item.index}
                </Typography>
              )}
            </Stack>

            {/* Title with Image */}
            <Stack direction="row" spacing="md" align="center" className="min-w-0">
              <Image
                src={getBestImageUrl(item.images)}
                alt={item.name}
                size="sm"
                className="flex-shrink-0"
              />
              <Stack direction="column" spacing="xs" className="min-w-0">
                <Typography
                  variant="body"
                  size="sm"
                  weight="medium"
                  color="primary"
                  className="truncate"
                >
                  {item.name}
                </Typography>
                <Typography variant="caption" size="sm" color="muted" className="truncate">
                  Playlist
                </Typography>
              </Stack>
            </Stack>

            {/* Owner */}
            <Stack direction="row" align="center" className="min-w-0">
              <Typography variant="body" size="sm" color="muted" className="truncate">
                {item.owner.display_name}
              </Typography>
            </Stack>

            {/* Tracks Count */}
            <Stack direction="row" align="center" justify="end" className="pr-4">
              <Typography variant="body" size="sm" color="muted">
                {item.tracks.total}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

