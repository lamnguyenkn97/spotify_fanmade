'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Typography, Banner, Icon, colors, Card, Pill } from 'spotify-design-system';
import { TrackTable } from '@/components';
import { faPlay, faShuffle, faEllipsis, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
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
      } catch (err: any) {
        console.error('Error fetching artist:', err);
        setError(err.message || 'Failed to load artist');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [params.id]);

  const handlePlay = () => {
    console.log('Play artist top tracks');
    // TODO: Connect to music player when built
  };

  const handleShuffle = () => {
    console.log('Shuffle artist tracks');
    // TODO: Connect to music player when built
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow functionality
  };

  const handleTrackClick = (track: any) => {
    console.log('Play track:', track.name);
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
        <Typography variant="heading" size="xl" color="inverse">
          Loading artist...
        </Typography>
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

  // Transform top tracks to match TrackTable format
  const trackTableData = artist.topTracks.map((track, index) => ({
    track: {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      external_urls: track.external_urls,
      preview_url: track.preview_url,
    },
    added_at: new Date().toISOString(),
  }));

  return (
    <Stack direction="column" className="w-full min-w-0">
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
              onClick={() => console.log('More options')}
              aria-label="More options"
              color={'white'}
              size="lg"
            />
          </Stack>
        </Stack>
      </Stack>

      {/* Popular Section */}
      {artist.topTracks.length > 0 && (
        <Stack direction="column" spacing="md" className="px-8 pt-8">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Popular
          </Typography>
          <TrackTable tracks={trackTableData} onTrackClick={handleTrackClick} />
        </Stack>
      )}

      {/* Discography Section */}
      {artist.albums.length > 0 && (
        <Stack direction="column" spacing="md" className="px-8 pt-8 pb-8">
          <Stack direction="row" justify="space-between" align="center">
            <Typography variant="heading" size="xl" weight="bold" color="primary">
              Discography
            </Typography>
            <Typography
              variant="body"
              size="sm"
              color="muted"
              className="hover:text-white cursor-pointer"
            >
              Show all
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
