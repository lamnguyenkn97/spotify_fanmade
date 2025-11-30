'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Typography } from 'spotify-design-system';
import { PlaylistHeader, TrackTable } from '@/components';
import { extractColorsFromImage, ExtractedColors } from '@/utils/colorExtractor';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { convertTracksToQueue } from '@/utils/trackHelpers';

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
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradientColors, setGradientColors] = useState<ExtractedColors | null>(null);
  const { playTrack, setQueue, toggleShuffle, isShuffled } = useMusicPlayerContext();

  useEffect(() => {
    if (!params.id) return;

    const fetchPlaylist = async () => {
      setLoading(true);
      setError(null);

      try {
        // Handle special "liked-songs" playlist
        if (params.id === 'liked-songs') {
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
  }, [params.id]);

  const handlePlayPlaylist = async () => {
    if (!playlist || playlist.tracks.items.length === 0) return;

    // Convert tracks to queue format
    const trackList = playlist.tracks.items.map((item) => item.track);
    const queue = convertTracksToQueue(trackList);
    
    // Set the queue
    setQueue(queue);
    
    // Play the first track
    if (queue.length > 0) {
      await playTrack(queue[0]);
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
      await playTrack(shuffled[0]);
      
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
      <Stack direction="column" spacing="lg" className="p-8">
        <Typography variant="heading" size="xl" color="inverse">
          Loading playlist...
        </Typography>
      </Stack>
    );
  }

  if (error || !playlist) {
    return (
      <Stack direction="column" spacing="lg" className="p-8">
        <Typography variant="heading" size="xl" color="inverse">
          Failed to load playlist
        </Typography>
        <Typography variant="body" color="muted">
          {error}
        </Typography>
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
