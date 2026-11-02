import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import WorkGroups from '../components/WorkGroups';
import { WORK_CATEGORIES } from '../../lib/work';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Portfolio: Video & Photography Work',
  description: 'Short-form video, event promos and photography produced by OSKELO in Lancaster, PA.',
  alternates: { canonical: '/work' },
};

export default async function WorkPage() {
  const categories = await getContent('work', WORK_CATEGORIES);
  // Video first: it's the core of what we sell.
  const ordered = [...categories].sort((a, b) => (a.slug === 'video-editing' ? -1 : b.slug === 'video-editing' ? 1 : 0));

  return (
    <>
      <Header />

      <main id="main">
        <div className="wrap">
          <section className="section page-intro" id="work-overview">
            <div className="section-head">
              <div>
                <div className="eyebrow">Work</div>
                <h1>See what we create</h1>
              </div>
              <p>Video and photography we&rsquo;ve produced ourselves. New projects are added as we finish them.</p>
            </div>
            <nav className="work-jump" aria-label="Portfolio sections">
              {ordered.map((category) => (
                <a href={`#${category.slug}`} key={category.slug}>{category.title}</a>
              ))}
            </nav>

            {ordered.map((category) => (
              <div className="work-block" id={category.slug} key={category.slug}>
                <div className="work-block-head">
                  <div>
                    <h2>{category.title}</h2>
                    <p>{category.subtitle}</p>
                  </div>
                  <a href={`/work/${category.slug}`}>View all {category.title.toLowerCase()} <span aria-hidden="true">→</span></a>
                </div>
                <WorkGroups category={category} headingLevel={3} />
              </div>
            ))}
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
