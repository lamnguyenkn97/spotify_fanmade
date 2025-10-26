import { NextRequest, NextResponse } from 'next/server';
import { createSpotifyApi } from '@/lib/spotify';

// GET /api/playlists/[id] - Get playlist details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const spotifyApi = createSpotifyApi(accessToken);
    const playlist = await spotifyApi.getPlaylist(params.id);

    return NextResponse.json({
      id: playlist.body.id,
      name: playlist.body.name,
      description: playlist.body.description,
      images: playlist.body.images,
      owner: playlist.body.owner,
      tracks: playlist.body.tracks.items.map((item) => ({
        id: item.track?.id,
        name: item.track?.name,
        artists: item.track?.artists,
        album: item.track?.album,
        duration_ms: item.track?.duration_ms,
        added_at: item.added_at,
      })),
      public: playlist.body.public,
      collaborative: playlist.body.collaborative,
      followers: playlist.body.followers,
    });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
  }
}

