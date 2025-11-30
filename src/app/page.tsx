'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  UnauthenticatedHomePage,
  AuthenticatedHomePage,
  AuthModals,
} from '@/components';
import { useSpotify } from '@/hooks/useSpotify';
import { useCardModal } from '@/hooks/useCardModal';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, login } = useSpotify();
  const { showCardModal, selectedCard, openCardModal, closeCardModal } = useCardModal();
  const [showCreatePlaylistDialog, setShowCreatePlaylistDialog] = useState(false);
  
  // Handle error from URL parameters (OAuth callback errors)
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error === 'access_denied') {
      console.error('User denied authorization');
      alert('You need to authorize the app to use Spotify features');
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
        <UnauthenticatedHomePage onCardClick={openCardModal} onLogin={handleLogin} />
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
