import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { getContent } from '../../lib/siteContent';
import { CONTACT_PAGE_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Contact & Project Inquiries',
  description: 'Tell OSKELO about your business or project. Video production, short-form content and photography in Lancaster, PA. We usually reply within one business day.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const c = await getContent('contact', CONTACT_PAGE_DEFAULT);

  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section legal" id="contact-intro">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.eyebrow}</div>
                <h2>{c.heading}</h2>
              </div>
              <p>{c.intro}</p>
            </div>
            <p>{c.body}</p>
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
