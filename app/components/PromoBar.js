'use client';

import { usePathname } from 'next/navigation';

const MESSAGE =
  'Start any monthly plan this month and keep today’s rate for good — limited to 5 spots';

function Group() {
  // repeated a few times so one group is always wider than the viewport
  return (
    <span className="promo-bar-group" aria-hidden="true">
      <span>{MESSAGE}</span>
      <span>{MESSAGE}</span>
      <span>{MESSAGE}</span>
    </span>
  );
}

export default function PromoBar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <a className="promo-bar" href="/offers" aria-label={MESSAGE}>
      <div className="promo-bar-track">
        <Group />
        <Group />
      </div>
    </a>
  );
}
