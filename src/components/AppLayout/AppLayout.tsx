'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ThemeProvider,
  AppHeader,
  Stack,
  Typography,
  Icon,
  Footer,
  colors,
} from 'spotify-design-system';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {
  UnauthenticatedSideBar,
  AuthenticatedSideBar,
  LibraryFilter,
} from '@/components/LibrarySideBar';
import { useSpotify } from '@/hooks/useSpotify';
import { MusicPlayerProvider, useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { QueueDrawerProvider, useQueueDrawer } from '@/contexts/QueueDrawerContext';
import { MusicPlayer } from '@/components/MusicPlayer';
import { QueueDrawer } from '@/components/QueueDrawer';
import { Modal, ModalSize } from 'spotify-design-system';
import { FOOTER_DATA } from '@/config/footerData';
import { SpotifyUser, LibraryItem } from '@/types';
import {
  useSavedTracks,
  useMyPlaylists,
  useMyShows,
  useMyAlbums,
} from '@/hooks/api';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, login, logout } = useSpotify();
  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>(LibraryFilter.PLAYLISTS);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showFeatureNotImplemented, setShowFeatureNotImplemented] = useState(false);

  // Fetch all library data with SWR hooks
  const { tracks: likedTracks, total: likedTotal } = useSavedTracks(1, isAuthenticated);
  const { playlists } = useMyPlaylists(isAuthenticated);
  const { shows } = useMyShows(isAuthenticated);
  const { albums } = useMyAlbums(isAuthenticated);

  // Transform data based on selected filter using useMemo for performance
  const libraryItems = useMemo((): LibraryItem[] => {
    if (!isAuthenticated) return [];

    try {
      switch (selectedFilter) {
        case LibraryFilter.PLAYLISTS: {
          const items: LibraryItem[] = [];
          
          // Add "Liked Songs" as first item if user has liked tracks
          if (likedTotal > 0 && likedTracks && likedTracks.length > 0) {
            const firstTrack = likedTracks[0]?.track;
            items.push({
              id: 'liked-songs',
              title: 'Liked Songs',
              type: 'playlist' as const,
              image: firstTrack?.album?.images?.[0]?.url || '',
              subtitle: `Playlist • ${likedTotal} songs`,
              pinned: true,
            });
          }

          // Add regular playlists
          const playlistItems = (playlists || []).map((playlist: any) => ({
            id: playlist.id,
            title: playlist.name,
            type: 'playlist' as const,
            image: playlist.images?.[0]?.url,
            subtitle: `Playlist • ${playlist.owner?.display_name || 'Spotify'}${
              playlist.tracks?.total ? ` • ${playlist.tracks.total} songs` : ''
            }`,
            pinned: false,
          }));

          return [...items, ...playlistItems];
        }

        case LibraryFilter.PODCASTS_AND_SHOWS:
          return (shows || []).map((item: any) => ({
            id: item.show?.id || item.id,
            title: item.show?.name || item.name,
            type: 'show' as const,
            image: item.show?.images?.[0]?.url || item.images?.[0]?.url,
            subtitle: `Podcast • ${item.show?.publisher || item.publisher || 'Show'}`,
          }));

        case LibraryFilter.ARTISTS:
          // Note: We don't have a useMyArtists hook yet, so this will be empty
          // TODO: Add useMyArtists hook to useSpotifyApi.ts
          return [];

        case LibraryFilter.ALBUMS:
          return (albums || []).map((item: any) => ({
            id: item.album?.id || item.id,
            title: item.album?.name || item.name,
            type: 'album' as const,
            image: item.album?.images?.[0]?.url || item.images?.[0]?.url,
            subtitle: `Album • ${item.album?.artists?.map((a: any) => a.name).join(', ') || 'Unknown'}`,
          }));

        default:
          return [];
      }
    } catch (err) {
      // Silently handle any transformation errors
      return [];
    }
  }, [selectedFilter, isAuthenticated, likedTracks, likedTotal, playlists, shows, albums]);

  const handleCreatePlaylist = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      // Show feature not implemented for authenticated users
      setShowFeatureNotImplemented(true);
    }
  }, [isAuthenticated]);

  const handleBrowsePodcasts = useCallback(() => {
    router.push('/podcasts');
  }, [router]);

  const handleFilterClick = useCallback((filter: LibraryFilter) => {
    setSelectedFilter(filter);
  }, []);

  const handleLibraryItemClick = useCallback((item: LibraryItem) => {
    if (item.type === 'playlist' || item.type === 'album') {
      router.push(`/playlist/${item.id}`);
    } else if (item.type === 'show' || item.type === 'podcast') {
      router.push(`/show/${item.id}`);
    } else if (item.type === 'artist') {
      router.push(`/artist/${item.id}`);
    }
  }, [router]);

  return (
    <ThemeProvider>
      <MusicPlayerProvider>
        <QueueDrawerProvider>
          <AppLayoutContent
            isAuthenticated={isAuthenticated}
            user={user}
            libraryItems={libraryItems}
            onLogin={login}
            onLogout={logout}
            onCreatePlaylist={handleCreatePlaylist}
            onBrowsePodcasts={handleBrowsePodcasts}
            onFilterClick={handleFilterClick}
            onLibraryItemClick={handleLibraryItemClick}
            router={router}
            showLoginPrompt={showLoginPrompt}
            setShowLoginPrompt={setShowLoginPrompt}
            showFeatureNotImplemented={showFeatureNotImplemented}
            setShowFeatureNotImplemented={setShowFeatureNotImplemented}
          >
            {children}
          </AppLayoutContent>
        </QueueDrawerProvider>
      </MusicPlayerProvider>
    </ThemeProvider>
  );
};

// Inner component that has access to MusicPlayerContext
interface AppLayoutContentProps {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  libraryItems: LibraryItem[];
  onLogin: () => void;
  onLogout: () => void;
  onCreatePlaylist: () => void;
  onBrowsePodcasts: () => void;
  onFilterClick: (filter: LibraryFilter) => void;
  onLibraryItemClick: (item: LibraryItem) => void;
  router: AppRouterInstance;
  children: React.ReactNode;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
  showFeatureNotImplemented: boolean;
  setShowFeatureNotImplemented: (show: boolean) => void;
}

const AppLayoutContent: React.FC<AppLayoutContentProps> = ({
  isAuthenticated,
  user,
  libraryItems,
  onLogin,
  onLogout,
  onCreatePlaylist,
  onBrowsePodcasts,
  onFilterClick,
  onLibraryItemClick,
  router,
  children,
  showLoginPrompt,
  setShowLoginPrompt,
  showFeatureNotImplemented,
  setShowFeatureNotImplemented,
}) => {
  const { currentTrack } = useMusicPlayerContext();
  const { isQueueOpen, openQueue, closeQueue } = useQueueDrawer();

  const handleLoginFromPrompt = () => {
    setShowLoginPrompt(false);
    onLogin();
  };

  return (
    <Stack direction="column" className="h-screen bg-spotify-dark text-white overflow-hidden">
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
        onSearch={(query: string) => {
          if (!isAuthenticated) {
            // Show login prompt for unauthenticated users only when they actually try to search
            if (query.trim()) {
              // Use setTimeout to avoid Enter key event propagating to modal
              setTimeout(() => {
                setShowLoginPrompt(true);
              }, 0);
            }
            return;
          }
          // Authenticated users can search
          if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
          } else {
            router.push('/search');
          }
        }}
        onLogin={onLogin}
        onInstallApp={() => {}}
        onHomeClick={() => router.push('/')}
        showInstallApp={false}
        showAuthButtons={true}
        showCustomLinks={!isAuthenticated}
        customLinks={
          !isAuthenticated
            ? [
                { id: 'portfolio', label: 'Portfolio Demo', href: '#' },
                {
                  id: 'npm',
                  label: 'Design System',
                  href: 'https://www.npmjs.com/package/spotify-design-system',
                },
                {
                  id: 'storybook',
                  label: 'Documentation',
                  href: 'https://spotify-storybook.vercel.app',
                },
              ]
            : []
        }
        customActions={
          isAuthenticated
            ? [
                {
                  id: 'logout',
                  label: 'Log out',
                  onClick: onLogout,
                  variant: 'text' as const,
                  type: 'button' as const,
                },
              ]
            : []
        }
      />

      <Stack direction="row" className="flex-1 overflow-hidden min-w-0">
        {isAuthenticated ? (
          <AuthenticatedSideBar
            libraryItems={libraryItems}
            onAddClick={onCreatePlaylist}
            onExpandClick={() => setShowFeatureNotImplemented(true)}
            onFilterClick={onFilterClick}
            onLibraryItemClick={onLibraryItemClick}
            onSearch={() => setShowFeatureNotImplemented(true)}
          />
        ) : (
          <UnauthenticatedSideBar
            onCreatePlaylist={onCreatePlaylist}
            onBrowsePodcasts={onBrowsePodcasts}
          />
        )}
        <Stack
          direction="column"
          className={`flex-1 min-w-0 overflow-y-auto ${currentTrack ? 'pb-[120px]' : 'pb-4'}`}
        >
          {children}

          {/* Footer at bottom of content */}
          <Footer copyrightText="" showSocialLinks={false} showLinks={false} showCopyright={false}>
            <Stack direction="row" spacing="sm" align="start" justify="space-between">
              {/* Developer Column */}
              <Stack direction="column" spacing="md" align="start">
                <Typography variant="body" weight="bold" color="primary">
                  Developer
                </Typography>
                <Stack direction="column" spacing="sm">
                  {FOOTER_DATA.developer.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:underline"
                    >
                      <Typography variant="body" size="sm" color="muted">
                        {link.name}
                      </Typography>
                    </a>
                  ))}
                </Stack>
              </Stack>

              {/* Project Column */}
              <Stack direction="column" spacing="md" align="start">
                <Typography variant="body" weight="bold" color="primary">
                  Project
                </Typography>
                <Stack direction="column" spacing="sm">
                  {FOOTER_DATA.project.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:underline"
                    >
                      <Typography variant="body" size="sm" color="muted">
                        {link.name}
                      </Typography>
                    </a>
                  ))}
                </Stack>
              </Stack>

              {/* Social Column */}
              <Stack direction="column" spacing="md" align="start">
                <Typography variant="body" weight="bold" color="primary">
                  Social
                </Typography>
                <Stack direction="row" spacing="md">
                  {FOOTER_DATA.social.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="transition-opacity hover:opacity-70"
                    >
                      <Icon icon={social.icon} size="lg" className="text-white" />
                    </a>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            {/* Legal Disclaimer */}
            <Stack
              direction="column"
              spacing="sm"
              className="mt-8 pt-8 border-t border-spotify-grey2"
            >
              <Typography variant="caption" color="primary" className="text-center">
                © 2025 Lam Nguyen
              </Typography>
              <Stack direction="row" spacing="xs" align="center" justify="center">
                <Typography variant="body" size="sm" color="primary">
                  Made with
                </Typography>
                <Icon icon={faHeart} size="sm" color={colors.primary.brand} />
                <Typography variant="body" size="sm" color="primary">
                  for music lovers
                </Typography>
              </Stack>
              <Typography variant="caption" color="secondary" className="text-center">
                Not affiliated with Spotify AB.
              </Typography>
            </Stack>
          </Footer>
        </Stack>

        {/* Queue Panel - Side Column */}
        <QueueDrawer isOpen={isQueueOpen} onClose={closeQueue} />
      </Stack>

      <MusicPlayer onQueueClick={openQueue} />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <Modal
          open={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          size={ModalSize.Small}
          title="Connect with Spotify"
          description="Log in with your Spotify account to experience all features including search, playlists, library, and personalized recommendations."
          actions={[
            {
              label: 'Connect with Spotify',
              onClick: handleLoginFromPrompt,
              variant: 'primary',
            },
          ]}
          showCloseButton={true}
          closeOnBackdropClick={false}
          closeOnEscape={true}
        />
      )}

      {/* Feature Not Implemented Modal */}
      {showFeatureNotImplemented && (
        <Modal
          open={showFeatureNotImplemented}
          onClose={() => setShowFeatureNotImplemented(false)}
          size={ModalSize.Small}
          title="Feature Not Implemented"
          description="This feature is not implemented in this portfolio demo. Please visit the official Spotify website to experience the full functionality."
          actions={[
            {
              label: 'Visit Spotify',
              onClick: () => {
                window.open('https://open.spotify.com', '_blank');
                setShowFeatureNotImplemented(false);
              },
              variant: 'primary',
            },
          ]}
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        />
      )}
    </Stack>
  );
};
