'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Stack, Typography, Icon, Image } from 'spotify-design-system';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { SpotifyArtist } from '@/types/spotify';
import { getBarChartOptions, chartColors } from '@/utils/chartConfig';
import { getBestImageUrlByWidth } from '@/utils/imageHelpers';

interface TopArtistChartProps {
  artists: SpotifyArtist[];
  maxArtists?: number;
  artistListeningTime?: Record<string, { minutes: number; trackCount: number }>;
}

export const TopArtistChart: React.FC<TopArtistChartProps> = ({
  artists,
  maxArtists = 5,
  artistListeningTime = {},
}) => {
  if (!artists || artists.length === 0) {
    return (
      <Typography variant="body" color="secondary">
        No artist data available
      </Typography>
    );
  }

  const topArtists = artists.slice(0, maxArtists);
  const champion = artists[0];

  // Get listening time data for champion
  const championTime = artistListeningTime[champion.id];
  const championHours = championTime ? Math.round(championTime.minutes / 60) : 0;
  const championMinutes = championTime ? Math.round(championTime.minutes % 60) : 0;

  // Prepare chart data - showing estimated listening time
  const chartData = {
    labels: topArtists.map((artist, index) => `${index + 1}. ${artist.name}`),
    datasets: [
      {
        label: 'Listening Time (hours)',
        data: topArtists.map((artist) => {
          const time = artistListeningTime[artist.id];
          return time ? Math.round((time.minutes / 60) * 10) / 10 : 0; // Round to 1 decimal
        }),
        backgroundColor: topArtists.map(
          (_, index) => chartColors.palette[index % chartColors.palette.length]
        ),
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    ...getBarChartOptions(),
    indexAxis: 'y' as const, // Horizontal bar
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return numValue + 'h';
          },
          color: '#b3b3b3',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const hours = context.parsed.x;
            const minutes = Math.round((hours % 1) * 60);
            if (hours >= 1) {
              return `~${Math.floor(hours)}h ${minutes}m listening time`;
            } else {
              return `~${Math.round(hours * 60)}m listening time`;
            }
          },
        },
      },
    },
  };

  return (
    <Stack direction="column" spacing="md" className="max-w-3xl">
      {/* Champion Section */}
      <Stack
        direction="column"
        spacing="md"
        className="p-6 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-2 border-yellow-600/50 rounded-lg"
      >
        {/* Header with Trophy */}
        <Stack direction="row" spacing="sm" align="center">
          <span className="w-10 h-10 rounded-full bg-yellow-500 shadow-lg flex items-center justify-center flex-shrink-0">
            <Icon icon={faTrophy} size="md" color="#000000" />
          </span>
          <Typography variant="heading" size="lg" weight="bold" color="primary">
            Your Most Played Artist
          </Typography>
        </Stack>

        {/* Artist Info with Avatar */}
        <Stack direction="row" spacing="md" align="center">
          {/* Artist Avatar */}
          {champion.images && champion.images.length > 0 && (
            <Image
              src={getBestImageUrlByWidth(champion.images) || champion.images[0].url}
              alt={champion.name}
              variant="avatar"
              size="lg"
              shape="circle"
              className="flex-shrink-0 shadow-xl border-2 border-yellow-500/50"
            />
          )}

          {/* Artist Details */}
          <Stack direction="column" spacing="xs" className="flex-1 min-w-0">
            <Typography variant="heading" size="xl" weight="bold" color="primary">
              {champion.name}
            </Typography>
            {champion.genres && champion.genres.length > 0 && (
              <Typography variant="body" size="md" color="secondary">
                {champion.genres.slice(0, 3).join(' • ')}
              </Typography>
            )}
            <Stack direction="row" spacing="xs" align="center" className="flex-wrap">
              <Typography variant="body" size="md" weight="bold" className="text-spotify-green">
                {championHours > 0 && `~${championHours}h ${championMinutes}m`}
                {championHours === 0 && championMinutes > 0 && `~${championMinutes}m`}
                {championHours === 0 && championMinutes === 0 && 'Your top artist'}
              </Typography>
              <Typography variant="body" size="sm" color="secondary">
                estimated listening time
              </Typography>
            </Stack>
            <Typography variant="body" size="sm" color="secondary">
              {(champion.followers?.total || 0).toLocaleString()} followers on Spotify
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Top 5 Artists Chart */}
      <Stack direction="column" spacing="sm" className="p-6 bg-surface-elevated rounded-lg">
        <Stack direction="column" spacing="xs" className="mb-4">
          <Typography variant="heading" size="md" weight="bold" color="primary">
            Your Top {topArtists.length} Artists
          </Typography>
          <Typography variant="body" size="sm" color="secondary">
            Estimated listening time based on your top tracks
          </Typography>
        </Stack>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </Stack>
    </Stack>
  );
};
