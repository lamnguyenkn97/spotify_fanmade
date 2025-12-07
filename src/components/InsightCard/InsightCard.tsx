'use client';

import React from 'react';
import { Stack, Typography, Icon } from 'spotify-design-system';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface InsightCardProps {
  icon: IconDefinition;
  value: string | number;
  label: string;
  description?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  value,
  label,
  description,
}) => {
  return (
    <Stack
      direction="column"
      spacing="md"
      className="bg-surface-elevated rounded-lg p-6 hover:bg-surface-elevated-hover transition-colors"
    >
      <Stack direction="row" spacing="md" align="center">
        <div className="bg-spotify-green/10 rounded-full p-3">
          <Icon icon={icon} size="md" className="text-spotify-green" />
        </div>
        <Stack direction="column" spacing="xs">
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

