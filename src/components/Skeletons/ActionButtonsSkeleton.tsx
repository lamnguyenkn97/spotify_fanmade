'use client';

import React from 'react';
import { Stack, Skeleton } from 'spotify-design-system';

interface ActionButtonsSkeletonProps {
  buttonCount?: number;
}

export const ActionButtonsSkeleton: React.FC<ActionButtonsSkeletonProps> = ({
  buttonCount = 4,
}) => {
  return (
    <Stack direction="row" spacing="md" align="center" className="px-8">
      {/* Primary Play Button - larger */}
      <Skeleton variant="circular" width="56px" height="56px" />
      
      {/* Secondary Action Buttons */}
      {Array.from({ length: buttonCount - 1 }, (_, i) => (
        <Skeleton key={i} variant="circular" width="32px" height="32px" />
      ))}
    </Stack>
  );
};

