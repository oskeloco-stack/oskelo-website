import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { OFFERS } from '../../lib/offers';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Limited Offers — Oskelo',
  description:
    'Current limited-time offers and promotions from Oskelo — including the Monthly Rate Lock.',
};

export default async function OffersPage() {
  const offers = await getContent('offers', OFFERS);

  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section" id="limited-offers">
            <div className="section-head">
              <div>
                <div className="eyebrow">Limited offers</div>
                <h2>Current offers</h2>
              </div>
              <p>Time-limited promotions. When the spots are gone, they’re gone.</p>
            </div>

            {offers.length > 0 ? (
              <div className="offer-card-list">
                {offers.map((offer) => (
                  <article className="offer-card" key={offer.slug}>
                    <div className="eyebrow">{offer.eyebrow}</div>
                    <h3>{offer.title}</h3>
                    <p>{offer.body}</p>
                    {offer.detail?.length > 0 && (
                      <ul>
                        {offer.detail.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {offer.cta && (
                      <a className="btn btn-solid" href={offer.cta.href}>
                        {offer.cta.label}
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="photo-grid-empty">No active offers right now — check back soon.</p>
            )}
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
