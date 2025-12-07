import { NextRequest, NextResponse } from 'next/server';
import { isUserApproved } from '@/config/approvedUsers';

/**
 * Check if a user email is approved for OAuth login
 * Used by the frontend to decide whether to show Request Demo modal or proceed with OAuth
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ approved: false, message: 'Invalid email' });
    }

    const approved = isUserApproved(email);

    return NextResponse.json({ 
      approved,
      message: approved 
        ? 'User is approved. Proceed with OAuth login.' 
        : 'User not approved. Show Request Demo modal.'
    });
  } catch (error) {
    return NextResponse.json({ approved: false }, { status: 500 });
  }
}

