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

    // Get recently played tracks (last 50)
    const recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({
      limit: 50,
    });

    // The API returns tracks with full details, but we ensure all fields are present
    // Spotify's getMyRecentlyPlayedTracks already includes full track objects with
    // duration_ms, preview_url, etc., so we can return as-is
    return NextResponse.json(recentlyPlayed.body);
  } catch (error: unknown) {
    console.error('Error fetching recently played:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch recently played tracks', details: errorMessage },
      { status: 500 }
    );
  }
}

