import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import FoundingOffer from '../../components/FoundingOffer';
import ServiceBlock from '../../components/ServiceBlock';
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
            <ServiceBlock service={service} contactHref="#contact" />
          </section>
        </div>

        {service.slug === 'monthly-plans' && <FoundingOffer ctaHref="#contact" />}

        <Contact />
      </main>

      <Footer />
    </>
  );
}
