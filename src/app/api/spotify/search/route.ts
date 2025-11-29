import { NextRequest, NextResponse } from 'next/server';
import { createSpotifyApi } from '@/lib/spotify';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'album,artist,playlist,track,show,episode';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const market = searchParams.get('market') || 'US';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const spotifyApi = createSpotifyApi(accessToken);

    // Search for all types
    const searchResponse = await spotifyApi.search(query, type.split(',') as any[], {
      limit,
      offset,
      market,
    });

    const results = {
      tracks: searchResponse.body.tracks?.items || [],
      artists: searchResponse.body.artists?.items || [],
      albums: searchResponse.body.albums?.items || [],
      playlists: searchResponse.body.playlists?.items || [],
      shows: searchResponse.body.shows?.items || [],
      episodes: searchResponse.body.episodes?.items || [],
      // Include total counts for pagination
      tracksTotal: searchResponse.body.tracks?.total || 0,
      artistsTotal: searchResponse.body.artists?.total || 0,
      albumsTotal: searchResponse.body.albums?.total || 0,
      playlistsTotal: searchResponse.body.playlists?.total || 0,
      showsTotal: searchResponse.body.shows?.total || 0,
      episodesTotal: searchResponse.body.episodes?.total || 0,
    };

    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error('Error searching Spotify:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


