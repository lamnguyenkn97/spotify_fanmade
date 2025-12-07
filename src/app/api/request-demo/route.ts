import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email, name, message } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
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
            <h3>Grant Access Steps:</h3>
            <ol>
              <li><strong>Spotify Dashboard:</strong> <a href="https://developer.spotify.com/dashboard">developer.spotify.com/dashboard</a> → Settings → User Management → Add "${email}"</li>
              <li><strong>Vercel Environment Variables:</strong> <a href="https://vercel.com/dashboard">vercel.com/dashboard</a> → Your Project → Settings → Environment Variables → Edit <code>APPROVED_USERS</code> → Add "${email}" (comma-separated)</li>
              <li><strong>Redeploy:</strong> Vercel will auto-redeploy, or click "Redeploy" in Deployments tab</li>
              <li><strong>Notify User:</strong> Email ${email} that access is granted</li>
            </ol>
            <hr />
            <p><strong>Current APPROVED_USERS:</strong> <code>${process.env.APPROVED_USERS || '(none)'}</code></p>
          `,
        });
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

