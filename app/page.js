'use client';

import { useState } from 'react';

const WORK_ITEMS = [
  { name: 'Foundry Coffee', tag: 'Brand film' },
  { name: 'Harlow & Co.', tag: 'Product launch' },
  { name: 'Northside Realty', tag: 'Listing series' },
  { name: 'Vantage Fitness', tag: 'Social campaign' },
  { name: 'Fielding Law', tag: 'Testimonial' },
  { name: 'Marrow Studio', tag: 'Event recap' },
];

const PACKAGES = [
  {
    name: 'Edit only',
    price: '$450',
    features: [
      'You send the raw footage',
      'Up to 3 minutes, final cut',
      'Color grade & sound mix',
      '2 rounds of revisions',
    ],
  },
  {
    name: 'Full production',
    price: '$1,800',
    featured: true,
    features: [
      'On-site filming, half day',
      'Full edit & color grade',
      'Social cutdowns included',
      '3 rounds of revisions',
    ],
  },
  {
    name: 'Ongoing content',
    price: 'Custom',
    features: [
      'Monthly filming day',
      'Batch-edited content library',
      'Dedicated editor',
      'Priority turnaround',
    ],
  },
];

export default function Home() {
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
    <>
      <header>
        <div className="nav">
          <a className="logo" href="#top">
            <span className="logo-mark"></span>
            <span className="logo-word">OSKELO</span>
          </a>
          <nav className="nav-links">
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="btn btn-solid btn-sm" href="#contact">Get a quote</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-bg">
            <span className="bokeh b1"></span>
            <span className="bokeh b2"></span>
            <span className="bokeh b3"></span>
            <span className="bokeh b4"></span>
          </div>
          <div className="lens"></div>
          <div className="hero-scrim"></div>
          <div className="hero-content">
            <div className="eyebrow">Video creation for businesses</div>
            <h1>Content built<br />to stand out</h1>
            <p>
              Oskelo turns your raw footage into polished business videos — or
              comes on-site to film and create them for you. Three packages,
              one simple process.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-solid" href="#services">See the packages</a>
              <a className="btn btn-outline" href="#work">View our work</a>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section" id="work">
            <div className="section-head">
              <div>
                <div className="eyebrow">Selected work</div>
                <h2>Recent projects</h2>
              </div>
              <p>A short survey of business and brand videos delivered in the last year.</p>
            </div>
            <div className="work-grid">
              {WORK_ITEMS.map((item) => (
                <div className="work-card" key={item.name}>
                  <div className="tag">
                    <b>{item.name}</b>
                    <span>{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="services">
              <div className="section-head">
                <div>
                  <div className="eyebrow">Services</div>
                  <h2>Three simple packages</h2>
                </div>
                <p>Pick a package or ask for something custom — either way, one point of contact from first call to final cut.</p>
              </div>
              <div className="packages">
                {PACKAGES.map((pkg) => (
                  <div className={`package ${pkg.featured ? 'featured' : ''}`} key={pkg.name}>
                    <h3>{pkg.name}</h3>
                    <div className="price">{pkg.price}</div>
                    <ul>
                      {pkg.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="section" id="contact">
          <div className="wrap contact-inner">
            <div>
              <div className="eyebrow">Contact</div>
              <h2>Let's build something worth watching.</h2>
              <p>Based in Pennsylvania, available for travel. Usually replies within one business day.</p>
              <div className="contact-email">
                <a href="mailto:hello@oskelo.com">hello@oskelo.com</a>
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
      </main>

      <footer>
        <div className="wrap footer-inner">
          <span>© 2026 Oskelo</span>
          <span>Pennsylvania</span>
        </div>
      </footer>
    </>
  );
}
