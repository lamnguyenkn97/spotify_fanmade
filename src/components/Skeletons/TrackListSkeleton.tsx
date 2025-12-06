'use client';

import React from 'react';
import { Stack, Skeleton } from 'spotify-design-system';

interface TrackListSkeletonProps {
  rowCount?: number;
  showAlbumColumn?: boolean;
}

export const TrackListSkeleton: React.FC<TrackListSkeletonProps> = ({
  rowCount = 8,
  showAlbumColumn = true,
}) => {
  return (
    <Stack direction="column" spacing="xs" className="px-8 pb-8">
      {/* Table Header */}
      <Stack direction="row" spacing="md" className="px-4 py-2">
        <Skeleton variant="text" width="30px" height="16px" />
        <Skeleton variant="text" width="150px" height="16px" />
        {showAlbumColumn && <Skeleton variant="text" width="150px" height="16px" />}
        <Skeleton variant="text" width="100px" height="16px" />
      </Stack>
      
      {/* Track Rows */}
      {Array.from({ length: rowCount }, (_, i) => (
        <Stack key={i} direction="row" spacing="md" align="center" className="px-4 py-2">
          <Skeleton variant="text" width="30px" height="20px" />
          <Skeleton variant="rectangular" width="40px" height="40px" />
          <Stack direction="column" spacing="xs" style={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height="16px" />
            <Skeleton variant="text" width="30%" height="14px" />
          </Stack>
          {showAlbumColumn && <Skeleton variant="text" width="150px" height="14px" />}
          <Skeleton variant="text" width="50px" height="14px" />
        </Stack>
      ))}
    </Stack>
  );
};

