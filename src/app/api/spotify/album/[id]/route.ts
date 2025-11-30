import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from 'spotify-web-api-node';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get album details including tracks
    const album = await spotifyApi.getAlbum(params.id, {
      market: 'US', // Required to get full track details including explicit
    });

    // Get full track details for each track (to get explicit and video info)
    const trackIds = album.body.tracks.items.map((track: any) => track.id).filter(Boolean);
    let fullTracks: any[] = [];
    
    if (trackIds.length > 0) {
      // Fetch tracks in batches of 50 (Spotify API limit)
      const batches = [];
      for (let i = 0; i < trackIds.length; i += 50) {
        batches.push(trackIds.slice(i, i + 50));
      }
      
      const trackPromises = batches.map((batch) => 
        spotifyApi.getTracks(batch)
      );
      const trackResponses = await Promise.all(trackPromises);
      fullTracks = trackResponses.flatMap((response) => response.body.tracks);
    }

    // Create a map of track ID to full track data
    const trackMap = new Map(fullTracks.map((track: any) => [track.id, track]));

    // Transform album data to match playlist format for compatibility
    const playlistFormat = {
      id: album.body.id,
      name: album.body.name,
      description: `Album by ${album.body.artists.map((a: any) => a.name).join(', ')}`,
      images: album.body.images,
      owner: {
        display_name: album.body.artists.map((a: any) => a.name).join(', '),
      },
      tracks: {
        total: album.body.tracks.total,
        items: album.body.tracks.items.map((track: any) => {
          const fullTrack = trackMap.get(track.id) || track;
          return {
            track: {
              id: fullTrack.id || track.id,
              name: fullTrack.name || track.name,
              artists: fullTrack.artists || track.artists,
              album: {
                name: album.body.name,
                images: album.body.images,
              },
              duration_ms: fullTrack.duration_ms || track.duration_ms,
              explicit: fullTrack.explicit !== undefined ? fullTrack.explicit : track.explicit,
              external_urls: fullTrack.external_urls || track.external_urls,
              preview_url: fullTrack.preview_url || track.preview_url,
            },
            added_at: album.body.release_date || new Date().toISOString(),
          };
        }),
      },
    };

    return NextResponse.json(playlistFormat);
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch album', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

