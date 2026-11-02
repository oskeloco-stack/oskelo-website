import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import WorkGroups from '../components/WorkGroups';
import { WORK_CATEGORIES } from '../../lib/work';
import { getContent } from '../../lib/siteContent';

export const revalidate = 60;

export const metadata = {
  title: 'Portfolio: Video & Photography Work',
  description: 'Short-form video, event promos and photography produced by OSKELO in Lancaster, PA.',
  alternates: { canonical: '/work' },
};

function countLabel(category) {
  const items = category.items || [];
  const videos = items.filter((i) => i.video).length;
  const galleries = items.length - videos;
  return [videos && `${videos} video${videos > 1 ? 's' : ''}`, galleries && `${galleries} galler${galleries > 1 ? 'ies' : 'y'}`]
    .filter(Boolean).join(', ');
}

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
            <div className="work-hero">
              <video className="work-hero-video" poster="/hero/showreel.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
                <source src="/hero/showreel-mobile.mp4" type="video/mp4" media="(max-width: 700px)" />
                <source src="/hero/showreel.mp4" type="video/mp4" />
              </video>
              <div className="work-hero-text">
                <div className="eyebrow">Work</div>
                <h1>See what we create</h1>
                <p>Video and photography we&rsquo;ve produced ourselves. New projects are added as we finish them.</p>
              </div>
            </div>
            <nav className="work-jump" aria-label="Portfolio sections">
              {ordered.map((category) => (
                <a href={`#${category.slug}`} key={category.slug}>
                  {category.title}
                  <span className="work-jump-count"> · {countLabel(category)}</span>
                </a>
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

        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}
