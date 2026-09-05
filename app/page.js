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
            <div className="eyebrow">Video creation for businesses</div>
            <h1>Content built<br />to stand out</h1>
            <p>
              Oskelo turns your raw footage into polished business videos — or
              comes on-site to film and create them for you. Three packages,
              one simple process.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-solid" href="/services">See the packages</a>
              <a className="btn btn-outline" href="/work">View our work</a>
            </div>
          </div>
        </section>

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
                  <div className="link-card-media"></div>
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

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="services">
              <div className="section-head">
                <div>
                  <div className="eyebrow">Services</div>
                  <h2>What we offer</h2>
                </div>
                <p>Monthly video plans, a one-time shoot, or a single edited video — pick an option for full details.</p>
              </div>
              <div className="link-cards">
                {SERVICES.map((service) => (
                  <a className="link-card" href={`/services/${service.slug}`} key={service.slug}>
                    <h3>{service.title}</h3>
                    <p>{service.subtitle}</p>
                    <span className="link-card-price">
                      {service.type === 'plans' ? `From ${service.plans[0].price}` : service.price}
                    </span>
                    <span className="link-card-cta">View details →</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
