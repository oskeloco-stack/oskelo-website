import Header from './components/Header';
import Footer from './components/Footer';
import ContactCTA from './components/ContactCTA';
import HeroVideo from './components/HeroVideo';
import FilmFrame from './components/FilmFrame';
import { Arrow, PinIcon, ServiceIcon, Eyebrow, PriceTag, contactHref } from './components/ui';
import { SERVICES, getService } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';
import { WEBSITE_TIERS } from '../lib/websites';
import { HOME_DEFAULT } from '../lib/pageContent';
import { getContent } from '../lib/siteContent';
import { flattenWork } from '../lib/portfolio';

export const revalidate = 60;

export const metadata = {
  title: { absolute: 'OSKELO | Cinematic Video, Photography & Content in Lancaster, PA' },
  description:
    'Your story. Worth watching. OSKELO is a Pennsylvania-based creative studio making cinematic video, short-form content and photography for local businesses. Monthly plans from $299.',
  alternates: { canonical: '/' },
};

// Which real projects lead the homepage film strip, by name, in order.
// Anything missing is skipped, and the strip fills from the rest of the work.
const FEATURED = ['Bring Your Ride', 'Wedding & Engagement', 'Concerts'];

export default async function Home() {
  const services = await getContent('services', SERVICES);
  const categories = await getContent('work', WORK_CATEGORIES);
  // Merged so copy fields added after an admin save still fall back to their defaults.
  const c = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };

  const projects = flattenWork(categories);
  const featured = [
    ...FEATURED.map((name) => projects.find((p) => p.name === name)).filter(Boolean),
    ...projects.filter((p) => !FEATURED.includes(p.name)),
  ].slice(0, 3);

  const monthly = getService('monthly-plans', services);
  const oneTime = getService('one-time-video', services);
  const photo = getService('photography', services);
  const from = (p) => (p || '').replace(/^Starting at /, '').replace('/mo', '/mo');

  const pillars = [
    { icon: 'monthly', title: 'Monthly Content', body: c.studioMonthlyBody, price: monthly?.plans?.[0] && `From ${from(monthly.plans[0].price)}`, href: '/services#monthly' },
    { icon: 'video', title: 'Video Production', body: c.studioVideoBody, price: oneTime?.plans?.[0] && `Edits from ${from(oneTime.plans[0].price)}`, href: '/services#video' },
    { icon: 'photo', title: 'Photography', body: c.studioPhotoBody, price: photo && 'Quoted per project', href: '/services#photography' },
  ];

  return (
    <>
      <Header />

      <main id="main" className="s-main">
        {/* Hero */}
        <section className="s-hero" aria-labelledby="hero-heading">
          <div className="s-hero-media">
            <HeroVideo poster="/hero/showreel.jpg" src="/hero/showreel.mp4" mobileSrc="/hero/showreel-mobile.mp4" />
          </div>
          <div className="s-wrap" style={{ width: '100%' }}>
            <div className="s-hero-copy">
              <h1 className="s-h1" id="hero-heading">
                {c.studioHeadline1}<br />
                <span className="s-accent">{c.studioHeadline2}</span>
              </h1>
              <p className="s-lead">{c.studioSub}</p>
              <div className="s-hero-actions">
                <a className="s-btn s-btn--dark" href="/work">Explore Our Work <Arrow /></a>
                <a className="s-link" href="/services">View Services</a>
              </div>
              <p className="s-hero-place"><PinIcon />{c.studioPlace}</p>
            </div>
          </div>
          <span className="s-hero-tag" aria-hidden="true">Filmed by OSKELO</span>
        </section>

        {/* Featured work */}
        {featured.length > 0 && (
          <section className="s-section--tight" aria-label="Featured work" style={{ paddingTop: 24 }}>
            <div className="s-wrap">
              <div className="s-strip">
                {featured.map((p, i) => <FilmFrame key={p.id} project={p} index={i} />)}
              </div>
              <div className="s-under">
                <span>{c.studioFeaturedEyebrow}: real OSKELO projects only.</span>
                <a className="s-link" href="/work">See all work <Arrow /></a>
              </div>
            </div>
          </section>
        )}

        {/* What we do */}
        <section className="s-section" id="what-we-do" aria-labelledby="what-heading" style={{ paddingTop: 72 }}>
          <div className="s-wrap">
            <div className="s-head">
              <div>
                <Eyebrow>{c.studioWhatEyebrow}</Eyebrow>
                <h2 className="s-h2" id="what-heading">{c.studioWhatHeading}</h2>
              </div>
              <p className="s-lead">{c.studioWhatIntro}</p>
            </div>
            <div className="s-pillars">
              {pillars.map((p) => (
                <a className="s-pillar" href={p.href} key={p.title}>
                  <ServiceIcon name={p.icon} className="s-pillar-icon" />
                  <h3 className="s-h3">{p.title}</h3>
                  <p>{p.body}</p>
                  {p.price && <span className="s-pillar-price">{p.price}</span>}
                  <Arrow className="s-arrow" />
                </a>
              ))}
            </div>
            {WEBSITE_TIERS[0] && (
              <p className="s-also">
                Need a place to put it all? We also build one-time websites for small businesses, from {WEBSITE_TIERS[0].price}.{' '}
                <a href="/websites">Website builds</a>
              </p>
            )}
          </div>
        </section>

        {/* Why OSKELO */}
        <section className="s-section s-section--alt" aria-labelledby="why-heading">
          <div className="s-wrap s-split">
            <div className="s-split-media">
              <img src="/work/wedding-engagement/field-bouquet.jpg" alt="Bride and groom in a sunlit field, photographed by OSKELO" loading="lazy" decoding="async" />
              <span className="s-split-caption">Wedding &amp; engagement photography by OSKELO</span>
            </div>
            <div>
              <Eyebrow>{c.studioWhyEyebrow}</Eyebrow>
              <h2 className="s-h2" id="why-heading">{c.studioWhyHeading}</h2>
              <p className="s-body" style={{ marginTop: 24, fontSize: 17 }}>{c.studioWhyBody}</p>
              <ul className="s-points">
                {(c.studioWhyPoints || []).map((pt, i) => (
                  <li key={pt.title}>
                    <span className="s-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{pt.title}</h3>
                      <p>{pt.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing preview */}
        {monthly?.plans?.length > 0 && (
          <section className="s-section" id="pricing" aria-labelledby="pricing-heading">
            <div className="s-wrap">
              <div className="s-head">
                <div>
                  <Eyebrow>{c.studioPricingEyebrow}</Eyebrow>
                  <h2 className="s-h2" id="pricing-heading">{c.studioPricingHeading}</h2>
                </div>
                <p className="s-lead">{c.studioPricingIntro}</p>
              </div>
              <div className="s-plans">
                {monthly.plans.map((plan) => (
                  <div className={`s-plan${plan.featured ? ' is-featured' : ''}`} key={plan.name}>
                    {plan.featured && <span className="s-plan-badge">Most popular</span>}
                    <p className="s-plan-name">{plan.name}</p>
                    <PriceTag price={plan.price} />
                    <p className="s-plan-for">{plan.bestFor}</p>
                    <ul>
                      {plan.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                    <a className={`s-btn ${plan.featured ? 's-btn--light' : 's-btn--outline'}`} href={contactHref(`Monthly plan: ${plan.name}`)}>
                      Choose {plan.name}
                    </a>
                    {plan.travel && <p className="s-plan-note">Includes travel within about 15 miles. Further locations quoted up front.</p>}
                  </div>
                ))}
              </div>
              <div className="s-under">
                <span>One-time videos from {from(oneTime?.plans?.[0]?.price) || '$99'}. Photography quoted per project.</span>
                <a className="s-link" href="/services">Full services &amp; pricing <Arrow /></a>
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="s-section s-section--tight" aria-labelledby="steps-heading" style={{ paddingBottom: 'clamp(80px, 9vw, 128px)' }}>
          <div className="s-wrap">
            <div className="s-head s-head--stack">
              <div>
                <Eyebrow>{c.studioStepsEyebrow}</Eyebrow>
                <h2 className="s-h2" id="steps-heading">{c.studioStepsHeading}</h2>
              </div>
            </div>
            <ol className="s-steps">
              {(c.studioSteps || []).map((step, i) => (
                <li key={step.title}>
                  <span className="s-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="s-h3">{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ContactCTA heading={c.studioCtaHeading} body={c.studioCtaBody} />
      </main>

      <Footer />
    </>
  );
}
