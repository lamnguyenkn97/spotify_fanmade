'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { UseMusicPlayerReturn } from '@/hooks/useMusicPlayer';

const MusicPlayerContext = createContext<UseMusicPlayerReturn | undefined>(undefined);

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({ children }) => {
  const musicPlayer = useMusicPlayer();

  return <MusicPlayerContext.Provider value={musicPlayer}>{children}</MusicPlayerContext.Provider>;
};

export const useMusicPlayerContext = (): UseMusicPlayerReturn => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayerContext must be used within MusicPlayerProvider');
  }
  return context;
};
