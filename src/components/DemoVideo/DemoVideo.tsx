'use client';

import React from 'react';
import { Stack, Typography } from 'spotify-design-system';

interface DemoVideoProps {
  videoUrl?: string;
}

export const DemoVideo: React.FC<DemoVideoProps> = ({ videoUrl }) => {
  // TODO: Replace with your actual video URL after filming
  // Examples:
  // - YouTube: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
  // - Loom: "https://www.loom.com/embed/YOUR_VIDEO_ID"
  const DEMO_VIDEO_URL = videoUrl || process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || '';

  // Hide section completely until video is ready
  if (!DEMO_VIDEO_URL) {
    return null;
  }

  return (
    <Stack direction="column" spacing="md" align="center" className="w-full px-8 py-8 bg-grey-grey1/50">
      <Stack direction="column" spacing="md" align="center" className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <Stack direction="column" spacing="xs" align="center">
          <Typography variant="heading" weight="bold" color="primary" className="text-2xl">
            See It In Action
          </Typography>
          <Typography variant="body" color="secondary" className="text-center text-sm">
            1-minute walkthrough of key features
          </Typography>
        </Stack>

        {/* Video Embed */}
        <Stack direction="column" className="w-full aspect-video bg-grey-grey2 rounded-lg overflow-hidden shadow-xl">
          <iframe
            src={DEMO_VIDEO_URL}
            title="Spotify Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </Stack>

        {/* Tech Stack Tags */}
        <Stack direction="row" spacing="sm" className="flex-wrap justify-center">
          {['Next.js 15', 'React 18', 'TypeScript', 'NPM Published'].map((tech) => (
            <Typography
              key={tech}
              variant="caption"
              color="secondary"
              className="px-2 py-1 bg-grey-grey2 text-white text-xs rounded-full"
            >
              {tech}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

