'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Stack,
  Typography,
  Banner,
  Icon,
  colors,
  Pill,
  Image,
  Button,
  ButtonVariant,
  ButtonSize,
  Table,
  Skeleton,
} from 'spotify-design-system';
import { faPlay, faEllipsis, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { useToast } from '@/contexts/ToastContext';

interface ShowData {
  id: string;
  name: string;
  description?: string;
  images: Array<{ url: string }>;
  publisher?: string;
  total_episodes: number;
  media_type: string;
  episodes: {
    total: number;
    items: Array<{
      id: string;
      name: string;
      description?: string;
      images: Array<{ url: string }>;
      release_date: string;
      duration_ms: number;
      external_urls?: {
        spotify?: string;
      };
      resume_point?: {
        fully_played: boolean;
        resume_position_ms: number;
      };
    }>;
  };
}

interface EpisodeTableRow {
  id: string;
  index: number;
  trackNumber: number;
  title: string;
  showName: string;
  description?: string;
  episodeImage?: string;
  showImage?: string;
  date: string;
  duration: string;
  isFinished: boolean;
  status: string;
}

export default function ShowPage() {
  const params = useParams();
  const { playTrack } = useMusicPlayerContext();
  const toast = useToast();
  const [show, setShow] = useState<ShowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchShow = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spotify/show/${params.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch show');
        }

        const data = await response.json();
        setShow(data);
      } catch (err: unknown) {

        const errorMessage = err instanceof Error ? err.message : 'Failed to load show';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [params.id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow functionality
  };

  const handleEpisodeClick = async (episodeId: string) => {
    if (!show) return;

    // Find the episode in the show's episodes
    const episode = show.episodes.items.find((ep) => ep.id === episodeId);
    if (!episode) {

      return;
    }

    // Convert episode to track format for the music player
    const episodeAsTrack = {
      id: episode.id,
      title: episode.name,
      artist: show.publisher || 'Unknown Publisher',
      album: show.name,
      coverUrl: episode.images?.[0]?.url || show.images?.[0]?.url || '',
      duration: episode.duration_ms,
      previewUrl: null, // Podcasts typically don't have preview URLs
      spotifyUri: `spotify:episode:${episode.id}`, // Use spotifyUri instead of uri
    };

    try {
      await playTrack(episodeAsTrack);
    } catch (error) {
      toast.warning('This episode requires Spotify Premium for playback. Podcasts typically don\'t have preview clips.');
    }
  };

  const handlePlayShow = async () => {
    if (!show || !show.episodes || show.episodes.items.length === 0) return;

    // Play the first episode
    const firstEpisode = show.episodes.items[0];
    await handleEpisodeClick(firstEpisode.id);
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getEpisodeStatus = (episode: ShowData['episodes']['items'][0]): string => {
    if (episode.resume_point?.fully_played) {
      return 'Finished';
    }
    if (episode.resume_point?.resume_position_ms && episode.resume_point.resume_position_ms > 0) {
      return 'In progress';
    }
    return 'New';
  };

  if (loading) {
    return (
      <Stack direction="column" spacing="lg" className="p-8">
        {/* Show Header Skeleton */}
        <Stack direction="row" spacing="lg" align="end">
          <Skeleton variant="rectangular" width="232px" height="232px" />
          <Stack direction="column" spacing="md">
            <Skeleton variant="text" width="80px" height="20px" />
            <Skeleton variant="text" width="350px" height="60px" />
            <Skeleton variant="text" width="200px" height="20px" />
          </Stack>
        </Stack>

        {/* Action Buttons Skeleton */}
        <Stack direction="row" spacing="md" align="center">
          <Skeleton variant="rectangular" width="120px" height="48px" />
          <Skeleton variant="rectangular" width="48px" height="48px" />
        </Stack>

        {/* Episodes List Skeleton */}
        <Stack direction="column" spacing="md">
          <Skeleton variant="text" width="20%" height="28px" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Stack key={i} direction="row" spacing="md" align="center">
              <Skeleton variant="rectangular" width="120px" height="120px" />
              <Stack direction="column" spacing="xs" style={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height="20px" />
                <Skeleton variant="text" width="90%" height="16px" />
                <Stack direction="row" spacing="xs" align="center">
                  <Skeleton variant="text" width="80px" height="14px" />
                  <Skeleton variant="text" width="80px" height="14px" />
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  }

  if (error || !show) {
    return (
      <Stack direction="column" spacing="lg">
        <Typography variant="heading" size="xl" color="inverse">
          Failed to load show
        </Typography>
        <Typography variant="body" color="muted">
          {error}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="column" className="pb-8">
      {/* Show Banner */}
      <Stack
        direction="column"
        spacing="lg"
        style={{
          background: `linear-gradient(to bottom, ${colors.primary.black} 0%, ${colors.grey.grey1} 50%, ${colors.primary.black} 100%)`,
        }}
      >
        <Stack direction="column" spacing="xs">
          <Banner
            type="podcast"
            image={show.images?.[0]?.url || ''}
            title={show.name}
            subtitle={show.publisher || 'Podcast'}
            description={show.description}
          />
        </Stack>

        {/* Action Buttons Row */}
        <Stack direction="row" spacing="md" align="center">
          <Stack direction="row" spacing="lg" align="center">
            <Button
              text={isFollowing ? 'Following' : 'Follow'}
              onClick={handleFollow}
              variant={isFollowing ? ButtonVariant.Secondary : ButtonVariant.White}
              size={ButtonSize.Medium}
            />
            <Button
              onClick={() => {}}
              variant={ButtonVariant.Text}
              size={ButtonSize.Medium}
              icon={<Icon icon={faEllipsis} color="primary" size="lg" />}
              aria-label="More options"
            />
          </Stack>
        </Stack>
      </Stack>

      {/* About Section */}
      {show.description && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            About
          </Typography>
          <Typography variant="body" size="sm" color="muted">
            {show.description}
          </Typography>
          {/* Tags - Mock data for now, can be enhanced with actual tags from API if available */}
          <Stack direction="row" spacing="sm">
            <Pill label="How-to" size="md" />
            <Pill label="Personal stories" size="md" />
            <Pill label="Self-help" size="md" />
          </Stack>
        </Stack>
      )}

      {/* All Episodes Section */}
      {show.episodes.items.length > 0 && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            All Episodes
          </Typography>

          <Stack direction="column">
            <Table<EpisodeTableRow>
              columns={[
                {
                  align: 'left',
                  key: 'trackNumber',
                  label: '#',
                  renderCell: (row: EpisodeTableRow) => (
                    <Stack direction="row" align="center">
                      {hoveredIndex === row.index ? (
                        <Icon
                          icon={faPlay}
                          size="sm"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEpisodeClick(row.id);
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
                  renderCell: (row: EpisodeTableRow) => (
                    <Stack direction="row" spacing="md" align="center">
                      <Image
                        src={row.episodeImage || row.showImage || ''}
                        alt={row.title}
                        size="sm"
                      />
                      <Stack direction="column" spacing="xs">
                        <Typography
                          variant="body"
                          size="sm"
                          weight="medium"
                          color="primary"
                        >
                          {row.title}
                        </Typography>
                        <Typography variant="caption" size="sm" color="muted">
                          {row.showName}
                        </Typography>
                        {row.description && (
                          <Typography
                            variant="caption"
                            size="sm"
                            color="muted"
                          >
                            {row.description}
                          </Typography>
                        )}
                        {row.isFinished && (
                          <Stack direction="row" spacing="xs" align="center">
                            <Icon icon={faCheckCircle} size="sm" color={colors.primary.brand} />
                            <Typography variant="caption" size="sm" color="muted">
                              {row.status}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  ),
                  width: 'auto',
                },
                {
                  align: 'left',
                  key: 'date',
                  label: 'Date',
                  renderCell: (row: EpisodeTableRow) => (
                    <Typography variant="body" size="sm" color="muted">
                      {row.date}
                    </Typography>
                  ),
                  width: 'auto',
                },
                {
                  align: 'right',
                  key: 'duration',
                  label: <Icon icon={faClock} size="sm" color="muted" />,
                  renderCell: (row: EpisodeTableRow) => (
                    <Typography variant="body" size="sm" color="muted">
                      {row.duration}
                    </Typography>
                  ),
                  width: '60px',
                },
              ]}
              data={show.episodes.items.map((episode, index) => {
                const status = getEpisodeStatus(episode);
                const isFinished = status === 'Finished';

                return {
                  id: episode.id,
                  index: index,
                  trackNumber: index + 1,
                  title: episode.name,
                  showName: show.name,
                  description: episode.description,
                  episodeImage: episode.images?.[0]?.url,
                  showImage: show.images?.[0]?.url,
                  date: formatDate(episode.release_date),
                  duration: formatDuration(episode.duration_ms),
                  isFinished,
                  status,
                };
              })}
              onRowClick={(row: EpisodeTableRow) => handleEpisodeClick(row.id)}
              onRowHover={(row: EpisodeTableRow, index?: number) =>
                setHoveredIndex(index ?? row.index)
              }
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
