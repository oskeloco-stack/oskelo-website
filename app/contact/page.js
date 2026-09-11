import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { getContent } from '../../lib/siteContent';
import { CONTACT_PAGE_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Contact — Oskelo',
  description: 'Get in touch with Oskelo — video and photo creation for businesses and individuals.',
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
