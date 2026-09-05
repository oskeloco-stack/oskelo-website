import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import FoundingOffer from './components/FoundingOffer';
import { SERVICES } from '../lib/services';

const WORK_ITEMS = [
  { name: 'Foundry Coffee', tag: 'Brand film' },
  { name: 'Harlow & Co.', tag: 'Product launch' },
  { name: 'Northside Realty', tag: 'Listing series' },
  { name: 'Vantage Fitness', tag: 'Social campaign' },
  { name: 'Fielding Law', tag: 'Testimonial' },
  { name: 'Marrow Studio', tag: 'Event recap' },
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
              <a className="btn btn-solid" href="#services">See the packages</a>
              <a className="btn btn-outline" href="#work">View our work</a>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section" id="work">
            <div className="section-head">
              <div>
                <div className="eyebrow">Selected work</div>
                <h2>Recent projects</h2>
              </div>
              <p>A short survey of business and brand videos delivered in the last year.</p>
            </div>
            <div className="work-grid">
              {WORK_ITEMS.map((item) => (
                <div className="work-card" key={item.name}>
                  <div className="tag">
                    <b>{item.name}</b>
                    <span>{item.tag}</span>
                  </div>
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
              <div className="service-links">
                {SERVICES.map((service) => (
                  <a className="service-link-card" href={`/services/${service.slug}`} key={service.slug}>
                    <h3>{service.title}</h3>
                    <p>{service.subtitle}</p>
                    <span className="service-link-price">
                      {service.type === 'plans' ? `From ${service.plans[0].price}` : service.price}
                    </span>
                    <span className="service-link-cta">View details →</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        <FoundingOffer />

        <Contact />
      </main>

      <Footer />
    </>
  );
}
