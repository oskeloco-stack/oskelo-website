'use client';

import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

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

      setStatus({ state: 'success', message: "Thanks — we'll be in touch soon." });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  }

  return (
    <section className="section" id="contact">
      <div className="wrap contact-inner">
        <div>
          <div className="eyebrow">Contact</div>
          <h2>Let's build something worth watching.</h2>
          <p>Based in Pennsylvania, available for travel. Usually replies within one business day.</p>
          <div className="contact-email">
            <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>
            <span className="sub">Or use the form to send details about your project</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="message">Tell us about your project</label>
            <textarea
              id="message"
              name="message"
              required
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-solid" type="submit" disabled={status.state === 'loading'}>
            {status.state === 'loading' ? 'Sending…' : 'Send message'}
          </button>
          {status.state === 'success' && <p className="form-status success">{status.message}</p>}
          {status.state === 'error' && <p className="form-status error">{status.message}</p>}
        </form>
      </div>
    </section>
  );
}
