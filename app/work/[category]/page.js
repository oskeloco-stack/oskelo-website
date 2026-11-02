import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import ReelVideo from '../../components/ReelVideo';
import { WORK_CATEGORIES, getWorkCategory } from '../../../lib/work';
import { getContent } from '../../../lib/siteContent';

// Re-read admin-edited content from Supabase at most once a minute.
export const revalidate = 60;

export function generateStaticParams() {
  return WORK_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const categories = await getContent('work', WORK_CATEGORIES);
  const category = getWorkCategory(slug, categories);
  if (!category) return {};
  return {
    title: `${category.title} Portfolio`,
    description: `${category.subtitle} OSKELO, Lancaster, PA.`,
    alternates: { canonical: `/work/${category.slug}` },
  };
}

export default async function WorkCategoryPage({ params }) {
  const { category: slug } = await params;
  const categories = await getContent('work', WORK_CATEGORIES);
  const category = getWorkCategory(slug, categories);
  if (!category) notFound();
  const videos = category.items.filter((item) => item.video);
  const others = category.items.filter((item) => !item.video);

  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section" id="work-detail">
            <div className="section-head">
              <div>
                <div className="eyebrow">Work</div>
                <h2>{category.title}</h2>
              </div>
              <p>{category.subtitle}</p>
            </div>
            {videos.length > 0 && (
              <div className="reels-grid">
                {videos.map((item) => (
                  <div className="reel-card has-video" key={item.name}>
                    <ReelVideo src={item.video} poster={item.image} eyebrow={item.tag} title={item.name} />
                  </div>
                ))}
              </div>
            )}
            {others.length > 0 && (
            <div className="work-grid">
              {others.map((item) => {
                const className = `work-card${item.image ? ' work-card--photo' : ''}`;
                const inner = (
                  <>
                    {item.image && (
                      <img src={item.image} alt={`${item.name} — ${item.tag}`} loading="lazy" />
                    )}
                    <div className="tag">
                      <b>{item.name}</b>
                      <span>{item.tag}</span>
                    </div>
                  </>
                );

                return item.slug ? (
                  <a className={className} href={`/work/${category.slug}/${item.slug}`} key={item.name}>
                    {inner}
                  </a>
                ) : (
                  <div className={className} key={item.name}>
                    {inner}
                  </div>
                );
              })}
            </div>
            )}
            {category.items.length === 0 && (
              <p className="photo-grid-empty">New projects are on the way. Check back soon.</p>
            )}
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
