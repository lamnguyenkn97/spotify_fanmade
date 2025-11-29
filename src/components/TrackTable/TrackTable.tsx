'use client';

import React, { useState } from 'react';
import { Stack, Typography, Icon, Image, colors, Table, Equalizer } from 'spotify-design-system';
import { faPlay, faPause, faCheckCircle, faListUl } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { useQueueDrawer } from '@/contexts/QueueDrawerContext';
import { convertTrackToCurrentTrack, convertTracksToQueue } from '@/utils/trackHelpers';
import { useLikedTracks } from '@/hooks/useLikedTracks';
import { formatRelativeTime } from '@/utils/dateHelpers';

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
  dateAdded?: string;
  track: Track;
  addToQueue?: string; // Action column placeholder
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
  const { playTrack, pause, resume, setQueue, currentTrack, isPlaying, addToQueue } =
    useMusicPlayerContext();
  const { openQueue } = useQueueDrawer();

  // Get track IDs for checking liked status (read-only, no toggle functionality)
  const trackIds = React.useMemo(() => tracks.map((item) => item.track.id), [tracks]);
  const { isLiked } = useLikedTracks(trackIds);

  // Set up queue only when a track is played, not on page load
  const setPlaylistQueue = React.useCallback(
    (startIndex: number) => {
      const trackList = tracks.map((item) => item.track);
      const queue = convertTracksToQueue(trackList);
      // Set the queue starting from the clicked track
      const reorderedQueue = [...queue.slice(startIndex), ...queue.slice(0, startIndex)];
      setQueue(reorderedQueue);
    },
    [tracks, setQueue]
  );

  // Handle track click - play the track, or pause if already playing
  const handleTrackClick = async (track: Track, trackIndex: number) => {
    const trackToPlay = convertTrackToCurrentTrack(track);

    // If clicking the same track that's currently playing, toggle play/pause
    if (currentTrack?.id === trackToPlay.id) {
      if (isPlaying) {
        await pause();
      } else {
        await resume();
      }
    } else {
      // Different track - set up queue starting from this track, then play it
      setPlaylistQueue(trackIndex);
      await playTrack(trackToPlay);
    }

    onTrackClick?.(track);
  };

  const handleAddToQueue = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    const trackToAdd = convertTrackToCurrentTrack(track);
    addToQueue(trackToAdd);
    // Open queue drawer to show visual feedback
    openQueue();
  };

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
    isLiked: isLiked(item.track.id),
    dateAdded: item.added_at,
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
            renderCell: (row: TrackTableRow) => {
              const isCurrentlyPlaying = currentTrack?.id === row.track.id && isPlaying;
              const isHovered = hoveredIndex === row.index;

              return (
                <Stack direction="row" align="center" justify="center" style={{ width: '48px' }}>
                  {isCurrentlyPlaying && !isHovered ? (
                    <Equalizer size="sm" isPlaying={isPlaying} />
                  ) : isHovered && isCurrentlyPlaying ? (
                    <Icon
                      icon={faPause}
                      size="sm"
                      color="primary"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await pause();
                      }}
                    />
                  ) : isHovered ? (
                    <Icon
                      icon={faPlay}
                      size="sm"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackClick(row.track, row.index);
                      }}
                    />
                  ) : (
                    <Typography variant="body" size="sm" color="muted">
                      {row.trackNumber}
                    </Typography>
                  )}
                </Stack>
              );
            },
            width: '48px',
          },
          {
            align: 'left',
            key: 'title',
            label: 'Title',
            renderCell: (row: TrackTableRow) => {
              const isCurrentlyPlaying = currentTrack?.id === row.track.id && isPlaying;

              return (
                <Stack direction="row" spacing="sm" align="center">
                  <Image src={row.albumImage || ''} alt={row.album} size="sm" />
                  <Stack direction="column" spacing="xs">
                    <Stack direction="row" spacing="xs" align="center">
                      <Typography
                        variant="body"
                        size="sm"
                        weight="medium"
                        color={isCurrentlyPlaying ? 'primary' : 'primary'}
                        style={isCurrentlyPlaying ? { color: colors.primary.brand } : undefined}
                      >
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
              );
            },
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
            align: 'left',
            key: 'dateAdded',
            label: 'Date added',
            renderCell: (row: TrackTableRow) => {
              if (!row.dateAdded) return null;
              return (
                <Typography variant="body" size="sm" color="muted">
                  {formatRelativeTime(row.dateAdded)}
                </Typography>
              );
            },
            width: 'auto',
          },
          {
            align: 'center',
            key: 'addToQueue',
            label: '',
            renderCell: (row: TrackTableRow) => {
              return (
                <div
                  onClick={(e) => handleAddToQueue(e, row.track)}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    transition: 'background-color 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon icon={faListUl} size="sm" color="muted" />
                  <Typography variant="body" size="sm" color="muted" weight="medium">
                    Add to queue
                  </Typography>
                </div>
              );
            },
            width: '150px',
          },
          {
            align: 'right',
            key: 'duration',
            label: <Icon icon={faClock} size="sm" color="muted" />,
            renderCell: (row: TrackTableRow) => {
              const isCurrentlyPlaying = currentTrack?.id === row.track.id && isPlaying;
              const showCheckIcon = isCurrentlyPlaying || row.isLiked;

              return (
                <Stack direction="row" align="center" spacing="sm" justify="end">
                  {showCheckIcon && (
                    <Icon icon={faCheckCircle} size="sm" color={colors.primary.brand} />
                  )}
                  <Typography variant="body" size="sm" color="muted">
                    {row.duration}
                  </Typography>
                </Stack>
              );
            },
            width: '100px',
          },
        ]}
        data={tableData}
        onRowClick={(row: TrackTableRow) => handleTrackClick(row.track, row.index)}
        onRowHover={(row: TrackTableRow, index?: number) => setHoveredIndex(index ?? row.index)}
      />
    </Stack>
  );
};
