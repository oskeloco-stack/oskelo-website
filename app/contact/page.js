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

      <main id="main">
        <Contact heading={c.heading} intro={c.intro} isPage />
      </main>

      <Footer />
    </>
  );
}
