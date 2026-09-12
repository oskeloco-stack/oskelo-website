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

function HomeView({ c, set: setC }) {
  return (
    <>
      <Bar label="Homepage" />
      <Header />
      <main>
        <section className="hero">
          <div className="hero-bg">
            <span className="bokeh b1" /><span className="bokeh b2" /><span className="bokeh b3" /><span className="bokeh b4" />
          </div>
          <div className="hero-scrim" />
          <div className="hero-content">
            <Editable as="div" className="eyebrow" value={c.heroEyebrow} onCommit={(v) => setC(set(c, 'heroEyebrow', v))} />
            <h1>
              <Editable value={c.heroHeadingLine1} onCommit={(v) => setC(set(c, 'heroHeadingLine1', v))} placeholder="Line 1" /><br />
              <Editable value={c.heroHeadingLine2} onCommit={(v) => setC(set(c, 'heroHeadingLine2', v))} placeholder="Line 2" />
            </h1>
            <div className="hero-ctas">
              <span className="btn btn-solid"><Editable value={c.heroCta1Label} onCommit={(v) => setC(set(c, 'heroCta1Label', v))} /></span>
              <span className="btn btn-outline"><Editable value={c.heroCta2Label} onCommit={(v) => setC(set(c, 'heroCta2Label', v))} /></span>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section offers" id="services">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.offersEyebrow} onCommit={(v) => setC(set(c, 'offersEyebrow', v))} />
                <h2><Editable value={c.offersHeading} onCommit={(v) => setC(set(c, 'offersHeading', v))} /></h2>
              </div>
              <Editable as="p" value={c.offersIntro} multiline onCommit={(v) => setC(set(c, 'offersIntro', v))} />
            </div>
            <div className="offers-inner">
              <ul className="offer-list">
                {SERVICES.map((service, i) => (
                  <li key={service.slug}>
                    <span>
                      <span className="offer-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <span className="offer-text">
                        <span className="offer-name">{service.title}</span>
                        <span className="offer-blurb">{service.subtitle}</span>
                      </span>
                      <span className="offer-arrow" aria-hidden="true">→</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="offers-collage" aria-hidden="true">
                <img src="/work/wedding-engagement/garden-path.jpg" alt="" />
              </div>
            </div>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section mission" id="mission">
              <div className="section-head">
                <div>
                  <Editable as="div" className="eyebrow" value={c.missionEyebrow} onCommit={(v) => setC(set(c, 'missionEyebrow', v))} />
                  <h2><Editable value={c.missionHeading} onCommit={(v) => setC(set(c, 'missionHeading', v))} /></h2>
                </div>
              </div>
              <div className="mission-body">
                <Editable as="p" value={c.missionBody1} multiline onCommit={(v) => setC(set(c, 'missionBody1', v))} />
                <Editable as="p" value={c.missionBody2} multiline onCommit={(v) => setC(set(c, 'missionBody2', v))} />
              </div>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section" id="work">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.workEyebrow} onCommit={(v) => setC(set(c, 'workEyebrow', v))} />
                <h2><Editable value={c.workHeading} onCommit={(v) => setC(set(c, 'workHeading', v))} /></h2>
              </div>
              <Editable as="p" value={c.workIntro} multiline onCommit={(v) => setC(set(c, 'workIntro', v))} />
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

        <div className="wrap">
          <section className="section reels-section" id="reels">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.reelsEyebrow} onCommit={(v) => setC(set(c, 'reelsEyebrow', v))} />
                <h2><Editable value={c.reelsHeading} onCommit={(v) => setC(set(c, 'reelsHeading', v))} /></h2>
              </div>
              <Editable as="p" value={c.reelsIntro} multiline onCommit={(v) => setC(set(c, 'reelsIntro', v))} />
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
