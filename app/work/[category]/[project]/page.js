import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Contact from '../../../components/Contact';
import { WORK_CATEGORIES, getWorkProject } from '../../../../lib/work';

export function generateStaticParams() {
  return WORK_CATEGORIES.flatMap((category) =>
    category.items
      .filter((item) => item.slug)
      .map((item) => ({ category: category.slug, project: item.slug })),
  );
}

export async function generateMetadata({ params }) {
  const { category: categorySlug, project: projectSlug } = await params;
  const result = getWorkProject(categorySlug, projectSlug);
  if (!result) return {};
  return {
    title: `${result.project.name} — Oskelo`,
    description: result.project.tag,
  };
}

export default async function WorkProjectPage({ params }) {
  const { category: categorySlug, project: projectSlug } = await params;
  const result = getWorkProject(categorySlug, projectSlug);
  if (!result) notFound();

  const { category, project } = result;
  const gallery = project.gallery ?? [];

  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section" id="work-project">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <a href={`/work/${category.slug}`}>{category.title}</a>
                </div>
                <h2>{project.name}</h2>
              </div>
              <p>{project.tag}</p>
            </div>

            {gallery.length > 0 ? (
              <div className="photo-grid">
                {gallery.map((photo, index) => (
                  <figure className="photo-grid-item" key={photo.src ?? index}>
                    <img
                      src={photo.src}
                      alt={photo.alt ?? `${project.name} — photo ${index + 1}`}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            ) : (
              <p className="photo-grid-empty">Photos from this collection are coming soon.</p>
            )}
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
