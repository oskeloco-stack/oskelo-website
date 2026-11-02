import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import FoundingOffer from '../../components/FoundingOffer';
import Plans from '../../components/Plans';
import ServiceBlock from '../../components/ServiceBlock';
import { SERVICES, MONTHLY_GUIDE, getService } from '../../../lib/services';
import { getContent } from '../../../lib/siteContent';

export const revalidate = 60;

const SEO = {
  'monthly-plans': {
    title: 'Monthly Social Media Video Plans for Small Businesses',
    description: 'Short-form video every month for Lancaster, PA small businesses. Starter $299/mo, Growth $499/mo, We Capture from $799/mo with a monthly on-site shoot.',
  },
  'one-time-video': {
    title: 'Short-Form Video Editing & Promo Videos',
    description: 'One-time short-form video editing from your footage ($99), filmed short-form videos (from $299) and promotional brand films (from $599) in Lancaster, PA.',
  },
  'one-time-shoot': {
    title: 'Event Videography & Custom Video Production',
    description: 'Event videography and custom video production in Lancaster, PA, scoped and quoted for your project.',
  },
  photography: {
    title: 'Business & Portrait Photography',
    description: 'Business, headshot, portrait and event photography in Lancaster, PA. Contact OSKELO for a quote.',
  },
};

function MonthlyGuide({ guide }) {
  return (
    <>
      <div className="section-alt">
        <div className="wrap">
          <section className="section" id="editing-vs-filming">
            <div className="section-head">
              <div>
                <div className="eyebrow">Which plan fits</div>
                <h2>You film, or we film</h2>
              </div>
              <p>The real difference between the plans is who captures the footage.</p>
            </div>
            <div className="modes">
              {guide.modes.map((m) => (
                <div className="mode" key={m.title}>
                  <div className="mode-plans">{m.plans}</div>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                  <ul>{m.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="wrap">
        <section className="section" id="sending-footage">
          <div className="section-head">
            <div>
              <div className="eyebrow">Starter &amp; Growth</div>
              <h2>Sending us your footage</h2>
            </div>
            <p>No editing skills needed. If you can film on your phone, you can use these plans.</p>
          </div>
          <div className="footage-guide">
            <ol className="footage-steps">
              {guide.footageSteps.map((step, i) => (
                <li key={i}>
                  <span className="process-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="footage-tips">
              <h3>Filming tips</h3>
              <ul>{guide.filmingTips.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
        </section>
      </div>

      <div className="section-alt">
        <div className="wrap">
          <section className="section" id="details">
            <div className="section-head">
              <div>
                <div className="eyebrow">Details</div>
                <h2>What to expect</h2>
              </div>
              <p>Anything specific to your business is agreed with you before your plan starts.</p>
            </div>
            <div className="faq">
              {guide.details.map((d) => (
                <details key={d.q}>
                  <summary>{d.q}</summary>
                  <p>{d.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const services = await getContent('services', SERVICES);
  const service = getService(slug, services);
  if (!service) return {};
  return {
    title: SEO[slug]?.title || service.title,
    description: SEO[slug]?.description || service.subtitle,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const services = await getContent('services', SERVICES);
  const service = getService(slug, services);
  if (!service) notFound();
  const isMonthly = service.slug === 'monthly-plans';

  return (
    <>
      <Header />

      <main id="main">
        <div className="wrap">
          <section className="section page-intro" id="service-detail">
            {isMonthly ? (
              <>
                <div className="section-head">
                  <div>
                    <div className="eyebrow">Monthly plans</div>
                    <h1>{service.title}</h1>
                  </div>
                  <p>{service.subtitle}</p>
                </div>
                <Plans service={service} />
                <FoundingOffer />
              </>
            ) : (
              <ServiceBlock service={service} headingLevel={1} />
            )}
          </section>
        </div>

        {isMonthly && <MonthlyGuide guide={MONTHLY_GUIDE} />}

        <Contact />
      </main>

      <Footer />
    </>
  );
}
