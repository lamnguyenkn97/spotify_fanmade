'use client';

import React from 'react';
import { Banner, colors, Icon, Stack, Typography } from 'spotify-design-system';
import { faBars, faPlay, faShuffle } from '@fortawesome/free-solid-svg-icons';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';

interface PlaylistHeaderProps {
  playlist: {
    name: string;
    description?: string;
    images: Array<{ url: string }>;
    owner: {
      display_name: string;
    };
    tracks: {
      total: number;
    };
  };
  onPlay?: () => void;
  onShuffle?: () => void;
  gradientColors?: {
    color1: string;
    color2: string;
  };
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  playlist,
  onPlay,
  onShuffle,
  gradientColors,
}) => {
  // Get shuffle state from music player context
  const { isShuffled } = useMusicPlayerContext();

  // Format subtitle with owner and track count
  const subtitle = `${playlist.owner.display_name} • ${playlist.tracks.total} songs`;

  // Use extracted colors or fallback to design system colors
  const defaultDark = colors.primary.black; // #181414
  const defaultDarkAlt = colors.grey.grey1; // rgba(255, 255, 255, 0.08) - slightly lighter for gradient
  const bgColor1 = gradientColors?.color1 || defaultDark;
  const bgColor2 = gradientColors?.color2 || defaultDarkAlt;

  return (
    <Stack
      direction="column"
      spacing="lg"
      className="w-full min-w-0"
      style={{
        width: '100%',
        minWidth: 0,
        background: `linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 50%, ${defaultDark} 100%)`,
      }}
    >
      {/* Banner from Design System */}
      <Banner
        type="playlist"
        image={playlist.images?.[0]?.url || ''}
        title={playlist.name}
        subtitle={subtitle}
        description={playlist.description}
      />

      {/* Action Buttons Row */}
      <Stack
        direction="row"
        spacing="md"
        align="center"
        justify="space-between"
        className="px-8 pb-6 w-full"
      >
        <Stack direction="row" spacing="lg" align="center">
          {/* Play Button */}
          <Icon
            icon={faPlay}
            size="md"
            color={'black'}
            circular
            backgroundColor={colors.primary.brand}
            onClick={onPlay}
            clickable
          />
          <Icon
            icon={faShuffle}
            onClick={onShuffle}
            aria-label="Shuffle"
            color={isShuffled ? colors.primary.brand : 'white'}
            size="lg"
            clickable
            className="hover:scale-110 hover:opacity-80 transition-all cursor-pointer"
            style={{ cursor: 'pointer' }}
          />
        </Stack>

        {/* List Toggle - Right Side */}
        <Stack direction="row" align="center" spacing="xs" justify={'end'}>
          <Typography
            variant="caption"
            weight="bold"
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            List
          </Typography>
          <Icon icon={faBars} size="sm" className="text-gray-400 hover:text-white cursor-pointer" />
        </Stack>
      </Stack>
    </Stack>
  );
};
