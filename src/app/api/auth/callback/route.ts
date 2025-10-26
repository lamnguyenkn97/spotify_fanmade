import { NextRequest, NextResponse } from 'next/server';
import { getTokens } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle user denial
  if (error) {
    return NextResponse.redirect(new URL('/?error=access_denied', request.url));
  }

  // Handle missing code
  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    // Exchange code for tokens
    const { accessToken, refreshToken, expiresIn } = await getTokens(code);

    // Create response and set cookies
    const response = NextResponse.redirect(new URL('/', request.url));

    // Set secure HTTP-only cookies
    response.cookies.set('spotify_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
    });

    response.cookies.set('spotify_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}

