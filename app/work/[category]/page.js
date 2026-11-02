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
  // Items (videos and photo galleries alike) are grouped by their `group`, in
  // the category's preferred order; a group only appears once it has items,
  // and ungrouped items land in a final unnamed group.
  const items = category.items || [];
  const order = category.groups || [];
  const names = [...new Set([...order, ...items.map((i) => i.group).filter(Boolean)])];
  const groups = [
    ...names.map((name) => ({ name, items: items.filter((i) => i.group === name) })),
    { name: '', items: items.filter((i) => !i.group) },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <Header />

      <main id="main">
        <div className="wrap">
          <section className="section" id="work-detail">
            <div className="section-head">
              <div>
                <div className="eyebrow">Work</div>
                <h1>{category.title}</h1>
              </div>
              <p>{category.subtitle}</p>
            </div>
            {groups.map((group) => {
              const videos = group.items.filter((item) => item.video);
              const galleries = group.items.filter((item) => !item.video);
              return (
                <div className="work-group" key={group.name || 'all'}>
                  {group.name && groups.length > 1 && <h2 className="work-group-title">{group.name}</h2>}
                  {videos.length > 0 && (
                    <div className="reels-grid">
                      {videos.map((item) => (
                        <figure className="reel-item" key={item.name}>
                          <div className="reel-card has-video">
                            <ReelVideo src={item.video} poster={item.image} eyebrow={item.tag} title={item.name} />
                          </div>
                          {item.description && <figcaption>{item.description}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  )}
                  {galleries.length > 0 && (
                    <div className="work-grid">
                      {galleries.map((item) => {
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
                </div>
              );
            })}
            {category.note && <p className="work-note">{category.note}</p>}
            {items.length === 0 && (
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
