'use client';

import { useEffect, useRef, useState } from 'react';
import { INQUIRY_INTERESTS, resolveInterest } from '../../lib/services';
import { Arrow } from './ui';

// The inquiry form. Posts to /api/contact (stored in Supabase, emailed via
// Resend). The success panel only appears after the server confirms; errors
// from the server are shown as they come back. Spam protection: a hidden
// honeypot field plus the time the form was open (checked server-side).

const EMPTY = { name: '', business: '', email: '', interest: '', detail: '', message: '', budget: '', timeline: '', website: '' };
const BUDGETS = ['Under $300', '$300–$600', '$600–$1,000', '$1,000+', 'Not sure yet'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Please tell us your name.';
  if (!form.email.trim()) errors.email = 'We need an email to reply to.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'That email doesn’t look quite right.';
  if (form.message.trim().length < 10) errors.message = 'A sentence or two about the project helps us reply properly.';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const startedAt = useRef(Date.now());
  const formRef = useRef(null);

  // Buttons elsewhere link here with ?interest=… so the right option is preselected.
  useEffect(() => {
    const match = resolveInterest(new URLSearchParams(window.location.search).get('interest'));
    if (match) setForm((f) => ({ ...f, ...match }));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === 'interest' ? { detail: '' } : {}) }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      formRef.current?.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, elapsed: Date.now() - startedAt.current }),
      });
      let data = {};
      try { data = await res.json(); } catch { /* non-JSON error page */ }
      if (!res.ok || !data.success) throw new Error(data.error || 'Something went wrong sending your message.');
      setStatus({ state: 'success', message: form.name.trim().split(' ')[0] });
      setForm(EMPTY);
    } catch (err) {
      const msg = err.message.includes('contact@oskelo.com')
        ? err.message
        : `${err.message} Please try again, or email contact@oskelo.com.`;
      setStatus({ state: 'error', message: msg });
    }
  }

  if (status.state === 'success') {
    return (
      <div className="s-done" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className="s-eyebrow">Message received</p>
        <h2>Thanks{status.message ? `, ${status.message}` : ''}. Your message is in.</h2>
        <ol>
          <li>We read it and look at what your business needs.</li>
          <li>We reply by email, usually within one business day.</li>
          <li>If it’s a fit, we set up a short call to plan your content.</li>
        </ol>
        <p>Nothing back in two business days? Check your spam folder, or email <a href="mailto:contact@oskelo.com" style={{ borderBottom: '1px solid' }}>contact@oskelo.com</a>.</p>
        <button type="button" className="s-btn s-btn--outline s-btn--sm" onClick={() => { startedAt.current = Date.now(); setStatus({ state: 'idle', message: '' }); }}>
          Send another message
        </button>
      </div>
    );
  }

  const field = (name) => ({
    id: `f-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `f-${name}-err` : undefined,
  });
  const Err = ({ name }) => (errors[name] ? <span className="s-field-error" id={`f-${name}-err`}>{errors[name]}</span> : null);
  const loading = status.state === 'loading';

  return (
    <form className="s-form" ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={loading}>
      <div className="s-form-grid">
        <div className={`s-field${errors.name ? ' has-error' : ''}`}>
          <label htmlFor="f-name">Name</label>
          <input {...field('name')} type="text" autoComplete="name" maxLength={200} required />
          <Err name="name" />
        </div>
        <div className={`s-field${errors.email ? ' has-error' : ''}`}>
          <label htmlFor="f-email">Email</label>
          <input {...field('email')} type="email" autoComplete="email" maxLength={200} required />
          <Err name="email" />
        </div>
        <div className="s-field">
          <label htmlFor="f-business">Business or organization <span className="s-opt">Optional</span></label>
          <input {...field('business')} type="text" autoComplete="organization" maxLength={200} />
        </div>
        <div className="s-field">
          <label htmlFor="f-interest">Type of service <span className="s-opt">Optional</span></label>
          <select {...field('interest')}>
            <option value="">Choose one</option>
            {INQUIRY_INTERESTS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {form.detail && <span className="s-field-hint">Selected: {form.detail}</span>}
        </div>
        <div className={`s-field s-field--full${errors.message ? ' has-error' : ''}`}>
          <label htmlFor="f-message">Project details</label>
          <textarea {...field('message')} maxLength={5000} required
            placeholder="What does your business do, and what would you like made? Dates or deadlines help too." />
          <Err name="message" />
        </div>
        <div className="s-field">
          <label htmlFor="f-budget">Budget range <span className="s-opt">Optional</span></label>
          <select {...field('budget')}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="s-field">
          <label htmlFor="f-timeline">Timeline <span className="s-opt">Optional</span></label>
          <input {...field('timeline')} type="text" placeholder="e.g. next month" maxLength={200} />
        </div>
      </div>

      {/* Honeypot: hidden from people, bots fill it in. */}
      <div className="s-hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
      </div>

      {status.state === 'error' && <p className="s-form-alert" role="alert">{status.message}</p>}

      <div className="s-form-foot">
        <p>We only use your details to reply to you.</p>
        <button className="s-btn s-btn--dark" type="submit" disabled={loading}>
          {loading ? <><span className="s-spinner" aria-hidden="true" /> Sending…</> : <>Send inquiry <Arrow /></>}
        </button>
      </div>
    </form>
  );
}
