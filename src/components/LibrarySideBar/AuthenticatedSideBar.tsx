'use client';

import React from 'react';
import { Sidebar } from 'spotify-design-system';
// Sidebar's LibraryItem type (from spotify-design-system)
type SidebarLibraryItem = {
  id?: string;
  image: string; // Required in Sidebar
  title: string;
  subtitle: string;
  type: 'playlist' | 'artist' | 'album' | 'podcast'; // Note: Sidebar doesn't have 'show', we'll map it to 'podcast'
  pinned?: boolean;
};

export enum LibraryFilter {
  PLAYLISTS = 'Playlists',
  ARTISTS = 'Artists',
  ALBUMS = 'Albums',
  PODCASTS_AND_SHOWS = 'Podcasts & Shows',
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

interface AuthenticatedSideBarProps {
  libraryItems: LibraryItem[];
  onAddClick?: () => void;
  onExpandClick?: () => void;
  onFilterClick?: (filter: LibraryFilter) => void;
  onLibraryItemClick?: (item: LibraryItem) => void;
  onSearch?: () => void;
  showLogo?: boolean;
}

export const AuthenticatedSideBar: React.FC<AuthenticatedSideBarProps> = ({
  libraryItems = [],
  onAddClick,
  onExpandClick,
  onFilterClick,
  onLibraryItemClick,
  onSearch,
  showLogo = false,
}) => {
  // Map our LibraryItem to Sidebar's LibraryItem type
  const mappedLibraryItems: SidebarLibraryItem[] = libraryItems.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type === 'show' ? 'podcast' : item.type, // Map 'show' to 'podcast' since Sidebar doesn't support 'show'
    image: item.image || '', // Sidebar requires image to be string, not optional
    subtitle: item.subtitle,
    pinned: item.pinned,
  }));

  // Wrap onFilterClick to convert string to LibraryFilter
  const handleFilterClick = (filter: string) => {
    if (onFilterClick) {
      // Convert string to LibraryFilter enum
      const filterEnum = Object.values(LibraryFilter).find((f) => f === filter);
      if (filterEnum) {
        onFilterClick(filterEnum);
      }
    }
  };

  // Wrap onLibraryItemClick to convert Sidebar's LibraryItem to our LibraryItem
  const handleLibraryItemClick = (item: SidebarLibraryItem) => {
    if (onLibraryItemClick) {
      // Find the original item to preserve all properties
      const originalItem = libraryItems.find((i) => i.id === item.id);
      if (originalItem) {
        onLibraryItemClick(originalItem);
      }
    }
  };

  // Wrap onSearch to match Sidebar's signature (query: string) => void
  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch();
    }
  };

  // Wrap onViewToggle to match Sidebar's signature (viewType: 'list' | 'grid') => void
  return (
    <Sidebar
      libraryItems={mappedLibraryItems as any}
      onAddClick={onAddClick}
      onExpandClick={onExpandClick}
      onFilterClick={handleFilterClick}
      onLibraryItemClick={handleLibraryItemClick}
      onSearch={handleSearch}
      showLogo={showLogo}
      style={{
        width: '450px',
        minWidth: '450px',
      }}
    />
  );
};
