'use client';

import React from 'react';
import { Stack, Typography, Icon } from 'spotify-design-system';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { chartColors } from '@/utils/chartConfig';

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
      {topGenres.map((genre, index) => {
        const color = chartColors.palette[index % chartColors.palette.length];
        
        return (
          <Stack key={genre.genre} direction="row" spacing="sm" align="center" className="group hover:bg-surface-base/30 p-2 rounded-lg transition-colors min-w-0">
            {/* Circular Icon */}
            <span 
              className="w-10 h-10 rounded-full shadow-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <Icon icon={faMusic} size="sm" color="#000000" />
            </span>
            
            {/* Genre Info and Progress Bar */}
            <Stack direction="column" spacing="xs" className="flex-1 min-w-0">
              <Stack direction="row" spacing="sm" align="center" justify="space-between">
                <Stack direction="row" spacing="sm" align="center" className="flex-1">
                  <Typography variant="body" color="primary" weight="medium">
                    {genre.genre}
                  </Typography>
                  <Typography variant="body" color="secondary" className="text-xs flex-shrink-0">
                    ({genre.count})
                  </Typography>
                </Stack>
                <Typography variant="body" weight="bold" className="text-sm flex-shrink-0 ml-4" style={{ color }}>
                  {genre.percentage}%
                </Typography>
              </Stack>
              
              {/* Progress Bar */}
              <Stack className="w-full bg-surface-base rounded-full h-2 overflow-hidden">
                <span
                  className="h-full rounded-full transition-all duration-500 block"
                  style={{ 
                    width: `${(genre.count / maxCount) * 100}%`,
                    backgroundColor: color
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

