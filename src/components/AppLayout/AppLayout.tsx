'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider, AppHeader, Stack } from 'spotify-design-system';
import { useRouter } from 'next/navigation';
import { UnauthenticatedSideBar, AuthenticatedSideBar, LibraryFilter } from '@/components/LibrarySideBar';
import { useSpotify } from '@/hooks/useSpotify';

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
          const playlistsRes = await fetch('/api/spotify/my-playlists');
          if (playlistsRes.ok) {
            const playlistsData = await playlistsRes.json();
            data = playlistsData.items?.map((playlist: any) => ({
              id: playlist.id,
              title: playlist.name,
              type: 'playlist' as const,
              image: playlist.images?.[0]?.url,
              subtitle: `Playlist • ${playlist.owner?.display_name || 'Spotify'}${
                playlist.tracks?.total ? ` • ${playlist.tracks.total} songs` : ''
              }`,
              pinned: Math.random() > 0.7,
            })) || [];
          }
          break;

        case LibraryFilter.PODCASTS_AND_SHOWS:
          const showsRes = await fetch('/api/spotify/my-shows');
          if (showsRes.ok) {
            const showsData = await showsRes.json();
            data = showsData.items?.map((item: any) => ({
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
            data = artistsData.items?.map((artist: any) => ({
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
            data = albumsData.items?.map((item: any) => ({
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
    console.log('Create playlist');
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
            if (query.trim()) {
              router.push(`/search?q=${encodeURIComponent(query)}`);
            } else {
              router.push('/search');
            }
          }}
          onLogin={login}
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

        <Stack direction="row" className="flex-1 overflow-hidden min-w-0">
          {isAuthenticated ? (
            <AuthenticatedSideBar
              currentView="list"
              libraryItems={libraryItems}
              onAddClick={handleCreatePlaylist}
              onExpandClick={() => console.log('Expand')}
              onFilterClick={handleFilterClick}
              onLibraryItemClick={handleLibraryItemClick}
              onSearch={() => console.log('Search')}
              onViewToggle={() => console.log('View toggle')}
            />
          ) : (
            <UnauthenticatedSideBar
              onCreatePlaylist={handleCreatePlaylist}
              onBrowsePodcasts={handleBrowsePodcasts}
            />
          )}
          <Stack direction="column" className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
