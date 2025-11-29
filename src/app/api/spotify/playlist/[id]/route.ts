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

    // Get playlist details including tracks
    // Note: We need to get full track details to access explicit and video info
    const playlist = await spotifyApi.getPlaylist(params.id);

    // If tracks are simplified, fetch full track details
    if (playlist.body.tracks?.items?.length > 0) {
      const trackIds = playlist.body.tracks.items
        .map((item: any) => item.track?.id)
        .filter(Boolean);

      if (trackIds.length > 0) {
        // Fetch tracks in batches of 50 (Spotify API limit)
        const batches = [];
        for (let i = 0; i < trackIds.length; i += 50) {
          batches.push(trackIds.slice(i, i + 50));
        }

        const trackPromises = batches.map((batch) => spotifyApi.getTracks(batch));
        const trackResponses = await Promise.all(trackPromises);
        const fullTracks = trackResponses.flatMap((response) => response.body.tracks);

        // Create a map of track ID to full track data
        const trackMap = new Map(fullTracks.map((track: any) => [track.id, track]));

        // Merge full track data into playlist tracks
        playlist.body.tracks.items = playlist.body.tracks.items.map((item: any) => {
          if (item.track?.id) {
            const fullTrack = trackMap.get(item.track.id);
            if (fullTrack) {
              item.track = {
                ...item.track,
                explicit: fullTrack.explicit,
                external_urls: fullTrack.external_urls,
                preview_url: fullTrack.preview_url,
              };
            }
          }
          return item;
        });
      }
    }

    return NextResponse.json(playlist.body);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


