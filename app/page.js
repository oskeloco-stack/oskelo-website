import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import ReelVideo from './components/ReelVideo';
import { SERVICES, getService } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';
import { WEBSITE_TIERS } from '../lib/websites';
import { HOME_DEFAULT } from '../lib/pageContent';
import { getContent } from '../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: { absolute: 'OSKELO | Video & Website Design in Lancaster, PA' },
  description:
    'Friendly, local video and website design for small businesses in Lancaster, PA. We film and edit short-form and promo videos, and build simple, fixed-price websites.',
  alternates: { canonical: '/' },
};

// A website we built, shown in the hero and on the Websites card. Screenshots
// live in /public/websites/ (desktop 1440x900, phone ~375 wide). To feature a
// different build, add its screenshots there and change this.
const SHOWCASE_SITE = {
  name: 'Grace Church Lancaster',
  url: 'gracelanc.org',
  desktop: '/websites/gracelanc-desktop.webp',
  phone: '/websites/gracelanc-phone.webp',
};

function Check() {
  return (
    <svg className="home-check" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function Home() {
  const services = await getContent('services', SERVICES);
  const categories = await getContent('work', WORK_CATEGORIES);
  // Merged so copy fields added after an admin save still fall back to their defaults.
  const c = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };

  const monthly = getService('monthly-plans', services);
  const oneTime = getService('one-time-video', services);
  const monthlyFrom = monthly?.plans?.[0]?.price?.replace(/^Starting at /, '');
  const oneTimeFrom = oneTime?.plans?.[0]?.price?.replace(/^Starting at /, '');
  const webFrom = WEBSITE_TIERS[0]?.price;
  // Reels come from the Video & Editing portfolio, so adding one there shows it here too.
  const reels = (categories.find((cat) => cat.slug === 'video-editing')?.items || []).filter((item) => item.video);
  const heroReel = reels[0];

  return (
    <>
      <Header />

      <main id="main" className="home">
        {/* Hero */}
        <section className="home-hero">
          <div className="wrap home-hero-grid">
            <div className="home-hero-copy">
              <div className="home-pill">{c.welcomeEyebrow}</div>
              <h1>{c.welcomeHeading}</h1>
              <p className="home-lede">{c.welcomeSub}</p>
              <div className="home-ctas">
                <a className="btn btn-solid" href="/contact">{c.welcomeCta1}</a>
                <a className="btn btn-outline" href="/work">{c.welcomeCta2}</a>
              </div>
              {c.welcomeNote && <p className="home-note">{c.welcomeNote}</p>}
            </div>
            {/* Both things we do, side by side: a real website we built and a real reel we shot. */}
            <div className="home-showcase">
              <figure className="sc-browser">
                <div className="sc-bar" aria-hidden="true"><span /><span /><span /><i>gracelanc.org</i></div>
                <img src={SHOWCASE_SITE.desktop} alt={`${SHOWCASE_SITE.name} homepage, a website built by OSKELO`} width="1440" height="900" />
                <figcaption className="sc-tag">Website · {SHOWCASE_SITE.name}</figcaption>
              </figure>
              {heroReel && (
                <figure className="sc-phone">
                  <div className="sc-phone-screen">
                    <video poster={heroReel.image} autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
                      <source src={heroReel.video} type="video/mp4" />
                    </video>
                  </div>
                  <figcaption className="sc-tag">Video · {heroReel.name}</figcaption>
                </figure>
              )}
            </div>
          </div>
        </section>

        {/* The two services */}
        <section className="home-section" id="what-we-do">
          <div className="wrap">
            <div className="home-head">
              <div className="home-eyebrow">{c.offerEyebrow}</div>
              <h2>{c.offerHeading}</h2>
            </div>
            <div className="home-offers">
              <a className="home-offer" href="/video">
                <div className="home-offer-img">
                  <img src="/hero/showreel.jpg" alt="" loading="lazy" />
                </div>
                <div className="home-offer-body">
                  <h3>{c.videoTitle}</h3>
                  <p>{c.videoBody}</p>
                  <ul>
                    {c.videoPoints.map((p) => <li key={p}><Check />{p}</li>)}
                  </ul>
                  <div className="home-offer-foot">
                    {(oneTimeFrom || monthlyFrom) && (
                      <span className="home-price">
                        {oneTimeFrom ? <>Videos from <b>{oneTimeFrom}</b></> : <>Plans from <b>{monthlyFrom}</b></>}
                      </span>
                    )}
                    <span className="home-link">{c.videoCta} <span aria-hidden="true">→</span></span>
                  </div>
                </div>
              </a>
              <a className="home-offer" href="/websites">
                <div className="home-offer-img home-offer-img--web">
                  <div className="sc-mini-phone">
                    <img src={SHOWCASE_SITE.phone} alt={`${SHOWCASE_SITE.name} website on a phone, built by OSKELO`} loading="lazy" />
                  </div>
                  <span className="sc-tag sc-tag--card">Recent build · {SHOWCASE_SITE.url}</span>
                </div>
                <div className="home-offer-body">
                  <h3>{c.webTitle}</h3>
                  <p>{c.webBody}</p>
                  <ul>
                    {c.webPoints.map((p) => <li key={p}><Check />{p}</li>)}
                  </ul>
                  <div className="home-offer-foot">
                    {webFrom && <span className="home-price">Websites from <b>{webFrom}</b></span>}
                    <span className="home-link">{c.webCta} <span aria-hidden="true">→</span></span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Recent work */}
        {reels.length > 0 && (
          <section className="home-section home-section--tint" id="work">
            <div className="wrap">
              <div className="home-head home-head--row">
                <div>
                  <div className="home-eyebrow">{c.showEyebrow}</div>
                  <h2>{c.showHeading}</h2>
                </div>
                <a className="home-link" href="/work">{c.showCta} <span aria-hidden="true">→</span></a>
              </div>
              <div className="reels-row home-reels">
                {reels.slice(0, 4).map((reel) => (
                  <figure className="reel-item" key={reel.name}>
                    <div className="reel-card has-video">
                      <ReelVideo src={reel.video} poster={reel.image} eyebrow={reel.tag} title={reel.name} duration={reel.duration} description={reel.description} />
                    </div>
                    {reel.description && <figcaption>{reel.description}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="home-section" id="how-it-works">
          <div className="wrap">
            <div className="home-head">
              <div className="home-eyebrow">{c.easyEyebrow}</div>
              <h2>{c.easyHeading}</h2>
            </div>
            <ol className="home-steps">
              {c.easySteps.map((step, i) => (
                <li key={i}>
                  <span className="home-step-num" aria-hidden="true">{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="home-contact">
          <Contact heading={c.closingHeading} intro={c.closingBody} />
        </div>
      </main>

      <Footer />
    </>
  );
}
