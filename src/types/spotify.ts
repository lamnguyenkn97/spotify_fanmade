/**
 * Shared TypeScript types for Spotify API entities
 * Consolidates duplicated types across the codebase
 */

// ============================================================================
// Common Structures
// ============================================================================

export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  followers?: {
    total: number;
  };
  external_urls?: {
    spotify?: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  artists: Array<{ name: string; id: string }>;
  artist_name?: string;
  release_date?: string;
  total_tracks?: number;
  album_type?: string;
  external_urls?: {
    spotify?: string;
  };
}

// ============================================================================
// Track Types
// ============================================================================

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: SpotifyImage[];
    id?: string;
    release_date?: string;
    total_tracks?: number;
  };
  duration_ms: number;
  preview_url?: string | null;
  explicit?: boolean;
  external_urls?: {
    spotify?: string;
  };
  uri?: string;
  popularity?: number; // 0-100 popularity score from Spotify
  track_number?: number;
}

export interface SpotifyTrackWithContext {
  track: SpotifyTrack;
  added_at?: string;
  played_at?: string;
}

// ============================================================================
// Playlist Types
// ============================================================================

export interface SpotifyPlaylistOwner {
  id: string;
  display_name: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  images: SpotifyImage[];
  owner: SpotifyPlaylistOwner;
  tracks: {
    total: number;
    href?: string;
    items?: SpotifyTrackWithContext[];
  };
  public?: boolean;
  collaborative?: boolean;
  external_urls?: {
    spotify?: string;
  };
}

// ============================================================================
// Show/Podcast Types
// ============================================================================

export interface SpotifyEpisode {
  id: string;
  name: string;
  description?: string;
  images: SpotifyImage[];
  release_date: string;
  duration_ms: number;
  external_urls?: {
    spotify?: string;
  };
  resume_point?: {
    fully_played: boolean;
    resume_position_ms: number;
  };
  show?: {
    id: string;
    name: string;
  };
}

export interface SpotifyShow {
  id: string;
  name: string;
  description?: string;
  images: SpotifyImage[];
  publisher?: string;
  total_episodes?: number;
  media_type?: string;
  episodes?: {
    total: number;
    items: SpotifyEpisode[];
  };
  external_urls?: {
    spotify?: string;
  };
}

// ============================================================================
// User Types
// ============================================================================

export interface SpotifyUser {
  id: string;
  displayName: string;
  email: string;
  images?: SpotifyImage[];
  product?: string;
}

// ============================================================================
// Artist Page Types
// ============================================================================

export interface SpotifyArtistData {
  id: string;
  name: string;
  images: SpotifyImage[];
  avatar?: string | null;
  cover?: string | null;
  biography?: {
    text?: string;
  };
  followers?: {
    total: number;
  };
  genres?: string[];
  topTracks?: SpotifyTrack[];
  albums?: SpotifyAlbum[];
  relatedArtists?: SpotifyArtist[];
  monthlyListeners?: number;
}

// ============================================================================
// Search Results Types
// ============================================================================

export interface SpotifySearchResults {
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
  albums: SpotifyAlbum[];
  playlists: SpotifyPlaylist[];
  shows: SpotifyShow[];
  episodes: SpotifyEpisode[];
  tracksTotal: number;
  artistsTotal: number;
  albumsTotal: number;
  playlistsTotal: number;
  showsTotal: number;
  episodesTotal: number;
}

