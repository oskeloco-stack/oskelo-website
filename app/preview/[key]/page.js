'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Editable from '../Editable';
import Header from '../../components/Header';
import { SERVICES } from '../../../lib/services';
import { WORK_CATEGORIES } from '../../../lib/work';
import {
  HOME_DEFAULT,
  ABOUT_DEFAULT,
  CONTACT_PAGE_DEFAULT,
  FOUNDING_OFFER_DEFAULT,
  PROMO_BAR_DEFAULT,
  FOOTER_DEFAULT,
  TERMS_DEFAULT,
} from '../../../lib/pageContent';
import '../preview.css';

const DEFAULTS = {
  home: HOME_DEFAULT,
  about: ABOUT_DEFAULT,
  contact: CONTACT_PAGE_DEFAULT,
  foundingOffer: FOUNDING_OFFER_DEFAULT,
  promoBar: PROMO_BAR_DEFAULT,
  footer: FOOTER_DEFAULT,
  terms: TERMS_DEFAULT,
};

// Talks to the admin's Visual tab (app/admin/(dash)/_components/VisualEditor.js)
// over postMessage. Same origin always (this only ever loads in an iframe the
// admin panel itself puts on the page), but we still check event.origin.
function usePreviewSync(pageKey) {
  const [content, setContent] = useState(DEFAULTS[pageKey] || {});

  useEffect(() => {
    function onMessage(e) {
      if (e.origin !== window.location.origin) return;
      const msg = e.data;
      if (msg?.source !== 'oskelo-admin') return;
      if (msg.type === 'content') setContent(msg.value);
    }
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ source: 'oskelo-preview', type: 'ready', key: pageKey }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, [pageKey]);

  const update = useCallback(
    (next) => {
      setContent(next);
      window.parent.postMessage({ source: 'oskelo-preview', type: 'change', value: next }, window.location.origin);
    },
    []
  );

  return [content, update];
}

function set(content, key, value) {
  return { ...content, [key]: value };
}
function setAt(content, arrayKey, index, field, value) {
  const arr = content[arrayKey].slice();
  arr[index] = { ...arr[index], [field]: value };
  return { ...content, [arrayKey]: arr };
}

function Bar({ label }) {
  return (
    <div className="pv-bar">
      <b>Live preview</b>
      <span>{label} — click any highlighted text to edit it</span>
    </div>
  );
}

function HomeView({ c: saved, set: setC }) {
  // Copy fields added after an admin save fall back to their defaults.
  const c = { ...HOME_DEFAULT, ...saved };
  const field = (key) => (v) => setC(set(c, key, v));
  const item = (arrayKey, i, key) => (v) => setC(setAt(c, arrayKey, i, key, v));
  const line = (arrayKey, i) => (v) => {
    const arr = c[arrayKey].slice();
    arr[i] = v;
    setC({ ...c, [arrayKey]: arr });
  };
  const monthly = SERVICES.find((s) => s.slug === 'monthly-plans');

  return (
    <>
      <Bar label="Homepage" />
      <Header />
      <main>
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-scrim" />
          <div className="hero-content">
            <Editable as="div" className="eyebrow" value={c.heroEyebrow} onCommit={field('heroEyebrow')} />
            <h1>
              <Editable value={c.heroHeadingLine1} onCommit={field('heroHeadingLine1')} placeholder="Line 1" /><br />
              <span className="hero-accent"><Editable value={c.heroHeadingLine2} onCommit={field('heroHeadingLine2')} placeholder="Line 2" /></span>
            </h1>
            <Editable as="p" value={c.heroSub} multiline onCommit={field('heroSub')} placeholder="Short line under the heading" />
            <div className="hero-ctas">
              <span className="btn btn-solid"><Editable value={c.heroCta1Label} onCommit={field('heroCta1Label')} /></span>
              <span className="btn btn-outline"><Editable value={c.heroCta2Label} onCommit={field('heroCta2Label')} /></span>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section why-section">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.whyEyebrow} onCommit={field('whyEyebrow')} />
                <h2><Editable value={c.whyHeading} onCommit={field('whyHeading')} /></h2>
              </div>
              <Editable as="p" value={c.whyIntro} multiline onCommit={field('whyIntro')} />
            </div>
            <div className="point-grid">
              {c.whyPoints.map((point, i) => (
                <div className="point" key={i}>
                  <span className="point-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3><Editable value={point.title} onCommit={item('whyPoints', i, 'title')} /></h3>
                  <Editable as="p" value={point.body} multiline onCommit={item('whyPoints', i, 'body')} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section">
              <div className="section-head">
                <div>
                  <Editable as="div" className="eyebrow" value={c.packagesEyebrow} onCommit={field('packagesEyebrow')} />
                  <h2><Editable value={c.packagesHeading} onCommit={field('packagesHeading')} /></h2>
                </div>
                <Editable as="p" value={c.packagesIntro} multiline onCommit={field('packagesIntro')} />
              </div>
              <div className="plan-grid">
                {monthly.plans.map((plan) => (
                  <div className={`plan${plan.featured ? ' is-featured' : ''}`} key={plan.name}>
                    <div className="plan-head"><h3>{plan.name}</h3></div>
                    <div className="plan-price">{plan.price}</div>
                    <p className="plan-bestfor">{plan.bestFor}</p>
                  </div>
                ))}
              </div>
              <p className="pv-hint">Plan names, prices and features are edited under Services. The founding-client note is under Rate-lock banner.</p>
              <div className="subhead" style={{ marginTop: 40 }}>
                <h3><Editable value={c.packagesOneTimeLabel} onCommit={field('packagesOneTimeLabel')} /></h3>
                <Editable as="p" value={c.packagesOneTimeIntro} multiline onCommit={field('packagesOneTimeIntro')} />
              </div>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="intro-offer">
            <div className="intro-offer-main">
              <Editable as="div" className="eyebrow" value={c.introEyebrow} onCommit={field('introEyebrow')} />
              <h2><Editable value={c.introHeading} onCommit={field('introHeading')} /></h2>
              <Editable as="p" value={c.introBody} multiline onCommit={field('introBody')} />
              <span className="btn btn-solid"><Editable value={c.introCta} onCommit={field('introCta')} /></span>
            </div>
            <div className="intro-offer-terms">
              <div className="intro-offer-terms-label">How it works</div>
              <ul>
                {c.introConditions.map((text, i) => (
                  <li key={i}><Editable value={text} multiline onCommit={line('introConditions', i)} /></li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="wrap">
          <section className="section">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.stepsEyebrow} onCommit={field('stepsEyebrow')} />
                <h2><Editable value={c.stepsHeading} onCommit={field('stepsHeading')} /></h2>
              </div>
            </div>
            <ol className="process">
              {c.steps.map((step, i) => (
                <li key={i}>
                  <span className="process-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3><Editable value={step.title} onCommit={item('steps', i, 'title')} /></h3>
                  <Editable as="p" value={step.body} multiline onCommit={item('steps', i, 'body')} />
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section">
              <div className="section-head">
                <div>
                  <Editable as="div" className="eyebrow" value={c.reelsEyebrow} onCommit={field('reelsEyebrow')} />
                  <h2><Editable value={c.reelsHeading} onCommit={field('reelsHeading')} /></h2>
                </div>
                <Editable as="p" value={c.reelsIntro} multiline onCommit={field('reelsIntro')} />
              </div>
              <p className="pv-hint">Reels come from the Video &amp; Editing items under Work &amp; galleries.</p>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.valuesEyebrow} onCommit={field('valuesEyebrow')} />
                <h2><Editable value={c.valuesHeading} onCommit={field('valuesHeading')} /></h2>
              </div>
            </div>
            <dl className="values">
              {c.values.map((v, i) => (
                <div className="value" key={i}>
                  <dt>
                    <span className="value-letter" aria-hidden="true">{v.letter}</span>
                    <span className="value-word"><Editable value={v.word} onCommit={item('values', i, 'word')} /></span>
                  </dt>
                  <dd><Editable value={v.body} multiline onCommit={item('values', i, 'body')} /></dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section">
              <div className="section-head">
                <div>
                  <Editable as="div" className="eyebrow" value={c.workEyebrow} onCommit={field('workEyebrow')} />
                  <h2><Editable value={c.workHeading} onCommit={field('workHeading')} /></h2>
                </div>
                <Editable as="p" value={c.workIntro} multiline onCommit={field('workIntro')} />
              </div>
              <div className="link-cards cols-2">
                {WORK_CATEGORIES.map((category) => (
                  <span className="link-card" key={category.slug}>
                    <div className={`link-card-media${category.images ? ' is-collage' : ''}`}>
                      {category.images?.map((src) => <img src={src} alt="" key={src} />)}
                    </div>
                    <h3>{category.title}</h3>
                    <p>{category.subtitle}</p>
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section">
            <div className="contact-inner">
              <div>
                <div className="eyebrow">Contact</div>
                <h2><Editable value={c.closingHeading} onCommit={field('closingHeading')} /></h2>
                <Editable as="p" value={c.closingBody} multiline onCommit={field('closingBody')} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function AboutView({ c, set: setC }) {
  const team = c.team || [];
  function updateMember(i, field, v) { setC(setAt(c, 'team', i, field, v)); }
  function addMember() { setC({ ...c, team: [...team, { name: 'New teammate', role: 'Role', bio: 'Short bio.' }] }); }
  function removeMember(i) { setC({ ...c, team: team.filter((_, j) => j !== i) }); }

  return (
    <>
      <Bar label="About page" />
      <Header />
      <main>
        <div className="wrap">
          <section className="section" id="about">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.eyebrow} onCommit={(v) => setC(set(c, 'eyebrow', v))} />
                <h2>
                  <Editable value={c.headingLine1} onCommit={(v) => setC(set(c, 'headingLine1', v))} /><br />
                  <Editable value={c.headingLine2} onCommit={(v) => setC(set(c, 'headingLine2', v))} />
                </h2>
              </div>
              <Editable as="p" value={c.intro} multiline onCommit={(v) => setC(set(c, 'intro', v))} />
            </div>

            <div className="about-story">
              <h3><Editable value={c.storyHeading} onCommit={(v) => setC(set(c, 'storyHeading', v))} placeholder="Story heading" /></h3>
              <Editable as="p" value={c.story} multiline onCommit={(v) => setC(set(c, 'story', v))} placeholder="A few sentences on why OSKELO exists" />
            </div>

            <div className="team-grid">
              {team.map((member, i) => (
                <div className="team-card pv-card-wrap" key={i}>
                  <button type="button" className="pv-remove-btn" onClick={() => removeMember(i)} title="Remove">✕</button>
                  <div className="team-avatar" />
                  <h3><Editable value={member.name} onCommit={(v) => updateMember(i, 'name', v)} /></h3>
                  <div className="team-role"><Editable value={member.role} onCommit={(v) => updateMember(i, 'role', v)} /></div>
                  <Editable as="p" value={member.bio} multiline onCommit={(v) => updateMember(i, 'bio', v)} />
                </div>
              ))}
            </div>
            <button type="button" className="pv-add-btn" style={{ marginTop: 16 }} onClick={addMember}>+ Add teammate</button>
          </section>
        </div>
      </main>
    </>
  );
}

function ContactView({ c, set: setC }) {
  return (
    <>
      <Bar label="Contact page" />
      <Header />
      <main>
        <div className="wrap">
          <section className="section legal" id="contact-intro">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.eyebrow} onCommit={(v) => setC(set(c, 'eyebrow', v))} />
                <h2><Editable value={c.heading} onCommit={(v) => setC(set(c, 'heading', v))} /></h2>
              </div>
              <Editable as="p" value={c.intro} multiline onCommit={(v) => setC(set(c, 'intro', v))} />
            </div>
            <Editable as="p" value={c.body} multiline onCommit={(v) => setC(set(c, 'body', v))} />
          </section>
        </div>
      </main>
    </>
  );
}

function TermsView({ c, set: setC }) {
  const sections = c.sections || [];
  function updateSection(i, field, v) { setC(setAt(c, 'sections', i, field, v)); }
  function addSection() { setC({ ...c, sections: [...sections, { heading: 'New section', body: 'Section text.' }] }); }
  function removeSection(i) { setC({ ...c, sections: sections.filter((_, j) => j !== i) }); }

  return (
    <>
      <Bar label="Terms page" />
      <Header />
      <main>
        <div className="wrap">
          <section className="section legal">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.eyebrow} onCommit={(v) => setC(set(c, 'eyebrow', v))} />
                <h2><Editable value={c.heading} onCommit={(v) => setC(set(c, 'heading', v))} /></h2>
                <div className="legal-updated"><Editable value={c.lastUpdated} onCommit={(v) => setC(set(c, 'lastUpdated', v))} /></div>
              </div>
              <Editable as="p" value={c.intro} multiline onCommit={(v) => setC(set(c, 'intro', v))} />
            </div>

            {sections.map((s, i) => (
              <div key={i} className="pv-card-wrap">
                <button type="button" className="pv-remove-btn" onClick={() => removeSection(i)} title="Remove">✕</button>
                <h3><Editable value={s.heading} onCommit={(v) => updateSection(i, 'heading', v)} /></h3>
                <Editable as="p" value={s.body} multiline onCommit={(v) => updateSection(i, 'body', v)} />
              </div>
            ))}
            <button type="button" className="pv-add-btn" style={{ marginTop: 16 }} onClick={addSection}>+ Add section</button>

            <h3>Contact</h3>
            <p>
              Questions about these terms can be sent to{' '}
              <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

function FoundingOfferView({ c, set: setC }) {
  return (
    <>
      <Bar label="Rate-lock banner" />
      <main>
        <section className="section promo" id="founding-offer">
          <div className="wrap">
            <div className="promo-inner">
              <Editable as="div" className="eyebrow" value={c.eyebrow} onCommit={(v) => setC(set(c, 'eyebrow', v))} />
              <h2><Editable value={c.heading} onCommit={(v) => setC(set(c, 'heading', v))} /></h2>
              <Editable as="p" value={c.body} multiline onCommit={(v) => setC(set(c, 'body', v))} />
              <span className="btn btn-solid"><Editable value={c.ctaLabel} onCommit={(v) => setC(set(c, 'ctaLabel', v))} /></span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function PromoBarView({ c, set: setC }) {
  return (
    <>
      <Bar label="Top promo bar" />
      <main>
        <div className="promo-bar">
          <div className="promo-bar-track">
            <span className="promo-bar-group">
              <Editable value={c.message} onCommit={(v) => setC(set(c, 'message', v))} />
            </span>
          </div>
        </div>
        <p style={{ padding: 24, color: '#6f6353', font: '14px Inter, sans-serif' }}>
          This banner scrolls across the very top of every page (except the admin area).
        </p>
      </main>
    </>
  );
}

function FooterView({ c, set: setC }) {
  return (
    <>
      <Bar label="Footer" />
      <main style={{ minHeight: '60vh' }} />
      <footer>
        <div className="wrap footer-inner">
          <Editable value={c.copyright} onCommit={(v) => setC(set(c, 'copyright', v))} />
          <div className="footer-links">
            <Editable value={c.location} onCommit={(v) => setC(set(c, 'location', v))} />
            <Editable value={c.termsLabel} onCommit={(v) => setC(set(c, 'termsLabel', v))} />
          </div>
        </div>
      </footer>
    </>
  );
}

const VIEWS = {
  home: HomeView,
  about: AboutView,
  contact: ContactView,
  terms: TermsView,
  foundingOffer: FoundingOfferView,
  promoBar: PromoBarView,
  footer: FooterView,
};

export default function PreviewPage() {
  const params = useParams();
  const key = params?.key;
  const [content, setContent] = usePreviewSync(key);
  const View = useMemo(() => VIEWS[key], [key]);

  if (!View) return <p style={{ padding: 24 }}>No visual preview for "{key}" yet — use the Form or Raw JSON tab.</p>;

  return <View c={content} set={setContent} />;
}
