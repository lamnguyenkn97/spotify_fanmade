import { NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/spotify';

export async function GET() {
  try {
    const authUrl = getAuthorizationUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    // Redirect to home with error parameter if auth URL generation fails
    return NextResponse.redirect(new URL('/?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
}

