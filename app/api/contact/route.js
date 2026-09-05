import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabaseClient';

const NOTIFY_EMAIL = 'oskelo.co@gmail.com';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are all required.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ name, email, message }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Could not save your message. Please try again.' },
        { status: 500 }
      );
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: 'Oskelo Website <onboarding@resend.dev>',
          to: NOTIFY_EMAIL,
          replyTo: email,
          subject: `New inquiry from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
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
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
