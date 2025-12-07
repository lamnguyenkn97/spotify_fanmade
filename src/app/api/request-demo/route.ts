import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email, name, message } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Log to console
    console.log('Demo Access Request:', {
      email,
      name: name || 'Not provided',
      message: message || 'No message',
      timestamp: new Date().toISOString(),
    });

    // Debug: Check if API key exists
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log('Attempting to send email to lamnguyen.hcmut@gmail.com...');
        
        const result = await resend.emails.send({
          from: 'Spotify Demo <onboarding@resend.dev>',
          to: 'lamnguyen.hcmut@gmail.com',
          subject: '🎵 New Spotify Demo Access Request',
          html: `
            <h2>New Demo Access Request</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message || 'No message'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <hr />
            <h3>Next Steps:</h3>
            <ol>
              <li>Add to Spotify Developer Dashboard → User Management</li>
              <li>Add "${email}" to src/config/approvedUsers.ts</li>
              <li>Deploy changes</li>
              <li>Reply to user</li>
            </ol>
          `,
        });
        
        console.log('Email sent successfully!', result);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Request submitted successfully'
    });
  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

