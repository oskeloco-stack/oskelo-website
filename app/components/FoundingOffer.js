import { getContent } from '../../lib/siteContent';
import { FOUNDING_OFFER_DEFAULT } from '../../lib/pageContent';

// A quiet note, not a banner: sits under the monthly plans wherever they appear.
// The words are admin-editable content this component fetches for itself.
// No countdowns or "spots left" — only add a count if it reflects real availability.
export default async function FoundingOffer({ ctaHref = '/contact?interest=Monthly%20plan#contact' }) {
  const c = await getContent('foundingOffer', FOUNDING_OFFER_DEFAULT);

  return (
    <aside className="founding" id="founding-offer">
      <div className="founding-text">
        <div className="eyebrow">{c.eyebrow}</div>
        <h3>{c.heading}</h3>
        <p>{c.body}</p>
      </div>
      <a className="founding-link" href={ctaHref}>
        {c.ctaLabel} <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
