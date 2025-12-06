import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from 'spotify-web-api-node';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
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

    // Get user's playlists
    const playlists = await spotifyApi.getUserPlaylists({
      limit: 50,
    });

    return NextResponse.json(playlists.body);
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch playlists', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

