import { NextRequest, NextResponse } from 'next/server';
import { createSpotifyApi } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const spotifyApi = createSpotifyApi(accessToken);
    const userData = await spotifyApi.getMe();

    return NextResponse.json({
      id: userData.body.id,
      displayName: userData.body.display_name,
      email: userData.body.email,
      images: userData.body.images,
      product: userData.body.product,
    });
  } catch (error: any) {
    // Check if it's a Spotify API error (user not on allowlist)
    if (error?.statusCode === 403 || error?.body?.error?.status === 403) {
      return NextResponse.json({ 
        error: 'User not authorized',
        message: 'This app is in development mode. Please contact the app owner to be added to the allowlist.',
        code: 'NOT_ON_ALLOWLIST'
      }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

