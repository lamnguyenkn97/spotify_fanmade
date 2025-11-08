'use client';

import React, { useState, useEffect } from 'react';
import homepageData from './data/homepageData.json';
import {
  CookieBanner,
  SignupBanner,
  UnauthenticatedHomePage,
  AuthenticatedHomePage,
  AuthModals,
} from '@/components';
import { useSpotify } from '@/hooks/useSpotify';
import { useCardModal } from '@/hooks/useCardModal';
import { useRouter, useSearchParams } from 'next/navigation';

// Helper: Extract best quality image URL from sources
const getBestImageUrl = (sources: any[] = []) => {
  if (!sources || sources.length === 0) return '';

  // Handle sources with width/height properties
  const hasWidth = sources.some((s) => s.width != null);
  if (hasWidth) {
    return (
      sources.find((source) => source.width && source.width >= 300)?.url ||
      sources.find((source) => source.width && source.width >= 64)?.url ||
      sources[0]?.url ||
      ''
    );
  }

  // Handle sources without width (e.g., radio/chart images with null width)
  return sources[0]?.url || '';
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
      subtitle: data.description || 'Playlist',
      variant: 'default' as const,
      imageUrl: getBestImageUrl(data.images?.items?.[0]?.sources || data.images?.items),
    },
  };

  return cardPropsMap[__typename as keyof typeof cardPropsMap] || null;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, login } = useSpotify();
  const { showCardModal, selectedCard, openCardModal, closeCardModal } = useCardModal();
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [showCreatePlaylistDialog, setShowCreatePlaylistDialog] = useState(false);

  const sections = homepageData.data.home.sectionContainer.sections.items.filter((section: any) => {
    const items = section.sectionItems?.items || [];
    const firstItem = items.find((item: any) => item.content?.data);
    return firstItem !== undefined && items.length > 0;
  });
  // Handle error from URL parameters (OAuth callback errors)
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error === 'access_denied') {
      console.error('User denied authorization');
      alert('You need to authorize the app to use Spotify features');
      // Clean up URL
      window.history.replaceState({}, '', '/');
    } else if (error === 'auth_failed' || errorDescription) {
      console.error('Authentication failed:', errorDescription);
      alert('Authentication failed. Please try again.');
      window.history.replaceState({}, '', '/');
    }

    // Handle missing code (shouldn't happen but just in case)
    const code = searchParams.get('code');
    if (searchParams.get('missing_code') === 'true' || (code && !code.trim())) {
      console.error('Authorization code was missing');
      alert('Authentication error. Please try logging in again.');
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  const handleCloseCookieBanner = () => {
    setShowCookieBanner(false);
  };

  const handleLogin = () => {
    login();
    closeCardModal();
  };

  const handleSignUpFree = () => {
    login();
    closeCardModal();
  };

  return (
    <>
      {isAuthenticated && user ? (
        <AuthenticatedHomePage user={user} />
      ) : (
        <UnauthenticatedHomePage
          sections={sections}
          onCardClick={openCardModal}
          onShowAll={openCardModal}
          getCardProps={getCardProps}
        />
      )}
      {/* All Authentication Modals */}
      <AuthModals
        showCreatePlaylistDialog={showCreatePlaylistDialog}
        onCloseCreatePlaylist={() => setShowCreatePlaylistDialog(false)}
        onLogin={handleLogin}
        showCardModal={showCardModal}
        selectedCard={selectedCard}
        onCloseCardModal={closeCardModal}
        onSignUpFree={handleSignUpFree}
      />
    </>
  );
}
