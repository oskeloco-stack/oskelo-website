import Header from '../components/Header';
import Footer from '../components/Footer';
import { getContent } from '../../lib/siteContent';
import { ABOUT_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'About the Team — Oskelo',
  description: 'Meet the people behind Oskelo — video and photo for businesses, individuals, and events.',
};

export default async function About() {
  const c = await getContent('about', ABOUT_DEFAULT);

  return (
    <>
      <Header />

      <main>
        <div className="wrap">
          <section className="section" id="about">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.eyebrow}</div>
                <h2>{c.headingLine1}<br />{c.headingLine2}</h2>
              </div>
              <p>{c.intro}</p>
            </div>

            <div className="team-grid">
              {(c.team || []).map((member) => (
                <div className="team-card" key={member.name}>
                  <div className="team-avatar"></div>
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p>{member.bio}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
