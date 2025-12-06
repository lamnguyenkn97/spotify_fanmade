import { useState, useEffect } from 'react';
import { SpotifyUser, SpotifyPlaylist } from '@/types';

export const useSpotify = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      // Failed to check auth status, user remains unauthenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const response = await fetch('/api/auth/login');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      // Failed to initiate login, silently fail
      // User will remain on current page
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      // Failed to logout on server, but clear local state anyway
      setUser(null);
      window.location.href = '/';
    }
  };

  const getPlaylists = async (): Promise<Playlist[]> => {
    try {
      const response = await fetch('/api/playlists');
      if (!response.ok) throw new Error('Failed to fetch playlists');
      const data = await response.json();
      return data.items;
    } catch (error) {
      // Failed to fetch playlists, return empty array
      return [];
    }
  };

  const createPlaylist = async (
    name: string,
    description?: string,
    isPublic?: boolean
  ): Promise<Playlist | null> => {
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, isPublic }),
      });
      if (!response.ok) throw new Error('Failed to create playlist');
      return await response.json();
    } catch (error) {
      // Failed to create playlist, return null
      return null;
    }
  };

  const getPlaylist = async (id: string): Promise<Playlist | null> => {
    try {
      const response = await fetch(`/api/playlists/${id}`);
      if (!response.ok) throw new Error('Failed to fetch playlist');
      return await response.json();
    } catch (error) {
      // Failed to fetch playlist, return null
      return null;
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    getPlaylists,
    createPlaylist,
    getPlaylist,
  };
};

