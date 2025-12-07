'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Stack,
  Typography,
  Card,
  Table,
  Pill,
  colors,
  Skeleton,
  borderRadius,
  Image,
} from 'spotify-design-system';
import { SpotifySearchResults, TrackTableRow } from '@/types';
import { getBestImageUrl } from '@/utils/imageHelpers';
import { formatDuration } from '@/utils/formatHelpers';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SpotifySearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(searchQuery)}&limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        // API request failed, show no results
        setResults(null);
      }
    } catch (error) {
      // Network error or request failed, show no results
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial search on mount if query exists, and update when query changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
      if (urlQuery) {
        performSearch(urlQuery);
      } else {
        setResults(null);
      }
    } else if (query && !results) {
      performSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  const handleTrackClick = (track: any) => {
    // Navigate to album/playlist page if available
    if (track.album?.id) {
      router.push(`/playlist/${track.album.id}`);
    }
  };

  const handleArtistClick = (artistId: string) => {
    router.push(`/artist/${artistId}`);
  };

  const handleAlbumClick = (albumId: string) => {
    router.push(`/playlist/${albumId}`);
  };

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  const handleShowClick = (showId: string) => {
    router.push(`/show/${showId}`);
  };

  // Transform tracks for table
  const trackTableRows: TrackTableRow[] =
    results?.tracks
      .filter((track) => track && track.id && track.name)
      .map((track, index) => ({
        id: track.id,
        index: index + 1,
        trackNumber: index + 1,
        title: track.name || 'Unknown Track',
        artists: track.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
        album: track.album?.name || '',
        albumImage: getBestImageUrl(track.album?.images || []),
        duration: formatDuration(track.duration_ms || 0),
        explicit: track.explicit || false,
        track,
      })) || [];

  const trackColumns = [
    {
      key: 'trackNumber' as keyof TrackTableRow,
      label: '#',
      width: '48px',
      align: 'left' as const,
      renderCell: (row: TrackTableRow, index?: number) => (
        <Typography variant="body" size="sm" color="muted">
          {hoveredTrackIndex === (index ?? row.index) ? '▶' : row.trackNumber}
        </Typography>
      ),
    },
    {
      key: 'title' as keyof TrackTableRow,
      label: 'Title',
      width: 'auto',
      align: 'left' as const,
      renderCell: (row: TrackTableRow) => (
        <Stack direction="row" spacing="sm" align="center">
          {row.albumImage && (
            <Image
              src={row.albumImage}
              alt={row.album}
              variant="default"
              className="w-10 h-10 rounded flex-shrink-0"
            />
          )}
          <Stack direction="column" spacing="xs">
            <Typography variant="body" size="sm" weight="medium" color="primary">
              {row.title}
            </Typography>
            <Typography variant="caption" size="sm" color="muted">
              {row.artists}
            </Typography>
          </Stack>
          {row.explicit && (
            <Pill 
              label="E" 
              size="sm"
              title="Explicit"
            />
          )}
        </Stack>
      ),
    },
    {
      key: 'album' as keyof TrackTableRow,
      label: 'Album',
      width: 'auto',
      align: 'left' as const,
      renderCell: (row: TrackTableRow) => (
        <Typography variant="body" size="sm" color="muted">
          {row.album}
        </Typography>
      ),
    },
    {
      key: 'duration' as keyof TrackTableRow,
      label: '',
      width: '60px',
      align: 'right' as const,
      renderCell: (row: TrackTableRow) => (
        <Typography variant="body" size="sm" color="muted" className="text-right">
          {row.duration}
        </Typography>
      ),
    },
  ];

  return (
      <Stack
        direction="column"
        spacing="lg"
        className="pb-8 px-8 pt-6 min-h-screen"
        style={{ backgroundColor: colors.primary.black }}
      >

      {loading && (
        <Stack direction="column" spacing="lg">
          {/* Songs section skeleton */}
          <Stack direction="column" spacing="md">
            <Skeleton variant="text" width="20%" height="32px" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Stack key={i} direction="row" spacing="md" align="center">
                <Skeleton variant="text" width="40px" height="20px" />
                <Skeleton variant="rectangular" width="40px" height="40px" />
                <Stack direction="column" spacing="xs" className="flex-1">
                  <Skeleton variant="text" width="40%" height="16px" />
                  <Skeleton variant="text" width="30%" height="14px" />
                </Stack>
                <Skeleton variant="text" width="10%" height="14px" />
              </Stack>
            ))}
          </Stack>

          {/* Artists section skeleton */}
          <Stack direction="column" spacing="md">
            <Skeleton variant="text" width="15%" height="32px" />
            <Stack direction="row" spacing="md">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="circular" width="180px" height="180px" />
              ))}
            </Stack>
          </Stack>

          {/* Albums section skeleton */}
          <Stack direction="column" spacing="md">
            <Skeleton variant="text" width="15%" height="32px" />
            <Stack direction="row" spacing="md">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rectangular" width="180px" height="180px" className="rounded-lg" />
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}

      {!loading && !results && query && (
        <Stack direction="column" spacing="md" align="center">
          <Typography variant="body" color="muted">
            No results found
          </Typography>
        </Stack>
      )}

      {!loading && !query && (
        <Stack direction="column" spacing="md" align="center">
          <Typography variant="heading" size="lg" color="primary">
            Search for songs, artists, albums, and more
          </Typography>
        </Stack>
      )}

      {!loading && results && (
        <>
          {/* Songs Section */}
          {results.tracks.length > 0 && (
            <Stack direction="column" spacing="lg">
              <Stack direction="row" align="center" justify="space-between">
                <Typography variant="heading" size="xl" weight="bold" color="primary">
                  Songs
                </Typography>
                {results.tracksTotal > results.tracks.length && (
                  <Typography
                    variant="body"
                    size="sm"
                    color="primary"
                    className="cursor-pointer"
                    onClick={() => {
                    }}
                  >
                    See all ({results.tracksTotal})
                  </Typography>
                )}
              </Stack>
              <Table<TrackTableRow>
                columns={trackColumns}
                data={trackTableRows}
                onRowClick={(row) => handleTrackClick(row.track)}
                onRowHover={(row, index) => setHoveredTrackIndex(index ?? row.index)}
              />
            </Stack>
          )}

          {/* Artists Section */}
          {results.artists.length > 0 && (
            <Stack direction="column" spacing="lg">
              <Stack direction="row" align="center" justify="space-between">
                <Typography variant="heading" size="xl" weight="bold" color="primary">
                  Artists
                </Typography>
                {results.artistsTotal > results.artists.length && (
                  <Typography
                    variant="body"
                    size="sm"
                    color="primary"
                    className="cursor-pointer"
                  >
                    See all ({results.artistsTotal})
                  </Typography>
                )}
              </Stack>
              <Stack
                direction="row"
                spacing="md"
                className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
              >
                {results.artists
                  .filter((artist) => artist && artist.id && artist.name)
                  .map((artist) => (
                    <Stack
                      key={artist.id}
                      direction="column"
                      className="flex-shrink-0 w-[180px] cursor-pointer"
                      onClick={() => handleArtistClick(artist.id)}
                    >
                      <Card
                        title={artist.name || 'Unknown Artist'}
                        subtitle={artist.genres?.slice(0, 2).join(', ') || 'Artist'}
                        imageUrl={getBestImageUrl(artist.images || [])}
                        variant="artist"
                        onClick={() => handleArtistClick(artist.id)}
                      />
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          )}

          {/* Albums Section */}
          {results.albums.length > 0 && (
            <Stack direction="column" spacing="lg">
              <Stack direction="row" align="center" justify="space-between">
                <Typography variant="heading" size="xl" weight="bold" color="primary">
                  Albums
                </Typography>
                {results.albumsTotal > results.albums.length && (
                  <Typography
                    variant="body"
                    size="sm"
                    color="primary"
                    className="cursor-pointer"
                  >
                    See all ({results.albumsTotal})
                  </Typography>
                )}
              </Stack>
              <Stack
                direction="row"
                spacing="md"
                className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
              >
                {results.albums
                  .filter((album) => album && album.id && album.name)
                  .map((album) => (
                    <Stack
                      key={album.id}
                      direction="column"
                      className="flex-shrink-0 w-[180px] cursor-pointer"
                      onClick={() => handleAlbumClick(album.id)}
                    >
                      <Card
                        title={album.name || 'Unknown Album'}
                        subtitle={album.artists?.map((a: any) => a.name).join(', ') || 'Album'}
                        imageUrl={getBestImageUrl(album.images || [])}
                        variant="default"
                        onClick={() => handleAlbumClick(album.id)}
                      />
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          )}

          {/* Playlists Section */}
          {results.playlists.length > 0 && (
            <Stack direction="column" spacing="lg">
              <Stack direction="row" align="center" justify="space-between">
                <Typography variant="heading" size="xl" weight="bold" color="primary">
                  Playlists
                </Typography>
                {results.playlistsTotal > results.playlists.length && (
                  <Typography
                    variant="body"
                    size="sm"
                    color="primary"
                    className="cursor-pointer"
                  >
                    See all ({results.playlistsTotal})
                  </Typography>
                )}
              </Stack>
              <Stack
                direction="row"
                spacing="md"
                className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
              >
                {results.playlists
                  .filter((playlist) => playlist && playlist.id && playlist.name)
                  .map((playlist) => (
                    <Stack
                      key={playlist.id}
                      direction="column"
                      className="flex-shrink-0 w-[180px] cursor-pointer"
                      onClick={() => handlePlaylistClick(playlist.id)}
                    >
                      <Card
                        title={playlist.name || 'Unknown Playlist'}
                        subtitle={`By ${playlist.owner?.display_name || 'Spotify'}`}
                        imageUrl={getBestImageUrl(playlist.images || [])}
                        variant="default"
                        onClick={() => handlePlaylistClick(playlist.id)}
                      />
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          )}

          {/* Podcasts & Shows Section */}
          {results.shows.length > 0 && (
            <Stack direction="column" spacing="lg">
              <Stack direction="row" align="center" justify="space-between">
                <Typography variant="heading" size="xl" weight="bold" color="primary">
                  Podcasts & Shows
                </Typography>
                {results.showsTotal > results.shows.length && (
                  <Typography
                    variant="body"
                    size="sm"
                    color="primary"
                    className="cursor-pointer"
                  >
                    See all ({results.showsTotal})
                  </Typography>
                )}
              </Stack>
              <Stack
                direction="row"
                spacing="md"
                className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
              >
                {results.shows
                  .filter((show) => show && show.id && show.name)
                  .map((show) => (
                    <Stack
                      key={show.id}
                      direction="column"
                      className="flex-shrink-0 w-[180px] cursor-pointer"
                      onClick={() => handleShowClick(show.id)}
                    >
                      <Card
                        title={show.name || 'Unknown Show'}
                        subtitle={show.publisher || 'Podcast'}
                        imageUrl={getBestImageUrl(show.images || [])}
                        variant="default"
                        onClick={() => handleShowClick(show.id)}
                      />
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          )}

          {/* Episodes Section */}
          {results.episodes.length > 0 && (
            <Stack direction="column" spacing="lg">
              <Stack direction="row" align="center" justify="space-between">
                <Typography variant="heading" size="xl" weight="bold" color="primary">
                  Episodes
                </Typography>
                {results.episodesTotal > results.episodes.length && (
                  <Typography
                    variant="body"
                    size="sm"
                    color="primary"
                    className="cursor-pointer"
                  >
                    See all ({results.episodesTotal})
                  </Typography>
                )}
              </Stack>
              <Stack direction="column" spacing="sm">
                {results.episodes
                  .filter((episode) => episode && episode.id && episode.name)
                  .map((episode) => (
                    <Stack
                      key={episode.id}
                      direction="row"
                      spacing="md"
                      align="center"
                      className="cursor-pointer p-2 hover:bg-grey-grey1"
                      style={{ borderRadius: borderRadius.md }}
                      onClick={() => handleShowClick(episode.show?.id || '')}
                    >
                      <Image
                        src={getBestImageUrl(episode.images || [])}
                        alt={episode.name || 'Episode'}
                        variant="default"
                        className="w-15 h-15 rounded flex-shrink-0"
                      />
                      <Stack direction="column" spacing="xs" className="flex-1">
                        <Typography variant="body" size="sm" weight="medium" color="primary">
                          {episode.name || 'Unknown Episode'}
                        </Typography>
                        <Typography variant="caption" size="sm" color="muted">
                          {episode.show?.name || 'Podcast'} • {formatDuration(episode.duration_ms || 0)}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Stack direction="column" spacing="lg" className="p-8">
          {/* Search placeholder */}
          <Skeleton variant="text" width="100%" height="48px" />
          
          {/* Songs section skeleton */}
          <Stack direction="column" spacing="md">
            <Skeleton variant="text" width="20%" height="32px" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Stack key={i} direction="row" spacing="md" align="center">
                <Skeleton variant="rectangular" width="40px" height="40px" />
                <Stack direction="column" spacing="xs" className="flex-1">
                  <Skeleton variant="text" width="40%" height="16px" />
                  <Skeleton variant="text" width="30%" height="14px" />
                </Stack>
                <Skeleton variant="text" width="10%" height="14px" />
              </Stack>
            ))}
          </Stack>

          {/* Artists section skeleton */}
          <Stack direction="column" spacing="md">
            <Skeleton variant="text" width="15%" height="32px" />
            <Stack direction="row" spacing="md">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="circular" width="180px" height="180px" />
              ))}
            </Stack>
          </Stack>
        </Stack>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
