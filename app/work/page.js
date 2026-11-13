import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import WorkBrowser from '../components/WorkBrowser';
import { Arrow, Eyebrow } from '../components/ui';
import { WORK_CATEGORIES } from '../../lib/work';
import { getContent } from '../../lib/siteContent';
import { flattenWork } from '../../lib/portfolio';

export const revalidate = 60;

export const metadata = {
  title: 'Work: Video & Short-Form Portfolio',
  description: 'Real OSKELO projects: brand stories, event promos and short-form video for local businesses and organizations. Lancaster, PA.',
  alternates: { canonical: '/work' },
};

export default async function WorkPage() {
  const categories = await getContent('work', WORK_CATEGORIES);
  // Videos lead: it's the core of what we sell.
  const projects = flattenWork(categories).sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'video' ? -1 : 1));

  return (
    <>
      <Header />

      <main id="main" className="s-main">
        <section className="s-page-hero" aria-labelledby="work-heading">
          <div className="s-wrap">
            <Eyebrow>Work</Eyebrow>
            <h1 className="s-h1" id="work-heading">Real projects. <span className="s-accent">Real businesses and people.</span></h1>
            <p className="s-lead">Everything here was filmed and edited by OSKELO. Tap a video to watch it with sound.</p>
          </div>
        </section>

        <section className="s-section" style={{ paddingTop: 0 }} aria-label="Portfolio">
          <div className="s-wrap">
            <WorkBrowser projects={projects} />
          </div>
        </section>

        <section className="s-section s-section--alt" aria-labelledby="web-heading">
          <div className="s-wrap s-web">
            <div>
              <Eyebrow>Also from the studio</Eyebrow>
              <h2 className="s-h2" id="web-heading" style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}>Website builds</h2>
              <p className="s-body" style={{ marginTop: 18 }}>
                We built the Grace Church Lancaster website: welcome page, service times, ministries, sermons and a plan-your-visit flow that works on any phone.
              </p>
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginTop: 28 }}>
                <a className="s-link" href="https://www.gracelanc.org" target="_blank" rel="noopener noreferrer">Visit gracelanc.org <span aria-hidden="true">↗</span></a>
                <a className="s-link" href="/websites">Website pricing <Arrow /></a>
              </div>
            </div>
            <a className="s-web-shot" href="https://www.gracelanc.org" target="_blank" rel="noopener noreferrer" aria-label="Grace Church Lancaster website (opens in a new tab)">
              <img src="/websites/gracelanc-desktop.webp" alt="Grace Church Lancaster homepage, built by OSKELO" loading="lazy" decoding="async" />
            </a>
          </div>
        </section>

        <ContactCTA heading="Your project could be next." body="Tell us what you do and what you need. We’ll suggest the simplest way to get it made." />
      </main>

      <Footer />
    </>
  );
}
