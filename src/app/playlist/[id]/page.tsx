'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Stack, Typography, Skeleton, MessageText, Button, ButtonVariant } from 'spotify-design-system';
import { PlaylistHeader, TrackTable } from '@/components';
import { extractColorsFromImage, ExtractedColors } from '@/utils/colorExtractor';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { convertTracksToQueue } from '@/utils/trackHelpers';
import { useAuthUser, loginWithSpotify } from '@/hooks/api';

interface PlaylistData {
  id: string;
  name: string;
  description?: string;
  images: Array<{ url: string }>;
  owner: {
    display_name: string;
  };
  tracks: {
    total: number;
    items: Array<{
      track: {
        id: string;
        name: string;
        artists: Array<{ name: string }>;
        album: {
          name: string;
          images: Array<{ url: string }>;
        };
        duration_ms: number;
      };
      added_at: string;
    }>;
  };
}

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [gradientColors, setGradientColors] = useState<ExtractedColors | null>(null);
  const { playTrack, setQueue, toggleShuffle, isShuffled } = useMusicPlayerContext();
  const { isAuthenticated } = useAuthUser();

  useEffect(() => {
    if (!params.id) return;

    const fetchPlaylist = async () => {
      setLoading(true);
      setError(null);

      try {
        // Handle special "liked-songs" playlist
        if (params.id === 'liked-songs') {
          // Check authentication before fetching liked songs
          if (!isAuthenticated) {
            setNeedsAuth(true);
            setLoading(false);
            return;
          }

          const response = await fetch('/api/spotify/my-saved-tracks?limit=50');
          if (!response.ok) {
            throw new Error('Failed to fetch liked songs');
          }
          const likedData = await response.json();
          
          // Transform liked tracks to playlist format
          const likedPlaylist: PlaylistData = {
            id: 'liked-songs',
            name: 'Liked Songs',
            description: 'Your liked songs',
            images: likedData.items?.[0]?.track?.album?.images || [],
            owner: {
              display_name: 'You',
            },
            tracks: {
              total: likedData.total || likedData.items?.length || 0,
              items: (likedData.items || []).map((item: any) => ({
                track: item.track,
                added_at: item.added_at || new Date().toISOString(),
              })),
            },
          };
          setPlaylist(likedPlaylist);
          
          // Extract colors from first track's album art
          if (likedData.items?.[0]?.track?.album?.images?.[0]?.url) {
            try {
              const colors = await extractColorsFromImage(likedData.items[0].track.album.images[0].url);
              setGradientColors(colors);
            } catch (colorError) {

              setGradientColors({
                color1: '#121212',
                color2: '#1a1a1a',
              });
            }
          }
          return;
        }

        // Try fetching as playlist first
        let response = await fetch(`/api/spotify/playlist/${params.id}`);
        
        // If playlist fails, try fetching as album
        if (!response.ok) {
          response = await fetch(`/api/spotify/album/${params.id}`);
        }

        if (!response.ok) {
          throw new Error('Failed to fetch playlist or album');
        }

        const data = await response.json();
        setPlaylist(data);

        // Extract colors from cover image
        if (data.images?.[0]?.url) {
          try {
            const colors = await extractColorsFromImage(data.images[0].url);
            setGradientColors(colors);
          } catch (colorError) {

            // Use default colors on error
            setGradientColors({
              color1: '#121212',
              color2: '#1a1a1a',
            });
          }
        }
      } catch (err: unknown) {

        const errorMessage = err instanceof Error ? err.message : 'Failed to load playlist';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [params.id, isAuthenticated, router]);

  const handlePlayPlaylist = async () => {
    if (!playlist || playlist.tracks.items.length === 0) return;

    // Convert tracks to queue format
    const trackList = playlist.tracks.items.map((item) => item.track);
    const queue = convertTracksToQueue(trackList);
    
    // Set the queue
    setQueue(queue);
    
    // Play the first track
    if (queue.length > 0) {
      try {
        await playTrack(queue[0]);
      } catch (error) {
        // Error handling is done in the music player
      }
    }
  };

  const handleShufflePlaylist = async () => {
    if (!playlist || playlist.tracks.items.length === 0) return;

    // Convert tracks to queue format
    const trackList = playlist.tracks.items.map((item) => item.track);
    const queue = convertTracksToQueue(trackList);
    
    // Set the queue first (this will reset shuffle state if needed)
    setQueue(queue);
    
    // If shuffle is currently off, toggle it on (this will shuffle the queue)
    if (!isShuffled) {
      toggleShuffle();
    }
    
    // Play the first track from the queue
    // Note: After toggleShuffle, the queue will be shuffled
    // We need to get the shuffled queue, but since state updates are async,
    // we'll manually shuffle for immediate playback and sync state
    if (queue.length > 0) {
      // Manually shuffle for immediate playback
      const shuffled = [...queue];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setQueue(shuffled);
      
      try {
        await playTrack(shuffled[0]);
      } catch (error) {
        // Error handling is done in the music player
      }
      
      // Ensure shuffle state is on (in case it wasn't already)
      if (!isShuffled) {
        toggleShuffle();
      }
    }
  };

  const handleTrackClick = (track: any) => {
    // TrackTable handles playing internally
  };

  if (loading) {
    return (
      <Stack direction="column" spacing="lg">
        {/* Playlist Header Skeleton with Gradient Background */}
        <Stack
          direction="row"
          spacing="lg"
          align="end"
          className="p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(83, 83, 83, 1) 0%, rgba(18, 18, 18, 1) 100%)',
            minHeight: '340px',
          }}
        >
          <Skeleton variant="rectangular" width="232px" height="232px" />
          <Stack direction="column" spacing="md" justify="end">
            <Skeleton variant="text" width="80px" height="16px" />
            <Skeleton variant="text" width="400px" height="80px" />
            <Skeleton variant="text" width="300px" height="16px" />
          </Stack>
        </Stack>

        {/* Action Buttons Skeleton */}
        <Stack direction="row" spacing="md" align="center" className="px-8">
          <Skeleton variant="circular" width="56px" height="56px" />
          <Skeleton variant="circular" width="32px" height="32px" />
          <Skeleton variant="circular" width="32px" height="32px" />
          <Skeleton variant="circular" width="32px" height="32px" />
        </Stack>

        {/* Track List Skeleton */}
        <Stack direction="column" spacing="xs" className="px-8 pb-8">
          {/* Table Header */}
          <Stack direction="row" spacing="md" className="px-4 py-2">
            <Skeleton variant="text" width="30px" height="16px" />
            <Skeleton variant="text" width="150px" height="16px" />
            <Skeleton variant="text" width="150px" height="16px" />
            <Skeleton variant="text" width="100px" height="16px" />
          </Stack>
          {/* Track Rows */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Stack key={i} direction="row" spacing="md" align="center" className="px-4 py-2">
              <Skeleton variant="text" width="30px" height="20px" />
              <Skeleton variant="rectangular" width="40px" height="40px" />
              <Stack direction="column" spacing="xs" style={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height="16px" />
                <Skeleton variant="text" width="30%" height="14px" />
              </Stack>
              <Skeleton variant="text" width="150px" height="14px" />
              <Skeleton variant="text" width="50px" height="14px" />
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  }

  // Show auth required message for liked songs
  if (needsAuth) {
    return (
      <Stack direction="column" spacing="lg" align="center" justify="center" className="p-8 min-h-screen">
        <Stack direction="column" spacing="md" align="center" className="max-w-md">
          <Typography variant="heading" size="xl" color="inverse">
            Login Required
          </Typography>
          <MessageText type="warning">
            You need to log in with your Spotify account to view your liked songs.
          </MessageText>
          <Button 
            variant={ButtonVariant.Primary} 
            onClick={loginWithSpotify}
            className="mt-4"
          >
            Connect with Spotify
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (error || !playlist) {
    return (
      <Stack direction="column" spacing="lg" className="p-8">
        <Typography variant="heading" size="xl" color="inverse">
          Failed to load playlist
        </Typography>
        <MessageText type="error">
          {error || 'Unable to load playlist. Please try again.'}
        </MessageText>
      </Stack>
    );
  }

  return (
    <Stack direction="column" className="w-full min-w-0 pb-8">
      {/* Playlist Header */}
      <PlaylistHeader
        playlist={playlist}
        onPlay={handlePlayPlaylist}
        onShuffle={toggleShuffle}
        gradientColors={gradientColors || undefined}
      />

      {/* Track List */}
      <TrackTable tracks={playlist.tracks.items} onTrackClick={handleTrackClick} />
    </Stack>
  );
}
