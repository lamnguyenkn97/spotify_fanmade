/**
 * Spotify API hooks using SWR
 * Centralized data fetching for all Spotify endpoints
 */

import useSWR, { SWRConfiguration } from 'swr';
import { apiClient, swrFetcher } from '@/lib/api-client';
import {
  SpotifyTrack,
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyPlaylist,
  SpotifyShow,
  SpotifyEpisode,
  SpotifySearchResults,
  SpotifyArtistData,
  SpotifyTrackWithContext,
} from '@/types';

// ============================================================================
// Types
// ============================================================================

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

interface SavedTracksResponse {
  items: Array<{ track: SpotifyTrack; added_at: string }>;
  total: number;
}

interface TopItemsParams {
  time_range?: 'short_term' | 'medium_term' | 'long_term';
  limit?: number;
  offset?: number;
}

interface SearchParams {
  q: string;
  type?: string;
  limit?: number;
  offset?: number;
  market?: string;
}

interface ShowData {
  show: SpotifyShow;
  episodes: SpotifyEpisode[];
}

interface PlaylistData {
  playlist: SpotifyPlaylist;
  tracks: Array<{ track: SpotifyTrack; added_at: string }>;
}

interface AlbumData {
  album: SpotifyAlbum;
  tracks: SpotifyTrack[];
}

// ============================================================================
// Default SWR Config
// ============================================================================

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 2,
};

// ============================================================================
// Library Hooks
// ============================================================================

/**
 * Get user's saved tracks (liked songs)
 */
export function useSavedTracks(limit: number = 50, enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<SavedTracksResponse>(
    enabled ? `/api/spotify/my-saved-tracks?limit=${limit}` : null,
    swrFetcher,
    defaultConfig
  );

  return {
    tracks: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Check if tracks are saved in user's library
 */
export function useCheckSavedTracks(trackIds: string[]) {
  const idsParam = trackIds.join(',');
  const { data, error, isLoading } = useSWR<boolean[]>(
    trackIds.length > 0 ? `/api/spotify/check-saved-tracks?ids=${idsParam}` : null,
    swrFetcher,
    { ...defaultConfig, revalidateOnMount: false }
  );

  return {
    savedStatus: data || [],
    isLoading,
    error,
  };
}

/**
 * Get user's playlists
 */
export function useMyPlaylists(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<SpotifyPlaylist>>(
    enabled ? '/api/spotify/my-playlists' : null,
    swrFetcher,
    defaultConfig
  );

  return {
    playlists: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Get user's saved albums
 */
export function useMyAlbums(enabled: boolean = true) {
  const { data, error, isLoading } = useSWR<PaginatedResponse<SpotifyAlbum>>(
    enabled ? '/api/spotify/my-albums' : null,
    swrFetcher,
    defaultConfig
  );

  return {
    albums: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
}

/**
 * Get user's saved shows (podcasts)
 */
export function useMyShows(enabled: boolean = true) {
  const { data, error, isLoading } = useSWR<PaginatedResponse<SpotifyShow>>(
    enabled ? '/api/spotify/my-shows' : null,
    swrFetcher,
    defaultConfig
  );

  return {
    shows: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
}

// ============================================================================
// Personalization Hooks
// ============================================================================

/**
 * Get recently played tracks
 */
export function useRecentlyPlayed(limit: number = 50, enabled: boolean = true) {
  const { data, error, isLoading } = useSWR<PaginatedResponse<SpotifyTrackWithContext>>(
    enabled ? `/api/spotify/recently-played?limit=${limit}` : null,
    swrFetcher,
    defaultConfig
  );

  return {
    tracks: data?.items || [],
    isLoading,
    error,
    hasPermissionError: error?.status === 401,
  };
}

/**
 * Get user's top artists
 */
export function useTopArtists(params: TopItemsParams = {}, enabled: boolean = true) {
  const queryParams = new URLSearchParams({
    time_range: params.time_range || 'short_term',
    limit: String(params.limit || 20),
    offset: String(params.offset || 0),
  }).toString();

  const { data, error, isLoading } = useSWR<PaginatedResponse<SpotifyArtist>>(
    enabled ? `/api/spotify/top-artists?${queryParams}` : null,
    swrFetcher,
    defaultConfig
  );

  return {
    artists: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
}

/**
 * Get user's top albums
 */
export function useTopAlbums(params: TopItemsParams = {}, enabled: boolean = true) {
  const queryParams = new URLSearchParams({
    time_range: params.time_range || 'short_term',
    limit: String(params.limit || 20),
    offset: String(params.offset || 0),
  }).toString();

  const { data, error, isLoading } = useSWR<PaginatedResponse<SpotifyAlbum>>(
    enabled ? `/api/spotify/top-albums?${queryParams}` : null,
    swrFetcher,
    defaultConfig
  );

  return {
    albums: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
}

// ============================================================================
// Search Hook
// ============================================================================

/**
 * Search Spotify catalog
 */
export function useSearch(params: SearchParams, enabled: boolean = true) {
  const queryParams = new URLSearchParams({
    q: params.q,
    type: params.type || 'album,artist,playlist,track,show,episode',
    limit: String(params.limit || 20),
    offset: String(params.offset || 0),
    market: params.market || 'US',
  }).toString();

  const { data, error, isLoading } = useSWR<SpotifySearchResults>(
    enabled && params.q ? `/api/spotify/search?${queryParams}` : null,
    swrFetcher,
    { ...defaultConfig, dedupingInterval: 2000 } // Shorter dedup for search
  );

  return {
    results: data || null,
    isLoading,
    error,
  };
}

// ============================================================================
// Detail Page Hooks
// ============================================================================

/**
 * Get playlist details
 */
export function usePlaylist(playlistId: string | null) {
  const { data, error, isLoading } = useSWR<PlaylistData>(
    playlistId ? `/api/spotify/playlist/${playlistId}` : null,
    swrFetcher,
    defaultConfig
  );

  return {
    playlist: data?.playlist || null,
    tracks: data?.tracks || [],
    isLoading,
    error,
  };
}

/**
 * Get album details (or try playlist if album fails)
 */
export function useAlbumOrPlaylist(id: string | null) {
  const { data, error, isLoading } = useSWR<AlbumData | PlaylistData>(
    id
      ? async () => {
          try {
            // Try as playlist first
            return await apiClient.get<PlaylistData>(`/api/spotify/playlist/${id}`);
          } catch (playlistError) {
            // Fallback to album
            return await apiClient.get<AlbumData>(`/api/spotify/album/${id}`);
          }
        }
      : null,
    defaultConfig
  );

  return {
    data: data || null,
    isLoading,
    error,
  };
}

/**
 * Get artist details
 */
export function useArtist(artistId: string | null) {
  const { data, error, isLoading } = useSWR<SpotifyArtistData>(
    artistId ? `/api/spotify/artist/${artistId}` : null,
    swrFetcher,
    defaultConfig
  );

  return {
    artist: data || null,
    isLoading,
    error,
  };
}

/**
 * Get show (podcast) details
 */
export function useShow(showId: string | null) {
  const { data, error, isLoading } = useSWR<ShowData>(
    showId ? `/api/spotify/show/${showId}` : null,
    swrFetcher,
    defaultConfig
  );

  return {
    show: data?.show || null,
    episodes: data?.episodes || [],
    isLoading,
    error,
  };
}

// ============================================================================
// Browse Hooks (Unauthenticated)
// ============================================================================

/**
 * Get homepage feed (for unauthenticated users)
 */
export function useHomepageFeed(enabled: boolean = true) {
  const { data, error, isLoading } = useSWR<{ data: any }>(
    enabled ? '/api/spotify/homepage-feed' : null,
    swrFetcher,
    { ...defaultConfig, revalidateOnMount: true }
  );

  return {
    feed: data?.data || null,
    isLoading,
    error,
  };
}

/**
 * Get featured playlists
 */
export function useFeaturedPlaylists(enabled: boolean = true) {
  const { data, error, isLoading } = useSWR<{ playlists: PaginatedResponse<SpotifyPlaylist> }>(
    enabled ? '/api/spotify/browse/featured-playlists' : null,
    swrFetcher,
    defaultConfig
  );

  return {
    playlists: data?.playlists?.items || [],
    isLoading,
    error,
  };
}

/**
 * Get new releases
 */
export function useNewReleases(enabled: boolean = true) {
  const { data, error, isLoading } = useSWR<{ albums: PaginatedResponse<SpotifyAlbum> }>(
    enabled ? '/api/spotify/browse/new-releases' : null,
    swrFetcher,
    defaultConfig
  );

  return {
    albums: data?.albums?.items || [],
    isLoading,
    error,
  };
}

