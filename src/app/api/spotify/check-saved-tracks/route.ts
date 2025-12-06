import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from 'spotify-web-api-node';

// GET - Check if tracks are saved/liked
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

    const { searchParams } = new URL(request.url);
    const trackIds = searchParams.get('ids')?.split(',') || [];

    if (trackIds.length === 0) {
      return NextResponse.json(
        { error: 'trackIds are required as query parameter (ids=id1,id2,id3)' },
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
    const allResults: boolean[] = [];

    for (let i = 0; i < trackIds.length; i += maxPerRequest) {
      const batch = trackIds.slice(i, i + maxPerRequest);
      const response = await spotifyApi.containsMySavedTracks(batch);
      allResults.push(...response.body);
    }

    // Create a map of trackId -> isSaved
    const savedMap: Record<string, boolean> = {};
    trackIds.forEach((id, index) => {
      savedMap[id] = allResults[index] || false;
    });

    return NextResponse.json({
      saved: savedMap,
    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to check saved tracks', details: errorMessage },
      { status: 500 }
    );
  }
}

