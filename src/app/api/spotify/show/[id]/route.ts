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

    // Get show (podcast) details
    const show = await spotifyApi.getShow(params.id, {
      market: 'US',
    });

    // Get show episodes
    const episodes = await spotifyApi.getShowEpisodes(params.id, {
      limit: 50,
      market: 'US',
    });

    return NextResponse.json({
      id: show.body.id,
      name: show.body.name,
      description: show.body.description,
      images: show.body.images,
      publisher: show.body.publisher,
      total_episodes: show.body.total_episodes,
      media_type: show.body.media_type,
      episodes: {
        total: episodes.body.total,
        items: episodes.body.items.map((episode: any) => ({
          id: episode.id,
          name: episode.name,
          description: episode.description,
          images: episode.images,
          release_date: episode.release_date,
          duration_ms: episode.duration_ms,
          external_urls: episode.external_urls,
          resume_point: episode.resume_point,
        })),
      },
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch show', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

