import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from 'spotify-web-api-node';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('time_range') || 'short_term') as 'short_term' | 'medium_term' | 'long_term';

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    // Get user's top artists
    // short_term = last 4 weeks
    // medium_term = last 6 months
    // long_term = several years
    const topArtists = await spotifyApi.getMyTopArtists({
      limit: 20,
      time_range: timeRange,
    });

    return NextResponse.json(topArtists.body);
  } catch (error: any) {
    console.error('Error fetching top artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top artists', details: error.message },
      { status: 500 }
    );
  }
}

