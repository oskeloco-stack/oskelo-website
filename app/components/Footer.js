import { getContent } from '../../lib/siteContent';
import { FOOTER_DEFAULT } from '../../lib/pageContent';

// The admin area lives at /admin (sign-in required) and is deliberately not
// linked here, so customers aren't pointed at it.
export default async function Footer() {
  const c = await getContent('footer', FOOTER_DEFAULT);

  return (
    <footer>
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img className="logo-img" src="/4.webp" alt="OSKELO" width="120" height="24" loading="lazy" />
          <p>You run your business. We run your content.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <a href="/video">Video</a>
          <a href="/services/monthly-plans">Monthly video plans</a>
          <a href="/websites">Websites</a>
          <a href="/work">Our work</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="footer-contact">
          <a href="mailto:contact@oskelo.com">contact@oskelo.com</a>
          <span>{c.location}</span>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>{c.copyright}</span>
        <a href="/terms">{c.termsLabel}</a>
      </div>
    </footer>
  );
}
