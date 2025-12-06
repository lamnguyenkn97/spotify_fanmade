'use client';

import React from 'react';
import { Stack, Skeleton } from 'spotify-design-system';

interface PlaylistHeaderSkeletonProps {
  gradientColors?: {
    color1: string;
    color2: string;
  };
}

export const PlaylistHeaderSkeleton: React.FC<PlaylistHeaderSkeletonProps> = ({
  gradientColors = { color1: 'rgba(83, 83, 83, 1)', color2: 'rgba(18, 18, 18, 1)' },
}) => {
  return (
    <Stack
      direction="row"
      spacing="lg"
      align="end"
      className="p-8"
      style={{
        background: `linear-gradient(180deg, ${gradientColors.color1} 0%, ${gradientColors.color2} 100%)`,
        minHeight: '340px',
      }}
    >
      {/* Cover Art Skeleton */}
      <Skeleton variant="rectangular" width="232px" height="232px" />
      
      {/* Metadata Skeleton */}
      <Stack direction="column" spacing="md" justify="end">
        <Skeleton variant="text" width="80px" height="16px" />
        <Skeleton variant="text" width="400px" height="80px" />
        <Skeleton variant="text" width="300px" height="16px" />
      </Stack>
    </Stack>
  );
};

