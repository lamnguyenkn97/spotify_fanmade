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
  } catch (error: any) {
    console.error('Error fetching saved tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved tracks', details: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

// PUT - Save/like tracks
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { trackIds } = body;

    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json(
        { error: 'trackIds array is required' },
        { status: 400 }
      );
    }

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    // Spotify API allows max 50 tracks per request
    // The API expects an array of track IDs (not URIs)
    const maxPerRequest = 50;
    const results = [];

    for (let i = 0; i < trackIds.length; i += maxPerRequest) {
      const batch = trackIds.slice(i, i + maxPerRequest);
      try {
        console.log('Attempting to save tracks:', batch);
        const response = await spotifyApi.addToMySavedTracks(batch);
        console.log('Successfully saved tracks batch:', batch.length, 'Response status:', response.statusCode);
        results.push(response);
      } catch (batchError: any) {
        console.error('Error saving batch:', {
          error: batchError,
          statusCode: batchError.statusCode,
          message: batchError.message,
          body: batchError.body,
          trackIds: batch,
          stack: batchError.stack,
        });
        // If one batch fails, throw the error with more details
        const errorMessage = batchError.body?.error?.message || batchError.message || 'Unknown error';
        const errorStatus = batchError.statusCode || batchError.status || 500;
        throw {
          ...batchError,
          message: errorMessage,
          statusCode: errorStatus,
        };
      }
    }

    return NextResponse.json({
      success: true,
      saved: trackIds.length,
    });
  } catch (error: any) {
    console.error('Error saving tracks:', error);
    const errorMessage = error.body?.error?.message || error.message || 'Unknown error';
    const statusCode = error.statusCode || error.status || 500;
    
    return NextResponse.json(
      { 
        error: 'Failed to save tracks', 
        details: errorMessage,
        statusCode: statusCode,
      },
      { status: statusCode }
    );
  }
}

// DELETE - Unsave/unlike tracks
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { trackIds } = body;

    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json(
        { error: 'trackIds array is required' },
        { status: 400 }
      );
    }

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    // Spotify API allows max 50 tracks per request
    const maxPerRequest = 50;
    const results = [];

    for (let i = 0; i < trackIds.length; i += maxPerRequest) {
      const batch = trackIds.slice(i, i + maxPerRequest);
      const response = await spotifyApi.removeFromMySavedTracks(batch);
      results.push(response);
    }

    return NextResponse.json({
      success: true,
      removed: trackIds.length,
    });
  } catch (error: any) {
    console.error('Error removing saved tracks:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved tracks', details: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

