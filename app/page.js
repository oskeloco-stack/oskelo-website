import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Plans from './components/Plans';
import OneTimeGrid from './components/OneTimeGrid';
import ReelVideo from './components/ReelVideo';
import Values from './components/Values';
import FoundingOffer from './components/FoundingOffer';
import { SERVICES, getService } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';
import { HOME_DEFAULT } from '../lib/pageContent';
import { getContent } from '../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: { absolute: 'OSKELO | Video Production & Content Creation in Lancaster, PA' },
  description:
    'You run your business. We run your content. Monthly short-form video, social media videography, editing and business photography for small businesses in Lancaster, PA and surrounding Lancaster County.',
  alternates: { canonical: '/' },
};

// Homepage background loop. To swap in a new showreel: drop a 1280x720,
// silent, ~15s, <5 MB MP4 + a poster frame into /public/hero/ and point these at them.
// showreel-mobile.mp4 is the same cut at 854px wide for phones (about 1.2 MB vs 2.9 MB).
const HERO_VIDEO = { src: '/hero/showreel.mp4', mobile: '/hero/showreel-mobile.mp4', poster: '/hero/showreel.jpg' };


export default async function Home() {
  const services = await getContent('services', SERVICES);
  const categories = await getContent('work', WORK_CATEGORIES);
  // Merged so copy fields added after an admin save still fall back to their defaults.
  const c = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };

  const monthly = getService('monthly-plans', services);
  // Reels come from the Video & Editing portfolio, so adding one there shows it here too.
  const reels = (categories.find((cat) => cat.slug === 'video-editing')?.items || []).filter((item) => item.video);
  // Photography gallery covers for the one-time section, straight from the portfolio.
  const photoGalleries = (categories.find((cat) => cat.slug === 'photography')?.items || []).filter((item) => item.image && item.slug);

  return (
    <>
      <Header />

      <main id="main">
        <section className="hero">
          <div className="hero-bg">
            <video className="hero-video" poster={HERO_VIDEO.poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true">
              <source src={HERO_VIDEO.mobile} type="video/mp4" media="(max-width: 700px)" />
              <source src={HERO_VIDEO.src} type="video/mp4" />
            </video>
          </div>
          <div className="hero-scrim"></div>
          <div className="hero-content">
            <div className="eyebrow">{c.heroEyebrow}</div>
            <h1>{c.heroHeadingLine1}<br /><span className="hero-accent">{c.heroHeadingLine2}</span></h1>
            {c.heroSub && <p>{c.heroSub}</p>}
            <div className="hero-ctas">
              <a className="btn btn-solid" href="#plans">{c.heroCta1Label}</a>
              <a className="btn btn-outline" href="/work">{c.heroCta2Label}</a>
            </div>
            {monthly?.plans?.[0] && (
              <p className="hero-price">
                Monthly plans from <b>{monthly.plans[0].price.replace(/^Starting at /, '')}</b>
                <span className="hero-price-dot" aria-hidden="true">·</span>
                <span className="hero-price-alt">One-time projects available</span>
              </p>
            )}
          </div>
        </section>

        <div className="wrap">
          <section className="section why-section" id="what-we-do">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.whyEyebrow}</div>
                <h2>{c.whyHeading}</h2>
              </div>
              <p>{c.whyIntro}</p>
            </div>
            <div className="point-grid cols-4">
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

        {reels.length > 0 && (
          <div className="section-alt">
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
                  {reels.map((reel) => (
                    <figure className="reel-item" key={reel.name}>
                      <div className="reel-card has-video">
                        <ReelVideo src={reel.video} poster={reel.image} eyebrow={reel.tag} title={reel.name} />
                      </div>
                      {reel.description && <figcaption>{reel.description}</figcaption>}
                    </figure>
                  ))}
                </div>
                <p className="more-link"><a href="/work">See all our work <span aria-hidden="true">→</span></a></p>
              </section>
            </div>
          </div>
        )}

        <div className="wrap">
          <section className="section" id="plans">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.packagesEyebrow}</div>
                <h2>{c.packagesHeading}</h2>
              </div>
              <p>{c.packagesIntro}</p>
            </div>
            <Plans service={monthly} compare={false} />
            <p className="more-link">
              <a href="/services/monthly-plans">Compare plans in detail, plus how footage and delivery work <span aria-hidden="true">→</span></a>
            </p>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="how-it-works">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{c.stepsEyebrow}</div>
                  <h2>{c.stepsHeading}</h2>
                </div>
              </div>
              <ol className="process">
                {c.steps.map((step, i) => (
                  <li key={i}>
                    <span className="process-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section" id="one-time">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.packagesOneTimeLabel}</div>
                <h2>{c.oneTimeHeading}</h2>
              </div>
              <p>{c.packagesOneTimeIntro}</p>
            </div>
            <OneTimeGrid services={services} />

            {photoGalleries.length > 0 && (
              <div className="photo-strip">
                <div className="photo-strip-head">
                  <h3>{c.photoHeading}</h3>
                  <a href="/work/photography">View photography <span aria-hidden="true">→</span></a>
                </div>
                <div className="photo-strip-grid">
                  {photoGalleries.map((g) => (
                    <a className="photo-strip-item" href={`/work/photography/${g.slug}`} key={g.slug}>
                      <img src={g.image} alt={`${g.name}: ${g.tag}`} loading="lazy" />
                      <span>{g.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="values">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{c.valuesEyebrow}</div>
                  <h2>{c.valuesHeading}</h2>
                </div>
                {c.valuesIntro && <p>{c.valuesIntro}</p>}
              </div>
              <Values values={c.values} />
            </section>
          </div>
        </div>

        <div className="wrap founding-wrap">
          <FoundingOffer />
        </div>

        <Contact heading={c.closingHeading} intro={c.closingBody} />
      </main>

      <Footer />
    </>
  );
}
