'use client';
import React, { useState, useEffect } from 'react';
import { Card, Stack, Typography, Button, ButtonVariant, ButtonSize, Skeleton } from 'spotify-design-system';
import homepageData from '@/app/data/homepageData.json';
import { getBestImageUrlByWidth } from '@/utils/imageHelpers';
import { RequestDemoModal } from '@/components';

interface UnauthenticatedHomePageProps {
  onCardClick: (card: any) => void;
  onLogin?: () => void;
}


// Helper to extract card props
const getCardProps = (item: any) => {
  const { __typename, data } = item.content || {};
  if (!data) return null;

  const cardPropsMap: Record<string, any> = {
    TrackResponseWrapper: {
      title: data.name || 'Unknown Track',
      subtitle: data.artists?.items?.[0]?.profile?.name || 'Unknown Artist',
      variant: 'default' as const,
      imageUrl: getBestImageUrlByWidth(data.albumOfTrack?.coverArt?.sources),
    },
    ArtistResponseWrapper: {
      title: data.profile?.name || 'Unknown Artist',
      subtitle: undefined,
      variant: 'artist' as const,
      imageUrl: getBestImageUrlByWidth(data.visuals?.avatarImage?.sources),
    },
    AlbumResponseWrapper: {
      title: data.name || 'Unknown Album',
      subtitle: data.artists?.items?.[0]?.profile?.name || 'Unknown Artist',
      variant: 'default' as const,
      imageUrl: getBestImageUrlByWidth(data.coverArt?.sources),
    },
    PlaylistResponseWrapper: {
      title: data.name || 'Unknown Playlist',
      subtitle: data.description || 'Playlist',
      variant: 'default' as const,
      imageUrl: getBestImageUrlByWidth(data.images?.items?.[0]?.sources || data.images?.items),
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
  onRequestDemo: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onRequestDemo }) => (
  <div className="relative w-full bg-gradient-to-b from-spotify-green/20 to-transparent px-8 py-12 mb-8">
    <Stack direction="column" spacing="lg" align="center" className="max-w-4xl mx-auto text-center">
      <Stack direction="column" spacing="md">
        <Typography variant="heading" weight="bold" color="primary" className="text-5xl">
          Spotify Fan-Made Experience
        </Typography>
        <Typography variant="body" color="secondary" className="text-xl">
          Frontend portfolio project with custom design system
        </Typography>
      </Stack>
      
      <Button
        variant={ButtonVariant.Primary}
        size={ButtonSize.Large}
        onClick={onRequestDemo}
        className="px-12 py-4 text-lg font-bold"
      >
        Request Demo Access
      </Button>
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
  const [showRequestModal, setShowRequestModal] = useState(false);

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
        <HeroBanner onRequestDemo={() => setShowRequestModal(true)} />
        <RequestDemoModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} />
        <Stack direction="column" spacing="lg" className="px-8 py-6">
          {/* Loading skeletons for content sections */}
          {[1, 2, 3, 4].map((section) => (
            <Stack key={section} direction="column" spacing="lg">
              <Skeleton variant="text" width="30%" height="32px" />
              <Stack direction="row" spacing="md" className="flex-wrap">
                {[1, 2, 3, 4, 5].map((card) => (
                  <Skeleton key={card} variant="rectangular" width="180px" height="200px" />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </>
    );
  }

  return (
    <>
      <HeroBanner onRequestDemo={() => setShowRequestModal(true)} />
      <RequestDemoModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} />
      
      <Stack direction="column" spacing="lg" className="px-8 py-6">
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
                <Stack direction="row" spacing="md" className="flex-wrap">
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
                </Stack>
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
      </Stack>
    </>
  );
};
