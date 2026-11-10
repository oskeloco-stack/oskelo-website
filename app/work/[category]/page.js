import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactCTA from '../../components/ContactCTA';
import WorkCard from '../../components/WorkCard';
import { Eyebrow } from '../../components/ui';
import { WORK_CATEGORIES, getWorkCategory } from '../../../lib/work';
import { getContent } from '../../../lib/siteContent';
import { flattenWork } from '../../../lib/portfolio';

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

  const projects = flattenWork([category]);
  const isPhoto = slug === 'photography';

  return (
    <>
      <Header />

      <main id="main" className="s-main">
        <section className="s-page-hero">
          <div className="s-wrap">
            <Eyebrow><a href="/work">Work</a></Eyebrow>
            <h1 className="s-h1">{category.title}</h1>
            <p className="s-lead">{category.subtitle}</p>
          </div>
        </section>

        <section className="s-section" style={{ paddingTop: 0 }}>
          <div className="s-wrap">
            {projects.length > 0 ? (
              <div className="s-work-grid">
                {projects.map((p) => <WorkCard key={p.id} project={p} aspect={p.kind === 'video' ? '9 / 14' : '4 / 5'} />)}
              </div>
            ) : (
              <p className="s-empty">New projects are on the way. Check back soon.</p>
            )}
            {category.note && <p className="s-fine" style={{ marginTop: 40 }}>{category.note}</p>}
          </div>
        </section>

        <ContactCTA interest={isPhoto ? 'Photography' : 'One-time video'} />
      </main>

      <Footer />
    </>
  );
}
