import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { Eyebrow } from '../components/ui';
import { getContent } from '../../lib/siteContent';
import { ABOUT_DEFAULT, HOME_DEFAULT } from '../../lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'About OSKELO',
  description:
    'OSKELO is a Christian-owned creative studio in Lancaster, PA, founded by David Becker to help businesses create content that reflects the work they actually do.',
  alternates: { canonical: '/about' },
};

export default async function About() {
  const c = { ...ABOUT_DEFAULT, ...(await getContent('about', ABOUT_DEFAULT)) };
  // The six OSKELO values are still edited under Homepage in the admin.
  const home = { ...HOME_DEFAULT, ...(await getContent('home', HOME_DEFAULT)) };
  const team = c.team || [];

  return (
    <>
      <Header />

      <main id="main" className="s-main">
        <section className="s-page-hero" aria-labelledby="about-heading">
          <div className="s-wrap">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1 className="s-h1" id="about-heading">{c.headingLine1} <span className="s-accent">{c.headingLine2}.</span></h1>
            <p className="s-lead">{c.intro}</p>
          </div>
        </section>

        <section className="s-section" style={{ paddingTop: 16 }} aria-label="Founder">
          <div className="s-wrap">
            {team.map((member) => (
              <div className="s-founder" key={member.name}>
                <div>
                  <div className="s-founder-photo">
                    {member.photo
                      ? <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" decoding="async" />
                      : <span>Founder photo coming soon</span>}
                  </div>
                  <div className="s-founder-name">
                    <b>{member.name}</b>
                    <span>{member.role}</span>
                  </div>
                </div>
                <div className="s-founder-copy">
                  <Eyebrow>{c.storyHeading}</Eyebrow>
                  <h2 className="s-h2">Built to take content off your plate.</h2>
                  {c.story && <p>{c.story}</p>}
                  {member.bio && <p>{member.bio}</p>}
                  <p>OSKELO was founded to help businesses create high-quality content that reflects the work they actually do: honest, well made, and ready to use.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {c.faithHeading && (
          <section className="s-section s-section--dark" id="faith" aria-labelledby="faith-heading">
            <div className="s-wrap s-faith">
              <div>
                <Eyebrow>{c.faithEyebrow}</Eyebrow>
                <h2 className="s-h2" id="faith-heading">{c.faithHeading}</h2>
                {(c.faithBody || []).map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {c.faithVerse && (
                <figure className="s-verse">
                  <blockquote>“{c.faithVerse}”</blockquote>
                  {c.faithVerseRef && <figcaption>{c.faithVerseRef}</figcaption>}
                </figure>
              )}
            </div>
          </section>
        )}

        {home.values?.length > 0 && (
          <section className="s-section" id="meaning" aria-labelledby="meaning-heading">
            <div className="s-wrap">
              <div className="s-head">
                <div>
                  <Eyebrow>{c.meaningEyebrow}</Eyebrow>
                  <h2 className="s-h2" id="meaning-heading">{c.meaningHeading}</h2>
                </div>
                {c.meaningIntro && <p className="s-lead">{c.meaningIntro}</p>}
              </div>
              <div className="s-values">
                {home.values.map((v, i) => (
                  <div className="s-value" key={i}>
                    <span className="s-value-letter" aria-hidden="true">{v.letter}</span>
                    <h3 className="s-h3">{v.word}</h3>
                    <p>{v.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {c.promises?.length > 0 && (
          <section className="s-section s-section--alt" id="how-we-work" aria-labelledby="promises-heading">
            <div className="s-wrap">
              <div className="s-head s-head--stack">
                <div>
                  <Eyebrow>How we work</Eyebrow>
                  <h2 className="s-h2" id="promises-heading">{c.promisesHeading}</h2>
                </div>
              </div>
              <ol className="s-steps">
                {c.promises.map((p, i) => (
                  <li key={i}>
                    <span className="s-step-n">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="s-h3">{p.title}</h3>
                    <p>{p.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <ContactCTA heading="Want to work together?" body="Tell me a little about your business. You’ll hear back from the person who would actually make your content." />
      </main>

      <Footer />
    </>
  );
}
