import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabaseClient';

// Where new contact-form submissions are emailed. Kept as the Gmail address
// because Resend's zero-setup sender (onboarding@resend.dev) only delivers to
// the Resend account's own email. Switch to contact@oskelo.com once the
// oskelo.com domain is verified in Resend.
const NOTIFY_EMAIL = 'oskelo.co@gmail.com';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const clean = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request) {
  try {
    const body = await request.json();

    // Honeypot filled in → pretend success, store nothing.
    if (clean(body.website)) return NextResponse.json({ success: true });

    const name = clean(body.name, 200);
    const email = clean(body.email, 200);
    const message = clean(body.message, 5000);
    const business = clean(body.business, 200);
    const interest = clean(body.interest, 200);
    const budget = clean(body.budget, 100);
    const timeline = clean(body.timeline, 200);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and a short project description are required.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // The messages table only has name/email/message columns, so the extra
    // inquiry details are stored as labeled lines above the message itself.
    const details = [
      business && `Business: ${business}`,
      interest && `Interested in: ${interest}`,
      budget && `Budget: ${budget}`,
      timeline && `Timeline: ${timeline}`,
    ].filter(Boolean);
    const fullMessage = details.length ? `${details.join('\n')}\n\n${message}` : message;

    const { error } = await supabase
      .from('messages')
      .insert([{ name, email, message: fullMessage }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Could not send your message. Please try again, or email contact@oskelo.com.' },
        { status: 500 }
      );
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: 'Oskelo Website <onboarding@resend.dev>',
          to: NOTIFY_EMAIL,
          replyTo: email,
          subject: `New inquiry from ${name}${interest ? ` — ${interest}` : ''}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${fullMessage}`,
        });
      } catch (emailErr) {
        console.error('Resend email error:', emailErr);
      }
    } else {
      console.warn('RESEND_API_KEY not set — skipping email notification.');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again, or email contact@oskelo.com.' },
      { status: 500 }
    );
  }
}
