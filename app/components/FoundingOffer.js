import { getContent } from '../../lib/siteContent';
import { FOUNDING_OFFER_DEFAULT } from '../../lib/pageContent';

// `image`/`ctaHref` stay as real props (they're per-page layout choices made by
// whichever page renders this), but the words are admin-editable content this
// component fetches for itself, so every call site gets edits automatically.
export default async function FoundingOffer({ ctaHref = '/services/monthly-plans', image }) {
  const c = await getContent('foundingOffer', FOUNDING_OFFER_DEFAULT);

  return (
    <section className={`section promo${image ? ' promo--image' : ''}`} id="founding-offer">
      {image && (
        <div className="promo-bg" aria-hidden="true">
          <img src={image} alt="" loading="lazy" />
        </div>
      )}
      <div className="wrap">
        <div className="promo-inner">
          <div className="eyebrow">{c.eyebrow}</div>
          <h2>{c.heading}</h2>
          <p>{c.body}</p>
          <a className="btn btn-solid" href={ctaHref}>{c.ctaLabel}</a>
        </div>
      </div>
    </section>
  );
}
