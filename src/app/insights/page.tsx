'use client';

import React, { useState, useMemo } from 'react';
import { Stack, Typography, Card, Button, ButtonVariant, ButtonSize, Skeleton } from 'spotify-design-system';
import { useTopArtists, useTopTracks, useRecentlyPlayed } from '@/hooks/api/useSpotifyApi';
import { TimeRange } from '@/types';
import { InsightCard, GenreChart, TrackTable } from '@/components';
import { getBestImageUrlByWidth } from '@/utils/imageHelpers';
import { useSpotify } from '@/hooks/useSpotify';
import { useRouter } from 'next/navigation';
import { faMusic, faUserFriends, faCompactDisc, faClock } from '@fortawesome/free-solid-svg-icons';

const TIME_RANGES = [
  { value: TimeRange.SHORT_TERM, label: 'Last Month', description: '~4 weeks' },
  { value: TimeRange.MEDIUM_TERM, label: '6 Months', description: '~6 months' },
  { value: TimeRange.LONG_TERM, label: 'All Time', description: 'Several years' },
];

export default function InsightsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useSpotify();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.SHORT_TERM);

  // Fetch data based on selected time range
  const { artists, isLoading: artistsLoading } = useTopArtists(
    { time_range: selectedTimeRange, limit: 10 },
    isAuthenticated
  );
  const { tracks, isLoading: tracksLoading } = useTopTracks(
    { time_range: selectedTimeRange, limit: 20 },
    isAuthenticated
  );
  const { tracks: recentTracks, isLoading: recentLoading } = useRecentlyPlayed(20, isAuthenticated);

  // Calculate genre data from artists
  const genreData = useMemo(() => {
    const genreCount: Record<string, number> = {};
    
    artists.forEach((artist) => {
      artist.genres?.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const total = Object.values(genreCount).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(genreCount)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [artists]);

  // Calculate estimated listening time (rough estimate: avg 3.5 min per track)
  const estimatedMinutes = tracks.length * 3.5;
  const estimatedHours = Math.round(estimatedMinutes / 60);

  const isLoading = authLoading || artistsLoading || tracksLoading;

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/');
    return null;
  }

  return (
    <Stack direction="column" spacing="lg" className="p-8 pb-32">
      {/* Header */}
      <Stack direction="column" spacing="md">
        <Typography variant="heading" size="xl" weight="bold" color="primary">
          Your Listening Insights
        </Typography>
        <Typography variant="body" color="secondary">
          Discover your music taste and listening habits
        </Typography>
      </Stack>

      {/* Time Range Selector */}
      <Stack direction="row" spacing="sm" className="flex-wrap">
        {TIME_RANGES.map((range) => (
          <Button
            key={range.value}
            variant={selectedTimeRange === range.value ? ButtonVariant.Primary : ButtonVariant.Secondary}
            size={ButtonSize.Medium}
            onClick={() => setSelectedTimeRange(range.value as TimeRange)}
          >
            {range.label}
          </Button>
        ))}
      </Stack>

      {/* Stats Cards */}
      <Stack direction="row" spacing="md" className="flex-wrap">
        {isLoading ? (
          <>
            <Skeleton variant="rectangular" width="200px" height="120px" className="rounded-lg" />
            <Skeleton variant="rectangular" width="200px" height="120px" className="rounded-lg" />
            <Skeleton variant="rectangular" width="200px" height="120px" className="rounded-lg" />
            <Skeleton variant="rectangular" width="200px" height="120px" className="rounded-lg" />
          </>
        ) : (
          <>
            <InsightCard icon={faMusic} value={tracks.length} label="Top Tracks" />
            <InsightCard icon={faUserFriends} value={artists.length} label="Top Artists" />
            <InsightCard icon={faCompactDisc} value={genreData.length} label="Genres" />
            <InsightCard 
              icon={faClock} 
              value={`${estimatedHours}h`} 
              label="Estimated Listening" 
              description="Approximate"
            />
          </>
        )}
      </Stack>

      {/* Top Artists Section */}
      <Stack direction="column" spacing="lg">
        <Typography variant="heading" size="lg" weight="bold" color="primary">
          Top Artists
        </Typography>
        
        {isLoading ? (
          <Stack direction="row" spacing="md" className="flex-wrap">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="180px" height="220px" className="rounded-lg" />
            ))}
          </Stack>
        ) : artists.length > 0 ? (
          <Stack direction="row" spacing="md" className="flex-wrap">
            {artists.map((artist, index) => (
              <Card
                key={artist.id}
                title={artist.name}
                subtitle={`#${index + 1} • ${artist.genres?.[0] || 'Artist'}`}
                imageUrl={getBestImageUrlByWidth(artist.images)}
                variant="artist"
                onClick={() => router.push(`/artist/${artist.id}`)}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body" color="secondary">
            No artist data available for this time range
          </Typography>
        )}
      </Stack>

      {/* Top Tracks Section */}
      <Stack direction="column" spacing="lg">
        <Typography variant="heading" size="lg" weight="bold" color="primary">
          Top Tracks
        </Typography>
        
        {isLoading ? (
          <Stack direction="column" spacing="sm">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height="60px" className="rounded-lg" />
            ))}
          </Stack>
        ) : tracks.length > 0 ? (
          <TrackTable 
            tracks={tracks.map(track => ({ track, added_at: new Date().toISOString() }))} 
          />
        ) : (
          <Typography variant="body" color="secondary">
            No track data available for this time range
          </Typography>
        )}
      </Stack>

      {/* Top Genres Section */}
      {genreData.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Typography variant="heading" size="lg" weight="bold" color="primary">
            Top Genres
          </Typography>
          
          {isLoading ? (
            <Stack direction="column" spacing="sm">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" width="100%" height="40px" className="rounded-lg" />
              ))}
            </Stack>
          ) : (
            <div className="max-w-3xl">
              <GenreChart genres={genreData} maxItems={10} />
            </div>
          )}
        </Stack>
      )}

      {/* Recently Played Section */}
      <Stack direction="column" spacing="lg">
        <Typography variant="heading" size="lg" weight="bold" color="primary">
          Recently Played
        </Typography>
        
        {recentLoading ? (
          <Stack direction="column" spacing="sm">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height="60px" className="rounded-lg" />
            ))}
          </Stack>
        ) : recentTracks.length > 0 ? (
          <TrackTable 
            tracks={recentTracks} 
          />
        ) : (
          <Typography variant="body" color="secondary">
            No recently played tracks available
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

