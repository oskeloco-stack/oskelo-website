import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { Eyebrow } from '../components/ui';
import { getContent } from '../../lib/siteContent';
import { CONTACT_PAGE_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Contact: Start a Project',
  description: 'Start a project with OSKELO: video production, monthly short-form content and photography in Lancaster, PA. We usually reply within one business day.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const c = { ...CONTACT_PAGE_DEFAULT, ...(await getContent('contact', CONTACT_PAGE_DEFAULT)) };

  return (
    <>
      <Header />

      <main id="main" className="s-main">
        <section className="s-section" id="contact" style={{ paddingTop: 'clamp(56px, 7vw, 104px)', scrollMarginTop: 80 }}>
          <div className="s-wrap s-contact">
            <div className="s-contact-aside">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="s-h1">{c.heading}</h1>
              <p className="s-lead">{c.intro}</p>
              <a className="s-contact-mail" href="mailto:contact@oskelo.com">contact@oskelo.com</a>
              <p className="s-contact-place">Based in Lancaster, Pennsylvania. Happy to travel for shoots.</p>
              <ol className="s-next" aria-label="What happens next">
                <li><span className="s-num">01</span><span><b>We read your message</b> and look at what your business needs.</span></li>
                <li><span className="s-num">02</span><span><b>We reply by email</b>, usually within one business day.</span></li>
                <li><span className="s-num">03</span><span><b>If it’s a fit</b>, we plan your content together and confirm the price in writing.</span></li>
              </ol>
            </div>
            <Contact />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
