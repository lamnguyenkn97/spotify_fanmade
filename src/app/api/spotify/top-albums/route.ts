import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from 'spotify-web-api-node';
import { TimeRange } from '@/types';

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
    const timeRange = (searchParams.get('time_range') || TimeRange.SHORT_TERM) as
      | TimeRange.SHORT_TERM
      | TimeRange.MEDIUM_TERM
      | TimeRange.LONG_TERM;

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    spotifyApi.setAccessToken(accessToken);

    // Get user's top tracks
    // short_term = last 4 weeks
    // medium_term = last 6 months
    // long_term = several years
    const topTracks = await spotifyApi.getMyTopTracks({
      limit: 50,
      time_range: timeRange,
    });

    // Extract unique albums from top tracks
    const albumMap = new Map<string, any>();
    
    topTracks.body.items.forEach((track: any) => {
      if (track.album && track.album.id) {
        // Use album ID as key to avoid duplicates
        if (!albumMap.has(track.album.id)) {
          albumMap.set(track.album.id, {
            ...track.album,
            // Add artist name for display
            artist_name: track.artists[0]?.name || 'Unknown Artist',
          });
        }
      }
    });

    // Convert map to array and limit to top 20 albums
    const uniqueAlbums = Array.from(albumMap.values()).slice(0, 20);

    return NextResponse.json({
      items: uniqueAlbums,
      total: uniqueAlbums.length,
    });
  } catch (error: any) {
    console.error('Error fetching top albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top albums', details: error.message },
      { status: 500 }
    );
  }
}

