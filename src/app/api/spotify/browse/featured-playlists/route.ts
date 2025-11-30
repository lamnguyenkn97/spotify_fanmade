import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Spotify credentials not configured' },
        { status: 500 }
      );
    }

    // Get client credentials token (no user auth required)
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const { access_token } = await tokenResponse.json();

    // Fetch featured playlists
    const playlistsResponse = await fetch(
      'https://api.spotify.com/v1/browse/featured-playlists?limit=12',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!playlistsResponse.ok) {
      throw new Error('Failed to fetch featured playlists');
    }

    const data = await playlistsResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching featured playlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured playlists' },
      { status: 500 }
    );
  }
}

