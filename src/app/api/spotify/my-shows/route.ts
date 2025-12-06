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

    // Get user's saved shows (podcasts) with pagination
    let allShows: any[] = [];
    let offset = 0;
    const limit = 50;

    // First request to get total count
    const firstResponse = await spotifyApi.getMySavedShows({
      limit,
      offset: 0,
    });

    const total = firstResponse.body.total || 0;
    
    if (firstResponse.body.items && firstResponse.body.items.length > 0) {
      allShows = allShows.concat(firstResponse.body.items);
      offset = limit;

      // Fetch remaining pages if needed
      while (allShows.length < total && offset < total) {
        const shows = await spotifyApi.getMySavedShows({
          limit,
          offset,
        });

        if (shows.body.items && shows.body.items.length > 0) {
          allShows = allShows.concat(shows.body.items);
          offset += limit;
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      items: allShows,
      total: allShows.length,
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch shows', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

