import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import FoundingOffer from '../components/FoundingOffer';
import { HOME_DEFAULT } from '../../lib/pageContent';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Offers for New Clients',
  description:
    'Ways to get started with OSKELO: a free first-video preview for businesses starting a monthly plan, and founding-client rate lock for our first five monthly clients.',
  alternates: { canonical: '/offers' },
};

export default async function OffersPage() {
  const c = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };

  return (
    <>
      <Header />

      <main id="main">
        <div className="wrap">
          <section className="section page-intro" id="offers">
            <div className="section-head">
              <div>
                <div className="eyebrow">Offers</div>
                <h2>Getting started with OSKELO</h2>
              </div>
              <p>Two simple ways to start working with us, both tied to our monthly plans.</p>
            </div>

            <div className="intro-offer" style={{ marginTop: 0 }}>
              <div className="intro-offer-main">
                <div className="eyebrow">{c.introEyebrow}</div>
                <h2>{c.introHeading}</h2>
                <p>{c.introBody}</p>
                <a className="btn btn-solid" href={`/contact?interest=${encodeURIComponent('Free first-video preview')}#contact`}>
                  {c.introCta}
                </a>
              </div>
              <div className="intro-offer-terms">
                <div className="intro-offer-terms-label">How it works</div>
                <ul>
                  {c.introConditions.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              </div>
            </div>

            <FoundingOffer />
            <p className="plan-note">
              See <a href="/services/monthly-plans">monthly plans</a> for what each plan includes, and our{' '}
              <a href="/terms">terms</a> for billing and cancellation details.
            </p>
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
