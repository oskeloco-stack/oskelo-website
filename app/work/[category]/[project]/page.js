import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ContactCTA from '../../../components/ContactCTA';
import PhotoGallery from '../../../components/PhotoGallery';
import { Arrow, Eyebrow } from '../../../components/ui';
import { WORK_CATEGORIES, getWorkProject } from '../../../../lib/work';
import { getContent } from '../../../../lib/siteContent';

// Re-read admin-edited content from Supabase at most once a minute.
export const revalidate = 60;

export function generateStaticParams() {
  return WORK_CATEGORIES.flatMap((category) =>
    category.items
      .filter((item) => item.slug)
      .map((item) => ({ category: category.slug, project: item.slug })),
  );
}

export async function generateMetadata({ params }) {
  const { category: categorySlug, project: projectSlug } = await params;
  const categories = await getContent('work', WORK_CATEGORIES);
  const result = getWorkProject(categorySlug, projectSlug, categories);
  if (!result) return {};
  return {
    title: `${result.project.name} | ${result.category.title}`,
    description: `${result.project.tag} by OSKELO, Lancaster, PA.`,
    alternates: { canonical: `/work/${categorySlug}/${projectSlug}` },
  };
}

export default async function WorkProjectPage({ params }) {
  const { category: categorySlug, project: projectSlug } = await params;
  const categories = await getContent('work', WORK_CATEGORIES);
  const result = getWorkProject(categorySlug, projectSlug, categories);
  if (!result) notFound();

  const { category, project } = result;
  const gallery = project.gallery ?? [];
  const isPhoto = categorySlug === 'photography';
  const others = (category.items || []).filter((i) => i.slug && i.slug !== project.slug);

  return (
    <>
      <Header />

      <main id="main" className="s-main">
        <section className="s-page-hero">
          <div className="s-wrap">
            <Eyebrow><a href="/work?type=photography">Work · {category.title}</a></Eyebrow>
            <h1 className="s-h1">{project.name}</h1>
            <div className="s-head" style={{ marginTop: 26, marginBottom: 0 }}>
              <p className="s-lead" style={{ justifySelf: 'start' }}>{project.tag}. {gallery.length > 0 && `${gallery.length} photos.`}</p>
              <p className="s-fine" style={{ justifySelf: 'end', textAlign: 'right' }}>
                Service: {isPhoto ? 'Photography' : 'Video production'} · <a href={isPhoto ? '/services#photography' : '/services#video'}>See pricing</a>
              </p>
            </div>
          </div>
        </section>

        <section className="s-section" style={{ paddingTop: 0 }}>
          <div className="s-wrap">
            {gallery.length > 0
              ? <PhotoGallery photos={gallery} title={project.name} />
              : <p className="s-empty">Photos from this collection are coming soon.</p>}

            {others.length > 0 && (
              <div className="s-under" style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--s-line)' }}>
                <span>More collections: {others.map((o, i) => (
                  <span key={o.slug}>{i > 0 && ' · '}<a className="s-fine" style={{ fontSize: 14 }} href={`/work/${category.slug}/${o.slug}`}>{o.name}</a></span>
                ))}</span>
                <a className="s-link" href="/work">All work <Arrow /></a>
              </div>
            )}
          </div>
        </section>

        <ContactCTA interest={isPhoto ? 'Photography' : 'One-time video'} />
      </main>

      <Footer />
    </>
  );
}
