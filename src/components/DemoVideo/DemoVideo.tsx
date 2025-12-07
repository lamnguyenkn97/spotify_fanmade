'use client';

import React from 'react';
import { Stack, Typography, Skeleton } from 'spotify-design-system';

interface DemoVideoProps {
  videoUrl?: string;
}

export const DemoVideo: React.FC<DemoVideoProps> = ({ videoUrl }) => {
  // TODO: Replace with your actual video URL after filming
  // Examples:
  // - YouTube: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
  // - Loom: "https://www.loom.com/embed/YOUR_VIDEO_ID"
  const DEMO_VIDEO_URL = videoUrl || process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || '';

  if (!DEMO_VIDEO_URL) {
    return (
      <div className="w-full px-8 py-8 bg-grey-grey1/50">
        <Stack direction="column" spacing="md" align="center" className="max-w-3xl mx-auto">
          <Stack direction="column" spacing="xs" align="center">
            <Typography variant="heading" weight="bold" color="primary" className="text-2xl">
              See It In Action
            </Typography>
            <Typography variant="body" color="secondary" className="text-center text-sm">
              1-minute walkthrough of key features
            </Typography>
          </Stack>

          {/* Video Placeholder */}
          <div className="w-full aspect-video bg-grey-grey2 rounded-lg flex items-center justify-center">
            <Stack direction="column" spacing="sm" align="center">
              <Typography variant="body" color="secondary" className="text-lg">
                📹 Demo video coming soon
              </Typography>
              <Typography variant="caption" color="secondary" className="opacity-70 text-xs">
                Recording in progress...
              </Typography>
            </Stack>
          </div>
        </Stack>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-8 bg-grey-grey1/50">
      <Stack direction="column" spacing="md" align="center" className="max-w-3xl mx-auto">
        <Stack direction="column" spacing="xs" align="center">
          <Typography variant="heading" weight="bold" color="primary" className="text-2xl">
            See It In Action
          </Typography>
          <Typography variant="body" color="secondary" className="text-center text-sm">
            1-minute walkthrough of key features
          </Typography>
        </Stack>

        {/* Video Embed */}
        <div className="w-full aspect-video bg-grey-grey2 rounded-lg overflow-hidden shadow-xl">
          <iframe
            src={DEMO_VIDEO_URL}
            title="Spotify Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Tech Stack Tags */}
        <Stack direction="row" spacing="sm" className="flex-wrap justify-center">
          {['Next.js 15', 'React 18', 'TypeScript', 'NPM Published'].map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-grey-grey2 text-white text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </Stack>
      </Stack>
    </div>
  );
};

