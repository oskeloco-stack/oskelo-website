'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Kept deliberately short: the two things we do, the proof, and who we are.
// Photography, monthly plans, offers etc. are still reachable from these
// pages and the footer.
const NAV = [
  { href: '/video', label: 'Video' },
  { href: '/websites', label: 'Websites' },
  { href: '/work', label: 'Our work' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  // The header's translucent fade only looks right over the homepage hero
  // photo — anywhere else (or once scrolled past it) it lets page text show
  // through and overlap the nav, so it goes solid as soon as you scroll.
  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e) { if (e.key === 'Escape') setMobileOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const isSolid = !isHome || scrolled;
  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className={isSolid ? 'is-solid' : undefined}>
      <div className="nav">
        <a className="logo" href="/" aria-label="OSKELO home">
          <img className="logo-img" src="/4.webp" alt="Oskelo" />
        </a>
        <nav className="nav-links" aria-label="Main">
          {/* Only shown once you've left the homepage, so there's always an obvious way back. */}
          {!isHome && <a href="/" className="nav-home">Home</a>}
          {NAV.map((item) => (
            <a href={item.href} key={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</a>
          ))}
        </nav>
        <a className="btn btn-solid btn-sm nav-cta" href="/contact">Get in touch</a>
        {!isHome && <a href="/" className="nav-home-mobile">Home</a>}
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-group">
            {!isHome && <a href="/" className="mobile-menu-heading" onClick={closeMobile}>Home</a>}
            {NAV.map((item) => (
              <a href={item.href} key={item.href} className="mobile-menu-heading" onClick={closeMobile}>{item.label}</a>
            ))}
          </div>
          <a className="btn btn-solid btn-sm" href="/contact" onClick={closeMobile}>Get in touch</a>
        </div>
      )}
    </header>
  );
}
