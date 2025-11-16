import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Endpoint to get the current access token
 * Used by Web Playback SDK to initialize the player
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
  }
}


