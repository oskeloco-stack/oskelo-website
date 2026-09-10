import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import FoundingOffer from '../components/FoundingOffer';
import ServiceBlock from '../components/ServiceBlock';
import { SERVICES } from '../../lib/services';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Services — Oskelo',
  description: 'Everything Oskelo offers: monthly video plans, one-time shoots, and one-time edited videos.',
};

export default async function ServicesPage() {
  const services = await getContent('services', SERVICES);

  return (
    <>
      <Header />

      <main>
        {services.map((service, i) => (
          <div className={i % 2 === 1 ? 'section-alt' : undefined} key={service.slug}>
            <div className="wrap">
              <section className="section" id={service.slug}>
                <ServiceBlock service={service} contactHref="#contact" />
              </section>
            </div>
          </div>
        ))}

        <FoundingOffer ctaHref="#contact" />

        <Contact />
      </main>

      <Footer />
    </>
  );
}
