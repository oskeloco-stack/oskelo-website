import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { WORK_CATEGORIES } from '../../lib/work';

export const metadata = {
  title: 'Our Work — Oskelo',
  description: 'Browse Oskelo photography and video work for businesses.',
};

export default function WorkPage() {
  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section" id="work-overview">
            <div className="section-head">
              <div>
                <div className="eyebrow">Work</div>
                <h2>See what we create</h2>
              </div>
              <p>Choose photography or video &amp; editing to browse recent projects.</p>
            </div>
            <div className="link-cards cols-2">
              {WORK_CATEGORIES.map((category) => (
                <a className="link-card" href={`/work/${category.slug}`} key={category.slug}>
                  <div className="link-card-media">
                    {category.cover && (
                      <img src={category.cover} alt={`${category.title} work`} loading="lazy" />
                    )}
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                  <span className="link-card-cta">View work →</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
