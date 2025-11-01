'use client';

import { ThemeProvider, AppHeader, Stack } from 'spotify-design-system';
import type { AppHeaderProps } from 'spotify-design-system';
import React, { useState, useEffect } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';

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
  const { user, isAuthenticated, login, logout, loading } = useSpotify();
  const { showCardModal, selectedCard, openCardModal, closeCardModal } = useCardModal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sections = homepageData.data.home.sectionContainer.sections.items.filter(
    (section) => section.data.title.transformedLabel
  );

  // Handle login errors from URL params
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorMessages: Record<string, string> = {
        access_denied: 'Login cancelled. Please try again.',
        auth_failed: 'Authentication failed. Please try again.',
        missing_code: 'Authentication error. Please try again.',
      };
      const message = errorMessages[error] || 'An error occurred during login.';
      console.error('Login error:', message);
      // You can show a toast notification here if you have a toast system
      
      // Clean up URL
      router.replace('/');
    }
  }, [searchParams, router]);

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
          user={
            user
              ? {
                  name: user.displayName || user.email,
                  avatar: user.images?.[0]?.url || '',
                }
              : undefined
          }
          onSearch={() => console.log('Search clicked')}
          onLogin={login}
          onSignUp={login}
          onInstallApp={() => {}}
          onHomeClick={() => router.push('/')}
          showInstallApp={false}
          showAuthButtons={true}
          showCustomLinks={false}
          customLinks={[]}
          customActions={
            isAuthenticated
              ? [
                  {
                    id: 'logout',
                    label: 'Log out',
                    onClick: logout,
                    variant: 'text' as const,
                    type: 'button' as const,
                  },
                ]
              : []
          }
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
