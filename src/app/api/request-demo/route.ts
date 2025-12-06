import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, message } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // TODO: You can implement email sending here using:
    // - Resend (https://resend.com) - recommended, free tier
    // - SendGrid
    // - Nodemailer
    // - Or save to Google Sheets via API
    
    // For now, just log the request
    console.log('Demo Access Request:', {
      email,
      name: name || 'Not provided',
      message: message || 'No message',
      timestamp: new Date().toISOString(),
    });

    // Example with Resend (uncomment when you set it up):
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Demo Requests <noreply@yourdomain.com>',
    //   to: 'your-email@example.com',
    //   subject: 'New Spotify Demo Access Request',
    //   html: `
    //     <h2>New Demo Access Request</h2>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Name:</strong> ${name || 'Not provided'}</p>
    //     <p><strong>Message:</strong> ${message || 'No message'}</p>
    //     <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    //   `,
    // });

    return NextResponse.json({ 
      success: true,
      message: 'Request submitted successfully'
    });
  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

