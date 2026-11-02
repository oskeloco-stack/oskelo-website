import { getContent } from '../../lib/siteContent';
import { FOUNDING_OFFER_DEFAULT } from '../../lib/pageContent';

// A quiet note, not a banner. The words are admin-editable content this
// component fetches for itself. The conditions mirror the Cancellation section
// of the Terms page; change both together, and only with the owner's approval.
// No countdowns or "spots left" unless the count reflects real availability.
export default async function FoundingOffer({ ctaHref = '/contact?interest=Monthly%20plan#contact' }) {
  const c = { ...FOUNDING_OFFER_DEFAULT, ...(await getContent('foundingOffer', FOUNDING_OFFER_DEFAULT)) };

  return (
    <aside className="founding" id="founding-offer">
      <div className="founding-text">
        <div className="eyebrow">{c.eyebrow}</div>
        <h3>{c.heading}</h3>
        <p>{c.body}</p>
        {c.conditions?.length > 0 && (
          <ul className="founding-conditions">
            {c.conditions.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        )}
      </div>
      <div className="founding-actions">
        <a className="founding-link" href={ctaHref}>
          {c.ctaLabel} <span aria-hidden="true">→</span>
        </a>
        <a className="founding-terms" href="/terms">See full terms</a>
      </div>
    </aside>
  );
}
