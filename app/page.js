import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import FoundingOffer from './components/FoundingOffer';
import Plans from './components/Plans';
import OneTimeGrid from './components/OneTimeGrid';
import ReelVideo from './components/ReelVideo';
import { SERVICES, getService } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';
import { HOME_DEFAULT } from '../lib/pageContent';
import { getContent } from '../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: { absolute: 'OSKELO | Video Production & Content Creation in Lancaster, PA' },
  description:
    'You run your business. We run your content. Monthly short-form video, social media videography, editing and business photography for small businesses in Lancaster, PA.',
  alternates: { canonical: '/' },
};

// Homepage background loop. To swap in a new showreel: drop a 1280x720,
// silent, ~15s, <5 MB MP4 + a poster frame into /public/hero/ and point these at them.
const HERO_VIDEO = { src: '/hero/showreel.mp4', poster: '/hero/showreel.jpg' };

// Cover media for work categories that have no photo collage of their own.
const CATEGORY_VIDEO = {
  'video-editing': HERO_VIDEO,
};

export default async function Home() {
  const services = await getContent('services', SERVICES);
  const categories = await getContent('work', WORK_CATEGORIES);
  // Merged so copy fields added after an admin save still fall back to their defaults.
  const c = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };

  const monthly = getService('monthly-plans', services);
  // Reels come from the Video & Editing portfolio, so adding one there shows it here too.
  const reels = (categories.find((cat) => cat.slug === 'video-editing')?.items || []).filter((item) => item.video);

  return (
    <>
      <Header />

      <main id="top">
        <section className="hero">
          <div className="hero-bg">
            <video className="hero-video" src={HERO_VIDEO.src} poster={HERO_VIDEO.poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
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
            <section className="section" id="plans">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{c.packagesEyebrow}</div>
                  <h2>{c.packagesHeading}</h2>
                </div>
                <p>{c.packagesIntro}</p>
              </div>

              <Plans service={monthly} />
              <FoundingOffer />

              <div className="subhead">
                <h3>{c.packagesOneTimeLabel}</h3>
                <p>{c.packagesOneTimeIntro}</p>
              </div>
              <OneTimeGrid services={services} />
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="intro-offer" id="preview">
            <div className="intro-offer-main">
              <div className="eyebrow">{c.introEyebrow}</div>
              <h2>{c.introHeading}</h2>
              <p>{c.introBody}</p>
              <a className="btn btn-solid" href={`/contact?interest=${encodeURIComponent('Free first-video preview')}#contact`}>
                {c.introCta}
              </a>
            </div>
            <div className="intro-offer-terms">
              <div className="intro-offer-terms-label">How it works</div>
              <ul>
                {c.introConditions.map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          </section>
        </div>

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
                    <div className="reel-card has-video" key={reel.name}>
                      <ReelVideo src={reel.video} poster={reel.image} eyebrow={reel.tag} title={reel.name} />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        <div className="wrap">
          <section className="section" id="values">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.valuesEyebrow}</div>
                <h2>{c.valuesHeading}</h2>
              </div>
            </div>
            <dl className="values">
              {c.values.map((v, i) => (
                <div className="value" key={i}>
                  <dt>
                    <span className="value-letter" aria-hidden="true">{v.letter}</span>
                    <span className="value-word">{v.word}</span>
                  </dt>
                  <dd>{v.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="section-alt">
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
        </div>

        <Contact heading={c.closingHeading} intro={c.closingBody} />
      </main>

      <Footer />
    </>
  );
}
