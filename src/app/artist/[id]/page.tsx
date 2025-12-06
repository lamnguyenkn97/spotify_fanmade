'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Stack,
  Typography,
  Banner,
  Icon,
  colors,
  Card,
  Pill,
  Table,
  Image,
  Skeleton,
} from 'spotify-design-system';
import { faPlay, faShuffle, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/navigation';
import { DiscographyFilterType, AlbumType } from '@/types';

interface ArtistData {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  avatar?: string | null; // Avatar/profile picture URL
  cover?: string | null; // Cover/banner image URL
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
  verified?: boolean;
  topTracks: Array<{
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
    popularity: number;
  }>;
  albums: Array<{
    id: string;
    name: string;
    images: Array<{ url: string }>;
    release_date: string;
    album_type: string;
    total_tracks: number;
  }>;
}

export default function ArtistPage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<DiscographyFilterType>(
    DiscographyFilterType.POPULAR_RELEASES
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchArtist = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spotify/artist/${params.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch artist');
        }

        const data = await response.json();
        setArtist(data);
      } catch (err: unknown) {

        const errorMessage = err instanceof Error ? err.message : 'Failed to load artist';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [params.id]);

  const handlePlay = () => {
    // TODO: Connect to music player when built
  };

  const handleShuffle = () => {
    // TODO: Connect to music player when built
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow functionality
  };

  const handleTrackClick = (track: any) => {
    // TODO: Connect to music player when built
  };

  const handleAlbumClick = (albumId: string) => {
    router.push(`/playlist/${albumId}`);
  };

  const formatListeners = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(0)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const getAlbumSubtitle = (album: ArtistData['albums'][0]): string => {
    const year = album.release_date?.split('-')[0] || '';
    const type = album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1);
    return year ? `${year} • ${type}` : type;
  };

  // Filter albums based on selected filter
  const getFilteredAlbums = (): ArtistData['albums'] => {
    if (!artist) return [];

    switch (selectedFilter) {
      case DiscographyFilterType.ALBUMS:
        return artist.albums.filter((album) => album.album_type === AlbumType.ALBUM);
      case DiscographyFilterType.SINGLES_AND_EPS:
        return artist.albums.filter(
          (album) => album.album_type === AlbumType.SINGLE || album.album_type === AlbumType.EP
        );
      case DiscographyFilterType.COMPILATIONS:
        return artist.albums.filter((album) => album.album_type === AlbumType.COMPILATION);
      case DiscographyFilterType.POPULAR_RELEASES:
      default:
        // For popular releases, return all albums (already sorted by release date, latest first)
        return artist.albums;
    }
  };

  if (loading) {
    return (
      <Stack direction="column" spacing="lg" className="p-8">
        {/* Artist Header Skeleton */}
        <Stack direction="row" spacing="lg" align="end">
          <Skeleton variant="circular" width="232px" height="232px" />
          <Stack direction="column" spacing="md">
            <Skeleton variant="text" width="60px" height="20px" />
            <Skeleton variant="text" width="300px" height="60px" />
            <Skeleton variant="text" width="200px" height="20px" />
          </Stack>
        </Stack>

        {/* Action Buttons Skeleton */}
        <Stack direction="row" spacing="md">
          <Skeleton variant="rectangular" width="120px" height="48px" />
          <Skeleton variant="rectangular" width="120px" height="48px" />
          <Skeleton variant="rectangular" width="48px" height="48px" />
        </Stack>

        {/* Popular Tracks Skeleton */}
        <Stack direction="column" spacing="md">
          <Skeleton variant="text" width="20%" height="28px" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Stack key={i} direction="row" spacing="md" align="center">
              <Skeleton variant="text" width="30px" height="20px" />
              <Skeleton variant="rectangular" width="40px" height="40px" />
              <Stack direction="column" spacing="xs" style={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height="16px" />
                <Skeleton variant="text" width="30%" height="14px" />
              </Stack>
              <Skeleton variant="text" width="50px" height="14px" />
            </Stack>
          ))}
        </Stack>

        {/* Discography Skeleton */}
        <Stack direction="column" spacing="md">
          <Skeleton variant="text" width="25%" height="28px" />
          <Stack direction="row" spacing="md">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" width="180px" height="180px" />
            ))}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (error || !artist) {
    return (
      <Stack direction="column" spacing="lg" className="p-8">
        <Typography variant="heading" size="xl" color="inverse">
          Failed to load artist
        </Typography>
        <Typography variant="body" color="muted">
          {error}
        </Typography>
      </Stack>
    );
  }

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    track: ArtistData['topTracks'][0];
  }

  // Transform top tracks to match Table format
  const trackTableData: TrackTableRow[] = artist.topTracks.map((track, index) => ({
    id: track.id,
    index: index,
    trackNumber: index + 1,
    title: track.name,
    artists: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
    albumImage: track.album.images?.[2]?.url || track.album.images?.[0]?.url || '',
    duration: formatDuration(track.duration_ms),
    explicit: track.explicit,
    hasVideo: !!(track.external_urls?.spotify && track.preview_url),
    track: track,
  }));

  return (
    <Stack direction="column" className="w-full min-w-0 pb-8">
      {/* Artist Banner */}
      <Stack
        direction="column"
        spacing="lg"
        className="w-full min-w-0"
        style={{
          background: `linear-gradient(to bottom, ${colors.primary.black} 0%, ${colors.grey.grey1} 50%, ${colors.primary.black} 100%)`,
        }}
      >
        <Stack direction="column" spacing="xs" className="relative">
          <Banner
            type="artist"
            image={artist.avatar || artist.images?.[0]?.url || ''}
            title={artist.name}
            description={`${formatListeners(artist.followers.total)} monthly listeners`}
          />
        </Stack>

        {/* Action Buttons Row */}
        <Stack direction="row" spacing="md" align="center" className="px-8 pb-6">
          <Stack direction="row" spacing="lg" align="center">
            <Icon
              icon={faPlay}
              size="md"
              color={'black'}
              circular
              backgroundColor={colors.primary.brand}
              onClick={handlePlay}
            />
            <Icon
              icon={faShuffle}
              onClick={handleShuffle}
              aria-label="Shuffle"
              color={'white'}
              size="lg"
            />
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-full font-bold text-sm border-2 transition-colors ${
                isFollowing
                  ? 'bg-transparent border-white text-white hover:border-gray-400 hover:text-gray-400'
                  : 'bg-transparent border-gray-400 text-white hover:border-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <Icon
              icon={faEllipsis}
              onClick={() => {}}
              aria-label="More options"
              color={'white'}
              size="lg"
            />
          </Stack>
        </Stack>
      </Stack>

      {/* Popular Section */}
      {artist.topTracks.length > 0 && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Popular
          </Typography>
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
                            handleTrackClick(row.track);
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
                    <Typography variant="body" size="sm" color="muted">
                      {row.duration}
                    </Typography>
                  ),
                  width: '100px',
                },
              ]}
              data={trackTableData}
              onRowClick={(row: TrackTableRow) => handleTrackClick(row.track)}
              onRowHover={(row: TrackTableRow, index?: number) =>
                setHoveredIndex(index ?? row.index)
              }
            />
          </Stack>
        </Stack>
      )}

      {/* Discography Section */}
      {artist.albums.length > 0 && (
        <Stack direction="column" spacing="md" className="px-8 pt-8 pb-8">
          <Stack direction="row" justify="space-between" align="center">
            <Typography variant="heading" size="xl" weight="bold" color="primary">
              Discography
            </Typography>
          </Stack>

          {/* Filter Buttons */}
          <Stack direction="row" spacing="sm" align="center">
            <Pill
              label={DiscographyFilterType.POPULAR_RELEASES}
              size="md"
              selected={selectedFilter === DiscographyFilterType.POPULAR_RELEASES}
              onClick={() => setSelectedFilter(DiscographyFilterType.POPULAR_RELEASES)}
            />
            <Pill
              label={DiscographyFilterType.ALBUMS}
              size="md"
              selected={selectedFilter === DiscographyFilterType.ALBUMS}
              onClick={() => setSelectedFilter(DiscographyFilterType.ALBUMS)}
            />
            <Pill
              label={DiscographyFilterType.SINGLES_AND_EPS}
              size="md"
              selected={selectedFilter === DiscographyFilterType.SINGLES_AND_EPS}
              onClick={() => setSelectedFilter(DiscographyFilterType.SINGLES_AND_EPS)}
            />
            <Pill
              label={DiscographyFilterType.COMPILATIONS}
              size="md"
              selected={selectedFilter === DiscographyFilterType.COMPILATIONS}
              onClick={() => setSelectedFilter(DiscographyFilterType.COMPILATIONS)}
            />
          </Stack>

          {/* Album Cards */}
          <Stack
            direction="row"
            spacing="md"
            className="overflow-x-auto overflow-y-visible pb-4 -mx-8 px-8 scrollbar-hide"
          >
            <Stack direction="row" spacing="md" className="min-w-max">
              {getFilteredAlbums().map((album) => (
                <Stack
                  key={album.id}
                  direction="column"
                  className="flex-shrink-0"
                  style={{ width: '180px' }}
                >
                  <Card
                    title={album.name}
                    subtitle={getAlbumSubtitle(album)}
                    imageUrl={album.images?.[0]?.url || ''}
                    variant="default"
                    onClick={() => handleAlbumClick(album.id)}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
