import { NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/spotify';

export async function GET() {
  try {
    const authUrl = getAuthorizationUrl();
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}
