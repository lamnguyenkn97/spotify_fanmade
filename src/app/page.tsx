'use client';

import React, { useEffect, Suspense } from 'react';
import { UnauthenticatedHomePage, AuthenticatedHomePage, AuthModals } from '@/components';
import { useSpotify } from '@/hooks/useSpotify';
import { useCardModal } from '@/hooks/useCardModal';
import { useSearchParams } from 'next/navigation';
import { Stack, Skeleton } from 'spotify-design-system';
import { useToast } from '@/contexts/ToastContext';

function HomeContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, login } = useSpotify();
  const { showCardModal, openCardModal, closeCardModal } = useCardModal();
  const toast = useToast();

  // Handle error from URL parameters (OAuth callback errors)
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error === 'access_denied') {
      toast.warning('You need to authorize the app to use Spotify features');
      window.history.replaceState({}, '', '/');
    } else if (error === 'auth_failed' || errorDescription) {
      toast.error('Authentication failed. Please try again.');
      window.history.replaceState({}, '', '/');
    }

    // Handle missing code (shouldn't happen but just in case)
    const code = searchParams.get('code');
    if (searchParams.get('missing_code') === 'true' || (code && !code.trim())) {
      toast.error('Authentication error. Please try logging in again.');
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams, toast]);

  const handleLogin = () => {
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
      {/* Unified Authentication Modal */}
      <AuthModals
        showCardModal={showCardModal}
        onCloseCardModal={closeCardModal}
        onLogin={handleLogin}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <Stack direction="column" spacing="lg" className="p-6">
          {/* Hero Banner Skeleton */}
          <Stack direction="column" spacing="md" align="center" className="mb-8">
            <Skeleton variant="text" width="60%" height="48px" />
            <Skeleton variant="text" width="80%" height="24px" />
            <Skeleton variant="rectangular" width="200px" height="48px" />
          </Stack>

          {/* Content Sections Skeleton */}
          {[1, 2, 3].map((section) => (
            <Stack key={section} direction="column" spacing="md">
              <Skeleton variant="text" width="30%" height="32px" />
              <Stack direction="row" spacing="md">
                {[1, 2, 3, 4, 5].map((card) => (
                  <Skeleton key={card} variant="rectangular" width="180px" height="180px" />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
