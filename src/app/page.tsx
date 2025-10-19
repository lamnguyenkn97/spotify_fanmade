'use client';

import {
  ThemeProvider,
  AppHeader,
  Card,
  Typography,
  Stack,
  Footer,
  Button,
  ButtonVariant,
  ButtonSize,
} from 'spotify-design-system';
import React, { useState } from 'react';
import homepageData from './data/homepageData.json';
import {
  UnauthenticatedSideBar,
  CookieBanner,
  SignupBanner,
  CreatePlaylistDialog,
} from '@/components';
import { useSpotify } from '@/hooks/useSpotify';

// Helper: Extract best quality image URL from sources
const getBestImageUrl = (sources: any[] = []) => {
  return (
    sources.find((source) => source.width >= 300)?.url ||
    sources.find((source) => source.width >= 64)?.url ||
    sources[0]?.url
  );
};

// Helper: Extract card props from different content types
const getCardProps = (item: any) => {
  const { __typename, data } = item.content;

  const cardPropsMap = {
    TrackResponseWrapper: {
      title: data.name || 'Unknown Track',
      subtitle: data.artists?.items?.[0]?.profile?.name || 'Unknown Artist',
      variant: 'default' as const,
      imageUrl: getBestImageUrl(data.albumOfTrack?.coverArt?.sources),
    },
    ArtistResponseWrapper: {
      title: data.profile?.name || 'Unknown Artist',
      subtitle: undefined,
      variant: 'artist' as const,
      imageUrl: getBestImageUrl(data.visuals?.avatarImage?.sources),
    },
    AlbumResponseWrapper: {
      title: data.name || 'Unknown Album',
      subtitle: data.artists?.items?.[0]?.profile?.name || 'Unknown Artist',
      variant: 'default' as const,
      imageUrl: getBestImageUrl(data.coverArt?.sources),
    },
    PlaylistResponseWrapper: {
      title: data.name || 'Unknown Playlist',
      subtitle: data.ownerV2?.data?.name || data.description || 'Playlist',
      variant: 'default' as const,
      imageUrl: getBestImageUrl(data.images?.items?.[0]?.sources),
    },
  };

  return cardPropsMap[__typename as keyof typeof cardPropsMap];
};

export default function Home() {
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [showCreatePlaylistDialog, setShowCreatePlaylistDialog] = useState(false);
  const { user, isAuthenticated, login, logout } = useSpotify();

  const sections = homepageData.data.home.sectionContainer.sections.items.filter(
    (section) => section.data.title.transformedLabel
  );

  const handleCloseCookieBanner = () => {
    setShowCookieBanner(false);
  };

  const handleCreatePlaylist = () => {
    setShowCreatePlaylistDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCreatePlaylistDialog(false);
  };

  const handleLogin = () => {
    login();
    setShowCreatePlaylistDialog(false);
  };

  return (
    <ThemeProvider>
      <Stack direction="column" className="min-h-screen bg-spotify-dark text-white">
        <AppHeader
          isAuthenticated={isAuthenticated}
          onSearch={() => console.log('Search clicked')}
          onLogin={login}
          onSignUp={login}
          onInstallApp={() => console.log('Install app clicked')}
        />

        <Stack direction="row" className="h-screen">
          <UnauthenticatedSideBar onCreatePlaylist={handleCreatePlaylist} />
          <Stack direction="column" className="flex-1">
            <Stack direction="column" className="flex-1 overflow-y-auto">
              {/* Content Sections */}
              <div className="p-6">
                {sections.map((section, sectionIndex) => (
                  <Stack key={sectionIndex} direction="column" spacing="sm" className="mb-8">
                    {/* Section Header with Show all */}
                    <Stack direction="row" align="center" justify="space-between" className="mb-2">
                      <Typography variant="title" size="xl">
                        {section.data.title.transformedLabel}
                      </Typography>
                      <Button
                        text="Show all"
                        variant={ButtonVariant.Text}
                        size={ButtonSize.Small}
                        onClick={() =>
                          console.log(`Show all ${section.data.title.transformedLabel}`)
                        }
                      />
                    </Stack>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {section.sectionItems.items
                        .filter((item) => item.content?.data)
                        .slice(0, 6)
                        .map((item, itemIndex) => {
                          const cardProps = getCardProps(item);
                          if (!cardProps) return null;

                          return (
                            <Card
                              key={itemIndex}
                              {...cardProps}
                              size="md"
                              showPlayButton
                              onPlayClick={() => console.log(`Playing ${cardProps.title}`)}
                            />
                          );
                        })}
                    </div>
                  </Stack>
                ))}
              </div>

              {/* Footer */}
              <Footer />

              {/* Copyright Watermark */}
              <Stack direction="column" className="bg-spotify-black px-6 py-8">
                <Typography variant="caption" color="secondary" className="text-gray-400 text-xs">
                  © {new Date().getFullYear()} Spotify AB
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Cookie Banner - shows first */}
      {showCookieBanner && <CookieBanner onClose={handleCloseCookieBanner} />}

      {/* Signup Banner - shows after cookie banner is closed */}
      {!showCookieBanner && <SignupBanner onSignUp={() => console.log('Sign up clicked')} />}

      {/* Create Playlist Dialog */}
      <CreatePlaylistDialog
        isOpen={showCreatePlaylistDialog}
        onClose={handleCloseDialog}
        onLogin={handleLogin}
      />
    </ThemeProvider>
  );
}
