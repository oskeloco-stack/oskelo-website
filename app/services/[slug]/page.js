import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import FoundingOffer from '../../components/FoundingOffer';
import Plans from '../../components/Plans';
import ServiceBlock from '../../components/ServiceBlock';
import { SERVICES, getService } from '../../../lib/services';
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

      <main>
        <div className="wrap">
          <section className="section page-intro" id="service-detail">
            {isMonthly ? (
              <>
                <div className="section-head">
                  <div>
                    <div className="eyebrow">Monthly plans</div>
                    <h2>{service.title}</h2>
                  </div>
                  <p>{service.subtitle}</p>
                </div>
                <Plans service={service} />
                <FoundingOffer />
              </>
            ) : (
              <ServiceBlock service={service} />
            )}
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
