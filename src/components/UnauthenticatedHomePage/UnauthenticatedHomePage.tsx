'use client';
import React, { useState, useEffect } from 'react';
import { Card, Stack, Typography, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';

interface UnauthenticatedHomePageProps {
  onCardClick: (card: any) => void;
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
  onCardClick,
  onLogin,
}) => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrowseData = async () => {
      try {
        const [playlistsRes, releasesRes] = await Promise.all([
          fetch('/api/spotify/browse/featured-playlists'),
          fetch('/api/spotify/browse/new-releases'),
        ]);

        if (playlistsRes.ok) {
          const playlistsData = await playlistsRes.json();
          setFeaturedPlaylists(playlistsData.playlists?.items || []);
        }

        if (releasesRes.ok) {
          const releasesData = await releasesRes.json();
          setNewReleases(releasesData.albums?.items || []);
        }
      } catch (error) {
        console.error('Error fetching browse data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrowseData();
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
      
      <div className="px-8 py-6 space-y-12">
        {/* Featured Playlists Section */}
        {featuredPlaylists.length > 0 && (
          <Stack direction="column" spacing="lg">
            <Typography variant="heading" size="xl" weight="bold" color="primary">
              Featured Playlists
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featuredPlaylists.slice(0, 10).map((playlist) => (
                <Card
                  key={playlist.id}
                  title={playlist.name}
                  subtitle={playlist.description || 'Playlist'}
                  imageUrl={playlist.images?.[0]?.url}
                  variant="default"
                  onClick={() => onCardClick(playlist)}
                />
              ))}
            </div>
          </Stack>
        )}

        {/* New Releases Section */}
        {newReleases.length > 0 && (
          <Stack direction="column" spacing="lg">
            <Typography variant="heading" size="xl" weight="bold" color="primary">
              New Releases
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {newReleases.slice(0, 10).map((album) => (
                <Card
                  key={album.id}
                  title={album.name}
                  subtitle={album.artists?.map((a: any) => a.name).join(', ') || 'Various Artists'}
                  imageUrl={album.images?.[0]?.url}
                  variant="default"
                  onClick={() => onCardClick(album)}
                />
              ))}
            </div>
          </Stack>
        )}
      </div>
    </>
  );
};
