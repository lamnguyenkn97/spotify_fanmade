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
  } catch (error: any) {
    console.error('Error fetching recently played:', error);
    
    // Handle specific Spotify API errors
    if (error.statusCode === 401 || error.body?.error?.status === 401) {
      return NextResponse.json(
        { 
          error: 'Permissions missing',
          message: 'The access token does not have the required scope (user-read-recently-played). Please log out and log back in to grant the necessary permissions.',
          status: 401
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch recently played tracks', 
        details: error.message || error.body?.error?.message,
        status: error.statusCode || 500
      },
      { status: error.statusCode || 500 }
    );
  }
}

