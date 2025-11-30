'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider, AppHeader, Stack, Typography, Icon, Footer } from 'spotify-design-system';
import { useRouter } from 'next/navigation';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
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

interface AppLayoutProps {
  children: React.ReactNode;
}

interface LibraryItem {
  id: string;
  title: string;
  type: 'playlist' | 'artist' | 'album' | 'podcast' | 'show';
  image?: string;
  subtitle: string;
  pinned?: boolean;
  isPlaying?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, login, logout } = useSpotify();
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>(LibraryFilter.PLAYLISTS);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showFeatureNotImplemented, setShowFeatureNotImplemented] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLibraryItems(selectedFilter);
    }
  }, [isAuthenticated, selectedFilter]);

  const fetchLibraryItems = async (filter: LibraryFilter) => {
    try {
      let data: LibraryItem[] = [];

      switch (filter) {
        case LibraryFilter.PLAYLISTS:
          // First, add "Liked Songs" as a special playlist
          const likedTracksRes = await fetch('/api/spotify/my-saved-tracks?limit=1');
          if (likedTracksRes.ok) {
            const likedTracksData = await likedTracksRes.json();
            if (likedTracksData.total > 0) {
              const firstTrack = likedTracksData.items?.[0]?.track;
              data.push({
                id: 'liked-songs',
                title: 'Liked Songs',
                type: 'playlist' as const,
                image: firstTrack?.album?.images?.[0]?.url || '',
                subtitle: `Playlist • ${likedTracksData.total} songs`,
                pinned: true, // Always pin Liked Songs at the top
              });
            }
          }

          // Then fetch regular playlists
          const playlistsRes = await fetch('/api/spotify/my-playlists');
          if (playlistsRes.ok) {
            const playlistsData = await playlistsRes.json();
            const playlists =
              playlistsData.items?.map((playlist: any) => ({
                id: playlist.id,
                title: playlist.name,
                type: 'playlist' as const,
                image: playlist.images?.[0]?.url,
                subtitle: `Playlist • ${playlist.owner?.display_name || 'Spotify'}${
                  playlist.tracks?.total ? ` • ${playlist.tracks.total} songs` : ''
                }`,
                pinned: Math.random() > 0.7,
              })) || [];
            data = [...data, ...playlists];
          }
          break;

        case LibraryFilter.PODCASTS_AND_SHOWS:
          const showsRes = await fetch('/api/spotify/my-shows');
          if (showsRes.ok) {
            const showsData = await showsRes.json();
            data =
              showsData.items?.map((item: any) => ({
                id: item.show?.id || item.id,
                title: item.show?.name || item.name,
                type: 'show' as const,
                image: item.show?.images?.[0]?.url || item.images?.[0]?.url,
                subtitle: `Podcast • ${item.show?.publisher || item.publisher || 'Show'}`,
              })) || [];
          }
          break;

        case LibraryFilter.ARTISTS:
          const artistsRes = await fetch('/api/spotify/my-artists');
          if (artistsRes.ok) {
            const artistsData = await artistsRes.json();
            data =
              artistsData.items?.map((artist: any) => ({
                id: artist.id,
                title: artist.name,
                type: 'artist' as const,
                image: artist.images?.[0]?.url,
                subtitle: 'Artist',
              })) || [];
          }
          break;

        case LibraryFilter.ALBUMS:
          const albumsRes = await fetch('/api/spotify/my-albums');
          if (albumsRes.ok) {
            const albumsData = await albumsRes.json();
            data =
              albumsData.items?.map((item: any) => ({
                id: item.album?.id || item.id,
                title: item.album?.name || item.name,
                type: 'album' as const,
                image: item.album?.images?.[0]?.url || item.images?.[0]?.url,
                subtitle: `Album • ${item.album?.artists?.map((a: any) => a.name).join(', ') || 'Unknown'}`,
              })) || [];
          }
          break;
      }

      setLibraryItems(data);
    } catch (error) {
      console.error('Error fetching library items:', error);
    }
  };

  const handleCreatePlaylist = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      // Show feature not implemented for authenticated users
      setShowFeatureNotImplemented(true);
    }
  };

  const handleBrowsePodcasts = () => {
    router.push('/podcasts');
  };

  const handleFilterClick = (filter: LibraryFilter) => {
    setSelectedFilter(filter);
  };

  const handleLibraryItemClick = (item: LibraryItem) => {
    if (item.type === 'playlist' || item.type === 'album') {
      router.push(`/playlist/${item.id}`);
    } else if (item.type === 'show' || item.type === 'podcast') {
      router.push(`/show/${item.id}`);
    } else if (item.type === 'artist') {
      router.push(`/artist/${item.id}`);
    }
  };

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
          >
            {children}
          </AppLayoutContent>

          {/* Feature Not Implemented Modal */}
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
        </QueueDrawerProvider>
      </MusicPlayerProvider>
    </ThemeProvider>
  );
};

// Inner component that has access to MusicPlayerContext
const AppLayoutContent: React.FC<{
  isAuthenticated: boolean;
  user: any;
  libraryItems: LibraryItem[];
  onLogin: () => void;
  onLogout: () => void;
  onCreatePlaylist: () => void;
  onBrowsePodcasts: () => void;
  onFilterClick: (filter: LibraryFilter) => void;
  onLibraryItemClick: (item: LibraryItem) => void;
  router: any;
  children: React.ReactNode;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
}> = ({
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
}) => {
  const { currentTrack } = useMusicPlayerContext();
  const { isQueueOpen, openQueue, closeQueue } = useQueueDrawer();

  const handleLoginFromPrompt = () => {
    setShowLoginPrompt(false);
    onLogin();
  };

  const footerData = {
    developer: [
      { name: 'Portfolio', url: 'https://yourportfolio.com' }, // TODO: Replace
      { name: 'GitHub Profile', url: 'https://github.com/lamnguyenkn97' }, // TODO: Replace
    ],
    project: [
      { name: 'Project Repository', url: 'https://github.com/lamnguyenkn97/spotify_fanmade' }, // TODO: Replace
      { name: 'Design System', url: 'https://github.com/lamnguyenkn97/spotify_design_system' },
      { name: 'Storybook', url: 'https://spotify-storybook.vercel.app' },
    ],
    social: [
      { icon: faGithub, url: 'https://github.com/lamnguyenkn97', label: 'GitHub' }, // TODO: Replace
      { icon: faLinkedin, url: 'https://linkedin.com/in/yourprofile', label: 'LinkedIn' }, // TODO: Replace
    ],
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
                { id: 'npm', label: 'Design System', href: 'https://www.npmjs.com/package/spotify-design-system' },
                { id: 'storybook', label: 'Documentation', href: 'https://spotify-storybook.vercel.app' },
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
            onAddClick={onCreatePlaylist}
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
                  {footerData.developer.map((link, index) => (
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
                  {footerData.project.map((link, index) => (
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
                  {footerData.social.map((social, index) => (
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
              <Typography variant="caption" color="muted" className="text-center">
                © 2025 Lam Nguyen
              </Typography>
              <Stack direction="row" spacing="xs" align="center" justify="center">
                <Typography variant="body" size="sm" color="muted">
                  Made with
                </Typography>
                <Icon icon={faHeart} size="sm" className="text-spotify-green" />
                <Typography variant="body" size="sm" color="muted">
                  for music lovers
                </Typography>
              </Stack>
              <Typography variant="caption" color="muted" className="text-center">
                Not affiliated with Spotify AB • Independent portfolio project
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
    </Stack>
  );
};
