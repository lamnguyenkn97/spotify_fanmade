import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from 'spotify-web-api-node';

// GET - Fetch user's saved tracks (liked songs)
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

    // Get query params for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get user's saved tracks with pagination
    let allTracks: any[] = [];
    let currentOffset = offset;
    const pageLimit = Math.min(limit, 50); // Spotify max is 50 per request

    // First request to get total count
    const firstResponse = await spotifyApi.getMySavedTracks({
      limit: pageLimit,
      offset: currentOffset,
    });

    const total = firstResponse.body.total || 0;
    
    if (firstResponse.body.items && firstResponse.body.items.length > 0) {
      allTracks = allTracks.concat(firstResponse.body.items);
      currentOffset += pageLimit;

      // Fetch remaining pages if needed
      while (allTracks.length < total && allTracks.length < limit && currentOffset < total) {
        const response = await spotifyApi.getMySavedTracks({
          limit: pageLimit,
          offset: currentOffset,
        });

        if (response.body.items && response.body.items.length > 0) {
          allTracks = allTracks.concat(response.body.items);
          currentOffset += pageLimit;
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      items: allTracks,
      total: total,
      limit: limit,
      offset: offset,
    });
  } catch (error: unknown) {
    console.error('Error fetching saved tracks:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch saved tracks', details: errorMessage },
      { status: 500 }
    );
  }
}

