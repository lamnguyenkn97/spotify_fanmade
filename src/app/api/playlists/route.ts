import { NextRequest, NextResponse } from 'next/server';
import { createSpotifyApi } from '@/lib/spotify';

// GET /api/playlists - Get user's playlists
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const spotifyApi = createSpotifyApi(accessToken);
    const playlists = await spotifyApi.getUserPlaylists();

    return NextResponse.json({
      items: playlists.body.items.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        images: playlist.images,
        owner: playlist.owner,
        tracks: playlist.tracks,
        public: playlist.public,
      })),
      total: playlists.body.total,
    });
  } catch (error) {

    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
}

// POST /api/playlists - Create a new playlist
export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, isPublic } = body;

    if (!name) {
      return NextResponse.json({ error: 'Playlist name is required' }, { status: 400 });
    }

    const spotifyApi = createSpotifyApi(accessToken);

    // Get user ID first
    const userData = await spotifyApi.getMe();
    const userId = userData.body.id;

    // Create playlist
    const playlist = await spotifyApi.createPlaylist(userId, name, {
      public: isPublic !== false,
    } as any); // Type issue with spotify-web-api-node library

    return NextResponse.json({
      id: (playlist as any).body.id,
      name: (playlist as any).body.name,
      description: (playlist as any).body.description,
      images: (playlist as any).body.images,
      external_urls: (playlist as any).body.external_urls,
    });
  } catch (error) {

    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
}

