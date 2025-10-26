/**
 * Extract the best quality image URL from an array of image sources
 * Prioritizes larger images for better quality
 */
export const getBestImageUrl = (sources: any[] = []): string | undefined => {
  return (
    sources.find((source) => source.width >= 300)?.url ||
    sources.find((source) => source.width >= 64)?.url ||
    sources[0]?.url
  );
};

/**
 * Extract card props from different Spotify content types
 * Maps API response types to Card component props
 */
export const getCardProps = (item: any) => {
  const { __typename, data } = item.content;

  const cardPropsMap = {
    TrackResponseWrapper: {
      title: data.name || 'Unknown Track',
      subtitle: data.artists?.items?.[0]?.profile?.name || 'Unknown Artist',
      variant: 'default' as const,
      imageUrl: getBestImageUrl(data.albumOfTrack?.coverArt?.sources),
    },
    ArtistResponseWrapper: {
      title: data.profile?.name || 'Unknown Artist',
      subtitle: undefined,
      variant: 'artist' as const,
      imageUrl: getBestImageUrl(data.visuals?.avatarImage?.sources),
    },
    AlbumResponseWrapper: {
      title: data.name || 'Unknown Album',
      subtitle: data.artists?.items?.[0]?.profile?.name || 'Unknown Artist',
      variant: 'default' as const,
      imageUrl: getBestImageUrl(data.coverArt?.sources),
    },
    PlaylistResponseWrapper: {
      title: data.name || 'Unknown Playlist',
      subtitle: data.ownerV2?.data?.name || data.description || 'Playlist',
      variant: 'default' as const,
      imageUrl: getBestImageUrl(data.images?.items?.[0]?.sources),
    },
  };

  return cardPropsMap[__typename as keyof typeof cardPropsMap];
};

