import { useState, useEffect } from 'react';

interface User {
  id: string;
  displayName: string;
  email: string;
  images: Array<{ url: string }>;
  product: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  owner: any;
  tracks: any;
  public: boolean;
}

export const useSpotify = () => {
  const [user, setUser] = useState<User | null>(null);
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
      console.error('Error checking auth:', error);
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
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getPlaylists = async (): Promise<Playlist[]> => {
    try {
      const response = await fetch('/api/playlists');
      if (!response.ok) throw new Error('Failed to fetch playlists');
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching playlists:', error);
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
      console.error('Error creating playlist:', error);
      return null;
    }
  };

  const getPlaylist = async (id: string): Promise<Playlist | null> => {
    try {
      const response = await fetch(`/api/playlists/${id}`);
      if (!response.ok) throw new Error('Failed to fetch playlist');
      return await response.json();
    } catch (error) {
      console.error('Error fetching playlist:', error);
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
