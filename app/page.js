import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import FoundingOffer from './components/FoundingOffer';
import ReelVideo from './components/ReelVideo';
import { SERVICES, getService } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';
import { HOME_DEFAULT } from '../lib/pageContent';
import { getContent } from '../lib/siteContent';

export const revalidate = 60;

// Homepage background loop. To swap in a new showreel: drop a 1280x720,
// silent, ~15s, <5 MB MP4 + a poster frame into /public/hero/ and point these at them.
const HERO_VIDEO = { src: '/hero/showreel.mp4', poster: '/hero/showreel.jpg' };

const REELS = [
  { label: 'Event Promo', title: 'Car Show 2027', video: '/work/reels/car-show-2027.mp4', poster: '/work/reels/car-show-2027.jpg' },
  { label: 'Event Promo', title: 'Bring Your Ride', video: '/work/reels/car-show-2027-ride.mp4', poster: '/work/reels/car-show-2027-ride.jpg' },
  { label: 'Event Promo', title: 'Bring the Family', video: '/work/reels/car-show-2027-family.mp4', poster: '/work/reels/car-show-2027-family.jpg' },
];

// Cover media for work categories that have no photo collage of their own.
const CATEGORY_VIDEO = {
  'video-editing': HERO_VIDEO,
};

// The compact "just need one video?" row: every One-Time Video tier plus the
// quote-only One-Time Shoot, built from the admin-edited services list.
function oneTimeOptions(services) {
  const video = getService('one-time-video', services);
  const shoot = getService('one-time-shoot', services);
  return [
    ...(video?.plans || []).map((plan) => ({
      name: plan.name,
      price: plan.price,
      detail: plan.features[0],
      href: `/services/${video.slug}`,
    })),
    ...(shoot
      ? [{ name: 'Full Shoot', price: 'Custom quote', detail: shoot.features[0], href: `/services/${shoot.slug}` }]
      : []),
  ];
}

export default async function Home() {
  const services = await getContent('services', SERVICES);
  const categories = await getContent('work', WORK_CATEGORIES);
  // Merged so copy fields added after an admin save still fall back to their defaults.
  const c = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };

  const monthly = getService('monthly-plans', services);
  const oneTime = oneTimeOptions(services);

  return (
    <>
      <Header />

      <main id="top">
        <section className="hero">
          <div className="hero-bg">
            <video className="hero-video" src={HERO_VIDEO.src} poster={HERO_VIDEO.poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
            <span className="bokeh b1"></span>
            <span className="bokeh b2"></span>
            <span className="bokeh b3"></span>
            <span className="bokeh b4"></span>
          </div>
          <div className="hero-scrim"></div>
          <div className="hero-content">
            <div className="eyebrow">{c.heroEyebrow}</div>
            <h1>{c.heroHeadingLine1}<br />{c.heroHeadingLine2}</h1>
            {c.heroSub && <p>{c.heroSub}</p>}
            <div className="hero-ctas">
              <a className="btn btn-solid" href="#packages">{c.heroCta1Label}</a>
              <a className="btn btn-outline" href="#contact">{c.heroCta2Label}</a>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section why-section" id="why">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.whyEyebrow}</div>
                <h2>{c.whyHeading}</h2>
              </div>
              <p>{c.whyIntro}</p>
            </div>
            <div className="point-grid">
              {c.whyPoints.map((point, i) => (
                <div className="point" key={i}>
                  <span className="point-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="packages">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{c.packagesEyebrow}</div>
                  <h2>{c.packagesHeading}</h2>
                </div>
                <p>{c.packagesIntro}</p>
              </div>

              {monthly && (
                <>
                  <div className="packages-label">{monthly.title}</div>
                  <div className="packages home-packages">
                    {monthly.plans.map((pkg) => (
                      <div className={`package ${pkg.featured ? 'featured' : ''}`} key={pkg.name}>
                        {pkg.featured && <span className="package-badge">Most popular</span>}
                        <h3>{pkg.name}</h3>
                        <div className="price">{pkg.price}</div>
                        <ul>
                          {pkg.features.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                        <a className={`btn ${pkg.featured ? 'btn-solid' : 'btn-outline'}`} href={`/services/${monthly.slug}`}>
                          Get started
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {oneTime.length > 0 && (
                <>
                  <div className="packages-label">{c.packagesOneTimeLabel}</div>
                  <div className="onetime-row">
                    {oneTime.map((item) => (
                      <a className="onetime" href={item.href} key={item.name}>
                        <span className="onetime-name">{item.name}</span>
                        <span className="onetime-price">{item.price}</span>
                        <span className="onetime-detail">{item.detail}</span>
                        <span className="onetime-arrow" aria-hidden="true">→</span>
                      </a>
                    ))}
                  </div>
                </>
              )}

              {c.packagesNote && <p className="packages-note">{c.packagesNote}</p>}
            </section>
          </div>
        </div>

        <FoundingOffer image="/work/wedding-engagement/veil-barn.jpg" />

        <div className="wrap">
          <section className="section" id="reels">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.reelsEyebrow}</div>
                <h2>{c.reelsHeading}</h2>
              </div>
              <p>{c.reelsIntro}</p>
            </div>
            <div className="reels-row">
              {REELS.map((reel) => (
                <div className="reel-card has-video" key={reel.title}>
                  <ReelVideo src={reel.video} poster={reel.poster} eyebrow={reel.label} title={reel.title} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="why-oskelo">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{c.usEyebrow}</div>
                  <h2>{c.usHeading}</h2>
                </div>
              </div>
              <div className="point-grid cols-4">
                {c.usPoints.map((point, i) => (
                  <div className="point" key={i}>
                    <h3>{point.title}</h3>
                    <p>{point.body}</p>
                  </div>
                ))}
              </div>

              <div className="steps">
                <div className="steps-heading">{c.stepsHeading}</div>
                <ol className="steps-list">
                  {c.steps.map((step, i) => (
                    <li key={i}>
                      <span className="step-num" aria-hidden="true">{i + 1}</span>
                      <span className="step-text">
                        <b>{step.title}</b>
                        <span>{step.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <a className="btn btn-solid" href="#contact">{c.heroCta2Label}</a>
              </div>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section" id="work">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.workEyebrow}</div>
                <h2>{c.workHeading}</h2>
              </div>
              <p>{c.workIntro}</p>
            </div>
            <div className="link-cards cols-2">
              {categories.map((category) => (
                <a className="link-card" href={`/work/${category.slug}`} key={category.slug}>
                  <div className={`link-card-media${category.images ? ' is-collage' : ''}`}>
                    {category.images?.map((src) => (
                      <img src={src} alt="" key={src} loading="lazy" />
                    ))}
                    {!category.images && CATEGORY_VIDEO[category.slug] && (
                      <video
                        src={CATEGORY_VIDEO[category.slug].src}
                        poster={CATEGORY_VIDEO[category.slug].poster}
                        autoPlay muted loop playsInline preload="metadata" aria-hidden="true"
                      />
                    )}
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                  <span className="link-card-cta">View work →</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
