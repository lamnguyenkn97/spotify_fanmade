'use client';

import React from 'react';
import { Stack, Typography, Icon } from 'spotify-design-system';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface InsightCardProps {
  icon: IconDefinition;
  value: string | number;
  label: string;
  description?: string;
  color?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  value,
  label,
  description,
  color = '#1DB954', // Default Spotify green
}) => {
  return (
    <Stack
      direction="column"
      spacing="md"
      className="bg-surface-elevated rounded-lg p-6 hover:bg-surface-elevated-hover transition-all hover:scale-105 cursor-pointer shadow-lg"
    >
      <Stack direction="row" spacing="md" align="center">
        <span 
          className="rounded-full shadow-lg flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: color,
            width: '72px',
            height: '72px'
          }}
        >
          <Icon icon={icon} size="lg" color="#000000" />
        </span>
        <Stack direction="column" spacing="xs" className="flex-1">
          <Typography variant="heading" size="2xl" weight="bold" color="primary">
            {value}
          </Typography>
          <Typography variant="body" color="secondary" className="text-sm">
            {label}
          </Typography>
          {description && (
            <Typography variant="caption" color="muted" className="text-xs">
              {description}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

