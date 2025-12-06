'use client';

import React from 'react';
import { Button, ButtonSize, ButtonVariant, Card, Stack, Typography, HorizontalTileCard, Skeleton } from 'spotify-design-system';
import { useRouter } from 'next/navigation';
import { TimeRange, NUMBER_OF_DISPLAYED_ITEMS, SpotifyUser, SpotifyTrackWithContext, SpotifyPlaylist, SpotifyArtist, SpotifyAlbum, SpotifyShow } from '@/types';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { convertTrackToCurrentTrack } from '@/utils/trackHelpers';
import { useToast } from '@/contexts/ToastContext';
import { getBestImageUrl } from '@/utils/imageHelpers';
import {
  useRecentlyPlayed,
  useSavedTracks,
  useMyPlaylists,
  useTopArtists,
  useTopAlbums,
  useMyShows,
} from '@/hooks/api';

interface AuthenticatedHomePageProps {
  user: SpotifyUser;
}


export const AuthenticatedHomePage: React.FC<AuthenticatedHomePageProps> = ({ user }) => {
  const router = useRouter();
  const { playTrack } = useMusicPlayerContext();
  const toast = useToast();

  // Use SWR hooks for data fetching
  const { tracks: recentTracks, isLoading: recentLoading, hasPermissionError: recentTracksPermissionError } = useRecentlyPlayed(50);
  const { tracks: likedTracksRaw, isLoading: likedLoading } = useSavedTracks(20);
  const { playlists: userPlaylists, isLoading: playlistsLoading } = useMyPlaylists();
  const { artists: topArtists, isLoading: artistsLoading } = useTopArtists({ time_range: TimeRange.SHORT_TERM });
  const { albums: topAlbums, isLoading: albumsLoading } = useTopAlbums({ time_range: TimeRange.SHORT_TERM });
  const { shows: rawShows, isLoading: showsLoading } = useMyShows();

  // Transform liked tracks to match SpotifyTrackWithContext format
  const likedTracks: SpotifyTrackWithContext[] = likedTracksRaw.map((item) => ({
    track: item.track,
    played_at: item.added_at || new Date().toISOString(),
  }));

  // Extract shows from the saved shows format
  const userShows: SpotifyShow[] = rawShows.map((item: any) => item.show || item);

  // Overall loading state
  const loading = recentLoading || likedLoading || playlistsLoading || artistsLoading || albumsLoading || showsLoading;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };


  const handleTrackClick = async (track: SpotifyTrackWithContext['track']) => {
    // Convert the track to CurrentTrack format and play it
    const currentTrack = convertTrackToCurrentTrack({
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: {
        name: track.album.name,
        images: track.album.images,
      },
      duration_ms: track.duration_ms || 0,
      preview_url: track.preview_url || null,
      external_urls: track.external_urls,
    });
    
    try {
      await playTrack(currentTrack);
    } catch (error) {
      // Show user-friendly error message
      if (!track.preview_url) {
        toast.warning('This track requires Spotify Premium for full playback. Preview not available.');
      } else {
        toast.error('Unable to play this track. Please try again.');
      }
    }
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

  const handleShowClick = (showId: string) => {
    router.push(`/show/${showId}`);
  };

  if (loading) {
    return (
      <Stack direction="column" spacing="lg" className="p-6">
        {/* Greeting Skeleton */}
        <Skeleton variant="text" width="40%" height="36px" />

        {/* Made for you - Liked Songs Skeleton */}
        <Stack direction="column" spacing="md">
          <Skeleton variant="text" width="20%" height="28px" />
          <Skeleton variant="rectangular" width="400px" height="80px" />
        </Stack>

        {/* Your Playlists Skeleton */}
        <Stack direction="column" spacing="md">
          <Skeleton variant="text" width="20%" height="28px" />
          <Stack direction="row" spacing="md">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width="400px" height="80px" />
            ))}
          </Stack>
        </Stack>

        {/* Recently Played Skeleton */}
        <Stack direction="column" spacing="md">
          <Skeleton variant="text" width="25%" height="28px" />
          <Stack direction="row" spacing="md">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" width="180px" height="180px" />
            ))}
          </Stack>
        </Stack>

        {/* Top Artists Skeleton */}
        <Stack direction="column" spacing="md">
          <Skeleton variant="text" width="35%" height="28px" />
          <Stack direction="row" spacing="md">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="circular" width="180px" height="180px" />
            ))}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack direction="column" spacing="lg" className="p-6">
        <Typography variant="heading" color="primary">
          Oops! Something went wrong
        </Typography>
        <Typography variant="body" color="muted">
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
      <Stack direction="column" spacing="md">
        <Typography variant="title" size="2xl" weight="bold" color="primary">
          {getGreeting()}, {user.displayName || 'there'}
        </Typography>
      </Stack>

      {/* Liked Songs Playlist */}
      {likedTracks.length > 0 && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Made for you
          </Typography>
          <Stack direction="row" spacing="md" className="flex-wrap">
            <Stack className="w-[400px] flex-shrink-0">
              <HorizontalTileCard
                title="Liked Songs"
                image={likedTracks[0]?.track?.album?.images?.[0]?.url || ''}
                subtitle={`Playlist • ${likedTracks.length}${likedTracks.length >= 20 ? '+' : ''} songs`}
                size="large"
                width="400px"
                onClick={() => router.push('/playlist/liked-songs')}
              />
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* Your Playlists Section */}
      {userPlaylists.length > 0 && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Your Playlists
          </Typography>
          <Stack direction="row" spacing="md" className="flex-wrap">
            {userPlaylists.map((playlist) => (
              <Stack key={playlist.id} className="w-[400px] flex-shrink-0">
                <HorizontalTileCard
                  title={playlist.name}
                  image={getBestImageUrl(playlist.images)}
                  subtitle={`Playlist • ${playlist.tracks.total} songs`}
                  size="large"
                  width="400px"
                  onClick={() => handlePlaylistClick(playlist.id)}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Recently Played Section */}
      <Stack direction="column" spacing="md">
        <Typography variant="heading" size="xl" weight="bold" color="primary">
          Recently Played
        </Typography>
        {recentTracks.length > 0 ? (
          <Stack
            direction="row"
            spacing="md"
            className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
          >
            {recentTracks.slice(0, NUMBER_OF_DISPLAYED_ITEMS).map((item) => (
              <Stack key={item.track.id} direction="column" className="flex-shrink-0 w-[180px]">
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
        ) : (
          <Stack direction="column" spacing="xs">
            <Typography variant="body" size="sm" color="muted">
              {recentTracksPermissionError
                ? 'Permissions missing for recently played tracks'
                : 'No recently played tracks available'}
            </Typography>
            {recentTracksPermissionError && (
              <Typography variant="caption" size="sm" color="muted">
                Please log out and log back in to grant access to your recently played tracks.
              </Typography>
            )}
          </Stack>
        )}
      </Stack>

      {/* Your Top Artists Section */}
      {topArtists.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Your Top Artists This Month
          </Typography>
          <Stack
            direction="row"
            spacing="md"
            className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
          >
            {topArtists.slice(0, NUMBER_OF_DISPLAYED_ITEMS).map((artist) => (
              <Stack key={artist.id} direction="column" className="flex-shrink-0 w-[180px]">
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
      )}

      {/* Top Albums Section */}
      {topAlbums.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Top Albums This Month
          </Typography>
          <Stack
            direction="row"
            spacing="md"
            className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide"
          >
            {topAlbums.slice(0, NUMBER_OF_DISPLAYED_ITEMS).map((album) => (
              <Stack key={album.id} direction="column" className="flex-shrink-0 w-[180px]">
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
      )}

      {/* Your Shows Section */}
      {userShows.length > 0 && (
        <Stack direction="column" spacing="md">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Your Shows
          </Typography>
          <Stack direction="row" spacing="md" className="flex-wrap">
            {userShows.map((show) => (
              <Stack key={show.id} className="w-[400px] flex-shrink-0">
                <HorizontalTileCard
                  title={show.name}
                  image={getBestImageUrl(show.images)}
                  subtitle={`Podcast • ${show.publisher || 'Show'}`}
                  size="large"
                  width="400px"
                  onClick={() => handleShowClick(show.id)}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Empty state if no data */}
      {likedTracks.length === 0 && recentTracks.length === 0 && userPlaylists.length === 0 && topArtists.length === 0 && topAlbums.length === 0 && userShows.length === 0 && (
        <Stack direction="column" spacing="md" justify="center">
          <Typography variant="heading" size="xl" color="primary">
            Start exploring music!
          </Typography>
          <Typography variant="body" color="muted">
            Your personalized recommendations will appear here as you listen.
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
