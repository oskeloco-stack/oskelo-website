import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import { WORK_CATEGORIES, getWorkCategory } from '../../../lib/work';

export function generateStaticParams() {
  return WORK_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = getWorkCategory(slug);
  if (!category) return {};
  return {
    title: `${category.title} — Oskelo`,
    description: category.subtitle,
  };
}

export default async function WorkCategoryPage({ params }) {
  const { category: slug } = await params;
  const category = getWorkCategory(slug);
  if (!category) notFound();

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
            <div className="work-grid">
              {category.items.map((item) => (
                <div className="work-card" key={item.name}>
                  <div className="tag">
                    <b>{item.name}</b>
                    <span>{item.tag}</span>
                  </div>
                </div>
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
