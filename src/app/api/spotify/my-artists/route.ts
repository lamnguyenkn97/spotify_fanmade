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

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    // Get user's followed artists with pagination
    let allArtists: any[] = [];
    let after: string | undefined = undefined;

    do {
      const response = await spotifyApi.getFollowedArtists({
        limit: 50,
        after,
      });

      if (response.body.artists?.items) {
        allArtists = allArtists.concat(response.body.artists.items);
        after = response.body.artists.cursors?.after;
      } else {
        break;
      }
    } while (after);

    return NextResponse.json({
      items: allArtists,
      total: allArtists.length,
    });
  } catch (error: any) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists', details: error.message },
      { status: 500 }
    );
  }
}

