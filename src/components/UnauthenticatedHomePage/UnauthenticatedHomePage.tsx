'use client';
import React, { useState, useEffect } from 'react';
import { Card, Stack, Typography, Button, ButtonVariant, ButtonSize, Skeleton } from 'spotify-design-system';
import homepageData from '@/app/data/homepageData.json';

interface UnauthenticatedHomePageProps {
  onCardClick: (card: any) => void;
  onLogin?: () => void;
}

// Helper to extract image URL
const getBestImageUrl = (sources: any[] = []) => {
  if (!sources || sources.length === 0) return '';
  const hasWidth = sources.some((s) => s.width != null);
  if (hasWidth) {
    return (
      sources.find((source) => source.width && source.width >= 300)?.url ||
      sources.find((source) => source.width && source.width >= 64)?.url ||
      sources[0]?.url ||
      ''
    );
  }
  return sources[0]?.url || '';
};

// Helper to extract card props
const getCardProps = (item: any) => {
  const { __typename, data } = item.content || {};
  if (!data) return null;

  const cardPropsMap: Record<string, any> = {
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
    CategoryResponseWrapper: {
      title: data.name || 'Category',
      subtitle: undefined,
      variant: 'default' as const,
      imageUrl: data.icons?.[0]?.url || '',
    },
  };

  return cardPropsMap[__typename as keyof typeof cardPropsMap] || null;
};

interface HeroBannerProps {
  onLogin?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onLogin }) => (
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
      <Button
        variant={ButtonVariant.Primary}
        size={ButtonSize.Large}
        onClick={onLogin || (() => window.open('https://open.spotify.com', '_blank'))}
        className="px-12 py-4 text-lg font-bold"
      >
        Connect with Spotify
      </Button>
      <Typography variant="caption" color="secondary" className="mt-2">
        {onLogin 
          ? 'Log in with your Spotify account to unlock all features'
          : 'Visit Spotify to experience the full music streaming service'}
      </Typography>
    </Stack>
  </div>
);

export const UnauthenticatedHomePage: React.FC<UnauthenticatedHomePageProps> = ({
  onCardClick,
  onLogin,
}) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchHomepageData = async () => {
      // For unauthenticated users, load static data immediately
      // No API call needed - this is a portfolio demo showcase
      const filteredSections = homepageData.data.home.sectionContainer.sections.items.filter(
        (section: any) => {
          const items = section.sectionItems?.items || [];
          const firstItem = items.find((item: any) => item.content?.data);
          return firstItem !== undefined && items.length > 0;
        }
      );
      
      setSections(filteredSections);
      setUsingFallback(false);
      setLoading(false);
    };

    fetchHomepageData();
  }, []);

  if (loading) {
    return (
      <>
        <HeroBanner />
        <div className="px-8 py-6 space-y-8">
          {/* Loading skeletons for content sections */}
          {[1, 2, 3, 4].map((section) => (
            <Stack key={section} direction="column" spacing="lg">
              <Skeleton variant="text" width="30%" height="32px" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((card) => (
                  <Skeleton key={card} variant="rectangular" width="100%" height="200px" />
                ))}
              </div>
            </Stack>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <HeroBanner onLogin={onLogin} />
      
      <div className="px-8 py-6 space-y-8">
        {/* Render Sections */}
        {sections.length > 0 ? (
          sections.map((section: any, sectionIndex: number) => {
            const items = section.sectionItems?.items || [];
            const sectionTitle = section.data?.title?.transformedLabel || 'Discover';

            return (
              <Stack key={sectionIndex} direction="column" spacing="lg">
                <Typography variant="heading" size="xl" weight="bold" color="primary">
                  {sectionTitle}
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {items.slice(0, 10).map((item: any, itemIndex: number) => {
                    const cardProps = getCardProps(item);
                    if (!cardProps) return null;

                    return (
                      <Card
                        key={itemIndex}
                        title={cardProps.title}
                        subtitle={cardProps.subtitle}
                        imageUrl={cardProps.imageUrl}
                        variant={cardProps.variant}
                        onClick={() => onCardClick(item)}
                      />
                    );
                  })}
                </div>
            </Stack>
          );
        })
      ) : (
        <Stack direction="column" align="center" spacing="md" className="py-12">
          <Typography variant="body" color="muted">
            No content available. Please try again later.
          </Typography>
        </Stack>
      )}
      </div>
    </>
  );
};
