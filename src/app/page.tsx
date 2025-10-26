'use client';

import { ThemeProvider, AppHeader, Stack } from 'spotify-design-system';
import React, { useState } from 'react';
import homepageData from './data/homepageData.json';
import {
  UnauthenticatedSideBar,
  CookieBanner,
  SignupBanner,
  ContentSections,
  AuthModals,
} from '@/components';
import { useSpotify } from '@/hooks/useSpotify';
import { useCardModal } from '@/hooks/useCardModal';
import { useRouter } from 'next/navigation';

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
  const { showCardModal, selectedCard, openCardModal, closeCardModal } = useCardModal();
  const router = useRouter();

  const sections = homepageData.data.home.sectionContainer.sections.items.filter(
    (section) => section.data.title.transformedLabel
  );

  const handleCloseCookieBanner = () => {
    setShowCookieBanner(false);
  };

  const handleCreatePlaylist = () => {
    setShowCreatePlaylistDialog(true);
  };

  const handleBrowsePodcasts = () => {
    router.push('/podcasts');
  };

  const handleCloseDialog = () => {
    setShowCreatePlaylistDialog(false);
  };

  const handleLogin = () => {
    login();
    setShowCreatePlaylistDialog(false);
    closeCardModal();
  };

  const handleSignUpFree = () => {
    login();
    closeCardModal();
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
          onHomeClick={() => router.push('/')}
        />

        <Stack direction="row" className="h-screen">
          <UnauthenticatedSideBar
            onCreatePlaylist={handleCreatePlaylist}
            onBrowsePodcasts={handleBrowsePodcasts}
          />
          <Stack direction="column" className="flex-1">
            <Stack direction="column" className="flex-1 overflow-y-auto">
              <ContentSections
                sections={sections}
                onCardClick={openCardModal}
                onShowAll={openCardModal}
                getCardProps={getCardProps}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Cookie Banner - shows first */}
      {showCookieBanner && <CookieBanner onClose={handleCloseCookieBanner} />}

      {/* Signup Banner - shows after cookie banner is closed */}
      {!showCookieBanner && <SignupBanner onSignUp={() => console.log('Sign up clicked')} />}

      {/* All Authentication Modals */}
      <AuthModals
        showCreatePlaylistDialog={showCreatePlaylistDialog}
        onCloseCreatePlaylist={handleCloseDialog}
        onLogin={handleLogin}
        showCardModal={showCardModal}
        selectedCard={selectedCard}
        onCloseCardModal={closeCardModal}
        onSignUpFree={handleSignUpFree}
      />
    </ThemeProvider>
  );
}
