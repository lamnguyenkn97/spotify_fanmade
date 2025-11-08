'use client';

import React, { useEffect, useState } from 'react';
import { Button, ButtonSize, ButtonVariant, Card, Stack, Typography, HorizontalTileCard } from 'spotify-design-system';
import { useRouter } from 'next/navigation';

interface User {
  displayName: string;
  email: string;
}

interface Track {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
    };
  };
  played_at: string;
}

interface Playlist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
}

interface Album {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  artist_name?: string;
  artists?: Array<{ name: string }>;
}

interface AuthenticatedHomePageProps {
  user: User;
}

export const NUMBER_OF_DISPLAYED_ITEMS = 5;

export const AuthenticatedHomePage: React.FC<AuthenticatedHomePageProps> = ({ user }) => {
  const router = useRouter();
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPersonalizedData();
  }, []);

  const fetchPersonalizedData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel for better performance
      const [recentResponse, playlistsResponse, artistsResponse, albumsResponse] = await Promise.all([
        fetch('/api/spotify/recently-played'),
        fetch('/api/spotify/my-playlists'),
        fetch('/api/spotify/top-artists?time_range=short_term'),
        fetch('/api/spotify/top-albums?time_range=short_term'),
      ]);

      if (!recentResponse.ok || !playlistsResponse.ok || !artistsResponse.ok || !albumsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [recentData, playlistsData, artistsData, albumsData] = await Promise.all([
        recentResponse.json(),
        playlistsResponse.json(),
        artistsResponse.json(),
        albumsResponse.json(),
      ]);

      setRecentTracks(recentData.items || []);
      setUserPlaylists(playlistsData.items || []);
      setTopArtists(artistsData.items || []);
      setTopAlbums(albumsData.items || []);
    } catch (err: any) {
      console.error('Error fetching personalized data:', err);
      setError(err.message || 'Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getBestImageUrl = (images: Array<{ url: string; height: number; width: number }>) => {
    if (!images || images.length === 0) return '';
    // Get medium-sized image (around 300px) or fallback to first available
    return (
      images.find((img) => img.height && img.height >= 200 && img.height <= 400)?.url ||
      images[0]?.url ||
      ''
    );
  };

  const handleTrackClick = (track: Track['track']) => {
    console.log('Play track:', track.name);
    // TODO: Implement play functionality when music player is ready
  };

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  const handleArtistClick = (artistId: string) => {
    router.push(`/artist/${artistId}`);
  };

  const handleAlbumClick = (albumId: string) => {
    router.push(`/playlist/${albumId}`);
  };

  if (loading) {
    return (
      <Stack direction="column" spacing="lg" className="p-6">
        <Typography variant="heading" className="text-white">
          Loading your music...
        </Typography>
        {/* TODO: Add skeleton loaders */}
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack direction="column" spacing="lg" className="p-6">
        <Typography variant="heading" className="text-white">
          Oops! Something went wrong
        </Typography>
        <Typography variant="body" className="text-gray-400">
          {error}
        </Typography>
        <Button
          onClick={fetchPersonalizedData}
          text="Try Again"
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
        />
      </Stack>
    );
  }

  return (
    <Stack direction="column" spacing="lg" className="p-6">
      {/* Greeting */}
      <Typography variant="title" size="2xl" weight="bold" color="primary" className="mb-4">
        {getGreeting()}, {user.displayName || 'there'}
      </Typography>

      {/* Your Playlists Section */}
      {userPlaylists.length > 0 && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Your Playlists
          </Typography>
          <Stack
            direction="row"
            spacing="md"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {userPlaylists.map((playlist) => (
              <HorizontalTileCard
                key={playlist.id}
                title={playlist.name}
                image={getBestImageUrl(playlist.images)}
                subtitle={`Playlist • ${playlist.tracks.total} songs`}
                size="large"
                width="100%"
                onClick={() => handlePlaylistClick(playlist.id)}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {/* Recently Played Section */}
      {recentTracks.length > 0 && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Recently Played
          </Typography>
          <Stack
            direction="row"
            className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
          >
            <Stack direction="row" spacing="md" className="min-w-max">
              {recentTracks.slice(0, NUMBER_OF_DISPLAYED_ITEMS).map((item, index) => (
                <Stack
                  key={item.track.id}
                  direction="column"
                  className="flex-shrink-0"
                  style={{ width: '180px' }}
                >
                  <Card
                    title={item.track.name}
                    subtitle={item.track.artists[0]?.name || 'Unknown Artist'}
                    imageUrl={getBestImageUrl(item.track.album.images)}
                    variant="default"
                    onClick={() => handleTrackClick(item.track)}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* Your Top Artists Section */}
      {topArtists.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Your Top Artists This Month
          </Typography>
          <Stack
            direction="row"
            className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
          >
            <Stack direction="row" spacing="md" className="min-w-max">
              {topArtists.slice(0, NUMBER_OF_DISPLAYED_ITEMS).map((artist) => (
                <Stack
                  key={artist.id}
                  direction="column"
                  className="flex-shrink-0"
                  style={{ width: '180px' }}
                >
                  <Card
                    title={artist.name}
                    subtitle="Artist"
                    imageUrl={getBestImageUrl(artist.images)}
                    variant="artist"
                    onClick={() => handleArtistClick(artist.id)}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* Top Albums Section */}
      {topAlbums.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Top Albums This Month
          </Typography>
          <Stack
            direction="row"
            className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
          >
            <Stack direction="row" spacing="md" className="min-w-max">
              {topAlbums.slice(0, NUMBER_OF_DISPLAYED_ITEMS).map((album) => (
                <Stack
                  key={album.id}
                  direction="column"
                  className="flex-shrink-0"
                  style={{ width: '180px' }}
                >
                  <Card
                    title={album.name}
                    subtitle={album.artist_name || album.artists?.[0]?.name || 'Unknown Artist'}
                    imageUrl={getBestImageUrl(album.images)}
                    variant="default"
                    onClick={() => handleAlbumClick(album.id)}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* Empty state if no data */}
      {recentTracks.length === 0 && userPlaylists.length === 0 && topArtists.length === 0 && topAlbums.length === 0 && (
        <Stack direction="column" spacing="md" justify={'center'}>
          <Typography variant="heading" className="text-white text-2xl">
            Start exploring music!
          </Typography>
          <Typography variant="body" className="text-gray-400">
            Your personalized recommendations will appear here as you listen.
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
