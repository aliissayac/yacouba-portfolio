import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.PORTFOLIO_CONTACT_EMAIL;

    // If Resend API is not configured, accept the message anyway (dev mode)
    if (!resendApiKey || !contactEmail) {
      console.log('[Contact Form] Message received (Resend not configured):', {
        name,
        email,
        subject,
        message,
      });
      return NextResponse.json({
        success: true,
        message: 'Message received (dev mode — configure Resend to send emails)',
        devMode: true,
      });
    }

    // Send email via Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [contactEmail],
        reply_to: email,
        subject: subject || `New message from ${name}`,
        html: `
          <h2>New Portfolio Contact</h2>
          <table style="border-collapse: collapse; font-family: system-ui;">
            <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Name:</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Subject:</td><td>${escapeHtml(subject || '—')}</td></tr>
          </table>
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; font-family: system-ui;">${escapeHtml(message)}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('[Resend] Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send email', details: errorData },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
