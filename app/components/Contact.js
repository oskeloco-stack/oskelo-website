'use client';

import { useEffect, useRef, useState } from 'react';
import { INQUIRY_INTERESTS, resolveInterest } from '../../lib/services';

const EMPTY = { name: '', business: '', email: '', interest: '', detail: '', message: '', budget: '', timeline: '', website: '' };

const BUDGETS = ['Under $300', '$300–$600', '$600–$1,000', '$1,000+', 'Not sure yet'];

export default function Contact({
  heading = 'Ready to take content off your plate?',
  intro = 'Tell us about your business or project. We usually reply within one business day.',
  isPage = false,
}) {
  const Heading = isPage ? 'h1' : 'h2';
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const startedAt = useRef(Date.now());

  // Buttons elsewhere link here with ?interest=… so the right option is preselected.
  useEffect(() => {
    const match = resolveInterest(new URLSearchParams(window.location.search).get('interest'));
    if (match) setForm((f) => ({ ...f, ...match }));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    // A different choice than the one a button preselected drops its detail line.
    setForm((f) => ({ ...f, [name]: value, ...(name === 'interest' ? { detail: '' } : {}) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, elapsed: Date.now() - startedAt.current }),
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
    <section className={`section contact${isPage ? ' page-intro' : ''}`} id="contact">
      <div className="wrap contact-inner">
        <div>
          <div className="eyebrow">Contact</div>
          <Heading>{heading}</Heading>
          <p>{intro}</p>
          <div className="contact-email">
            <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>
            <span className="sub">Based in Lancaster, PA. Available for travel.</span>
          </div>
        </div>

        {status.state === 'success' ? (
          <div className="form-done" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
            <div className="form-done-mark" aria-hidden="true">✓</div>
            <h3>Thanks{status.message ? `, ${status.message}` : ''}. Your message is in.</h3>
            <ol className="form-done-steps">
              <li><b>We read it</b> and look at what your business needs.</li>
              <li><b>We reply by email</b>, usually within one business day, with questions or next steps.</li>
              <li><b>If it’s a fit</b>, we set up a short call to plan your content.</li>
            </ol>
            <p>
              Nothing back in two business days? Check your spam folder, or email{' '}
              <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>.
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
                <input id="name" name="name" type="text" autoComplete="name" required maxLength={200} value={form.name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} value={form.email} onChange={handleChange} />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="message">Tell us about your project</label>
              <textarea id="message" name="message" required maxLength={5000} value={form.message} onChange={handleChange}
                placeholder="What does your business do, and what kind of content do you need?" />
            </div>

            <fieldset className="form-optional">
              <legend>Optional, but helpful</legend>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="interest">What can we help with?</label>
                  <select id="interest" name="interest" value={form.interest} onChange={handleChange}>
                    <option value="">Choose one</option>
                    {INQUIRY_INTERESTS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  {form.detail && <span className="form-hint">Selected: {form.detail}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="business">Business name</label>
                  <input id="business" name="business" type="text" autoComplete="organization" maxLength={200} value={form.business} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="budget">Budget</label>
                  <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">Prefer not to say</option>
                    {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="timeline">Timeline</label>
                  <input id="timeline" name="timeline" type="text" placeholder="e.g. next month" maxLength={200} value={form.timeline} onChange={handleChange} />
                </div>
              </div>
            </fieldset>

            {/* Honeypot: hidden from people, bots fill it in. */}
            <div className="form-hp" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
            </div>
            <button className="btn btn-solid" type="submit" disabled={status.state === 'loading'}>
              {status.state === 'loading' ? 'Sending…' : 'Send inquiry'}
            </button>
            <p className="form-fine">We only use your details to reply to you.</p>
            {status.state === 'error' && <p className="form-status error" role="alert">{status.message}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
