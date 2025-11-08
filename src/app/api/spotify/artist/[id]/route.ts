import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from 'spotify-web-api-node';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    // Get artist details
    const artist = await spotifyApi.getArtist(params.id);

    // Get artist's top tracks
    const topTracks = await spotifyApi.getArtistTopTracks(params.id, 'US');

    // Get artist's albums (latest to oldest)
    const albums = await spotifyApi.getArtistAlbums(params.id, {
      limit: 50,
      include_groups: 'album,single,compilation',
      market: 'US',
    });

    // Sort albums by release date (latest to oldest)
    const sortedAlbums = albums.body.items.sort((a: any, b: any) => {
      const dateA = new Date(a.release_date || 0).getTime();
      const dateB = new Date(b.release_date || 0).getTime();
      return dateB - dateA; // Descending order (latest first)
    });

    // Separate avatar (smaller image) from cover (largest image)
    const images = artist.body.images || [];
    const sortedImages = [...images].sort((a, b) => (b.width || 0) - (a.width || 0));
    const coverImage = sortedImages[0]?.url || null; // Largest image as cover
    const avatarImage = sortedImages.find(img => img.width && img.width <= 640)?.url || sortedImages[sortedImages.length - 1]?.url || null; // Medium/small image as avatar

    return NextResponse.json({
      id: artist.body.id,
      name: artist.body.name,
      images: artist.body.images,
      avatar: avatarImage, // Avatar/profile picture
      cover: coverImage, // Cover/banner image (largest available)
      followers: artist.body.followers,
      genres: artist.body.genres,
      popularity: artist.body.popularity,
      // Note: Spotify API doesn't directly provide verified status in getArtist
      // This would typically come from a different endpoint or be determined by popularity/followers
      // For now, we'll mark artists with high popularity as verified (you can adjust this logic)
      verified: artist.body.popularity > 70 || artist.body.followers.total > 1000000,
      topTracks: topTracks.body.tracks.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        duration_ms: track.duration_ms,
        explicit: track.explicit,
        external_urls: track.external_urls,
        preview_url: track.preview_url,
        popularity: track.popularity,
      })),
      albums: sortedAlbums.map((album: any) => ({
        id: album.id,
        name: album.name,
        images: album.images,
        release_date: album.release_date,
        album_type: album.album_type,
        total_tracks: album.total_tracks,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching artist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist', details: error.message },
      { status: 500 }
    );
  }
}

