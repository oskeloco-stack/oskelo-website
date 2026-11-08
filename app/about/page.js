import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import Values from '../components/Values';
import { getContent } from '../../lib/siteContent';
import { ABOUT_DEFAULT, HOME_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'About OSKELO',
  description:
    'OSKELO is a Christian-owned video and website business in Lancaster, PA, run by David Becker. Built on faith, honest work and serving others.',
  alternates: { canonical: '/about' },
};

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default async function About() {
  const c = { ...ABOUT_DEFAULT, ...(await getContent('about', ABOUT_DEFAULT)) };
  // The six OSKELO values are still edited under Homepage in the admin.
  const home = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };
  const team = c.team || [];

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

            <div className={`founder${team.length > 1 ? ' founder--many' : ''}`}>
              {team.map((member) => (
                <div className="founder-card" key={member.name}>
                  <div className="founder-photo">
                    {member.photo
                      ? <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" />
                      : <span aria-hidden="true">{initials(member.name)}</span>}
                  </div>
                  <div>
                    <h2>{member.name}</h2>
                    <div className="team-role">{member.role}</div>
                    <p>{member.bio}</p>
                  </div>
                </div>
              ))}
              {c.story && (
                <div className="founder-story">
                  <h3>{c.storyHeading}</h3>
                  <p>{c.story}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {c.faithHeading && (
          <section className="faith" id="faith">
            <div className="wrap faith-inner">
              <div>
                <div className="eyebrow">{c.faithEyebrow}</div>
                <h2>{c.faithHeading}</h2>
                {(c.faithBody || []).map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {c.faithVerse && (
                <figure className="faith-verse">
                  <blockquote>“{c.faithVerse}”</blockquote>
                  {c.faithVerseRef && <figcaption>{c.faithVerseRef}</figcaption>}
                </figure>
              )}
            </div>
          </section>
        )}

        {home.values?.length > 0 && (
          <div className="wrap">
            <section className="section" id="meaning">
              <div className="section-head">
                <div>
                  <div className="eyebrow">{c.meaningEyebrow}</div>
                  <h2>{c.meaningHeading}</h2>
                </div>
                {c.meaningIntro && <p>{c.meaningIntro}</p>}
              </div>
              <Values values={home.values} />
            </section>
          </div>
        )}

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

        <ContactCTA heading="Want to work together?" body="Tell me a little about your business. You’ll hear back from the person who would actually make your video or website." />
      </main>

      <Footer />
    </>
  );
}
