import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import FoundingOffer from './components/FoundingOffer';
import { SERVICES } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';
import { HOME_DEFAULT } from '../lib/pageContent';
import { getContent } from '../lib/siteContent';

export const revalidate = 60;

const REELS = [
  { label: 'Brand Story' },
  { label: 'Product Launch' },
  { label: 'Social Cutdown' },
  { label: 'Event Recap' },
  { label: 'Behind the Scenes' },
];

export default async function Home() {
  const services = await getContent('services', SERVICES);
  const categories = await getContent('work', WORK_CATEGORIES);
  const c = await getContent('home', HOME_DEFAULT);

  return (
    <>
      <Header />

      <main id="top">
        <section className="hero">
          <div className="hero-bg">
            <span className="bokeh b1"></span>
            <span className="bokeh b2"></span>
            <span className="bokeh b3"></span>
            <span className="bokeh b4"></span>
          </div>
          <div className="hero-scrim"></div>
          <div className="hero-content">
            <div className="eyebrow">{c.heroEyebrow}</div>
            <h1>{c.heroHeadingLine1}<br />{c.heroHeadingLine2}</h1>
            <div className="hero-ctas">
              <a className="btn btn-solid" href="/services">{c.heroCta1Label}</a>
              <a className="btn btn-outline" href="/work">{c.heroCta2Label}</a>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section offers" id="services">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.offersEyebrow}</div>
                <h2>{c.offersHeading}</h2>
              </div>
              <p>{c.offersIntro}</p>
            </div>
            <div className="offers-inner">
              <ul className="offer-list">
                {services.map((service, i) => (
                  <li key={service.slug}>
                    <a href={`/services/${service.slug}`}>
                      <span className="offer-num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="offer-text">
                        <span className="offer-name">{service.title}</span>
                        <span className="offer-blurb">{service.subtitle}</span>
                      </span>
                      <span className="offer-arrow" aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="offers-collage" aria-hidden="true">
                <img src="/work/wedding-engagement/garden-path.jpg" alt="" loading="lazy" />
              </div>
            </div>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section mission" id="mission">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{c.missionEyebrow}</div>
                  <h2>{c.missionHeading}</h2>
                </div>
              </div>
              <div className="mission-body">
                <p>{c.missionBody1}</p>
                <p>{c.missionBody2}</p>
              </div>
            </section>
          </div>
        </div>

        <FoundingOffer image="/work/wedding-engagement/veil-barn.jpg" />

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
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                  <span className="link-card-cta">View work →</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="wrap">
          <section className="section reels-section" id="reels">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.reelsEyebrow}</div>
                <h2>{c.reelsHeading}</h2>
              </div>
              <p>{c.reelsIntro}</p>
            </div>
            <div className="reels-row">
              {REELS.map((reel) => (
                <div className="reel-card" key={reel.label}>
                  <span className="reel-play">▶</span>
                  <span className="reel-label">{reel.label}</span>
                </div>
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
