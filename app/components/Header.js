'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => { setOpen(false); }, [pathname]);

  // While the mobile menu is open: lock page scroll, Escape closes it and
  // returns focus to the button, Tab stays inside the menu.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('a')?.focus();
    function onKey(e) {
      if (e.key === 'Escape') { setOpen(false); burgerRef.current?.focus(); }
      if (e.key === 'Tab' && menuRef.current) {
        const items = [...menuRef.current.querySelectorAll('a'), burgerRef.current];
        const i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`);

  // The menu panel sits outside <header>: the header's backdrop blur would
  // otherwise become the containing block for the fixed-position panel.
  return (
    <>
    <header className={`s-header${scrolled || open ? ' is-scrolled' : ''}`}>
      <div className="s-header-inner">
        <a className="s-logo" href="/" aria-label="OSKELO home">
          <img src="/brand/oskelo-wordmark.webp" alt="OSKELO" width="640" height="97" />
        </a>
        <nav className="s-nav" aria-label="Main">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</a>
          ))}
        </nav>
        <div className="s-header-cta">
          <a className="s-btn s-btn--outline s-btn--sm" href="/contact">Start a Project</a>
          <button
            ref={burgerRef}
            type="button"
            className="s-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="s-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>

      {open && (
        <div className="s-mobile-menu" id="s-mobile-menu" ref={menuRef}>
          <nav aria-label="Mobile">
            <a className="s-mobile-link" href="/">Home</a>
            {NAV.map((item) => (
              <a key={item.href} className="s-mobile-link" href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</a>
            ))}
          </nav>
          <a className="s-btn s-btn--dark" href="/contact">Start a Project</a>
          <p className="s-mobile-meta">contact@oskelo.com · Lancaster, PA</p>
        </div>
      )}
    </>
  );
}
