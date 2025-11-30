'use client';
import React from 'react';
import { ContentSections } from '../ContentSections';
import { Stack, Typography, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';

interface UnauthenticatedHomePageProps {
  sections: any[];
  onCardClick: (card: any) => void;
  getCardProps: (item: any) => any;
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

export const UnauthenticatedHomePage: React.FC<UnauthenticatedHomePageProps> = ({
  sections,
  onCardClick,
  getCardProps,
  onLogin,
}) => {
  return (
    <>
      <HeroBanner onLogin={onLogin} />
      <ContentSections sections={sections} onCardClick={onCardClick} getCardProps={getCardProps} />
    </>
  );
};
