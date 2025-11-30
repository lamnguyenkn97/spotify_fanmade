'use client';
import React, { useState, useEffect } from 'react';
import { Card, Stack, Typography, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';
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
  onCardClick,
  onLogin,
}) => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        // Always load static data first
        const staticSections = homepageData.data.home.sectionContainer.sections.items.filter(
          (section: any) => {
            const items = section.sectionItems?.items || [];
            const firstItem = items.find((item: any) => item.content?.data);
            return firstItem !== undefined && items.length > 0;
          }
        );

        // Try to fetch fresh data from Spotify API
        const response = await fetch('/api/spotify/homepage-feed');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Homepage API response:', data);
          
          if (data.data?.home?.sectionContainer?.sections?.items) {
            const apiSections = data.data.home.sectionContainer.sections.items.filter(
              (section: any) => {
                const items = section.sectionItems?.items || [];
                const validItems = items.filter((item: any) => {
                  const hasContent = item.content && (item.content.data || item.content.__typename);
                  return hasContent;
                });
                return validItems.length > 0;
              }
            );
            
            // Merge API sections with static sections
            // API sections first, then static sections (avoid duplicates by title)
            const apiTitles = new Set(
              apiSections.map((s: any) => s.data?.title?.transformedLabel).filter(Boolean)
            );
            const uniqueStaticSections = staticSections.filter(
              (s: any) => !apiTitles.has(s.data?.title?.transformedLabel)
            );
            
            const mergedSections = [...apiSections, ...uniqueStaticSections];
            console.log('Merged sections:', mergedSections.length, '(API:', apiSections.length, '+ Static:', uniqueStaticSections.length, ')');
            
            setSections(mergedSections);
            setUsingFallback(false);
          } else {
            throw new Error('Invalid data structure');
          }
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.warn('API failed, using static homepage data:', error);
        // Fallback to static data only
        const filteredSections = homepageData.data.home.sectionContainer.sections.items.filter(
          (section: any) => {
            const items = section.sectionItems?.items || [];
            const firstItem = items.find((item: any) => item.content?.data);
            return firstItem !== undefined && items.length > 0;
          }
        );
        setSections(filteredSections);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (loading) {
    return (
      <>
        <HeroBanner onLogin={onLogin} />
        <div className="px-8 py-12">
          <Typography variant="body" color="muted">
            Loading...
          </Typography>
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
