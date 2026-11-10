import { getContent } from '../../lib/siteContent';
import { FOOTER_DEFAULT } from '../../lib/pageContent';

// The admin area lives at /admin (sign-in required) and is deliberately not
// linked here, so customers aren't pointed at it.
export default async function Footer() {
  const c = { ...FOOTER_DEFAULT, ...(await getContent('footer', FOOTER_DEFAULT)) };

  return (
    <footer className="s-footer">
      <div className="s-wrap">
        <div className="s-footer-top">
          <div className="s-footer-brand">
            <img src="/brand/oskelo-wordmark.webp" alt="OSKELO" width="640" height="97" loading="lazy" />
            <p>You run your business. We run your content.</p>
          </div>
          <div>
            <h2>Studio</h2>
            <ul>
              <li><a href="/work">Work</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h2>Services</h2>
            <ul>
              <li><a href="/services#monthly">Monthly content</a></li>
              <li><a href="/services#video">Video production</a></li>
              <li><a href="/services#photography">Photography</a></li>
              <li><a href="/websites">Website builds</a></li>
            </ul>
          </div>
          <div>
            <h2>Get in touch</h2>
            <ul>
              <li><a href="mailto:contact@oskelo.com">contact@oskelo.com</a></li>
              <li><span style={{ color: 'rgba(245,242,235,.7)' }}>{c.location}</span></li>
              <li><a href="/contact">Start a project →</a></li>
            </ul>
          </div>
        </div>
        <div className="s-footer-base">
          <span>{c.copyright}</span>
          <a href="/terms">{c.termsLabel}</a>
        </div>
      </div>
    </footer>
  );
}
