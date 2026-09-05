import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';

export const metadata = {
  title: 'Contact — Oskelo',
  description: 'Get in touch with Oskelo — video and photo creation for businesses and individuals.',
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section legal" id="contact-intro">
            <div className="section-head">
              <div>
                <div className="eyebrow">Contact</div>
                <h2>We want you to look as good as your work</h2>
              </div>
              <p>Have a project in mind? We'd love to hear about it.</p>
            </div>
            <p>
              At Oskelo, we believe every business — and every person behind
              it — deserves to look as good as the work they actually do.
              We started this studio because too many talented business
              owners were stuck with content that didn't reflect the
              quality of what they offer. Our mission is simple: help
              businesses and individuals put their best foot forward
              through video and photography that feels polished, personal,
              and true to who they are. Whether you're a growing brand, a
              small business owner, or someone who just wants their story
              told well, we'd love to help you look — and feel — like the
              best version of yourselves.
            </p>
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
