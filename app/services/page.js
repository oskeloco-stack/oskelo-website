import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { Arrow, Eyebrow, PriceTag, contactHref } from '../components/ui';
import { SERVICES, MONTHLY_GUIDE, TRAVEL_NOTE, getService } from '../../lib/services';
import { WEBSITE_TIERS } from '../../lib/websites';
import { FOUNDING_OFFER_DEFAULT } from '../../lib/pageContent';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Services & Pricing: Monthly Content, Video Production & Photography',
  description:
    'Clear pricing from OSKELO: monthly short-form plans from $299/mo, one-time edits from $99, on-site videos from $299, brand films from $599, event video and photography. Lancaster, PA.',
  alternates: { canonical: '/services' },
};

const COMPARE = [
  { key: 'videos', label: 'Short-form videos per month' },
  { key: 'footage', label: 'Footage' },
  { key: 'shoot', label: 'Monthly on-site shoot' },
  { key: 'captions', label: 'Editing, hooks & captions' },
  { key: 'direction', label: 'Content ideas & direction' },
  { key: 'photos', label: 'Photography from the shoot' },
];

function Cell({ v }) {
  if (v === true) return <td className="s-yes">Included</td>;
  if (v === false) return <td className="s-no">—</td>;
  return <td>{v}</td>;
}

function PlanCards({ plans, interestFor, cols }) {
  return (
    <div className={`s-plans${cols === 4 ? ' s-plans--4' : ''}`}>
      {plans.map((plan) => (
        <div className={`s-plan${plan.featured ? ' is-featured' : ''}`} key={plan.name}>
          {plan.featured && <span className="s-plan-badge">Most popular</span>}
          <p className="s-plan-name">{plan.name}</p>
          <PriceTag price={plan.price} />
          <p className="s-plan-for">{plan.bestFor}</p>
          <ul>{plan.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <a className={`s-btn ${plan.featured ? 's-btn--light' : 's-btn--outline'}`} href={contactHref(interestFor(plan))}>
            {plan.cta || `Choose ${plan.name}`}
          </a>
          {plan.travel && <p className="s-plan-note">On-location. Travel within about 15 miles included; further quoted up front.</p>}
          {plan.footage === 'client' && <p className="s-plan-note">Uses footage you send.</p>}
        </div>
      ))}
    </div>
  );
}

export default async function ServicesPage() {
  const services = await getContent('services', SERVICES);
  const offer = { ...FOUNDING_OFFER_DEFAULT, ...(await getContent('foundingOffer', FOUNDING_OFFER_DEFAULT)) };
  const monthly = getService('monthly-plans', services);
  const oneTime = getService('one-time-video', services);
  const events = getService('one-time-shoot', services);
  const photo = getService('photography', services);

  // Events & custom work joins the one-time video row as a fourth "quote" card.
  const videoCards = [
    ...(oneTime?.plans || []),
    ...(events ? [{
      name: 'Events & Custom', price: 'Custom quote', bestFor: events.subtitle, features: events.features.slice(0, 4),
      travel: events.travel, cta: 'Request a quote', quote: true,
    }] : []),
  ];
  const oneTimeInterest = (plan) => {
    if (plan.quote) return 'Event videography';
    if (plan.name === 'Edit') return 'Video editing (my footage)';
    if (plan.name === 'Signature Video') return 'Promotional video / brand film';
    return 'One short-form video';
  };

  return (
    <>
      <Header />

      <main id="main" className="s-main">
        <section className="s-page-hero" aria-labelledby="svc-heading">
          <div className="s-wrap">
            <Eyebrow>Services &amp; pricing</Eyebrow>
            <h1 className="s-h1" id="svc-heading">Clear services. <span className="s-accent">Straightforward pricing.</span></h1>
            <p className="s-lead">Ongoing monthly content, a single video, or a photo shoot. Pick what fits, and you’ll know exactly what you’re getting before anything starts.</p>
            <nav className="s-chips" aria-label="Jump to a service">
              <a className="s-chip" href="#monthly">Monthly content</a>
              <a className="s-chip" href="#video">Video production</a>
              <a className="s-chip" href="#photography">Photography</a>
              <a className="s-chip" href="#websites">Websites</a>
            </nav>
          </div>
        </section>

        {/* Monthly */}
        {monthly && (
          <section className="s-section" id="monthly" style={{ paddingTop: 24, scrollMarginTop: 80 }} aria-labelledby="monthly-heading">
            <div className="s-wrap">
              <div className="s-head">
                <div>
                  <Eyebrow>01 · Monthly content</Eyebrow>
                  <h2 className="s-h2" id="monthly-heading">{monthly.title}</h2>
                </div>
                <p className="s-lead">{monthly.subtitle} Starter and Growth use footage you send. We Capture means we come to you and film.</p>
              </div>

              <PlanCards plans={monthly.plans} interestFor={(p) => `Monthly plan: ${p.name}`} />

              {monthly.plans.some((p) => p.specs) && (
                <div style={{ marginTop: 56 }}>
                  <h3 className="s-h3" style={{ marginBottom: 20 }}>Compare plans</h3>
                  <div className="s-table-wrap">
                    <table className="s-table">
                      <thead>
                        <tr>
                          <th scope="col"><span className="s-sr">Feature</span></th>
                          {monthly.plans.map((p) => <th scope="col" key={p.name}>{p.name}<br /><span style={{ fontWeight: 500, fontSize: 13, color: 'var(--s-muted)' }}>{p.price}</span></th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {COMPARE.map((row) => (
                          <tr key={row.key}>
                            <th scope="row">{row.label}</th>
                            {monthly.plans.map((p) => <Cell key={p.name} v={p.specs?.[row.key]} />)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {offer.heading && (
                <div className="s-callout" style={{ marginTop: 40 }}>
                  <div>
                    <p className="s-eyebrow" style={{ marginBottom: 10 }}>{offer.eyebrow}</p>
                    <h3 className="s-h3">{offer.heading}</h3>
                    <p>{offer.body}</p>
                    {offer.conditions?.length > 0 && <ul>{offer.conditions.map((cnd) => <li key={cnd}>{cnd}</li>)}</ul>}
                  </div>
                  <a className="s-btn s-btn--dark" href={contactHref('Monthly content plan')}>{offer.ctaLabel || 'Ask about founding pricing'}</a>
                </div>
              )}

              <div className="s-split" style={{ marginTop: 72, alignItems: 'start' }}>
                <div>
                  <h3 className="s-h3" style={{ marginBottom: 18 }}>Common questions</h3>
                  <div className="s-faq">
                    {MONTHLY_GUIDE.details.map((d) => (
                      <details key={d.q}>
                        <summary>{d.q}</summary>
                        <p>{d.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="s-h3" style={{ marginBottom: 18 }}>Filming your own clips?</h3>
                  <ul className="s-list-plain" style={{ color: 'var(--s-muted)' }}>
                    {MONTHLY_GUIDE.filmingTips.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <a className="s-link" href="/services/monthly-plans" style={{ marginTop: 28 }}>How footage, revisions &amp; delivery work <Arrow /></a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Video production */}
        {videoCards.length > 0 && (
          <section className="s-section s-section--alt" id="video" style={{ scrollMarginTop: 80 }} aria-labelledby="video-heading">
            <div className="s-wrap">
              <div className="s-head">
                <div>
                  <Eyebrow>02 · Video production</Eyebrow>
                  <h2 className="s-h2" id="video-heading">One video, done properly.</h2>
                </div>
                <p className="s-lead">{oneTime?.subtitle} Event coverage and larger productions are scoped and quoted individually.</p>
              </div>
              <PlanCards plans={videoCards} interestFor={oneTimeInterest} cols={4} />
              <div className="s-under">
                <span>See the kind of video we make.</span>
                <a className="s-link" href="/work?type=video">Watch our work <Arrow /></a>
              </div>
            </div>
          </section>
        )}

        {/* Photography */}
        {photo && (
          <section className="s-section" id="photography" style={{ scrollMarginTop: 80 }} aria-labelledby="photo-heading">
            <div className="s-wrap">
              <div className="s-head">
                <div>
                  <Eyebrow>03 · Photography</Eyebrow>
                  <h2 className="s-h2" id="photo-heading">{photo.title}</h2>
                </div>
                <p className="s-lead">{photo.subtitle} Every shoot is quoted for you up front, based on what you need.</p>
              </div>
              <div className="s-quote-card">
                <div>
                  <p className="s-plan-name">Photography</p>
                  <p className="s-plan-price">Custom quote</p>
                  <ul className="s-list-plain" style={{ marginBottom: 28 }}>
                    {photo.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                    <a className="s-btn s-btn--dark" href={contactHref('Photography')}>Request a quote <Arrow /></a>
                    <a className="s-link" href="/work?type=photography">See photography</a>
                  </div>
                </div>
                <div className="s-quote-card-media">
                  <img src="/work/portraits/field-dress.jpg" alt="Portrait of a woman in a floral dress in a golden field, photographed by OSKELO" loading="lazy" decoding="async" style={{ objectPosition: '50% 30%' }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Websites (secondary) */}
        {WEBSITE_TIERS.length > 0 && (
          <section className="s-section s-section--tight s-section--alt" id="websites" style={{ scrollMarginTop: 80 }} aria-labelledby="web-heading">
            <div className="s-wrap s-web">
              <div>
                <Eyebrow>Also available · Websites</Eyebrow>
                <h2 className="s-h2" id="web-heading" style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}>A website to put it all on.</h2>
                <p className="s-body" style={{ marginTop: 18 }}>One-time website builds for small businesses, designed around your photos and video. Fixed price, paid once.</p>
                <div className="s-web-tiers">
                  {WEBSITE_TIERS.map((t) => (
                    <a href="/websites#website-pricing" key={t.name}><b>{t.price}</b><span>{t.name} · {t.tag}</span></a>
                  ))}
                </div>
                <a className="s-link" href="/websites">Website builds &amp; what’s included <Arrow /></a>
              </div>
              <a className="s-web-shot" href="/websites" aria-label="Website builds">
                <img src="/websites/gracelanc-desktop.webp" alt="Grace Church Lancaster website, built by OSKELO" loading="lazy" decoding="async" />
              </a>
            </div>
          </section>
        )}

        <section className="s-section s-section--tight">
          <div className="s-wrap">
            <p className="s-fine"><b>Travel:</b> {TRAVEL_NOTE}</p>
            <p className="s-fine" style={{ marginTop: 10 }}>Prices are starting prices for standard scopes; your final price is always confirmed in writing before work begins. See our <a href="/terms">terms</a> for billing, cancellation and revisions.</p>
          </div>
        </section>

        <ContactCTA heading="Not sure which fits?" body="Tell us about your business and what you’re hoping for. We’ll recommend the simplest option, even if it’s the smallest one." cta="Ask us" />
      </main>

      <Footer />
    </>
  );
}
