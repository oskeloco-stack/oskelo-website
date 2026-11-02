'use client';

import { useEffect, useState } from 'react';
import { INQUIRY_INTERESTS } from '../../lib/services';

const EMPTY = { name: '', business: '', email: '', interest: '', message: '', budget: '', timeline: '', website: '' };

const BUDGETS = ['Under $300', '$300–$600', '$600–$1,000', '$1,000+', 'Not sure yet'];

export default function Contact({
  heading = 'Ready to take content off your plate?',
  intro = 'Tell us about your business or project. We usually reply within one business day.',
}) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  // Plan buttons link here with ?interest=… so the right option is preselected.
  useEffect(() => {
    const interest = new URLSearchParams(window.location.search).get('interest');
    if (!interest) return;
    const match = INQUIRY_INTERESTS.find((opt) => opt === interest)
      || INQUIRY_INTERESTS.find((opt) => opt.toLowerCase().startsWith(interest.toLowerCase()));
    if (match) setForm((f) => ({ ...f, interest: match }));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus({ state: 'success', message: form.name.split(' ')[0] });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="wrap contact-inner">
        <div>
          <div className="eyebrow">Contact</div>
          <h2>{heading}</h2>
          <p>{intro}</p>
          <div className="contact-email">
            <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>
            <span className="sub">Based in Lancaster, PA. Available for travel.</span>
          </div>
        </div>

        {status.state === 'success' ? (
          <div className="form-done" role="status">
            <div className="form-done-mark" aria-hidden="true">✓</div>
            <h3>Thanks{status.message ? `, ${status.message}` : ''}. We’ve got your message.</h3>
            <p>
              We’ll read it and reply to the email you gave us, usually within one business day.
              If it’s urgent, email <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>.
            </p>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus({ state: 'idle', message: '' })}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="business">Business <span className="opt">(optional)</span></label>
                <input id="business" name="business" type="text" autoComplete="organization" value={form.business} onChange={handleChange} />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="interest">What are you interested in?</label>
              <select id="interest" name="interest" required value={form.interest} onChange={handleChange}>
                <option value="" disabled>Choose one</option>
                {INQUIRY_INTERESTS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="message">Tell us about your project</label>
              <textarea id="message" name="message" required value={form.message} onChange={handleChange}
                placeholder="What does your business do, and what kind of content do you need?" />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="budget">Budget <span className="opt">(optional)</span></label>
                <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">Prefer not to say</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="timeline">Timeline <span className="opt">(optional)</span></label>
                <input id="timeline" name="timeline" type="text" placeholder="e.g. next month" value={form.timeline} onChange={handleChange} />
              </div>
            </div>
            {/* Honeypot: hidden from people, bots fill it in. */}
            <div className="form-hp" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
            </div>
            <button className="btn btn-solid" type="submit" disabled={status.state === 'loading'}>
              {status.state === 'loading' ? 'Sending…' : 'Send inquiry'}
            </button>
            {status.state === 'error' && <p className="form-status error" role="alert">{status.message}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
