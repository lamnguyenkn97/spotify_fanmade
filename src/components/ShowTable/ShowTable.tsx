'use client';

import React, { useState } from 'react';
import { Stack, Typography, Icon, Image, colors, borderRadius } from 'spotify-design-system';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ShowTableProps } from '@/types';
import { getBestImageUrl } from '@/utils/imageHelpers';

export const ShowTable: React.FC<ShowTableProps> = ({ shows, onShowClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tableData: ShowItem[] = shows.map((show, idx) => ({
    ...show,
    index: idx + 1,
  }));

  return (
    <Stack direction="column" className="px-8 pb-8 bg-spotify-dark">
      {/* Custom Header Row */}
      <Stack
        direction="row"
        spacing="lg"
        align="center"
        className="px-2 py-2 border-b border-gray-800 grid"
        style={{ gridTemplateColumns: '40px 1fr 30% 150px' }}
      >
        <Stack direction="row" align="center">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            #
          </Typography>
        </Stack>
        <Stack direction="row" align="center">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            Title
          </Typography>
        </Stack>
        <Stack direction="row" align="center">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            Publisher
          </Typography>
        </Stack>
        <Stack direction="row" align="center" justify="end" className="pr-4">
          <Typography variant="caption" size="sm" color="muted" weight="bold">
            Type
          </Typography>
        </Stack>
      </Stack>

      {/* Table Rows */}
      <Stack direction="column">
        {tableData.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing="lg"
            align="center"
            className="px-2 py-2 hover:bg-gray-800/50 group cursor-pointer grid"
            style={{ gridTemplateColumns: '40px 1fr 30% 150px', borderRadius: borderRadius.md }}
            onMouseEnter={() => setHoveredIndex(item.index!)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onShowClick(item.id)}
          >
            {/* Index */}
            <Stack direction="row" align="center">
              {hoveredIndex === item.index ? (
                <Icon
                  icon={faPlay}
                  size="sm"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowClick(item.id);
                  }}
                />
              ) : (
                <Typography variant="body" size="sm" color="muted">
                  {item.index}
                </Typography>
              )}
            </Stack>

            {/* Title with Image */}
            <Stack direction="row" spacing="md" align="center" className="min-w-0">
              <Image
                src={getBestImageUrl(item.images)}
                alt={item.name}
                size="sm"
                className="flex-shrink-0"
              />
              <Stack direction="column" spacing="xs" className="min-w-0">
                <Typography
                  variant="body"
                  size="sm"
                  weight="medium"
                  color="primary"
                  className="truncate"
                >
                  {item.name}
                </Typography>
                <Typography variant="caption" size="sm" color="muted" className="truncate">
                  Podcast
                </Typography>
              </Stack>
            </Stack>

            {/* Publisher */}
            <Stack direction="row" align="center" className="min-w-0">
              <Typography variant="body" size="sm" color="muted" className="truncate">
                {item.publisher || 'Unknown'}
              </Typography>
            </Stack>

            {/* Type */}
            <Stack direction="row" align="center" justify="end" className="pr-4">
              <Typography variant="body" size="sm" color="muted">
                Podcast
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

