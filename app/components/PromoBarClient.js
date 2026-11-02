'use client';

import { usePathname } from 'next/navigation';

export default function PromoBarClient({ message }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/preview')) return null;

  return (
    <a className="promo-bar" href="/offers">
      <span className="promo-bar-text">{message}</span>
      <span className="promo-bar-arrow" aria-hidden="true">→</span>
    </a>
  );
}
