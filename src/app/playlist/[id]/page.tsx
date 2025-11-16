'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Typography } from 'spotify-design-system';
import { PlaylistHeader, TrackTable } from '@/components';
import { extractColorsFromImage, ExtractedColors } from '@/utils/colorExtractor';

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
              console.error('Error extracting colors:', colorError);
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
            console.error('Error extracting colors:', colorError);
            // Use default colors on error
            setGradientColors({
              color1: '#121212',
              color2: '#1a1a1a',
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching playlist:', err);
        setError(err.message || 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [params.id]);

  const handlePlayPlaylist = () => {
    console.log('Play entire playlist');
    // TODO: Connect to music player when built
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
    <Stack direction="column" className="w-full min-w-0">
      {/* Playlist Header */}
      <PlaylistHeader
        playlist={playlist}
        onPlay={handlePlayPlaylist}
        gradientColors={gradientColors || undefined}
      />

      {/* Track List */}
      <TrackTable tracks={playlist.tracks.items} onTrackClick={handleTrackClick} />
    </Stack>
  );
}
