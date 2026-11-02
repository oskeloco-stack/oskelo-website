import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactCTA from '../../components/ContactCTA';
import WorkGroups from '../../components/WorkGroups';
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
  const items = category.items || [];

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
            <WorkGroups category={category} />
            {category.note && <p className="work-note">{category.note}</p>}
            {items.length === 0 && (
              <p className="photo-grid-empty">New projects are on the way. Check back soon.</p>
            )}
          </section>
        </div>

        <ContactCTA interest={category.slug === 'photography' ? 'Photography' : undefined} />
      </main>

      <Footer />
    </>
  );
}
