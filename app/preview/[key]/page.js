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
  const monthly = SERVICES.find((s) => s.slug === 'monthly-plans');
  const oneTimeVideo = SERVICES.find((s) => s.slug === 'one-time-video');

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
            <Editable as="div" className="eyebrow" value={c.heroEyebrow} onCommit={field('heroEyebrow')} />
            <h1>
              <Editable value={c.heroHeadingLine1} onCommit={field('heroHeadingLine1')} placeholder="Line 1" /><br />
              <Editable value={c.heroHeadingLine2} onCommit={field('heroHeadingLine2')} placeholder="Line 2" />
            </h1>
            <Editable as="p" value={c.heroSub} multiline onCommit={field('heroSub')} placeholder="Short line under the heading" />
            <div className="hero-ctas">
              <span className="btn btn-solid"><Editable value={c.heroCta1Label} onCommit={field('heroCta1Label')} /></span>
              <span className="btn btn-outline"><Editable value={c.heroCta2Label} onCommit={field('heroCta2Label')} /></span>
            </div>
          </div>
        </section>

        <div className="wrap">
          <section className="section why-section" id="why">
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
            <section className="section" id="packages">
              <div className="section-head">
                <div>
                  <Editable as="div" className="eyebrow" value={c.packagesEyebrow} onCommit={field('packagesEyebrow')} />
                  <h2><Editable value={c.packagesHeading} onCommit={field('packagesHeading')} /></h2>
                </div>
                <Editable as="p" value={c.packagesIntro} multiline onCommit={field('packagesIntro')} />
              </div>
              <div className="packages-label">{monthly.title}</div>
              <div className="packages home-packages">
                {monthly.plans.map((pkg) => (
                  <div className={`package ${pkg.featured ? 'featured' : ''}`} key={pkg.name}>
                    {pkg.featured && <span className="package-badge">Most popular</span>}
                    <h3>{pkg.name}</h3>
                    <div className="price">{pkg.price}</div>
                    <ul>{pkg.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  </div>
                ))}
              </div>
              <Editable as="div" className="packages-label" value={c.packagesOneTimeLabel} onCommit={field('packagesOneTimeLabel')} />
              <div className="onetime-row">
                {oneTimeVideo.plans.map((plan) => (
                  <span className="onetime" key={plan.name}>
                    <span className="onetime-name">{plan.name}</span>
                    <span className="onetime-price">{plan.price}</span>
                    <span className="onetime-detail">{plan.features[0]}</span>
                  </span>
                ))}
                <span className="onetime">
                  <span className="onetime-name">Full Shoot</span>
                  <span className="onetime-price">Custom quote</span>
                </span>
              </div>
              <Editable as="p" className="packages-note" value={c.packagesNote} multiline onCommit={field('packagesNote')} />
              <p className="pv-hint">Package names, prices and features are edited under Services.</p>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section" id="reels">
            <div className="section-head">
              <div>
                <Editable as="div" className="eyebrow" value={c.reelsEyebrow} onCommit={field('reelsEyebrow')} />
                <h2><Editable value={c.reelsHeading} onCommit={field('reelsHeading')} /></h2>
              </div>
              <Editable as="p" value={c.reelsIntro} multiline onCommit={field('reelsIntro')} />
            </div>
          </section>
        </div>

        <div className="section-alt">
          <div className="wrap">
            <section className="section" id="why-oskelo">
              <div className="section-head">
                <div>
                  <Editable as="div" className="eyebrow" value={c.usEyebrow} onCommit={field('usEyebrow')} />
                  <h2><Editable value={c.usHeading} onCommit={field('usHeading')} /></h2>
                </div>
              </div>
              <div className="point-grid cols-4">
                {c.usPoints.map((point, i) => (
                  <div className="point" key={i}>
                    <h3><Editable value={point.title} onCommit={item('usPoints', i, 'title')} /></h3>
                    <Editable as="p" value={point.body} multiline onCommit={item('usPoints', i, 'body')} />
                  </div>
                ))}
              </div>
              <div className="steps">
                <Editable as="div" className="steps-heading" value={c.stepsHeading} onCommit={field('stepsHeading')} />
                <ol className="steps-list">
                  {c.steps.map((step, i) => (
                    <li key={i}>
                      <span className="step-num" aria-hidden="true">{i + 1}</span>
                      <span className="step-text">
                        <b><Editable value={step.title} onCommit={item('steps', i, 'title')} /></b>
                        <Editable value={step.body} onCommit={item('steps', i, 'body')} />
                      </span>
                    </li>
                  ))}
                </ol>
                <span className="btn btn-solid">{c.heroCta2Label}</span>
              </div>
            </section>
          </div>
        </div>

        <div className="wrap">
          <section className="section" id="work">
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
