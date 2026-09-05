import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import FoundingOffer from '../../components/FoundingOffer';
import { SERVICES, getService } from '../../../lib/services';

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} — Oskelo`,
    description: service.subtitle,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section" id="service-detail">
            <div className="section-head">
              <div>
                <div className="eyebrow">Services</div>
                <h2>{service.title}</h2>
              </div>
              <p>{service.subtitle}</p>
            </div>

            {service.type === 'plans' ? (
              <div className="packages">
                {service.plans.map((pkg) => (
                  <div className={`package ${pkg.featured ? 'featured' : ''}`} key={pkg.name}>
                    <h3>{pkg.name}</h3>
                    <div className="price">{pkg.price}</div>
                    <ul>
                      {pkg.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="service-detail">
                <div className="price">{service.price}</div>
                <ul>
                  {service.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a className="btn btn-solid" href="#contact">
                  {service.cta ? 'Get a quote' : 'Get started'}
                </a>
              </div>
            )}
          </section>
        </div>

        {service.slug === 'monthly-plans' && <FoundingOffer ctaHref="#contact" />}

        <Contact />
      </main>

      <Footer />
    </>
  );
}
