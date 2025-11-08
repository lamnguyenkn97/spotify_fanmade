'use client';

import React, { useState } from 'react';
import { Stack, Typography, Icon, Image, colors, Table } from 'spotify-design-system';
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

interface TrackTableRow {
  id: string;
  index: number;
  trackNumber: number;
  title: string;
  artists: string;
  album: string;
  albumImage?: string;
  duration: string;
  explicit?: boolean;
  hasVideo?: boolean;
  isLiked?: boolean;
  track: Track;
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

  // Transform tracks data to match Table format
  const tableData: TrackTableRow[] = tracks.map((item, idx) => ({
    id: item.track.id,
    index: idx,
    trackNumber: idx + 1,
    title: item.track.name,
    artists: item.track.artists.map((a) => a.name).join(', '),
    album: item.track.album.name,
    albumImage: item.track.album.images?.[2]?.url || item.track.album.images?.[0]?.url || '',
    duration: formatDuration(item.track.duration_ms),
    explicit: item.track.explicit,
    hasVideo: !!(item.track.external_urls?.spotify && item.track.preview_url),
    isLiked: idx === 0 || idx === 1 || idx === 7, // Mock: Mark some tracks as liked
    track: item.track,
  }));

  return (
    <Stack direction="column">
      <Table<TrackTableRow>
        columns={[
          {
            align: 'left',
            key: 'trackNumber',
            label: '#',
            renderCell: (row: TrackTableRow) => (
              <Stack direction="row" align="center">
                {hoveredIndex === row.index ? (
                  <Icon
                    icon={faPlay}
                    size="sm"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrackClick?.(row.track);
                    }}
                  />
                ) : (
                  <Typography variant="body" size="sm" color="muted">
                    {row.trackNumber}
                  </Typography>
                )}
              </Stack>
            ),
            width: '48px',
          },
          {
            align: 'left',
            key: 'title',
            label: 'Title',
            renderCell: (row: TrackTableRow) => (
              <Stack direction="row" spacing="md" align="center">
                <Image src={row.albumImage || ''} alt={row.album} size="sm" />
                <Stack direction="column" spacing="xs">
                  <Stack direction="row" spacing="xs" align="center">
                    <Typography variant="body" size="sm" weight="medium" color="primary">
                      {row.title}
                    </Typography>
                    {/* Explicit indicator */}
                    {row.explicit && (
                      <Stack
                        direction="row"
                        align="center"
                        justify="center"
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: colors.grey.grey2,
                          borderRadius: '2px',
                        }}
                        title="Explicit"
                      >
                        <Typography variant="caption" size="sm" color="primary" weight="bold">
                          E
                        </Typography>
                      </Stack>
                    )}
                    {/* Music video indicator */}
                    {row.hasVideo && (
                      <Stack direction="row" spacing="xs" align="center">
                        <Stack
                          direction="row"
                          align="center"
                          justify="center"
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: colors.grey.grey2,
                            borderRadius: '2px',
                          }}
                          title="Music video"
                        >
                          <Icon icon={faPlay} size="sm" color="primary" />
                        </Stack>
                        <Typography variant="caption" size="sm" color="muted">
                          Music video
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <Typography variant="caption" size="sm" color="muted">
                    {row.artists}
                  </Typography>
                </Stack>
              </Stack>
            ),
            width: 'auto',
          },
          {
            align: 'left',
            key: 'album',
            label: 'Album',
            renderCell: (row: TrackTableRow) => (
              <Typography variant="body" size="sm" color="muted">
                {row.album}
              </Typography>
            ),
            width: 'auto',
          },
          {
            align: 'right',
            key: 'duration',
            label: <Icon icon={faClock} size="sm" color="muted" />,
            renderCell: (row: TrackTableRow) => (
              <Stack direction="row" align="center" spacing="sm" justify="end">
                {row.isLiked && (
                  <Icon icon={faCheckCircle} size="sm" color={colors.primary.brand} />
                )}
                <Typography variant="body" size="sm" color="muted">
                  {row.duration}
                </Typography>
              </Stack>
            ),
            width: '100px',
          },
        ]}
        data={tableData}
        onRowClick={(row: TrackTableRow) => onTrackClick?.(row.track)}
        onRowHover={(row: TrackTableRow, index?: number) =>
          setHoveredIndex(index ?? row.index)
        }
      />
    </Stack>
  );
};
