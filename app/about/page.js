import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { getContent } from '../../lib/siteContent';
import { ABOUT_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'About the Team',
  description: 'Meet the small Lancaster, PA team behind OSKELO. You work directly with the people who film, photograph and edit your content.',
  alternates: { canonical: '/about' },
};

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default async function About() {
  const c = { ...ABOUT_DEFAULT, ...(await getContent('about', ABOUT_DEFAULT)) };

  return (
    <>
      <Header />

      <main id="main">
        <div className="wrap">
          <section className="section page-intro" id="about">
            <div className="section-head">
              <div>
                <div className="eyebrow">{c.eyebrow}</div>
                <h1>{c.headingLine1}<br />{c.headingLine2}</h1>
              </div>
              <p>{c.intro}</p>
            </div>

            {c.story && (
              <div className="about-story">
                <h3>{c.storyHeading}</h3>
                <p>{c.story}</p>
              </div>
            )}

            <div className="team-label">The team</div>
            <div className="team-grid">
              {(c.team || []).map((member) => (
                <div className="team-card" key={member.name}>
                  <div className="team-avatar">
                    {member.photo
                      ? <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" />
                      : <span aria-hidden="true">{initials(member.name)}</span>}
                  </div>
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p>{member.bio}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {c.promises?.length > 0 && (
          <div className="section-alt">
            <div className="wrap">
              <section className="section" id="how-we-work">
                <div className="section-head">
                  <div>
                    <div className="eyebrow">How we work</div>
                    <h2>{c.promisesHeading}</h2>
                  </div>
                </div>
                <div className="point-grid">
                  {c.promises.map((p, i) => (
                    <div className="point" key={i}>
                      <h3>{p.title}</h3>
                      <p>{p.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        <ContactCTA heading="Want to work with us?" body="Tell us a little about your business. You’ll hear back from the people who would actually make your content." />
      </main>

      <Footer />
    </>
  );
}
