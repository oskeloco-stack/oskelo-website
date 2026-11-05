import { WEBSITE_TIERS } from '../../lib/websites';

// Compact "we build websites too" band for the homepage and /services.
export default function WebsiteTeaser({ headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  return (
    <div className="web-teaser">
      <div>
        <div className="eyebrow">New · Website builds</div>
        <Heading>Need a website, too?</Heading>
        <p>Custom sites for small businesses, built once at a fixed price and ready for your photos and video.</p>
        <a className="btn btn-solid btn-sm" href="/websites">Explore website builds</a>
      </div>
      <div className="web-teaser-tiers">
        {WEBSITE_TIERS.map((tier) => (
          <a href="/websites#website-pricing" key={tier.name}>
            <b>{tier.name}</b>
            <strong>{tier.price}</strong>
            <span>{tier.tag}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
