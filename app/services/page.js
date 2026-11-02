import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import Plans from '../components/Plans';
import OneTimeGrid from '../components/OneTimeGrid';
import ServiceBlock from '../components/ServiceBlock';
import { SERVICES, getService } from '../../lib/services';
import { HOME_DEFAULT } from '../../lib/pageContent';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Services & Pricing: Monthly Video Plans, Editing & Photography',
  description:
    'Monthly short-form video plans from $299/mo, one-time video editing, promo videos, event videography and business photography in Lancaster, PA.',
  alternates: { canonical: '/services' },
};

export default async function ServicesPage() {
  const services = await getContent('services', SERVICES);
  const home = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };
  const monthly = getService('monthly-plans', services);
  const oneTime = services.filter((s) => s.slug !== 'monthly-plans');

  return (
    <>
      <Header />

      <main id="main">
        <div className="wrap">
          <section className="section page-intro" id="monthly-plans">
            <div className="section-head">
              <div>
                <div className="eyebrow">Services &amp; pricing</div>
                <h1>Monthly content, or one project at a time</h1>
              </div>
              <p>Monthly plans are the easiest way to stay consistent. Every service is also available on its own.</p>
            </div>

            <div className="subhead">
              <h3>{monthly?.title}</h3>
              <p>{home.packagesIntro}</p>
            </div>
            <Plans service={monthly} />
            <p className="more-link">
              <a href="/services/monthly-plans">How footage, revisions and delivery work <span aria-hidden="true">→</span></a>
            </p>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="process">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{home.stepsEyebrow}</div>
                  <h2>{home.stepsHeading}</h2>
                </div>
              </div>
              <ol className="process">
                {home.steps.map((step, i) => (
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
                <div className="eyebrow">One-time projects</div>
                <h2>{home.packagesOneTimeLabel}</h2>
              </div>
              <p>{home.packagesOneTimeIntro}</p>
            </div>
            <OneTimeGrid services={services} />
          </section>
        </div>

        {oneTime.map((service, i) => (
          <div className={i % 2 === 0 ? 'section-alt' : undefined} key={service.slug}>
            <div className="wrap">
              <section className="section" id={service.slug}>
                <ServiceBlock service={service} />
              </section>
            </div>
          </div>
        ))}

        <Contact />
      </main>

      <Footer />
    </>
  );
}
