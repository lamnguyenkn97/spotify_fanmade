'use client';

import React, { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  ButtonSize,
  ButtonVariant,
  Icon,
  Pill,
  Image,
  colors,
  Modal,
  ModalSize,
} from 'spotify-design-system';
import { faPlus, faSearch, faExpand, faBars, faHeart, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

enum LibraryFilter {
  PLAYLISTS = 'Playlists',
  ARTISTS = 'Artists',
  ALBUMS = 'Albums',
  PODCASTS_AND_SHOWS = 'Podcasts & Shows',
}

enum SortOption {
  RECENTS = 'Recents',
  RECENTLY_ADDED = 'Recently added',
  ALPHABETICAL = 'Alphabetical',
  CREATOR = 'Creator',
}

interface LibraryItem {
  id: string;
  name: string;
  type: 'playlist' | 'artist' | 'album' | 'podcast' | 'show';
  image?: string;
  subtitle: string;
  isPinned?: boolean;
  isPlaying?: boolean;
  owner?: string;
  trackCount?: number;
  dateAdded?: string;
}

export default function LibraryPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>(LibraryFilter.PLAYLISTS);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.RECENTS);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeatureNotImplemented, setShowFeatureNotImplemented] = useState(false);

  useEffect(() => {
    fetchLibraryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  const fetchLibraryItems = async () => {
    setLoading(true);
    try {
      let data: LibraryItem[] = [];

      switch (selectedFilter) {
        case LibraryFilter.PLAYLISTS:
          const playlistsRes = await fetch('/api/spotify/my-playlists');
          if (playlistsRes.ok) {
            const playlistsData = await playlistsRes.json();
            data = playlistsData.items?.map((playlist: any) => ({
              id: playlist.id,
              name: playlist.name,
              type: 'playlist' as const,
              image: playlist.images?.[0]?.url,
              subtitle: `Playlist • ${playlist.owner?.display_name || 'Spotify'}`,
              isPinned: Math.random() > 0.7, // Mock pinned status
              trackCount: playlist.tracks?.total || 0,
            })) || [];
          }
          break;

        case LibraryFilter.PODCASTS_AND_SHOWS:
          const showsRes = await fetch('/api/spotify/my-shows');
          if (showsRes.ok) {
            const showsData = await showsRes.json();
            data = showsData.items?.map((item: any) => ({
              id: item.show?.id || item.id,
              name: item.show?.name || item.name,
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
              name: artist.name,
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
              name: item.album?.name || item.name,
              type: 'album' as const,
              image: item.album?.images?.[0]?.url || item.images?.[0]?.url,
              subtitle: `Album • ${item.album?.artists?.map((a: any) => a.name).join(', ') || 'Unknown'}`,
              dateAdded: item.added_at,
            })) || [];
          }
          break;
      }

      setItems(data);
    } catch (error) {
      console.error('Error fetching library items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: LibraryItem) => {
    if (item.type === 'playlist' || item.type === 'album') {
      router.push(`/playlist/${item.id}`);
    } else if (item.type === 'show' || item.type === 'podcast') {
      router.push(`/show/${item.id}`);
    } else if (item.type === 'artist') {
      router.push(`/artist/${item.id}`);
    }
  };

  const handleCreate = () => {
    setShowFeatureNotImplemented(true);
  };

  const getBestImageUrl = (images: Array<{ url: string }> | undefined): string => {
    if (!images || images.length === 0) return '';
    return images[0]?.url || '';
  };

  return (
    <Stack direction="column" spacing="lg" className="pb-8">
      {/* Header */}
      <Stack direction="row" align="center" justify="space-between">
        <Typography variant="heading" size="2xl" weight="bold" color="primary">
          Your Library
        </Typography>
        <Stack direction="row" spacing="md" align="center">
          <Button
            text="Create"
            icon={<Icon icon={faPlus} size="sm" color="primary" />}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Medium}
            onClick={handleCreate}
          />
          <Icon
            icon={faExpand}
            size="md"
            color="primary"
            onClick={() => {}}
          />
        </Stack>
      </Stack>

      {/* Filter Tabs */}
      <Stack direction="row" spacing="sm" align="center">
        <Pill
          label={LibraryFilter.PLAYLISTS}
          size="md"
          selected={selectedFilter === LibraryFilter.PLAYLISTS}
          onClick={() => setSelectedFilter(LibraryFilter.PLAYLISTS)}
        />
        <Pill
          label={LibraryFilter.ARTISTS}
          size="md"
          selected={selectedFilter === LibraryFilter.ARTISTS}
          onClick={() => setSelectedFilter(LibraryFilter.ARTISTS)}
        />
        <Pill
          label={LibraryFilter.ALBUMS}
          size="md"
          selected={selectedFilter === LibraryFilter.ALBUMS}
          onClick={() => setSelectedFilter(LibraryFilter.ALBUMS)}
        />
        <Pill
          label={LibraryFilter.PODCASTS_AND_SHOWS}
          size="md"
          selected={selectedFilter === LibraryFilter.PODCASTS_AND_SHOWS}
          onClick={() => setSelectedFilter(LibraryFilter.PODCASTS_AND_SHOWS)}
        />
      </Stack>

      {/* Search and Sort Bar */}
      <Stack direction="row" align="center" justify="space-between">
        <Stack direction="row" spacing="sm" align="center">
          <Icon icon={faSearch} size="sm" color="muted" />
          <Typography variant="body" size="sm" color="muted">
            Find in Your Library
          </Typography>
        </Stack>
        <Stack direction="row" spacing="xs" align="center">
          <Typography variant="body" size="sm" color="primary">
            {sortOption}
          </Typography>
          <Icon icon={faBars} size="sm" color="muted" />
        </Stack>
      </Stack>

      {/* Library Items List */}
      {loading ? (
        <Stack direction="column" align="center" justify="center" className="py-12">
          <Button
            text="Loading"
            variant={ButtonVariant.Primary}
            size={ButtonSize.Large}
            loading={true}
            disabled={true}
          />
        </Stack>
      ) : items.length === 0 ? (
        <Stack direction="column" spacing="md">
          <Typography variant="body" color="muted">
            No items found
          </Typography>
        </Stack>
      ) : (
        <Stack direction="column" spacing="xs">
          {items.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              spacing="md"
              align="center"
              onClick={() => handleItemClick(item)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {/* Thumbnail */}
              <Stack style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                {item.image ? (
                  <Image src={item.image} alt={item.name} size="sm" />
                ) : (
                  <Stack
                    direction="row"
                    align="center"
                    justify="center"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: colors.grey.grey2,
                      borderRadius: '4px',
                    }}
                  >
                    {item.type === 'playlist' && (
                      <Icon icon={faHeart} size="sm" color="primary" />
                    )}
                  </Stack>
                )}
              </Stack>

              {/* Item Details */}
              <Stack direction="column" spacing="xs" style={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body" size="sm" weight="medium" color="primary">
                  {item.name}
                </Typography>
                <Stack direction="row" spacing="xs" align="center">
                  {item.isPinned && (
                    <Icon
                      icon={faHeart}
                      size="sm"
                      color={colors.primary.brand}
                      style={{ flexShrink: 0 }}
                    />
                  )}
                  <Typography variant="caption" size="sm" color="muted">
                    {item.subtitle}
                    {item.trackCount !== undefined && ` • ${item.trackCount} songs`}
                  </Typography>
                </Stack>
              </Stack>

              {/* Playing Indicator */}
              {item.isPlaying && (
                <Icon icon={faVolumeHigh} size="sm" color={colors.primary.brand} />
              )}
            </Stack>
          ))}
        </Stack>
      )}

      {/* Feature Not Implemented Modal */}
      <Modal
        open={showFeatureNotImplemented}
        onClose={() => setShowFeatureNotImplemented(false)}
        size={ModalSize.Small}
        title="Feature Not Implemented"
        description="This feature is not implemented in this portfolio demo. Please visit the official Spotify website to experience the full functionality."
        actions={[
          {
            label: 'Visit Spotify',
            onClick: () => {
              window.open('https://open.spotify.com', '_blank');
              setShowFeatureNotImplemented(false);
            },
            variant: 'primary',
          },
        ]}
        showCloseButton={true}
        closeOnBackdropClick={true}
        closeOnEscape={true}
      />
    </Stack>
  );
}

