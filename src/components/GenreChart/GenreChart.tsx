'use client';

import React from 'react';
import { Stack, Typography } from 'spotify-design-system';

interface GenreData {
  genre: string;
  count: number;
  percentage: number;
}

interface GenreChartProps {
  genres: GenreData[];
  maxItems?: number;
}

export const GenreChart: React.FC<GenreChartProps> = ({ genres, maxItems = 10 }) => {
  const topGenres = genres.slice(0, maxItems);
  const maxCount = topGenres[0]?.count || 1;

  return (
    <Stack direction="column" spacing="md" className="w-full">
      {topGenres.map((genre, index) => (
        <Stack key={genre.genre} direction="column" spacing="xs">
          <Stack direction="row" spacing="sm" align="center" justify="space-between">
            <Stack direction="row" spacing="sm" align="center">
              <Typography variant="body" color="secondary" className="text-sm font-mono w-8">
                #{index + 1}
              </Typography>
              <Typography variant="body" color="primary" weight="medium">
                {genre.genre}
              </Typography>
            </Stack>
            <Typography variant="body" color="secondary" className="text-sm">
              {genre.percentage}%
            </Typography>
          </Stack>
          <Stack className="w-full bg-surface-base rounded-full h-2 overflow-hidden">
            <Stack
              className="bg-spotify-green h-full rounded-full transition-all duration-500"
              style={{ width: `${(genre.count / maxCount) * 100}%` }}
            >
              <span className="sr-only">{genre.percentage}%</span>
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

