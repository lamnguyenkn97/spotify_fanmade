import { CurrentTrack } from '@/hooks/useMusicPlayer';
import { SpotifyTrack } from '@/types';

/**
 * Convert a Spotify track object to CurrentTrack format for the music player
 */
export const convertTrackToCurrentTrack = (track: SpotifyTrack): CurrentTrack => {
  // Generate Spotify URI from track ID (format: spotify:track:TRACK_ID)
  const spotifyUri = track.id ? `spotify:track:${track.id}` : track.external_urls?.spotify || undefined;

  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
    coverUrl: track.album.images?.[0]?.url || track.album.images?.[2]?.url || '',
    previewUrl: track.preview_url || null,
    duration: track.duration_ms,
    spotifyUri: spotifyUri,
  };
};

/**
 * Convert an array of Spotify tracks to CurrentTrack array
 */
export const convertTracksToQueue = (tracks: SpotifyTrack[]): CurrentTrack[] => {
  return tracks.map(convertTrackToCurrentTrack);
};

