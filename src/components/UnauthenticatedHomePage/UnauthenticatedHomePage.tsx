'use client';
import React, { useState, useEffect } from 'react';
import { Card, Stack, Typography, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';

interface UnauthenticatedHomePageProps {
  onCardClick: (card: any) => void;
  onLogin?: () => void;
}

const HeroBanner: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => (
  <div className="relative w-full bg-gradient-to-b from-spotify-green/20 to-transparent px-8 py-12 mb-8">
    <Stack direction="column" spacing="lg" align="center" className="max-w-4xl mx-auto text-center">
      <Stack direction="column" spacing="md">
        <Typography variant="heading" weight="bold" color="primary" className="text-5xl">
          Spotify Fan-Made Experience
        </Typography>
        <Typography variant="body" color="secondary" className="text-xl">
          A full-stack portfolio project showcasing modern web development with React, Next.js, and
          a custom design system.
        </Typography>
      </Stack>
      {onLogin && (
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Large}
          onClick={onLogin}
          className="px-12 py-4 text-lg font-bold"
        >
          Connect with Spotify
        </Button>
      )}
      <Typography variant="caption" color="secondary" className="mt-2">
        Experience the full app by connecting your Spotify account
      </Typography>
    </Stack>
  </div>
);

// Demo playlists for portfolio showcase
const DEMO_PLAYLISTS = [
  {
    id: '37i9dQZF1DXcBWIGoYBM5M',
    name: 'Today\'s Top Hits',
    description: 'Ed Sheeran is on top of the Hottest 50!',
    imageUrl: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc',
  },
  {
    id: '37i9dQZF1DX0XUsuxWHRQd',
    name: 'RapCaviar',
    description: 'New music from Kendrick Lamar, Drake and more.',
    imageUrl: 'https://i.scdn.co/image/ab67706f000000029c8932522c22da8ef39355e5',
  },
  {
    id: '37i9dQZF1DX4dyzvuaRJ0n',
    name: 'mint',
    description: 'The most vital dance tracks of the moment.',
    imageUrl: 'https://i.scdn.co/image/ab67706f00000002cd37e1f713f3c68a474dc6e7',
  },
  {
    id: '37i9dQZF1DX1lVhptIYRda',
    name: 'Hot Country',
    description: 'Today\'s top country hits!',
    imageUrl: 'https://i.scdn.co/image/ab67706f00000002cf7dfe7e827ecd633c45cda3',
  },
  {
    id: '37i9dQZF1DX4JAvHpjipBk',
    name: 'New Music Friday',
    description: 'The best new music.',
    imageUrl: 'https://i.scdn.co/image/ab67706f00000002719b32509cbf85f833d42e28',
  },
  {
    id: '37i9dQZF1DXcF6B6QPhFDv',
    name: 'Rock Classics',
    description: 'Rock legends & epic songs.',
    imageUrl: 'https://i.scdn.co/image/ab67706f000000026b856c41ab0c926c0c78c8df',
  },
];

export const UnauthenticatedHomePage: React.FC<UnauthenticatedHomePageProps> = ({
  onCardClick,
  onLogin,
}) => {
  return (
    <>
      <HeroBanner onLogin={onLogin} />
      
      <div className="px-8 py-6 space-y-8">
        {/* Demo Disclaimer */}
        <Stack direction="row" align="center" justify="center" className="py-4">
          <Typography variant="caption" color="muted" className="text-center">
            📋 Portfolio Demo • Connect with Spotify to see your personalized content
          </Typography>
        </Stack>

        {/* Featured Playlists Section */}
        <Stack direction="column" spacing="lg">
          <Typography variant="heading" size="xl" weight="bold" color="primary">
            Popular Playlists
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {DEMO_PLAYLISTS.map((playlist) => (
              <Card
                key={playlist.id}
                title={playlist.name}
                subtitle={playlist.description}
                imageUrl={playlist.imageUrl}
                variant="default"
                onClick={() => onCardClick(playlist)}
              />
            ))}
          </div>
        </Stack>

        {/* CTA to Connect */}
        <Stack direction="column" align="center" spacing="md" className="py-12">
          <Typography variant="heading" size="lg" weight="bold" color="primary" className="text-center">
            See Your Personalized Music
          </Typography>
          <Typography variant="body" color="secondary" className="text-center max-w-2xl">
            Connect your Spotify account to access your playlists, recently played, top artists, and more.
          </Typography>
          {onLogin && (
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.Large}
              onClick={onLogin}
              className="px-12"
            >
              Connect with Spotify
            </Button>
          )}
        </Stack>
      </div>
    </>
  );
};
