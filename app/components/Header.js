'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SERVICES } from '../../lib/services';
import { WORK_CATEGORIES } from '../../lib/work';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header>
      <div className="nav">
        <a className="logo" href="/#top">
          <img className="logo-img" src="/4.png" alt="Oskelo" />
        </a>
        <nav className="nav-links">
          {!isHome && <a href="/">Home</a>}
          <div className="nav-dropdown">
            <a href="/services" className="nav-dropdown-trigger">Services</a>
            <div className="nav-dropdown-menu">
              {SERVICES.map((service) => (
                <a href={`/services/${service.slug}`} key={service.slug}>
                  <b>{service.title}</b>
                  <span>{service.subtitle}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="nav-dropdown">
            <a href="/work" className="nav-dropdown-trigger">Work</a>
            <div className="nav-dropdown-menu">
              {WORK_CATEGORIES.map((category) => (
                <a href={`/work/${category.slug}`} key={category.slug}>
                  <b>{category.title}</b>
                  <span>{category.subtitle}</span>
                </a>
              ))}
            </div>
          </div>
          <a href="/offers">Offers</a>
          <a href="/about">Team</a>
          <a href="/contact">Contact</a>
        </nav>
        <a className="btn btn-solid btn-sm nav-cta" href="/contact">Get a quote</a>
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
            <a href="/" className="mobile-menu-heading" onClick={closeMobile}>Home</a>
          </div>
          <div className="mobile-menu-group">
            <a href="/services" className="mobile-menu-heading" onClick={closeMobile}>Services</a>
            {SERVICES.map((service) => (
              <a href={`/services/${service.slug}`} key={service.slug} className="mobile-submenu-link" onClick={closeMobile}>
                {service.title}
              </a>
            ))}
          </div>
          <div className="mobile-menu-group">
            <a href="/work" className="mobile-menu-heading" onClick={closeMobile}>Work</a>
            {WORK_CATEGORIES.map((category) => (
              <a href={`/work/${category.slug}`} key={category.slug} className="mobile-submenu-link" onClick={closeMobile}>
                {category.title}
              </a>
            ))}
          </div>
          <div className="mobile-menu-group">
            <a href="/offers" className="mobile-menu-heading" onClick={closeMobile}>Offers</a>
            <a href="/about" className="mobile-menu-heading" onClick={closeMobile}>Team</a>
            <a href="/contact" className="mobile-menu-heading" onClick={closeMobile}>Contact</a>
          </div>
          <a className="btn btn-solid btn-sm" href="/contact" onClick={closeMobile}>Get a quote</a>
        </div>
      )}
    </header>
  );
}
