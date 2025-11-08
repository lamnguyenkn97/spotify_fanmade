'use client';

import React from 'react';
import { ThemeProvider, AppHeader, Stack } from 'spotify-design-system';
import { useRouter } from 'next/navigation';
import { UnauthenticatedSideBar } from '@/components/LibrarySideBar';
import { useSpotify } from '@/hooks/useSpotify';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, login, logout } = useSpotify();

  const handleCreatePlaylist = () => {
    console.log('Create playlist');
  };

  const handleBrowsePodcasts = () => {
    router.push('/podcasts');
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
          onSearch={() => console.log('Search clicked')}
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
          <UnauthenticatedSideBar
            onCreatePlaylist={handleCreatePlaylist}
            onBrowsePodcasts={handleBrowsePodcasts}
          />
          <Stack direction="column" className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
