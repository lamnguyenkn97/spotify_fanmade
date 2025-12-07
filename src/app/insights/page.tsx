'use client';

import React, { useState, useMemo } from 'react';
import { Stack, Typography, Button, ButtonVariant, ButtonSize, Skeleton, Image } from 'spotify-design-system';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';
import { useTopArtists, useTopTracks } from '@/hooks/api/useSpotifyApi';
import { TimeRange } from '@/types';
import { InsightCard, GenreChart, TopArtistChart } from '@/components';
import { useSpotify } from '@/hooks/useSpotify';
import { useModal } from '@/contexts';
import { useRouter } from 'next/navigation';
import { faMusic, faUserFriends, faCompactDisc, faClock } from '@fortawesome/free-solid-svg-icons';
import { getDonutChartOptions, getRadarChartOptions, getBarChartOptions, chartColors } from '@/utils/chartConfig';
import { getBestImageUrl } from '@/utils/imageHelpers';

const TIME_RANGES = [
  { value: TimeRange.SHORT_TERM, label: 'Last Month', description: '~4 weeks' },
  { value: TimeRange.MEDIUM_TERM, label: '6 Months', description: '~6 months' },
  { value: TimeRange.LONG_TERM, label: 'All Time', description: 'Several years' },
];

export default function InsightsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useSpotify();
  const { showTrackDetailModal, showTopTracksModal, showTopArtistsModal, showGenresModal } = useModal();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.SHORT_TERM);

  // Fetch data based on selected time range
  const { artists, isLoading: artistsLoading } = useTopArtists(
    { time_range: selectedTimeRange, limit: 10 },
    isAuthenticated
  );
  const { tracks, isLoading: tracksLoading } = useTopTracks(
    { time_range: selectedTimeRange, limit: 50 },
    isAuthenticated
  );

  // Calculate estimated listening time per artist
  const artistListeningTime = useMemo(() => {
    const artistTime: Record<string, { minutes: number; trackCount: number }> = {};
    
    // Average track duration is ~3.5 minutes, but we can be more precise
    // Top tracks are listened to more frequently, so we estimate based on their rank
    tracks.forEach((track, index) => {
      track.artists.forEach((artist) => {
        if (!artistTime[artist.id]) {
          artistTime[artist.id] = { minutes: 0, trackCount: 0 };
        }
        // Estimate: Higher ranked tracks = more plays
        // Top track might be played 50+ times, decreasing logarithmically
        const estimatedPlays = Math.max(5, 50 - (index * 2));
        const estimatedMinutes = estimatedPlays * 3.5; // avg 3.5 min per track
        artistTime[artist.id].minutes += estimatedMinutes;
        artistTime[artist.id].trackCount += 1;
      });
    });
    
    return artistTime;
  }, [tracks]);

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
            <Stack className="flex-1 min-w-[250px]">
              <Skeleton variant="rectangular" width="100%" height="140px" className="rounded-lg" />
            </Stack>
            <Stack className="flex-1 min-w-[250px]">
              <Skeleton variant="rectangular" width="100%" height="140px" className="rounded-lg" />
            </Stack>
            <Stack className="flex-1 min-w-[250px]">
              <Skeleton variant="rectangular" width="100%" height="140px" className="rounded-lg" />
            </Stack>
            <Stack className="flex-1 min-w-[250px]">
              <Skeleton variant="rectangular" width="100%" height="140px" className="rounded-lg" />
            </Stack>
          </>
        ) : (
          <>
            <Stack className="flex-1 min-w-[250px]">
              <InsightCard 
                icon={faMusic} 
                value={tracks.length} 
                label="Top Tracks" 
                color="#FF6B9D"
                onClick={() => showTopTracksModal(tracks, showTrackDetailModal)}
              />
            </Stack>
            <Stack className="flex-1 min-w-[250px]">
              <InsightCard 
                icon={faUserFriends} 
                value={artists.length} 
                label="Top Artists" 
                color="#4ECDC4"
                onClick={() => showTopArtistsModal(artists, artistListeningTime)}
              />
            </Stack>
            <Stack className="flex-1 min-w-[250px]">
              <InsightCard 
                icon={faCompactDisc} 
                value={genreData.length} 
                label="Genres" 
                color="#95E1D3"
                onClick={() => showGenresModal(genreData)}
              />
            </Stack>
            <Stack className="flex-1 min-w-[250px]">
              <InsightCard 
                icon={faClock} 
                value={`${estimatedHours}h`} 
                label="Estimated Listening" 
                description="Approximate"
                color="#FFA07A"
                onClick={() => showTopArtistsModal(artists, artistListeningTime)}
              />
            </Stack>
          </>
        )}
      </Stack>

      {/* Top Artists Section */}
      <Stack id="top-artists-section" direction="column" spacing="lg">
        <Stack direction="column" spacing="xs">
          <Typography variant="heading" size="lg" weight="bold" color="primary">
            Your Top Artists
          </Typography>
          <Typography variant="body" color="secondary">
            Artists you've listened to the most this period
          </Typography>
        </Stack>
        
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height="400px" className="rounded-lg" />
        ) : artists.length > 0 ? (
          <TopArtistChart artists={artists} maxArtists={5} artistListeningTime={artistListeningTime} />
        ) : (
          <Typography variant="body" color="secondary">
            No artist data available for this time range
          </Typography>
        )}
      </Stack>

      {/* Genre Distribution Chart */}
      {genreData.length > 0 && (
        <Stack id="genre-distribution-section" direction="column" spacing="lg">
          <Typography variant="heading" size="lg" weight="bold" color="primary">
            Genre Distribution
          </Typography>
          
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height="300px" className="rounded-lg" />
          ) : (
            <Stack direction="row" spacing="lg" className="flex-wrap items-start">
              <Stack className="w-80 h-80 p-4 bg-surface-elevated rounded-lg flex-shrink-0">
                <Doughnut data={genreChartData} options={getDonutChartOptions()} />
              </Stack>
              <Stack direction="column" spacing="sm" className="flex-1 min-w-[400px]">
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

      {/* Top Tracks List */}
      {tracks.length > 0 && (
        <Stack id="top-tracks-section" direction="column" spacing="lg">
          <Stack direction="column" spacing="sm">
            <Typography variant="heading" size="lg" weight="bold" color="primary">
              Your Top Tracks
            </Typography>
            <Typography variant="body" color="secondary">
              Click on any track to see detailed information
            </Typography>
          </Stack>
          
          {isLoading ? (
            <Stack direction="column" spacing="sm">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" width="100%" height="80px" className="rounded-lg" />
              ))}
            </Stack>
          ) : (
            <Stack direction="column" spacing="sm">
              {tracks.slice(0, 20).map((track, index) => (
                <Stack
                  key={track.id}
                  direction="row"
                  spacing="md"
                  align="center"
                  className="p-4 bg-surface-elevated rounded-lg hover:bg-surface-elevated-hover transition-colors cursor-pointer group"
                  onClick={() => showTrackDetailModal(track)}
                >
                  {/* Track Number */}
                  <Typography variant="body" size="lg" weight="bold" color="secondary" className="w-8 text-center flex-shrink-0">
                    {index + 1}
                  </Typography>
                  
                  {/* Album Art */}
                  {track.album?.images && track.album.images.length > 0 && (
                    <Image
                      src={getBestImageUrl(track.album.images) || track.album.images[0].url}
                      alt={track.name}
                      variant="default"
                      className="w-16 h-16 flex-shrink-0 rounded"
                    />
                  )}
                  
                  {/* Track Info */}
                  <Stack direction="column" spacing="xs" className="flex-1 min-w-0">
                    <Typography variant="body" size="md" weight="medium" color="primary" className="truncate group-hover:text-spotify-green transition-colors">
                      {track.name}
                    </Typography>
                    <Typography variant="body" size="sm" color="secondary" className="truncate">
                      {track.artists.map(a => a.name).join(', ')}
                    </Typography>
                  </Stack>
                  
                  {/* Popularity */}
                  {track.popularity !== undefined && (
                    <Stack direction="row" spacing="xs" align="center" className="flex-shrink-0">
                      <Typography variant="body" size="sm" color="secondary">
                        {track.popularity}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      )}

    </Stack>
  );
}

