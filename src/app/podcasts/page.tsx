'use client';

import {
  ThemeProvider,
  AppHeader,
  Typography,
  Stack,
  Button,
  ButtonVariant,
  ButtonSize,
  Icon,
} from 'spotify-design-system';
import { CategoryCard } from 'spotify-design-system/dist/components/molecules/CategoryCard';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import categoriesData from '../data/categoriesData.json';
import { UnauthenticatedSideBar, CookieBanner, SignupBanner, AuthModals } from '@/components';
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

export default function PodcastsPage() {
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const { user, isAuthenticated, login, logout } = useSpotify();
  const { showCardModal, selectedCard, openCardModal, closeCardModal } = useCardModal();
  const router = useRouter();

  const header = categoriesData.data.browse.header;
  const sections = categoriesData.data.browse.sections.items.filter(
    (section) => section.data.title?.transformedLabel
  );

  const handleCloseCookieBanner = () => {
    setShowCookieBanner(false);
  };

  const handleCreatePlaylist = () => {
    router.push('/');
  };

  const handleBrowsePodcasts = () => {
    // Already on podcasts page, do nothing
  };

  const handleSignUpFree = () => {
    login();
    closeCardModal();
  };

  const handleLogin = () => {
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
            <Stack direction="column" className="flex-1 overflow-y-auto bg-spotify-dark">
              {/* Content Sections */}
              <div className="px-6 pt-6 pb-6">
                {sections.map((section, sectionIndex) => {
                  const firstItem = section.sectionItems.items.filter(
                    (item) => item.content?.data?.data?.cardRepresentation
                  )[0];
                  const firstCard = firstItem?.content.data.data.cardRepresentation;
                  const firstImageUrl = firstCard?.artwork?.sources
                    ? getBestImageUrl(firstCard.artwork.sources)
                    : undefined;

                  return (
                    <Stack key={sectionIndex} direction="column" spacing="lg" className="mb-8">
                      <Typography variant="heading" size="xl" weight="bold" color="primary">
                        {section?.data?.title?.transformedLabel}
                      </Typography>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {section.sectionItems.items
                          .filter((item) => item.content?.data?.data?.cardRepresentation)
                          .map((item, itemIndex) => {
                            const card = item.content.data.data.cardRepresentation;
                            const imageUrl = card.artwork?.sources
                              ? getBestImageUrl(card.artwork.sources)
                              : undefined;

                            return (
                              <CategoryCard
                                key={itemIndex}
                                title={card.title.transformedLabel}
                                backgroundColor={card.backgroundColor.hex}
                                overlayImageUrl={imageUrl}
                                onClick={() => openCardModal(card.title.transformedLabel, imageUrl)}
                                aria-label={`Browse ${card.title.transformedLabel}`}
                              />
                            );
                          })}
                      </div>

                      {/* See all categories link */}
                      {sectionIndex === sections.length - 1 && firstCard && (
                        <Button
                          text="See all categories"
                          variant={ButtonVariant.Text}
                          size={ButtonSize.Medium}
                          onClick={() =>
                            openCardModal(firstCard.title.transformedLabel, firstImageUrl)
                          }
                          icon={<Icon icon={faChevronRight} size="sm" />}
                          style={{ fontWeight: 700 }}
                          className="self-start"
                        />
                      )}
                    </Stack>
                  );
                })}
              </div>
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
        showCreatePlaylistDialog={false}
        onCloseCreatePlaylist={() => {}}
        onLogin={handleLogin}
        showCardModal={showCardModal}
        selectedCard={selectedCard}
        onCloseCardModal={closeCardModal}
        onSignUpFree={handleSignUpFree}
      />
    </ThemeProvider>
  );
}
