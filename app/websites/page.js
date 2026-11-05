import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { WEBSITE_TIERS, WEBSITE_INCLUDED, WEBSITE_STEPS, WEBSITE_FAQ } from '../../lib/websites';

export const metadata = {
  title: 'Website Design & Builds for Small Businesses',
  description:
    'One-time website builds for Lancaster, PA small businesses. One-page sites from $299, 5-page business sites $699, fully custom 10-page sites $1,299. Fixed price, paid once.',
  alternates: { canonical: '/websites' },
};

function inquiryHref(tier) {
  return `/contact?interest=${encodeURIComponent(tier ? `Website: ${tier}` : 'Website build')}#contact`;
}

// A live, CSS-drawn browser + phone mock of our own homepage: proof that we
// build sites like this, without a screenshot that goes stale.
function SiteMock() {
  return (
    <div className="web-mock" aria-hidden="true">
      <div className="web-mock-browser">
        <div className="web-mock-bar">
          <span /><span /><span />
          <div className="web-mock-url">oskelo.com</div>
        </div>
        <div className="web-mock-screen">
          <img src="/hero/showreel.jpg" alt="" />
          <div className="web-mock-shade" />
          <div className="web-mock-nav">
            <img src="/4.webp" alt="" />
            <i /><i /><i /><b />
          </div>
          <div className="web-mock-copy">
            <em>Video &amp; content · Lancaster, PA</em>
            <strong>You run your business.</strong>
            <strong className="accent">We run your content.</strong>
            <div className="web-mock-btns"><b /><i /></div>
          </div>
        </div>
      </div>
      <div className="web-mock-phone">
        <div className="web-mock-notch" />
        <div className="web-mock-phone-screen">
          <img src="/hero/showreel.jpg" alt="" />
          <div className="web-mock-shade" />
          <div className="web-mock-copy is-phone">
            <strong>You run your business.</strong>
            <strong className="accent">We run your content.</strong>
            <div className="web-mock-btns"><b /></div>
          </div>
        </div>
      </div>
      <div className="web-mock-tag">Built in-house by OSKELO</div>
    </div>
  );
}

export default function WebsitesPage() {
  return (
    <>
      <Header />

      <main id="main">
        <section className="web-hero">
          <div className="wrap web-hero-inner">
            <div className="web-hero-copy">
              <div className="eyebrow">Website builds · One-time</div>
              <h1>
                A website that works<br />
                <span className="hero-accent">as hard as you do.</span>
              </h1>
              <p>
                Custom websites for small businesses, designed and built by the same team that shoots
                your video and photos. One fixed price, paid once.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-solid" href="#website-pricing">See website pricing</a>
                <a className="btn btn-outline" href={inquiryHref()}>Start your website</a>
              </div>
              <ul className="web-hero-points">
                <li><b>$299</b> one page</li>
                <li><b>$699</b> up to 5 pages</li>
                <li><b>$1,299</b> fully custom</li>
              </ul>
            </div>
            <SiteMock />
          </div>
        </section>

        <div className="wrap">
          <section className="section" id="website-pricing">
            <div className="section-head">
              <div>
                <div className="eyebrow">Pricing</div>
                <h2>Pick your build</h2>
              </div>
              <p>Fixed, one-time prices. The exact scope is agreed in writing before we start.</p>
            </div>

            <div className="plan-grid web-tiers">
              {WEBSITE_TIERS.map((tier) => (
                <article className={`plan${tier.featured ? ' is-featured' : ''}`} key={tier.name}>
                  {tier.featured && <span className="plan-badge">Most popular</span>}
                  <div className="plan-head">
                    <h3>{tier.name}</h3>
                    <span className={`plan-footage${tier.featured ? ' is-onsite' : ''}`}>{tier.tag}</span>
                  </div>
                  <div className="plan-price">
                    {tier.price}
                    <span className="web-once">one-time</span>
                  </div>
                  <p className="plan-bestfor">{tier.bestFor}</p>
                  <ul className="plan-features">
                    {tier.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <a className={`btn ${tier.featured ? 'btn-solid' : 'btn-outline'}`} href={inquiryHref(tier.name)}>
                    Start with {tier.name}
                  </a>
                </article>
              ))}
            </div>
            <p className="plan-note">
              Domain registration and hosting are billed by those providers, not by us; we confirm any of those costs with
              you before we start. Need an online store or more than 10 pages? <a href={inquiryHref()}>Ask for a custom quote</a>.
            </p>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="website-included">
              <div className="section-head">
                <div>
                  <div className="eyebrow">Every build</div>
                  <h2>What you get, at every price</h2>
                </div>
                <p>The basics a business site needs to earn its keep, included from $299.</p>
              </div>
              <div className="web-included">
                {WEBSITE_INCLUDED.map((item, i) => (
                  <div className="web-included-item" key={item.title}>
                    <span className="web-included-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section" id="website-process">
            <div className="section-head">
              <div>
                <div className="eyebrow">How it works</div>
                <h2>From first call to live site</h2>
              </div>
              <p>Four simple steps. You see everything before it goes live.</p>
            </div>
            <ol className="process web-process">
              {WEBSITE_STEPS.map((step, i) => (
                <li key={step.title}>
                  <span className="process-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="web-pair" aria-labelledby="web-pair-heading">
          <div className="wrap web-pair-inner">
            <div>
              <div className="eyebrow">The OSKELO difference</div>
              <h2 id="web-pair-heading">Most web designers hand you stock photos. We bring the camera.</h2>
              <p>
                Your website is only as good as what’s on it. Because we also film and photograph businesses, your site can
                launch with real video of your work and real photos of your team.
              </p>
            </div>
            <div className="web-pair-links">
              <a href="/services/photography"><b>Photography</b><span>Headshots, team and business photos</span><i aria-hidden="true">→</i></a>
              <a href="/services/one-time-video"><b>Promo video</b><span>A hero video or brand film for your homepage</span><i aria-hidden="true">→</i></a>
              <a href="/services/monthly-plans"><b>Monthly content</b><span>Fresh short-form video to keep it all active</span><i aria-hidden="true">→</i></a>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section" id="website-faq">
            <div className="section-head">
              <div>
                <div className="eyebrow">Questions</div>
                <h2>Website FAQ</h2>
              </div>
              <p>Anything specific to your project is agreed with you before we begin.</p>
            </div>
            <div className="faq">
              {WEBSITE_FAQ.map((d) => (
                <details key={d.q}>
                  <summary>{d.q}</summary>
                  <p>{d.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <Contact
          heading="Let’s build your website."
          intro="Tell us about your business and what you want your site to do. We usually reply within one business day."
        />
      </main>

      <Footer />
    </>
  );
}
