import Header from '../components/Header';
import Footer from '../components/Footer';
import { getContent } from '../../lib/siteContent';
import { TERMS_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Terms & Conditions — Oskelo',
  description: 'Terms and conditions for OSKELO video creation services.',
};

export default async function Terms() {
  const c = await getContent('terms', TERMS_DEFAULT);

  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section legal">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.eyebrow}</div>
                <h2>{c.heading}</h2>
                <div className="legal-updated">{c.lastUpdated}</div>
              </div>
              <p>{c.intro}</p>
            </div>

            {(c.sections || []).map((s) => (
              <div key={s.heading}>
                <h3>{s.heading}</h3>
                <p>{s.body}</p>
              </div>
            ))}

            {/* Kept fixed (not admin-editable) so the mailto: link can't be broken by a plain-text edit. */}
            <h3>Contact</h3>
            <p>
              Questions about these terms can be sent to{' '}
              <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
