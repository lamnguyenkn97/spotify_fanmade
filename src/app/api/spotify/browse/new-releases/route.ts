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

    // Fetch new releases
    const releasesResponse = await fetch(
      'https://api.spotify.com/v1/browse/new-releases?limit=12',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        cache: 'no-store',
      }
    );

    if (!releasesResponse.ok) {
      const errorData = await releasesResponse.text();
      console.error('Spotify API error:', releasesResponse.status, errorData);
      throw new Error(`Failed to fetch new releases: ${releasesResponse.status}`);
    }

    const data = await releasesResponse.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: any) {
    console.error('Error fetching new releases:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch new releases', details: error.message },
      { status: 500 }
    );
  }
}

