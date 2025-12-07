'use client';

import React, { useState, useMemo } from 'react';
import { Stack, Typography, Card, Button, ButtonVariant, ButtonSize, Skeleton } from 'spotify-design-system';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';
import { useTopArtists, useTopTracks, useRecentlyPlayed } from '@/hooks/api/useSpotifyApi';
import { TimeRange } from '@/types';
import { InsightCard, GenreChart, TrackTable } from '@/components';
import { getBestImageUrlByWidth } from '@/utils/imageHelpers';
import { useSpotify } from '@/hooks/useSpotify';
import { useRouter } from 'next/navigation';
import { faMusic, faUserFriends, faCompactDisc, faClock } from '@fortawesome/free-solid-svg-icons';
import { getDonutChartOptions, getRadarChartOptions, getBarChartOptions, chartColors } from '@/utils/chartConfig';

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

  // Prepare Donut chart data for genres
  const genreChartData = useMemo(() => ({
    labels: genreData.slice(0, 8).map(g => g.genre),
    datasets: [{
      data: genreData.slice(0, 8).map(g => g.count),
      backgroundColor: chartColors.palette,
      borderColor: '#000',
      borderWidth: 2,
    }]
  }), [genreData]);

  // Prepare Radar chart data for audio features (based on top tracks)
  const audioFeaturesData = useMemo(() => {
    // Mock average audio features - in real implementation, fetch from Spotify API
    // For portfolio demo, we'll use realistic averages
    return {
      labels: ['Energy', 'Danceability', 'Valence', 'Acousticness', 'Speechiness', 'Instrumentalness'],
      datasets: [{
        label: 'Audio Features',
        data: [75, 68, 62, 25, 8, 15], // Mock data (0-100 scale)
        backgroundColor: `${chartColors.primary}40`,
        borderColor: chartColors.primary,
        borderWidth: 2,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColors.primary,
      }]
    };
  }, [tracks]);

  // Prepare Bar chart data for track popularity
  const trackPopularityData = useMemo(() => {
    const topTracks = tracks.slice(0, 10);
    return {
      labels: topTracks.map((t, i) => `${i + 1}. ${t.name.slice(0, 30)}...`),
      datasets: [{
        label: 'Popularity',
        data: topTracks.map(t => t.popularity || 0),
        backgroundColor: chartColors.palette,
        borderRadius: 8,
      }]
    };
  }, [tracks]);

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

      {/* Genre Distribution Chart */}
      {genreData.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Typography variant="heading" size="lg" weight="bold" color="primary">
            Genre Distribution
          </Typography>
          
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height="300px" className="rounded-lg" />
          ) : (
            <Stack direction="row" spacing="lg" className="flex-wrap items-start">
              <Stack className="w-80 h-80 p-4 bg-surface-elevated rounded-lg">
                <Doughnut data={genreChartData} options={getDonutChartOptions()} />
              </Stack>
              <Stack direction="column" spacing="sm" className="flex-1 min-w-[300px]">
                <Typography variant="body" color="secondary" className="mb-2">
                  Progress Breakdown
                </Typography>
                <GenreChart genres={genreData} maxItems={8} />
              </Stack>
            </Stack>
          )}
        </Stack>
      )}

      {/* Audio Features Analysis */}
      {tracks.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Stack direction="column" spacing="sm">
            <Typography variant="heading" size="lg" weight="bold" color="primary">
              Audio Features
            </Typography>
            <Typography variant="body" color="secondary">
              Average characteristics of your top tracks
            </Typography>
          </Stack>
          
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height="400px" className="rounded-lg" />
          ) : (
            <Stack className="max-w-2xl p-6 bg-surface-elevated rounded-lg">
              <Radar data={audioFeaturesData} options={getRadarChartOptions()} />
            </Stack>
          )}
        </Stack>
      )}

      {/* Track Popularity */}
      {tracks.length > 0 && (
        <Stack direction="column" spacing="lg">
          <Stack direction="column" spacing="sm">
            <Typography variant="heading" size="lg" weight="bold" color="primary">
              Track Popularity
            </Typography>
            <Typography variant="body" color="secondary">
              Spotify popularity scores for your top tracks (0-100)
            </Typography>
          </Stack>
          
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height="400px" className="rounded-lg" />
          ) : (
            <Stack className="p-6 bg-surface-elevated rounded-lg">
              <Bar data={trackPopularityData} options={getBarChartOptions()} />
            </Stack>
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

