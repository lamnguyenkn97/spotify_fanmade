/**
 * Legacy useSpotify hook - now uses SWR-based API client
 * This hook maintains backward compatibility while using the new API layer
 */

import { useAuthUser, loginWithSpotify, logout as logoutUser } from './api/useAuth';
import { apiClient } from '@/lib/api-client';
import { SpotifyPlaylist } from '@/types';

export const useSpotify = () => {
  const { user, isAuthenticated, isLoading } = useAuthUser();

  // Legacy helper functions that aren't using SWR
  const getPlaylists = async (): Promise<SpotifyPlaylist[]> => {
    try {
      const data = await apiClient.get<{ items: SpotifyPlaylist[] }>('/api/playlists');
      return data.items;
    } catch (error) {
      return [];
    }
  };

  const createPlaylist = async (
    name: string,
    description?: string,
    isPublic?: boolean
  ): Promise<SpotifyPlaylist | null> => {
    try {
      return await apiClient.post<SpotifyPlaylist>('/api/playlists', {
        name,
        description,
        isPublic,
      });
    } catch (error) {
      return null;
    }
  };

  const getPlaylist = async (id: string): Promise<SpotifyPlaylist | null> => {
    try {
      return await apiClient.get<SpotifyPlaylist>(`/api/playlists/${id}`);
    } catch (error) {
      return null;
    }
  };

  return {
    user,
    loading: isLoading,
    isAuthenticated,
    login: loginWithSpotify,
    logout: logoutUser,
    getPlaylists,
    createPlaylist,
    getPlaylist,
  };
};

