/**
 * Shared TypeScript types for UI components
 * Consolidates component-specific types across the codebase
 */

import { SpotifyTrack, SpotifyShow, SpotifyPlaylist } from './spotify';

// ============================================================================
// Table Row Types
// ============================================================================

export interface TrackTableRow {
  id: string;
  index: number;
  trackNumber: number;
  title: string;
  artists: string;
  album: string;
  albumImage?: string;
  duration: string;
  explicit?: boolean;
  hasVideo?: boolean;
  isLiked?: boolean;
  dateAdded?: string;
  track: SpotifyTrack;
  addToQueue?: string; // Action column placeholder
}

export interface EpisodeTableRow {
  id: string;
  index: number;
  trackNumber: number;
  title: string;
  showName: string;
  description?: string;
  episodeImage?: string;
  showImage?: string;
  date: string;
  duration: string;
  isFinished: boolean;
  status: string;
}

// ============================================================================
// Library Types
// ============================================================================

export interface LibraryItem {
  id: string;
  title: string; // Primary display title
  subtitle: string;
  image?: string;
  type: 'playlist' | 'artist' | 'album' | 'show' | 'podcast';
  isPinned?: boolean;
  pinned?: boolean; // Alternative name used in AppLayout
  isPlaying?: boolean;
  trackCount?: number;
  dateAdded?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface PlaylistHeaderProps {
  playlist: {
    name: string;
    description?: string;
    images: Array<{ url: string }>;
    owner: {
      display_name: string;
    };
    tracks: {
      total: number;
    };
  };
  onPlay?: () => void;
  onShuffle?: () => void;
  gradientColors?: {
    color1: string;
    color2: string;
  };
}

export interface ShowTableProps {
  shows: Array<{
    id: string;
    name: string;
    images: Array<{ url: string; height?: number; width?: number }>;
    publisher?: string;
    index?: number;
  }>;
  onShowClick: (showId: string) => void;
}

export interface PlaylistTableProps {
  playlists: Array<{
    id: string;
    name: string;
    images: Array<{ url: string; height?: number; width?: number }>;
    tracks: {
      total: number;
    };
    owner: {
      display_name: string;
    };
    index?: number;
  }>;
  onPlaylistClick: (playlistId: string) => void;
}

export interface TrackTableProps {
  tracks: Array<{ track: SpotifyTrack; added_at?: string }>;
  onTrackClick?: (track: SpotifyTrack) => void;
}

// ============================================================================
// Content Section Types
// ============================================================================

export interface ContentSectionsProps {
  sections: any[];
  onCardClick: (title: string, imageUrl?: string) => void;
  getCardProps: (item: any) => any;
}

// ============================================================================
// Modal & Dialog Types
// ============================================================================

export interface SelectedCard {
  title: string;
  imageUrl?: string;
}

// ============================================================================
// Toast Types
// ============================================================================

export type ToastTypeValue = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastTypeValue;
  duration?: number;
  showCloseButton?: boolean;
}

