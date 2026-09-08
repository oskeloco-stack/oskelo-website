import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import FoundingOffer from './components/FoundingOffer';
import { SERVICES } from '../lib/services';
import { WORK_CATEGORIES } from '../lib/work';

const REELS = [
  { label: 'Brand Story' },
  { label: 'Product Launch' },
  { label: 'Social Cutdown' },
  { label: 'Event Recap' },
  { label: 'Behind the Scenes' },
];

export default function Home() {
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
            <div className="eyebrow">Video &amp; photo for businesses, individuals &amp; events</div>
            <h1>Content built<br />to stand out</h1>
            <div className="hero-ctas">
              <a className="btn btn-solid" href="/services">See the packages</a>
              <a className="btn btn-outline" href="/work">View our work</a>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section offers" id="services">
            <div className="section-head">
              <div>
                <div className="eyebrow">Services</div>
                <h2>What we offer</h2>
              </div>
              <p>Three ways to work with us. Tap through for full details and pricing.</p>
            </div>
            <div className="offers-inner">
              <ul className="offer-list">
                {SERVICES.map((service, i) => (
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
                  <div className="eyebrow">What we do</div>
                  <h2>Our mission</h2>
                </div>
              </div>
              <div className="mission-body">
                <p>
                  Oskelo makes video and photography for businesses, individuals,
                  and events — brand films, portraits, product shoots, and event
                  coverage.
                </p>
                <p>
                  Hand us your footage to edit, or have us on-site to shoot and
                  produce the whole piece. Either way the goal is the same:
                  content built to stand out, made simple to get.
                </p>
              </div>
            </section>
          </div>
        </div>

        <FoundingOffer />

        <div className="wrap">
          <section className="section" id="work">
            <div className="section-head">
              <div>
                <div className="eyebrow">Selected work</div>
                <h2>Recent projects</h2>
              </div>
              <p>A short survey of business and brand work delivered in the last year.</p>
            </div>
            <div className="link-cards cols-2">
              {WORK_CATEGORIES.map((category) => (
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
                <div className="eyebrow">In motion</div>
                <h2>Short-form, built for scroll</h2>
              </div>
              <p>A preview of the vertical video content we create for social feeds.</p>
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
