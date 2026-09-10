import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { WORK_CATEGORIES } from '../../lib/work';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Our Work — Oskelo',
  description: 'Browse Oskelo photography and video work for businesses.',
};

export default async function WorkPage() {
  const categories = await getContent('work', WORK_CATEGORIES);

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
              {categories.map((category) => (
                <a className="link-card" href={`/work/${category.slug}`} key={category.slug}>
                  <div className={`link-card-media${category.images ? ' is-collage' : ''}`}>
                    {category.images
                      ? category.images.map((src) => (
                          <img src={src} alt="" key={src} loading="lazy" />
                        ))
                      : category.cover && (
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
