// Small shared pieces for the studio design system (app/studio.css).
// Server-safe: no hooks, so both server and client components can use them.

export function Arrow({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
      <path d="M0 0l12 7-12 7z" />
    </svg>
  );
}

export function PinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

// Line icons for the three service pillars. Deliberately plain.
export function ServiceIcon({ name, className }) {
  const common = { className, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true };
  if (name === 'monthly') {
    return (
      <svg {...common}>
        <rect x="4" y="6" width="24" height="22" rx="1.5" />
        <path d="M4 12h24M10 3v6M22 3v6M10 17h2M15 17h2M20 17h2M10 22h2M15 22h2" />
      </svg>
    );
  }
  if (name === 'video') {
    return (
      <svg {...common}>
        <rect x="3" y="8" width="19" height="16" rx="1.5" />
        <path d="M22 13.5l7-4v13l-7-4z" />
      </svg>
    );
  }
  if (name === 'event') {
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="11" />
        <circle cx="16" cy="16" r="3" />
        <path d="M16 5v5M16 22v5M5 16h5M22 16h5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 10.5A1.5 1.5 0 0 1 5.5 9H10l2-3h8l2 3h4.5A1.5 1.5 0 0 1 28 10.5v14A1.5 1.5 0 0 1 26.5 26h-21A1.5 1.5 0 0 1 4 24.5z" />
      <circle cx="16" cy="17" r="5" />
    </svg>
  );
}

export function Eyebrow({ children }) {
  return <p className="s-eyebrow">{children}</p>;
}

// Splits a "$499/mo" or "Starting at $799/mo" price into its parts so cards
// can show the number large without changing the published wording.
export function PriceTag({ price }) {
  const text = String(price || '');
  const from = /^starting at\s*/i.test(text);
  const rest = text.replace(/^starting at\s*/i, '');
  const m = rest.match(/^(\$[\d,]+)(\/mo)?(.*)$/);
  if (!m) return <p className="s-plan-price" style={{ fontSize: 28 }}>{text}</p>;
  return (
    <p className="s-plan-price">
      {from && <span className="s-from">Starting at</span>}
      {m[1]}
      {m[2] && <small>/ month</small>}
      {m[3] && <small>{m[3]}</small>}
    </p>
  );
}

export function contactHref(interest) {
  return interest ? `/contact?interest=${encodeURIComponent(interest)}#contact` : '/contact';
}
