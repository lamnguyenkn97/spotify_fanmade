'use client';

import React, { useState } from 'react';
import { Stack, Typography, Icon, Image, colors } from 'spotify-design-system';
import { faPlay, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  explicit?: boolean;
  external_urls?: {
    spotify?: string;
  };
  preview_url?: string | null;
}

interface TrackItem {
  track: Track;
  added_at?: string;
  index?: number;
  isLiked?: boolean;
}

interface TrackTableProps {
  tracks: Array<{ track: Track; added_at?: string }>;
  onTrackClick?: (track: Track) => void;
}

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const TrackTable: React.FC<TrackTableProps> = ({ tracks, onTrackClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Transform tracks data to include index and mock liked status
  const tableData: TrackItem[] = tracks.map((item, idx) => ({
    ...item,
    index: idx + 1,
    // Mock: Mark some tracks as liked
    isLiked: idx === 0 || idx === 1 || idx === 7,
  }));

  return (
    <Stack direction="column" className="px-8 pb-8 bg-spotify-dark">
      {/* Custom Header Row matching Spotify style */}
      <Stack
        direction="row"
        spacing="lg"
        align="center"
        className="px-2 py-2 border-b border-gray-800"
        style={{ gridTemplateColumns: '40px 1fr 30% 100px', display: 'grid' }}
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
            Album
          </Typography>
        </Stack>
        <Stack direction="row" align="center" justify="end" className="pr-4">
          <Icon icon={faClock} size="sm" color="muted" />
        </Stack>
      </Stack>

      {/* Custom Table Rows matching header alignment */}
      <Stack direction="column">
        {tableData.map((item) => (
          <Stack
            key={item.track.id}
            direction="row"
            spacing="lg"
            align="center"
            className="px-2 py-2 hover:bg-gray-800/50 rounded group"
            style={{ gridTemplateColumns: '40px 1fr 30% 100px', display: 'grid' }}
            onMouseEnter={() => setHoveredIndex(item.index!)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Track Number */}
            <Stack direction="row" align="center">
              {hoveredIndex === item.index ? (
                <Icon
                  icon={faPlay}
                  size="sm"
                  color="primary"
                  onClick={() => onTrackClick?.(item.track)}
                />
              ) : (
                <Typography
                  variant="body"
                  size="sm"
                  color="muted"
                  onClick={() => onTrackClick?.(item.track)}
                >
                  {item.index}
                </Typography>
              )}
            </Stack>

            {/* Title with Album Art */}
            <Stack
              direction="row"
              spacing="md"
              align="center"
              className="min-w-0 cursor-pointer"
              onClick={() => onTrackClick?.(item.track)}
            >
              <Image
                src={item.track.album.images?.[2]?.url || item.track.album.images?.[0]?.url || ''}
                alt={item.track.album.name}
                size="sm"
              />
              <Stack direction="column" spacing="xs" className="min-w-0">
                <Stack direction="row" spacing="xs" align="center" className="min-w-0">
                  <Typography
                    variant="body"
                    size="sm"
                    weight="medium"
                    color="primary"
                    className="truncate"
                  >
                    {item.track.name}
                  </Typography>
                  {/* Explicit indicator */}
                  {item.track.explicit && (
                    <span
                      className="flex-shrink-0 w-4 h-4 bg-gray-700 rounded flex items-center justify-center text-[10px] font-bold text-white"
                      title="Explicit"
                    >
                      E
                    </span>
                  )}
                  {/* Music video indicator - check if track has video (heuristic: if it has external_urls and preview_url) */}
                  {item.track.external_urls?.spotify && item.track.preview_url && (
                    <Stack direction="row" spacing="xs" align="center" className="flex-shrink-0">
                      <Stack
                        direction="row"
                        align="center"
                        justify="center"
                        className="flex-shrink-0 w-4 h-4 bg-gray-700 rounded"
                        title="Music video"
                      >
                        <Icon icon={faPlay} size="sm" color="primary" />
                      </Stack>
                      <Typography
                        variant="caption"
                        size="sm"
                        color="muted"
                        className="whitespace-nowrap"
                      >
                        Music video
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <Typography variant="caption" size="sm" color="muted" className="truncate">
                  {item.track.artists.map((a) => a.name).join(', ')}
                </Typography>
              </Stack>
            </Stack>

            {/* Album */}
            <Stack direction="row" align="center">
              <Typography variant="body" size="sm" color="muted" className="truncate">
                {item.track.album.name}
              </Typography>
            </Stack>

            {/* Duration */}
            <Stack direction="row" align="center" justify="end" spacing="sm" className="pr-4">
              {item.isLiked && <Icon icon={faCheckCircle} size="sm" color={colors.primary.brand} />}
              <Typography
                variant="caption"
                size="sm"
                color="muted"
                style={{ minWidth: '40px', textAlign: 'right' }}
                className="tabular-nums"
              >
                {formatDuration(item.track.duration_ms)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
